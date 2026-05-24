"""Shared retrieval evaluation helpers for worker tests."""

from __future__ import annotations

from dataclasses import dataclass
from enum import Enum
from typing import Iterable

from app.services.cohere_embedder import CohereEmbedder
from app.services.database.knowledge_retrieval import KnowledgeRetrievalDatabase
from app.services.knowledge_ranker import (
    EXACT_THRESHOLD,
    KNOWLEDGE_CONTEXT_INCLUSION_THRESHOLD,
    KNOWLEDGE_CONTEXT_TOP_N,
    KNOWLEDGE_THRESHOLD,
    build_context,
    rank_by_similarity,
)

_CONTENT_PREVIEW_LEN = 220


class RetrievalRoute(str, Enum):
    EXACT = "exact"
    KNOWLEDGE = "knowledge"
    GENERAL = "general"


@dataclass(frozen=True)
class RetrievalOutcome:
    guest_message: str
    top_score: float
    top_row: dict
    route: RetrievalRoute
    context: str | None
    ranked: list[tuple[float, dict]]
    # Always computed: text passed as property_context to LLMClient.for_property_knowledge
    property_context: str


def classify_route(top_score: float, top_row: dict, ranked: list[tuple[float, dict]]) -> RetrievalRoute:
    """Mirror reasoner._try_retrieval_reply routing (without translate / LLM)."""
    if top_row.get("source") == "exact" and top_score >= EXACT_THRESHOLD:
        return RetrievalRoute.EXACT
    if top_score >= KNOWLEDGE_THRESHOLD:
        context = build_context(ranked)
        if context:
            return RetrievalRoute.KNOWLEDGE
    return RetrievalRoute.GENERAL


def evaluate_retrieval(
    property_id: str,
    guest_message: str,
    *,
    db: KnowledgeRetrievalDatabase | None = None,
    embedder: CohereEmbedder | None = None,
    conn=None,
) -> RetrievalOutcome:
    db = db or KnowledgeRetrievalDatabase()
    embedder = embedder or CohereEmbedder()

    rows = db.fetch_embedded_sources(property_id, conn=conn)
    if not rows:
        raise ValueError("no embedded sources for property_id=%s" % property_id)

    query_embedding = embedder.embed_query(guest_message)
    ranked = rank_by_similarity(query_embedding, rows)
    if not ranked:
        raise ValueError("no parseable embeddings for property_id=%s" % property_id)

    top_score, top_row = ranked[0]
    property_context = build_context(ranked)
    route = classify_route(top_score, top_row, ranked)
    context = property_context if route == RetrievalRoute.KNOWLEDGE else None

    return RetrievalOutcome(
        guest_message=guest_message,
        top_score=top_score,
        top_row=top_row,
        route=route,
        context=context,
        ranked=ranked,
        property_context=property_context,
    )


def _preview(text: str | None, *, max_len: int = _CONTENT_PREVIEW_LEN) -> str:
    cleaned = " ".join((text or "").split())
    if not cleaned:
        return "(empty)"
    if len(cleaned) <= max_len:
        return cleaned
    return cleaned[: max_len - 3] + "..."


def _exact_row_detail_lines(row: dict) -> list[str]:
    """Exact rows: score is guest query vs question_embedding, not answer text."""
    question = (row.get("exact_question") or "").strip()
    answer = (row.get("payload") or "").strip()
    return [
        "     match vector: question_embedding (host question at save time)",
        "     stored question: %s" % _preview(question, max_len=400),
        "     answer if selected (not used for scoring): %s" % _preview(answer, max_len=400),
    ]


def _row_content_preview(row: dict) -> str:
    source = row.get("source")
    if source == "exact":
        question = (row.get("exact_question") or "").strip()
        return _preview(question) if question else _preview(row.get("payload"))
    return _preview(row.get("description"))


def format_retrieval_report(
    outcome: RetrievalOutcome,
    *,
    case_id: str | None = None,
    top_n: int = 8,
) -> str:
    """Human-readable retrieval log: ranks, route, LLM property context, exact payload."""
    header = "RETRIEVAL REPORT"
    if case_id:
        header += f" [{case_id}]"

    lines = [
        "",
        "=" * 72,
        header,
        "=" * 72,
        f"Guest message: {outcome.guest_message!r}",
        (
            f"Route: {outcome.route.value}  "
            f"(exact>={EXACT_THRESHOLD:.2f}, knowledge>={KNOWLEDGE_THRESHOLD:.2f})"
        ),
        f"Top score: {outcome.top_score:.4f}  "
        f"source={outcome.top_row.get('source')!r}  "
        f"category={outcome.top_row.get('category_name')!r}  "
        f"feature={outcome.top_row.get('feature_name')!r}",
        "",
        "Scoring: cosine(guest message [search_query], stored embedding per row).",
        "  • exact → question_embedding only (stored host question; answer is not embedded)",
        "  • feature / freeform → description_embedding",
        "",
        f"Ranked matches (top {top_n}):",
    ]

    if outcome.top_row.get("source") == "exact":
        lines.append(
            "Top hit exact_question: %r" % (outcome.top_row.get("exact_question") or "")
        )
        lines.append("")

    for index, (score, row) in enumerate(outcome.ranked[:top_n], start=1):
        in_ctx = (
            score >= KNOWLEDGE_CONTEXT_INCLUSION_THRESHOLD
            and row.get("source") in ("feature", "freeform")
        )
        flag = ""
        if in_ctx:
            flag = " → in LLM property context"
        elif row.get("source") == "exact":
            flag = " → exact match (question vs guest message)"
        lines.append(
            f"  {index}. score={score:.4f}  source={row.get('source')!r}  "
            f"category={row.get('category_name')!r}  feature={row.get('feature_name')!r}{flag}"
        )
        if row.get("source") == "exact":
            lines.extend(_exact_row_detail_lines(row))
        else:
            lines.append(f"     {_row_content_preview(row)}")

    lines.extend(
        [
            "",
            "-" * 72,
            "LLM property context (knowledge path only — not the base system prompt)",
            "-" * 72,
        ]
    )

    if outcome.route == RetrievalRoute.KNOWLEDGE and outcome.property_context:
        lines.append(outcome.property_context)
        lines.extend(
            [
                "",
                "Guest user turn sent with the above context:",
                f"  {outcome.guest_message!r}",
            ]
        )
    elif outcome.property_context:
        lines.append(
            "(build_context produced text, but route is %s — not sent to LLM)\n"
            % outcome.route.value
        )
        lines.append(outcome.property_context)
    else:
        lines.append(
            f"(empty — no feature/freeform rows scored >= {KNOWLEDGE_CONTEXT_INCLUSION_THRESHOLD:.2f}, "
            f"max {KNOWLEDGE_CONTEXT_TOP_N} slots)"
        )

    lines.extend(
        [
            "",
            "-" * 72,
            "Exact answer path (matched on question_embedding; answer returned verbatim + translate)",
            "-" * 72,
        ]
    )

    if outcome.route == RetrievalRoute.EXACT or outcome.top_row.get("source") == "exact":
        question = (outcome.top_row.get("exact_question") or "").strip()
        answer = (outcome.top_row.get("payload") or "").strip()
        if outcome.route != RetrievalRoute.EXACT:
            lines.append("(top match is exact but score below threshold — answer not sent)")
        lines.append("Matched stored question (used for scoring):")
        lines.append("  %s" % (question or "(empty)"))
        lines.append("")
        lines.append("Answer returned to guest if exact path wins:")
        lines.append("  %s" % (answer or "(empty)"))
    else:
        lines.append("(n/a — route is not exact)")

    if outcome.route == RetrievalRoute.GENERAL:
        lines.extend(
            [
                "",
                "-" * 72,
                "General conversation fallback",
                "-" * 72,
                "No property context block. Multi-turn history + base system prompt only.",
            ]
        )

    lines.extend(["", "=" * 72, ""])
    return "\n".join(lines)


def log_retrieval_report(
    outcome: RetrievalOutcome,
    *,
    case_id: str | None = None,
    top_n: int = 8,
) -> str:
    """Print and return the retrieval report (use pytest -s to see stdout)."""
    report = format_retrieval_report(outcome, case_id=case_id, top_n=top_n)
    print(report, flush=True)
    return report


def row_matches(
    row: dict,
    *,
    source: str | None = None,
    feature_name: str | None = None,
    category_name: str | None = None,
) -> bool:
    if source is not None and row.get("source") != source:
        return False
    if feature_name is not None and (row.get("feature_name") or "").strip() != feature_name:
        return False
    if category_name is not None and (row.get("category_name") or "").strip() != category_name:
        return False
    return True


def find_in_ranked(
    ranked: Iterable[tuple[float, dict]],
    *,
    source: str | None = None,
    feature_name: str | None = None,
    category_name: str | None = None,
    top_n: int = 5,
    min_score: float | None = None,
) -> tuple[float, dict] | None:
    for score, row in list(ranked)[:top_n]:
        if min_score is not None and score < min_score:
            continue
        if row_matches(row, source=source, feature_name=feature_name, category_name=category_name):
            return score, row
    return None
