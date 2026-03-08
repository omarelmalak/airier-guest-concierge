import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import LandingNav from "@/components/LandingNav";
import airierLogo from "@/assets/airier-logo.png";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Check, Home, BookOpen, UserCheck, Send, Wifi, MapPin, ShieldCheck, Coffee, Sparkles } from "lucide-react";
import PropertyShowcase from "@/components/landing/PropertyShowcase";

gsap.registerPlugin(ScrollTrigger);

// ─── Data ────────────────────────────────────────────────────────────────────

const heroMessages = [
  { from: "ai", text: "Hi Alice! 🏡 Welcome to Bedford Cabin. Check-in is at 3 PM — the lockbox code is 4821. Let me know when you arrive!" },
  { from: "guest", text: "Thanks! Just got here. What's the WiFi password?" },
  { from: "ai", text: "Great, welcome! The network is CozyStay_5G and the password is Welcome2025! 📶" },
  { from: "guest", text: "Perfect. Where can I park?" },
  { from: "ai", text: "You have spot #24 in the underground garage. Your key fob opens the gate. 🅿️" },
];

const conversationPairs = [
  { q: "What's the WiFi password?", a: "Network: CozyStay_5G · Password: Welcome2025!" },
  { q: "Where's the first aid kit?", a: "In the hallway closet, top shelf, right side." },
  { q: "How do I use the thermostat?", a: "Turn the dial right for warmer. Currently set to 21°C." },
  { q: "What time is checkout?", a: "Checkout is at 11:00 AM. Leave keys on the counter." },
  { q: "Is there parking?", a: "Yes — spot #24 in the underground garage. Fob is on your keychain." },
  { q: "Any restaurant recs nearby?", a: "Tony's Trattoria, 5 min walk. Try the truffle pasta." },
];

const flowSteps = [
  {
    id: "add-property",
    icon: Home,
    label: "Step 1",
    title: "Add your property",
    desc: "Enter the basics — name, address, type, and a photo.",
  },
  {
    id: "knowledge",
    icon: BookOpen,
    label: "Step 2",
    title: "Teach the AI",
    desc: "WiFi, house rules, amenities, local recommendations, exact Q&A.",
  },
  {
    id: "add-guest",
    icon: UserCheck,
    label: "Step 3",
    title: "Add a guest",
    desc: "Enter their phone number and reservation dates.",
  },
  {
    id: "guest-text",
    icon: Send,
    label: "Step 4",
    title: "Guest texts in",
    desc: "They get instant, accurate answers from your AI agent.",
  },
];

const featureItems = [
  { title: "24/7 availability", desc: "Guests get instant answers at 3 AM or 3 PM. No delays." },
  { title: "Property-specific", desc: "Trained on your exact property. No generic responses." },
  { title: "SMS-native", desc: "Works via text message. No app downloads for guests." },
  { title: "Multi-property", desc: "Each listing gets its own dedicated AI agent." },
  { title: "Smart escalation", desc: "If the AI doesn't know, it gives the guest your number automatically." },
  { title: "10-minute setup", desc: "From zero to live in under 10 minutes. Really." },
];

const pricingFeatures = [
  "Unlimited AI conversations",
  "Up to 3 simultaneous guests",
  "Custom knowledge base",
  "Smart escalation to host",
  "Email support",
  "Cancel anytime",
];

// ─── Component ───────────────────────────────────────────────────────────────

const Index = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const convRef = useRef<HTMLDivElement>(null);
  const flowSectionRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  // Hero entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-eyebrow", { opacity: 0, y: 30, duration: 0.8 })
        .from(".hero-title-line", { opacity: 0, y: 60, duration: 0.9, stagger: 0.12 }, "-=0.5")
        .from(".hero-sub", { opacity: 0, y: 20, duration: 0.7 }, "-=0.4")
        .from(".hero-cta-btn", { opacity: 0, y: 15, duration: 0.6, stagger: 0.1 }, "-=0.3")
        // Phone slides up from below
        .from(".hero-phone", { opacity: 0, y: 80, duration: 1.2, ease: "power2.out" }, "-=0.8")
        // Messages appear one by one with a typing feel
        .from(".hero-msg", { opacity: 0, y: 20, scale: 0.95, stagger: 0.4, duration: 0.5, ease: "back.out(1.5)" }, "+=0.3")
        // Typing indicator appears last
        .from(".hero-typing", { opacity: 0, scale: 0.8, duration: 0.4, ease: "back.out(2)" }, "+=0.2");
    }, heroRef);
    return () => ctx.revert();
  }, []);

  // Marquee
  useEffect(() => {
    if (!marqueeRef.current) return;
    const track = marqueeRef.current.querySelector(".marquee-track");
    if (!track) return;
    const ctx = gsap.context(() => {
      gsap.to(track, { xPercent: -50, duration: 30, ease: "none", repeat: -1 });
    }, marqueeRef);
    return () => ctx.revert();
  }, []);

  // Conversation cards stagger
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".conv-card", {
        opacity: 0, y: 60, stagger: 0.15, duration: 0.8, ease: "power2.out",
        scrollTrigger: { trigger: convRef.current, start: "top 75%" },
      });
    }, convRef);
    return () => ctx.revert();
  }, []);

  // Flow section — GSAP scroll-pinned, step by step
  useEffect(() => {
    if (!flowSectionRef.current) return;
    const ctx = gsap.context(() => {
      // Pin the section
      ScrollTrigger.create({
        trigger: flowSectionRef.current,
        start: "top top",
        end: "+=250%",
        pin: true,
        pinSpacing: true,
        onUpdate: (self) => {
          const progress = self.progress;
          const step = Math.min(Math.floor(progress * flowSteps.length), flowSteps.length - 1);
          setActiveStep(step);
        },
      });
    }, flowSectionRef);
    return () => ctx.revert();
  }, []);

  // Features
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".feat-item", {
        opacity: 0, y: 40, stagger: 0.08, duration: 0.6, ease: "power2.out",
        scrollTrigger: { trigger: featuresRef.current, start: "top 75%" },
      });
    }, featuresRef);
    return () => ctx.revert();
  }, []);

  // Pricing
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".pricing-card", {
        opacity: 0, y: 50, scale: 0.97, duration: 0.9, ease: "power2.out",
        scrollTrigger: { trigger: pricingRef.current, start: "top 75%" },
      });
    }, pricingRef);
    return () => ctx.revert();
  }, []);

  // Final CTA
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".final-cta-text", {
        opacity: 0, y: 40, duration: 0.8, ease: "power2.out",
        scrollTrigger: { trigger: ctaRef.current, start: "top 80%" },
      });
    }, ctaRef);
    return () => ctx.revert();
  }, []);

  // ─── Mock UI cards for each step ─────────────────────────────────────────

  const renderFlowCard = (stepIndex: number) => {
    const isActive = activeStep === stepIndex;

    switch (stepIndex) {
      case 0:
        return (
          <div className="bg-card rounded-2xl border border-border p-5 space-y-3">
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground/60 font-medium">Property Info</div>
            <div className="space-y-2.5">
              <div className="bg-muted/60 rounded-xl px-4 py-3">
                <span className="text-[11px] text-muted-foreground/50 block mb-0.5">Name</span>
                <span className="text-sm text-foreground font-medium">Bedford Cabin</span>
              </div>
              <div className="bg-muted/60 rounded-xl px-4 py-3">
                <span className="text-[11px] text-muted-foreground/50 block mb-0.5">Address</span>
                <span className="text-sm text-foreground font-medium">181 Bedford Rd, Toronto, ON</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-muted/60 rounded-xl px-4 py-3">
                  <span className="text-[11px] text-muted-foreground/50 block mb-0.5">Type</span>
                  <span className="text-sm text-foreground font-medium">Cabin</span>
                </div>
                <div className="bg-muted/60 rounded-xl px-4 py-3">
                  <span className="text-[11px] text-muted-foreground/50 block mb-0.5">Bedrooms</span>
                  <span className="text-sm text-foreground font-medium">2</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="bg-card rounded-2xl border border-border p-5 space-y-3">
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground/60 font-medium">Knowledge Base</div>
            <div className="space-y-2">
              {[
                { icon: Wifi, label: "WiFi", value: "CozyStay_5G / Welcome2025!" },
                { icon: MapPin, label: "Parking", value: "Spot #24, underground garage" },
                { icon: ShieldCheck, label: "Rules", value: "Quiet hours 10 PM – 8 AM" },
                { icon: Coffee, label: "Local tips", value: "Tony's Trattoria, 5 min walk" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3 bg-muted/60 rounded-xl px-4 py-3">
                  <item.icon className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-[11px] text-muted-foreground/50 block">{item.label}</span>
                    <span className="text-sm text-foreground">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="bg-card rounded-2xl border border-border p-5 space-y-3">
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground/60 font-medium">Guest Management</div>
            <div className="space-y-2.5">
              <div className="flex items-center gap-3 bg-muted/60 rounded-xl px-4 py-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-primary">AJ</span>
                </div>
                <div className="flex-1">
                  <span className="text-sm text-foreground font-medium block">Alice Johnson</span>
                  <span className="text-xs text-muted-foreground">Jul 26 – Jul 30 · +1 416-555-0123</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-status-online" />
              </div>
              <div className="flex items-center gap-3 bg-muted/60 rounded-xl px-4 py-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-primary">MD</span>
                </div>
                <div className="flex-1">
                  <span className="text-sm text-foreground font-medium block">Mark Davidson</span>
                  <span className="text-xs text-muted-foreground">Jul 22 – Jul 25 · +1 416-555-0456</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-status-online" />
              </div>
              <div className="h-12 border-2 border-dashed border-border rounded-xl flex items-center justify-center">
                <span className="text-xs text-muted-foreground">+ Add guest</span>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="bg-card rounded-2xl border border-border p-5 space-y-3">
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground/60 font-medium">SMS Conversation</div>
            <div className="space-y-2.5 max-w-sm">
              <div className="flex justify-start">
                <div className="bg-primary/10 text-foreground rounded-2xl rounded-tl-md px-4 py-2.5 max-w-[80%]">
                  <p className="text-[11px] text-primary font-medium mb-0.5">Automated · Check-in</p>
                  <p className="text-sm">Hi! Check-in is at 3 PM. Lockbox code: 4821 🏡</p>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="bg-muted/80 rounded-2xl rounded-tr-md px-4 py-2.5 max-w-[80%]">
                  <p className="text-sm text-foreground">What's the WiFi password?</p>
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-foreground text-background rounded-2xl rounded-tl-md px-4 py-2.5 max-w-[80%]">
                  <p className="text-sm">Network: CozyStay_5G · Password: Welcome2025! 📶</p>
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-primary/10 text-foreground rounded-2xl rounded-tl-md px-4 py-2.5 max-w-[80%]">
                  <p className="text-[11px] text-primary font-medium mb-0.5">Automated · Check-out</p>
                  <p className="text-sm">Checkout is at 11 AM. Leave keys on the counter. Thanks for staying! 🙏</p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <LandingNav />

      {/* ═══════════════════════════════════════════════════════════════════════
          HERO — Live demo with animated SMS conversation
      ═══════════════════════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="min-h-screen flex items-center px-6 relative pt-20 grain-overlay">

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left — Copy */}
            <div className="lg:pl-6">
              <p className="hero-eyebrow text-sm md:text-base text-primary font-medium tracking-wide uppercase mb-6">
                AI guest concierge
              </p>
              <h1 className="text-[clamp(2.5rem,5.5vw,5rem)] leading-[0.95] text-foreground mb-6">
                <span className="hero-title-line block font-bold">The host that</span>
                <span className="hero-title-line block font-display text-primary italic">never sleeps.</span>
              </h1>
              <p className="hero-sub text-lg md:text-xl text-muted-foreground max-w-md mb-10 leading-relaxed">
                Deploy an AI text agent that answers your guests instantly — trained on your property, available 24/7.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth?mode=signup" className="hero-cta-btn">
                  <Button className="btn-magnetic border border-foreground/20 bg-transparent text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary rounded-xl h-14 px-8 text-base font-medium transition-all duration-300 group">
                    Start free trial
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </Link>
                <a href="#how" className="hero-cta-btn">
                  <Button variant="ghost" className="rounded-xl h-14 px-8 text-base text-muted-foreground hover:text-foreground bg-foreground/[0.04] hover:bg-foreground/[0.08] transition-all duration-300">
                    See how it works
                  </Button>
                </a>
              </div>
            </div>

            {/* Right — Live SMS Demo */}
            <div className="hero-phone hidden lg:block">
              <div className="relative mx-auto animate-[float_6s_ease-in-out_infinite]" style={{ maxWidth: 340, transform: 'scale(0.92)' }}>
                {/* Phone frame */}
                <div className="bg-foreground rounded-[2.5rem] p-3 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)]">
                  {/* Notch */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-foreground rounded-b-2xl z-20" />

                  {/* Screen */}
                  <div className="bg-background rounded-[2rem] overflow-hidden">
                    {/* Status bar */}
                    <div className="flex items-center justify-between px-6 pt-4 pb-2">
                      <span className="text-[11px] text-muted-foreground font-medium">9:41</span>
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-2 border border-muted-foreground/40 rounded-sm relative">
                          <div className="absolute inset-0.5 bg-foreground rounded-[1px]" style={{ width: '70%' }} />
                        </div>
                      </div>
                    </div>

                    {/* Chat header */}
                    <div className="flex items-center gap-3 px-5 py-3 border-b border-border">
                      <div className="w-9 h-9 bg-primary flex items-center justify-center shadow-sm" style={{ borderRadius: '22%' }}>
                        <span className="text-xs font-bold text-primary-foreground tracking-tight">BC</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground leading-tight">Bedford Cabin</p>
                        <p className="text-[11px] text-status-online font-medium">AI Agent · Online</p>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="px-4 py-4 space-y-3 min-h-[380px]">
                      {heroMessages.map((msg, i) => (
                        <div
                          key={i}
                          className={`hero-msg flex ${msg.from === "ai" ? "justify-start" : "justify-end"}`}
                        >
                          <div className={`max-w-[80%] px-4 py-2.5 text-[13px] leading-relaxed ${msg.from === "ai"
                            ? "bg-primary text-primary-foreground rounded-2xl rounded-tl-md"
                            : "bg-muted/80 text-foreground rounded-2xl rounded-tr-md"
                            }`}>
                            {msg.text}
                          </div>
                        </div>
                      ))}

                      {/* Typing indicator */}
                      <div className="hero-typing flex justify-start">
                        <div className="bg-primary/80 rounded-2xl rounded-tl-md px-4 py-3 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-primary-foreground/60 rounded-full animate-[bounce_1.4s_ease-in-out_infinite]" />
                          <span className="w-1.5 h-1.5 bg-primary-foreground/60 rounded-full animate-[bounce_1.4s_ease-in-out_0.2s_infinite]" />
                          <span className="w-1.5 h-1.5 bg-primary-foreground/60 rounded-full animate-[bounce_1.4s_ease-in-out_0.4s_infinite]" />
                        </div>
                      </div>
                    </div>

                    {/* Input bar */}
                    <div className="px-4 pb-6 pt-2 border-t border-border">
                      <div className="bg-muted/50 rounded-full px-4 py-2.5 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground/50">Message...</span>
                        <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                          <ArrowRight className="w-3.5 h-3.5 text-primary-foreground -rotate-45" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground/40">
          <div className="w-px h-8 bg-border overflow-hidden">
            <div className="w-full h-full bg-foreground/30 animate-[slideDown_2s_ease-in-out_infinite]" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          MARQUEE
      ═══════════════════════════════════════════════════════════════════════ */}
      <section ref={marqueeRef} className="py-6 border-y border-border overflow-hidden">
        <div className="marquee-track flex items-center whitespace-nowrap">
          {[...Array(2)].map((_, setIdx) => (
            <div key={setIdx} className="flex items-center">
              {[
                "WiFi passwords", "Check-in instructions", "House rules", "Local recommendations",
                "Parking info", "Appliance guides", "Emergency contacts", "Checkout reminders",
                "Restaurant tips", "Transit directions", "Pet policies", "Pool hours",
              ].map((item, i, arr) => (
                <span key={`${setIdx}-${item}`} className="inline-flex items-center">
                  <span className="text-sm text-muted-foreground/50 font-medium tracking-wide px-6">
                    {item}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-primary/30 flex-shrink-0" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          CONVERSATION DEMO
      ═══════════════════════════════════════════════════════════════════════ */}
      <section id="conversations" ref={convRef} className="py-20 px-6 grain-overlay">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="max-w-2xl mb-10">
            <p className="text-sm text-primary font-medium tracking-wide uppercase mb-4">Real conversations</p>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight mb-6">
              Your guests ask.<br /><span className="font-display italic text-muted-foreground">Airier answers.</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Every response is trained on your specific property details. No hallucinations. No generic answers.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {conversationPairs.map((pair, i) => (
              <div key={i} className="conv-card group">
                <div className="bg-card rounded-2xl border border-border p-6 h-full hover-tilt hover:shadow-elevated">
                  <div className="mb-5">
                    <span className="text-[11px] uppercase tracking-widest text-muted-foreground/60 font-medium">Guest asks</span>
                    <p className="text-foreground font-medium mt-1.5 leading-snug">{pair.q}</p>
                  </div>
                  <div className="h-px bg-border mb-5 w-12 group-hover:w-full transition-all duration-700" />
                  <div>
                    <span className="text-[11px] uppercase tracking-widest text-primary/70 font-medium">Airier responds</span>
                    <p className="text-muted-foreground text-sm mt-1.5 leading-relaxed">{pair.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          PROPERTY SHOWCASE — Scroll-driven knowledge category highlights
      ═══════════════════════════════════════════════════════════════════════ */}
      <PropertyShowcase />

      {/* ═══════════════════════════════════════════════════════════════════════
          HOW IT WORKS — Scroll-pinned interactive flow with app UI previews
      ═══════════════════════════════════════════════════════════════════════ */}
      <section id="how" ref={flowSectionRef} data-nav-dark className="min-h-screen bg-foreground text-background relative overflow-hidden grain-overlay">
        <div className="h-screen flex items-center">
          <div className="max-w-7xl mx-auto px-6 md:px-10 w-full">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

              {/* Left: steps list */}
              <div>
                <p className="text-sm text-primary-light font-medium tracking-wide uppercase mb-6">
                  How it works
                </p>
                <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-12">
                  Four steps to<br />
                  <span className="font-display italic text-background/50">autopilot.</span>
                </h2>

                <div className="space-y-2">
                  {flowSteps.map((step, i) => {
                    const isActive = activeStep === i;
                    const isPast = activeStep > i;
                    return (
                      <div
                        key={step.id}
                        className={`flex items-start gap-5 p-5 rounded-2xl transition-all duration-700 ease-out ${isActive
                          ? "bg-background/10"
                          : "bg-transparent"
                          }`}
                      >
                        {/* Step icon */}
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-500 ${isActive
                          ? "bg-primary text-primary-foreground scale-110"
                          : isPast
                            ? "bg-background/20 text-background/60"
                            : "bg-background/5 text-background/30"
                          }`}>
                          {isPast ? (
                            <Check className="w-5 h-5" />
                          ) : (
                            <step.icon className="w-5 h-5" />
                          )}
                        </div>

                        <div className="flex-1">
                          <span className={`text-[11px] uppercase tracking-widest font-medium transition-colors duration-500 ${isActive ? "text-primary-light" : "text-background/30"
                            }`}>
                            {step.label}
                          </span>
                          <h3 className={`text-lg font-semibold mt-0.5 transition-colors duration-500 ${isActive ? "text-background" : isPast ? "text-background/50" : "text-background/30"
                            }`}>
                            {step.title}
                          </h3>
                          <p className={`text-sm mt-1 transition-all duration-500 overflow-hidden ${isActive
                            ? "text-background/60 max-h-20 opacity-100"
                            : "text-background/20 max-h-0 opacity-0"
                            }`}>
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Progress bar */}
                <div className="mt-8 h-1 bg-background/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${((activeStep + 1) / flowSteps.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Right: animated app preview card */}
              <div className="hidden lg:block relative">
                <div className="relative">
                  {/* Glow behind card */}
                  <div className="absolute -inset-8 bg-primary/10 rounded-3xl blur-3xl opacity-40" />

                  {/* Card container with cross-fade */}
                  <div className="relative">
                    {flowSteps.map((_, i) => (
                      <div
                        key={i}
                        className="transition-all duration-700 ease-out"
                        style={{
                          position: i === 0 ? "relative" : "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          opacity: activeStep === i ? 1 : 0,
                          transform: activeStep === i
                            ? "translateY(0) scale(1)"
                            : activeStep > i
                              ? "translateY(-20px) scale(0.97)"
                              : "translateY(20px) scale(0.97)",
                          pointerEvents: activeStep === i ? "auto" : "none",
                        }}
                      >
                        {renderFlowCard(i)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          FEATURES
      ═══════════════════════════════════════════════════════════════════════ */}
      <section id="features" ref={featuresRef} className="py-32 px-6 grain-overlay">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="max-w-2xl mb-20">
            <p className="text-sm text-primary font-medium tracking-wide uppercase mb-4">Features</p>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
              Everything you need.<br /><span className="font-display italic text-muted-foreground">Nothing you don't.</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {featureItems.map((feat, i) => (
              <div key={feat.title} className="feat-item group relative">
                <span className="absolute -top-2 right-0 text-[80px] font-bold text-foreground/[0.03] leading-none select-none pointer-events-none font-display">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="h-px bg-border mb-6 w-8 group-hover:w-16 group-hover:bg-primary transition-all duration-500" />
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">{feat.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          PRICING
      ═══════════════════════════════════════════════════════════════════════ */}
      <section id="pricing" ref={pricingRef} className="py-32 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm text-primary font-medium tracking-wide uppercase mb-4">Pricing</p>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">Simple and <span className="font-display italic">transparent.</span></h2>
          </div>

          <div className="pricing-card bg-card rounded-3xl border border-border overflow-hidden transition-all duration-500 hover:border-primary/30 hover:shadow-[0_0_40px_-12px_hsla(var(--primary),0.15)]">
            <div className="p-10 md:p-14">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
                <div>
                  <span className="text-sm text-muted-foreground">Per property, per month</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-6xl md:text-7xl font-bold text-foreground">$29</span>
                  </div>
                </div>
                <Link to="/auth?mode=signup">
                  <Button className="btn-magnetic border border-foreground/20 bg-transparent text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary rounded-xl h-12 px-8 text-base font-medium transition-all duration-300">
                    Start 14-day free trial
                  </Button>
                </Link>
              </div>
              <div className="h-px bg-border mb-10" />
              <div className="grid sm:grid-cols-2 gap-4">
                {pricingFeatures.map((feat) => (
                  <div key={feat} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-foreground/5 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-foreground" />
                    </div>
                    <span className="text-sm text-foreground/70">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-muted/50 px-10 md:px-14 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                Managing 5+ properties? <span className="text-foreground font-medium">Let's talk about bulk pricing.</span>
              </p>
              <Button variant="ghost" className="text-sm text-foreground underline underline-offset-4 hover:bg-transparent p-0 h-auto">
                Contact us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          FINAL CTA
      ═══════════════════════════════════════════════════════════════════════ */}
      <section ref={ctaRef} className="py-40 px-6 relative grain-overlay">
        {/* Decorative radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/[0.04] rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center final-cta-text relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground leading-tight mb-8">
            Stop answering the<br /><span className="font-display italic">same questions.</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-lg mx-auto">
            Your guests deserve instant answers. You deserve your time back.
          </p>
          <Link to="/auth?mode=signup">
            <Button className="btn-magnetic border border-foreground/20 bg-transparent text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary rounded-xl h-14 px-10 text-base font-medium transition-all duration-300 group">
              Get started for free
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════════════════════════════ */}
      <footer className="py-8 px-8 md:px-12 border-t border-border">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground/40">© 2026 airier. All rights reserved.</p>
          <div className="flex items-center gap-8 text-xs text-muted-foreground/40">
            {["Privacy", "Terms", "Contact"].map((label) => (
              <a key={label} href="#" className="relative hover:text-foreground transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-primary after:transition-all after:duration-300 hover:after:w-full">
                {label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;