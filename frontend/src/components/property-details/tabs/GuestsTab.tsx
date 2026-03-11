import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Trash2, Circle, CheckCircle, ArrowUp, ArrowDown } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { createGuest, createReservation, getReservationsForProperty, deleteReservation, updateReservation } from "@/lib/services/guests";
import { PropertyReservation } from "@/lib/static-data/client-types";
import { toast } from "sonner";
import { cn } from "@/lib/utils/common";

type SortColumn = "createdAt" | "checkIn" | "checkOut";
type SortDirection = "asc" | "desc";

function SortableHead({
    label,
    active,
    direction,
    onClick,
}: {
    label: string;
    active: boolean;
    direction: SortDirection;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "inline-flex items-center gap-1.5 hover:text-foreground transition-colors",
                active ? "text-foreground" : "text-muted-foreground"
            )}
        >
            {label}
            {active ? (
                direction === "asc" ? (
                    <ArrowUp className="w-3.5 h-3.5" />
                ) : (
                    <ArrowDown className="w-3.5 h-3.5" />
                )
            ) : (
                <ArrowUp className="w-3.5 h-3.5 text-muted-foreground/50" aria-hidden />
            )}
        </button>
    );
}

type ReservationStatus = "upcoming" | "in-progress" | "past";

function getReservationStatus(startDate: string, endDate: string): ReservationStatus {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);
    if (end < today) return "past";
    if (start > today) return "upcoming";
    return "in-progress";
}

interface GuestsTabProps {
    propertyId: string;
    maxGuests: number;
}

interface NewGuestForm {
    firstName: string;
    lastName: string;
    phone: string;
    startDate: string;
    endDate: string;
}

export const GuestsTab = ({ propertyId, maxGuests }: GuestsTabProps) => {
    const queryClient = useQueryClient();
    const [showAddForm, setShowAddForm] = useState(false);
    const [newGuest, setNewGuest] = useState<NewGuestForm>({
        firstName: "",
        lastName: "",
        phone: "",
        startDate: "",
        endDate: "",
    });

    const [togglingId, setTogglingId] = useState<string | null>(null);
    const [sortColumn, setSortColumn] = useState<SortColumn>("createdAt");
    const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

    const { data: reservations, isLoading, error } = useQuery({
        queryKey: ["reservations", propertyId],
        queryFn: () => getReservationsForProperty(propertyId),
    });

    const rows = useMemo(() => (reservations ?? []).map((r: PropertyReservation) => ({
        reservationId: r.id,
        guestId: r.guest.id,
        firstName: r.guest.firstName,
        lastName: r.guest.lastName,
        phone: r.guest.phone,
        startDate: r.guest.startDate,
        endDate: r.guest.endDate,
        isActive: r.isActive,
        createdAt: r.createdAt ?? null,
    })), [reservations]);

    const sortedRows = useMemo(() => {
        const sorted = [...rows];
        const mult = sortDirection === "asc" ? 1 : -1;
        sorted.sort((a, b) => {
            if (sortColumn === "createdAt") {
                const aT = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const bT = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                return mult * (aT - bT);
            }
            if (sortColumn === "checkIn") {
                return mult * (new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
            }
            return mult * (new Date(a.endDate).getTime() - new Date(b.endDate).getTime());
        });
        return sorted;
    }, [rows, sortColumn, sortDirection]);

    const handleSort = (column: SortColumn) => {
        if (sortColumn === column) {
            setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
        } else {
            setSortColumn(column);
            setSortDirection("asc");
        }
    };

    const formatCreatedAt = (iso: string | null) => {
        if (!iso) return "—";
        const d = new Date(iso);
        return d.toLocaleDateString(undefined, { dateStyle: "medium" });
    };

    const activeCount = rows.filter((g) => g.isActive).length;

    const handleAddGuest = async () => {
        if (!newGuest.firstName || !newGuest.phone) return;

        const guestResponse = await createGuest({
            firstName: newGuest.firstName,
            lastName: newGuest.lastName,
            phone: newGuest.phone,
        });

        await createReservation({
            propertyId,
            guestId: guestResponse.id,
            checkIn: newGuest.startDate ? new Date(newGuest.startDate).toISOString() : new Date().toISOString(),
            checkOut: newGuest.endDate ? new Date(newGuest.endDate).toISOString() : new Date().toISOString(),
        });

        await queryClient.invalidateQueries({ queryKey: ["reservations", propertyId] });
        await queryClient.invalidateQueries({ queryKey: ["property", propertyId] });
        setNewGuest({ firstName: "", lastName: "", phone: "", startDate: "", endDate: "" });
        setShowAddForm(false);
        toast.success("Guest added successfully");
    };

    const handleRemoveGuest = async (reservationId: string) => {
        await deleteReservation(propertyId, reservationId);
        await queryClient.invalidateQueries({ queryKey: ["reservations", propertyId] });
        await queryClient.invalidateQueries({ queryKey: ["property", propertyId] });
        toast.success("Guest removed successfully");
    };

    const toggleGuestActive = async (row: { reservationId: string; isActive: boolean }) => {
        if (togglingId) return;

        const nextActiveCount = activeCount + (row.isActive ? -1 : 1);
        if (!row.isActive && nextActiveCount > maxGuests) {
            toast.error(`You can only have up to ${maxGuests} active guests at a time.`);
            return;
        }

        setTogglingId(row.reservationId);
        try {
            await updateReservation(propertyId, row.reservationId, {
                isActive: !row.isActive,
            });
        } catch (error: any) {
            const message =
                error?.response?.data?.message ||
                "Unable to update guest access. Please make sure no more than 3 guests are active.";
            toast.error(message);
        } finally {
            setTogglingId(null);
            await queryClient.invalidateQueries({ queryKey: ["reservations", propertyId] });
            await queryClient.invalidateQueries({ queryKey: ["property", propertyId] });
        }
    };

    const isFormValid = newGuest.firstName && newGuest.phone;

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
                <p className="text-muted-foreground">Failed to load guests.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Add Guest Button / Form */}
            {!showAddForm ? (
                <Button
                    onClick={() => setShowAddForm(true)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add Guest
                </Button>
            ) : (
                <div className="bg-card rounded-2xl border border-border p-6 shadow-soft animate-fade-in">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Add New Guest</h3>
                        <button
                            onClick={() => {
                                setShowAddForm(false);
                                setNewGuest({ firstName: "", lastName: "", phone: "", startDate: "", endDate: "" });
                            }}
                            className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <Label htmlFor="guestName">First Name *</Label>
                            <Input
                                id="guestFirstName"
                                placeholder="e.g., John"
                                value={newGuest.firstName}
                                onChange={(e) => setNewGuest({ ...newGuest, firstName: e.target.value })}
                                className="mt-1.5"
                            />
                        </div>
                        <div>
                            <Label htmlFor="guestName">Last Name</Label>
                            <Input
                                id="guestLastName"
                                placeholder="e.g., Smith"
                                value={newGuest.lastName}
                                onChange={(e) => setNewGuest({ ...newGuest, lastName: e.target.value })}
                                className="mt-1.5"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <Label htmlFor="guestPhone">Phone Number *</Label>
                            <Input
                                id="guestPhone"
                                type="tel"
                                placeholder="e.g., +1 234 567 8900"
                                value={newGuest.phone}
                                onChange={(e) => setNewGuest({ ...newGuest, phone: e.target.value })}
                                className="mt-1.5"
                            />
                        </div>
                        <div>
                            <Label htmlFor="startDate">Check-in Date</Label>
                            <Input
                                id="startDate"
                                type="date"
                                value={newGuest.startDate}
                                onChange={(e) => setNewGuest({ ...newGuest, startDate: e.target.value })}
                                className="mt-1.5"
                            />
                        </div>
                        <div>
                            <Label htmlFor="endDate">Check-out Date</Label>
                            <Input
                                id="endDate"
                                type="date"
                                value={newGuest.endDate}
                                onChange={(e) => setNewGuest({ ...newGuest, endDate: e.target.value })}
                                className="mt-1.5"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowAddForm(false);
                                setNewGuest({ firstName: "", lastName: "", phone: "", startDate: "", endDate: "" });
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAddGuest}
                            disabled={!isFormValid}
                            className="gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add Guest
                        </Button>
                    </div>
                </div>
            )}

            {/* Guests Table */}
            <div className="bg-card rounded-2xl border border-border shadow-soft overflow-hidden">
                <div className="p-6 border-b border-border">
                    <h3 className="text-lg font-semibold">Enrolled Guests</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        {activeCount} of {maxGuests} guest slots active
                    </p>
                </div>

                {sortedRows.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="font-semibold">Full Name</TableHead>
                                <TableHead className="font-semibold">Phone</TableHead>
                                <TableHead className="font-semibold">
                                    <SortableHead
                                        label="Check-in"
                                        active={sortColumn === "checkIn"}
                                        direction={sortDirection}
                                        onClick={() => handleSort("checkIn")}
                                    />
                                </TableHead>
                                <TableHead className="font-semibold">
                                    <SortableHead
                                        label="Check-out"
                                        active={sortColumn === "checkOut"}
                                        direction={sortDirection}
                                        onClick={() => handleSort("checkOut")}
                                    />
                                </TableHead>
                                <TableHead className="font-semibold">
                                    <SortableHead
                                        label="Created at"
                                        active={sortColumn === "createdAt"}
                                        direction={sortDirection}
                                        onClick={() => handleSort("createdAt")}
                                    />
                                </TableHead>
                                <TableHead className="font-semibold text-right">AI Access</TableHead>
                                <TableHead className="w-12"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedRows.map((guest) => {
                                const status = getReservationStatus(guest.startDate, guest.endDate);
                                const rowBorderClass =
                                    status === "in-progress"
                                        ? "border-l-4 border-l-status-online"
                                        : status === "past"
                                          ? "border-l-4 border-l-border bg-muted/30"
                                          : "";
                                return (
                                <TableRow key={guest.reservationId} className={rowBorderClass}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <span>{`${guest.firstName} ${guest.lastName}`}</span>
                                            {status === "in-progress" && (
                                                <span className="inline-flex items-center gap-1 text-xs font-medium text-status-online">
                                                    <Circle className="w-2.5 h-2.5 fill-current" />
                                                    In progress
                                                </span>
                                            )}
                                            {status === "past" && (
                                                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                                                    <CheckCircle className="w-3.5 h-3.5" />
                                                    Past
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{guest.phone}</TableCell>
                                    <TableCell>{guest.startDate}</TableCell>
                                    <TableCell>{guest.endDate}</TableCell>
                                    <TableCell className="text-muted-foreground">{formatCreatedAt(guest.createdAt)}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <span className="text-sm text-muted-foreground">
                                                {guest.isActive ? "On" : "Off"}
                                            </span>
                                            <Switch
                                                checked={guest.isActive}
                                                onCheckedChange={() => toggleGuestActive(guest)}
                                                disabled={togglingId === guest.reservationId}
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <button
                                            onClick={() => handleRemoveGuest(guest.reservationId)}
                                            className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </TableCell>
                                </TableRow>
                            );
                            })}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="text-center py-12 text-muted-foreground">
                        <p>No guests enrolled for this property.</p>
                        <p className="text-sm mt-1">Click "Add Guest" above to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GuestsTab;