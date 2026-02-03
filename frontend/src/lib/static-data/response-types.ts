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

export interface PropertyKnowledgeCategoryInfo {
    id: string;
    property_id: string;
    knowledge_category_id: string;
    description: string;
}