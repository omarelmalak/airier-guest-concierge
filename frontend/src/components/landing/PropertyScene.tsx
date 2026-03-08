import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SceneHighlight {
    id: string;
    label: string;
    question: string;
    answer: string;
    // Position of the highlighted item in the scene (percentage)
    itemX: number;
    itemY: number;
    // Position of the message bubble
    bubbleX: number;
    bubbleY: number;
    bubbleSide: "left" | "right";
}

const highlights: SceneHighlight[] = [
    {
        id: "first-aid",
        label: "Where is?",
        question: "Where's the first aid kit?",
        answer: "The first aid kit is in the closet next to the front door, top shelf.",
        itemX: 12,
        itemY: 55,
        bubbleX: 5,
        bubbleY: 35,
        bubbleSide: "left",
    },
    {
        id: "wifi",
        label: "Exact Answer",
        question: "What's the WiFi password?",
        answer: "Network: CozyStay_Guest\nPassword: Welcome2025!",
        itemX: 52,
        itemY: 28,
        bubbleX: 55,
        bubbleY: 10,
        bubbleSide: "right",
    },
    {
        id: "thermostat",
        label: "How to",
        question: "How do I adjust the heating?",
        answer: "The thermostat is on the hallway wall. Turn the dial right for warmer, left for cooler.",
        itemX: 38,
        itemY: 42,
        bubbleX: 40,
        bubbleY: 22,
        bubbleSide: "left",
    },
    {
        id: "checkout",
        label: "Rules",
        question: "What time is checkout?",
        answer: "Checkout is at 11:00 AM. Please leave the keys on the kitchen counter.",
        itemX: 75,
        itemY: 50,
        bubbleX: 60,
        bubbleY: 35,
        bubbleSide: "right",
    },
];

const PropertyScene = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<HTMLDivElement>(null);
    const headlineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current || !sceneRef.current) return;

        const ctx = gsap.context(() => {
            // Pin the scene
            ScrollTrigger.create({
                trigger: containerRef.current,
                start: "top top",
                end: "+=300%",
                pin: true,
                pinSpacing: true,
            });

            // Fade in headline
            gsap.fromTo(
                headlineRef.current,
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 80%",
                        end: "top 40%",
                        scrub: 1,
                    },
                }
            );

            // Fade in the scene
            gsap.fromTo(
                sceneRef.current,
                { opacity: 0, scale: 0.92 },
                {
                    opacity: 1,
                    scale: 1,
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 60%",
                        end: "top 20%",
                        scrub: 1,
                    },
                }
            );

            // Each highlight appears sequentially during scroll
            highlights.forEach((highlight, index) => {
                const start = index * 25; // Each takes 25% of the scroll
                const end = start + 20;

                // Highlight glow
                gsap.fromTo(
                    `.highlight-glow-${highlight.id}`,
                    { opacity: 0, scale: 0.5 },
                    {
                        opacity: 1,
                        scale: 1,
                        scrollTrigger: {
                            trigger: containerRef.current,
                            start: `top+=${start}% top`,
                            end: `top+=${start + 8}% top`,
                            scrub: 1,
                        },
                    }
                );

                // Message bubble
                gsap.fromTo(
                    `.bubble-${highlight.id}`,
                    { opacity: 0, y: 20, scale: 0.9 },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        scrollTrigger: {
                            trigger: containerRef.current,
                            start: `top+=${start + 5}% top`,
                            end: `top+=${start + 12}% top`,
                            scrub: 1,
                        },
                    }
                );

                // Fade out previous highlight (except the last one which stays)
                if (index < highlights.length - 1) {
                    gsap.to(`.highlight-glow-${highlight.id}`, {
                        opacity: 0.15,
                        scrollTrigger: {
                            trigger: containerRef.current,
                            start: `top+=${end}% top`,
                            end: `top+=${end + 5}% top`,
                            scrub: 1,
                        },
                    });
                    gsap.to(`.bubble-${highlight.id}`, {
                        opacity: 0,
                        y: -10,
                        scrollTrigger: {
                            trigger: containerRef.current,
                            start: `top+=${end}% top`,
                            end: `top+=${end + 5}% top`,
                            scrub: 1,
                        },
                    });
                }
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="relative min-h-screen bg-background overflow-hidden">
            {/* Headline */}
            <div ref={headlineRef} className="absolute top-6 left-0 right-0 z-20 text-center px-6">
                <p className="text-sm font-medium text-primary mb-2 tracking-wide uppercase">
                    Scroll to explore
                </p>
                <h2 className="text-3xl md:text-5xl font-bold text-foreground max-w-3xl mx-auto leading-tight">
                    Your property. Your knowledge.{" "}
                    <span className="text-primary">Instant answers</span> for every guest.
                </h2>
            </div>

            {/* Scene Container */}
            <div className="absolute inset-0 flex items-center justify-center pt-28 pb-8 px-4 md:px-12">
                <div
                    ref={sceneRef}
                    className="relative w-full max-w-5xl aspect-[16/9] rounded-2xl overflow-hidden shadow-elevated border border-border"
                    style={{
                        background: "linear-gradient(135deg, hsl(30 20% 96%), hsl(30 15% 93%))",
                    }}
                >
                    {/* Property Interior - Stylized 2.5D Illustration */}
                    <svg
                        viewBox="0 0 1200 675"
                        className="w-full h-full"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {/* Floor */}
                        <rect x="0" y="450" width="1200" height="225" fill="hsl(30 15% 88%)" />
                        <line x1="0" y1="450" x2="1200" y2="450" stroke="hsl(30 10% 82%)" strokeWidth="2" />

                        {/* Back wall */}
                        <rect x="0" y="60" width="1200" height="390" fill="hsl(30 20% 95%)" />

                        {/* Wall trim */}
                        <rect x="0" y="60" width="1200" height="4" fill="hsl(30 10% 85%)" />

                        {/* Window */}
                        <rect x="460" y="100" width="280" height="200" rx="4" fill="hsl(200 60% 85%)" stroke="hsl(30 10% 80%)" strokeWidth="3" />
                        <line x1="600" y1="100" x2="600" y2="300" stroke="hsl(30 10% 80%)" strokeWidth="2" />
                        <line x1="460" y1="200" x2="740" y2="200" stroke="hsl(30 10% 80%)" strokeWidth="2" />
                        {/* Curtains */}
                        <rect x="440" y="85" width="40" height="230" rx="4" fill="hsl(30 15% 90%)" opacity="0.8" />
                        <rect x="720" y="85" width="40" height="230" rx="4" fill="hsl(30 15% 90%)" opacity="0.8" />

                        {/* Bookshelf / Router area (right wall) */}
                        <rect x="900" y="140" width="180" height="280" rx="4" fill="hsl(25 30% 75%)" />
                        <rect x="910" y="150" width="160" height="60" rx="2" fill="hsl(25 25% 82%)" />
                        <rect x="910" y="220" width="160" height="60" rx="2" fill="hsl(25 25% 82%)" />
                        <rect x="910" y="290" width="160" height="60" rx="2" fill="hsl(25 25% 82%)" />
                        <rect x="910" y="360" width="160" height="50" rx="2" fill="hsl(25 25% 82%)" />
                        {/* WiFi Router on shelf */}
                        <rect x="950" y="155" width="40" height="25" rx="3" fill="hsl(220 10% 40%)" />
                        <line x1="960" y1="155" x2="958" y2="142" stroke="hsl(220 10% 40%)" strokeWidth="2" />
                        <line x1="980" y1="155" x2="982" y2="142" stroke="hsl(220 10% 40%)" strokeWidth="2" />

                        {/* Entry / Closet area (left wall) */}
                        <rect x="30" y="120" width="120" height="330" rx="4" fill="hsl(25 20% 72%)" />
                        {/* Door handle */}
                        <circle cx="135" cy="300" r="5" fill="hsl(40 50% 65%)" />
                        {/* First aid cross on closet */}
                        <rect x="70" y="260" width="40" height="12" rx="2" fill="hsl(0 70% 55%)" />
                        <rect x="84" y="246" width="12" height="40" rx="2" fill="hsl(0 70% 55%)" />

                        {/* Couch */}
                        <rect x="200" y="380" width="350" height="90" rx="12" fill="hsl(220 25% 55%)" />
                        <rect x="195" y="370" width="360" height="20" rx="8" fill="hsl(220 28% 50%)" />
                        {/* Couch armrests */}
                        <rect x="190" y="370" width="30" height="100" rx="8" fill="hsl(220 28% 50%)" />
                        <rect x="530" y="370" width="30" height="100" rx="8" fill="hsl(220 28% 50%)" />
                        {/* Pillows */}
                        <ellipse cx="260" cy="395" rx="30" ry="18" fill="hsl(4 89% 66%)" opacity="0.8" />
                        <ellipse cx="490" cy="395" rx="28" ry="16" fill="hsl(30 60% 75%)" opacity="0.8" />

                        {/* Coffee table */}
                        <rect x="280" y="490" width="200" height="60" rx="6" fill="hsl(25 35% 65%)" />
                        <rect x="290" y="485" width="180" height="8" rx="3" fill="hsl(25 30% 60%)" />

                        {/* Guest sitting on couch */}
                        {/* Body */}
                        <rect x="350" y="355" width="50" height="60" rx="8" fill="hsl(0 0% 30%)" />
                        {/* Head */}
                        <circle cx="375" cy="335" r="22" fill="hsl(25 40% 70%)" />
                        {/* Hair */}
                        <ellipse cx="375" cy="322" rx="22" ry="14" fill="hsl(25 30% 25%)" />
                        {/* Phone in hand */}
                        <rect x="385" y="370" width="18" height="30" rx="3" fill="hsl(0 0% 15%)" />
                        <rect x="387" y="373" width="14" height="24" rx="2" fill="hsl(200 80% 70%)" />
                        {/* Phone notification dot */}
                        <circle cx="394" cy="380" r="3" fill="hsl(2 82% 54%)" className="animate-pulse-soft" />

                        {/* Thermostat on wall */}
                        <rect x="420" y="340" width="40" height="50" rx="6" fill="hsl(0 0% 95%)" stroke="hsl(0 0% 80%)" strokeWidth="1.5" />
                        <circle cx="440" cy="365" r="12" fill="hsl(0 0% 90%)" stroke="hsl(0 0% 75%)" strokeWidth="1" />
                        <text x="440" y="369" textAnchor="middle" fontSize="10" fill="hsl(0 0% 40%)" fontWeight="600">21°</text>

                        {/* Kitchen area (right side) */}
                        <rect x="700" y="350" width="200" height="100" rx="4" fill="hsl(30 10% 85%)" />
                        <rect x="700" y="340" width="200" height="16" rx="3" fill="hsl(25 15% 75%)" />
                        {/* Stove */}
                        <circle cx="760" cy="390" r="15" fill="hsl(0 0% 75%)" stroke="hsl(0 0% 65%)" strokeWidth="1" />
                        <circle cx="820" cy="390" r="15" fill="hsl(0 0% 75%)" stroke="hsl(0 0% 65%)" strokeWidth="1" />
                        {/* Kitchen counter key area */}
                        <rect x="850" y="370" width="30" height="8" rx="2" fill="hsl(40 60% 55%)" />

                        {/* Rug */}
                        <ellipse cx="380" cy="530" rx="160" ry="50" fill="hsl(0 40% 85%)" opacity="0.5" />

                        {/* Bedroom door hint (right) */}
                        <rect x="1080" y="120" width="100" height="330" rx="0" fill="hsl(30 18% 90%)" />
                        <rect x="1080" y="120" width="4" height="330" fill="hsl(25 20% 72%)" />
                        {/* Bed peek */}
                        <rect x="1100" y="350" width="80" height="50" rx="6" fill="hsl(0 0% 92%)" />
                        <rect x="1100" y="340" width="80" height="15" rx="4" fill="hsl(30 30% 80%)" />
                    </svg>

                    {/* Highlight Glows - positioned absolutely over the SVG */}
                    {highlights.map((h) => (
                        <div
                            key={h.id}
                            className={`highlight-glow-${h.id} absolute opacity-0`}
                            style={{
                                left: `${h.itemX}%`,
                                top: `${h.itemY}%`,
                                transform: "translate(-50%, -50%)",
                            }}
                        >
                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/20 animate-pulse-soft flex items-center justify-center">
                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/40" />
                            </div>
                        </div>
                    ))}

                    {/* Message Bubbles */}
                    {highlights.map((h) => (
                        <div
                            key={`bubble-${h.id}`}
                            className={`bubble-${h.id} absolute opacity-0 z-10`}
                            style={{
                                left: `${h.bubbleX}%`,
                                top: `${h.bubbleY}%`,
                                maxWidth: "280px",
                            }}
                        >
                            <div className="bg-card rounded-2xl shadow-elevated border border-border p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-[10px] font-semibold text-primary uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded-full">
                                        {h.label}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground mb-2 italic">"{h.question}"</p>
                                <div className="bg-primary text-primary-foreground rounded-xl rounded-br-sm px-3 py-2">
                                    <p className="text-xs font-medium whitespace-pre-line">{h.answer}</p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Guest on phone label */}
                    <div className="absolute bottom-[28%] left-[28%] md:left-[30%]">
                        <div className="bg-foreground/80 text-background text-[10px] px-2 py-1 rounded-full backdrop-blur-sm whitespace-nowrap">
                            Guest chatting with AI
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyScene;