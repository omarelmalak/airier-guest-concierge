import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PropertyInfo } from "@/lib/static-data/request-types";

interface Step1CheckinCheckoutProps {
  propertyInfo: PropertyInfo;
  setPropertyInfo: (info: PropertyInfo) => void;
}

export const Step1CheckinCheckout = ({ propertyInfo, setPropertyInfo }: Step1CheckinCheckoutProps) => {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold mb-1">Check-in & Check-out</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Set default times and when to send reminder messages to guests.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <Label htmlFor="checkinTime" className="text-sm text-muted-foreground">
            Check-in time
            {propertyInfo.timezone && (
              <span className="ml-1 text-xs text-muted-foreground">
                ({propertyInfo.timezone})
              </span>
            )}
          </Label>
          <Input
            id="checkinTime"
            type="time"
            value={propertyInfo.checkinTime}
            onChange={(e) =>
              setPropertyInfo({ ...propertyInfo, checkinTime: e.target.value })
            }
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="checkoutTime" className="text-sm text-muted-foreground">
            Check-out time
            {propertyInfo.timezone && (
              <span className="ml-1 text-xs text-muted-foreground">
                ({propertyInfo.timezone})
              </span>
            )}
          </Label>
          <Input
            id="checkoutTime"
            type="time"
            value={propertyInfo.checkoutTime}
            onChange={(e) =>
              setPropertyInfo({ ...propertyInfo, checkoutTime: e.target.value })
            }
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="checkinReminderHours" className="text-sm text-muted-foreground">Send check-in reminder (hours before)</Label>
          <Input
            id="checkinReminderHours"
            type="number"
            min={1}
            max={24}
            value={propertyInfo.checkinReminderHours}
            onChange={(e) =>
              setPropertyInfo({ ...propertyInfo, checkinReminderHours: e.target.value })
            }
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="checkoutReminderHours" className="text-sm text-muted-foreground">Send check-out reminder (hours before)</Label>
          <Input
            id="checkoutReminderHours"
            type="number"
            min={1}
            max={24}
            value={propertyInfo.checkoutReminderHours}
            onChange={(e) =>
              setPropertyInfo({ ...propertyInfo, checkoutReminderHours: e.target.value })
            }
            className="mt-1.5"
          />
        </div>
      </div>
    </div>
  );
};
