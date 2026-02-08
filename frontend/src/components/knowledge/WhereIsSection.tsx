import { Bath, Bed, Utensils, Tv, Trash2, Thermometer, Lock, Speaker, Plus } from "lucide-react";
import { FeatureItem } from "@/lib/static-data/client-types";
import { cn } from "@/lib/utils/common";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toggleItem, updateDetails } from "@/lib/utils/knowledge-utils";

interface WhereIsSectionProps {
    items: FeatureItem[];
    setItems: (items: FeatureItem[]) => void;
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
    const handleToggleItem = (id: string) => {
        toggleItem(id, items, setItems);
    };

    const handleUpdateDetails = (id: string, details: string) => {
        updateDetails(id, details, items, setItems);
    };

    return (
        <div className="space-y-4">
            <div className={cn("grid gap-3", compact ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-2")}>
                {items.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.enabled || (item.details && item.details.length > 0);

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
                                onClick={() => handleToggleItem(item.id)}
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
                                        value={item.details || ""}
                                        onChange={(e) => handleUpdateDetails(item.id, e.target.value)}
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