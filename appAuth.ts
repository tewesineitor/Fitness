import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { getSupabase } from './services/supabaseClient';

export const useSupabaseAuthSession = () => {
    const [session, setSession] = useState<Session | null>(null);
    const [authInitialized, setAuthInitialized] = useState(false);

    useEffect(() => {
        const supabase = getSupabase();
        if (!supabase) {
            setAuthInitialized(true);
            return;
        }

        let isActive = true;

        supabase.auth.getSession()
            .then(({ data: { session: currentSession } }) => {
                if (!isActive) return;
                setSession(currentSession);
                setAuthInitialized(true);
            })
            .catch((error) => {
                console.error('Failed to load Supabase session:', error);
                if (!isActive) return;
                setAuthInitialized(true);
            });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, currentSession) => {
            if (!isActive) return;
            setSession(currentSession);
        });

        return () => {
            isActive = false;
            subscription.unsubscribe();
        };
    }, []);

    return { session, authInitialized };
};
