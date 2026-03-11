module Api
  module V1
    class TimeController < ApplicationController
      # POST /api/v1/time/to_utc
      #
      # Body:
      # {
      #   "timezone": "America/New_York",
      #   "date": "2026-03-10",
      #   "time": "15:00" // HH:mm or HH:mm:ss
      # }
      #
      # Response:
      # { "utc": "2026-03-10T19:00:00Z" }
      def to_utc
        tz_name = time_params[:timezone].to_s
        date_str = time_params[:date].to_s
        time_str = time_params[:time].to_s

        tz = ActiveSupport::TimeZone[tz_name]
        return render json: { error: "Invalid timezone" }, status: :unprocessable_content unless tz

        date = Date.iso8601(date_str)
        h, m, s = parse_time_components(time_str)
        return render json: { error: "Invalid time" }, status: :unprocessable_content if h.nil?

        local = tz.local(date.year, date.month, date.day, h, m, s)
        render json: { utc: local.utc.iso8601 }
      rescue ArgumentError
        render json: { error: "Invalid date" }, status: :unprocessable_content
      end

      # POST /api/v1/time/today
      #
      # Body: { "timezone": "America/New_York" }
      # Response: { "date": "2026-03-10" }
      def today
        tz_name = params[:timezone].to_s
        tz = ActiveSupport::TimeZone[tz_name]
        return render json: { error: "Invalid timezone" }, status: :unprocessable_content unless tz

        render json: { date: Time.current.in_time_zone(tz).to_date.iso8601 }
      end

      private

      def time_params
        params.permit(:timezone, :date, :time)
      end

      def parse_time_components(str)
        match = str.strip.match(/\A(\d{1,2}):(\d{2})(?::(\d{2}))?\z/)
        return [nil, nil, nil] unless match
        h = match[1].to_i
        m = match[2].to_i
        s = (match[3] || "0").to_i
        return [nil, nil, nil] if h > 23 || m > 59 || s > 59
        [h, m, s]
      end
    end
  end
end

