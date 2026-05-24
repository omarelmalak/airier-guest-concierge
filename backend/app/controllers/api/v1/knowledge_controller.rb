module Api
  module V1
    class KnowledgeController < ApplicationController
      # GET /api/v1/properties/:property_id/knowledge
      def show
        host = Host.find_by!(auth_user_id: @auth_user_id)
        property = Property.find_by!(id: params[:property_id], host_id: host.id)
        raise ActiveRecord::RecordNotFound unless property
        render json: format_property_knowledge(property)
      end

      # PUT/PATCH /api/v1/properties/:property_id/knowledge (replace all knowledge for property)
      def update
        host = Host.find_by!(auth_user_id: @auth_user_id)
        property = Property.find_by!(id: params[:property_id], host_id: host.id)
        raise ActiveRecord::RecordNotFound unless property

        payload = params.permit(
          amenities: [:description, { items: [:name, :description] }],
          where_is: [:description, { items: [:name, :description] }],
          recommendations: [:description, { items: [:name, :description] }],
          rules: [:description, { items: [:name, :description] }]
        ).to_h

        ActiveRecord::Base.transaction do
          KNOWLEDGE_CATEGORY_KEYS.each do |category_name|
            key = category_name.underscore
            data = payload[key] || {}
            description = data["description"].to_s
            items = data["items"].to_a

            cat = KnowledgeCategory.find_or_create_by!(name: category_name)
            pkc = PropertyKnowledgeCategory.find_or_create_by!(
              property_id: property.id,
              knowledge_category_id: cat.id
            )
            pkc.update!(description: description)
            sync_category_features(property, cat, items)
          end
        end

        render json: format_property_knowledge(property)
      rescue ActiveRecord::RecordInvalid => e
        render json: { error: e.record.errors.full_messages.join(", ") }, status: :unprocessable_entity
      end

      private

      KNOWLEDGE_CATEGORY_KEYS = %w[Amenities WhereIs Recommendations Rules].freeze

      def sync_category_features(property, category, items)
        scope = KnowledgeCategoryFeature.where(
          property_id: property.id,
          knowledge_category_id: category.id
        )
        kept_feature_ids = []

        items.each do |item|
          name = item["name"].to_s
          next if name.blank?

          feature = Feature.find_or_create_by!(name: name)
          kept_feature_ids << feature.id

          kcf = scope.find_or_initialize_by(feature_id: feature.id)
          kcf.update!(description: item["description"].to_s)
        end

        scope.where.not(feature_id: kept_feature_ids).destroy_all
      end

      def format_property_knowledge(property)
        pkcs = PropertyKnowledgeCategory
          .where(property_id: property.id)
          .includes(:knowledge_category)
        by_name = pkcs.index_by { |pkc| pkc.knowledge_category.name }

        kcf_items = KnowledgeCategoryFeature
          .where(property_id: property.id)
          .includes(:feature, :knowledge_category)
          .group_by { |kcf| kcf.knowledge_category.name }

        KNOWLEDGE_CATEGORY_KEYS.map do |name|
          pkc = by_name[name]
          items = (kcf_items[name] || []).map { |kcf| { name: kcf.feature.name, description: kcf.description.to_s } }
          description = pkc&.description.to_s
          key = name.underscore
          [key, { description: description, items: items }]
        end.to_h
      end
    end
  end
end
