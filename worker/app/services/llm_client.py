import os
from typing import Self

from google import genai
from google.genai import types

DEFAULT_GEMINI_MODEL = "gemini-2.0-flash"
DEFAULT_TEMPERATURE = 0.7
DEFAULT_MAX_OUTPUT_TOKENS = 512

_BASE_SYSTEM_PROMPT = """You are Airier, a helpful guest concierge for a short-term rental property.

Your role:
- Answer guest questions clearly and warmly over SMS.
- Help with check-in, amenities, house rules, and local tips when you can.
- If you do not have specific property information, say so honestly and suggest the guest contact the host.
- Do not invent WiFi passwords, door codes, addresses, or policies.

Style:
- Keep replies concise (1–3 short sentences when possible).
- Use plain language suitable for text messages; no markdown or bullet lists.
- Reply in the same language as the guest's latest message.
"""

_KNOWLEDGE_CONTEXT_RULES = """
Note: The property information below was retrieved automatically. It may be incomplete, partially relevant, or unrelated to the guest's latest message.

Answer the guest's latest message directly, using ONLY the property information provided below. Use prior turns in the conversation to interpret follow-ups or short questions. Ignore any bullets or sections that do not apply.
If a feature is listed with no further details, tell the guest it exists but you do not have more information on it.
If the information below does not answer their question, say so honestly and suggest they contact the host. Do not invent WiFi passwords, door codes, addresses, or policies.
Be conversational and friendly; do not read the data back verbatim.
"""


class LLMClient:
    """Gemini client for guest concierge replies. All prompts live here."""

    def __init__(
        self,
        *,
        property_context: str | None = None,
        api_key: str | None = None,
        model: str | None = None,
    ):
        api_key = (api_key or os.environ.get("GEMINI_API_KEY") or "").strip()
        if not api_key:
            raise ValueError("GEMINI_API_KEY is required")

        self._model = (model or os.environ.get("GEMINI_MODEL") or DEFAULT_GEMINI_MODEL).strip()
        self._client = genai.Client(api_key=api_key)
        self._property_context = (property_context or "").strip() or None

    @classmethod
    def for_conversation(cls, **kwargs) -> Self:
        """General multi-turn SMS replies using conversation history only."""
        return cls(property_context=None, **kwargs)

    @classmethod
    def for_property_knowledge(cls, context: str, **kwargs) -> Self:
        """Reply grounded in retrieved property knowledge and conversation history."""
        context = (context or "").strip()
        if not context:
            raise ValueError("property knowledge context is required")
        return cls(property_context=context, **kwargs)

    @property
    def has_property_context(self) -> bool:
        return self._property_context is not None

    def system_instruction(self) -> str:
        if self._property_context:
            return (
                f"{_BASE_SYSTEM_PROMPT}\n"
                f"{_KNOWLEDGE_CONTEXT_RULES}\n\n"
                f"Property information:\n{self._property_context}"
            )
        return _BASE_SYSTEM_PROMPT

    def generate(self, *, messages: list[dict[str, str]] | None = None, guest_query: str | None = None) -> str:
        if self._property_context:
            return self._generate_with_knowledge(messages=messages, guest_query=guest_query)
        return self._generate_multi_turn(messages)

    def _generate_with_knowledge(
        self,
        *,
        messages: list[dict[str, str]] | None,
        guest_query: str | None,
    ) -> str:
        if messages:
            return self._generate_multi_turn(messages)
        return self._generate_single_turn(guest_query)

    def _generate_multi_turn(self, messages: list[dict[str, str]] | None) -> str:
        if not messages:
            raise ValueError("messages must not be empty")

        contents = [
            types.Content(
                role=message["role"],
                parts=[types.Part.from_text(text=message["content"])],
            )
            for message in messages
        ]
        return self._call_model(contents)

    def _generate_single_turn(self, guest_query: str | None) -> str:
        guest_query = (guest_query or "").strip()
        if not guest_query:
            raise ValueError("guest_query is required when using property knowledge context")

        contents = [
            types.Content(
                role="user",
                parts=[types.Part.from_text(text=guest_query)],
            )
        ]
        return self._call_model(contents)

    def _call_model(self, contents: list[types.Content]) -> str:
        response = self._client.models.generate_content(
            model=self._model,
            contents=contents,
            config=types.GenerateContentConfig(
                system_instruction=self.system_instruction(),
                temperature=DEFAULT_TEMPERATURE,
                max_output_tokens=DEFAULT_MAX_OUTPUT_TOKENS,
            ),
        )

        text = (response.text or "").strip()
        if not text:
            raise ValueError("empty response from LLM")
        return text
