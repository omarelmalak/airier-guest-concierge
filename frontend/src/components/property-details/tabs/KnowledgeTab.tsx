import { FeatureItem } from "@/lib/static-data/client-types";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/common";
import { AmenitiesSection } from "@/components/knowledge/AmenitiesSection";
import { WhereIsSection } from "@/components/knowledge/WhereIsSection";
import { LocalRecommendationsSection } from "@/components/knowledge/LocalRecommendationsSection";
import { RulesSection } from "@/components/knowledge/RulesSection";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { defaultAmenities, defaultWhereIsItems, defaultRecommendations, defaultRules } from "@/lib/static-data/defaults";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPropertyKnowledge, mapPropertyKnowledgeToAddPropertyShape, savePropertyKnowledge, buildPropertyKnowledgePayload } from "@/lib/services/knowledge";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useToast } from "@/hooks/use-toast";

const KnowledgeTab = ({ propertyId }: { propertyId: string }) => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { data: knowledgeData, isLoading, error } = useQuery({
        queryKey: ['property-knowledge', propertyId],
        queryFn: () => getPropertyKnowledge(propertyId),
    });

    const [isSaving, setIsSaving] = useState(false);
    const [activeSection, setActiveSection] = useState<string>("amenities");
    const [amenities, setAmenities] = useState<FeatureItem[]>(defaultAmenities);
    const [otherAmenities, setOtherAmenities] = useState("");
    const [whereIsItems, setWhereIsItems] = useState<FeatureItem[]>(defaultWhereIsItems);
    const [otherWhereIs, setOtherWhereIs] = useState("");
    const [recommendations, setRecommendations] = useState<FeatureItem[]>(defaultRecommendations);
    const [otherRecommendations, setOtherRecommendations] = useState("");
    const [rules, setRules] = useState<FeatureItem[]>(defaultRules);
    const [otherRules, setOtherRules] = useState("");

    useEffect(() => {
        if (!knowledgeData) return;
        const mapped = mapPropertyKnowledgeToAddPropertyShape(knowledgeData);
        setAmenities(mapped.amenities);
        setOtherAmenities(mapped.otherAmenities);
        setWhereIsItems(mapped.whereIsItems);
        setOtherWhereIs(mapped.otherWhereIs);
        setRecommendations(mapped.recommendations);
        setOtherRecommendations(mapped.otherRecommendations);
        setRules(mapped.rules);
        setOtherRules(mapped.otherRules);
    }, [knowledgeData]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await savePropertyKnowledge(
                propertyId,
                buildPropertyKnowledgePayload({
                    amenities,
                    otherAmenities,
                    whereIsItems,
                    otherWhereIs,
                    recommendations,
                    otherRecommendations,
                    rules,
                    otherRules,
                })
            );
            await queryClient.invalidateQueries({ queryKey: ['property-knowledge', propertyId] });
            toast({ title: 'Knowledge saved.', variant: 'default' });
        } catch (e) {
            toast({ title: 'Failed to save knowledge.', variant: 'destructive' });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }
    if (error) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <p className="text-muted-foreground">Failed to load knowledge.</p>
            </div>
        );
    }

    const sections = [
        { id: "amenities", label: "Amenities" },
        { id: "whereis", label: "Where is?" },
        { id: "recommendations", label: "Local Recommendations" },
        { id: "rules", label: "Rules & Policies" },
    ];

    return (
        <div className="space-y-6">
            {/* Section tabs */}
            <div className="flex gap-2 flex-wrap">
                {sections.map((section) => (
                    <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={cn(
                            "px-4 py-2 rounded-full text-sm font-medium transition-all",
                            activeSection === section.id
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                        )}
                    >
                        {section.label}
                    </button>
                ))}
            </div>

            <div className="bg-card rounded-2xl border border-border p-6 shadow-soft">
                {activeSection === "amenities" && (
                    <div>
                        <h3 className="text-lg font-semibold mb-1">Amenities</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Select the amenities available at your property and add details.
                        </p>
                        <AmenitiesSection
                            amenities={amenities}
                            setAmenities={setAmenities}
                            otherAmenities={otherAmenities}
                            setOtherAmenities={setOtherAmenities}
                        />
                    </div>
                )}

                {activeSection === "whereis" && (
                    <div>
                        <h3 className="text-lg font-semibold mb-1">Where is?</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Help guests find common items around your property.
                        </p>
                        <WhereIsSection
                            items={whereIsItems}
                            setItems={setWhereIsItems}
                            otherItems={otherWhereIs}
                            setOtherItems={setOtherWhereIs}
                        />
                    </div>
                )}

                {activeSection === "recommendations" && (
                    <div>
                        <h3 className="text-lg font-semibold mb-1">Local Recommendations</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Share your favorite local spots with guests.
                        </p>
                        <LocalRecommendationsSection
                            recommendations={recommendations}
                            setRecommendations={setRecommendations}
                            otherRecommendations={otherRecommendations}
                            setOtherRecommendations={setOtherRecommendations}
                        />
                    </div>
                )}

                {activeSection === "rules" && (
                    <div>
                        <h3 className="text-lg font-semibold mb-1">Rules & Policies</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Set clear expectations for your guests.
                        </p>
                        <RulesSection
                            rules={rules}
                            setRules={setRules}
                            otherRules={otherRules}
                            setOtherRules={setOtherRules}
                        />
                    </div>
                )}
            </div>

            <div className="flex justify-end">
                <Button
                    className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                    onClick={handleSave}
                    disabled={isSaving}
                >
                    {isSaving ? <LoadingSpinner size="sm" /> : <Save className="w-4 h-4" />}
                    Save Changes
                </Button>
            </div>
        </div>
    );
};

export default KnowledgeTab;