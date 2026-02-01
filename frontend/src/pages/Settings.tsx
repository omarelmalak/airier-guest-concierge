import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Save, User, Bell, Shield, CreditCard, Home, Calendar, Users, Zap, RotateCcw } from "lucide-react";
import { useState } from "react";
import { mockProperties, Property } from "@/data/mockData";
import SubscriptionDialog from "@/components/SubscriptionDialog";
import { cn } from "@/lib/utils";

const Settings = () => {
  const [name, setName] = useState("Omar El Malak");
  const [email, setEmail] = useState("omar@example.com");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  // Subscription management
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const handleManageSubscription = (property: Property) => {
    setSelectedProperty(property);
    setSubscriptionDialogOpen(true);
  };

  const handleSubscriptionActivate = (months: number) => {
    if (!selectedProperty) return;
    
    const baseDate = selectedProperty.subscriptionExpiry 
      ? new Date(selectedProperty.subscriptionExpiry) 
      : new Date();
    const newDate = new Date(baseDate);
    newDate.setMonth(newDate.getMonth() + months);
    const newExpiry = newDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    setProperties(prev => prev.map(p => 
      p.id === selectedProperty.id 
        ? { ...p, subscriptionActive: true, subscriptionExpiry: newExpiry }
        : p
    ));
  };

  const handleSubscriptionDeactivate = () => {
    if (!selectedProperty) return;
    setProperties(prev => prev.map(p => 
      p.id === selectedProperty.id 
        ? { ...p, subscriptionActive: false }
        : p
    ));
  };

  const activeSubscriptions = properties.filter(p => p.subscriptionActive).length;
  const totalMonthly = activeSubscriptions * 29;

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
        </div>

        {/* Profile Section */}
        <section className="bg-card rounded-2xl border border-border p-6 shadow-soft mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Profile</h2>
              <p className="text-sm text-muted-foreground">Your personal information</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Full Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-secondary border-0"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-secondary border-0"
              />
            </div>
          </div>
        </section>

        {/* Notifications Section */}
        <section className="bg-card rounded-2xl border border-border p-6 shadow-soft mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-status-warning/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-status-warning" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Notifications</h2>
              <p className="text-sm text-muted-foreground">How you receive updates</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-secondary rounded-xl">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive updates via email</p>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-secondary rounded-xl">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-muted-foreground">Browser push notifications</p>
              </div>
              <Switch
                checked={pushNotifications}
                onCheckedChange={setPushNotifications}
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-secondary rounded-xl">
              <div>
                <p className="font-medium">Weekly Digest</p>
                <p className="text-sm text-muted-foreground">Summary of AI interactions</p>
              </div>
              <Switch
                checked={weeklyDigest}
                onCheckedChange={setWeeklyDigest}
              />
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="bg-card rounded-2xl border border-border p-6 shadow-soft mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-status-online/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-status-online" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Security</h2>
              <p className="text-sm text-muted-foreground">Protect your account</p>
            </div>
          </div>

          <div className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              Change Password
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Enable Two-Factor Authentication
            </Button>
          </div>
        </section>

        {/* Billing Section */}
        <section className="bg-card rounded-2xl border border-border p-6 shadow-soft mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Billing</h2>
              <p className="text-sm text-muted-foreground">Manage your property subscriptions</p>
            </div>
          </div>

          {/* Summary Card */}
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Active Subscriptions</p>
                <p className="text-2xl font-bold">{activeSubscriptions} of {properties.length} properties</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Monthly Total</p>
                <p className="text-2xl font-bold text-primary">${totalMonthly}/mo</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                <span>3 guests per property</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4" />
                <span>$29/property/month</span>
              </div>
            </div>
          </div>

          {/* Properties List */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Your Properties</h3>
            {properties.map((property) => (
              <div
                key={property.id}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl border transition-all",
                  property.subscriptionActive
                    ? "bg-secondary/50 border-border"
                    : "bg-muted/30 border-border/50"
                )}
              >
                {/* Property Image */}
                <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={property.image}
                    alt={property.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Property Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium truncate">{property.name}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-sm">
                    {property.subscriptionActive ? (
                      <>
                        <span className="flex items-center gap-1 text-status-online">
                          <span className="w-1.5 h-1.5 rounded-full bg-status-online" />
                          Active
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5" />
                          Expires {property.subscriptionExpiry}
                        </span>
                      </>
                    ) : (
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                        Inactive
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  variant={property.subscriptionActive ? "outline" : "default"}
                  size="sm"
                  onClick={() => handleManageSubscription(property)}
                  className="flex-shrink-0"
                >
                  {property.subscriptionActive ? (
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
            ))}
          </div>
        </section>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
            <Save className="w-4 h-4" />
            Save Settings
          </Button>
        </div>
      </div>

      {/* Subscription Dialog */}
      {selectedProperty && (
        <SubscriptionDialog
          open={subscriptionDialogOpen}
          onOpenChange={setSubscriptionDialogOpen}
          propertyName={selectedProperty.name}
          currentExpiry={selectedProperty.subscriptionExpiry}
          isActive={selectedProperty.subscriptionActive}
          onActivate={handleSubscriptionActivate}
          onDeactivate={handleSubscriptionDeactivate}
        />
      )}
    </DashboardLayout>
  );
};

export default Settings;
