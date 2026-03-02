module Api
  module V1
    class ReservationsController < ApplicationController
      # GET /api/v1/properties/:property_id/reservations
      def index
        host = Host.find_by!(auth_user_id: @auth_user_id)
        property = Property.where(host_id: host.id).find_by!(id: params[:property_id])

        reservations = Reservation.where(property_id: property.id).includes(:guest).order(:created_at)
        render json: reservations.map { |r| format_reservation_with_guest(r) }
      end

      # POST /api/v1/properties/:property_id/reservations (CREATE RESERVATION)
      def create
        host = Host.find_by!(auth_user_id: @auth_user_id)

        property = Property.where(host_id: host.id).find_by!(id: params[:property_id])
        guest = Guest.find_by!(id: reservation_params[:guest_id])

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

        render json: format_reservation(reservation)
      end

      # PATCH/PUT /api/v1/properties/:property_id/reservations/:id
      def update
        host = Host.find_by!(auth_user_id: @auth_user_id)
        property = Property.where(host_id: host.id).find_by!(id: params[:property_id])

        reservation = Reservation.where(property_id: property.id).find_by!(id: params[:id])
        raise ActiveRecord::RecordNotFound unless reservation

        update_attrs = {}
        if reservation_params[:check_in].present?
          update_attrs[:check_in] = Date.parse(reservation_params[:check_in])
        end
        if reservation_params[:check_out].present?
          update_attrs[:check_out] = Date.parse(reservation_params[:check_out])
        end
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
        params.require(:reservation).permit(:guest_id, :check_in, :check_out, :is_active)
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

      def format_reservation_with_guest(reservation)
        {
          id: reservation.id,
          propertyId: reservation.property_id,
          checkIn: reservation.check_in,
          checkOut: reservation.check_out,
          isActive: reservation.is_active,
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
