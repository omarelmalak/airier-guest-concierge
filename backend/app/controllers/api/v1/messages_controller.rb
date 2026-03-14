# frozen_string_literal: true
require "net/http"
require "uri"
require "json"

module Api
  module V1
    class MessagesController < ApplicationController
      skip_before_action :authenticate_user!, only: :create

      # POST /api/v1/messages/
      # Body: { "to": "+15551234567", "body": "Hello" }
      def create
        to = params[:to].to_s.strip
        body = params[:body].to_s.strip

        if to.blank?
          return render json: { error: "to is required" }, status: :unprocessable_entity
        end
        if body.blank?
          return render json: { error: "body is required" }, status: :unprocessable_entity
        end

        worker_url = ENV.fetch("WORKER_API_URL", "http://localhost:5000").chomp("/")
        uri = URI("#{worker_url}/worker/v1/tasks/send_sms")
        http = Net::HTTP.new(uri.host, uri.port)
        http.use_ssl = (uri.scheme == "https")
        request = Net::HTTP::Post.new(uri)
        request["Content-Type"] = "application/json"
        request.body = { to: to, body: body }.to_json

        Rails.logger.info("Sending SMS to #{to} with body #{body}")
        Rails.logger.info("Worker URL: #{worker_url}")
        Rails.logger.info("Request: #{request.body}")

        response = http.request(request)

        case response.code.to_i
        when 202
          render json: { status: "accepted" }, status: :accepted
        else
          render json: { error: "worker unavailable" }, status: :bad_gateway
        end
      rescue StandardError => e
        Rails.logger.error("Messages#sms: #{e.message}")
        render json: { error: "worker unavailable" }, status: :bad_gateway
      end
    end
  end
end
