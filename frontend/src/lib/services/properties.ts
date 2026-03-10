import { supabase } from '../supabase';
import { api } from '../api';
import { PropertyInfo, UpdatePropertyInfo } from '@/lib/static-data/request-types';
import { CreatePropertyResponse, GetPropertiesResponse, GetPropertyDetailsResponse, UpdatePropertyResponse } from '@/lib/static-data/response-types';
import apartmentPhoto from '@/assets/default-property-photos/apartment.jpg';
import cabinPhoto from '@/assets/default-property-photos/cabin.jpg';
import condoPhoto from '@/assets/default-property-photos/condo.jpg';
import housePhoto from '@/assets/default-property-photos/house.jpg';
import loftPhoto from '@/assets/default-property-photos/loft.jpg';
import studioPhoto from '@/assets/default-property-photos/studio.jpg';
import townhousePhoto from '@/assets/default-property-photos/townhouse.jpg';
import villaPhoto from '@/assets/default-property-photos/villa.jpg';
import { PROPERTY_PAYLOAD_TO_API_KEYS } from '@/lib/static-data/client-types';

const defaultPhotoMap: Record<string, string> = {
    'Apartment': apartmentPhoto,
    'Cabin': cabinPhoto,
    'Condo': condoPhoto,
    'House': housePhoto,
    'Loft': loftPhoto,
    'Studio': studioPhoto,
    'Townhouse': townhousePhoto,
    'Villa': villaPhoto,
};

const getDefaultPhoto = (propertyType: string): string => {
    return defaultPhotoMap[propertyType] || housePhoto;
};

export const createProperty = async (property: PropertyInfo): Promise<CreatePropertyResponse> => {
    const photo = property.photo?.trim() || getDefaultPhoto(property.propertyType);

    const response = await api.post<CreatePropertyResponse>('/properties', {
        property: {
            name: property.name,
            property_type: property.propertyType,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            address: property.address,
            photo: photo,
            ownership_level: property.ownershipLevel,
            checkin_msg: property.checkinMessage,
            checkout_msg: property.checkoutMessage,
            checkin_time: property.checkinTime,
            checkout_time: property.checkoutTime,
            checkin_reminder_hours: property.checkinReminderHours,
            checkout_reminder_hours: property.checkoutReminderHours,
            timezone: property.timezone,
        }
    });

    return response;
}

export const getProperties = async (): Promise<GetPropertiesResponse[]> => {
    const response = await api.get<GetPropertiesResponse[]>('/properties');
    return response;
}

export const getPropertyDetails = async (propertyId: string): Promise<GetPropertyDetailsResponse> => {
    const response = await api.get<GetPropertyDetailsResponse>(`/properties/${propertyId}`);
    return response;
}

export const updateProperty = async (
    propertyId: string,
    payload: UpdatePropertyInfo
): Promise<UpdatePropertyResponse> => {
    const property: Record<string, string | number> = {};
    for (const [key, value] of Object.entries(payload)) {
        if (value === undefined) continue;
        const apiKey = PROPERTY_PAYLOAD_TO_API_KEYS[key as keyof PropertyInfo];
        if (apiKey) property[apiKey] = value;
    }
    const response = await api.patch<UpdatePropertyResponse>(`/properties/${propertyId}`, {
        property,
    });
    return response;
};