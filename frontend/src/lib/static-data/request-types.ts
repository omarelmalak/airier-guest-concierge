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
}

export interface KnowledgeCategoryInfo {
    name: string;
}

export interface PropertyKnowledgeCategoryInfo {
    property_id: string;
    knowledge_category_id: string;
    description: string;
}