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

                # Guests currently residing at the property based on today's date
                current_guests = Reservation
                    .where(property_id: property.id)
                    .where('? BETWEEN check_in AND check_out', Date.current)
                    .includes(:guest)
                    .map do |r|
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

                # Intentionally disallow changing the address after creation.
                # Hosts should create a new property if the address changes.
                property.update!(update_property_params)

                render json: post_format_property(property)
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

    end
  end
end