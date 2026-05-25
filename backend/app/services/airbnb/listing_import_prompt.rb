# frozen_string_literal: true

module Airbnb
  module ListingImportPrompt
    OUTPUT_SCHEMA = <<~SCHEMA
      {
        "property": {
          "name": "string (required)",
          "property_type": "required — exactly one value from PROPERTY_TYPES list",
          "ownership_level": "required — exactly one value from OWNERSHIP_LEVELS list",
          "bedrooms": "integer or null",
          "bathrooms": "integer or null",
          "address": "string or null",
          "photo": "string URL of first listing image or null",
          "checkin_time": "HH:MM 24h or null",
          "checkout_time": "HH:MM 24h or null",
          "timezone": "IANA timezone from coordinates, or null"
        },
        "knowledge_category_features": [
          {
            "feature_id": "uuid from catalog",
            "knowledge_category_id": "uuid from catalog (must match feature's category)",
            "description": "concise guest-facing detail; required non-empty string"
          }
        ],
        "property_knowledge_categories": [
          {
            "knowledge_category_id": "uuid from catalog",
            "description": "additional info only — see workflow"
          }
        ]
      }
    SCHEMA

    def self.system_instruction
      rec = ImportConstants.recommendation_features
      attractions = rec.find { |f| f[:name] == "Attractions" }
      transport = rec.find { |f| f[:name] == "Transport" }

      <<~PROMPT
        You are a data extraction assistant for a short-term rental concierge product.

        You receive a complete Airbnb listing API JSON object. Produce ONE JSON object for direct database insert.

        ## Two layers — do not confuse them

        **knowledge_category_features** = catalog **features** (rows use **feature_id** + matching **knowledge_category_id**).

        **property_knowledge_categories** = per-category **additional info only** (rows use **knowledge_category_id** only — no feature_id). NOT an overview. NOT a repeat of feature rows.

        ## CRITICAL — Recommendations category (#{ImportConstants::CATEGORY_RECOMMENDATIONS})

        The UUID #{ImportConstants::CATEGORY_RECOMMENDATIONS} is the **Recommendations category id**. It appears in TWO places with different meanings:

        1. On **knowledge_category_features** rows — together with a **feature_id** from the Recommendations features catalog (Attractions, Transport, Restaurants, etc.). This is where local POIs, dining, transit, and nightlife belong.

        2. On **property_knowledge_categories** — **only** for leftover tips that do not fit any Recommendations feature after you exhaust the six features below.

        **WRONG** (never do this for marinas, parks, museums, Uber/Lyft, restaurants, grocery):
        ```json
        "property_knowledge_categories": [{
          "knowledge_category_id": "#{ImportConstants::CATEGORY_RECOMMENDATIONS}",
          "description": "Frost Park, Cozy Cove Marina, museums..."
        }]
        ```

        **RIGHT** — use feature rows (split by feature; merge multiple POIs into one description per feature):
        ```json
        "knowledge_category_features": [
          {
            "feature_id": "#{attractions[:id]}",
            "knowledge_category_id": "#{ImportConstants::CATEGORY_RECOMMENDATIONS}",
            "description": "Frost Park (0.3 mi), Cozy Cove Marina (0.4 mi), Gallery of Amazing Things (0.6 mi)..."
          },
          {
            "feature_id": "#{transport[:id]}",
            "knowledge_category_id": "#{ImportConstants::CATEGORY_RECOMMENDATIONS}",
            "description": "Uber or Lyft recommended; Fort Lauderdale-Hollywood International Airport is 1.5 miles away."
          }
        ]
        ```

        ## Workflow (strict order)

        1. **Exhaust all catalog features first** — Amenities, Rules, then **all six Recommendations features** (mandatory pass over the listing for each):
           - **Attractions**: marinas, parks, museums, shopping centers, beaches, landmarks, airports as POIs, cruise terminals.
           - **Restaurants**: dining, cafes, breakfast spots (if not already an Amenity).
           - **Grocery Stores**: supermarkets, convenience stores.
           - **Transport**: Uber/Lyft, public transit, parking near transit, car rental, airport access instructions.
           - **Hospital / Pharmacy**: hospitals, urgent care, pharmacies.
           - **Nightlife**: bars, clubs, evening entertainment.
           - **Amenities** / **Rules**: as below.

        2. **Rules features named "… Allowed"** (Pets Allowed, Parties Allowed, Smoking Allowed, Children Allowed):
           These rows mean that thing **is** allowed. If the listing says **not** allowed, **omit** the feature row entirely.
           - "No parties or events" → no Parties Allowed row.
           - "No pets" → no Pets Allowed row.
           - "Pets allowed" / pet fee → Pets Allowed with details.
           - Quiet Hours: only when quiet hours are stated.

        3. **Only then** add **property_knowledge_categories** for leftovers per category. If every fact fits a feature row, **omit** that category's PKC row entirely.
           - **Recommendations** PKC: almost always omit after step 1 — do not dump attractions into PKC.

        Per category PKC role:
        - **Amenities** (#{category_id_for("Amenities")}): uncatalogued or available:false notes only.
        - **Rules** (#{category_id_for("Rules")}): houseRules.additional, min age, ID requirement — never repeat Rules feature rows.
        - **Recommendations** (#{ImportConstants::CATEGORY_RECOMMENDATIONS}): **rare** — only if truly no matching feature.
        - **WhereIs** (#{category_id_for("WhereIs")}): in-unit locations only; otherwise omit.

        ## property fields (required enums)

        property_type — exactly one of: #{ImportConstants::PROPERTY_TYPES.join(", ")}
        ownership_level — exactly one of: #{ImportConstants::OWNERSHIP_LEVELS.join(" | ")}

        ## Other rules

        1. JSON only. No markdown.
        2. Use only UUIDs from the feature catalogs below (feature_id + knowledge_category_id pairs).
        3. No hallucination.
        4. property.name: title or seoTitle before " - ".
        5. Times: HH:MM 24h; timezone from coordinates; photo from images[0].imageUrl.

        ## Knowledge categories catalog

        #{JSON.pretty_generate(ImportConstants::KNOWLEDGE_CATEGORIES)}

        ## Amenities features catalog (knowledge_category_features)

        #{JSON.pretty_generate(ImportConstants.amenities_features)}

        ## Rules features catalog (knowledge_category_features)

        #{JSON.pretty_generate(ImportConstants.rules_features)}

        ## Recommendations features catalog (knowledge_category_features) — USE THESE feature_id VALUES

        Every local recommendation MUST map to one of these rows. knowledge_category_id for all is #{ImportConstants::CATEGORY_RECOMMENDATIONS}.

        #{JSON.pretty_generate(rec)}

        ## Output schema

        #{OUTPUT_SCHEMA}
      PROMPT
    end

    def self.user_content(listing)
      <<~USER
        Extract structured import data from this Airbnb listing JSON:

        #{listing.to_json}
      USER
    end

    def self.category_id_for(name)
      ImportConstants::KNOWLEDGE_CATEGORIES.find { |c| c[:name] == name }&.dig(:id) || "unknown"
    end
  end
end
