import { useState, useEffect } from "react";
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
  Sparkles
} from "lucide-react";

// Demo steps for the animated showcase
const demoSteps = [
  {
    title: "Add your property",
    description: "Import your listing details in seconds",
    screen: "property-setup"
  },
  {
    title: "Train your AI",
    description: "Teach it about amenities, rules & local tips",
    screen: "knowledge-base"
  },
  {
    title: "Connect your guests",
    description: "Share the unique chat link with each guest",
    screen: "guest-chat"
  },
  {
    title: "Relax & monitor",
    description: "AI handles questions while you track everything",
    screen: "dashboard"
  }
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
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % demoSteps.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-40 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-60 right-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              AI-Powered Guest Communication
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
                    className="animate-[draw_1s_ease-out_0.5s_forwards]"
                    style={{ 
                      strokeDasharray: 300, 
                      strokeDashoffset: 300,
                      animation: "draw 1s ease-out 0.5s forwards"
                    }}
                  />
                </svg>
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Deploy AI chat agents for your guests. Automate communication, provide instant answers, and save hours every week.
            </p>
            
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
          
          {/* Animated App Demo */}
          <div className="max-w-5xl mx-auto animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <div className="bg-card rounded-2xl shadow-elevated border border-border overflow-hidden">
              {/* Browser chrome */}
              <div className="bg-muted px-4 py-3 flex items-center gap-2 border-b border-border">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[hsl(0,84%,60%)]" />
                  <div className="w-3 h-3 rounded-full bg-[hsl(43,96%,56%)]" />
                  <div className="w-3 h-3 rounded-full bg-[hsl(142,71%,45%)]" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="bg-background rounded-md px-4 py-1.5 text-sm text-muted-foreground">
                    app.airier.com
                  </div>
                </div>
              </div>
              
              {/* Demo content */}
              <div className="aspect-[16/9] bg-background relative">
                {/* Step indicators */}
                <div className="absolute left-6 top-6 z-10 space-y-3">
                  {demoSteps.map((step, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveStep(index)}
                      className={`flex items-center gap-3 text-left transition-all duration-300 ${
                        activeStep === index ? "opacity-100" : "opacity-40 hover:opacity-70"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                        activeStep === index 
                          ? "bg-primary text-primary-foreground scale-110" 
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {activeStep > index ? <Check className="w-4 h-4" /> : index + 1}
                      </div>
                      <div className={`transition-all duration-300 ${activeStep === index ? "translate-x-0" : "-translate-x-2"}`}>
                        <p className={`font-medium ${activeStep === index ? "text-foreground" : "text-muted-foreground"}`}>
                          {step.title}
                        </p>
                        <p className="text-xs text-muted-foreground">{step.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
                
                {/* Animated screens */}
                <div className="absolute right-6 top-6 bottom-6 w-[55%] bg-muted/50 rounded-xl overflow-hidden border border-border">
                  {/* Property Setup Screen */}
                  <div className={`absolute inset-0 p-6 transition-all duration-500 ${
                    activeStep === 0 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
                  }`}>
                    <div className="space-y-4">
                      <div className="h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-primary/20 rounded-lg mx-auto mb-2 animate-pulse" />
                          <p className="text-sm text-muted-foreground">Drop property image</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-10 bg-background rounded-md border border-border animate-pulse" />
                        <div className="h-10 bg-background rounded-md border border-border animate-pulse" style={{ animationDelay: "0.1s" }} />
                        <div className="h-20 bg-background rounded-md border border-border animate-pulse" style={{ animationDelay: "0.2s" }} />
                      </div>
                    </div>
                  </div>
                  
                  {/* Knowledge Base Screen */}
                  <div className={`absolute inset-0 p-6 transition-all duration-500 ${
                    activeStep === 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
                  }`}>
                    <div className="space-y-4">
                      <p className="font-medium text-foreground">Amenities</p>
                      <div className="flex flex-wrap gap-2">
                        {["WiFi", "Pool", "Parking", "AC", "Kitchen", "Gym"].map((item, i) => (
                          <div 
                            key={item} 
                            className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm animate-scale-in"
                            style={{ animationDelay: `${i * 0.1}s` }}
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                      <p className="font-medium text-foreground mt-4">House Rules</p>
                      <div className="space-y-2">
                        {["No smoking", "Quiet hours 10pm-8am", "Max 6 guests"].map((rule, i) => (
                          <div 
                            key={rule}
                            className="flex items-center gap-2 text-sm animate-fade-in"
                            style={{ animationDelay: `${0.3 + i * 0.1}s` }}
                          >
                            <Check className="w-4 h-4 text-primary" />
                            <span className="text-muted-foreground">{rule}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Guest Chat Screen */}
                  <div className={`absolute inset-0 p-6 transition-all duration-500 ${
                    activeStep === 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
                  }`}>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-primary/20 rounded-full" />
                        <div>
                          <p className="font-medium text-foreground">Beach House AI</p>
                          <p className="text-xs text-muted-foreground">Online</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="bg-muted rounded-2xl rounded-tl-sm p-3 max-w-[80%] animate-fade-in">
                          <p className="text-sm text-foreground">What's the WiFi password?</p>
                        </div>
                        <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm p-3 max-w-[80%] ml-auto animate-fade-in" style={{ animationDelay: "0.3s" }}>
                          <p className="text-sm">The WiFi password is "BeachVibes2024". The network name is "Beach House Guest".</p>
                        </div>
                        <div className="bg-muted rounded-2xl rounded-tl-sm p-3 max-w-[80%] animate-fade-in" style={{ animationDelay: "0.6s" }}>
                          <p className="text-sm text-foreground">Thanks! What time is checkout?</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Dashboard Screen */}
                  <div className={`absolute inset-0 p-6 transition-all duration-500 ${
                    activeStep === 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
                  }`}>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label: "Messages Today", value: "24" },
                          { label: "Response Time", value: "<2s" },
                          { label: "Satisfaction", value: "98%" },
                          { label: "Hours Saved", value: "12h" }
                        ].map((stat, i) => (
                          <div 
                            key={stat.label}
                            className="bg-background p-3 rounded-lg border border-border animate-scale-in"
                            style={{ animationDelay: `${i * 0.1}s` }}
                          >
                            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                            <p className="text-xs text-muted-foreground">{stat.label}</p>
                          </div>
                        ))}
                      </div>
                      <div className="bg-background p-4 rounded-lg border border-border animate-fade-in" style={{ animationDelay: "0.4s" }}>
                        <p className="text-sm font-medium text-foreground mb-2">Top Questions</p>
                        <div className="space-y-1.5">
                          {["WiFi password", "Check-in time", "Parking location"].map((q, i) => (
                            <div key={q} className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">{q}</span>
                              <span className="text-foreground font-medium">{12 - i * 3}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
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
      
      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Up and running in minutes
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              No technical skills required. Just add your property and let AI do the rest.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {demoSteps.map((step, index) => (
              <div 
                key={step.title}
                className="text-center animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 bg-muted/30">
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
      <section className="py-20 px-6">
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
