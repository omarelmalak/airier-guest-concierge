# frozen_string_literal: true

module Airbnb
  class PropertyImporter
    class Error < StandardError; end

    def initialize(host:)
      @host = host
    end

    def import_from_link!(link)
      listing = ListingFetcher.new.fetch(link)
      import_listing!(listing)
    rescue ListingFetcher::Error => e
      raise Error, e.message
    end

    def import_listing!(listing)
      payload = ListingLlmExtractor.new.extract(listing)
      property = nil

      Property.transaction do
        attrs = payload.property.merge(host_id: @host.id)
        property = Property.create!(attrs_for_property(attrs))
        persist_knowledge!(property, payload)
      end

      property
    rescue ActiveRecord::RecordInvalid => e
      raise Error, e.record.errors.full_messages.join(", ")
    rescue ListingLlmExtractor::Error => e
      raise Error, e.message
    end

    private

    def persist_knowledge!(property, payload)
      payload.knowledge_category_features.each do |row|
        kcf = KnowledgeCategoryFeature.find_or_initialize_by(
          property_id: property.id,
          knowledge_category_id: row[:knowledge_category_id],
          feature_id: row[:feature_id]
        )
        kcf.update!(description: row[:description])
      end

      payload.property_knowledge_categories.each do |row|
        pkc = PropertyKnowledgeCategory.find_or_initialize_by(
          property_id: property.id,
          knowledge_category_id: row[:knowledge_category_id]
        )
        pkc.update!(description: row[:description])
      end
    end

    def attrs_for_property(attrs)
      allowed = Property.attribute_names.map(&:to_sym)
      attrs.slice(*allowed)
    rescue ActiveRecord::ConnectionNotEstablished, ActiveRecord::NoDatabaseError
      attrs.except(:timezone)
    end
  end
end
