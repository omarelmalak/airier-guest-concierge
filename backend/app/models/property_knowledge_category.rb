class PropertyKnowledgeCategory < ApplicationRecord
  include EmbedsDescription

  belongs_to :property
  belongs_to :knowledge_category

  before_validation :clear_description_embedding_when_blank, prepend: true

  private

  def clear_description_embedding_when_blank
    self.description_embedding = nil if description.blank?
  end

  def should_embed_description?
    return false if description.blank?

    super
  end

  def embedding_source_text
    category_name = knowledge_category&.name.to_s.strip
    info = description.to_s.strip

    "#{category_name} additional info: #{info}"
  end

  def embedding_source_association_changed?
    will_save_change_to_knowledge_category_id?
  end
end
