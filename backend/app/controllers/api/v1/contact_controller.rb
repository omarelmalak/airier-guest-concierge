# frozen_string_literal: true

module Api
  module V1
    class ContactController < ApplicationController
      skip_before_action :authenticate_user!, only: [:create]

      # POST /api/v1/contact
      def create
        email = params[:email].to_s.strip
        subject = params[:subject].to_s.strip
        body = params[:content].to_s.strip.presence || params[:body].to_s.strip

        if email.blank?
          return render json: { error: "Email is required" }, status: :unprocessable_entity
        end
        if subject.blank?
          return render json: { error: "Subject is required" }, status: :unprocessable_entity
        end
        if body.blank?
          return render json: { error: "Message is required" }, status: :unprocessable_entity
        end

        ContactMailer.contact_message(
          sender_email: email,
          subject: subject,
          body: body
        ).deliver_now

        render json: { success: true }, status: :ok
      rescue StandardError => e
        Rails.logger.error("Contact form failed: #{e.message}")
        render json: { error: "Failed to send message. Please try again." }, status: :internal_server_error
      end
    end
  end
end
