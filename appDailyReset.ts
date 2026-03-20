import { useEffect } from 'react';
import type { AppAction } from './actions';
import * as actions from './actions';
import { ThunkDispatch } from './types';

type DailyResetParams = {
    isInitialized: boolean;
    lastResetDate: string;
    dispatch: ThunkDispatch<AppAction>;
};

export const useDailyProgressReset = ({
    isInitialized,
    lastResetDate,
    dispatch,
}: DailyResetParams) => {
    useEffect(() => {
        if (!isInitialized) return;

        const checkReset = () => {
            const today = new Date().toISOString().split('T')[0];
            if (lastResetDate !== today) {
                dispatch(actions.resetDailyProgress());
            }
        };

        checkReset();

        const interval = setInterval(checkReset, 60000);
        return () => clearInterval(interval);
    }, [isInitialized, lastResetDate, dispatch]);
};
