import { supabase } from './supabase';
import { api } from './api';

export const signUp = async (email: string, password: string, firstName?: string, lastName?: string, phone?: string) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) throw error;
    if (!data.session) {
        throw new Error("No session created. Please check your email for confirmation.");
    }

    // Only call API if we have a session and user data
    if (data.session && (firstName || lastName || phone)) {
        try {
            await api.patch('/hosts/profile', {
                host: {
                    first_name: firstName,
                    last_name: lastName,
                    phone: phone
                }
            });
        } catch (apiError) {
            console.error("Failed to update host profile:", apiError);
            // Don't throw - signup succeeded even if profile update fails
        }
    }

    return data;
};

export const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) throw error;
    console.log(data, error);

    return data;
};

export const signOut = async () => {
    await supabase.auth.signOut();
};

export const getSession = async () => {
    const { data } = await supabase.auth.getSession();
    return data.session;
};

export const getUser = async () => {
    const { data } = await supabase.auth.getUser();
    return data.user;
};
