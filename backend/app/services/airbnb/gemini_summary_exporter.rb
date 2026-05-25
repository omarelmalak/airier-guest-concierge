# frozen_string_literal: true

require "fileutils"
require "json"

module Airbnb
  class GeminiSummaryExporter
    SUMMARIES_DIR = Rails.root.join("public/gemini-summaries")

    class Error < StandardError; end

    def self.export!(listing, payload)
      room_id = room_id_from(listing)
      FileUtils.mkdir_p(SUMMARIES_DIR)
      path = SUMMARIES_DIR.join("airbnb_#{room_id}.json")
      File.write(path, "#{JSON.pretty_generate(payload)}\n")
      path
    end

    def self.path_for(room_id)
      SUMMARIES_DIR.join("airbnb_#{room_id}.json")
    end

    def self.room_id_from(listing)
      id = listing["id"].to_s.strip
      raise Error, "Listing JSON has no id field; cannot name gemini summary file" if id.blank?

      id
    end
  end
end
