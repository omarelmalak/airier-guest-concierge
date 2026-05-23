class ExactAnswer < ApplicationRecord
  belongs_to :property

  before_validation :embed_question, if: :should_embed_question?

  private

  def should_embed_question?
    question.present? && (new_record? || will_save_change_to_question?)
  end

  def embed_question
    self.question_embedding = CohereQuestionEmbedder.embed(question)
  rescue CohereQuestionEmbedder::Error => e
    errors.add(:question, "could not be embedded: #{e.message}")
    throw(:abort)
  end
end
