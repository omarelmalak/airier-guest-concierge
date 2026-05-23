import os

from google import genai
from google.genai import types

DEFAULT_GEMINI_MODEL = "gemini-2.0-flash"


class LLMClient:
    """Gemini client for guest concierge replies."""

    def __init__(self, api_key: str | None = None, model: str | None = None):
        api_key = (api_key or os.environ.get("GEMINI_API_KEY") or "").strip()
        if not api_key:
            raise ValueError("GEMINI_API_KEY is required")

        self._model = (model or os.environ.get("GEMINI_MODEL") or DEFAULT_GEMINI_MODEL).strip()
        self._client = genai.Client(api_key=api_key)

    def generate_reply(self, system_prompt: str, messages: list[dict[str, str]]) -> str:
        """
        Generate a reply from conversation history.

        messages: ordered list of {"role": "user"|"model", "content": "..."}
        """
        if not messages:
            raise ValueError("messages must not be empty")

        contents = [
            types.Content(
                role=message["role"],
                parts=[types.Part.from_text(text=message["content"])],
            )
            for message in messages
        ]

        response = self._client.models.generate_content(
            model=self._model,
            contents=contents,
            config=types.GenerateContentConfig(
                system_instruction=system_prompt,
                temperature=0.7,
                max_output_tokens=512,
            ),
        )

        text = (response.text or "").strip()
        if not text:
            raise ValueError("empty response from LLM")
        return text
