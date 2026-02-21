// Overview Tab Component
import { GetPropertyDetailsResponse } from "@/lib/static-data/response-types";
import { Home, BedDouble, Bath, Clock, Save, Bell } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface OverviewTabProps {
    property: GetPropertyDetailsResponse;
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
            <div className="bg-card rounded-2xl border border-border p-6 shadow-soft">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Home className="w-5 h-5 text-primary" />
                    Property Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Type</span>
                        <p className="text-sm font-medium text-foreground">Cabin</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Access</span>
                        <p className="text-sm font-medium text-foreground">Entire place</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Bedrooms</span>
                        <div className="flex items-center gap-1.5">
                            <BedDouble className="w-4 h-4 text-muted-foreground" />
                            <p className="text-sm font-medium text-foreground">2</p>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Bathrooms</span>
                        <div className="flex items-center gap-1.5">
                            <Bath className="w-4 h-4 text-muted-foreground" />
                            <p className="text-sm font-medium text-foreground">2</p>
                        </div>
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
        </div >
    );
};

export default OverviewTab;