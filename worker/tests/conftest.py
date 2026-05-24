import os

import pytest

# El-Malak / snapshot property (only property in test DB per product notes)
SNAPSHOT_PROPERTY_ID = "b1b9e95e-b065-4434-a9bf-81101b04da9f"


def integration_enabled() -> bool:
    return bool(os.environ.get("DATABASE_URL") and os.environ.get("COHERE_API_KEY"))


@pytest.fixture
def snapshot_property_id() -> str:
    return SNAPSHOT_PROPERTY_ID


@pytest.fixture
def skip_without_integration():
    if not integration_enabled():
        pytest.skip("Set DATABASE_URL and COHERE_API_KEY (e.g. doppler run) for integration tests")


def pytest_addoption(parser):
    parser.addoption(
        "--no-retrieval-log",
        action="store_true",
        default=False,
        help="Disable per-test retrieval debug output (integration tests)",
    )


@pytest.fixture
def retrieval_log(request):
    """When True, integration tests print ranked matches and LLM property context."""
    return not request.config.getoption("--no-retrieval-log")
