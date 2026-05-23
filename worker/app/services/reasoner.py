from app.exceptions import ServiceError
from app.services.cohere_embedder import CohereEmbedder
from app.services.database.conversation import ConversationDatabase
from app.services.database.exact_answer import ExactAnswerDatabase
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

EXACT_ANSWER_SIMILARITY_THRESHOLD = 0.6
MAX_CONVERSATION_TURNS = 5

# DB role -> Gemini multi-turn role
_ROLE_TO_LLM = {
    "guest": "user",
    "user": "user",
    "airier": "model",
    "concierge": "model",
}

_conversation_database = ConversationDatabase()
_text_database = TextDatabase()
_exact_answer_database = ExactAnswerDatabase()
_llm_client: LLMClient | None = None
_cohere_embedder: CohereEmbedder | None = None


def _get_llm_client() -> LLMClient:
    global _llm_client
    if _llm_client is None:
        _llm_client = LLMClient()
    return _llm_client


def _get_cohere_embedder() -> CohereEmbedder:
    global _cohere_embedder
    if _cohere_embedder is None:
        _cohere_embedder = CohereEmbedder()
    return _cohere_embedder


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


def _limit_llm_history(messages: list[dict[str, str]]) -> list[dict[str, str]]:
    """Keep the most recent turns (guest + airier); drop leading model msgs for Gemini."""
    max_messages = MAX_CONVERSATION_TURNS * 2
    if len(messages) > max_messages:
        messages = messages[-max_messages:]
    while messages and messages[0]["role"] != "user":
        messages = messages[1:]
    return messages


def _try_exact_answer_reply(text_id: str, *, conn=None) -> str | None:
    guest_message = _text_database.get_text_content(text_id, conn=conn)
    if not guest_message:
        return None

    property_id = _exact_answer_database.get_property_id_for_text(text_id, conn=conn)
    if not property_id:
        print("[generate_response] No property_id for text_id=%s; skipping exact-answer lookup" % (text_id,))
        return None

    try:
        query_embedding = _get_cohere_embedder().embed_query(guest_message)
    except ValueError as exc:
        print("[generate_response] Cohere embed skipped: %s" % exc)
        return None
    except Exception as exc:
        print("[generate_response] Cohere embed error: %s" % exc)
        return None

    match = _exact_answer_database.find_best_match(property_id, query_embedding, conn=conn)
    if not match:
        print(
            "[generate_response] No exact_answers with embeddings for property_id=%s"
            % (property_id,)
        )
        return None

    similarity = float(match.get("similarity") or 0)
    print(
        "[generate_response] Best exact_answer match id=%s similarity=%.4f question=%r"
        % (match.get("id"), similarity, match.get("question")),
    )

    if similarity < EXACT_ANSWER_SIMILARITY_THRESHOLD:
        print(
            "[generate_response] Below threshold %.2f; using LLM"
            % (EXACT_ANSWER_SIMILARITY_THRESHOLD,),
        )
        return None

    answer = (match.get("answer") or "").strip()
    if not answer:
        return None

    print("[generate_response] Using exact_answer id=%s" % (match.get("id"),))
    return answer


def generate_response(text_id: str, *, conn=None) -> str:
    exact_reply = _try_exact_answer_reply(text_id, conn=conn)
    if exact_reply:
        return exact_reply

    conversation_id = _conversation_database.get_conversation_id_by_text_id(text_id, conn=conn)
    if not conversation_id:
        raise ServiceError("conversation not found for message", 404)

    history = _text_database.get_conversation_history(
        conversation_id,
        limit=MAX_CONVERSATION_TURNS * 2,
        conn=conn,
    )
    messages = _limit_llm_history(_history_to_llm_messages(history))
    if not messages:
        raise ServiceError("no messages in conversation", 404)

    try:
        return _get_llm_client().generate_reply(SYSTEM_PROMPT, messages)
    except ServiceError:
        raise
    except Exception as exc:
        print("[generate_response] LLM error: %s" % exc)
        raise ServiceError("failed to generate response", 502) from exc
