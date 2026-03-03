import StatusBadge from "../StatusBadge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { RotateCcw, Zap, Users, Pencil, Check, X } from "lucide-react";
import { GetPropertyDetailsResponse } from "@/lib/static-data/response-types";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { updateProperty } from "@/lib/services/properties";
import { toast } from "sonner";

const PropertyDetailsHeader = ({ property, setSubscriptionDialogOpen }: { property: GetPropertyDetailsResponse, setSubscriptionDialogOpen: (open: boolean) => void }) => {
    const queryClient = useQueryClient();
    const subscriptionActive = property.subscription_expires_at ? new Date(property.subscription_expires_at) > new Date() : false;
    const hasActiveGuests = property.active_guests_count > 0;
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(property.name);
    const [editAddress, setEditAddress] = useState(property.address);
    const [saving, setSaving] = useState(false);

    const startEditing = () => {
        setEditName(property.name);
        setEditAddress(property.address);
        setIsEditing(true);
    };

    const cancelEditing = () => {
        setEditName(property.name);
        setEditAddress(property.address);
        setIsEditing(false);
    };

    const saveHeader = async () => {
        if (editName.trim() === "" || editAddress.trim() === "") {
            toast.error("Name and address are required");
            return;
        }
        setSaving(true);
        try {
            await updateProperty(String(property.id), { name: editName.trim(), address: editAddress.trim() });
            toast.success("Property updated");
            await queryClient.invalidateQueries({ queryKey: ["property", String(property.id)] });
            setIsEditing(false);
        } catch {
            toast.error("Failed to update property");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="rounded-2xl border border-border shadow-card overflow-hidden mb-6">
            {/* Banner: light blur softens low-res images but keeps the photo visible */}
            <div className="relative h-52 md:h-64 overflow-hidden bg-muted">
                <img
                    src={property.photo}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover blur-[3px] select-none"
                    aria-hidden
                />
                {/* Gradient overlay per design-rules: from-black/70 via-black/25 – keeps image visible, supports text */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />

                {/* <div className="absolute top-4 right-4">
                    <StatusBadge status={"online"} />
                </div> */}

                {/* Light scrim under text only – softens without heavy black */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/55 to-transparent pt-10 pb-5 md:pb-6 px-5 md:px-6">
                    {isEditing ? (
                        <div className="space-y-2">
                            <Input
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                placeholder="Property name"
                                className="text-lg md:text-xl font-semibold bg-white/95 text-foreground border-white [text-shadow:none] placeholder:text-muted-foreground"
                            />
                            <Input
                                value={editAddress}
                                onChange={(e) => setEditAddress(e.target.value)}
                                placeholder="Address"
                                className="text-sm md:text-base bg-white/95 text-foreground border-white [text-shadow:none] placeholder:text-muted-foreground"
                            />
                            <div className="flex gap-2 mt-2">
                                <Button size="sm" onClick={saveHeader} disabled={saving} className="gap-1.5">
                                    <Check className="w-4 h-4" /> Save
                                </Button>
                                <Button size="sm" variant="secondary" onClick={cancelEditing} disabled={saving} className="gap-1.5 bg-white/20 text-white border-white/40 hover:bg-white/30">
                                    <X className="w-4 h-4" /> Cancel
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="relative w-full text-left">
                            <h1 className="text-2xl md:text-3xl font-semibold text-white mb-1 [text-shadow:0_1px_2px_rgba(0,0,0,0.6)]">
                                {property.name}
                                <button
                                    type="button"
                                    onClick={startEditing}
                                    className="ml-3 p-1.5 rounded-md text-white/40 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 focus:text-white"
                                    title="Edit name & address"
                                >
                                    <Pencil className="w-4 h-4" />
                                </button>
                            </h1>
                            <p className="text-white text-sm md:text-base [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">
                                {property.address}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Info Bar – name, address, type, beds/baths in banner; guests + subscription here */}
            <div className="bg-card px-5 md:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-5">
                    {/* Guests */}
                    <div className="flex items-center gap-1.5 text-sm">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground font-medium">{property.active_guests_count}</span>
                        <span className="text-muted-foreground">/ 3 guests</span>
                    </div>

                    <span className="w-px h-5 bg-border" />

                    {/* Subscription / AI status */}
                    <div className="flex items-center gap-1.5 text-sm">
                        {hasActiveGuests ? (
                            <>
                                <span className="w-2 h-2 rounded-full bg-status-online" />
                                <span className="text-foreground font-medium">Active</span>
                                {property.subscription_expires_at && (
                                    <span className="text-muted-foreground">until {property.subscription_expires_at}</span>
                                )}
                            </>
                        ) : (
                            <>
                                <span className="w-2 h-2 rounded-full bg-muted-foreground" />
                                <span className="text-muted-foreground">Inactive</span>
                            </>
                        )}
                    </div>

                    <span className="w-px h-5 bg-border" />

                    {/* Guests currently staying */}
                    <div className="flex flex-wrap items-center gap-1.5 text-sm">
                        {property.current_guests && property.current_guests.length > 0 ? (
                            <>
                                <span className="text-foreground font-medium">
                                    {property.current_guests.length} staying
                                </span>
                                <span className="text-muted-foreground">
                                    (
                                    {property.current_guests
                                        .map((g) => `${g.first_name} ${g.last_name}`)
                                        .join(", ")}
                                    )
                                </span>
                            </>
                        ) : (
                            <span className="text-muted-foreground">No guests currently staying</span>
                        )}
                    </div>
                </div>

                <Button
                    variant={subscriptionActive ? "outline" : "default"}
                    size="sm"
                    onClick={() => setSubscriptionDialogOpen(true)}
                >
                    {subscriptionActive ? (
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
        </div >
    );
};

export default PropertyDetailsHeader;