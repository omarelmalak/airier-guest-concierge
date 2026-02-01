import { useState } from "react";
import { 
  Wifi, Car, Droplets, Tv, ChefHat, WashingMachine, Thermometer, Wind, 
  Dumbbell, Flame, Coffee, Utensils, Bath, Bed, Lock, Speaker,
  MapPin, ShoppingCart, Stethoscope, Bus, Moon, Plane, UtensilsCrossed,
  Wine, Fuel, Pill, Building, Theater, Music, Beer, TreePine,
  Volume2, Dog, Cigarette, PartyPopper, Clock, Baby, Trash2,
  Plus, ChevronDown, ChevronUp
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// ============ AMENITIES ============
export interface AmenityItem {
  id: string;
  label: string;
  icon: React.ElementType;
  enabled: boolean;
  details?: string;
}

export const defaultAmenities: AmenityItem[] = [
  { id: "wifi", label: "Wi-Fi", icon: Wifi, enabled: false },
  { id: "parking", label: "Parking", icon: Car, enabled: false },
  { id: "pool", label: "Pool", icon: Droplets, enabled: false },
  { id: "tv", label: "TV", icon: Tv, enabled: false },
  { id: "kitchen", label: "Kitchen", icon: ChefHat, enabled: false },
  { id: "laundry", label: "Laundry", icon: WashingMachine, enabled: false },
  { id: "ac", label: "A/C", icon: Thermometer, enabled: false },
  { id: "heating", label: "Heating", icon: Flame, enabled: false },
  { id: "gym", label: "Gym", icon: Dumbbell, enabled: false },
  { id: "hottub", label: "Hot Tub", icon: Bath, enabled: false },
  { id: "coffee", label: "Coffee Maker", icon: Coffee, enabled: false },
  { id: "workspace", label: "Workspace", icon: Utensils, enabled: false },
];

interface AmenitiesSectionProps {
  amenities: AmenityItem[];
  setAmenities: (a: AmenityItem[]) => void;
  otherAmenities: string;
  setOtherAmenities: (s: string) => void;
  compact?: boolean;
}

export const AmenitiesSection = ({
  amenities,
  setAmenities,
  otherAmenities,
  setOtherAmenities,
  compact = false,
}: AmenitiesSectionProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleAmenity = (id: string) => {
    setAmenities(
      amenities.map((a) =>
        a.id === id ? { ...a, enabled: !a.enabled } : a
      )
    );
  };

  const updateDetails = (id: string, details: string) => {
    setAmenities(
      amenities.map((a) => (a.id === id ? { ...a, details } : a))
    );
  };

  return (
    <div className="space-y-4">
      <div className={cn("grid gap-3", compact ? "grid-cols-3 sm:grid-cols-4" : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4")}>
        {amenities.map((amenity) => {
          const Icon = amenity.icon;
          const isExpanded = expandedId === amenity.id && amenity.enabled;
          
          return (
            <div key={amenity.id} className="space-y-2">
              <button
                type="button"
                onClick={() => toggleAmenity(amenity.id)}
                className={cn(
                  "w-full flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200",
                  amenity.enabled
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border bg-card hover:border-muted-foreground/30 text-muted-foreground"
                )}
              >
                <Icon className={cn("w-6 h-6", compact && "w-5 h-5")} />
                <span className={cn("text-sm font-medium", compact && "text-xs")}>{amenity.label}</span>
              </button>
              
              {amenity.enabled && !compact && (
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : amenity.id)}
                  className="w-full text-xs text-muted-foreground hover:text-foreground flex items-center justify-center gap-1"
                >
                  {isExpanded ? "Hide details" : "Add details"}
                  {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              )}
              
              {isExpanded && (
                <Input
                  placeholder={`e.g., Password: MyWifi123`}
                  value={amenity.details || ""}
                  onChange={(e) => updateDetails(amenity.id, e.target.value)}
                  className="text-sm"
                />
              )}
            </div>
          );
        })}
      </div>
      
      <div className="pt-4 border-t border-border">
        <Label className="text-sm text-muted-foreground mb-2 block">
          Other amenities not listed above
        </Label>
        <Textarea
          placeholder="Add any other amenities..."
          value={otherAmenities}
          onChange={(e) => setOtherAmenities(e.target.value)}
          className="min-h-[80px] resize-none"
        />
      </div>
    </div>
  );
};

// ============ WHERE IS ============
export interface WhereIsItem {
  id: string;
  label: string;
  icon: React.ElementType;
  location: string;
}

export const defaultWhereIsItems: WhereIsItem[] = [
  { id: "towels", label: "Towels", icon: Bath, location: "" },
  { id: "bedding", label: "Extra Bedding", icon: Bed, location: "" },
  { id: "pots", label: "Pots & Pans", icon: Utensils, location: "" },
  { id: "remote", label: "TV Remote", icon: Tv, location: "" },
  { id: "cleaning", label: "Cleaning Supplies", icon: Trash2, location: "" },
  { id: "thermostat", label: "Thermostat", icon: Thermometer, location: "" },
  { id: "safe", label: "Safe/Lockbox", icon: Lock, location: "" },
  { id: "speaker", label: "Bluetooth Speaker", icon: Speaker, location: "" },
];

interface WhereIsSectionProps {
  items: WhereIsItem[];
  setItems: (items: WhereIsItem[]) => void;
  otherItems: string;
  setOtherItems: (s: string) => void;
  compact?: boolean;
}

export const WhereIsSection = ({
  items,
  setItems,
  otherItems,
  setOtherItems,
  compact = false,
}: WhereIsSectionProps) => {
  const [activeItems, setActiveItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    const newActive = new Set(activeItems);
    if (newActive.has(id)) {
      newActive.delete(id);
      setItems(items.map((i) => (i.id === id ? { ...i, location: "" } : i)));
    } else {
      newActive.add(id);
    }
    setActiveItems(newActive);
  };

  const updateLocation = (id: string, location: string) => {
    setItems(items.map((i) => (i.id === id ? { ...i, location } : i)));
  };

  return (
    <div className="space-y-4">
      <div className={cn("grid gap-3", compact ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-2")}>
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeItems.has(item.id) || item.location.length > 0;

          return (
            <div
              key={item.id}
              className={cn(
                "rounded-xl border-2 transition-all duration-200 overflow-hidden",
                isActive
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card"
              )}
            >
              <button
                type="button"
                onClick={() => toggleItem(item.id)}
                className="w-full flex items-center gap-3 p-3"
              >
                <div className={cn(
                  "p-2 rounded-lg",
                  isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                )}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className={cn(
                  "text-sm font-medium",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )}>
                  {item.label}
                </span>
                <Plus className={cn(
                  "w-4 h-4 ml-auto transition-transform",
                  isActive && "rotate-45"
                )} />
              </button>
              
              {isActive && (
                <div className="px-3 pb-3">
                  <Input
                    placeholder={`Where can guests find ${item.label.toLowerCase()}?`}
                    value={item.location}
                    onChange={(e) => updateLocation(item.id, e.target.value)}
                    className="text-sm"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="pt-4 border-t border-border">
        <Label className="text-sm text-muted-foreground mb-2 block">
          Other items not listed above
        </Label>
        <Textarea
          placeholder="Add any other item locations..."
          value={otherItems}
          onChange={(e) => setOtherItems(e.target.value)}
          className="min-h-[80px] resize-none"
        />
      </div>
    </div>
  );
};

// ============ LOCAL RECOMMENDATIONS ============
export interface RecommendationCategory {
  id: string;
  label: string;
  icon: React.ElementType;
  recommendations: string;
}

export const defaultRecommendations: RecommendationCategory[] = [
  { id: "restaurants", label: "Restaurants", icon: UtensilsCrossed, recommendations: "" },
  { id: "grocery", label: "Grocery Stores", icon: ShoppingCart, recommendations: "" },
  { id: "hospital", label: "Hospital / Pharmacy", icon: Stethoscope, recommendations: "" },
  { id: "transport", label: "Transport", icon: Bus, recommendations: "" },
  { id: "nightlife", label: "Nightlife", icon: Moon, recommendations: "" },
  { id: "attractions", label: "Attractions", icon: Theater, recommendations: "" },
];

interface LocalRecommendationsSectionProps {
  recommendations: RecommendationCategory[];
  setRecommendations: (r: RecommendationCategory[]) => void;
  compact?: boolean;
}

export const LocalRecommendationsSection = ({
  recommendations,
  setRecommendations,
  compact = false,
}: LocalRecommendationsSectionProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const updateRecommendation = (id: string, value: string) => {
    setRecommendations(
      recommendations.map((r) => (r.id === id ? { ...r, recommendations: value } : r))
    );
  };

  return (
    <div className="space-y-3">
      {recommendations.map((category) => {
        const Icon = category.icon;
        const hasContent = category.recommendations.length > 0;
        const isExpanded = expandedId === category.id;

        return (
          <div
            key={category.id}
            className={cn(
              "rounded-xl border-2 transition-all duration-200 overflow-hidden",
              hasContent
                ? "border-primary bg-primary/5"
                : "border-border bg-card"
            )}
          >
            <button
              type="button"
              onClick={() => setExpandedId(isExpanded ? null : category.id)}
              className="w-full flex items-center gap-3 p-4"
            >
              <div className={cn(
                "p-2 rounded-lg",
                hasContent ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
              )}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={cn(
                "text-sm font-medium flex-1 text-left",
                hasContent ? "text-foreground" : "text-muted-foreground"
              )}>
                {category.label}
              </span>
              {hasContent && (
                <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  Added
                </span>
              )}
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
            
            {isExpanded && (
              <div className="px-4 pb-4">
                <Textarea
                  placeholder={`Add your ${category.label.toLowerCase()} recommendations...`}
                  value={category.recommendations}
                  onChange={(e) => updateRecommendation(category.id, e.target.value)}
                  className="min-h-[100px] resize-none text-sm"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// ============ RULES & POLICIES ============
export interface RuleItem {
  id: string;
  label: string;
  icon: React.ElementType;
  enabled: boolean;
  details?: string;
  type: "toggle" | "time";
}

export const defaultRules: RuleItem[] = [
  { id: "quiet", label: "Quiet Hours", icon: Volume2, enabled: false, type: "time" },
  { id: "pets", label: "Pets Allowed", icon: Dog, enabled: false, type: "toggle" },
  { id: "smoking", label: "Smoking Allowed", icon: Cigarette, enabled: false, type: "toggle" },
  { id: "parties", label: "Parties Allowed", icon: PartyPopper, enabled: false, type: "toggle" },
  { id: "children", label: "Children Allowed", icon: Baby, enabled: false, type: "toggle" },
];

interface RulesSectionProps {
  rules: RuleItem[];
  setRules: (r: RuleItem[]) => void;
  otherRules: string;
  setOtherRules: (s: string) => void;
  compact?: boolean;
}

export const RulesSection = ({
  rules,
  setRules,
  otherRules,
  setOtherRules,
}: RulesSectionProps) => {
  const toggleRule = (id: string) => {
    setRules(rules.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
  };

  const updateDetails = (id: string, details: string) => {
    setRules(rules.map((r) => (r.id === id ? { ...r, details } : r)));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {rules.map((rule) => {
          const Icon = rule.icon;

          return (
            <div
              key={rule.id}
              className={cn(
                "rounded-xl border-2 transition-all duration-200 p-4",
                rule.enabled
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card"
              )}
            >
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => toggleRule(rule.id)}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    rule.enabled ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}
                >
                  <Icon className="w-5 h-5" />
                </button>
                <span className={cn(
                  "text-sm font-medium flex-1",
                  rule.enabled ? "text-foreground" : "text-muted-foreground"
                )}>
                  {rule.label}
                </span>
                <button
                  type="button"
                  onClick={() => toggleRule(rule.id)}
                  className={cn(
                    "w-12 h-7 rounded-full transition-colors relative",
                    rule.enabled ? "bg-primary" : "bg-muted"
                  )}
                >
                  <div
                    className={cn(
                      "absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform",
                      rule.enabled ? "translate-x-6" : "translate-x-1"
                    )}
                  />
                </button>
              </div>
              
              {rule.enabled && rule.type === "time" && (
                <div className="mt-3 pl-11">
                  <Input
                    placeholder="e.g., 10 PM - 8 AM"
                    value={rule.details || ""}
                    onChange={(e) => updateDetails(rule.id, e.target.value)}
                    className="text-sm"
                  />
                </div>
              )}
              
              {rule.enabled && rule.id === "pets" && (
                <div className="mt-3 pl-11">
                  <Input
                    placeholder="e.g., Small dogs only, $50 pet fee"
                    value={rule.details || ""}
                    onChange={(e) => updateDetails(rule.id, e.target.value)}
                    className="text-sm"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="pt-4 border-t border-border">
        <Label className="text-sm text-muted-foreground mb-2 block">
          Additional rules and policies
        </Label>
        <Textarea
          placeholder="Add any other rules..."
          value={otherRules}
          onChange={(e) => setOtherRules(e.target.value)}
          className="min-h-[80px] resize-none"
        />
      </div>
    </div>
  );
};
