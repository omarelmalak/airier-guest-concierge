// Overview Tab Component
import { GetPropertyDetailsResponse } from "@/lib/static-data/response-types";
import { Home, BedDouble, Bath, Clock, Save, Bell } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { getPropertyDetails, updateProperty } from "@/lib/services/properties";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { PropertyInfo, UpdatePropertyInfo } from "@/lib/static-data/request-types";
import { toast } from "sonner";

const OverviewTab = ({ propertyId }: { propertyId: string }) => {
    const queryClient = useQueryClient();
    const { data: propertyDetails, isLoading, error } = useQuery({
        queryKey: ['property', propertyId],
        queryFn: () => getPropertyDetails(propertyId),
    });

    const [checkInTime, setCheckInTime] = useState("");
    const [checkOutTime, setCheckOutTime] = useState("");
    const [checkInReminderHours, setCheckInReminderHours] = useState<number | string>("");
    const [checkOutReminderHours, setCheckOutReminderHours] = useState<number | string>("");
    const [checkInMessage, setCheckInMessage] = useState("");
    const [checkOutMessage, setCheckOutMessage] = useState("");

    useEffect(() => {
        if (!propertyDetails) return;
        setCheckInTime(propertyDetails.checkin_time ?? "");
        setCheckOutTime(propertyDetails.checkout_time ?? "");
        setCheckInReminderHours(propertyDetails.checkin_reminder_hours ?? "");
        setCheckOutReminderHours(propertyDetails.checkout_reminder_hours ?? "");
        setCheckInMessage(propertyDetails.checkin_msg ?? "");
        setCheckOutMessage(propertyDetails.checkout_msg ?? "");
    }, [propertyDetails]);

    const handleSaveChanges = async () => {
        const payload: UpdatePropertyInfo = {
            checkinMessage: checkInMessage,
            checkoutMessage: checkOutMessage,
            checkinTime: checkInTime,
            checkoutTime: checkOutTime,
            checkinReminderHours: String(checkInReminderHours ?? ""),
            checkoutReminderHours: String(checkOutReminderHours ?? ""),
        };
        try {
            await updateProperty(propertyId, payload);
            toast.success('Changes saved successfully');
            await queryClient.invalidateQueries({ queryKey: ['property', propertyId] });
        } catch {
            toast.error('Failed to save changes');
        }
    }

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }
    if (error) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <p className="text-muted-foreground">Failed to load overview.</p>
            </div>
        );
    }

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
                        <p className="text-sm font-medium text-foreground">{propertyDetails?.property_type}</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Access</span>
                        <p className="text-sm font-medium text-foreground">{propertyDetails?.ownership_level}</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Bedrooms</span>
                        <div className="flex items-center gap-1.5">
                            <BedDouble className="w-4 h-4 text-muted-foreground" />
                            <p className="text-sm font-medium text-foreground">{propertyDetails?.bedrooms}</p>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Bathrooms</span>
                        <div className="flex items-center gap-1.5">
                            <Bath className="w-4 h-4 text-muted-foreground" />
                            <p className="text-sm font-medium text-foreground">{propertyDetails?.bathrooms}</p>
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
                <Button
                    className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                    onClick={handleSaveChanges}>
                    <Save className="w-4 h-4" />
                    Save Changes
                </Button>
            </div>
        </div >
    );
};

export default OverviewTab;