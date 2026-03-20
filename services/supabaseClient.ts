import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient | null => {
    if (supabaseInstance) return supabaseInstance;

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    // Check if variables exist and if the URL is valid
    const isValidUrl = supabaseUrl && (supabaseUrl.startsWith('http://') || supabaseUrl.startsWith('https://'));

    if (!isValidUrl || !supabaseAnonKey) {
        console.warn('Supabase credentials missing or invalid. Database features will be disabled.');
        return null;
    }

    try {
        supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
        return supabaseInstance;
    } catch (error) {
        console.error('Failed to initialize Supabase client:', error);
        return null;
    }
};
