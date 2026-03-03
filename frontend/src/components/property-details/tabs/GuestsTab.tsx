import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Trash2 } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { createGuest, createReservation, getReservationsForProperty, deleteReservation, updateReservation } from "@/lib/services/guests";
import { PropertyReservation } from "@/lib/static-data/client-types";
import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { SortKey } from "@/lib/static-data/client-types";

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
    const [sortBy, setSortBy] = useState<SortKey>("createdAt");

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
    })), [reservations]);

    const sortedRows =
        sortBy === "createdAt"
            ? rows
            : [...rows].sort((a, b) => {
                const aDate = sortBy === "checkIn" ? new Date(a.startDate) : new Date(a.endDate);
                const bDate = sortBy === "checkIn" ? new Date(b.startDate) : new Date(b.endDate);
                return aDate.getTime() - bDate.getTime();
            });

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
                <div className="p-6 border-b border-border flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h3 className="text-lg font-semibold">Enrolled Guests</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            {activeCount} of {maxGuests} guest slots active
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Sort by</span>
                        <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortKey)}>
                            <SelectTrigger className="h-8 w-40 bg-secondary border-0">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="createdAt">Created (default)</SelectItem>
                                <SelectItem value="checkIn">Check-in date</SelectItem>
                                <SelectItem value="checkOut">Check-out date</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {sortedRows.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="font-semibold">Full Name</TableHead>
                                <TableHead className="font-semibold">Phone</TableHead>
                                <TableHead className="font-semibold">Check-in</TableHead>
                                <TableHead className="font-semibold">Check-out</TableHead>
                                <TableHead className="font-semibold text-right">AI Access</TableHead>
                                <TableHead className="w-12"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedRows.map((guest) => (
                                <TableRow key={guest.reservationId}>
                                    <TableCell className="font-medium">{`${guest.firstName} ${guest.lastName}`}</TableCell>
                                    <TableCell className="text-muted-foreground">{guest.phone}</TableCell>
                                    <TableCell>{guest.startDate}</TableCell>
                                    <TableCell>{guest.endDate}</TableCell>
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
                            ))}
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