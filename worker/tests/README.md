# Worker tests

## CI (GitHub Actions)

On pull requests and pushes to `main` that touch `worker/`, [.github/workflows/worker-tests.yml](../../.github/workflows/worker-tests.yml) runs:

| Job | Needs |
|-----|--------|
| **unit tests** | Nothing |
| **integration tests** | Repository secrets `COHERE_API_KEY` and `DATABASE_URL` |

Configure secrets under **Settings → Secrets and variables → Actions**. `DATABASE_URL` must reach the database that contains snapshot property `b1b9e95e-b065-4434-a9bf-81101b04da9f` with embeddings populated (same DB you use locally with Doppler).

Integration jobs do not run on PRs from forks (GitHub does not expose secrets to fork workflows).

## Unit (no API keys)

From `worker/`:

```bash
make test
# or: .venv/bin/pytest tests/ -v -m "not integration"
```

Covers `knowledge_ranker` parsing, cosine ranking, and `build_context` formatting (including empty feature descriptions).

## Integration (snapshot property)

Requires `DATABASE_URL` and `COHERE_API_KEY`, plus embedded rows for property `b1b9e95e-b065-4434-a9bf-81101b04da9f`.

```bash
make test-integration
# or: doppler run -- .venv/bin/pytest tests/test_property_retrieval_integration.py -v -m integration -s
```

Each case prints a **retrieval report**: top ranked rows (with scores), the **property context block** the knowledge LLM receives (not the base system prompt), exact-answer payload when relevant, and the guest user turn.

Suppress logs: add `--no-retrieval-log` (assertions still attach the report on failure).

Cases live in `tests/fixtures/sample_apartment.py` (property `b1b9e95e-b065-4434-a9bf-81101b04da9f`).

A passing test means production **would** take that path: exact (stored answer), knowledge (non-empty `build_context`), or general (weak matches). If the right content ranks first but scores are below threshold, the test **fails**—fix thresholds, embeddings, or guest phrasing; do not waive routing.

General/out-of-domain cases only assert `route=general` and a score cap, not which row is #1.

To add a case, append a `RetrievalCase` to `ALL_CASES` with a stable `id` and run integration tests locally.
