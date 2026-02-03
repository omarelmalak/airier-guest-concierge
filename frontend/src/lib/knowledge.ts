import { supabase } from './supabase';
import { api } from './api';
import { CreateKnowledgeCategoryResponse, CreatePropertyKnowledgeCategoryResponse } from '@/lib/static-data/response-types';
import { KnowledgeCategoryInfo, PropertyKnowledgeCategoryInfo } from './static-data/request-types';

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
            property_id: propertyKnowledgeCategory.property_id,
            knowledge_category_id: propertyKnowledgeCategory.knowledge_category_id,
            description: propertyKnowledgeCategory.description,
        },
    });

    return response;
}