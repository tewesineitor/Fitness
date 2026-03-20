import { AppState } from '../types';
import {
    createPersistedStateSnapshot,
    PersistedAppState,
} from '../statePersistence';
import { getSupabase } from './supabaseClient';

export const fetchUserState = async (): Promise<PersistedAppState | null> => {
    const supabase = getSupabase();
    if (!supabase) return null;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;

    try {
        const { data, error } = await supabase
            .from('user_state')
            .select('state_json')
            .eq('user_id', session.user.id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return null;
            }
            throw error;
        }

        return data.state_json as PersistedAppState;
    } catch (error: unknown) {
        console.error('Error fetching user state from Supabase:', error);
        return null;
    }
};

export const saveUserState = async (state: AppState | PersistedAppState, userId?: string) => {
    const supabase = getSupabase();
    if (!supabase) return;

    try {
        const effectiveUserId = userId ?? (await supabase.auth.getSession()).data.session?.user?.id;
        if (!effectiveUserId) return;

        const stateToSave = createPersistedStateSnapshot(state);
        stateToSave.lastUpdated = Date.now();

        const { error } = await supabase
            .from('user_state')
            .upsert({
                user_id: effectiveUserId,
                state_json: stateToSave,
                updated_at: new Date().toISOString(),
            }, { onConflict: 'user_id' });

        if (error) throw error;
    } catch (error: unknown) {
        console.error('Error saving user state to Supabase:', error);
        throw error;
    }
};
