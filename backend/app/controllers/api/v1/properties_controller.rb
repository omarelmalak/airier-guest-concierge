module Api
  module V1
    class PropertiesController < ApplicationController

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
                    is_in_progress =
                        if tz && property.checkin_time.present? && property.checkout_time.present?
                            check_in_at_utc = tz.local(
                                r.check_in.year,
                                r.check_in.month,
                                r.check_in.day,
                                property.checkin_time.hour,
                                property.checkin_time.min,
                                property.checkin_time.sec
                            ).utc

                            check_out_at_utc = tz.local(
                                r.check_out.year,
                                r.check_out.month,
                                r.check_out.day,
                                property.checkout_time.hour,
                                property.checkout_time.min,
                                property.checkout_time.sec
                            ).utc

                            now_utc >= check_in_at_utc && now_utc < check_out_at_utc
                        else
                            Date.current >= r.check_in && Date.current < r.check_out
                        end

                    next unless is_in_progress

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
                            warning_messages << "Your current guest(s), #{guest_names.join(', ')}, will not receive the changes as the check-in message has already been sent."
                        end
                    end
                    if checkout_changed
                        guest_names = guests_with_already_sent_message_for_property(property, "checkout")
                        if guest_names.any?
                            warning_messages << "Your current guest(s), #{guest_names.join(', ')}, will not receive the changes as the check-out message has already been sent."
                        end
                    end

                    # Keep auto_messages in sync when check-in/check-out config changes (only unsent ones).
                    if property.saved_change_to_checkin_time? ||
                       property.saved_change_to_checkin_reminder_hours? ||
                       property.saved_change_to_checkin_msg? ||
                       property.saved_change_to_checkout_time? ||
                       property.saved_change_to_checkout_reminder_hours? ||
                       property.saved_change_to_checkout_msg? ||
                       property.saved_change_to_timezone?
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
            # for this property and the given kind (checkin/checkout), for current/future reservations.
            def guests_with_already_sent_message_for_property(property, kind)
                AutoMessage
                    .joins(reservation: :guest)
                    .where(reservations: { property_id: property.id })
                    .where(kind: kind)
                    .where.not(text_id: nil)
                    .where("reservations.check_in >= ?", Date.current)
                    .map { |am| [am.reservation.guest.first_name, am.reservation.guest.last_name].compact.join(" ").strip }
                    .uniq
            end

            def reschedule_auto_messages_for_property!(property)
                # Only touch current/future reservations.
                reservations = Reservation.where(property_id: property.id)
                                          .where("check_in >= ?", Date.current)

                reservations.find_each do |reservation|
                    # Only remove unsent auto_messages so we don't lose records of already-sent messages.
                    reservation.auto_messages.where(text_id: nil).destroy_all

                    Api::V1::ReservationsController.new.send(
                        :schedule_auto_messages_for_reservation!,
                        reservation,
                        property
                    )
                end
            end

    end
  end
end