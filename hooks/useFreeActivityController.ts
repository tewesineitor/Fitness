import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../contexts';
import type { DesgloseCardioLibre } from '../types';
import * as actions from '../actions';
import * as thunks from '../thunks';
import { vibrate } from '../utils/helpers';

// ── Types ────────────────────────────────────────────────────────────────────

export type FreeActivityType = 'run' | 'hike' | 'rucking';

export interface FreeActivityController {
    isLoggingActivity: FreeActivityType | null;
    isRuckingActive: boolean;

    openActivityLog: (type: FreeActivityType) => void;
    closeActivityLog: () => void;
    handleSaveRun: (log: DesgloseCardioLibre) => void;
    handleSaveHike: (log: DesgloseCardioLibre) => void;
    handleSaveRucking: (log: DesgloseCardioLibre) => void;
    setIsRuckingActive: (v: boolean) => void;
    finishRucking: () => void;
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export const useFreeActivityController = (): FreeActivityController => {
    const { dispatch } = useContext(AppContext)!;

    const [isLoggingActivity, setIsLoggingActivity] = useState<FreeActivityType | null>(null);
    const [isRuckingActive, setIsRuckingActive] = useState(false);

    // Hide bottom nav when a modal is open (same pattern as useProgressController)
    useEffect(() => {
        if (isLoggingActivity) {
            dispatch({ type: 'SET_BOTTOM_NAV_VISIBLE', payload: false });
        }
        return () => {
            dispatch({ type: 'SET_BOTTOM_NAV_VISIBLE', payload: true });
        };
    }, [dispatch, isLoggingActivity]);

    return {
        isLoggingActivity,
        isRuckingActive,

        openActivityLog: (type) => {
            vibrate(5);
            setIsLoggingActivity(type);
        },
        closeActivityLog: () => setIsLoggingActivity(null),

        handleSaveRun: (log) => {
            dispatch(thunks.saveCardioLibreLogThunk(log));
            setIsLoggingActivity(null);
        },
        handleSaveHike: (log) => {
            dispatch(thunks.saveSenderismoLogThunk(log));
            setIsLoggingActivity(null);
        },
        handleSaveRucking: (log) => {
            dispatch(thunks.saveRuckingLogThunk(log));
            setIsLoggingActivity(null);
        },

        setIsRuckingActive,
        finishRucking: () => {
            dispatch(actions.updateDailyHabit({ ruckingSessionMet: true }));
            setIsRuckingActive(false);
        },
    };
};
