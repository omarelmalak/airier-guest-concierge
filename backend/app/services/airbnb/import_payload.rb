# frozen_string_literal: true

module Airbnb
  class ImportPayload
    class Error < StandardError; end

    def self.normalize(raw, listing:)
      data = deep_stringify_keys(raw)
      kcf_rows = normalize_kcf_rows(data["knowledge_category_features"])
      pkc_rows = normalize_pkcs(data["property_knowledge_categories"])
      property = normalize_property(data["property"] || {}, listing: listing)

      new(property: property, knowledge_category_features: kcf_rows, property_knowledge_categories: pkc_rows)
    end

    def initialize(property:, knowledge_category_features:, property_knowledge_categories:)
      @property = property
      @knowledge_category_features = knowledge_category_features
      @property_knowledge_categories = property_knowledge_categories
    end

    attr_reader :property, :knowledge_category_features, :property_knowledge_categories

    private

    def self.normalize_property(hash, listing:)
      name = hash["name"].to_s.strip
      raise Error, "property.name is required" if name.blank?

      coords = listing["coordinates"] || {}
      timezone = hash["timezone"].presence || infer_timezone(coords["latitude"], coords["longitude"])
      photo = hash["photo"].presence || listing.dig("images", 0, "imageUrl")

      property_type = normalize_property_type(hash["property_type"], listing: listing)
      ownership_level = normalize_ownership_level(hash["ownership_level"], listing: listing)

      raise Error, "property.property_type is required (allowed: #{ImportConstants::PROPERTY_TYPES.join(', ')})" if property_type.blank?
      raise Error, "property.ownership_level is required (allowed: #{ImportConstants::OWNERSHIP_LEVELS.join(', ')})" if ownership_level.blank?

      {
        name: name,
        property_type: property_type,
        ownership_level: ownership_level,
        bedrooms: parse_int(hash["bedrooms"]),
        bathrooms: parse_int(hash["bathrooms"]),
        address: hash["address"].presence,
        photo: photo,
        checkin_time: normalize_time(hash["checkin_time"]),
        checkout_time: normalize_time(hash["checkout_time"]),
        timezone: timezone
      }.compact
    end

    def self.normalize_property_type(value, listing:)
      pick_allowlist(value, ImportConstants::PROPERTY_TYPES) ||
        infer_property_type_from_listing(listing)
    end

    def self.normalize_ownership_level(value, listing:)
      pick_allowlist(value, ImportConstants::OWNERSHIP_LEVELS) ||
        infer_ownership_level_from_listing(listing)
    end

    def self.pick_allowlist(value, allowed)
      text = value.to_s.strip
      return nil if text.blank?

      allowed.find { |option| option.casecmp?(text) }
    end

    def self.infer_property_type_from_listing(listing)
      sources = [
        listing["propertyType"],
        listing["sharingConfigTitle"],
        listing["roomType"],
        listing["seoTitle"]
      ].compact.map(&:to_s).join(" ").downcase

      return "Villa" if sources.include?("villa")
      return "Cabin" if sources.include?("cabin")
      return "Condo" if sources.include?("condo")
      return "Studio" if sources.include?("studio")
      return "Loft" if sources.include?("loft")
      return "Townhouse" if sources.include?("townhouse")
      return "House" if sources.match?(/\bhouse\b|\bhome\b|\btownhome\b/)
      return "Apartment" if sources.match?(/hotel|apartment|rental unit|room in|flat\b/)

      "Apartment"
    end

    def self.infer_ownership_level_from_listing(listing)
      room_type = listing["roomType"].to_s.strip
      pick_allowlist(room_type, ImportConstants::OWNERSHIP_LEVELS) || begin
        combined = [listing["propertyType"], listing["roomType"], listing["sharingConfigTitle"]].compact.join(" ").downcase
        return "Entire place" if combined.include?("entire")
        return "Shared room" if combined.include?("shared room")
        return "Private room" if combined.include?("private room")

        "Entire place"
      end
    end

    def self.normalize_kcf_rows(rows)
      Array(rows).filter_map do |row|
        feature_id = row["feature_id"].to_s.strip
        category_id = row["knowledge_category_id"].to_s.strip
        description = row["description"].to_s.strip

        next if description.blank?
        validate_feature!(feature_id, category_id)

        {
          feature_id: feature_id,
          knowledge_category_id: category_id,
          description: description
        }
      end.uniq { |r| [r[:feature_id], r[:knowledge_category_id]] }
    end

    def self.normalize_pkcs(rows)
      Array(rows).filter_map do |row|
        category_id = row["knowledge_category_id"].to_s.strip
        description = row["description"].to_s.strip

        next if description.blank?
        validate_category!(category_id)

        { knowledge_category_id: category_id, description: description }
      end.uniq { |r| r[:knowledge_category_id] }
    end

    def self.validate_feature!(feature_id, category_id)
      raise Error, "Unknown feature_id: #{feature_id}" unless ImportConstants.feature_ids.include?(feature_id)
      raise Error, "Unknown knowledge_category_id: #{category_id}" unless ImportConstants::CATEGORY_IDS.include?(category_id)

      feature = ImportConstants.all_features.find { |f| f[:id] == feature_id }
      unless feature[:category_id] == category_id
        raise Error, "feature_id #{feature_id} does not belong to knowledge_category_id #{category_id}"
      end
    end

    def self.validate_category!(category_id)
      raise Error, "Unknown knowledge_category_id: #{category_id}" unless ImportConstants::CATEGORY_IDS.include?(category_id)
    end

    def self.parse_int(value)
      return nil if value.nil? || value == ""

      Integer(value)
    rescue ArgumentError, TypeError
      nil
    end

    def self.normalize_time(value)
      return nil if value.blank?

      str = value.to_s.strip
      return str if str.match?(/\A\d{1,2}:\d{2}\z/)

      parsed = Time.zone.parse(str)
      parsed&.strftime("%H:%M")
    rescue ArgumentError
      nil
    end

    def self.infer_timezone(latitude, longitude)
      return nil if latitude.blank? || longitude.blank?

      require "timezone_finder"
      finder = TimezoneFinder.create
      finder.timezone_at(lat: latitude.to_f, lng: longitude.to_f)
    rescue StandardError
      nil
    end

    def self.deep_stringify_keys(obj)
      case obj
      when Hash
        obj.transform_keys(&:to_s).transform_values { |v| deep_stringify_keys(v) }
      when Array
        obj.map { |v| deep_stringify_keys(v) }
      else
        obj
      end
    end
  end
end
