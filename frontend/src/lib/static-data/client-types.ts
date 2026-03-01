import { PropertyInfo } from "./request-types";

export interface ExactAnswer {
    id: string;
    question: string;
    answer: string;
}

export interface Guest {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    startDate: string;
    endDate: string;
}

export interface FeatureItem {
    id: string;
    label: string;
    icon: React.ElementType;
    enabled?: boolean;
    details?: string;
    allowDetails?: boolean;
}

export const PROPERTY_PAYLOAD_TO_API_KEYS: Record<keyof PropertyInfo, string> = {
    name: 'name',
    address: 'address',
    ownershipLevel: 'ownership_level',
    propertyType: 'property_type',
    bedrooms: 'bedrooms',
    bathrooms: 'bathrooms',
    photo: 'photo',
    checkinMessage: 'checkin_msg',
    checkoutMessage: 'checkout_msg',
    checkinTime: 'checkin_time',
    checkoutTime: 'checkout_time',
    checkinReminderHours: 'checkin_reminder_hours',
    checkoutReminderHours: 'checkout_reminder_hours',
};

export interface PropertyReservation {
    id: string;
    propertyId: string;
    checkIn: string;
    checkOut: string;
    isActive: boolean;
    guest: Guest;
}

export type TabType = "overview" | "knowledge" | "exact-answers" | "guests";

export type SortKey = "createdAt" | "checkIn" | "checkOut";
