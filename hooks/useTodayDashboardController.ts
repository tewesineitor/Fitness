import { useContext, useMemo } from 'react';
import { AppContext } from '../contexts';
import type { RoutineTask, TimeOfDay, DayOfWeek } from '../types';
import type { FlexibleMacroTarget, FlexibleMacroConsumed } from '../components/ui-premium/useFlexibleMacros';
import * as actions from '../actions';
import { selectUserName, selectDailyGoals, selectCustomMantra } from '../selectors/profileSelectors';
import { selectUserRoutines, selectWeeklySchedule, selectCardioWeek } from '../selectors/workoutSelectors';
import { selectConsumedMacros } from '../selectors/nutritionSelectors';
import { selectSessionState } from '../selectors/sessionSelectors';
import { vibrate } from '../utils/helpers';

// ── Return type ──────────────────────────────────────────────────────────────

export interface TodayDashboardController {
    // Identity & date
    userName: string;
    capitalizedDate: string;
    customMantra: string | undefined;

    // Workout schedule
    primaryTask: RoutineTask | null;
    secondaryTasks: RoutineTask[];
    cardioWeek: number;

    // Nutrition — raw
    consumed: { kcal: number; protein: number; carbs: number; fat: number };
    dailyGoals: { kcal: number; protein: number; carbs: number; fat: number };
    kcalRemaining: number;
    isKcalOver: boolean;

    // Nutrition — NutritionSummaryMini compatible
    nutritionTarget: FlexibleMacroTarget;
    nutritionConsumed: FlexibleMacroConsumed;

    // Task progress
    isTaskDone: (task: RoutineTask) => boolean;
    getTaskProgress: (task: RoutineTask) => number;
    getTaskUniqueId: (task: RoutineTask) => string;

    // Handlers
    onSelectRoutine: (routine: RoutineTask) => void;
    openProfile: () => void;
    openNutrition: () => void;
    openPlanner: () => void;
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export const useTodayDashboardController = (): TodayDashboardController => {
    const { state, dispatch } = useContext(AppContext)!;

    // ── Selectors ────────────────────────────────────────────────────────────
    const userName = selectUserName(state);
    const weeklySchedule = selectWeeklySchedule(state);
    const dailyGoals = selectDailyGoals(state);
    const consumed = selectConsumedMacros(state);
    const session = selectSessionState(state);
    const cardioWeek = selectCardioWeek(state);
    const customMantra = selectCustomMantra(state);
    const userRoutines = selectUserRoutines(state);

    // ── Date ─────────────────────────────────────────────────────────────────
    const todaysDate = useMemo(() => new Date(), []);

    const capitalizedDate = useMemo(() => {
        const s = todaysDate.toLocaleDateString('es-ES', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
        });
        return s.charAt(0).toUpperCase() + s.slice(1);
    }, [todaysDate]);

    // ── Today's tasks ────────────────────────────────────────────────────────
    const tasksToDisplay = useMemo((): RoutineTask[] => {
        const dayNames: DayOfWeek[] = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const dayOfWeek = dayNames[todaysDate.getDay()];
        const scheduledIds = weeklySchedule[dayOfWeek];
        const scheduled: RoutineTask[] = [];

        if (scheduledIds) {
            const timeSlots: TimeOfDay[] = ['Mañana', 'Mediodía', 'Noche'];
            timeSlots.forEach(time => {
                const routineId = scheduledIds[time];
                if (routineId) {
                    const routine = userRoutines.find(r => r.id === routineId);
                    if (routine) scheduled.push({ ...routine, timeOfDay: time });
                }
            });
        }

        const order: Record<TimeOfDay, number> = { 'Mañana': 1, 'Mediodía': 2, 'Noche': 3 };
        const completedTasks = session.dailyProgress.completedTasks;
        return scheduled.sort((a, b) => {
            const aId = `${a.id}-${a.timeOfDay}`;
            const bId = `${b.id}-${b.timeOfDay}`;
            const aDone = completedTasks.includes(aId) ? 1 : 0;
            const bDone = completedTasks.includes(bId) ? 1 : 0;
            if (aDone !== bDone) return aDone - bDone;
            return order[a.timeOfDay] - order[b.timeOfDay];
        });
    }, [weeklySchedule, userRoutines, todaysDate, session]);

    const primaryTask = tasksToDisplay[0] ?? null;
    const secondaryTasks = tasksToDisplay.slice(1);

    // ── Nutrition calculations ───────────────────────────────────────────────
    const isKcalOver = consumed.kcal > dailyGoals.kcal;
    const kcalRemaining = Math.max(0, dailyGoals.kcal - consumed.kcal);

    // FlexibleMacroTarget compatible shape
    const nutritionTarget = useMemo((): FlexibleMacroTarget => ({
        kcal: dailyGoals.kcal || 2000,
        protein: dailyGoals.protein || 150,
        carbMin: Math.round((dailyGoals.carbs || 200) * 0.7),
        carbIdeal: dailyGoals.carbs || 200,
        carbMax: Math.round((dailyGoals.carbs || 200) * 1.3),
        fatMin: Math.round((dailyGoals.fat || 65) * 0.7),
        fatIdeal: dailyGoals.fat || 65,
        fatMax: Math.round((dailyGoals.fat || 65) * 1.3),
    }), [dailyGoals]);

    const nutritionConsumed = useMemo((): FlexibleMacroConsumed => ({
        kcal: consumed.kcal,
        protein: consumed.protein,
        carbs: consumed.carbs,
        fat: consumed.fat,
    }), [consumed]);

    // ── Task helpers ─────────────────────────────────────────────────────────
    const getTaskUniqueId = (task: RoutineTask) => `${task.id}-${task.timeOfDay}`;

    const isTaskDone = (task: RoutineTask) =>
        session.dailyProgress.completedTasks.includes(getTaskUniqueId(task));

    const getTaskProgress = (task: RoutineTask) => {
        const uid = getTaskUniqueId(task);
        if (session.dailyProgress.completedTasks.includes(uid)) return 1;
        if (session.activeRoutineInfo?.id === uid) return session.activeRoutineInfo.progress;
        return 0;
    };

    // ── Handlers ─────────────────────────────────────────────────────────────
    const onSelectRoutine = (routine: RoutineTask) => {
        const uniqueTaskId = getTaskUniqueId(routine);
        vibrate(10);
        if (session.activeRoutineInfo?.id === uniqueTaskId && session.activeRoutineProgress?.isStarted) {
            dispatch(actions.setActiveScreen('RutinaActiva'));
        } else {
            dispatch(actions.startRoutine(routine));
        }
    };

    return {
        userName,
        capitalizedDate,
        customMantra,
        primaryTask,
        secondaryTasks,
        cardioWeek,
        consumed,
        dailyGoals,
        kcalRemaining,
        isKcalOver,
        nutritionTarget,
        nutritionConsumed,
        isTaskDone,
        getTaskProgress,
        getTaskUniqueId,
        onSelectRoutine,
        openProfile: () => dispatch(actions.openProfile()),
        openNutrition: () => dispatch(actions.setActiveScreen('Nutrición')),
        openPlanner: () => {
            dispatch(actions.setNavigationTarget('library-planner'));
            dispatch(actions.setActiveScreen('Biblioteca'));
        },
    };
};
