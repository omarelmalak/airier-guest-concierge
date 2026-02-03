import { supabase } from './supabase';
import { api } from './api';
import { CreateKnowledgeCategoryResponse, CreatePropertyKnowledgeCategoryResponse, CreateFeatureResponse, CreateKnowledgeCategoryFeatureResponse } from '@/lib/static-data/response-types';
import { KnowledgeCategoryInfo, PropertyKnowledgeCategoryInfo, FeatureInfo, KnowledgeCategoryFeatureInfo } from './static-data/request-types';

export const createKnowledgeCategory = async (knowledgeCategory: KnowledgeCategoryInfo): Promise<CreateKnowledgeCategoryResponse> => {
    const response = await api.post<CreateKnowledgeCategoryResponse>('/knowledge_categories', {
        knowledge_category: {
            name: knowledgeCategory.name,
        },
    });

    return response;
}

export const createPropertyKnowledgeCategory = async (propertyKnowledgeCategory: PropertyKnowledgeCategoryInfo): Promise<CreatePropertyKnowledgeCategoryResponse> => {
    const response = await api.post<CreatePropertyKnowledgeCategoryResponse>('/property_knowledge_categories', {
        property_knowledge_category: {
            property_id: propertyKnowledgeCategory.propertyId,
            knowledge_category_id: propertyKnowledgeCategory.knowledgeCategoryId,
            description: propertyKnowledgeCategory.description,
        },
    });

    return response;
}

export const createFeature = async (feature: FeatureInfo): Promise<CreateFeatureResponse> => {
    const response = await api.post<CreateFeatureResponse>('/features', {
        feature: {
            name: feature.name,
        },
    });

    return response;
}

export const createKnowledgeCategoryFeature = async (knowledgeCategoryFeature: KnowledgeCategoryFeatureInfo): Promise<CreateKnowledgeCategoryFeatureResponse> => {
    const response = await api.post<CreateKnowledgeCategoryFeatureResponse>('/knowledge_category_features', {
        knowledge_category_feature: {
            property_id: knowledgeCategoryFeature.propertyId,
            knowledge_category_id: knowledgeCategoryFeature.knowledgeCategoryId,
            feature_id: knowledgeCategoryFeature.featureId,
            description: knowledgeCategoryFeature.description,
        },
    });

    return response;
}