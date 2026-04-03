import React, { ReactNode, useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import { ThunkAction, ThunkDispatch } from './types';
import type { AppAction } from './actions';
import * as thunks from './thunks';
import { AppContext } from './contexts';
import { rootReducer } from './reducers/rootReducer';
import { initialState } from './initialState';
import { useSupabaseAuthSession } from './hooks/app/useSupabaseAuthSession';
import { useAppBootstrap } from './hooks/app/useAppBootstrap';
import { useAppStateSync } from './hooks/app/useAppStateSync';
import { useDailyProgressReset } from './hooks/app/useDailyProgressReset';
import AuthGate from './components/layout/AuthGate';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, baseDispatch] = useReducer(rootReducer, initialState);
    const stateRef = useRef(state);
    const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const lastQueuedSignatureRef = useRef<string | null>(null);
    const saveGenerationRef = useRef(0);

    useEffect(() => {
        stateRef.current = state;
    }, [state]);

    const invalidatePendingSave = useCallback(() => {
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
            saveTimeoutRef.current = null;
        }
        saveGenerationRef.current += 1;
    }, []);

    const thunkDispatch: ThunkDispatch<AppAction> = useCallback(<ReturnType,>(action: AppAction | ThunkAction<ReturnType>) => {
        if (typeof action === 'function') {
            return action(thunkDispatch, () => stateRef.current);
        }

        baseDispatch(action);
        return undefined as ReturnType;
    }, []) as ThunkDispatch<AppAction>;

    const showToast = useCallback((message: string) => {
        thunkDispatch(thunks.showToastThunk(message));
    }, [thunkDispatch]);

    const { session, authInitialized } = useSupabaseAuthSession();
    const isInitialized = useAppBootstrap({
        userId: session?.user?.id,
        authInitialized,
        dispatch: thunkDispatch,
        invalidatePendingSave,
        lastQueuedSignatureRef,
    });

    useAppStateSync({
        state,
        isInitialized,
        userId: session?.user?.id,
        dispatch: thunkDispatch,
        invalidatePendingSave,
        lastQueuedSignatureRef,
        saveTimeoutRef,
        saveGenerationRef,
    });

    useDailyProgressReset({
        isInitialized,
        lastResetDate: state.session.dailyProgress.lastResetDate,
        dispatch: thunkDispatch,
    });

    useEffect(() => {
        localStorage.setItem('fitArchitectTheme', state.profile.theme);
    }, [state.profile.theme]);

    const contextValue = useMemo(() => ({
        state,
        dispatch: thunkDispatch,
        showToast,
    }), [state, thunkDispatch, showToast]);

    if (!isInitialized || !authInitialized || !session) {
        return (
            <AuthGate
                isReady={isInitialized && authInitialized}
                isAuthenticated={Boolean(session)}
            />
        );
    }

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};
