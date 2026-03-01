import { PropertyReservation } from "./client-types";

export interface CreatePropertyResponse {
    id: string;
    host_id: string;
    name: string;
    property_type: string;
    bedrooms: number;
    bathrooms: number;
    address: string;
    photo: string;
    ownership_level: string;
    checkin_msg: string;
    checkout_msg: string;
    checkin_time: string;
    checkout_time: string;
    checkin_reminder_hours: number;
    checkout_reminder_hours: number;
}

export interface CreateKnowledgeCategoryResponse {
    id: string;
    name: string;
}

export interface CreatePropertyKnowledgeCategoryResponse {
    id: string;
    property_id: string;
    knowledge_category_id: string;
    description: string;
}

export interface CreateFeatureResponse {
    id: string;
    name: string;
}

export interface CreateKnowledgeCategoryFeatureResponse {
    id: string;
    property_id: string;
    knowledge_category_id: string;
    feature_id: string;
    description: string;
}

export interface CreateExactAnswerResponse {
    id: string;
    property_id: string;
    question: string;
    answer: string;
}

export interface CreateGuestResponse {
    id: string;
    first_name: string;
    last_name: string;
    phone: string;
}

export interface CreateReservationResponse {
    id: string;
    property_id: string;
    guest_id: string;
    check_in: string;
    check_out: string;
}

export interface GetPropertiesResponse {
    id: string;
    name: string;
    address: string;
    photo: string;
    active_guests_count: number;
    subscription_expires_at: string;
    escalations_count: number;
    ai_status: string;
}

export type UpdatePropertyResponse = CreatePropertyResponse;

export interface GetPropertyKnowledgeCategoriesResponse {
    description: string;
    items: { name: string; description: string }[];
}

export interface GetPropertyKnowledgeResponse {
    amenities: GetPropertyKnowledgeCategoriesResponse;
    where_is: GetPropertyKnowledgeCategoriesResponse;
    recommendations: GetPropertyKnowledgeCategoriesResponse;
    rules: GetPropertyKnowledgeCategoriesResponse;
}

export interface GetPropertyDetailsResponse {
    id: string;
    name: string;
    address: string;
    photo: string;
    active_guests_count: number;
    subscription_expires_at: string;
    ownership_level: string;
    property_type: string;
    bedrooms: number;
    bathrooms: number;
    checkin_msg: string;
    checkout_msg: string;
    checkin_time: string;
    checkin_reminder_hours: number;
    checkout_time: string;
    checkout_reminder_hours: number;
}

export interface GetPropertyReservationsResponse {
    reservations: PropertyReservation[];
}