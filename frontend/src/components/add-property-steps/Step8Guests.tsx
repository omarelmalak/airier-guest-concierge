import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { Guest } from "@/lib/static-data/client-types";
import { cn } from "@/lib/utils/common";
import { isValidTwilioPhone } from "@/lib/utils/phone";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Step8GuestsProps {
  guests: Guest[];
  addGuest: () => void;
  removeGuest: (id: string) => void;
  updateGuest: (id: string, field: keyof Guest, value: string) => void;
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
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remove guest from this property?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will remove this guest from the initial setup. You can always add them again later.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        removeGuest(guest.id);
                      }}
                    >
                      Yes, remove
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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
              {/*
                We validate Twilio-compatible phone format (E.164) client-side.
                If invalid, show a red border and helper text.
              */}
              {(() => {
                const hasValue = guest.phone.trim().length > 0;
                const invalid = hasValue && !isValidTwilioPhone(guest.phone);
                return (
                  <>
                    <Input
                      placeholder="+15551234567"
                      value={guest.phone}
                      onChange={(e) => updateGuest(guest.id, "phone", e.target.value)}
                      className={cn(
                        "mt-1.5",
                        invalid && "border-destructive focus-visible:ring-destructive"
                      )}
                    />
                    {invalid && (
                      <div className="text-sm text-destructive bg-destructive/10 p-2 rounded-md mt-1">
                        Phone must be in international format, e.g. +15551234567.
                      </div>
                    )}
                  </>
                );
              })()}
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
