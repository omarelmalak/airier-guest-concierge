class Reservation < ApplicationRecord
  belongs_to :property
  belongs_to :guest
  has_many :auto_messages, dependent: :destroy

  # Returns "upcoming", "in-progress", or "past" for this reservation with
  # respect to the given property, using the property's timezone and
  # check-in/check-out times when present.
  def status_for_property(property, tz: nil, now_utc: nil)
    tz ||= (property.respond_to?(:timezone) ? ActiveSupport::TimeZone[property.timezone] : nil)
    now_utc ||= Time.current.utc

    if tz && property.checkin_time.present? && property.checkout_time.present?
      check_in_at_utc = tz.local(
        check_in.year,
        check_in.month,
        check_in.day,
        property.checkin_time.hour,
        property.checkin_time.min,
        property.checkin_time.sec
      ).utc

      check_out_at_utc = tz.local(
        check_out.year,
        check_out.month,
        check_out.day,
        property.checkout_time.hour,
        property.checkout_time.min,
        property.checkout_time.sec
      ).utc

      if now_utc >= check_out_at_utc
        "past"
      elsif now_utc < check_in_at_utc
        "upcoming"
      else
        "in-progress"
      end
    else
      if Date.current > check_out
        "past"
      elsif Date.current < check_in
        "upcoming"
      else
        "in-progress"
      end
    end
  end
end
