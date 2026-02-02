import { AmenityItem, WhereIsItem, RecommendationCategory, RuleItem } from "@/lib/static-data/client-types";
import { AmenitiesSection } from "@/components/knowledge/AmenitiesSection";
import { WhereIsSection } from "@/components/knowledge/WhereIsSection";
import { LocalRecommendationsSection } from "@/components/knowledge/LocalRecommendationsSection";
import { RulesSection } from "@/components/knowledge/RulesSection";

interface Step3KnowledgeProps {
  currentSubStep: number; // 3, 4, 5, or 6
  amenities?: AmenityItem[];
  setAmenities: (amenities: AmenityItem[] | undefined) => void;
  otherAmenities: string;
  setOtherAmenities: (value: string) => void;
  whereIsItems?: WhereIsItem[];
  setWhereIsItems: (items: WhereIsItem[] | undefined) => void;
  otherWhereIs: string;
  setOtherWhereIs: (value: string) => void;
  recommendations?: RecommendationCategory[];
  setRecommendations: (recommendations: RecommendationCategory[] | undefined) => void;
  otherRecommendations: string;
  setOtherRecommendations: (value: string) => void;
  rules?: RuleItem[];
  setRules: (rules: RuleItem[] | undefined) => void;
  otherRules: string;
  setOtherRules: (value: string) => void;
}

export const Step3Knowledge = ({
  currentSubStep,
  amenities,
  setAmenities,
  otherAmenities,
  setOtherAmenities,
  whereIsItems,
  setWhereIsItems,
  otherWhereIs,
  setOtherWhereIs,
  recommendations,
  setRecommendations,
  otherRecommendations,
  setOtherRecommendations,
  rules,
  setRules,
  otherRules,
  setOtherRules,
}: Step3KnowledgeProps) => {
  // Step 3: Amenities
  if (currentSubStep === 3) {
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">Amenities</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Select the amenities available at your property and add details.
          </p>
        </div>
        <AmenitiesSection
          amenities={amenities}
          setAmenities={setAmenities}
          otherAmenities={otherAmenities}
          setOtherAmenities={setOtherAmenities}
        />
      </div>
    );
  }

  // Step 4: Where Is
  if (currentSubStep === 4) {
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">Where is?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Help guests find common items around your property.
          </p>
        </div>
        <WhereIsSection
          items={whereIsItems}
          setItems={setWhereIsItems}
          otherItems={otherWhereIs}
          setOtherItems={setOtherWhereIs}
        />
      </div>
    );
  }

  // Step 5: Local Recommendations
  if (currentSubStep === 5) {
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">Local Recommendations</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Share your favorite local spots with guests.
          </p>
        </div>
        <LocalRecommendationsSection
          recommendations={recommendations}
          setRecommendations={setRecommendations}
          otherRecommendations={otherRecommendations}
          setOtherRecommendations={setOtherRecommendations}
        />
      </div>
    );
  }

  // Step 6: Rules
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-1">Rules & Policies</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Set clear expectations for your guests.
        </p>
      </div>
      <RulesSection
        rules={rules}
        setRules={setRules}
        otherRules={otherRules}
        setOtherRules={setOtherRules}
      />
    </div>
  );
};
