import {
    AppState,
    LoggedMeal,
    Theme,
    UIState,
} from './types';
import { initialState } from './initialState';
import { dailyGoals as defaultGoals } from './data-misc';
import type { PersistedAppState } from './persistedState';

const isValidTheme = (theme: string | null | undefined): theme is Theme =>
    theme === 'light' || theme === 'dark' || theme === 'system';

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null;

const hydrateActivityDates = (activityDates?: Set<string> | string[]): Set<string> =>
    activityDates instanceof Set
        ? activityDates
        : new Set(Array.isArray(activityDates) ? activityDates : []);

const hydrateLoggedMeals = (loggedMeals?: PersistedAppState['nutrition'] extends { loggedMeals?: infer T } ? T : never): LoggedMeal[] =>
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

const normalizeBodyGoalWeightKg = (value: unknown): number | null => {
    if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
        return null;
    }

    return value;
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
    mergedState.profile.bodyGoalWeightKg = normalizeBodyGoalWeightKg(mergedState.profile.bodyGoalWeightKg);
    mergedState.profile.theme = isValidTheme(persistedTheme) ? persistedTheme : 'system';
    mergedState.session = normalizeSessionState(mergedState.session);
    mergedState.ui = normalizeUiState(mergedState.ui, Boolean(mergedState.session.activeRoutineProgress?.isStarted));

    return mergedState;
};
