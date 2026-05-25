module Api
  module V1
    class PropertiesController < ApplicationController

            # POST /api/v1/properties/import (IMPORT FROM AIRBNB LINK)
            def import
                host = Host.find_by!(auth_user_id: @auth_user_id)
                link = params.require(:link).to_s.strip

                property = Airbnb::PropertyImporter.new(host: host).import_from_link!(link)
                render json: post_format_property(property), status: :created
            rescue Airbnb::ListingFetcher::UnsupportedListingError, Airbnb::PropertyImporter::Error => e
                render json: { error: e.message }, status: :unprocessable_entity
            end

            # POST /api/v1/properties (CREATE PROPERTY)
            def create
                host = Host.find_by!(auth_user_id: @auth_user_id)

                property = Property.create!(
                    create_property_params.merge(host_id: host.id)
                )

                render json: post_format_property(property)
            end

            # GET /api/v1/properties (GET ALL PROPERTIES)
            def index
                host = Host.find_by!(auth_user_id: @auth_user_id)
                properties = Property.where(host_id: host.id)
                property_ids = properties.pluck(:id)

                # Count AI-active guests per property (is_active = true), independent of dates.
                active_ai_guests_by_property = Reservation
                    .where(property_id: property_ids, is_active: true)
                    .group(:property_id).count

                subscription_ends_by_property = Subscription
                    .where(property_id: property_ids)
                    .where(cancelled_at: nil)
                    .pluck(:property_id, :current_period_end)
                    .to_h

                render json: properties.map { |property| get_format_property(property, active_ai_guests_by_property, subscription_ends_by_property) }
            end

            # GET /api/v1/properties/:id (GET PROPERTY DETAILS)
            def show
                host = Host.find_by!(auth_user_id: @auth_user_id)
                property = Property.find_by!(id: params[:id], host_id: host.id)

                # How many guests currently have AI access enabled for this property
                ai_active_count = Reservation.where(property_id: property.id, is_active: true).count

                # Guests currently staying (mirror GuestsTab "in-progress" logic).
                tz_name = property.respond_to?(:timezone) ? property.timezone : nil
                tz = tz_name.present? ? ActiveSupport::TimeZone[tz_name] : nil
                now_utc = Time.current.utc

                reservations = Reservation.where(property_id: property.id).includes(:guest)
                current_guests = reservations.filter_map do |r|
                    next unless in_progress_for_property?(r, property, tz, now_utc)

                    {
                        id: r.guest.id,
                        first_name: r.guest.first_name,
                        last_name: r.guest.last_name
                    }
                end

                subscription_end = Subscription.where(property_id: property.id).where(cancelled_at: nil).pick(:current_period_end)
                render json: detail_format_property(property, ai_active_count, subscription_end, current_guests)
            end

            # PATCH /api/v1/properties/:id (UPDATE PROPERTY)
            def update
                host = Host.find_by!(auth_user_id: @auth_user_id)
                property = Property.find_by!(id: params[:id], host_id: host.id)

                warning_messages = []

                Property.transaction do
                    # Intentionally disallow changing the address after creation.
                    # Hosts should create a new property if the address changes.
                    property.update!(update_property_params)

                    checkin_changed = property.saved_change_to_checkin_time? ||
                                     property.saved_change_to_checkin_reminder_hours? ||
                                     property.saved_change_to_checkin_msg?
                    checkout_changed = property.saved_change_to_checkout_time? ||
                                      property.saved_change_to_checkout_reminder_hours? ||
                                      property.saved_change_to_checkout_msg?

                    # Find guests whose check-in/check-out message was already sent (text_id present).
                    if checkin_changed
                        guest_names = guests_with_already_sent_message_for_property(property, "checkin")
                        if guest_names.any?
                            warning_messages << "Your current guest(s) (#{guest_names.join(', ')}), will not receive the changes as the check-in message has already been sent."
                        end
                    end
                    if checkout_changed
                        guest_names = guests_with_already_sent_message_for_property(property, "checkout")
                        if guest_names.any?
                            warning_messages << "Your current guest(s) (#{guest_names.join(', ')}), will not receive the changes as the check-out message has already been sent."
                        end
                    end

                    # Keep auto_messages in sync when check-in/check-out config changes (only unsent ones).
                    puts "checking if we need to reschedule auto messages for property #{property.id}"

                    if property.saved_change_to_checkin_time? ||
                       property.saved_change_to_checkin_reminder_hours? ||
                       property.saved_change_to_checkin_msg? ||
                       property.saved_change_to_checkout_time? ||
                       property.saved_change_to_checkout_reminder_hours? ||
                       property.saved_change_to_checkout_msg? ||
                       property.saved_change_to_timezone?
                      puts "rescheduling auto messages for property #{property.id}"
                      reschedule_auto_messages_for_property!(property)
                    end
                end

                response = post_format_property(property)
                response[:warning] = warning_messages.join(" ") if warning_messages.any?
                render json: response
            end

            private

            def create_property_params
                params.require(:property).permit(
                    :name,
                    :property_type,
                    :bedrooms,
                    :bathrooms,
                    :address,
                    :photo,
                    :ownership_level,
                    :checkin_msg,
                    :checkout_msg,
                    :checkin_time,
                    :checkout_time,
                    :checkin_reminder_hours,
                    :checkout_reminder_hours,
                    :timezone
                  )
            end

            def update_property_params
                params.require(:property).permit(
                    :name,
                    :property_type,
                    :bedrooms,
                    :bathrooms,
                    :photo,
                    :ownership_level,
                    :checkin_msg,
                    :checkout_msg,
                    :checkin_time,
                    :checkout_time,
                    :checkin_reminder_hours,
                    :checkout_reminder_hours,
                    :timezone
                  )
            end
            
            def post_format_property(property)
                { id: property.id,
                  host_id: property.host_id,
                  name: property.name,
                  property_type: property.property_type,
                  bedrooms: property.bedrooms,
                  bathrooms: property.bathrooms,
                  address: property.address,
                  photo: property.photo,
                  ownership_level: property.ownership_level,
                  checkin_msg: property.checkin_msg,
                  checkout_msg: property.checkout_msg,
                  checkin_time: format_time_for_api(property.checkin_time),
                  checkout_time: format_time_for_api(property.checkout_time),
                  checkin_reminder_hours: property.checkin_reminder_hours,
                  checkout_reminder_hours: property.checkout_reminder_hours,
                  timezone: property.timezone
                }
            end

            # Normalize time to "HH:mm" so clients get a consistent format (no ISO date wrapper).
            def format_time_for_api(value)
                return nil if value.blank?
                return value if value.is_a?(String) && value.match?(/\A\d{1,2}:\d{2}(:\d{2})?\z/)
                t = value.is_a?(String) ? Time.zone.parse(value) : value
                t&.strftime("%H:%M")
            end

            def get_format_property(property, active_ai_guests_by_property, subscription_ends_by_property)
                {
                    id: property.id,
                    name: property.name,
                    address: property.address,
                    photo: property.photo,
                    active_guests_count: active_ai_guests_by_property[property.id] || 0,
                    subscription_expires_at: subscription_ends_by_property[property.id]&.iso8601,
                    escalations_count: 0,
                    ai_status: 'active',
                    timezone: property.timezone
                }
            end

            def detail_format_property(property, ai_active_count, subscription_expires_at, current_guests)
                post_format_property(property).merge(
                    active_guests_count: ai_active_count || 0,
                    subscription_expires_at: subscription_expires_at&.iso8601,
                    current_guests: current_guests
                )
            end

            # Returns guest full names for auto_messages that were already sent (text_id present)
            # for this property and the given kind (checkin/checkout), but ONLY if the guest is
            # currently staying (mirrors the in-progress logic: now between check-in/out with
            # property timezone + times).
            def guests_with_already_sent_message_for_property(property, kind)
                tz_name = property.respond_to?(:timezone) ? property.timezone : nil
                tz = tz_name.present? ? ActiveSupport::TimeZone[tz_name] : nil
                now_utc = Time.current.utc

                AutoMessage
                    .joins(reservation: :guest)
                    .where(reservations: { property_id: property.id })
                    .where(kind: kind)
                    .where.not(text_id: nil)
                    .includes(:reservation, :reservation => :guest)
                    .select { |am| am.reservation && in_progress_for_property?(am.reservation, property, tz, now_utc) }
                    .map { |am| [am.reservation.guest.first_name, am.reservation.guest.last_name].compact.join(" ").strip }
                    .uniq
            end

            def reschedule_auto_messages_for_property!(property)
                # Only touch reservations that still have at least one unsent auto_message (text_id is NULL).
                reservations = Reservation
                               .joins(:auto_messages)
                               .where(property_id: property.id)
                               .where(auto_messages: { text_id: nil })
                               .distinct

                tz_name = property.respond_to?(:timezone) ? property.timezone : nil
                tz = tz_name.present? ? ActiveSupport::TimeZone[tz_name] : nil
                return unless tz

                reservations.find_each do |reservation|
                    update_unsent_auto_message_for_reservation!(reservation, property, tz, "checkin")
                    update_unsent_auto_message_for_reservation!(reservation, property, tz, "checkout")
                end
            end

            def in_progress_for_property?(reservation, property, tz = nil, now_utc = nil)
                tz ||= (property.respond_to?(:timezone) ? ActiveSupport::TimeZone[property.timezone] : nil)
                now_utc ||= Time.current.utc
                reservation.status_for_property(property, tz: tz, now_utc: now_utc) == "in-progress"
            end

            def update_unsent_auto_message_for_reservation!(reservation, property, tz, kind)
                time_value =
                    if kind == "checkin"
                        property.checkin_time
                    else
                        property.checkout_time
                    end
                return unless time_value.present?

                date_value = kind == "checkin" ? reservation.check_in : reservation.check_out

                local = tz.local(
                    date_value.year,
                    date_value.month,
                    date_value.day,
                    time_value.hour,
                    time_value.min,
                    time_value.sec
                )

                reminder_hours =
                    if kind == "checkin"
                        property.checkin_reminder_hours || 0
                    else
                        property.checkout_reminder_hours || 0
                    end

                send_at = local.utc - reminder_hours.hours

                # If the message already got sent (text_id present), don't change it.
                if reservation.auto_messages.exists?(kind: kind) && !reservation.auto_messages.exists?(kind: kind, text_id: nil)
                    return
                end

                unsent = reservation.auto_messages.find_by(kind: kind, text_id: nil)
                if unsent
                    unsent.update!(send_at: send_at)
                else
                    AutoMessage.create!(reservation: reservation, kind: kind, send_at: send_at)
                end
            end

    end
  end
end