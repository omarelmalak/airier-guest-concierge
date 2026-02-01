module Api
  module V1
    class ApplicationController < ::ApplicationController
      before_action :authenticate_user!

      private

      def authenticate_user!
        auth_header = request.headers["Authorization"]
        token = auth_header&.split(" ")&.last

        unless token
          return render_unauthorized
        end

        payload, _ = JWT.decode(token, nil, false)
        @auth_user_id = payload["sub"]
      rescue JWT::DecodeError
        render_unauthorized
      end

      def render_unauthorized
        render json: { error: "Unauthorized" }, status: :unauthorized
      end
    end
  end
end