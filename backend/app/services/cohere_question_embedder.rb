class CohereQuestionEmbedder
  Error = CohereDocumentEmbedder::Error

  def self.embed(question)
    CohereDocumentEmbedder.embed(question)
  end
end
