class KnowledgeCategoryFeature < ApplicationRecord
  include EmbedsDescription

  belongs_to :property
  belongs_to :knowledge_category
  belongs_to :feature

  private

  def embedding_source_text
    feature_name = feature&.name.to_s.strip
    return "" if feature_name.blank?

    feature_description = description.to_s.strip
    return feature_name if feature_description.blank?

    "#{feature_name}: #{feature_description}"
  end

  def embedding_source_association_changed?
    will_save_change_to_feature_id?
  end
end
