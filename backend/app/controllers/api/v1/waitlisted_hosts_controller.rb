# frozen_string_literal: true

module Api
  module V1
    class WaitlistedHostsController < ApplicationController
      skip_before_action :authenticate_user!, only: [:create]

      # POST /api/v1/waitlisted_hosts
      def create
        email = params[:email].to_s.strip

        if email.blank?
          return render json: { error: "Email is required" }, status: :unprocessable_entity
        end

        WaitlistedHost.create!(email: email)
        render json: { success: true }, status: :created
      rescue ActiveRecord::RecordInvalid => e
        render json: { error: e.record.errors.full_messages.join(", ") }, status: :unprocessable_entity
      rescue StandardError => e
        Rails.logger.error("Waitlisted host signup failed: #{e.message}")
        render json: { error: "Something went wrong. Please try again." }, status: :internal_server_error
      end
    end
  end
end
