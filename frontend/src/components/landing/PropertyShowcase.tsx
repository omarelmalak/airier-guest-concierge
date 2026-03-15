import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Droplets, Search, ShieldCheck, MapPin } from "lucide-react";
import propertyImage from "@/assets/property-showcase.jpg";

gsap.registerPlugin(ScrollTrigger);

interface Highlight {
    id: string;
    category: string;
    icon: React.ElementType;
    question: string;
    answer: string;
    // Hotspot position on image (%)
    spotX: number;
    spotY: number;
    // Bubble position
    bubbleX: number;
    bubbleY: number;
    bubbleAlign: "left" | "right";
}

const highlights: Highlight[] = [
    {
        id: "amenities",
        category: "Amenities",
        icon: Droplets,
        question: "Can I use the pool?",
        answer: "The pool is all yours! Just turn the heater up to 80°F and enjoy 🏊",
        spotX: 50,
        spotY: 82,
        bubbleX: 8,
        bubbleY: 55,
        bubbleAlign: "left",
    },
    {
        id: "where-is",
        category: "Where is?",
        icon: Search,
        question: "Where are the extra towels?",
        answer: "Extra towels are in the hallway closet, second shelf on the right 🛁",
        spotX: 78,
        spotY: 52,
        bubbleX: 62,
        bubbleY: 8,
        bubbleAlign: "right",
    },
    {
        id: "rules",
        category: "Rules & Policies",
        icon: ShieldCheck,
        question: "What are the quiet hours?",
        answer: "Quiet hours are 10 PM – 8 AM. Please keep noise to a minimum after 10 🤫",
        spotX: 50,
        spotY: 40,
        bubbleX: 12,
        bubbleY: 5,
        bubbleAlign: "left",
    },
    {
        id: "recommendations",
        category: "Local Recommendations",
        icon: MapPin,
        question: "Any good restaurants nearby?",
        answer: "Tony's Trattoria is a 5-min walk down the street — try the truffle pasta! 🍝",
        spotX: 15,
        spotY: 18,
        bubbleX: 2,
        bubbleY: 30,
        bubbleAlign: "left",
    },
];

const PropertyShowcase = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const imageWrapRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(-1);

    useEffect(() => {
        if (!sectionRef.current || !imageWrapRef.current) return;

        const ctx = gsap.context(() => {
            // Width expand as section scrolls into view (before pin)
            gsap.fromTo(
                imageWrapRef.current,
                { scaleX: 0.88 },
                {
                    scaleX: 1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 100%",
                        end: "top top",
                        scrub: 1,
                    },
                }
            );

            // Pin for highlights
            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: "top top",
                end: "+=300%",
                pin: true,
                pinSpacing: true,
                onUpdate: (self) => {
                    const p = self.progress;
                    if (p < 0.08) setActiveIndex(-1);
                    else if (p < 0.28) setActiveIndex(0);
                    else if (p < 0.48) setActiveIndex(1);
                    else if (p < 0.68) setActiveIndex(2);
                    else setActiveIndex(3);
                },
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="knowledge" ref={sectionRef} className="min-h-screen bg-background relative overflow-hidden">
            <div className="h-screen flex flex-col items-center justify-center px-6">
                {/* Header */}
                <div className="text-center mb-8 z-10">
                    <p className="text-sm text-primary font-medium tracking-wide uppercase mb-3">
                        Knowledge categories
                    </p>
                    <h2 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
                        Every detail,{" "}
                        <span className="font-display italic text-muted-foreground">covered.</span>
                    </h2>
                </div>

                {/* Image + overlays */}
                <div ref={imageWrapRef} className="relative w-full max-w-5xl mx-auto origin-center" style={{ willChange: 'transform' }}>
                    {/* Property image */}
                    <div className="relative rounded-2xl overflow-hidden shadow-elevated border border-border">
                        <img
                            src={propertyImage}
                            alt="Modern vacation rental property"
                            className="w-full h-auto block"
                        />

                        {/* Dim overlay when a highlight is active */}
                        <div
                            className="absolute inset-0 bg-foreground/40 transition-opacity duration-700"
                            style={{ opacity: activeIndex >= 0 ? 1 : 0 }}
                        />

                        {/* Hotspot glows */}
                        {highlights.map((h, i) => (
                            <div
                                key={h.id}
                                className="absolute transition-all duration-700"
                                style={{
                                    left: `${h.spotX}%`,
                                    top: `${h.spotY}%`,
                                    transform: "translate(-50%, -50%)",
                                    opacity: activeIndex === i ? 1 : 0,
                                    pointerEvents: "none",
                                }}
                            >
                                {/* Bright spotlight cutout */}
                                <div className="relative">
                                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-background/20 backdrop-blur-[1px] border-2 border-background/60 shadow-[0_0_40px_10px_rgba(255,255,255,0.15)] flex items-center justify-center">
                                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/90 flex items-center justify-center shadow-lg">
                                            <h.icon className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" />
                                        </div>
                                    </div>
                                    {/* Pulse ring */}
                                    <div className="absolute inset-0 rounded-full border-2 border-primary/40 animate-[ping_2s_ease-out_infinite]" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Chat bubbles */}
                    {highlights.map((h, i) => (
                        <div
                            key={`bubble-${h.id}`}
                            className="absolute z-20 transition-all duration-700 ease-out"
                            style={{
                                left: `${h.bubbleX}%`,
                                top: `${h.bubbleY}%`,
                                opacity: activeIndex === i ? 1 : 0,
                                transform: activeIndex === i
                                    ? "translateY(0) scale(1)"
                                    : "translateY(16px) scale(0.95)",
                                pointerEvents: "none",
                                maxWidth: "300px",
                                minWidth: "240px",
                            }}
                        >
                            <div className="bg-card rounded-2xl shadow-elevated border border-border p-4">
                                {/* Category badge */}
                                <div className="flex items-center gap-2 mb-2.5">
                                    <h.icon className="w-3.5 h-3.5 text-primary" />
                                    <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">
                                        {h.category}
                                    </span>
                                </div>
                                {/* Question */}
                                <p className="text-xs text-muted-foreground mb-2.5 italic">
                                    "{h.question}"
                                </p>
                                {/* Answer bubble */}
                                <div className="bg-primary text-primary-foreground rounded-xl rounded-br-sm px-3.5 py-2.5">
                                    <p className="text-sm font-medium leading-relaxed">{h.answer}</p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Category pills at bottom */}
                    <div className="flex items-center justify-center gap-2 mt-6">
                        {highlights.map((h, i) => (
                            <div
                                key={`pill-${h.id}`}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all duration-500 ${activeIndex === i
                                    ? "bg-primary text-primary-foreground border-primary shadow-lg"
                                    : "bg-card text-muted-foreground border-border"
                                    }`}
                            >
                                <h.icon className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">{h.category}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PropertyShowcase;
