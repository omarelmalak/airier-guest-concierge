import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Star, Wifi, Car, Droplets, ChefHat, Plus, Trash2, Save, Clock, Bell, X, RotateCcw, Zap, Calendar } from "lucide-react";
import { mockProperties, Property, Guest } from "@/data/mockData";
import StatusBadge from "@/components/StatusBadge";
import DashboardLayout from "@/components/DashboardLayout";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import SubscriptionDialog from "@/components/SubscriptionDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AmenityItem, WhereIsItem, RecommendationItem, RuleItem, TabType } from "@/lib/static-data/client-types";
import { AmenitiesSection } from "@/components/knowledge/AmenitiesSection";
import { WhereIsSection } from "@/components/knowledge/WhereIsSection";
import { LocalRecommendationsSection } from "@/components/knowledge/LocalRecommendationsSection";
import { RulesSection } from "@/components/knowledge/RulesSection";

const tabs: { id: TabType; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "knowledge", label: "Knowledge" },
  { id: "exact-answers", label: "Exact Answers" },
  { id: "guests", label: "Guests" },
];

const amenityIcons: Record<string, React.ElementType> = {
  "Wi-Fi": Wifi,
  "Parking": Car,
  "Pool": Droplets,
  "Kitchen": ChefHat,
};

const PropertyDetail = () => {
  const { id } = useParams();
  const property = mockProperties.find((p) => p.id === id);
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  // Form states
  const [checkInTime, setCheckInTime] = useState(property?.checkInTime || "15:00");
  const [checkOutTime, setCheckOutTime] = useState(property?.checkOutTime || "11:00");
  const [checkInReminderHours, setCheckInReminderHours] = useState(property?.checkInReminderHours || 2);
  const [checkOutReminderHours, setCheckOutReminderHours] = useState(property?.checkOutReminderHours || 1);
  const [checkInMessage, setCheckInMessage] = useState(property?.checkInMessage || "");
  const [checkOutMessage, setCheckOutMessage] = useState(property?.checkOutMessage || "");

  // Knowledge states - new granular structure
  const [amenities, setAmenities] = useState<AmenityItem[]>();
  const [otherAmenities, setOtherAmenities] = useState("");
  const [whereIsItems, setWhereIsItems] = useState<WhereIsItem[]>();
  const [otherWhereIs, setOtherWhereIs] = useState("");
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>();
  const [otherRecommendations, setOtherRecommendations] = useState("");
  const [rules, setRules] = useState<RuleItem[]>();
  const [otherRules, setOtherRules] = useState("");

  // Exact answers states
  const [exactAnswers, setExactAnswers] = useState(property?.exactAnswers || []);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");

  // Guests state
  const [guests, setGuests] = useState<Guest[]>(property?.guests || []);

  // Subscription state
  const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState(false);
  const [subscriptionActive, setSubscriptionActive] = useState(property?.subscriptionActive || false);
  const [subscriptionExpiry, setSubscriptionExpiry] = useState(property?.subscriptionExpiry || "");

  const handleSubscriptionActivate = (months: number) => {
    const baseDate = subscriptionExpiry ? new Date(subscriptionExpiry) : new Date();
    const newDate = new Date(baseDate);
    newDate.setMonth(newDate.getMonth() + months);
    const newExpiry = newDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    setSubscriptionActive(true);
    setSubscriptionExpiry(newExpiry);
  };

  const handleSubscriptionDeactivate = () => {
    setSubscriptionActive(false);
  };

  if (!property) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Property not found</p>
          <Link to="/properties" className="text-primary hover:underline mt-2 inline-block">
            Back to Properties
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const addExactAnswer = () => {
    if (newQuestion && newAnswer) {
      setExactAnswers([
        ...exactAnswers,
        { id: Date.now().toString(), question: newQuestion, answer: newAnswer },
      ]);
      setNewQuestion("");
      setNewAnswer("");
    }
  };

  const removeExactAnswer = (id: string) => {
    setExactAnswers(exactAnswers.filter((ea) => ea.id !== id));
  };

  const toggleGuestActive = (guestId: string) => {
    setGuests(guests.map((g) =>
      g.id === guestId ? { ...g, isActive: !g.isActive } : g
    ));
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto animate-fade-in">
        {/* Back Button */}
        <Link
          to="/properties"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Properties</span>
        </Link>

        {/* Property Header */}
        <div className="bg-card rounded-2xl border border-border shadow-card p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Image */}
            <div className="w-full md:w-64 h-44 rounded-xl overflow-hidden flex-shrink-0">
              <img
                src={property.image}
                alt={property.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-semibold text-foreground mb-1">
                    {property.name}, <span className="text-muted-foreground font-normal">{property.address}</span>
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{property.ownershipLevel} {property.propertyType}</span>
                    <span>·</span>
                    <span>{property.bedrooms} bedrooms</span>
                    <span>·</span>
                    <span>{property.bathrooms} bathrooms</span>
                  </div>
                </div>
                <StatusBadge status={property.aiStatus} />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-status-warning fill-status-warning" />
                    <span className="font-semibold">{property.rating}</span>
                    <span className="text-muted-foreground text-sm">({property.reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm">
                    {subscriptionActive ? (
                      <>
                        <span className="flex items-center gap-1 text-status-online">
                          <span className="w-1.5 h-1.5 rounded-full bg-status-online" />
                          Active
                        </span>
                        <span className="text-muted-foreground mx-1">·</span>
                        <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          until <span className="font-medium text-foreground">{subscriptionExpiry}</span>
                        </span>
                      </>
                    ) : (
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                        Subscription Inactive
                      </span>
                    )}
                  </div>
                </div>

                <Button
                  variant={subscriptionActive ? "outline" : "default"}
                  size="sm"
                  onClick={() => setSubscriptionDialogOpen(true)}
                  className="flex-shrink-0"
                >
                  {subscriptionActive ? (
                    <>
                      <RotateCcw className="w-4 h-4 mr-1.5" />
                      Renew
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-1.5" />
                      Activate
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border mb-6">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "tab-item",
                  activeTab === tab.id && "tab-item-active"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in">
          {activeTab === "overview" && (
            <OverviewTab
              property={property}
              checkInTime={checkInTime}
              setCheckInTime={setCheckInTime}
              checkOutTime={checkOutTime}
              setCheckOutTime={setCheckOutTime}
              checkInReminderHours={checkInReminderHours}
              setCheckInReminderHours={setCheckInReminderHours}
              checkOutReminderHours={checkOutReminderHours}
              setCheckOutReminderHours={setCheckOutReminderHours}
              checkInMessage={checkInMessage}
              setCheckInMessage={setCheckInMessage}
              checkOutMessage={checkOutMessage}
              setCheckOutMessage={setCheckOutMessage}
            />
          )}

          {activeTab === "knowledge" && (
            <KnowledgeTab
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

          {activeTab === "exact-answers" && (
            <ExactAnswersTab
              exactAnswers={exactAnswers}
              newQuestion={newQuestion}
              setNewQuestion={setNewQuestion}
              newAnswer={newAnswer}
              setNewAnswer={setNewAnswer}
              addExactAnswer={addExactAnswer}
              removeExactAnswer={removeExactAnswer}
            />
          )}

          {activeTab === "guests" && (
            <GuestsTab guests={guests} setGuests={setGuests} toggleGuestActive={toggleGuestActive} maxGuests={property.maxGuests} />
          )}
        </div>
      </div>

      {/* Subscription Dialog */}
      <SubscriptionDialog
        open={subscriptionDialogOpen}
        onOpenChange={setSubscriptionDialogOpen}
        propertyName={property.name}
        currentExpiry={subscriptionExpiry}
        isActive={subscriptionActive}
        onActivate={handleSubscriptionActivate}
        onDeactivate={handleSubscriptionDeactivate}
      />
    </DashboardLayout>
  );
};

// Overview Tab Component
interface OverviewTabProps {
  property: Property;
  checkInTime: string;
  setCheckInTime: (v: string) => void;
  checkOutTime: string;
  setCheckOutTime: (v: string) => void;
  checkInReminderHours: number;
  setCheckInReminderHours: (v: number) => void;
  checkOutReminderHours: number;
  setCheckOutReminderHours: (v: number) => void;
  checkInMessage: string;
  setCheckInMessage: (v: string) => void;
  checkOutMessage: string;
  setCheckOutMessage: (v: string) => void;
}

const OverviewTab = ({
  property,
  checkInTime,
  setCheckInTime,
  checkOutTime,
  setCheckOutTime,
  checkInReminderHours,
  setCheckInReminderHours,
  checkOutReminderHours,
  setCheckOutReminderHours,
  checkInMessage,
  setCheckInMessage,
  checkOutMessage,
  setCheckOutMessage,
}: OverviewTabProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Property Details */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-soft">
        <h3 className="text-lg font-semibold mb-4">Property Details</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-sm">
            <span className="text-muted-foreground">{property.ownershipLevel} {property.propertyType}</span>
            <span className="text-muted-foreground">·</span>
            <span>{property.bedrooms} bedrooms</span>
            <span className="text-muted-foreground">·</span>
            <span>{property.bathrooms} bathrooms</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {property.amenities.map((amenity) => {
              const Icon = amenityIcons[amenity];
              return (
                <div
                  key={amenity}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary rounded-full text-sm"
                >
                  {Icon && <Icon className="w-3.5 h-3.5 text-muted-foreground" />}
                  {amenity}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Check-in/out Times */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-soft">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Check-in & Check-out
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Check-in Time</Label>
            <Input
              type="time"
              value={checkInTime}
              onChange={(e) => setCheckInTime(e.target.value)}
              className="bg-secondary border-0"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Check-out Time</Label>
            <Input
              type="time"
              value={checkOutTime}
              onChange={(e) => setCheckOutTime(e.target.value)}
              className="bg-secondary border-0"
            />
          </div>
        </div>
      </div>

      {/* Check-in Message */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-soft">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-status-online" />
          Check-in Message
        </h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Send reminder before check-in</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={checkInReminderHours}
                onChange={(e) => setCheckInReminderHours(parseInt(e.target.value))}
                className="w-20 bg-secondary border-0"
                min={1}
                max={24}
              />
              <span className="text-sm text-muted-foreground">hours before</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Message</Label>
            <Textarea
              value={checkInMessage}
              onChange={(e) => setCheckInMessage(e.target.value)}
              placeholder="Write your check-in message..."
              className="min-h-[100px] bg-secondary border-0 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Check-out Message */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-soft">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          Check-out Message
        </h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Send reminder before check-out</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={checkOutReminderHours}
                onChange={(e) => setCheckOutReminderHours(parseInt(e.target.value))}
                className="w-20 bg-secondary border-0"
                min={1}
                max={24}
              />
              <span className="text-sm text-muted-foreground">hours before</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Message</Label>
            <Textarea
              value={checkOutMessage}
              onChange={(e) => setCheckOutMessage(e.target.value)}
              placeholder="Write your check-out message..."
              className="min-h-[100px] bg-secondary border-0 resize-none"
            />
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 flex justify-end">
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
};

// Knowledge Tab Component
interface KnowledgeTabProps {
  amenities: AmenityItem[];
  setAmenities: (a: AmenityItem[]) => void;
  otherAmenities: string;
  setOtherAmenities: (s: string) => void;
  whereIsItems: WhereIsItem[];
  setWhereIsItems: (items: WhereIsItem[]) => void;
  otherWhereIs: string;
  setOtherWhereIs: (s: string) => void;
  recommendations: RecommendationItem[];
  setRecommendations: (r: RecommendationItem[]) => void;
  otherRecommendations: string;
  setOtherRecommendations: (s: string) => void;
  rules: RuleItem[];
  setRules: (r: RuleItem[]) => void;
  otherRules: string;
  setOtherRules: (s: string) => void;
}

const KnowledgeTab = ({
  amenities,
  setAmenities,
  otherAmenities,
  setOtherAmenities,
  whereIsItems,
  setWhereIsItems,
  otherWhereIs,
  setOtherWhereIs,
  recommendations,
  setRecommendations,
  otherRecommendations,
  setOtherRecommendations,
  rules,
  setRules,
  otherRules,
  setOtherRules,
}: KnowledgeTabProps) => {
  const [activeSection, setActiveSection] = useState<string>("amenities");

  const sections = [
    { id: "amenities", label: "Amenities" },
    { id: "whereis", label: "Where is?" },
    { id: "recommendations", label: "Local Recs" },
    { id: "rules", label: "Rules" },
  ];

  return (
    <div className="space-y-6">
      {/* Section tabs */}
      <div className="flex gap-2 flex-wrap">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all",
              activeSection === section.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:bg-secondary/80"
            )}
          >
            {section.label}
          </button>
        ))}
      </div>

      <div className="bg-card rounded-2xl border border-border p-6 shadow-soft">
        {activeSection === "amenities" && (
          <div>
            <h3 className="text-lg font-semibold mb-1">Amenities</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Select the amenities available at your property and add details.
            </p>
            <AmenitiesSection
              amenities={amenities}
              setAmenities={setAmenities}
              otherAmenities={otherAmenities}
              setOtherAmenities={setOtherAmenities}
            />
          </div>
        )}

        {activeSection === "whereis" && (
          <div>
            <h3 className="text-lg font-semibold mb-1">Where is?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Help guests find common items around your property.
            </p>
            <WhereIsSection
              items={whereIsItems}
              setItems={setWhereIsItems}
              otherItems={otherWhereIs}
              setOtherItems={setOtherWhereIs}
            />
          </div>
        )}

        {activeSection === "recommendations" && (
          <div>
            <h3 className="text-lg font-semibold mb-1">Local Recommendations</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Share your favorite local spots with guests.
            </p>
            <LocalRecommendationsSection
              recommendations={recommendations}
              setRecommendations={setRecommendations}
              otherRecommendations={otherRecommendations}
              setOtherRecommendations={setOtherRecommendations}
            />
          </div>
        )}

        {activeSection === "rules" && (
          <div>
            <h3 className="text-lg font-semibold mb-1">Rules & Policies</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Set clear expectations for your guests.
            </p>
            <RulesSection
              rules={rules}
              setRules={setRules}
              otherRules={otherRules}
              setOtherRules={setOtherRules}
            />
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
          <Save className="w-4 h-4" />
          Save Knowledge
        </Button>
      </div>
    </div>
  );
};

// Exact Answers Tab Component
interface ExactAnswersTabProps {
  exactAnswers: Array<{ id: string; question: string; answer: string }>;
  newQuestion: string;
  setNewQuestion: (v: string) => void;
  newAnswer: string;
  setNewAnswer: (v: string) => void;
  addExactAnswer: () => void;
  removeExactAnswer: (id: string) => void;
}

const ExactAnswersTab = ({
  exactAnswers,
  newQuestion,
  setNewQuestion,
  newAnswer,
  setNewAnswer,
  addExactAnswer,
  removeExactAnswer,
}: ExactAnswersTabProps) => {
  return (
    <div className="space-y-6">
      {/* Add New */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-soft">
        <h3 className="text-lg font-semibold mb-4">Add Exact Answer</h3>
        <p className="text-sm text-muted-foreground mb-4">
          When guests ask questions matching the ones below, the AI will respond with the exact answer you provide.
        </p>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Question</Label>
            <Input
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="e.g., What's the Wi-Fi password?"
              className="bg-secondary border-0"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Answer</Label>
            <Textarea
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              placeholder="The exact response the AI will give..."
              className="min-h-[80px] bg-secondary border-0 resize-none"
            />
          </div>
          <Button
            onClick={addExactAnswer}
            disabled={!newQuestion || !newAnswer}
            className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Answer
          </Button>
        </div>
      </div>

      {/* Existing Answers */}
      {exactAnswers.length > 0 && (
        <div className="bg-card rounded-2xl border border-border p-6 shadow-soft">
          <h3 className="text-lg font-semibold mb-4">Saved Answers ({exactAnswers.length})</h3>
          <div className="space-y-4">
            {exactAnswers.map((ea) => (
              <div
                key={ea.id}
                className="p-4 bg-secondary rounded-xl flex items-start justify-between gap-4"
              >
                <div className="flex-1">
                  <p className="font-medium text-foreground mb-1">Q: {ea.question}</p>
                  <p className="text-sm text-muted-foreground">A: {ea.answer}</p>
                </div>
                <button
                  onClick={() => removeExactAnswer(ea.id)}
                  className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {exactAnswers.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No exact answers configured yet.</p>
          <p className="text-sm mt-1">Add your first Q&A pair above.</p>
        </div>
      )}
    </div>
  );
};

// Guests Tab Component
interface GuestsTabProps {
  guests: Guest[];
  setGuests: (guests: Guest[]) => void;
  toggleGuestActive: (id: string) => void;
  maxGuests: number;
}

interface NewGuestForm {
  firstName: string;
  lastName: string;
  phone: string;
  startDate: string;
  endDate: string;
}

const GuestsTab = ({ guests, setGuests, toggleGuestActive, maxGuests }: GuestsTabProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGuest, setNewGuest] = useState<NewGuestForm>({
    firstName: "",
    lastName: "",
    phone: "",
    startDate: "",
    endDate: "",
  });

  const activeCount = guests.filter((g) => g.isActive).length;

  const handleAddGuest = () => {
    if (newGuest.firstName && newGuest.phone) {
      const guest: Guest = {
        id: Date.now().toString(),
        firstName: newGuest.firstName,
        lastName: newGuest.lastName,
        phone: newGuest.phone,
        startDate: newGuest.startDate,
        endDate: newGuest.endDate,
        isActive: true,
      };
      setGuests([...guests, guest]);
      setNewGuest({ firstName: "", lastName: "", phone: "", startDate: "", endDate: "" });
      setShowAddForm(false);
    }
  };

  const handleRemoveGuest = (id: string) => {
    setGuests(guests.filter((g) => g.id !== id));
  };

  const isFormValid = newGuest.firstName && newGuest.phone;

  return (
    <div className="space-y-6">
      {/* Add Guest Button / Form */}
      {!showAddForm ? (
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Guest
        </Button>
      ) : (
        <div className="bg-card rounded-2xl border border-border p-6 shadow-soft animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Add New Guest</h3>
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewGuest({ firstName: "", lastName: "", phone: "", startDate: "", endDate: "" });
              }}
              className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="guestName">First Name *</Label>
              <Input
                id="guestFirstName"
                placeholder="e.g., John"
                value={newGuest.firstName}
                onChange={(e) => setNewGuest({ ...newGuest, firstName: e.target.value })}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="guestName">Last Name</Label>
              <Input
                id="guestLastName"
                placeholder="e.g., Smith"
                value={newGuest.lastName}
                onChange={(e) => setNewGuest({ ...newGuest, lastName: e.target.value })}
                className="mt-1.5"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="guestPhone">Phone Number *</Label>
              <Input
                id="guestPhone"
                type="tel"
                placeholder="e.g., +1 234 567 8900"
                value={newGuest.phone}
                onChange={(e) => setNewGuest({ ...newGuest, phone: e.target.value })}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="startDate">Check-in Date</Label>
              <Input
                id="startDate"
                type="date"
                value={newGuest.startDate}
                onChange={(e) => setNewGuest({ ...newGuest, startDate: e.target.value })}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="endDate">Check-out Date</Label>
              <Input
                id="endDate"
                type="date"
                value={newGuest.endDate}
                onChange={(e) => setNewGuest({ ...newGuest, endDate: e.target.value })}
                className="mt-1.5"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowAddForm(false);
                setNewGuest({ firstName: "", lastName: "", phone: "", startDate: "", endDate: "" });
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddGuest}
              disabled={!isFormValid}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Guest
            </Button>
          </div>
        </div>
      )}

      {/* Guests Table */}
      <div className="bg-card rounded-2xl border border-border shadow-soft overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold">Enrolled Guests</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {activeCount} of {maxGuests} guest slots active
          </p>
        </div>

        {guests.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-semibold">Full Name</TableHead>
                <TableHead className="font-semibold">Phone</TableHead>
                <TableHead className="font-semibold">Check-in</TableHead>
                <TableHead className="font-semibold">Check-out</TableHead>
                <TableHead className="font-semibold text-right">AI Access</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {guests.map((guest) => (
                <TableRow key={guest.id}>
                  <TableCell className="font-medium">{`${guest.firstName} ${guest.lastName}`}</TableCell>
                  <TableCell className="text-muted-foreground">{guest.phone}</TableCell>
                  <TableCell>{guest.startDate}</TableCell>
                  <TableCell>{guest.endDate}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-sm text-muted-foreground">
                        {guest.isActive ? "On" : "Off"}
                      </span>
                      <Switch
                        checked={guest.isActive}
                        onCheckedChange={() => toggleGuestActive(guest.id)}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleRemoveGuest(guest.id)}
                      className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>No guests enrolled for this property.</p>
            <p className="text-sm mt-1">Click "Add Guest" above to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyDetail;
