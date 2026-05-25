import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Link2, PencilLine, Sparkles } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PropertyCreated } from "@/components/add-property-steps/PropertyCreated";
import { importPropertyFromLink } from "@/lib/services/properties";

type Phase = "choose" | "loading" | "done";

const loadingMessages = [
    "Reading your listing…",
    "Pulling photos & details…",
    "Teaching your concierge the house rules…",
    "Almost there…",
];

const AddPropertyChoice = () => {
    const navigate = useNavigate();
    const [phase, setPhase] = useState<Phase>("choose");
    const [link, setLink] = useState("");
    const [messageIndex, setMessageIndex] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [createdPropertyId, setCreatedPropertyId] = useState<string | null>(null);
    const messageIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        return () => {
            if (messageIntervalRef.current) clearInterval(messageIntervalRef.current);
        };
    }, []);

    const handleSubmitLink = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = link.trim();
        if (!trimmed) return;

        setError(null);
        setPhase("loading");
        setMessageIndex(0);
        setCreatedPropertyId(null);

        messageIntervalRef.current = setInterval(() => {
            setMessageIndex((i) => Math.min(i + 1, loadingMessages.length - 1));
        }, 1100);

        try {
            const property = await importPropertyFromLink(trimmed);
            setCreatedPropertyId(property.id);
            setPhase("done");
        } catch (err) {
            setPhase("choose");
            setError(err instanceof Error ? err.message : "Import failed. Please try again.");
        } finally {
            if (messageIntervalRef.current) {
                clearInterval(messageIntervalRef.current);
                messageIntervalRef.current = null;
            }
        }
    };

    if (phase === "done" && createdPropertyId) {
        return <PropertyCreated propertyId={createdPropertyId} />;
    }

    if (phase === "loading") {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] relative overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none">
                        {[...Array(14)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute w-2 h-2 rounded-full bg-primary/40"
                                style={{
                                    left: `${5 + (i * 6.5)}%`,
                                    top: `${20 + ((i * 37) % 60)}%`,
                                    animation: `fade-in 1.6s ease-in-out ${i * 0.15}s infinite alternate`,
                                }}
                            />
                        ))}
                    </div>

                    <div className="text-center relative">
                        <div className="relative w-40 h-40 mx-auto mb-10">
                            <div className="absolute inset-0 rounded-full bg-primary/15 animate-success-pulse" />
                            <div
                                className="absolute inset-4 rounded-full bg-primary/25"
                                style={{ animation: "success-pulse 2s ease-out infinite 0.4s" }}
                            />
                            <div className="absolute inset-8 rounded-full bg-gradient-to-br from-primary to-primary-light shadow-xl flex items-center justify-center animate-circle-fill">
                                <Sparkles className="w-12 h-12 text-primary-foreground animate-spin" style={{ animationDuration: "3s" }} />
                            </div>
                        </div>

                        <h1 className="font-display text-4xl md:text-5xl italic text-foreground mb-4">
                            Brewing your concierge
                        </h1>
                        <p
                            key={messageIndex}
                            className="text-muted-foreground text-lg animate-fade-in"
                        >
                            {loadingMessages[messageIndex]}
                        </p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-2xl mx-auto animate-fade-in">
                <button
                    onClick={() => navigate("/properties")}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Properties
                </button>

                <div className="mb-10">
                    <h1 className="text-4xl md:text-5xl font-semibold text-foreground leading-tight">
                        Let's meet your <span className="font-display italic text-primary">place.</span>
                    </h1>
                    <p className="text-muted-foreground mt-3 text-lg">
                        Drop in your listing and we'll do the heavy lifting.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmitLink}
                    className="bg-card rounded-2xl border border-border p-8 shadow-sm hover:shadow-md transition-all"
                >
                    <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
                        <Link2 className="w-4 h-4 text-primary" />
                        Paste your Airbnb, Vrbo, or Booking.com link
                    </label>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Input
                            type="url"
                            value={link}
                            onChange={(e) => {
                                setLink(e.target.value);
                                if (error) setError(null);
                            }}
                            placeholder="https://airbnb.com/rooms/…"
                            className="flex-1 h-12 text-base"
                        />
                        <Button
                            type="submit"
                            disabled={!link.trim()}
                            className="h-12 px-6 gap-2"
                        >
                            Import
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </div>
                    {error && (
                        <p className="text-sm text-destructive mt-3" role="alert">
                            {error}
                        </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-3">
                        We'll auto-fill the details so you can be live in under a minute.
                    </p>
                </form>

                <div className="flex items-center gap-4 my-8">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-xs uppercase tracking-widest text-muted-foreground">or</span>
                    <div className="flex-1 h-px bg-border" />
                </div>

                <button
                    onClick={() => navigate("/add-property/manual")}
                    className="group w-full bg-transparent rounded-2xl border border-dashed border-border hover:border-primary/50 hover:bg-card p-6 transition-all text-left flex items-center gap-4"
                >
                    <div className="w-12 h-12 rounded-full bg-muted group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                        <PencilLine className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="flex-1">
                        <div className="font-medium text-foreground">Rather fill it in yourself?</div>
                        <div className="text-sm text-muted-foreground">Walk through the setup step by step.</div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </button>
            </div>
        </DashboardLayout>
    );
};

export default AddPropertyChoice;
