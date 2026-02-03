import { RecommendationItem } from "@/lib/static-data/client-types";
import { UtensilsCrossed, ShoppingCart, Stethoscope, Bus, Moon, Theater } from "lucide-react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Label } from "@/components/ui/label";

interface LocalRecommendationsSectionProps {
    recommendations: RecommendationItem[];
    setRecommendations: (r: RecommendationItem[]) => void;
    otherRecommendations: string;
    setOtherRecommendations: (s: string) => void;
    compact?: boolean;
}

export const LocalRecommendationsSection = ({
    recommendations,
    setRecommendations,
    otherRecommendations,
    setOtherRecommendations,
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
            <div className="pt-4 border-t border-border">
                <Label className="text-sm text-muted-foreground mb-2 block">
                    Other recommendations not listed above
                </Label>
                <Textarea
                    placeholder="Add any other recommendations..."
                    value={otherRecommendations}
                    onChange={(e) => setOtherRecommendations(e.target.value)}
                    className="min-h-[80px] resize-none"
                />
            </div>
        </div>
    );
};