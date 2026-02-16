module Api
  module V1
    class GuestsController < ApplicationController
      # GET /api/v1/guests
      def index
        guests = Guest.all
        render json: {
          status: 'success',
          data: guests.map { |guest| format_guest(guest) }
        }, status: :ok
      end

      # GET /api/v1/guests/:id
      def show
        guest = Guest.find_by(id: params[:id])
        
        if guest
          render json: {
            status: 'success',
            data: format_guest(guest)
          }, status: :ok
        else
          render json: {
            status: 'error',
            message: 'Guest not found'
          }, status: :not_found
        end
      end

      # POST /api/v1/guests
      def create
        host = Host.find_by!(auth_user_id: @auth_user_id)

        guest = Guest.create!(guest_params)
        
        render json: format_guest(guest)
      end

      private

      def guest_params
        params.require(:guest).permit(:first_name, :last_name, :phone)
      end

      def format_guest(guest)
        {
          id: guest.id,
          first_name: guest.first_name,
          last_name: guest.last_name,
          phone: guest.phone,
        }
      end
    end
  end
end
