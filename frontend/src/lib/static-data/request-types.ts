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