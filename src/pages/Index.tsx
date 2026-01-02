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
  CheckCircle2
} from "lucide-react";

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

const Index = () => {
  const [visibleQuestions, setVisibleQuestions] = useState<number[]>([]);
  const [activeStep, setActiveStep] = useState(0);
  const smsContainerRef = useRef<HTMLDivElement>(null);

  // Scroll-triggered SMS appearance
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

  // Auto-cycle through demo steps
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

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
                    style={{ 
                      strokeDasharray: 300, 
                      strokeDashoffset: 300,
                      animation: "draw 1s ease-out 0.5s forwards"
                    }}
                  />
                </svg>
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Deploy an AI text agent for your guests. They can connect themselves during their stay, or you can pre-add them before arrival.
            </p>

            {/* Key feature checkmarks */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-10 animate-fade-in" style={{ animationDelay: "0.25s" }}>
              {keyFeatures.map((feature, i) => (
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

      {/* Scattered SMS Messages Section - THE FOCAL POINT */}
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
      
      {/* How It Works Section - Updated */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Up and running in minutes
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              No technical skills required. Set up your AI text agent and let guests connect via SMS.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Steps */}
            <div className="space-y-6">
              {[
                {
                  icon: Home,
                  title: "Add your property",
                  description: "Enter your property details, upload photos, and set the basics like address and type."
                },
                {
                  icon: Brain,
                  title: "Train your AI",
                  description: "Add amenities, house rules, WiFi info, local recommendations - everything a guest might ask about."
                },
                {
                  icon: UserPlus,
                  title: "Connect guests",
                  description: "Pre-add guests before their stay, or let them text in themselves when they arrive. Either way works."
                }
              ].map((step, index) => (
                <button
                  key={index}
                  onClick={() => setActiveStep(index)}
                  className={`w-full text-left p-6 rounded-xl border transition-all duration-300 ${
                    activeStep === index 
                      ? "bg-primary/5 border-primary shadow-card" 
                      : "bg-card border-border hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                      activeStep === index ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}>
                      <step.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-lg font-semibold mb-1 ${activeStep === index ? "text-primary" : "text-foreground"}`}>
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">{step.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* SMS Demo */}
            <div className="bg-card rounded-2xl shadow-elevated border border-border p-6 lg:p-8">
              {/* Phone mockup */}
              <div className="bg-muted rounded-[2rem] p-4 max-w-[320px] mx-auto">
                <div className="bg-background rounded-[1.5rem] overflow-hidden">
                  {/* Status bar */}
                  <div className="bg-foreground/5 px-4 py-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>9:41</span>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-2 border border-current rounded-sm" />
                    </div>
                  </div>
                  
                  {/* Chat header */}
                  <div className="px-4 py-3 border-b border-border flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">Beach House AI</p>
                      <p className="text-xs text-muted-foreground">SMS • Online</p>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="p-4 space-y-3 min-h-[280px]">
                    {activeStep === 0 && (
                      <>
                        <div className="bg-muted rounded-2xl rounded-tl-sm p-3 max-w-[85%] animate-fade-in">
                          <p className="text-sm text-foreground">Hi! I just booked Beach House for next week</p>
                        </div>
                        <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm p-3 max-w-[85%] ml-auto animate-fade-in" style={{ animationDelay: "0.3s" }}>
                          <p className="text-sm">Welcome! 🏖️ I'm the AI assistant for Beach House. I can help with check-in, amenities, local tips, and more. What would you like to know?</p>
                        </div>
                      </>
                    )}
                    {activeStep === 1 && (
                      <>
                        <div className="bg-muted rounded-2xl rounded-tl-sm p-3 max-w-[85%] animate-fade-in">
                          <p className="text-sm text-foreground">What's the WiFi password?</p>
                        </div>
                        <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm p-3 max-w-[85%] ml-auto animate-fade-in" style={{ animationDelay: "0.3s" }}>
                          <p className="text-sm">The WiFi network is "BeachHouse_Guest" and the password is "SunsetViews2024". You'll find it printed on the fridge too!</p>
                        </div>
                        <div className="bg-muted rounded-2xl rounded-tl-sm p-3 max-w-[85%] animate-fade-in" style={{ animationDelay: "0.6s" }}>
                          <p className="text-sm text-foreground">Perfect! And checkout time?</p>
                        </div>
                        <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm p-3 max-w-[85%] ml-auto animate-fade-in" style={{ animationDelay: "0.9s" }}>
                          <p className="text-sm">Checkout is at 11:00 AM. Just leave the keys on the kitchen counter. Safe travels! 👋</p>
                        </div>
                      </>
                    )}
                    {activeStep === 2 && (
                      <>
                        <div className="bg-muted rounded-2xl rounded-tl-sm p-3 max-w-[85%] animate-fade-in">
                          <p className="text-sm text-foreground">We're here! How do we get in?</p>
                        </div>
                        <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm p-3 max-w-[85%] ml-auto animate-fade-in" style={{ animationDelay: "0.3s" }}>
                          <p className="text-sm">Welcome! 🔑 The lockbox is on the left side of the front door. Your code is 4829. Let me know once you're inside!</p>
                        </div>
                        <div className="bg-muted rounded-2xl rounded-tl-sm p-3 max-w-[85%] animate-fade-in" style={{ animationDelay: "0.6s" }}>
                          <p className="text-sm text-foreground">We're in! This place is amazing 😍</p>
                        </div>
                        <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm p-3 max-w-[85%] ml-auto animate-fade-in" style={{ animationDelay: "0.9s" }}>
                          <p className="text-sm">So glad you love it! I'm here 24/7 if you need anything. Enjoy your stay! 🌊</p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Input */}
                  <div className="px-4 py-3 border-t border-border">
                    <div className="bg-muted rounded-full px-4 py-2 text-sm text-muted-foreground">
                      Text Message
                    </div>
                  </div>
                </div>
              </div>

              {/* Guest connection info */}
              <div className="mt-6 p-4 bg-muted/50 rounded-xl">
                <p className="text-sm font-medium text-foreground mb-2">Two ways to connect guests:</p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span><strong>Pre-add them</strong> - Enter guest details before their stay</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span><strong>Self-connect</strong> - Guests text a number to start chatting</span>
                  </div>
                </div>
              </div>
            </div>
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
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Index;
