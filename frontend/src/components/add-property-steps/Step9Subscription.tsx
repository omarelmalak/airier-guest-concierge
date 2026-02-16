import { Label } from "@/components/ui/label";
import { Zap, Users, Calendar } from "lucide-react";
import { cn } from "@/lib/utils/common";

interface Step9SubscriptionProps {
  selectedMonths: number;
  setSelectedMonths: (months: number) => void;
  activateSubscription: boolean;
  setActivateSubscription: (activate: boolean) => void;
  planPrice: number;
}

export const Step9Subscription = ({
  selectedMonths,
  setSelectedMonths,
  activateSubscription,
  setActivateSubscription,
  planPrice,
}: Step9SubscriptionProps) => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">AI Assistant Subscription</h3>
            <p className="text-sm text-muted-foreground">${planPrice}/month per property</p>
          </div>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <span>Up to 3 simultaneous guests</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <span>24/7 AI-powered guest support</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <span>Automated check-in/out reminders</span>
          </div>
        </div>
      </div>

      <div>
        <Label className="text-sm text-muted-foreground mb-3 block">
          Choose subscription duration
        </Label>
        <div className="grid grid-cols-3 gap-2">
          {[1, 3, 6].map((months) => (
            <button
              key={months}
              onClick={() => setSelectedMonths(months)}
              className={cn(
                "p-3 rounded-xl border-2 transition-all text-center",
                selectedMonths === months
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              )}
            >
              <div className="font-semibold">{months} month{months > 1 ? "s" : ""}</div>
              <div className="text-sm text-muted-foreground">${planPrice * months}</div>
              {months === 6 && (
                <div className="text-xs text-status-online mt-1">Best value</div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-secondary rounded-xl">
        <div>
          <p className="font-medium">Activate subscription now</p>
          <p className="text-sm text-muted-foreground">You can also do this later</p>
        </div>
        <button
          onClick={() => setActivateSubscription(!activateSubscription)}
          className={cn(
            "w-12 h-7 rounded-full transition-colors relative",
            activateSubscription ? "bg-primary" : "bg-muted"
          )}
        >
          <div className={cn(
            "absolute top-1 w-5 h-5 rounded-full bg-white transition-transform",
            activateSubscription ? "translate-x-6" : "translate-x-1"
          )} />
        </button>
      </div>

      {activateSubscription && (
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Total due today</span>
            <span className="text-xl font-bold">${planPrice * selectedMonths}</span>
          </div>
        </div>
      )}
    </div>
  );
};
