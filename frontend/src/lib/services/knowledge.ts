import { api } from '../api';
import { GetPropertyKnowledgeResponse, GetPropertyKnowledgeCategoriesResponse } from '@/lib/static-data/response-types';
import { FeatureItem } from '@/lib/static-data/client-types';
import { defaultAmenities, defaultWhereIsItems, defaultRecommendations, defaultRules } from '@/lib/static-data/defaults';

function mergeCategoryWithApi(
    defaults: FeatureItem[],
    payload: GetPropertyKnowledgeCategoriesResponse
): FeatureItem[] {
    const byName = new Map(payload.items.map((i) => [i.name, i.description]));
    return defaults.map((d) => {
        const desc = byName.get(d.label);
        return desc !== undefined
            ? { ...d, enabled: true, details: desc ?? '' }
            : { ...d, enabled: false, details: '' };
    });
}

export async function getPropertyKnowledge(propertyId: string): Promise<GetPropertyKnowledgeResponse> {
    return api.get<GetPropertyKnowledgeResponse>(`/properties/${propertyId}/knowledge`);
}

export async function savePropertyKnowledge(
    propertyId: string,
    payload: GetPropertyKnowledgeResponse
): Promise<GetPropertyKnowledgeResponse> {
    return api.put<GetPropertyKnowledgeResponse>(`/properties/${propertyId}/knowledge`, payload);
}

export function buildPropertyKnowledgePayload(params: {
    amenities: FeatureItem[];
    otherAmenities: string;
    whereIsItems: FeatureItem[];
    otherWhereIs: string;
    recommendations: FeatureItem[];
    otherRecommendations: string;
    rules: FeatureItem[];
    otherRules: string;
}): GetPropertyKnowledgeResponse {
    const toItems = (items: FeatureItem[]) =>
        items.filter((i) => i.enabled).map((i) => ({ name: i.label, description: i.details ?? '' }));
    return {
        amenities: { description: params.otherAmenities, items: toItems(params.amenities) },
        where_is: { description: params.otherWhereIs, items: toItems(params.whereIsItems) },
        recommendations: { description: params.otherRecommendations, items: toItems(params.recommendations) },
        rules: { description: params.otherRules, items: toItems(params.rules) },
    };
}

export function mapPropertyKnowledgeToAddPropertyShape(data: GetPropertyKnowledgeResponse) {
    return {
        amenities: mergeCategoryWithApi(defaultAmenities, data.amenities),
        otherAmenities: data.amenities.description ?? '',
        whereIsItems: mergeCategoryWithApi(defaultWhereIsItems, data.where_is),
        otherWhereIs: data.where_is.description ?? '',
        recommendations: mergeCategoryWithApi(defaultRecommendations, data.recommendations),
        otherRecommendations: data.recommendations.description ?? '',
        rules: mergeCategoryWithApi(defaultRules, data.rules),
        otherRules: data.rules.description ?? '',
    };
}
