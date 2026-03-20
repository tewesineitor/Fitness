import {
    AppState,
    LoggedMeal,
    ProgressTracker,
    UIState,
} from './types';

export type PersistedStateOptions = {
    normalizeSyncStatus?: boolean;
};

type PersistedLoggedMeal = Omit<LoggedMeal, 'timestamp'> & {
    timestamp: string | Date;
};

type PersistedProgressTracker = Partial<Omit<ProgressTracker, 'activityDates'>> & {
    activityDates?: Set<string> | string[];
};

export type PersistedAppState = Partial<Omit<AppState, 'ui' | 'profile' | 'progress' | 'workout' | 'nutrition' | 'session'>> & {
    ui?: Partial<UIState> & {
        unlockedAchievements?: unknown;
        achievementToShow?: unknown;
    };
    profile?: Partial<AppState['profile']>;
    progress?: Partial<Omit<AppState['progress'], 'planStartDate' | 'progressTracker'>> & {
        planStartDate?: string | Date | null;
        progressTracker?: PersistedProgressTracker;
    };
    workout?: Partial<AppState['workout']>;
    nutrition?: Partial<Omit<AppState['nutrition'], 'loggedMeals'>> & {
        loggedMeals?: PersistedLoggedMeal[];
    };
    session?: Partial<AppState['session']> & {
        dailyProgress?: Partial<AppState['session']['dailyProgress']>;
        dailyHabits?: Partial<AppState['session']['dailyHabits']>;
    };
    lastUpdated?: number;
};

export const createPersistedStateSnapshot = (
    state: AppState | PersistedAppState,
    options: PersistedStateOptions = {}
): PersistedAppState => {
    const stateToSave = JSON.parse(JSON.stringify(state)) as PersistedAppState;

    if (state.progress?.progressTracker?.activityDates instanceof Set) {
        stateToSave.progress = {
            ...stateToSave.progress,
            progressTracker: {
                ...stateToSave.progress?.progressTracker,
                activityDates: Array.from(state.progress.progressTracker.activityDates),
            },
        };
    }

    if (options.normalizeSyncStatus && stateToSave.ui) {
        stateToSave.ui = {
            ...stateToSave.ui,
            syncStatus: 'synced',
        };
    }

    return stateToSave;
};

export const createPersistedStateSignature = (
    state: AppState | PersistedAppState,
    options: PersistedStateOptions = {}
): string => JSON.stringify(createPersistedStateSnapshot(state, options));
