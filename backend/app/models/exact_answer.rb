class ExactAnswer < ApplicationRecord
  belongs_to :property

  # Override Rails 8's OID::Vector (does not serialize float arrays for pgvector).
  attribute :question_embedding, Types::Vector.new(limit: 1024)

  before_validation :embed_question, if: :should_embed_question?

  private

  def should_embed_question?
    return false unless question.present?

    new_record? || will_save_change_to_question? || question_embedding.nil?
  end

  def embed_question
    self.question_embedding = CohereQuestionEmbedder.embed(question)
  rescue CohereQuestionEmbedder::Error => e
    errors.add(:question, "could not be embedded: #{e.message}")
    throw(:abort)
  end
end
