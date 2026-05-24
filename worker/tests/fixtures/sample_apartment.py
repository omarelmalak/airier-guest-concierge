"""
Retrieval test cases for property b1b9e95e-b065-4434-a9bf-81101b04da9f (El-Malak snapshot).

Integration tests embed live guest queries (Cohere search_query) and rank against
DB embeddings. Thresholds match knowledge_ranker.py / reasoner.py.
"""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class RetrievalCase:
    """One guest message and expectations for retrieval routing."""

    id: str
    guest_message: str
    expected_route: str  # exact | knowledge | general
    # Top-1 expectations (when route is exact or knowledge)
    expected_source: str | None = None
    expected_feature: str | None = None
    expected_category: str | None = None
    context_contains: tuple[str, ...] = ()
    payload_contains: tuple[str, ...] = ()
    # For exact/knowledge: minimum similarity on the asserted top match
    min_top_score: float | None = None
    # For general / out-of-domain: cap how strong the best match may be
    max_top_score: float | None = None
    # If top-1 is brittle, require a match within top N at min_score
    also_accept_in_top_n: tuple[dict, ...] = ()
    top_n: int = 5


# --- Feature with description ---
WIFI_PASSWORD = RetrievalCase(
    id="feature_wifi_password",
    guest_message="What's the WiFi password?",
    expected_route="knowledge",
    expected_source="feature",
    expected_feature="Wi-Fi",
    expected_category="Amenities",
    context_contains=("Wi-Fi", "Toronto@2022"),
    min_top_score=0.5,
)

PARKING_DETAIL = RetrievalCase(
    id="feature_parking_multisentence",
    guest_message="How does parking work at the building?",
    expected_route="knowledge",
    expected_source="feature",
    expected_feature="Parking",
    expected_category="Amenities",
    context_contains=("Parking", "P2", "permit"),
    min_top_score=0.5,
)

KITCHEN_DETAIL = RetrievalCase(
    id="feature_kitchen",
    guest_message="What kitchen stuff is available?",
    expected_route="knowledge",
    expected_source="feature",
    expected_feature="Kitchen",
    expected_category="Amenities",
    context_contains=("Kitchen", "pots"),
    min_top_score=0.5,
)

# --- Feature exists, empty description ---
SAFE_NO_DETAIL = RetrievalCase(
    id="feature_safe_no_description",
    guest_message="Where is the safe or lockbox?",
    expected_route="knowledge",
    expected_source="feature",
    expected_feature="Safe/Lockbox",
    expected_category="WhereIs",
    context_contains=("Safe/Lockbox", "no further details"),
    min_top_score=0.5,
)

CHILDREN_NO_DETAIL = RetrievalCase(
    id="feature_children_allowed_no_description",
    guest_message="Are children allowed to stay?",
    expected_route="knowledge",
    expected_source="feature",
    expected_feature="Children Allowed",
    expected_category="Rules",
    context_contains=("Children Allowed", "no further details"),
    min_top_score=0.5,
)

# --- WhereIs feature with description ---
TOWELS_WHERE = RetrievalCase(
    id="feature_towels_whereis",
    guest_message="Where are the towels in the drawer under the bed?",
    expected_route="knowledge",
    expected_source="feature",
    expected_feature="Towels",
    expected_category="WhereIs",
    context_contains=("Towels", "drawer"),
    min_top_score=0.5,
)

TV_REMOTE = RetrievalCase(
    id="feature_tv_remote",
    guest_message="Where is the TV remote?",
    expected_route="knowledge",
    expected_source="feature",
    expected_feature="TV Remote",
    expected_category="WhereIs",
    context_contains=("TV Remote", "PS5"),
    min_top_score=0.5,
)

# --- Freeform property_knowledge_categories ---
BALCONY_FREEFORM = RetrievalCase(
    id="freeform_balcony_amenities",
    guest_message="Can I go out on the balcony? Will the floor be wet?",
    expected_route="knowledge",
    expected_source="freeform",
    expected_category="Amenities",
    context_contains=("balcony", "socks"),
    min_top_score=0.5,
)

CIGARETTE_FREEFORM = RetrievalCase(
    id="freeform_cigarette_rules",
    guest_message="Can I smoke on the balcony?",
    expected_route="knowledge",
    expected_source="freeform",
    expected_category="Rules",
    context_contains=("cigarette", "balcony"),
    min_top_score=0.5,
)

YOGA_MAT_FREEFORM = RetrievalCase(
    id="freeform_yoga_mat_whereis",
    guest_message="Is there a yoga mat in the unit?",
    expected_route="knowledge",
    expected_source="freeform",
    expected_category="WhereIs",
    context_contains=("yoga mat", "foam roller"),
    min_top_score=0.5,
)

PARK_RECOMMENDATION = RetrievalCase(
    id="freeform_taddle_creek_or_grocery",
    guest_message="Any parks or grocery stores nearby?",
    expected_route="knowledge",
    context_contains=(),  # top may be Grocery Stores feature OR Recommendations freeform
    min_top_score=0.5,
    also_accept_in_top_n=(
        {"source": "feature", "feature_name": "Grocery Stores", "category_name": "Recommendations"},
        {"source": "freeform", "category_name": "Recommendations"},
    ),
)

# --- Exact answers (precise + paraphrase) ---
EXACT_TRASH_PRECISE = RetrievalCase(
    id="exact_trash_precise",
    guest_message="How do I throw away the trash?",
    expected_route="exact",
    expected_source="exact",
    payload_contains=("chute", "recycling"),
    min_top_score=0.6,
)

EXACT_TRASH_PARAPHRASE = RetrievalCase(
    id="exact_trash_paraphrase",
    guest_message="Where does garbage go in this building?",
    expected_route="exact",
    expected_source="exact",
    payload_contains=("chute",),
    min_top_score=0.5,
)

EXACT_GUEST_ACCESS_PRECISE = RetrievalCase(
    id="exact_guest_access_precise",
    guest_message="How do I let guests in?",
    expected_route="exact",
    expected_source="exact",
    payload_contains=("El-Malak", "tablet"),
    min_top_score=0.6,
)

EXACT_GUEST_ACCESS_AMBIGUOUS = RetrievalCase(
    id="exact_guest_access_ambiguous",
    guest_message="How do visitors get into the apartment?",
    expected_route="exact",
    expected_source="exact",
    payload_contains=("El-Malak", "tablet", "door"),
    min_top_score=0.55,
)

EXACT_KEY_CONCIERGE = RetrievalCase(
    id="exact_key_concierge",
    guest_message="Can I leave the key with the building concierge?",
    expected_route="exact",
    expected_source="exact",
    payload_contains=("concierge", "Jack", "1809"),
    min_top_score=0.6,
)

EXACT_GUEST_ROOM = RetrievalCase(
    id="exact_rent_guest_room",
    guest_message="How can I rent the guest room?",
    expected_route="exact",
    expected_source="exact",
    payload_contains=("145", "deposit"),
    min_top_score=0.6,
)

# --- Out of domain → general LLM path ---
OUT_OF_CONTEXT_WEATHER = RetrievalCase(
    id="general_weather",
    guest_message="What's the weather in Tokyo tomorrow?",
    expected_route="general",
    max_top_score=0.44,
)

OUT_OF_CONTEXT_RANDOM = RetrievalCase(
    id="general_unrelated",
    guest_message="Who won the Stanley Cup in 1999?",
    expected_route="general",
    max_top_score=0.44,
)

# --- Should NOT hijack to wrong knowledge ---
OUT_OF_CONTEXT_NO_WIFI_LEAK = RetrievalCase(
    id="general_no_false_wifi",
    guest_message="What's the molecular weight of H2O?",
    expected_route="general",
    max_top_score=0.44,
)

ALL_CASES: tuple[RetrievalCase, ...] = (
    WIFI_PASSWORD,
    PARKING_DETAIL,
    KITCHEN_DETAIL,
    SAFE_NO_DETAIL,
    CHILDREN_NO_DETAIL,
    TOWELS_WHERE,
    TV_REMOTE,
    BALCONY_FREEFORM,
    CIGARETTE_FREEFORM,
    YOGA_MAT_FREEFORM,
    PARK_RECOMMENDATION,
    EXACT_TRASH_PRECISE,
    EXACT_TRASH_PARAPHRASE,
    EXACT_GUEST_ACCESS_PRECISE,
    EXACT_GUEST_ACCESS_AMBIGUOUS,
    EXACT_KEY_CONCIERGE,
    EXACT_GUEST_ROOM,
    OUT_OF_CONTEXT_WEATHER,
    OUT_OF_CONTEXT_RANDOM,
    OUT_OF_CONTEXT_NO_WIFI_LEAK,
)

CASES_BY_ID = {case.id: case for case in ALL_CASES}
