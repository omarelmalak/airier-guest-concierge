module Api
  module V1
    class FeaturesController < ApplicationController
      # POST /api/v1/features (CREATE FEATURE)
      def create
        feature = Feature.find_or_create_by!(
          name: post_feature_params[:name]
        )

        render json: format_post_feature_response(feature)
      end

      private

      def post_feature_params
        params.require(:feature).permit(:name)
      end

      def format_post_feature_response(feature)
        { id: feature.id, name: feature.name }
      end
    end
  end
end