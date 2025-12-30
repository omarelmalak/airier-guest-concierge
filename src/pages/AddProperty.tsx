import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Upload, X, Plus, Trash2 } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  AmenitiesSection,
  WhereIsSection,
  LocalRecommendationsSection,
  RulesSection,
  defaultAmenities,
  defaultWhereIsItems,
  defaultRecommendations,
  defaultRules,
  AmenityItem,
  WhereIsItem,
  RecommendationCategory,
  RuleItem,
} from "@/components/KnowledgeEditor";

interface PropertyInfo {
  name: string;
  address: string;
  type: string;
  bedrooms: string;
  bathrooms: string;
}

interface ExactAnswer {
  id: string;
  question: string;
  answer: string;
}

interface GuestInfo {
  id: string;
  fullName: string;
  phone: string;
  startDate: string;
  endDate: string;
}

const STEPS = [
  { id: 1, title: "Property Info", description: "Basic details about your property" },
  { id: 2, title: "Photo", description: "Upload a cover photo" },
  { id: 3, title: "Amenities", description: "What does your property offer?" },
  { id: 4, title: "Where is?", description: "Help guests find things" },
  { id: 5, title: "Local Tips", description: "Share your favorite spots" },
  { id: 6, title: "Rules", description: "Set expectations" },
  { id: 7, title: "Exact Answers", description: "Set specific Q&A responses" },
  { id: 8, title: "Guests", description: "Add your first guests" },
];

const AddProperty = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Form states
  const [propertyInfo, setPropertyInfo] = useState<PropertyInfo>({
    name: "",
    address: "",
    type: "",
    bedrooms: "",
    bathrooms: "",
  });

  const [photo, setPhoto] = useState<string | null>(null);

  // Knowledge states - granular
  const [amenities, setAmenities] = useState<AmenityItem[]>(defaultAmenities);
  const [otherAmenities, setOtherAmenities] = useState("");
  const [whereIsItems, setWhereIsItems] = useState<WhereIsItem[]>(defaultWhereIsItems);
  const [otherWhereIs, setOtherWhereIs] = useState("");
  const [recommendations, setRecommendations] = useState<RecommendationCategory[]>(defaultRecommendations);
  const [rules, setRules] = useState<RuleItem[]>(defaultRules);
  const [otherRules, setOtherRules] = useState("");

  const [exactAnswers, setExactAnswers] = useState<ExactAnswer[]>([
    { id: "1", question: "", answer: "" },
  ]);

  const [guests, setGuests] = useState<GuestInfo[]>([
    { id: "1", fullName: "", phone: "", startDate: "", endDate: "" },
  ]);

  const handleNext = () => {
    if (currentStep === STEPS.length) {
      setIsAnimating(true);
      setTimeout(() => {
        setIsCompleted(true);
      }, 300);
      return;
    }
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
      setIsAnimating(false);
    }, 300);
  };

  const handleSkip = () => {
    handleNext();
  };

  const handleBack = () => {
    if (currentStep === 1) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep((prev) => prev - 1);
      setIsAnimating(false);
    }, 300);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addExactAnswer = () => {
    setExactAnswers([
      ...exactAnswers,
      { id: Date.now().toString(), question: "", answer: "" },
    ]);
  };

  const removeExactAnswer = (id: string) => {
    if (exactAnswers.length > 1) {
      setExactAnswers(exactAnswers.filter((ea) => ea.id !== id));
    }
  };

  const updateExactAnswer = (id: string, field: "question" | "answer", value: string) => {
    setExactAnswers(
      exactAnswers.map((ea) => (ea.id === id ? { ...ea, [field]: value } : ea))
    );
  };

  const addGuest = () => {
    if (guests.length < 3) {
      setGuests([
        ...guests,
        { id: Date.now().toString(), fullName: "", phone: "", startDate: "", endDate: "" },
      ]);
    }
  };

  const removeGuest = (id: string) => {
    if (guests.length > 1) {
      setGuests(guests.filter((g) => g.id !== id));
    }
  };

  const updateGuest = (id: string, field: keyof GuestInfo, value: string) => {
    setGuests(guests.map((g) => (g.id === id ? { ...g, [field]: value } : g)));
  };

  const isStep1Valid = propertyInfo.name && propertyInfo.address && propertyInfo.type;

  const handleFinish = () => {
    navigate("/");
  };

  // Get the step group for progress display
  const getStepGroup = (step: number) => {
    if (step === 1) return "info";
    if (step === 2) return "photo";
    if (step >= 3 && step <= 6) return "knowledge";
    if (step === 7) return "answers";
    return "guests";
  };

  const progressGroups = [
    { id: "info", label: "1", steps: [1] },
    { id: "photo", label: "2", steps: [2] },
    { id: "knowledge", label: "3", steps: [3, 4, 5, 6] },
    { id: "answers", label: "4", steps: [7] },
    { id: "guests", label: "5", steps: [8] },
  ];

  if (isCompleted) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] relative overflow-hidden">
          {/* Confetti particles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 rounded-sm"
                style={{
                  left: `${10 + (i * 7)}%`,
                  top: '-20px',
                  backgroundColor: i % 3 === 0 ? 'hsl(var(--primary))' : i % 3 === 1 ? 'hsl(var(--primary-light))' : 'hsl(var(--status-online))',
                  animation: `confetti-fall ${2 + (i * 0.2)}s ease-out ${i * 0.1}s forwards`,
                  transform: `rotate(${i * 30}deg)`,
                }}
              />
            ))}
          </div>
          
          <div className="text-center">
            {/* Checkmark Animation */}
            <div className="relative w-32 h-32 mx-auto mb-8">
              {/* Outer pulse ring */}
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-success-pulse" />
              
              {/* Main circle with checkmark */}
              <div className="relative flex items-center justify-center w-32 h-32 bg-primary rounded-full shadow-xl animate-circle-fill">
                <svg 
                  viewBox="0 0 52 52" 
                  className="w-16 h-16"
                >
                  <path 
                    fill="none" 
                    stroke="white" 
                    strokeWidth="4" 
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14 27l8 8 16-16"
                    strokeDasharray="100"
                    strokeDashoffset="100"
                    className="animate-checkmark"
                  />
                </svg>
              </div>
            </div>
            
            <div className="animate-float-up" style={{ animationDelay: '0.4s', opacity: 0 }}>
              <h1 className="text-3xl font-semibold text-foreground mb-3">
                Property Created!
              </h1>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Your property has been successfully added. You can now configure more settings or start welcoming guests.
              </p>
              
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => navigate("/property/new")}
                  className="min-w-[140px]"
                >
                  View Property
                </Button>
                <Button onClick={handleFinish} className="min-w-[140px]">
                  Back to Dashboard
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Properties
          </button>
          <h1 className="text-3xl font-semibold text-foreground">Add New Property</h1>
          <p className="text-muted-foreground mt-1">
            Set up your property in a few easy steps.
          </p>
        </div>

        {/* Progress Indicator - Grouped */}
        <div className="flex items-center gap-2 mb-8">
          {progressGroups.map((group, index) => {
            const isActive = group.steps.includes(currentStep);
            const isComplete = group.steps.every((s) => s < currentStep);
            const subProgress = isActive
              ? ((currentStep - group.steps[0]) / group.steps.length) * 100
              : isComplete
              ? 100
              : 0;

            return (
              <div key={group.id} className="flex items-center">
                <div className="relative">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                      isComplete
                        ? "bg-primary text-primary-foreground"
                        : isActive
                        ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isComplete ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      group.label
                    )}
                  </div>
                  {/* Sub-progress for knowledge section */}
                  {group.steps.length > 1 && isActive && (
                    <div className="absolute -bottom-2 left-0 right-0 h-1 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${subProgress}%` }}
                      />
                    </div>
                  )}
                </div>
                {index < progressGroups.length - 1 && (
                  <div
                    className={`w-8 sm:w-12 h-1 mx-1 rounded transition-all duration-300 ${
                      isComplete ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Step Title */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground">
            {STEPS[currentStep - 1].title}
          </h2>
          <p className="text-muted-foreground text-sm">
            {STEPS[currentStep - 1].description}
          </p>
        </div>

        {/* Step Content */}
        <div
          className={`bg-card rounded-xl border border-border p-6 mb-6 transition-all duration-300 ${
            isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
          }`}
        >
          {/* Step 1: Property Info */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <Label htmlFor="name">Property Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Cozy Downtown Loft"
                    value={propertyInfo.name}
                    onChange={(e) =>
                      setPropertyInfo({ ...propertyInfo, name: e.target.value })
                    }
                    className="mt-1.5"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    placeholder="e.g., 123 Main St, Toronto, Canada"
                    value={propertyInfo.address}
                    onChange={(e) =>
                      setPropertyInfo({ ...propertyInfo, address: e.target.value })
                    }
                    className="mt-1.5"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="type">Property Type *</Label>
                  <Input
                    id="type"
                    placeholder="e.g., Entire apartment, Private room, Cabin"
                    value={propertyInfo.type}
                    onChange={(e) =>
                      setPropertyInfo({ ...propertyInfo, type: e.target.value })
                    }
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    placeholder="2"
                    value={propertyInfo.bedrooms}
                    onChange={(e) =>
                      setPropertyInfo({ ...propertyInfo, bedrooms: e.target.value })
                    }
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    placeholder="1"
                    value={propertyInfo.bathrooms}
                    onChange={(e) =>
                      setPropertyInfo({ ...propertyInfo, bathrooms: e.target.value })
                    }
                    className="mt-1.5"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Photo Upload */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div className="relative">
                {photo ? (
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
                    <img
                      src={photo}
                      alt="Property preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => setPhoto(null)}
                      className="absolute top-3 right-3 p-2 bg-foreground/80 text-background rounded-full hover:bg-foreground transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="block aspect-video rounded-xl border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer">
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                      <Upload className="w-12 h-12 mb-3" />
                      <span className="font-medium">Click to upload a photo</span>
                      <span className="text-sm mt-1">PNG, JPG up to 10MB</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Amenities */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Tap to select amenities available at your property.
              </p>
              <AmenitiesSection
                amenities={amenities}
                setAmenities={setAmenities}
                otherAmenities={otherAmenities}
                setOtherAmenities={setOtherAmenities}
                compact
              />
            </div>
          )}

          {/* Step 4: Where Is */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Help guests find common items. Tap to add locations.
              </p>
              <WhereIsSection
                items={whereIsItems}
                setItems={setWhereIsItems}
                otherItems={otherWhereIs}
                setOtherItems={setOtherWhereIs}
                compact
              />
            </div>
          )}

          {/* Step 5: Local Recommendations */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Share your favorite local spots with guests.
              </p>
              <LocalRecommendationsSection
                recommendations={recommendations}
                setRecommendations={setRecommendations}
                compact
              />
            </div>
          )}

          {/* Step 6: Rules */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Set clear expectations for your guests.
              </p>
              <RulesSection
                rules={rules}
                setRules={setRules}
                otherRules={otherRules}
                setOtherRules={setOtherRules}
                compact
              />
            </div>
          )}

          {/* Step 7: Exact Answers */}
          {currentStep === 7 && (
            <div className="space-y-5">
              <p className="text-sm text-muted-foreground">
                Add questions that you want the AI to respond to with exact, word-for-word answers.
              </p>
              {exactAnswers.map((ea, index) => (
                <div
                  key={ea.id}
                  className="p-4 rounded-lg border border-border bg-secondary/30 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Q&A #{index + 1}
                    </span>
                    {exactAnswers.length > 1 && (
                      <button
                        onClick={() => removeExactAnswer(ea.id)}
                        className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div>
                    <Label>Question</Label>
                    <Input
                      placeholder="e.g., What's the Wi-Fi password?"
                      value={ea.question}
                      onChange={(e) => updateExactAnswer(ea.id, "question", e.target.value)}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label>Answer</Label>
                    <Textarea
                      placeholder="The exact response the AI will give..."
                      value={ea.answer}
                      onChange={(e) => updateExactAnswer(ea.id, "answer", e.target.value)}
                      className="mt-1.5 min-h-[80px] resize-none"
                    />
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={addExactAnswer}
                className="w-full gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Another Q&A
              </Button>
            </div>
          )}

          {/* Step 8: Guests */}
          {currentStep === 8 && (
            <div className="space-y-5">
              <p className="text-sm text-muted-foreground">
                Add up to 3 guests who will have access to your AI assistant.
              </p>
              {guests.map((guest, index) => (
                <div
                  key={guest.id}
                  className="p-4 rounded-lg border border-border bg-secondary/30 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Guest #{index + 1}
                    </span>
                    {guests.length > 1 && (
                      <button
                        onClick={() => removeGuest(guest.id)}
                        className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label>Full Name</Label>
                      <Input
                        placeholder="John Doe"
                        value={guest.fullName}
                        onChange={(e) => updateGuest(guest.id, "fullName", e.target.value)}
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label>Phone Number *</Label>
                      <Input
                        placeholder="+1 (555) 123-4567"
                        value={guest.phone}
                        onChange={(e) => updateGuest(guest.id, "phone", e.target.value)}
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label>Check-in Date</Label>
                      <Input
                        type="date"
                        value={guest.startDate}
                        onChange={(e) => updateGuest(guest.id, "startDate", e.target.value)}
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label>Check-out Date</Label>
                      <Input
                        type="date"
                        value={guest.endDate}
                        onChange={(e) => updateGuest(guest.id, "endDate", e.target.value)}
                        className="mt-1.5"
                      />
                    </div>
                  </div>
                </div>
              ))}
              {guests.length < 3 && (
                <Button
                  variant="outline"
                  onClick={addGuest}
                  className="w-full gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Another Guest
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          <div className="flex items-center gap-3">
            {currentStep > 1 && (
              <Button variant="ghost" onClick={handleSkip}>
                Skip
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={currentStep === 1 && !isStep1Valid}
              className="gap-2 min-w-[120px]"
            >
              {currentStep === STEPS.length ? "Finish" : "Continue"}
              {currentStep < STEPS.length && <ArrowRight className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddProperty;
