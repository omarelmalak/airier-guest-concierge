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
        guest = Guest.new(guest_params)
        
        if guest.save
          render json: {
            status: 'success',
            data: format_guest(guest)
          }, status: :created
        else
          render json: {
            status: 'error',
            message: guest.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      private

      def guest_params
        params.require(:guest).permit(:name, :email, :phone)
      end

      def format_guest(guest)
        {
          id: guest.id,
          name: guest.name,
          email: guest.email,
          phone: guest.phone,
          created_at: guest.created_at,
          updated_at: guest.updated_at
        }
      end
    end
  end
end
