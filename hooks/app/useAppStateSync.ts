import { useEffect, useRef, type MutableRefObject } from 'react';
import type { AppAction } from '../../actions';
import * as actions from '../../actions';
import { createPersistedStateSignature, saveStateToStorage } from '../../statePersistence';
import { saveUserState } from '../../services/supabaseService';
import { AppState, ThunkDispatch } from '../../types';

type AppStateSyncParams = {
    state: AppState;
    isInitialized: boolean;
    userId?: string;
    dispatch: ThunkDispatch<AppAction>;
    invalidatePendingSave: () => void;
    lastQueuedSignatureRef: MutableRefObject<string | null>;
    saveTimeoutRef: MutableRefObject<ReturnType<typeof setTimeout> | null>;
    saveGenerationRef: MutableRefObject<number>;
};

export const useAppStateSync = ({
    state,
    isInitialized,
    userId,
    dispatch,
    invalidatePendingSave,
    lastQueuedSignatureRef,
    saveTimeoutRef,
    saveGenerationRef,
}: AppStateSyncParams) => {
    const stateRef = useRef(state);

    useEffect(() => {
        stateRef.current = state;
    }, [state]);

    useEffect(() => {
        if (!isInitialized) return;
        if (!userId) return;

        const snapshotForStorage = createPersistedStateSignature(state, { normalizeSyncStatus: true });

        if (snapshotForStorage === lastQueuedSignatureRef.current) {
            return;
        }

        saveStateToStorage(state, userId);
        lastQueuedSignatureRef.current = snapshotForStorage;
        invalidatePendingSave();

        const saveGeneration = saveGenerationRef.current;
        saveTimeoutRef.current = setTimeout(async () => {
            if (saveGeneration !== saveGenerationRef.current) return;

            if (stateRef.current.ui.syncStatus !== 'syncing') {
                dispatch(actions.setSyncStatus('syncing'));
            }

            try {
                await saveUserState(state, userId);
                if (saveGeneration !== saveGenerationRef.current) return;
                dispatch(actions.setSyncStatus('synced'));
            } catch (error) {
                if (saveGeneration !== saveGenerationRef.current) return;
                console.error('Error saving user state to Supabase:', error);
                dispatch(actions.setSyncStatus('error'));
            } finally {
                if (saveGeneration === saveGenerationRef.current) {
                    saveTimeoutRef.current = null;
                }
            }
        }, 2000);

        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
                saveTimeoutRef.current = null;
            }
        };
    }, [state, isInitialized, userId, dispatch, invalidatePendingSave, lastQueuedSignatureRef, saveGenerationRef, saveTimeoutRef]);
};
