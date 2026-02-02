import { RuleItem } from "@/lib/static-data/client-types";
import { Volume2, Dog, Cigarette, PartyPopper, Baby } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";

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
                    Any other rules and policies not listed above
                </Label>
                <Textarea
                    placeholder="Add any other rules and policies..."
                    value={otherRules}
                    onChange={(e) => setOtherRules(e.target.value)}
                    className="min-h-[80px] resize-none"
                />
            </div>
        </div>
    );
};