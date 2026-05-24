"""
Integration retrieval tests against live snapshot property embeddings.

Run from worker/ with env loaded (prints retrieval + LLM context per case):
  doppler run -- .venv/bin/pytest tests/test_property_retrieval_integration.py -v -m integration -s
  make test-integration
"""

from __future__ import annotations

import pytest

from app.services.database.knowledge_retrieval import KnowledgeRetrievalDatabase
from app.services.knowledge_ranker import EXACT_THRESHOLD, KNOWLEDGE_THRESHOLD
from tests.conftest import SNAPSHOT_PROPERTY_ID
from tests.fixtures.sample_apartment import ALL_CASES, RetrievalCase
from tests.helpers.retrieval import (
    RetrievalRoute,
    evaluate_retrieval,
    find_in_ranked,
    format_retrieval_report,
    log_retrieval_report,
    row_matches,
)

pytestmark = pytest.mark.integration


@pytest.fixture
def embedded_source_count(skip_without_integration) -> int:
    db = KnowledgeRetrievalDatabase()
    rows = db.fetch_embedded_sources(SNAPSHOT_PROPERTY_ID)
    assert len(rows) > 0, (
        "No embedded rows for snapshot property. Re-save knowledge / exact answers in Rails."
    )
    return len(rows)


def _assert_case(outcome, case: RetrievalCase) -> None:
    assert outcome.route.value == case.expected_route, (
        "case=%s message=%r route=%s top=%s score=%.4f"
        % (
            case.id,
            case.guest_message,
            outcome.route.value,
            outcome.top_row.get("source"),
            outcome.top_score,
        )
    )

    if case.max_top_score is not None:
        assert outcome.top_score <= case.max_top_score, (
            "case=%s expected weak match, got score=%.4f top=%r"
            % (case.id, outcome.top_score, outcome.top_row)
        )

    # Out-of-domain: must not clear knowledge threshold (no property context path).
    if case.expected_route == "general":
        assert outcome.top_score < KNOWLEDGE_THRESHOLD, (
            "case=%s top score %.4f >= knowledge threshold %.2f (route=%s)"
            % (case.id, outcome.top_score, KNOWLEDGE_THRESHOLD, outcome.route.value)
        )
        return

    if case.min_top_score is not None:
        assert outcome.top_score >= case.min_top_score, (
            "case=%s score=%.4f below min_top_score=%.2f"
            % (case.id, outcome.top_score, case.min_top_score)
        )

    top_ok = True
    if case.expected_source and outcome.top_row.get("source") != case.expected_source:
        top_ok = False
    if case.expected_feature and (outcome.top_row.get("feature_name") or "").strip() != case.expected_feature:
        top_ok = False
    if case.expected_category and (outcome.top_row.get("category_name") or "").strip() != case.expected_category:
        top_ok = False

    if case.also_accept_in_top_n and not top_ok:
        found_alt = False
        for alt in case.also_accept_in_top_n:
            match = find_in_ranked(
                outcome.ranked,
                source=alt.get("source"),
                feature_name=alt.get("feature_name"),
                category_name=alt.get("category_name"),
                top_n=case.top_n,
                min_score=case.min_top_score or KNOWLEDGE_THRESHOLD,
            )
            if match:
                found_alt = True
                break
        assert found_alt, (
            "case=%s top=%r score=%.4f did not match expected or alternates"
            % (case.id, outcome.top_row, outcome.top_score)
        )
    elif case.also_accept_in_top_n and not (
        case.expected_source or case.expected_feature or case.expected_category
    ):
        found_alt = False
        for alt in case.also_accept_in_top_n:
            if find_in_ranked(
                outcome.ranked,
                source=alt.get("source"),
                feature_name=alt.get("feature_name"),
                category_name=alt.get("category_name"),
                top_n=case.top_n,
                min_score=case.min_top_score or KNOWLEDGE_THRESHOLD,
            ):
                found_alt = True
                break
        assert found_alt, "case=%s no acceptable match in top %d" % (case.id, case.top_n)
    elif case.expected_source or case.expected_feature or case.expected_category:
        assert top_ok, (
            "case=%s top=%r score=%.4f"
            % (case.id, outcome.top_row, outcome.top_score)
        )

    if case.expected_route == "exact":
        payload = (outcome.top_row.get("payload") or "").lower()
        for snippet in case.payload_contains:
            assert snippet.lower() in payload, "case=%s payload missing %r" % (case.id, snippet)
        return

    if case.expected_route == "knowledge":
        assert outcome.context, "case=%s knowledge route but empty context" % case.id
        ctx_lower = outcome.context.lower()
        for snippet in case.context_contains:
            assert snippet.lower() in ctx_lower, (
                "case=%s context missing %r\n%s" % (case.id, snippet, outcome.context)
            )


def _run_case(case: RetrievalCase, *, retrieval_log: bool) -> None:
    outcome = evaluate_retrieval(SNAPSHOT_PROPERTY_ID, case.guest_message)
    report = (
        log_retrieval_report(outcome, case_id=case.id)
        if retrieval_log
        else format_retrieval_report(outcome, case_id=case.id)
    )
    try:
        _assert_case(outcome, case)
    except AssertionError as exc:
        raise AssertionError("%s\n%s" % (exc, report)) from exc


@pytest.mark.parametrize("case", ALL_CASES, ids=[c.id for c in ALL_CASES])
def test_retrieval_case(
    case: RetrievalCase,
    skip_without_integration,
    embedded_source_count,
    retrieval_log,
):
    _run_case(case, retrieval_log=retrieval_log)


def test_snapshot_has_exact_feature_and_freeform_sources(skip_without_integration):
    db = KnowledgeRetrievalDatabase()
    rows = db.fetch_embedded_sources(SNAPSHOT_PROPERTY_ID)
    sources = {row["source"] for row in rows}
    assert "exact" in sources
    assert "feature" in sources
    assert "freeform" in sources


def test_wifi_beats_unrelated_in_ranking(skip_without_integration, retrieval_log):
    outcome = evaluate_retrieval(SNAPSHOT_PROPERTY_ID, "What's the WiFi password?")
    if retrieval_log:
        log_retrieval_report(outcome, case_id="wifi_sanity")
    assert outcome.route == RetrievalRoute.KNOWLEDGE
    assert row_matches(outcome.top_row, source="feature", feature_name="Wi-Fi")


def test_exact_threshold_boundary_uses_stored_answer_not_llm_context(
    skip_without_integration, retrieval_log
):
    """When top hit is exact above EXACT_THRESHOLD, route is exact (no knowledge context)."""
    outcome = evaluate_retrieval(SNAPSHOT_PROPERTY_ID, "How do I throw away the trash?")
    if retrieval_log:
        log_retrieval_report(outcome, case_id="exact_trash_sanity")
    assert outcome.route == RetrievalRoute.EXACT
    assert outcome.top_score >= EXACT_THRESHOLD
    assert outcome.context is None


def test_below_knowledge_threshold_routes_general(skip_without_integration, retrieval_log):
    outcome = evaluate_retrieval(SNAPSHOT_PROPERTY_ID, "What's the capital of France?")
    if retrieval_log:
        log_retrieval_report(outcome, case_id="general_sanity")
    assert outcome.route == RetrievalRoute.GENERAL
    assert outcome.top_score < KNOWLEDGE_THRESHOLD or outcome.context is None
