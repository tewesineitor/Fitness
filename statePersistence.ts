import {
    AppState,
    Exercise,
    FoodItem,
    HistorialDeMetricasEntry,
    LoggedMeal,
    ProgressTracker,
    Recipe,
    RoutineTask,
    Theme,
    UIState,
} from './types';
import { initialState } from './initialState';
import { dailyGoals as defaultGoals } from './data-misc';

type StaticDataBundle = {
    exercises: Record<string, Exercise>;
    routines: RoutineTask[];
    foods: FoodItem[];
    recipes: Recipe[];
};

export type PersistedStateOptions = {
    normalizeSyncStatus?: boolean;
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

const createStorageKey = (userId?: string) => (userId ? `fitArchitectState_${userId}` : 'fitArchitectState');

const isValidTheme = (theme: string | null | undefined): theme is Theme =>
    theme === 'light' || theme === 'dark' || theme === 'system';

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null;

const isQuotaExceededError = (error: unknown): error is { name?: string; code?: number } =>
    isRecord(error) && (
        error.name === 'QuotaExceededError' ||
        error.code === 22
    );

const hydrateActivityDates = (activityDates?: Set<string> | string[]): Set<string> =>
    activityDates instanceof Set
        ? activityDates
        : new Set(Array.isArray(activityDates) ? activityDates : []);

const hydrateLoggedMeals = (loggedMeals?: PersistedLoggedMeal[]): LoggedMeal[] =>
    (loggedMeals ?? []).map((meal) => ({
        ...meal,
        timestamp: meal.timestamp instanceof Date ? meal.timestamp : new Date(meal.timestamp),
    }));

const migrateDailyGoals = (goals: AppState['profile']['dailyGoals']): AppState['profile']['dailyGoals'] => {
    if (
        (goals.kcal === 1950 && goals.protein === 150 && goals.carbs === 191 && goals.fat === 65) ||
        goals.fatMin === undefined
    ) {
        return { ...defaultGoals };
    }

    return goals;
};

const stripLegacyUiFields = (ui?: PersistedAppState['ui']): Partial<UIState> => {
    if (!ui) {
        return {};
    }

    const {
        unlockedAchievements: _legacyUnlockedAchievements,
        achievementToShow: _legacyAchievementToShow,
        ...cleanUi
    } = ui;

    return cleanUi;
};

const normalizeUiState = (ui: UIState, hasStartedRoutine: boolean): UIState => ({
    ...ui,
    activeScreen: hasStartedRoutine ? 'RutinaActiva' : 'Hoy',
    isBottomNavVisible: !hasStartedRoutine,
    isModalOpen: false,
    isProfileOpen: false,
});

const normalizeSessionState = (session: AppState['session']): AppState['session'] => {
    const today = new Date().toISOString().split('T')[0];
    const needsDailyReset = session.dailyProgress.lastResetDate !== today;

    return {
        ...session,
        workoutSummaryData: null,
        cardioLogData: null,
        dailyProgress: needsDailyReset
            ? { completedTasks: [], lastResetDate: today }
            : session.dailyProgress,
        dailyHabits: needsDailyReset
            ? { sleepHours: 0, stepsGoalMet: false, ruckingSessionMet: false }
            : session.dailyHabits,
    };
};

const stripPhotoUrlsFromMetricHistory = (metricHistory: HistorialDeMetricasEntry[]): HistorialDeMetricasEntry[] =>
    metricHistory.map(({ url_foto, ...entry }) => entry);

export const hydratePersistedState = (parsedState: unknown, themeOverride?: string | null): AppState => {
    if (!isRecord(parsedState)) {
        return initialState;
    }

    const persistedState = parsedState as PersistedAppState;
    const mergedState: AppState = {
        ...initialState,
        ...persistedState,
        ui: {
            ...initialState.ui,
            ...stripLegacyUiFields(persistedState.ui),
        },
        profile: {
            ...initialState.profile,
            ...persistedState.profile,
        },
        progress: {
            ...initialState.progress,
            ...persistedState.progress,
            planStartDate: persistedState.progress?.planStartDate
                ? new Date(persistedState.progress.planStartDate)
                : initialState.progress.planStartDate,
            progressTracker: {
                ...initialState.progress.progressTracker,
                ...persistedState.progress?.progressTracker,
                activityDates: hydrateActivityDates(persistedState.progress?.progressTracker?.activityDates),
                personalRecords: {
                    ...initialState.progress.progressTracker.personalRecords,
                    ...(persistedState.progress?.progressTracker?.personalRecords ?? {}),
                },
            },
        },
        workout: {
            ...initialState.workout,
            ...persistedState.workout,
            weeklySchedule: {
                ...initialState.workout.weeklySchedule,
                ...(persistedState.workout?.weeklySchedule ?? {}),
            },
            allExercises: {
                ...initialState.workout.allExercises,
                ...(persistedState.workout?.allExercises ?? {}),
            },
            exerciseImages: {
                ...initialState.workout.exerciseImages,
                ...(persistedState.workout?.exerciseImages ?? {}),
            },
        },
        nutrition: {
            ...initialState.nutrition,
            ...persistedState.nutrition,
            consumedMacros: {
                ...initialState.nutrition.consumedMacros,
                ...(persistedState.nutrition?.consumedMacros ?? {}),
            },
            loggedMeals: hydrateLoggedMeals(persistedState.nutrition?.loggedMeals),
        },
        session: {
            ...initialState.session,
            ...persistedState.session,
            dailyProgress: {
                ...initialState.session.dailyProgress,
                ...(persistedState.session?.dailyProgress ?? {}),
            },
            dailyHabits: {
                ...initialState.session.dailyHabits,
                ...(persistedState.session?.dailyHabits ?? {}),
            },
        },
    };

    const persistedTheme = themeOverride ?? mergedState.profile.theme;
    mergedState.profile.dailyGoals = migrateDailyGoals(mergedState.profile.dailyGoals);
    mergedState.profile.theme = isValidTheme(persistedTheme) ? persistedTheme : 'system';
    mergedState.session = normalizeSessionState(mergedState.session);
    mergedState.ui = normalizeUiState(mergedState.ui, Boolean(mergedState.session.activeRoutineProgress?.isStarted));

    return mergedState;
};

export const loadStateFromStorage = (userId?: string, themeOverride?: string | null): AppState | undefined => {
    try {
        const serializedState = localStorage.getItem(createStorageKey(userId));
        if (serializedState === null) {
            return undefined;
        }

        const parsedState = JSON.parse(serializedState);
        return hydratePersistedState(parsedState, themeOverride);
    } catch (error) {
        console.error('Could not load state from localStorage', error);
        return undefined;
    }
};

export const saveStateToStorage = (state: AppState | PersistedAppState, userId?: string) => {
    try {
        const key = createStorageKey(userId);
        const stateToSave = createPersistedStateSnapshot(state, { normalizeSyncStatus: true });
        stateToSave.lastUpdated = Date.now();

        localStorage.setItem(key, JSON.stringify(stateToSave));
    } catch (error: unknown) {
        if (isQuotaExceededError(error)) {
            console.error('LocalStorage Quota Exceeded! Removing images to save critical data.');
            try {
                const key = createStorageKey(userId);
                const stateWithoutPhotos = createPersistedStateSnapshot(state, { normalizeSyncStatus: true });
                if (stateWithoutPhotos.progress) {
                    stateWithoutPhotos.progress.metricHistory = stripPhotoUrlsFromMetricHistory(stateWithoutPhotos.progress.metricHistory);
                }

                localStorage.setItem(key, JSON.stringify(stateWithoutPhotos));
                alert('Alerta de almacenamiento: tu navegador esta lleno. Las fotos nuevas no se guardaran, pero tu progreso numerico si.');
            } catch (retryError) {
                console.error('Critical Storage Failure', retryError);
            }
        } else {
            console.error('Could not save state to localStorage', error);
        }
    }
};

export const mergeStaticAppData = (
    state: AppState,
    staticData: StaticDataBundle
): AppState => ({
    ...state,
    workout: {
        ...state.workout,
        allExercises: {
            ...staticData.exercises,
            ...state.workout.allExercises,
        },
        userRoutines: [
            ...staticData.routines,
            ...state.workout.userRoutines.filter((routine) => routine.isUserCreated),
        ],
    },
    nutrition: {
        ...state.nutrition,
        allFoods: staticData.foods,
        allRecipes: staticData.recipes,
    },
});
