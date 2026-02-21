import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { cn } from "@/lib/utils/common";
import SubscriptionDialog from "@/components/SubscriptionDialog";
import { TabType } from "@/lib/static-data/client-types";
import { useQuery } from "@tanstack/react-query";
import { getPropertyDetails } from "@/lib/services/properties";
import LoadingSpinner from "@/components/LoadingSpinner";
import PropertyDetailsHeader from "@/components/property-details/PropertyDetailsHeader";
import OverviewTab from "@/components/property-details/tabs/OverviewTab";
import KnowledgeTab from "@/components/property-details/tabs/KnowledgeTab";
import ExactAnswersTab from "@/components/property-details/tabs/ExactAnswersTab";
import GuestsTab from "@/components/property-details/tabs/GuestsTab";

const tabs: { id: TabType; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "knowledge", label: "Knowledge" },
  { id: "exact-answers", label: "Exact Answers" },
  { id: "guests", label: "Guests" },
];

const PropertyDetails = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  const { data: propertyDetails, isLoading, error } = useQuery({
    queryKey: ['property', id],
    queryFn: () => getPropertyDetails(id!),
  });

  // Subscription state
  const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState(false);
  const [subscriptionActive, setSubscriptionActive] = useState(false);
  const [subscriptionExpiry, setSubscriptionExpiry] = useState("");

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
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (!propertyDetails) {
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

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Error loading property details</p>
          <Link to="/properties" className="text-primary hover:underline mt-2 inline-block">
            Back to Properties
          </Link>
        </div>
      </DashboardLayout>
    );
  }

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

        <PropertyDetailsHeader property={propertyDetails} setSubscriptionDialogOpen={setSubscriptionDialogOpen} />

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
            <OverviewTab propertyId={id!} />
          )}

          {activeTab === "knowledge" && (
            <KnowledgeTab propertyId={id!} />
          )}

          {activeTab === "exact-answers" && (
            <ExactAnswersTab propertyId={id!} />
          )}

          {activeTab === "guests" && id && (
            <GuestsTab propertyId={id} maxGuests={3} />
          )}
        </div>
        <SubscriptionDialog
          open={subscriptionDialogOpen}
          onOpenChange={setSubscriptionDialogOpen}
          propertyName={propertyDetails.name}
          currentExpiry={subscriptionExpiry}
          isActive={subscriptionActive}
          onActivate={handleSubscriptionActivate}
          onDeactivate={handleSubscriptionDeactivate}
        />
      </div>
    </DashboardLayout>
  );
};

export default PropertyDetails;
