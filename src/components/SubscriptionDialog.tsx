import { useState } from "react";
import { CreditCard, Check, Calendar, Users, Zap, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface SubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyName: string;
  currentExpiry?: string;
  isActive?: boolean;
  onActivate?: (months: number) => void;
  onDeactivate?: () => void;
}

const PLAN_PRICE = 29; // $29 per property per month

const SubscriptionDialog = ({
  open,
  onOpenChange,
  propertyName,
  currentExpiry,
  isActive = false,
  onActivate,
  onDeactivate,
}: SubscriptionDialogProps) => {
  const [step, setStep] = useState<"plan" | "payment" | "success" | "cancel-confirm">("plan");
  const [selectedMonths, setSelectedMonths] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock card data
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  const handleActivate = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setStep("success");
      onActivate?.(selectedMonths);
    }, 1500);
  };

  const handleDeactivate = () => {
    onDeactivate?.();
    onOpenChange(false);
    resetDialog();
  };

  const resetDialog = () => {
    setStep("plan");
    setSelectedMonths(1);
    setCardNumber("");
    setCardExpiry("");
    setCardCvc("");
    setIsProcessing(false);
  };

  const handleClose = () => {
    onOpenChange(false);
    resetDialog();
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : value;
  };

  const calculateNewExpiry = () => {
    const baseDate = currentExpiry ? new Date(currentExpiry) : new Date();
    const newDate = new Date(baseDate);
    newDate.setMonth(newDate.getMonth() + selectedMonths);
    return newDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {step === "success" ? (
              <>
                <div className="w-8 h-8 rounded-full bg-status-online/20 flex items-center justify-center">
                  <Check className="w-4 h-4 text-status-online" />
                </div>
                Subscription Activated!
              </>
            ) : step === "cancel-confirm" ? (
              <>
                <div className="w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center">
                  <X className="w-4 h-4 text-destructive" />
                </div>
                Cancel Subscription
              </>
            ) : (
              <>
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-primary" />
                </div>
                {isActive ? "Renew Subscription" : "Activate Subscription"}
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {step === "success"
              ? `Your subscription for ${propertyName} is now active.`
              : step === "cancel-confirm"
              ? `Are you sure you want to cancel the subscription for ${propertyName}?`
              : `Manage AI assistant subscription for ${propertyName}`}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {step === "plan" && (
            <div className="space-y-6">
              {/* Features */}
              <div className="bg-secondary/50 rounded-xl p-4 space-y-3">
                <h4 className="font-medium text-sm">What's included:</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-primary" />
                    <span>Up to 3 simultaneous guests</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Zap className="w-4 h-4 text-primary" />
                    <span>24/7 AI-powered guest support</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>Automated check-in/out reminders</span>
                  </div>
                </div>
              </div>

              {/* Duration selector */}
              <div>
                <Label className="text-sm text-muted-foreground mb-3 block">
                  Subscription duration
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
                      <div className="text-sm text-muted-foreground">
                        ${PLAN_PRICE * months}
                      </div>
                      {months === 6 && (
                        <div className="text-xs text-status-online mt-1">Best value</div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-card border border-border rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted-foreground">Property</span>
                  <span className="font-medium">{propertyName}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">{selectedMonths} month{selectedMonths > 1 ? "s" : ""}</span>
                </div>
                {isActive && currentExpiry && (
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-muted-foreground">Current expiry</span>
                    <span className="font-medium">{currentExpiry}</span>
                  </div>
                )}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted-foreground">New expiry</span>
                  <span className="font-medium text-primary">{calculateNewExpiry()}</span>
                </div>
                <div className="border-t border-border pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total</span>
                    <span className="text-xl font-bold">${PLAN_PRICE * selectedMonths}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                {isActive && (
                  <Button
                    variant="outline"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => setStep("cancel-confirm")}
                  >
                    Cancel Subscription
                  </Button>
                )}
                <Button className="flex-1" onClick={() => setStep("payment")}>
                  Continue to Payment
                </Button>
              </div>
            </div>
          )}

          {step === "payment" && (
            <div className="space-y-6">
              {/* Card form */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Card number</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      maxLength={19}
                      className="pl-10 bg-secondary border-0"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Expiry date</Label>
                    <Input
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      maxLength={5}
                      className="bg-secondary border-0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">CVC</Label>
                    <Input
                      placeholder="123"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      maxLength={4}
                      className="bg-secondary border-0"
                    />
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-secondary/50 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{propertyName}</div>
                    <div className="text-sm text-muted-foreground">
                      {selectedMonths} month{selectedMonths > 1 ? "s" : ""} subscription
                    </div>
                  </div>
                  <div className="text-xl font-bold">${PLAN_PRICE * selectedMonths}</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep("plan")}>
                  Back
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleActivate}
                  disabled={isProcessing || !cardNumber || !cardExpiry || !cardCvc}
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    `Pay $${PLAN_PRICE * selectedMonths}`
                  )}
                </Button>
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="space-y-6">
              <div className="bg-status-online/10 rounded-xl p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-status-online/20 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-status-online" />
                </div>
                <h3 className="text-lg font-semibold mb-2">You're all set!</h3>
                <p className="text-muted-foreground text-sm">
                  Your AI assistant for {propertyName} is now active until{" "}
                  <span className="font-medium text-foreground">{calculateNewExpiry()}</span>
                </p>
              </div>

              <Button className="w-full" onClick={handleClose}>
                Done
              </Button>
            </div>
          )}

          {step === "cancel-confirm" && (
            <div className="space-y-6">
              <div className="bg-destructive/10 rounded-xl p-4">
                <p className="text-sm text-muted-foreground">
                  If you cancel, your AI assistant will stop responding to guests after your current subscription ends on{" "}
                  <span className="font-medium text-foreground">{currentExpiry}</span>.
                </p>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep("plan")} className="flex-1">
                  Keep Subscription
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeactivate}
                  className="flex-1"
                >
                  Cancel Subscription
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionDialog;
