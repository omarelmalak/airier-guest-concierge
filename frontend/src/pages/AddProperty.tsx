import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { ExactAnswer, Guest, FeatureItem } from "@/lib/static-data/client-types";
import { PropertyInfo, KnowledgeCategoryInfo, PropertyKnowledgeCategoryInfo } from "@/lib/static-data/request-types";
import { Step1PropertyInfo } from "../components/add-property-steps/Step1PropertyInfo";
import { Step2PhotoUpload } from "../components/add-property-steps/Step2PhotoUpload";
import { Step3Knowledge } from "../components/add-property-steps/Step3Knowledge";
import { Step7ExactAnswers } from "../components/add-property-steps/Step7ExactAnswers";
import { Step8Guests } from "../components/add-property-steps/Step8Guests";
import { Step9Subscription } from "../components/add-property-steps/Step9Subscription";
import { PropertyCreated } from "../components/add-property-steps/PropertyCreated";
import { defaultAmenities, defaultWhereIsItems, defaultRecommendations, defaultRules } from "@/lib/static-data/defaults";
import { createProperty } from "@/lib/services/properties";
import { createKnowledgeCategory, createPropertyKnowledgeCategory, createFeature, createKnowledgeCategoryFeature, createExactAnswer } from "@/lib/services/knowledge";
import { createGuest, createReservation } from "@/lib/services/guests";

const STEPS = [
  { id: 1, title: "Property Info", description: "Basic details about your property" },
  { id: 2, title: "Photo", description: "Upload a cover photo" },
  { id: 3, title: "Knowledge", description: "What your concierge should know about your property" },
  { id: 4, title: "Knowledge", description: "What your concierge should know about your property" },
  { id: 5, title: "Knowledge", description: "What your concierge should know about your property" },
  { id: 6, title: "Knowledge", description: "What your concierge should know about your property" },
  { id: 7, title: "Exact Answers", description: "Set specific Q&A responses" },
  { id: 8, title: "Guests", description: "Add your first guests" },
  { id: 9, title: "Subscription", description: "Activate your AI assistant" },
];

const PLAN_PRICE = 29;

const AddProperty = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [createdPropertyId, setCreatedPropertyId] = useState<number | string | null>(null);

  const [propertyInfo, setPropertyInfo] = useState<PropertyInfo>({
    name: "",
    address: "",
    ownershipLevel: "",
    propertyType: "",
    bedrooms: "",
    bathrooms: "",
    photo: "",
    checkinMessage: "",
    checkoutMessage: "",
  });

  const [amenities, setAmenities] = useState<FeatureItem[]>(defaultAmenities);
  const [otherAmenities, setOtherAmenities] = useState("");
  const [whereIsItems, setWhereIsItems] = useState<FeatureItem[]>(defaultWhereIsItems);
  const [otherWhereIs, setOtherWhereIs] = useState("");
  const [recommendations, setRecommendations] = useState<FeatureItem[]>(defaultRecommendations);
  const [otherRecommendations, setOtherRecommendations] = useState("");
  const [rules, setRules] = useState<FeatureItem[]>(defaultRules);
  const [otherRules, setOtherRules] = useState("");

  const [exactAnswers, setExactAnswers] = useState<ExactAnswer[]>([
    { id: "1", question: "", answer: "" },
  ]);

  const [guests, setGuests] = useState<Guest[]>([
    { id: "1", firstName: "", lastName: "", phone: "", startDate: "", endDate: "" },
  ]);

  const [selectedMonths, setSelectedMonths] = useState(1);
  const [activateSubscription, setActivateSubscription] = useState(true);

  const addKnowledgePerCategory = async (
    categoryName: string,
    items: FeatureItem[],
    description: string,
    propertyId: string
  ) => {
    if (items.length === 0 && description === "") return;

    const knowledgeCategoryResponse = await createKnowledgeCategory({ name: categoryName });

    await createPropertyKnowledgeCategory({
      propertyId: propertyId,
      knowledgeCategoryId: knowledgeCategoryResponse.id,
      description: description,
    });

    for (const item of items) {
      if (item.enabled) {
        // CREATE THE FEATURE AND ATTACH TO THE KNOWLEDGE CATEGORY FOR THIS PROPERTY
        const response = await createFeature({
          name: item.label,
        });
        const knowledgeCategoryFeatureResponse = await createKnowledgeCategoryFeature({
          propertyId: propertyId,
          knowledgeCategoryId: knowledgeCategoryResponse.id,
          featureId: response.id,
          description: item.details || "",
        });
      }
    }
  };

  const addExactAnswers = async (exactAnswers: ExactAnswer[], propertyId: string) => {
    for (const exactAnswer of exactAnswers) {
      await createExactAnswer({
        propertyId: propertyId,
        question: exactAnswer.question,
        answer: exactAnswer.answer,
      });
    }
  };

  const addGuests = async (guests: Guest[], propertyId: string) => {
    for (const guest of guests) {
      const guestResponse = await createGuest({
        firstName: guest.firstName,
        lastName: guest.lastName,
        phone: guest.phone,
      });


      console.log("guestResponse:", guestResponse);
      const reservationResponse = await createReservation({
        propertyId: propertyId,
        guestId: guestResponse.id,
        checkIn: new Date(guest.startDate).toISOString(),
        checkOut: new Date(guest.endDate).toISOString(),
      });
    }
  };

  const handleNext = async () => {
    if (currentStep === STEPS.length) {
      setIsAnimating(true);

      try {
        const propertyResponse = await createProperty(propertyInfo);
        const propertyId = propertyResponse.id;

        await addKnowledgePerCategory("Amenities", amenities, otherAmenities, propertyId);
        await addKnowledgePerCategory("WhereIs", whereIsItems, otherWhereIs, propertyId);
        await addKnowledgePerCategory("Recommendations", recommendations, otherRecommendations, propertyId);
        await addKnowledgePerCategory("Rules", rules, otherRules, propertyId);

        await addExactAnswers(exactAnswers, propertyId);
        await addGuests(guests, propertyId);

        setCreatedPropertyId(propertyId);
        setIsCompleted(true);
      } catch (error) {
        console.error("Failed to create property:", error);
        setIsAnimating(false);
      }
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
        { id: Date.now().toString(), firstName: "", lastName: "", phone: "", startDate: "", endDate: "" },
      ]);
    }
  };

  const removeGuest = (id: string) => {
    if (guests.length > 1) {
      setGuests(guests.filter((g) => g.id !== id));
    }
  };

  const updateGuest = (id: string, field: keyof Guest, value: string) => {
    setGuests(guests.map((g) => (g.id === id ? { ...g, [field]: value } : g)));
  };

  const isStep1Valid = propertyInfo.name && propertyInfo.address && propertyInfo.ownershipLevel && propertyInfo.propertyType;

  const handleFinish = () => {
    navigate("/");
  };

  const progressGroups = [
    { id: "info", label: "1", steps: [1] },
    { id: "photo", label: "2", steps: [2] },
    { id: "knowledge", label: "3", steps: [3, 4, 5, 6] },
    { id: "answers", label: "4", steps: [7] },
    { id: "guests", label: "5", steps: [8] },
    { id: "subscription", label: "6", steps: [9] },
  ];

  if (isCompleted && createdPropertyId) {
    return <PropertyCreated propertyId={createdPropertyId} />;
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/properties")}
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
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${isComplete
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
                    className={`w-8 sm:w-12 h-1 mx-1 rounded transition-all duration-300 ${isComplete ? "bg-primary" : "bg-muted"
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
          className={`bg-card rounded-xl border border-border p-6 mb-6 transition-all duration-300 ${isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
            }`}
        >
          {/* Step 1: Property Info */}
          {currentStep === 1 && (
            <Step1PropertyInfo
              propertyInfo={propertyInfo}
              setPropertyInfo={setPropertyInfo}
            />
          )}

          {/* Step 2: Photo Upload */}
          {currentStep === 2 && (
            <Step2PhotoUpload
              photo={propertyInfo.photo || null}
              setPhoto={(photo) => setPropertyInfo({ ...propertyInfo, photo: photo || "" })}
            />
          )}

          {/* Steps 3-6: Knowledge (Amenities, Where Is, Recommendations, Rules) */}
          {(currentStep === 3 || currentStep === 4 || currentStep === 5 || currentStep === 6) && (
            <Step3Knowledge
              currentSubStep={currentStep}
              amenities={amenities}
              setAmenities={setAmenities}
              otherAmenities={otherAmenities}
              setOtherAmenities={setOtherAmenities}
              whereIsItems={whereIsItems}
              setWhereIsItems={setWhereIsItems}
              otherWhereIs={otherWhereIs}
              setOtherWhereIs={setOtherWhereIs}
              recommendations={recommendations}
              setRecommendations={setRecommendations}
              otherRecommendations={otherRecommendations}
              setOtherRecommendations={setOtherRecommendations}
              rules={rules}
              setRules={setRules}
              otherRules={otherRules}
              setOtherRules={setOtherRules}
            />
          )}

          {/* Step 7: Exact Answers */}
          {currentStep === 7 && (
            <Step7ExactAnswers
              exactAnswers={exactAnswers}
              addExactAnswer={addExactAnswer}
              removeExactAnswer={removeExactAnswer}
              updateExactAnswer={updateExactAnswer}
            />
          )}

          {/* Step 8: Guests */}
          {currentStep === 8 && (
            <Step8Guests
              guests={guests}
              addGuest={addGuest}
              removeGuest={removeGuest}
              updateGuest={updateGuest}
            />
          )}

          {/* Step 9: Subscription */}
          {currentStep === 9 && (
            <Step9Subscription
              selectedMonths={selectedMonths}
              setSelectedMonths={setSelectedMonths}
              activateSubscription={activateSubscription}
              setActivateSubscription={setActivateSubscription}
              planPrice={PLAN_PRICE}
            />
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
