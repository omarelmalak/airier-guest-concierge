from app.exceptions import ServiceError
from app.services.database.conversation import ConversationDatabase
from app.services.database.text import TextDatabase
from app.services.llm_client import LLMClient

SYSTEM_PROMPT = """You are Airier, a helpful guest concierge for a short-term rental property.

Your role:
- Answer guest questions clearly and warmly over SMS.
- Help with check-in, amenities, house rules, and local tips when you can.
- If you do not have specific property information, say so honestly and suggest the guest contact the host.
- Do not invent WiFi passwords, door codes, addresses, or policies.

Style:
- Keep replies concise (1–3 short sentences when possible).
- Use plain language suitable for text messages; no markdown or bullet lists.
"""

# DB role -> Gemini multi-turn role
_ROLE_TO_LLM = {
    "guest": "user",
    "user": "user",
    "airier": "model",
    "concierge": "model",
}

_conversation_database = ConversationDatabase()
_text_database = TextDatabase()
_llm_client: LLMClient | None = None


def _get_llm_client() -> LLMClient:
    global _llm_client
    if _llm_client is None:
        _llm_client = LLMClient()
    return _llm_client


def _history_to_llm_messages(rows: list[dict]) -> list[dict[str, str]]:
    messages: list[dict[str, str]] = []
    for row in rows:
        role = row.get("role")
        content = (row.get("content") or "").strip()
        if not content:
            continue
        llm_role = _ROLE_TO_LLM.get(role)
        if not llm_role:
            print("[generate_response] Skipping unknown text role=%r" % (role,))
            continue
        messages.append({"role": llm_role, "content": content})
    return messages


def generate_response(text_id: str, *, conn=None) -> str:
    conversation_id = _conversation_database.get_conversation_id_by_text_id(text_id, conn=conn)
    if not conversation_id:
        raise ServiceError("conversation not found for message", 404)

    history = _text_database.get_conversation_history(conversation_id, conn=conn)
    messages = _history_to_llm_messages(history)
    if not messages:
        raise ServiceError("no messages in conversation", 404)

    try:
        return _get_llm_client().generate_reply(SYSTEM_PROMPT, messages)
    except ServiceError:
        raise
    except Exception as exc:
        print("[generate_response] LLM error: %s" % exc)
        raise ServiceError("failed to generate response", 502) from exc
