import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Save, User, Bell, Shield, CreditCard } from "lucide-react";
import { useState } from "react";

const Settings = () => {
  const [name, setName] = useState("Omar El Malak");
  const [email, setEmail] = useState("omar@example.com");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

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
              <p className="text-sm text-muted-foreground">Manage your subscription</p>
            </div>
          </div>

          <div className="p-4 bg-secondary rounded-xl mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Pro Plan</p>
                <p className="text-sm text-muted-foreground">4 properties included</p>
              </div>
              <p className="text-lg font-semibold">$49/mo</p>
            </div>
          </div>

          <Button variant="outline" className="w-full">
            Manage Subscription
          </Button>
        </section>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
            <Save className="w-4 h-4" />
            Save Settings
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
