# frozen_string_literal: true

module Airbnb
  class ListingLlmExtractor
    class Error < StandardError; end

    def extract(listing)
      ensure_recommendation_catalog!
      raw = GeminiJsonGenerator.generate(
        system_instruction: ListingImportPrompt.system_instruction,
        user_content: ListingImportPrompt.user_content(listing)
      )
      GeminiSummaryExporter.export!(listing, raw)
      ImportPayload.normalize(raw, listing: listing)
    rescue GeminiJsonGenerator::Error, ImportPayload::Error => e
      raise Error, e.message
    end

    def ensure_recommendation_catalog!
      ImportConstants.ensure_recommendation_features_in_db!
    end
  end
end
