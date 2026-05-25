# frozen_string_literal: true

require "json"

module Airbnb
  class ListingFetcher
    MOCK_ROOM_DATA_DIR = Rails.root.join("public/mock-room-data")

    class Error < StandardError; end
    class UnsupportedListingError < Error; end

    def fetch(link)
      room_id = self.class.extract_room_id(link)
      raise Error, "Invalid Airbnb listing URL" if room_id.blank?

      mock_path = mock_file_path(room_id)
      return load_mock_listing(mock_path) if File.file?(mock_path)

      fetch_from_apify(link, room_id)
    end

    def self.extract_room_id(link)
      link.to_s.strip.match(%r{airbnb\.com/rooms/(\d+)}i)&.[](1)
    end

    def self.available_mock_room_ids
      Dir.glob(MOCK_ROOM_DATA_DIR.join("airbnb_*.json")).filter_map do |path|
        File.basename(path)[%r{\Aairbnb_(\d+)\.json\z}, 1]
      end.sort
    end

    private

    def mock_file_path(room_id)
      MOCK_ROOM_DATA_DIR.join("airbnb_#{room_id}.json")
    end

    def load_mock_listing(path)
      data = JSON.parse(File.read(path))
      listing = data.is_a?(Array) ? data.first : data
      raise Error, "Mock listing file is empty: #{path}" if listing.blank?

      listing
    end

    def fetch_from_apify(_link, room_id)
      if ENV["APIFY_API_TOKEN"].present?
        raise UnsupportedListingError, "Live Airbnb import is not implemented yet (room #{room_id})"
      end

      stubs = self.class.available_mock_room_ids
      hint = if stubs.any?
               " Mock listings available for room IDs: #{stubs.join(', ')}."
             else
               ""
             end
      raise UnsupportedListingError,
            "No mock data for room #{room_id}. Add public/mock-room-data/airbnb_#{room_id}.json#{hint}"
    end
  end
end
