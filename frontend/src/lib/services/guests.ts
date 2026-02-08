import { supabase } from '../supabase';
import { api } from '../api';
import { CreateGuestResponse, CreateReservationResponse } from '@/lib/static-data/response-types';
import { GuestInfo, ReservationInfo } from '../static-data/request-types';

export const createGuest = async (guest: GuestInfo): Promise<CreateGuestResponse> => {
    const response = await api.post<CreateGuestResponse>('/guests', {
        guest: {
            first_name: guest.firstName,
            last_name: guest.lastName,
            phone: guest.phone,
        },
    });
    return response;
}

export const createReservation = async (reservation: ReservationInfo): Promise<CreateReservationResponse> => {
    const response = await api.post<CreateReservationResponse>('/reservations', {
        reservation: {
            property_id: reservation.propertyId,
            guest_id: reservation.guestId,
            check_in: reservation.checkIn,
            check_out: reservation.checkOut,
        },
    });

    return response;
}