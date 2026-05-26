import StatusBadge from "./StatusBadge";
import { Calendar, Check, X } from "lucide-react";
import { Link } from "react-router-dom";
import { GetPropertiesResponse } from "@/lib/static-data/response-types";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { deleteProperty } from "@/lib/services/properties";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils/common";

interface PropertyListCardProps {
    property: GetPropertiesResponse;
}

const confirmButtonClass =
    "flex h-11 min-w-[3.5rem] items-center justify-center rounded-xl border border-border transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

const PropertyListCard = ({ property }: PropertyListCardProps) => {
    const queryClient = useQueryClient();
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await deleteProperty(property.id);
            await queryClient.invalidateQueries({ queryKey: ["properties"] });
            toast.success("Property deleted.");
            setDeleteOpen(false);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to delete property.");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <>
            <div className="relative bg-card rounded-2xl border border-border overflow-hidden card-hover shadow-card group">
                <Link to={`/properties/${property.id}`} className="block">
                    {/* Header */}
                    <div className="p-4 pb-3 flex items-start justify-between">
                        <h3 className="text-lg font-semibold text-foreground pr-8">{property.name}</h3>
                        <StatusBadge status={property.ai_status} />
                    </div>

                    {/* Image */}
                    <div className="px-4 relative">
                        <div className="relative rounded-xl overflow-hidden aspect-[16/10]">
                            <img
                                src={property.photo}
                                alt={property.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            {property.active_guests_count > 0 && (
                                <div className="absolute bottom-3 right-3 w-7 h-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold shadow-lg">
                                    {property.active_guests_count}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-4 pt-3 pb-12">
                        <h4 className="font-semibold text-foreground mb-2">{property.address}</h4>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                                <span
                                    className={`w-2 h-2 rounded-full ${property.ai_status === "online" ? "bg-status-online" : property.ai_status === "warning" ? "bg-status-warning" : "bg-status-offline"}`}
                                />
                                <span>{property.active_guests_count}/3 active guests</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Subscription until {property.subscription_expires_at}</span>
                        </div>
                    </div>
                </Link>

                <button
                    type="button"
                    onClick={() => setDeleteOpen(true)}
                    className="absolute bottom-4 right-4 z-10 p-2 rounded-xl border border-border bg-card text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors duration-200 shadow-soft"
                    title="Delete property"
                    aria-label="Delete property"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent className="rounded-2xl max-w-md">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to delete this property?</AlertDialogTitle>
                        <AlertDialogDescription>This action is irreversible.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-row justify-center gap-4 sm:justify-center pt-2">
                        <button
                            type="button"
                            onClick={() => setDeleteOpen(false)}
                            disabled={deleting}
                            className={cn(
                                confirmButtonClass,
                                "bg-secondary text-foreground border-border hover:bg-muted hover:text-foreground disabled:opacity-50"
                            )}
                            aria-label="No, keep property"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={deleting}
                            className={cn(
                                confirmButtonClass,
                                "border-destructive/30 bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
                            )}
                            aria-label="Yes, delete property"
                        >
                            <Check className="w-5 h-5" />
                        </button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default PropertyListCard;
