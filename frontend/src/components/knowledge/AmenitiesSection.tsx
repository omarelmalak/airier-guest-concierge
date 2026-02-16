import {
    Wifi, Car, Droplets, Tv, ChefHat, WashingMachine, Thermometer,
    Dumbbell, Flame, Coffee, Utensils, Bath, ChevronDown, ChevronUp
} from "lucide-react";
import { FeatureItem } from "@/lib/static-data/client-types";
import { cn } from "@/lib/utils/common";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toggleItem, updateDetails } from "@/lib/utils/knowledge-utils";

interface AmenitiesSectionProps {
    amenities: FeatureItem[];
    setAmenities: (a: FeatureItem[]) => void;
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

    const handleToggleItem = (id: string) => {
        toggleItem(id, amenities, setAmenities);
    };

    const handleUpdateDetails = (id: string, details: string) => {
        updateDetails(id, details, amenities, setAmenities);
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
                                onClick={() => handleToggleItem(amenity.id)}
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
                                    onChange={(e) => handleUpdateDetails(amenity.id, e.target.value)}
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