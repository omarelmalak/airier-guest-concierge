import re

import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

EXACT_THRESHOLD = 0.5
KNOWLEDGE_THRESHOLD = 0.45
# Slightly below KNOWLEDGE_THRESHOLD: extra rows in the LLM context only (routing uses KNOWLEDGE_THRESHOLD).
KNOWLEDGE_CONTEXT_INCLUSION_THRESHOLD = 0.40
KNOWLEDGE_CONTEXT_TOP_N = 4

_VECTOR_TEXT_RE = re.compile(r"^\[(.*)\]$", re.DOTALL)


def parse_embedding(value) -> np.ndarray | None:
    if value is None:
        return None
    if isinstance(value, np.ndarray):
        return value.astype(np.float32)
    if isinstance(value, (list, tuple)):
        return np.array(value, dtype=np.float32)

    text = str(value).strip()
    match = _VECTOR_TEXT_RE.match(text)
    if not match:
        return None
    inner = match.group(1).strip()
    if not inner:
        return None
    return np.array([float(part) for part in inner.split(",")], dtype=np.float32)


def rank_by_similarity(query_embedding: list[float], rows: list[dict]) -> list[tuple[float, dict]]:
    parsed_rows: list[tuple[np.ndarray, dict]] = []
    for row in rows:
        vector = parse_embedding(row.get("embedding"))
        if vector is not None:
            parsed_rows.append((vector, row))

    if not parsed_rows:
        return []

    query_vec = np.array(query_embedding, dtype=np.float32).reshape(1, -1)
    stored_vecs = np.stack([vector for vector, _ in parsed_rows])
    scores = cosine_similarity(query_vec, stored_vecs)[0]

    ranked = sorted(
        ((float(score), row) for score, (_, row) in zip(scores, parsed_rows)),
        key=lambda item: item[0],
        reverse=True,
    )
    return ranked


def build_context(
    ranked: list[tuple[float, dict]],
    *,
    threshold: float = KNOWLEDGE_CONTEXT_INCLUSION_THRESHOLD,
    top_n: int = KNOWLEDGE_CONTEXT_TOP_N,
) -> str:
    matches = [
        (score, row)
        for score, row in ranked
        if score >= threshold and row.get("source") in ("feature", "freeform")
    ][:top_n]

    context_parts: dict[str, list[str]] = {}
    for _score, row in matches:
        cat = (row.get("category_name") or "Property").strip()
        if cat not in context_parts:
            context_parts[cat] = []

        source = row.get("source")
        description = (row.get("description") or "").strip()
        feature_name = (row.get("feature_name") or "").strip()

        if source == "freeform":
            if description:
                context_parts[cat].append(f"- {description}")
            continue

        if description:
            line = f"- {feature_name}: {description}"
        else:
            line = f"- {feature_name}: (no further details available)"
        context_parts[cat].append(line)

    blocks: list[str] = []
    for cat_name, lines in context_parts.items():
        blocks.append(f"{cat_name}\n" + "\n".join(lines))

    return "\n\n".join(blocks).strip()
