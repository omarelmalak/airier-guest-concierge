import { api } from '../api';
import { CreateGuestResponse, CreateReservationResponse } from '@/lib/static-data/response-types';
import { GuestInfo, ReservationInfo } from '../static-data/request-types';
import { PropertyReservation } from '@/lib/static-data/client-types';

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
    const response = await api.post<CreateReservationResponse>(`/properties/${reservation.propertyId}/reservations`, {
        reservation: {
            guest_id: reservation.guestId,
            check_in: reservation.checkIn,
            check_out: reservation.checkOut,
        },
    });

    return response;
}

export const getReservationsForProperty = async (propertyId: string): Promise<PropertyReservation[]> => {
    return api.get<PropertyReservation[]>(`/properties/${propertyId}/reservations`);
};

export const deleteReservation = async (propertyId: string, reservationId: string): Promise<void> => {
    return api.delete<void>(`/properties/${propertyId}/reservations/${reservationId}`);
};

export const updateReservation = async (
    propertyId: string,
    reservationId: string,
    payload: { isActive?: boolean; checkIn?: string; checkOut?: string }
): Promise<CreateReservationResponse> => {
    return api.patch<CreateReservationResponse>(`/properties/${propertyId}/reservations/${reservationId}`, {
        reservation: {
            is_active: payload.isActive,
            check_in: payload.checkIn,
            check_out: payload.checkOut,
        },
    });
};
