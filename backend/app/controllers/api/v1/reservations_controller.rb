module Api
    module V1
      class ReservationsController < ApplicationController

        # POST /api/v1/reservations (CREATE RESERVATION)
        def create
            host = Host.find_by!(auth_user_id: @auth_user_id)

            property = Property.where(host_id: host.id).find_by!(id: post_reservation_params[:property_id])

            guest = Guest.find_by!(id: post_reservation_params[:guest_id])

            reservation = Reservation.create!(
                property: property,
                guest: guest,
                check_in: Date.parse(post_reservation_params[:check_in]),
                check_out: Date.parse(post_reservation_params[:check_out])
            )

            render json: format_create_reservation_response(reservation)
        end

        private

        def post_reservation_params
            params.require(:reservation).permit(:property_id, :guest_id, :check_in, :check_out)
        end

        def format_create_reservation_response(reservation)
            { id: reservation.id, property_id: reservation.property_id, guest_id: reservation.guest_id, check_in: reservation.check_in, check_out: reservation.check_out }
        end
    end
  end
end

    