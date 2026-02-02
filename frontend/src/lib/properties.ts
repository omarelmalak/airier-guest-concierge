import { supabase } from './supabase';
import { api } from './api';
import { PropertyInfo } from '@/lib/static-data/client-types';
import { CreatePropertyResponse } from '@/lib/static-data/response-types';

export const createProperty = async (property: PropertyInfo): Promise<CreatePropertyResponse> => {
    const response = await api.post<CreatePropertyResponse>('/properties', {
        property: {
            name: property.name,
            property_type: property.propertyType,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            address: property.address,
            photo: property.photo,
            ownership_level: property.ownershipLevel,
            checkin_msg: property.checkinMessage,
            checkout_msg: property.checkoutMessage
        }
    });

    return response;
}