from app.exceptions import ServiceError
from app.services.cohere_embedder import CohereEmbedder
from app.services.database.conversation import ConversationDatabase
from app.services.database.knowledge_retrieval import KnowledgeRetrievalDatabase
from app.services.database.text import TextDatabase
from app.services.knowledge_ranker import (
    EXACT_THRESHOLD,
    KNOWLEDGE_THRESHOLD,
    build_context,
    rank_by_similarity,
)
from app.services.google_translate_localizer import GoogleTranslateLocalizer
from app.services.llm_client import LLMClient

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
_knowledge_retrieval_database = KnowledgeRetrievalDatabase()
_cohere_embedder: CohereEmbedder | None = None
_translate_localizer: GoogleTranslateLocalizer | None = None


def _get_cohere_embedder() -> CohereEmbedder:
    global _cohere_embedder
    if _cohere_embedder is None:
        _cohere_embedder = CohereEmbedder()
    return _cohere_embedder


def _get_translate_localizer() -> GoogleTranslateLocalizer:
    global _translate_localizer
    if _translate_localizer is None:
        _translate_localizer = GoogleTranslateLocalizer()
    return _translate_localizer


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


def _ensure_history_starts_with_user(messages: list[dict[str, str]]) -> list[dict[str, str]]:
    while messages and messages[0]["role"] != "user":
        messages = messages[1:]
    return messages


def _localize_exact_answer(guest_message: str, host_answer: str) -> str:
    try:
        return _get_translate_localizer().localize_answer(guest_message, host_answer)
    except Exception as exc:
        print("[generate_response] Google Translate failed, using stored answer: %s" % exc)
        return host_answer


def _load_conversation_messages(text_id: str, *, conn=None) -> list[dict[str, str]]:
    conversation_id = _conversation_database.get_conversation_id_by_text_id(text_id, conn=conn)
    if not conversation_id:
        raise ServiceError("conversation not found for message", 404)

    history = _text_database.get_conversation_history(
        conversation_id,
        limit=MAX_CONVERSATION_TURNS * 2,
        conn=conn,
    )
    messages = _ensure_history_starts_with_user(_history_to_llm_messages(history))
    if not messages:
        raise ServiceError("no messages in conversation", 404)
    return messages


def _try_retrieval_reply(
    guest_message: str,
    property_id: str,
    *,
    messages: list[dict[str, str]],
    conn=None,
) -> str | None:
    try:
        query_embedding = _get_cohere_embedder().embed_query(guest_message)
    except ValueError as exc:
        print("[generate_response] Cohere embed skipped: %s" % exc)
        return None
    except Exception as exc:
        print("[generate_response] Cohere embed error: %s" % exc)
        return None

    rows = _knowledge_retrieval_database.fetch_embedded_sources(property_id, conn=conn)
    if not rows:
        print("[generate_response] No embedded knowledge for property_id=%s" % (property_id,))
        return None

    ranked = rank_by_similarity(query_embedding, rows)
    if not ranked:
        print("[generate_response] No parseable embeddings for property_id=%s" % (property_id,))
        return None

    top_score, top_row = ranked[0]
    print(
        "[generate_response] Top match source=%s score=%.4f category=%r feature=%r"
        % (
            top_row.get("source"),
            top_score,
            top_row.get("category_name"),
            top_row.get("feature_name"),
        ),
    )

    if top_row.get("source") == "exact" and top_score >= EXACT_THRESHOLD:
        answer = (top_row.get("payload") or "").strip()
        if not answer:
            return None
        print("[generate_response] Using exact answer (score >= %.2f)" % (EXACT_THRESHOLD,))
        return _localize_exact_answer(guest_message, answer)

    if top_score >= KNOWLEDGE_THRESHOLD:
        context = build_context(ranked)
        if not context:
            print("[generate_response] Knowledge threshold met but no feature/freeform context built")
            return None
        print(
            "[generate_response] Using knowledge context (score >= %.2f)"
            % (KNOWLEDGE_THRESHOLD,),
        )
        try:
            client = LLMClient.for_property_knowledge(context)
            return client.generate(messages=messages)
        except Exception as exc:
            print("[generate_response] Knowledge LLM failed: %s" % exc)
            return None

    print(
        "[generate_response] Below knowledge threshold %.2f; using general LLM"
        % (KNOWLEDGE_THRESHOLD,),
    )
    return None


def generate_response(text_id: str, *, conn=None) -> str:
    guest_message = _text_database.get_text_content(text_id, conn=conn)
    if not guest_message:
        raise ServiceError("no guest message for text", 404)

    property_id = _knowledge_retrieval_database.get_property_id_for_text(text_id, conn=conn)
    if not property_id:
        raise ServiceError("property not found for message", 404)

    messages = _load_conversation_messages(text_id, conn=conn)

    retrieval_reply = _try_retrieval_reply(
        guest_message, property_id, messages=messages, conn=conn
    )
    if retrieval_reply:
        return retrieval_reply

    try:
        return LLMClient.for_conversation().generate(messages=messages)
    except ServiceError:
        raise
    except Exception as exc:
        print("[generate_response] LLM error: %s" % exc)
        raise ServiceError("failed to generate response", 502) from exc
