import { GetPropertiesResponse } from "@/lib/static-data/response-types";
import StatusBadge from "../StatusBadge";
import { Button } from "../ui/button";
import { Star, Calendar, RotateCcw, Zap, Users } from "lucide-react";
import { GetPropertyDetailsResponse } from "@/lib/static-data/response-types";

const PropertyDetailsHeader = ({ property, setSubscriptionDialogOpen }: { property: GetPropertyDetailsResponse, setSubscriptionDialogOpen: (open: boolean) => void }) => {
    const subscriptionActive = property.subscription_expires_at ? new Date(property.subscription_expires_at) > new Date() : false;

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

                <div className="absolute top-4 right-4">
                    <StatusBadge status={"online"} />
                </div>

                {/* Light scrim under text only – softens without heavy black */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/55 to-transparent pt-10 pb-5 md:pb-6 px-5 md:px-6">
                    <h1 className="text-2xl md:text-3xl font-semibold text-white mb-1 [text-shadow:0_1px_2px_rgba(0,0,0,0.6)]">
                        {property.name}
                    </h1>
                    <p className="text-white text-sm md:text-base [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">
                        {property.address}
                    </p>
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

                    {/* Subscription */}
                    <div className="flex items-center gap-1.5 text-sm">
                        {subscriptionActive ? (
                            <>
                                <span className="w-2 h-2 rounded-full bg-status-online" />
                                <span className="text-foreground font-medium">Active</span>
                                <span className="text-muted-foreground">until {property.subscription_expires_at}</span>
                            </>
                        ) : (
                            <>
                                <span className="w-2 h-2 rounded-full bg-muted-foreground" />
                                <span className="text-muted-foreground">Inactive</span>
                            </>
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
        </div>
    );
};

export default PropertyDetailsHeader;