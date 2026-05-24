"""Unit tests for knowledge_ranker (no DB / Cohere)."""

import numpy as np

from app.services.knowledge_ranker import (
    KNOWLEDGE_THRESHOLD,
    build_context,
    parse_embedding,
    rank_by_similarity,
)


def test_parse_embedding_bracket_string():
    vec = parse_embedding("[1.0, 0.0, 0.0]")
    assert vec is not None
    np.testing.assert_allclose(vec, [1.0, 0.0, 0.0], rtol=1e-5)


def test_parse_embedding_list():
    vec = parse_embedding([2.0, 3.0])
    assert vec is not None
    np.testing.assert_allclose(vec, [2.0, 3.0], rtol=1e-5)


def test_rank_by_similarity_orders_by_cosine():
    query = [1.0, 0.0, 0.0]
    rows = [
        {"source": "feature", "embedding": [0.0, 1.0, 0.0], "feature_name": "Far"},
        {"source": "feature", "embedding": [1.0, 0.0, 0.0], "feature_name": "Near"},
    ]
    ranked = rank_by_similarity(query, rows)
    assert ranked[0][1]["feature_name"] == "Near"
    assert ranked[0][0] > ranked[1][0]


def test_build_context_feature_with_description():
    ranked = [
        (
            0.9,
            {
                "source": "feature",
                "category_name": "Amenities",
                "feature_name": "Wi-Fi",
                "description": "Password: Toronto@2022",
            },
        ),
    ]
    context = build_context(ranked, threshold=KNOWLEDGE_THRESHOLD)
    assert "Amenities" in context
    assert "Wi-Fi: Password: Toronto@2022" in context


def test_build_context_feature_without_description():
    ranked = [
        (
            0.9,
            {
                "source": "feature",
                "category_name": "WhereIs",
                "feature_name": "Safe/Lockbox",
                "description": "",
            },
        ),
    ]
    context = build_context(ranked, threshold=KNOWLEDGE_THRESHOLD)
    assert "Safe/Lockbox: (no further details available)" in context


def test_build_context_freeform_only():
    ranked = [
        (
            0.85,
            {
                "source": "freeform",
                "category_name": "Amenities",
                "feature_name": "Amenities",
                "description": "balcony gets damp after rain",
            },
        ),
    ]
    context = build_context(ranked, threshold=KNOWLEDGE_THRESHOLD)
    assert "balcony gets damp" in context
    assert "no further details" not in context


def test_build_context_skips_exact_and_below_threshold():
    ranked = [
        (0.9, {"source": "exact", "payload": "answer", "category_name": None, "feature_name": None}),
        (
            0.4,
            {
                "source": "feature",
                "category_name": "Amenities",
                "feature_name": "Gym",
                "description": "basics",
            },
        ),
    ]
    context = build_context(ranked, threshold=KNOWLEDGE_THRESHOLD)
    assert context == ""
