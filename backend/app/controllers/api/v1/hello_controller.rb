module Api
  module V1
    class HelloController < ApplicationController
      # GET /api/v1/hello
      def index
        render json: {
          status: 'success',
          message: 'Hello from Airier Guest Concierge API!',
          timestamp: Time.current.iso8601,
          version: '1.0.0'
        }, status: :ok
      end
    end
  end
end
