require "cohere"

class CohereQuestionEmbedder
  MODEL = "embed-multilingual-v3.0"
  INPUT_TYPE = "search_document"
  EMBEDDING_TYPES = ["float"].freeze
  EMBEDDING_DIMENSIONS = 1024

  class Error < StandardError; end

  def self.embed(question)
    new.embed(question)
  end

  def embed(question)
    text = question.to_s.strip
    raise Error, "question is blank" if text.empty?

    response = client.embed(
      texts: [text],
      model: MODEL,
      input_type: INPUT_TYPE,
      embedding_types: EMBEDDING_TYPES
    )

    embedding = extract_embedding(response)
    validate_embedding!(embedding)
    embedding
  rescue Faraday::Error => e
    raise Error, "Cohere embed request failed: #{e.message}"
  end

  private

  def client
    @client ||= Cohere::Client.new(api_key: ENV.fetch("COHERE_API_KEY"))
  end

  def extract_embedding(response)
    body = response.is_a?(Hash) ? response : response.to_h
    embeddings = body["embeddings"] || body[:embeddings]

    floats = if embeddings.is_a?(Hash)
      embeddings["float"] || embeddings[:float]
    else
      embeddings
    end

    row = floats.is_a?(Array) ? floats.first : floats
    row.is_a?(Array) ? row : Array(row)
  end

  def validate_embedding!(embedding)
    unless embedding.is_a?(Array) && embedding.length == EMBEDDING_DIMENSIONS
      raise Error, "expected #{EMBEDDING_DIMENSIONS}-dim embedding, got #{embedding&.length}"
    end
  end
end
