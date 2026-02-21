export interface PropertyInfo {
    name: string;
    address: string;
    ownershipLevel: string;
    propertyType: string;
    bedrooms: string;
    bathrooms: string;
    photo: string;
    checkinMessage: string;
    checkoutMessage: string;
    checkinTime: string;
    checkoutTime: string;
    checkinReminderHours: string;
    checkoutReminderHours: string;
}

export interface KnowledgeCategoryInfo {
    name: string;
}

export interface PropertyKnowledgeCategoryInfo {
    propertyId: string;
    knowledgeCategoryId: string;
    description: string;
}

export interface FeatureInfo {
    name: string;
}

export interface KnowledgeCategoryFeatureInfo {
    propertyId: string;
    knowledgeCategoryId: string;
    featureId: string;
    description: string;
}

export interface ExactAnswerInfo {
    propertyId: string;
    question: string;
    answer: string;
}

export interface GuestInfo {
    firstName: string;
    lastName: string;
    phone: string;
}

export interface ReservationInfo {
    propertyId: string;
    guestId: string;
    checkIn: string;
    checkOut: string;
}