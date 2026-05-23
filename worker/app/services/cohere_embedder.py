import os

import cohere

MODEL = "embed-multilingual-v3.0"
INPUT_TYPE_QUERY = "search_query"
EMBEDDING_DIMENSIONS = 1024


class CohereEmbedder:
    """Embed guest messages for similarity search against stored exact-answer questions."""

    def __init__(self, api_key: str | None = None):
        api_key = (api_key or os.environ.get("COHERE_API_KEY") or "").strip()
        if not api_key:
            raise ValueError("COHERE_API_KEY is required")
        self._client = cohere.ClientV2(api_key=api_key)

    def embed_query(self, text: str) -> list[float]:
        query = (text or "").strip()
        if not query:
            raise ValueError("text is required")

        response = self._client.embed(
            texts=[query],
            model=MODEL,
            input_type=INPUT_TYPE_QUERY,
            embedding_types=["float"],
        )
        embedding = list(response.embeddings.float[0])
        if len(embedding) != EMBEDDING_DIMENSIONS:
            raise ValueError(
                "expected %s-dim embedding, got %s" % (EMBEDDING_DIMENSIONS, len(embedding))
            )
        return embedding
