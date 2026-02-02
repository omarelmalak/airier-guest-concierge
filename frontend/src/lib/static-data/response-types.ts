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