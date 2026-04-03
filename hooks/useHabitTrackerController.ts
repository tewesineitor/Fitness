import { useContext, useMemo } from 'react';
import { AppContext } from '../contexts';
import type { DailyMetric } from '../components/ui-premium/NonNegotiableCard';
import type { DailyStreak } from '../components/ui-premium/WeeklyStreakTracker';
import * as actions from '../actions';
import { selectDailyGoals } from '../selectors/profileSelectors';
import { selectConsumedMacros } from '../selectors/nutritionSelectors';
import { selectSessionState } from '../selectors/sessionSelectors';
import { selectProgressState } from '../selectors/progressSelectors';
import { vibrate } from '../utils/helpers';

// ── Types ────────────────────────────────────────────────────────────────────

export type HabitStatus = 'success' | 'warning' | 'danger' | 'neutral';

export interface HabitTrackerController {
    // Habit statuses
    habitStatuses: {
        protein: HabitStatus;
        calories: HabitStatus;
        sleep: HabitStatus;
        steps: HabitStatus;
        allMet: boolean;
    };
    metToday: number;

    // Weekly streak — WeeklyStreakTracker compatible
    weeklyDays: DailyStreak[];

    // NonNegotiableCard compatible metrics
    nonNegotiables: DailyMetric[];

    // Handlers
    onToggleSleep: () => void;
    onToggleSteps: () => void;
    onValueChange: (id: string, newValue: number) => void;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const toLocalDateStr = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const DAY_INITIALS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

// ── Hook ─────────────────────────────────────────────────────────────────────

export const useHabitTrackerController = (): HabitTrackerController => {
    const { state, dispatch } = useContext(AppContext)!;

    const dailyGoals = selectDailyGoals(state);
    const consumed = selectConsumedMacros(state);
    const session = selectSessionState(state);
    const progress = selectProgressState(state);

    const habits = session.dailyHabits || { sleepHours: 0, stepsGoalMet: false, ruckingSessionMet: false };

    // ── Habit statuses ───────────────────────────────────────────────────────
    const habitStatuses = useMemo(() => {
        const proteinGoal = dailyGoals.protein || 150;
        const calorieLimit = dailyGoals.kcal || 2000;

        const protein: HabitStatus = consumed.protein >= proteinGoal * 0.9 ? 'success' : 'neutral';
        const calories: HabitStatus = consumed.kcal === 0
            ? 'neutral'
            : consumed.kcal > calorieLimit
                ? 'danger'
                : consumed.kcal >= calorieLimit * 0.9 ? 'success' : 'neutral';
        const sleep: HabitStatus = habits.sleepHours >= 7 ? 'success' : 'neutral';
        const steps: HabitStatus = (habits.stepsGoalMet || habits.ruckingSessionMet) ? 'success' : 'neutral';
        const allMet = protein === 'success' && calories === 'success' && sleep === 'success' && steps === 'success';

        return { protein, calories, sleep, steps, allMet };
    }, [consumed, dailyGoals, habits]);

    const metToday = useMemo(() =>
        [habitStatuses.protein, habitStatuses.calories, habitStatuses.sleep, habitStatuses.steps]
            .filter(s => s === 'success').length,
        [habitStatuses],
    );

    // ── Weekly streak for WeeklyStreakTracker ─────────────────────────────────
    const weeklyDays = useMemo((): DailyStreak[] => {
        const today = new Date();
        const todayStr = toLocalDateStr(today);
        const start = new Date(today);
        start.setDate(today.getDate() - ((today.getDay() + 6) % 7)); // Monday

        const activityDatesRaw = progress.progressTracker.activityDates;
        const activitySet = new Set(
            activityDatesRaw instanceof Set ? [...activityDatesRaw] : (activityDatesRaw as string[]),
        );

        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            const ds = toLocalDateStr(d);
            const isToday = ds === todayStr;
            const isFuture = ds > todayStr;

            let status: DailyStreak['status'];
            if (isFuture) {
                status = 'pending';
            } else if (isToday) {
                status = metToday >= 4 ? 'completed' : 'pending';
            } else {
                status = activitySet.has(ds) ? 'completed' : 'failed';
            }

            return {
                date: ds,
                dayInitial: DAY_INITIALS[i],
                dayNumber: d.getDate(),
                isToday,
                status,
            };
        });
    }, [progress, metToday]);

    // ── NonNegotiableCard metrics ─────────────────────────────────────────────
    const nonNegotiables = useMemo((): DailyMetric[] => [
        {
            id: 'protein',
            label: 'Proteína',
            currentValue: Math.round(consumed.protein),
            targetValue: dailyGoals.protein || 150,
            unit: 'g',
            isAutomated: true,
            toleranceThreshold: 0.9,
        },
        {
            id: 'calories',
            label: 'Calorías',
            currentValue: Math.round(consumed.kcal),
            targetValue: dailyGoals.kcal || 2000,
            unit: 'k',
            isAutomated: true,
            toleranceThreshold: 0.9,
        },
        {
            id: 'sleep',
            label: 'Sueño',
            currentValue: habits.sleepHours || 0,
            targetValue: 7,
            unit: 'h',
            isAutomated: false,
            toleranceThreshold: 1.0,
        },
        {
            id: 'steps',
            label: 'Pasos',
            currentValue: (habits.stepsGoalMet || habits.ruckingSessionMet) ? 10000 : 0,
            targetValue: 10000,
            unit: '',
            isAutomated: false,
            toleranceThreshold: 0.8,
        },
    ], [consumed, dailyGoals, habits]);

    // ── Handlers ─────────────────────────────────────────────────────────────
    const onToggleSleep = () => {
        vibrate(10);
        const raw = window.prompt('¿Cuántas horas dormiste?', String(habits.sleepHours || 8));
        if (raw === null) return;
        const hours = parseFloat(raw.replace(',', '.'));
        if (!isNaN(hours) && hours >= 0) {
            dispatch(actions.updateDailyHabit({ sleepHours: Math.min(hours, 24) }));
        }
    };

    const onToggleSteps = () => {
        vibrate(10);
        const raw = window.prompt('¿Cuántos pasos diste hoy?', habits.stepsGoalMet ? '10000' : '0');
        if (raw === null) return;
        const steps = parseInt(raw, 10);
        if (!isNaN(steps) && steps >= 0) {
            dispatch(actions.updateDailyHabit({ stepsGoalMet: steps >= 8000 }));
        }
    };

    const onValueChange = (id: string, newValue: number) => {
        if (id === 'sleep') {
            dispatch(actions.updateDailyHabit({ sleepHours: Math.min(newValue, 24) }));
        } else if (id === 'steps') {
            dispatch(actions.updateDailyHabit({ stepsGoalMet: newValue >= 8000 }));
        }
    };

    return {
        habitStatuses,
        metToday,
        weeklyDays,
        nonNegotiables,
        onToggleSleep,
        onToggleSteps,
        onValueChange,
    };
};
