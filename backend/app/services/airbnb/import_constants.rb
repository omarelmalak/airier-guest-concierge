# frozen_string_literal: true

module Airbnb
  module ImportConstants
    # Must match frontend Step1BasicDetails select options exactly.
    PROPERTY_TYPES = %w[
      Apartment House Cabin Villa Condo Studio Loft Townhouse
    ].freeze

    OWNERSHIP_LEVELS = [
      "Entire place",
      "Private room",
      "Shared room"
    ].freeze

    KNOWLEDGE_CATEGORIES = [
      {
        id: "075ff937-13ac-4784-af16-a77222fd153b",
        name: "Amenities",
        pkc_role: "Additional info only — not an overview. Facts that do not fit any Amenities feature row."
      },
      {
        id: "150b8197-09d2-439d-977e-28fc0731cdcc",
        name: "Rules",
        pkc_role: "Additional info only — not an overview. Facts that do not fit any Rules feature row."
      },
      {
        id: "34fa4dd6-4af2-4872-a3f8-2e3699db6d61",
        name: "WhereIs",
        pkc_role: "Additional info only — in-unit locations not covered by feature rows."
      },
      {
        id: "63b672d2-375d-4c3f-982e-a2f61f8c8bdb",
        name: "Recommendations",
        pkc_role: "Additional info only — facts that do not fit any Recommendations feature row."
      }
    ].freeze

    CATEGORY_RECOMMENDATIONS = "63b672d2-375d-4c3f-982e-a2f61f8c8bdb"

    # Labels must match frontend defaultRecommendations + features table names.
    RECOMMENDATION_FEATURE_NAMES = [
      "Restaurants",
      "Grocery Stores",
      "Hospital / Pharmacy",
      "Transport",
      "Nightlife",
      "Attractions"
    ].freeze

    # Every feature the concierge supports. LLM must use these exact IDs.
    FEATURES = [
      { id: "13c756d7-0ccd-4814-9dff-f406582a3d81", name: "Wi-Fi", category_id: "075ff937-13ac-4784-af16-a77222fd153b", category: "Amenities" },
      { id: "b6b7b39a-c486-4e2c-9cba-13b1cb06376a", name: "Kitchen", category_id: "075ff937-13ac-4784-af16-a77222fd153b", category: "Amenities" },
      { id: "da349037-78c5-4b25-8414-dc379be69ade", name: "A/C", category_id: "075ff937-13ac-4784-af16-a77222fd153b", category: "Amenities" },
      { id: "31886ef3-eec1-4c52-883c-9103321d0f75", name: "Coffee Maker", category_id: "075ff937-13ac-4784-af16-a77222fd153b", category: "Amenities" },
      { id: "f4fd7b2c-1d3e-4774-8ac0-83e3a20b2631", name: "Cleaning Supplies", category_id: "075ff937-13ac-4784-af16-a77222fd153b", category: "Amenities" },
      { id: "21c045e5-e30b-4164-b872-338d38d42145", name: "Extra Bedding", category_id: "075ff937-13ac-4784-af16-a77222fd153b", category: "Amenities" },
      { id: "4882fda6-d956-4877-8967-8ceae7204f0c", name: "Towels", category_id: "075ff937-13ac-4784-af16-a77222fd153b", category: "Amenities" },
      { id: "e9e018a9-d98f-4fcf-a260-1b301d2fd6b7", name: "Safe/Lockbox", category_id: "075ff937-13ac-4784-af16-a77222fd153b", category: "Amenities" },
      { id: "fae5e323-bba0-4922-b06c-f8d42b07ad61", name: "TV", category_id: "075ff937-13ac-4784-af16-a77222fd153b", category: "Amenities" },
      { id: "3e8300a3-3c98-492b-a217-ed8a947871df", name: "Laundry", category_id: "075ff937-13ac-4784-af16-a77222fd153b", category: "Amenities" },
      { id: "863ad039-0a79-43c5-8c75-b83faefc3c85", name: "Pots & Pans", category_id: "075ff937-13ac-4784-af16-a77222fd153b", category: "Amenities" },
      { id: "409d362e-02f0-4f13-b206-2f9b6dfff5fe", name: "Parking", category_id: "075ff937-13ac-4784-af16-a77222fd153b", category: "Amenities" },
      { id: "3dbf7e12-f749-453b-b70c-93d7c740edaa", name: "Gym", category_id: "075ff937-13ac-4784-af16-a77222fd153b", category: "Amenities" },
      { id: "976ca6d6-0a37-4b77-9982-f2a2d3d4450a", name: "Hot Tub", category_id: "075ff937-13ac-4784-af16-a77222fd153b", category: "Amenities" },
      { id: "f5ccbead-bbc4-45e8-ba4d-a77f04245049", name: "Workspace", category_id: "075ff937-13ac-4784-af16-a77222fd153b", category: "Amenities" },
      { id: "0a49bbf4-3f23-4a9d-8f4d-6ca408019b87", name: "First Aid Kit", category_id: "075ff937-13ac-4784-af16-a77222fd153b", category: "Amenities" },
      { id: "efdd03ec-72e2-473f-b643-7fc0023b936d", name: "Fire Extinguisher", category_id: "075ff937-13ac-4784-af16-a77222fd153b", category: "Amenities" },
      { id: "97c0a7c8-b940-466f-9f4e-8189de36bbb9", name: "Heating", category_id: "075ff937-13ac-4784-af16-a77222fd153b", category: "Amenities" },

      { id: "70a1bfb9-708d-4fc8-94ba-0da9a6a58738", name: "Pets Allowed", category_id: "150b8197-09d2-439d-977e-28fc0731cdcc", category: "Rules" },
      { id: "52518e46-da71-418d-9f5f-cd2f8edd6411", name: "Smoking Allowed", category_id: "150b8197-09d2-439d-977e-28fc0731cdcc", category: "Rules" },
      { id: "b57a4aa2-72e0-4148-916b-e79fe1faefb3", name: "Parties Allowed", category_id: "150b8197-09d2-439d-977e-28fc0731cdcc", category: "Rules" },
      { id: "071a0f19-91e6-4dc7-9a9b-9533df1d84a6", name: "Quiet Hours", category_id: "150b8197-09d2-439d-977e-28fc0731cdcc", category: "Rules" },
      { id: "cc917a03-d954-468a-a2b9-cf2fa6d082c0", name: "Children Allowed", category_id: "150b8197-09d2-439d-977e-28fc0731cdcc", category: "Rules" }
    ].freeze

    RECOMMENDATION_FEATURES = [
      { id: "0369e6a9-c7d4-4162-ac03-4fc4cd8ce208", name: "Grocery Stores", category_id: CATEGORY_RECOMMENDATIONS, category: "Recommendations" },
      { id: "8011056b-bd88-41e6-9d60-ce83b2cc991e", name: "Restaurants", category_id: CATEGORY_RECOMMENDATIONS, category: "Recommendations" },
      { id: "b4bbe5a8-8966-4fe4-a408-04d1e1e7ed8a", name: "Hospital / Pharmacy", category_id: CATEGORY_RECOMMENDATIONS, category: "Recommendations" },
      { id: "91c310bd-c895-4694-a418-9da1ae02fa57", name: "Transport", category_id: CATEGORY_RECOMMENDATIONS, category: "Recommendations" },
      { id: "1af3ace9-8f92-46f9-bd01-8572e36ddc4f", name: "Nightlife", category_id: CATEGORY_RECOMMENDATIONS, category: "Recommendations" },
      { id: "1ab5ccbc-555d-4855-be7a-ad7a4fe36e3e", name: "Attractions", category_id: CATEGORY_RECOMMENDATIONS, category: "Recommendations" }
    ].freeze

    def self.recommendation_features
      RECOMMENDATION_FEATURES
    end

    def self.ensure_recommendation_features_in_db!
      RECOMMENDATION_FEATURES.each do |row|
        Feature.find_or_create_by!(id: row[:id]) do |f|
          f.name = row[:name]
        end
      end
    end

    def self.amenities_features
      FEATURES.select { |f| f[:category] == "Amenities" }
    end

    def self.rules_features
      FEATURES.select { |f| f[:category] == "Rules" }
    end

    def self.all_features
      amenities_features + rules_features + recommendation_features
    end

    def self.feature_ids
      all_features.map { |f| f[:id] }
    end

    CATEGORY_IDS = KNOWLEDGE_CATEGORIES.map { |c| c[:id] }.freeze
  end
end
