# Embeds Cohere search_document text into +description_embedding+ (pgvector).
# Override +embedding_source_text+ (and optionally +embedding_source_association_changed?+) per model.
module EmbedsDescription
  extend ActiveSupport::Concern

  included do
    attribute :description_embedding, Types::Vector.new(limit: 1024)

    before_validation :embed_description, if: :should_embed_description?
  end

  private

  def should_embed_description?
    return false if embedding_source_text.blank?

    new_record? || description_embedding.nil? || embedding_inputs_changed?
  end

  def embedding_inputs_changed?
    will_save_change_to_description? || embedding_source_association_changed?
  end

  def embedding_source_association_changed?
    false
  end

  def embedding_source_text
    description.to_s.strip
  end

  def embed_description
    self.description_embedding = CohereDocumentEmbedder.embed(embedding_source_text)
  rescue CohereDocumentEmbedder::Error => e
    errors.add(:description, "could not be embedded: #{e.message}")
    throw(:abort)
  end
end
