import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import LandingNav from "@/components/LandingNav";
import airierLogo from "@/assets/airier-logo.png";
import { 
  MessageSquare, 
  Clock, 
  Zap, 
  Shield, 
  Users, 
  BarChart3,
  ArrowRight,
  Check,
  Sparkles,
  Home,
  Brain,
  UserPlus,
  Send,
  CheckCircle2,
  Building,
  BookOpen,
  UserCheck,
  Timer,
  Star,
  Wrench,
  Calendar
} from "lucide-react";

// SMS-style questions that appear on scroll
const guestQuestions = [
  { text: "What's the WiFi password?", x: 8, y: 10 },
  { text: "How do I turn on the AC?", x: 72, y: 5 },
  { text: "Where's the gym?", x: 15, y: 35 },
  { text: "What time is checkout?", x: 60, y: 28 },
  { text: "Is there parking?", x: 5, y: 58 },
  { text: "How does the smart lock work?", x: 65, y: 50 },
  { text: "Are pets allowed?", x: 28, y: 18 },
  { text: "What's the check-in code?", x: 78, y: 70 },
  { text: "Is there a coffee maker?", x: 10, y: 78 },
  { text: "Where are extra towels?", x: 55, y: 75 },
  { text: "How do I use the TV?", x: 82, y: 35 },
  { text: "Any restaurant recommendations?", x: 35, y: 48 },
];

// Key features with checkmarks
const keyFeatures = [
  "Automated check-in instructions",
  "Instant check-out reminders",
  "24/7 guest support",
  "Property-specific knowledge"
];

const features = [
  {
    icon: MessageSquare,
    title: "24/7 Guest Support",
    description: "Your AI assistant answers guest questions instantly, any time of day or night."
  },
  {
    icon: Clock,
    title: "Save 10+ Hours Weekly",
    description: "Automate repetitive questions about check-in, WiFi, amenities, and more."
  },
  {
    icon: Zap,
    title: "Instant Responses",
    description: "No more delayed replies. Guests get answers in seconds, not hours."
  },
  {
    icon: Shield,
    title: "Accurate Information",
    description: "AI is trained on your specific property details. No hallucinations or guesses."
  },
  {
    icon: Users,
    title: "Multiple Properties",
    description: "Manage all your listings from one dashboard with property-specific AI agents."
  },
  {
    icon: BarChart3,
    title: "Conversation Analytics",
    description: "See what guests ask most and improve your listings based on real data."
  }
];

// End-to-end flow steps
const flowSteps = [
  {
    id: "add-property",
    icon: Building,
    title: "Add your property",
    description: "Enter property details, photos, and address"
  },
  {
    id: "knowledge",
    icon: BookOpen,
    title: "Train the AI",
    description: "Add WiFi, house rules, amenities, local tips"
  },
  {
    id: "add-guest",
    icon: UserCheck,
    title: "Add a guest",
    description: "Enter guest details before their arrival"
  },
  {
    id: "guest-text",
    icon: Send,
    title: "Guest receives text",
    description: "Instant AI support at their fingertips"
  }
];

// Value propositions
const valueProps = [
  {
    icon: Timer,
    title: "Less than 10 minutes",
    description: "From sign-up to your first AI-powered guest conversation"
  },
  {
    icon: Star,
    title: "More 5-star reviews",
    description: "Hosts report increased guest satisfaction with instant support"
  },
  {
    icon: Wrench,
    title: "Zero technical experience",
    description: "If you can send a text, you can set up airier"
  },
  {
    icon: Calendar,
    title: "Need help? Book a demo",
    description: "Our team will walk you through everything",
    isDemo: true
  }
];

const Index = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showAirierResponse, setShowAirierResponse] = useState(false);
  const [activeFlowStep, setActiveFlowStep] = useState(-1);
  const [pathProgress, setPathProgress] = useState(0);
  const [valuePropsVisible, setValuePropsVisible] = useState<number[]>([]);
  const smsContainerRef = useRef<HTMLDivElement>(null);
  const flowRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLDivElement>(null);
  const [visibleQuestions, setVisibleQuestions] = useState<number[]>([]);

  // SMS-style questions that will appear scattered
const guestQuestions = [
  { text: "What's the WiFi password?", delay: 0, x: 5, y: 15 },
  { text: "How do I turn on the AC?", delay: 0.2, x: 65, y: 8 },
  { text: "Where's the gym?", delay: 0.4, x: 20, y: 45 },
  { text: "What time is checkout?", delay: 0.6, x: 55, y: 35 },
  { text: "Is there parking?", delay: 0.8, x: 8, y: 70 },
  { text: "How does the smart lock work?", delay: 1.0, x: 60, y: 60 },
  { text: "Are pets allowed?", delay: 1.2, x: 35, y: 25 },
  { text: "What's the check-in code?", delay: 1.4, x: 75, y: 75 },
  { text: "Is there a coffee maker?", delay: 1.6, x: 15, y: 85 },
  { text: "Where are extra towels?", delay: 1.8, x: 50, y: 85 },
  { text: "How do I use the TV?", delay: 2.0, x: 80, y: 45 },
  { text: "Any restaurant recommendations?", delay: 2.2, x: 25, y: 55 },
];

  // Sticky scroll effect for SMS questions
  useEffect(() => {
    const handleScroll = () => {
      if (!smsContainerRef.current) return;
      
      const rect = smsContainerRef.current.getBoundingClientRect();
      const sectionHeight = smsContainerRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;
      
      // Calculate how far through the section we've scrolled
      const scrolledPast = viewportHeight - rect.top;
      const totalScrollable = sectionHeight + viewportHeight;
      const progress = Math.max(0, Math.min(1, scrolledPast / totalScrollable));
      
      setScrollProgress(progress);
      
      // Show airier response when we're 70% through
      if (progress > 0.6) {
        setShowAirierResponse(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Flow section - ball animation synced with step reveals
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Start the slow path animation
            let progress = 0;
            const duration = 6000; // 6 seconds total
            const stepInterval = duration / 4; // Each step takes 1.5s
            const startTime = Date.now();
            
            const animate = () => {
              const elapsed = Date.now() - startTime;
              progress = Math.min(1, elapsed / duration);
              setPathProgress(progress);
              
              // Reveal steps as ball reaches them
              const currentStep = Math.floor(progress * 4);
              if (currentStep > activeFlowStep) {
                setActiveFlowStep(currentStep);
              }
              
              if (progress < 1) {
                requestAnimationFrame(animate);
              }
            };
            
            requestAnimationFrame(animate);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (flowRef.current) {
      observer.observe(flowRef.current);
    }

    return () => observer.disconnect();
  }, [activeFlowStep]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Start revealing questions one by one
            guestQuestions.forEach((_, index) => {
              setTimeout(() => {
                setVisibleQuestions(prev => [...new Set([...prev, index])]);
              }, index * 200);
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    if (smsContainerRef.current) {
      observer.observe(smsContainerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Value props sequential reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            valueProps.forEach((_, index) => {
              setTimeout(() => {
                setValuePropsVisible(prev => [...new Set([...prev, index])]);
              }, index * 400);
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    if (valueRef.current) {
      observer.observe(valueRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const [flowVisible, setFlowVisible] = useState(true);

  useEffect(() => {
    if (!flowVisible) return;
    
    const interval = setInterval(() => {
      setActiveFlowStep((prev) => (prev + 1) % flowSteps.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [flowVisible]);

  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-40 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-60 right-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              AI-Powered SMS Agent for Rentals
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight animate-fade-in" style={{ animationDelay: "0.1s" }}>
              The short-term rental host that{" "}
              <span className="text-primary relative">
                never sleeps
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                  <path 
                    d="M2 10C50 3 100 3 150 6C200 9 250 5 298 8" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth="3" 
                    strokeLinecap="round"
                    className="animate-draw"
                  />
                </svg>
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Deploy an AI text agent for your guests. ZERO technical experience required.
            </p>

            {/* Key feature checkmarks */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-10 animate-fade-in" style={{ animationDelay: "0.25s" }}>
              {keyFeatures.map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <Link to="/auth?mode=signup">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-8 text-lg group">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg">
                  See How It Works
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section ref={smsContainerRef} className="py-20 px-6 relative overflow-hidden min-h-[600px]">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
          
        <div className="max-w-6xl mx-auto relative">
            <div className="text-center mb-8 relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Sound familiar?
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Your guests have endless questions. Answering them shouldn't be your full-time job.
              </p>
          </div>

          {/* Scattered SMS bubbles */}
          <div className="relative h-[450px] md:h-[500px]">
            {guestQuestions.map((question, index) => (
              <div
                key={index}
                className={`absolute transition-all duration-700 ${
                  visibleQuestions.includes(index) 
                    ? "opacity-100 translate-y-0" 
                    : "opacity-0 translate-y-8"
                }`}
                style={{
                  left: `${question.x}%`,
                  top: `${question.y}%`,
                  transform: `translate(-50%, -50%) ${visibleQuestions.includes(index) ? 'rotate(0deg)' : 'rotate(-5deg)'}`,
                  transitionDelay: `${question.delay}s`
                }}
              >
                <div className="bg-muted/80 backdrop-blur-sm border border-border rounded-2xl rounded-bl-sm px-4 py-2.5 shadow-card max-w-[200px] md:max-w-[240px]">
                  <p className="text-sm text-foreground whitespace-nowrap overflow-hidden text-ellipsis">
                    {question.text}
                  </p>
                </div>
              </div>
            ))}

            {/* Central airier response */}
            <div 
              className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-1000 ${
                visibleQuestions.length >= 8 ? "opacity-100 scale-100" : "opacity-0 scale-90"
              }`}
              style={{ transitionDelay: "2.5s" }}
            >
              <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-sm px-6 py-4 shadow-elevated max-w-[280px] md:max-w-[320px]">
                <div className="flex items-center gap-2 mb-2">
                  <img src={airierLogo} alt="airier" className="h-4 brightness-0 invert" />
                  <span className="text-xs opacity-80">airier handles it all</span>
                </div>
                <p className="text-sm">
                  I've got this. Every question, any time, instantly answered.
                </p>
              </div>
            </div>
          </div>

          {/* CTA below scattered messages */}
          <div 
            className={`text-center mt-8 transition-all duration-700 ${
              visibleQuestions.length >= 10 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "3s" }}
          >
            <Link to="/auth?mode=signup">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Let airier handle it
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works - End-to-End Flow with Dotted Path */}
      <section id="how-it-works" ref={flowRef} className="py-24 px-6 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Up and running in minutes
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A complete flow from setup to your guest's first text
            </p>
          </div>

          {/* Desktop Flow - Horizontal with dotted path */}
          <div className="hidden lg:block relative">
            {/* Dotted path SVG */}
            <svg 
              className="absolute top-24 left-0 w-full h-32 overflow-visible"
              viewBox="0 0 1000 120"
              preserveAspectRatio="none"
            >
              <path
                d="M 60 60 Q 200 20, 310 60 T 560 60 T 810 60 T 940 60"
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="2"
                strokeDasharray="8 8"
                className={`transition-all duration-1000 ${flowVisible ? "opacity-100" : "opacity-0"}`}
              />
              {/* Animated dot traveling along path */}
              <circle 
                r="6" 
                fill="hsl(var(--primary))"
                className={`transition-opacity duration-500 ${flowVisible ? "opacity-100" : "opacity-0"}`}
              >
                <animateMotion
                  dur="4s"
                  repeatCount="indefinite"
                  path="M 60 60 Q 200 20, 310 60 T 560 60 T 810 60 T 940 60"
                />
              </circle>
            </svg>

            {/* Flow steps */}
            <div className="grid grid-cols-4 gap-8 relative z-10">
              {flowSteps.map((step, index) => (
                <div 
                  key={step.id}
                  className={`flex flex-col items-center transition-all duration-500 ${
                    flowVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${index * 0.15}s` }}
                >
                  {/* Step number and icon */}
                  <div 
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 ${
                      activeFlowStep === index 
                        ? "bg-primary text-primary-foreground scale-110 shadow-elevated" 
                        : "bg-card border border-border text-muted-foreground"
                    }`}
                  >
                    <step.icon className="w-7 h-7" />
                  </div>
                  
                  {/* Step label */}
                  <div className="text-center">
                    <span className="text-xs font-medium text-primary mb-1 block">Step {index + 1}</span>
                    <h3 className={`font-semibold mb-1 transition-colors ${
                      activeFlowStep === index ? "text-foreground" : "text-muted-foreground"
                    }`}>
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Demo cards showing each step */}
            <div className="mt-16 grid grid-cols-4 gap-6">
              {/* Add Property Card */}
              <div className={`bg-card rounded-xl border border-border p-4 transition-all duration-500 ${
                activeFlowStep === 0 ? "ring-2 ring-primary shadow-elevated" : "opacity-60"
              }`}>
                <div className="text-xs text-muted-foreground mb-2">Dashboard</div>
                <div className="bg-muted rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                      <Home className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="h-2 w-20 bg-foreground/20 rounded" />
                      <div className="h-1.5 w-14 bg-foreground/10 rounded mt-1" />
                    </div>
                  </div>
                  <div className="h-16 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg flex items-center justify-center">
                    <span className="text-xs text-primary font-medium">+ Add Property</span>
                  </div>
                </div>
              </div>

              {/* Knowledge Card */}
              <div className={`bg-card rounded-xl border border-border p-4 transition-all duration-500 ${
                activeFlowStep === 1 ? "ring-2 ring-primary shadow-elevated" : "opacity-60"
              }`}>
                <div className="text-xs text-muted-foreground mb-2">Knowledge Base</div>
                <div className="bg-muted rounded-lg p-3 space-y-2">
                  <div className="flex gap-2">
                    <div className="flex-1 h-8 bg-background rounded px-2 flex items-center">
                      <span className="text-xs text-muted-foreground">WiFi: BeachHouse_Guest</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 h-8 bg-background rounded px-2 flex items-center">
                      <span className="text-xs text-muted-foreground">Checkout: 11:00 AM</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 h-8 bg-background rounded px-2 flex items-center">
                      <span className="text-xs text-muted-foreground">Parking: Spot #24</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Add Guest Card */}
              <div className={`bg-card rounded-xl border border-border p-4 transition-all duration-500 ${
                activeFlowStep === 2 ? "ring-2 ring-primary shadow-elevated" : "opacity-60"
              }`}>
                <div className="text-xs text-muted-foreground mb-2">Guest Management</div>
                <div className="bg-muted rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2 p-2 bg-background rounded">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-xs font-medium text-primary">JD</span>
                    </div>
                    <div>
                      <div className="text-xs font-medium">John Doe</div>
                      <div className="text-xs text-muted-foreground">Jan 15 - Jan 18</div>
                    </div>
                  </div>
                  <div className="h-10 border-2 border-dashed border-primary/30 rounded flex items-center justify-center">
                    <span className="text-xs text-primary">+ Add Guest</span>
                  </div>
                </div>
              </div>

              {/* Guest Text Card */}
              <div className={`bg-card rounded-xl border border-border p-4 transition-all duration-500 ${
                activeFlowStep === 3 ? "ring-2 ring-primary shadow-elevated" : "opacity-60"
              }`}>
                <div className="text-xs text-muted-foreground mb-2">SMS Conversation</div>
                <div className="bg-muted rounded-lg p-3 space-y-2">
                  <div className="bg-background rounded-xl rounded-tl-sm p-2 max-w-[85%]">
                    <p className="text-xs">What's the WiFi?</p>
                  </div>
                  <div className="bg-primary text-primary-foreground rounded-xl rounded-tr-sm p-2 max-w-[85%] ml-auto">
                    <p className="text-xs">BeachHouse_Guest, password: SunsetViews2024 🏠</p>
                  </div>
                  <div className="bg-background rounded-xl rounded-tl-sm p-2 max-w-[85%]">
                    <p className="text-xs">Thanks! 🙏</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Flow - Vertical */}
          <div className="lg:hidden space-y-6">
            {flowSteps.map((step, index) => (
              <div 
                key={step.id}
                className={`relative pl-16 transition-all duration-500 ${
                  flowVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                }`}
                style={{ transitionDelay: `${index * 0.15}s` }}
              >
                {/* Vertical line */}
                {index < flowSteps.length - 1 && (
                  <div className="absolute left-7 top-14 w-0.5 h-full bg-border" style={{ backgroundImage: "repeating-linear-gradient(to bottom, hsl(var(--border)) 0, hsl(var(--border)) 4px, transparent 4px, transparent 8px)" }} />
                )}
                
                {/* Step icon */}
                <div className={`absolute left-0 w-14 h-14 rounded-xl flex items-center justify-center transition-all ${
                  activeFlowStep === index 
                    ? "bg-primary text-primary-foreground shadow-elevated" 
                    : "bg-card border border-border text-muted-foreground"
                }`}>
                  <step.icon className="w-6 h-6" />
                </div>
                
                {/* Content */}
                <div className="bg-card rounded-xl border border-border p-4">
                  <span className="text-xs font-medium text-primary">Step {index + 1}</span>
                  <h3 className="font-semibold text-foreground">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Two ways to connect */}
          <div className="mt-16 bg-card rounded-2xl border border-border p-6 md:p-8">
            <h3 className="text-lg font-semibold text-foreground mb-4 text-center">Two ways to connect guests</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <UserPlus className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Pre-add guests</h4>
                  <p className="text-sm text-muted-foreground">Enter guest details before their stay. They'll receive a welcome text automatically.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Self-connect</h4>
                  <p className="text-sm text-muted-foreground">Share a phone number or QR code. Guests text in themselves when they need help.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Propositions Section */}
      <section ref={valueRef} className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {valueProps.map((prop, index) => (
              <div
                key={prop.title}
                className={`relative p-6 rounded-2xl border transition-all duration-700 ${
                  valuePropsVisible.includes(index) 
                    ? "opacity-100 translate-y-0 border-primary/20 bg-card shadow-card" 
                    : "opacity-0 translate-y-8 border-transparent"
                } ${prop.isDemo ? "bg-primary/5" : ""}`}
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                {/* Animated entrance effect */}
                <div className={`absolute inset-0 rounded-2xl bg-primary/10 transition-transform duration-500 ${
                  valuePropsVisible.includes(index) ? "scale-0" : "scale-100"
                }`} style={{ transitionDelay: `${index * 0.1 + 0.3}s` }} />
                
                <div className="relative">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                    prop.isDemo ? "bg-primary text-primary-foreground" : "bg-primary/10"
                  }`}>
                    <prop.icon className={`w-6 h-6 ${prop.isDemo ? "" : "text-primary"}`} />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{prop.title}</h3>
                  <p className="text-sm text-muted-foreground">{prop.description}</p>
                  
                  {prop.isDemo && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-4 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      Schedule Demo
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything you need to automate guest support
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Focus on growing your business while AI handles the repetitive questions.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={feature.title}
                className="border-border bg-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-muted-foreground">
              Pay per property. No hidden fees. Cancel anytime.
            </p>
          </div>
          
          <Card className="border-border bg-card overflow-hidden">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2">
                <div className="p-8 md:p-12">
                  <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
                    Per Property
                  </div>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-5xl font-bold text-foreground">$29</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <p className="text-muted-foreground mb-8">
                    Everything you need to automate guest communication for one property.
                  </p>
                  <ul className="space-y-3 mb-8">
                    {[
                      "Unlimited AI conversations",
                      "Up to 3 simultaneous guests",
                      "Custom knowledge base",
                      "Conversation history",
                      "Analytics dashboard",
                      "Email support"
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-foreground">
                        <Check className="w-5 h-5 text-primary flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link to="/auth?mode=signup">
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                      Start 14-Day Free Trial
                    </Button>
                  </Link>
                </div>
                <div className="bg-gradient-to-br from-primary to-primary-light p-8 md:p-12 text-primary-foreground flex flex-col justify-center">
                  <h3 className="text-2xl font-bold mb-4">Managing multiple properties?</h3>
                  <p className="text-primary-foreground/80 mb-6">
                    Add unlimited properties to your account. Each property gets its own AI agent with custom knowledge.
                  </p>
                  <div className="space-y-3">
                    {["Bulk discounts available", "Priority support", "Custom integrations"].map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ready to stop answering the same questions?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join hundreds of hosts who've automated their guest communication with airier.
          </p>
          <Link to="/auth?mode=signup">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-8 text-lg group">
              Get Started for Free
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-border py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <img src={airierLogo} alt="airier" className="h-6" />
          </div>
          <div className="flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 airier. All rights reserved.
          </p>
        </div>
      </footer>
      
      <style>{`
        @keyframes draw {
          from {
            stroke-dashoffset: 300;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
        .animate-draw {
          stroke-dasharray: 300;
          stroke-dashoffset: 300;
          animation: draw 1s ease-out 0.5s forwards;
        }
      `}</style>
    </div>
  );
};

export default Index;
