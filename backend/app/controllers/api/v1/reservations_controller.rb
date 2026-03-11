module Api
  module V1
    class ReservationsController < ApplicationController
      # GET /api/v1/properties/:property_id/reservations
      def index
        host = Host.find_by!(auth_user_id: @auth_user_id)
        property = Property.where(host_id: host.id).find_by!(id: params[:property_id])

        reservations = Reservation.where(property_id: property.id).includes(:guest).order(:created_at)
        render json: reservations.map { |r| format_reservation_with_guest(r, property) }
      end

      # POST /api/v1/properties/:property_id/reservations (CREATE RESERVATION)
      def create
        host = Host.find_by!(auth_user_id: @auth_user_id)

        property = Property.where(host_id: host.id).find_by!(id: params[:property_id])
        guest = Guest.find_by!(id: reservation_params[:guest_id])

        reservation = nil

        Reservation.transaction do
          attrs = {
            property: property,
            guest: guest,
            check_in: Date.parse(reservation_params[:check_in]),
            check_out: Date.parse(reservation_params[:check_out])
          }
          # Default to false when is_active is not provided
          if reservation_params.key?(:is_active)
            attrs[:is_active] = ActiveModel::Type::Boolean.new.cast(reservation_params[:is_active])
          else
            attrs[:is_active] = false
          end

          reservation = Reservation.create!(attrs)
          schedule_auto_messages_for_reservation!(reservation, property)
        end

        render json: format_reservation(reservation)
      end

      # PATCH/PUT /api/v1/properties/:property_id/reservations/:id
      def update
        host = Host.find_by!(auth_user_id: @auth_user_id)
        property = Property.where(host_id: host.id).find_by!(id: params[:property_id])

        reservation = Reservation.where(property_id: property.id).find_by!(id: params[:id])
        raise ActiveRecord::RecordNotFound unless reservation

        update_attrs = {}
        if reservation_params.key?(:is_active)
          update_attrs[:is_active] = ActiveModel::Type::Boolean.new.cast(reservation_params[:is_active])
        end

        reservation.update!(update_attrs) if update_attrs.any?

        render json: format_reservation(reservation)
      end

      # DELETE /api/v1/properties/:property_id/reservations/:id
      def destroy
        host = Host.find_by!(auth_user_id: @auth_user_id)
        property = Property.where(host_id: host.id).find_by!(id: params[:property_id])

        reservation = Reservation.where(property_id: property.id).find_by!(id: params[:id])
        raise ActiveRecord::RecordNotFound unless reservation

        reservation.destroy!
        render json: { message: "Reservation deleted successfully" }
      end

      private

      def reservation_params
        params.require(:reservation).permit(:guest_id, :is_active)
      end

      def schedule_auto_messages_for_reservation!(reservation, property)
        timezone_name = property.respond_to?(:timezone) ? property.timezone : nil
        return unless timezone_name.present?

        tz = ActiveSupport::TimeZone[timezone_name]
        return unless tz

        # Check-in auto message (create if missing)
        if property.checkin_time.present? && !reservation.auto_messages.exists?(kind: "checkin")
          checkin_local = tz.local(
            reservation.check_in.year,
            reservation.check_in.month,
            reservation.check_in.day,
            property.checkin_time.hour,
            property.checkin_time.min,
            property.checkin_time.sec
          )

          checkin_utc = checkin_local.utc
          reminder_hours = property.checkin_reminder_hours || 0
          send_at_checkin = checkin_utc - reminder_hours.hours

          AutoMessage.create!(
            reservation: reservation,
            kind: "checkin",
            send_at: send_at_checkin
          )
        end

        # Check-out auto message (create if missing)
        if property.checkout_time.present? && !reservation.auto_messages.exists?(kind: "checkout")
          checkout_local = tz.local(
            reservation.check_out.year,
            reservation.check_out.month,
            reservation.check_out.day,
            property.checkout_time.hour,
            property.checkout_time.min,
            property.checkout_time.sec
          )

          checkout_utc = checkout_local.utc
          reminder_hours = property.checkout_reminder_hours || 0
          send_at_checkout = checkout_utc - reminder_hours.hours

          AutoMessage.create!(
            reservation: reservation,
            kind: "checkout",
            send_at: send_at_checkout
          )
        end
      end

      def format_reservation(reservation)
        {
          id: reservation.id,
          property_id: reservation.property_id,
          guest_id: reservation.guest_id,
          check_in: reservation.check_in,
          check_out: reservation.check_out,
          is_active: reservation.is_active
        }
      end

      def format_reservation_with_guest(reservation, property)
        timezone_name = property.respond_to?(:timezone) ? property.timezone : nil
        tz = timezone_name.present? ? ActiveSupport::TimeZone[timezone_name] : nil

        check_in_at_utc =
          if tz && property.checkin_time.present?
            tz.local(
              reservation.check_in.year,
              reservation.check_in.month,
              reservation.check_in.day,
              property.checkin_time.hour,
              property.checkin_time.min,
              property.checkin_time.sec
            ).utc.iso8601
          end

        check_out_at_utc =
          if tz && property.checkout_time.present?
            tz.local(
              reservation.check_out.year,
              reservation.check_out.month,
              reservation.check_out.day,
              property.checkout_time.hour,
              property.checkout_time.min,
              property.checkout_time.sec
            ).utc.iso8601
          end

        {
          id: reservation.id,
          propertyId: reservation.property_id,
          checkIn: reservation.check_in,
          checkOut: reservation.check_out,
          isActive: reservation.is_active,
          createdAt: reservation.created_at&.iso8601,
          checkInAtUtc: check_in_at_utc,
          checkOutAtUtc: check_out_at_utc,
          guest: {
            id: reservation.guest.id,
            firstName: reservation.guest.first_name,
            lastName: reservation.guest.last_name,
            phone: reservation.guest.phone,
            startDate: reservation.check_in,
            endDate: reservation.check_out
          }
        }
      end
    end
  end
end
