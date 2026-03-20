import { useEffect, useState, type MutableRefObject } from 'react';
import type { AppAction } from './actions';
import { AppState, ThunkDispatch } from './types';
import { initialState } from './initialState';
import { fetchStaticData, fetchUserState, saveUserState, seedDatabaseIfEmpty } from './services/supabaseService';
import {
    createPersistedStateSignature,
    hydratePersistedState,
    loadStateFromStorage,
    mergeStaticAppData,
    saveStateToStorage,
} from './statePersistence';

type BootstrapParams = {
    userId?: string;
    authInitialized: boolean;
    dispatch: ThunkDispatch<AppAction>;
    invalidatePendingSave: () => void;
    lastQueuedSignatureRef: MutableRefObject<string | null>;
};

export const useAppBootstrap = ({
    userId,
    authInitialized,
    dispatch,
    invalidatePendingSave,
    lastQueuedSignatureRef,
}: BootstrapParams) => {
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        if (!authInitialized) return;

        const themeOverride = localStorage.getItem('fitArchitectTheme');
        let cancelled = false;

        invalidatePendingSave();

        if (!userId) {
            lastQueuedSignatureRef.current = null;
            dispatch({ type: 'REPLACE_STATE', payload: initialState });
            setIsInitialized(true);
            return () => {
                cancelled = true;
            };
        }

        setIsInitialized(false);

        const initApp = async () => {
            try {
                await seedDatabaseIfEmpty();

                const [staticData, dbState] = await Promise.all([
                    fetchStaticData(),
                    fetchUserState(),
                ]);

                let finalState: AppState;
                const localState = loadStateFromStorage(userId, themeOverride);

                if (dbState && localState) {
                    const dbTime = dbState.lastUpdated || 0;
                    const localTime = localState.lastUpdated || 0;

                    if (localTime > dbTime) {
                        finalState = localState;
                        try {
                            await saveUserState(localState, userId);
                        } catch (error) {
                            console.error('Failed to sync newer local state to Supabase during init', error);
                        }
                    } else {
                        finalState = hydratePersistedState(dbState, themeOverride);
                    }
                } else if (dbState) {
                    finalState = hydratePersistedState(dbState, themeOverride);
                } else if (localState) {
                    finalState = localState;
                } else {
                    finalState = initialState;
                }

                finalState = mergeStaticAppData(finalState, staticData);

                lastQueuedSignatureRef.current = createPersistedStateSignature(finalState, { normalizeSyncStatus: true });
                saveStateToStorage(finalState, userId);

                if (cancelled) return;
                dispatch({ type: 'REPLACE_STATE', payload: finalState });
            } catch (error) {
                console.error('Failed to initialize from Supabase, falling back to local storage', error);
                const localState = loadStateFromStorage(userId, themeOverride);
                if (localState) {
                    lastQueuedSignatureRef.current = createPersistedStateSignature(localState, { normalizeSyncStatus: true });
                    saveStateToStorage(localState, userId);
                    if (cancelled) return;
                    dispatch({ type: 'REPLACE_STATE', payload: localState });
                }
            } finally {
                if (!cancelled) {
                    setIsInitialized(true);
                }
            }
        };

        initApp();

        return () => {
            cancelled = true;
        };
    }, [authInitialized, userId, dispatch, invalidatePendingSave, lastQueuedSignatureRef]);

    return isInitialized;
};
