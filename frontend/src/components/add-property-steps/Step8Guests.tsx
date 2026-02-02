import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { GuestInfo } from "@/lib/static-data/client-types";

interface Step8GuestsProps {
  guests: GuestInfo[];
  addGuest: () => void;
  removeGuest: (id: string) => void;
  updateGuest: (id: string, field: keyof GuestInfo, value: string) => void;
}

export const Step8Guests = ({
  guests,
  addGuest,
  removeGuest,
  updateGuest,
}: Step8GuestsProps) => {
  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">
        Add up to 3 guests who will have access to your AI assistant (you can toggle their access later).
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
              <Label>First Name *</Label>
              <Input
                placeholder="John"
                value={guest.firstName}
                onChange={(e) => updateGuest(guest.id, "firstName", e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input
                placeholder="Doe"
                value={guest.lastName}
                onChange={(e) => updateGuest(guest.id, "lastName", e.target.value)}
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
  );
};
