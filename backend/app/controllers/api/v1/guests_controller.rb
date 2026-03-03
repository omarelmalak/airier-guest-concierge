module Api
  module V1
    class GuestsController < ApplicationController
      # GET /api/v1/guests
      def index
        guests = Guest.all
        render json: {
          status: "success",
          data: guests.map { |guest| format_guest(guest) }
        }, status: :ok
      end

      # GET /api/v1/guests/:id
      def show
        guest = Guest.find_by(id: params[:id])

        if guest
          render json: {
            status: "success",
            data: format_guest(guest)
          }, status: :ok
        else
          render json: {
            status: "error",
            message: "Guest not found"
          }, status: :not_found
        end
      end

      # POST /api/v1/guests
      def create
        guest = Guest.create!(guest_params)
        render json: format_guest(guest)
      end

      # PATCH/PUT /api/v1/guests/:id
      def update
        guest = Guest.find_by(id: params[:id])
        unless guest
          return render json: { status: "error", message: "Guest not found" }, status: :not_found
        end

        update_attrs = {}
        update_attrs[:first_name] = guest_params[:first_name] if guest_params.key?(:first_name)
        update_attrs[:last_name] = guest_params[:last_name] if guest_params.key?(:last_name)
        update_attrs[:phone] = guest_params[:phone] if guest_params.key?(:phone)

        guest.update!(update_attrs) if update_attrs.any?
        render json: format_guest(guest)
      end

      # DELETE /api/v1/guests/:id
      def destroy
        guest = Guest.find_by(id: params[:id])
        unless guest
          return render json: { status: "error", message: "Guest not found" }, status: :not_found
        end

        guest.destroy!
        render json: { message: "Guest deleted successfully" }
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
