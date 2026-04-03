import { useContext, useState, useMemo } from 'react';
import { AppContext } from '../../../contexts';
import type { RoutineTask, TimeOfDay, DesgloseCardioLibre, DayOfWeek, ProgressState, WorkoutState } from '../../../types';
import * as actions from '../../../actions';
import * as thunks from '../../../thunks';
import { selectUserName, selectDailyGoals, selectCustomMantra } from '../../../selectors/profileSelectors';
import { selectUserRoutines, selectWeeklySchedule, selectCardioWeek } from '../../../selectors/workoutSelectors';
import { selectConsumedMacros } from '../../../selectors/nutritionSelectors';
import { selectSessionState } from '../../../selectors/sessionSelectors';
import { selectProgressState } from '../../../selectors/progressSelectors';
import { vibrate } from '../../../utils/helpers';

// ── Habit status type ────────────────────────────────────────────────────────

export type HabitStatus = 'success' | 'warning' | 'danger' | 'neutral';

export interface HabitStatuses {
    protein:  HabitStatus;
    calories: HabitStatus;
    sleep:    HabitStatus;
    steps:    HabitStatus;
    allMet:   boolean;
}

// ── Hook return type ─────────────────────────────────────────────────────────

export interface HoyLogic {
    // identity & date
    userName:       string;
    capitalizedDate: string;
    customMantra:   string | undefined;

    // schedule
    tasksToDisplay: RoutineTask[];
    cardioWeek:     number;

    // nutrition
    consumed:       { kcal: number; protein: number; carbs: number; fat: number };
    dailyGoals:     { kcal: number; protein: number; carbs: number; fat: number };
    kcalPct:        number;
    kcalRemaining:  number;
    isKcalOver:     boolean;

    // session & progress
    session:         ReturnType<typeof selectSessionState>;
    progress:        ProgressState;
    weeklySchedule:  WorkoutState['weeklySchedule'];

    // habits
    habitStatuses:   HabitStatuses;

    // ui state
    isLoggingActivity: 'run' | 'hike' | 'rucking' | null;
    isRuckingActive:   boolean;

    // handlers — routines
    onSelectRoutine:   (routine: RoutineTask) => void;

    // handlers — cardio logging
    handleSaveRun:     (log: DesgloseCardioLibre) => void;
    handleSaveHike:    (log: DesgloseCardioLibre) => void;
    handleSaveRucking: (log: DesgloseCardioLibre) => void;
    openActivityLog:   (type: 'run' | 'hike' | 'rucking') => void;
    closeActivityLog:  () => void;

    // handlers — rucking session
    setIsRuckingActive: (v: boolean) => void;
    finishRucking:      () => void;

    // handlers — habits
    onToggleSleep:  () => void;
    onToggleSteps:  () => void;

    // handlers — navigation
    openProfile:   () => void;
    openNutrition: () => void;
    openPlanner:   () => void;
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export const useHoyLogic = (): HoyLogic => {
    const { state, dispatch } = useContext(AppContext)!;

    // ── Selectors ──────────────────────────────────────────────────────────────
    const userName       = selectUserName(state);
    const weeklySchedule = selectWeeklySchedule(state);
    const dailyGoals     = selectDailyGoals(state);
    const consumed       = selectConsumedMacros(state);
    const session        = selectSessionState(state);
    const cardioWeek     = selectCardioWeek(state);
    const customMantra   = selectCustomMantra(state);
    const progress       = selectProgressState(state);
    const userRoutines   = selectUserRoutines(state);

    // ── Local UI state ─────────────────────────────────────────────────────────
    const [isLoggingActivity, setIsLoggingActivity] = useState<'run' | 'hike' | 'rucking' | null>(null);
    const [isRuckingActive,   setIsRuckingActive]   = useState(false);

    // ── Date ───────────────────────────────────────────────────────────────────
    const todaysDate = useMemo(() => new Date(), []);

    const capitalizedDate = useMemo(() => {
        const s = todaysDate.toLocaleDateString('es-ES', {
            weekday: 'long',
            day:     'numeric',
            month:   'long',
        });
        return s.charAt(0).toUpperCase() + s.slice(1);
    }, [todaysDate]);

    // ── Today's tasks ──────────────────────────────────────────────────────────
    const tasksToDisplay = useMemo((): RoutineTask[] => {
        const dayNames: DayOfWeek[] = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const dayOfWeek    = dayNames[todaysDate.getDay()];
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

    // ── Nutrition calculations ─────────────────────────────────────────────────
    const kcalPct       = dailyGoals.kcal > 0 ? Math.min((consumed.kcal / dailyGoals.kcal) * 100, 100) : 0;
    const isKcalOver    = consumed.kcal > dailyGoals.kcal;
    const kcalRemaining = Math.max(0, dailyGoals.kcal - consumed.kcal);

    // ── Habit statuses ─────────────────────────────────────────────────────────
    const habits = session.dailyHabits || { sleepHours: 0, stepsGoalMet: false, ruckingSessionMet: false };

    const habitStatuses = useMemo((): HabitStatuses => {
        const proteinGoal  = dailyGoals.protein || 150;
        const calorieLimit = dailyGoals.kcal    || 2000;

        const protein:  HabitStatus = consumed.protein >= proteinGoal * 0.9 ? 'success' : 'neutral';
        const calories: HabitStatus = consumed.kcal === 0
            ? 'neutral'
            : consumed.kcal > calorieLimit
                ? 'danger'
                : consumed.kcal >= calorieLimit * 0.9 ? 'success' : 'neutral';
        const sleep:    HabitStatus = habits.sleepHours >= 7 ? 'success' : 'neutral';
        const steps:    HabitStatus = (habits.stepsGoalMet || habits.ruckingSessionMet) ? 'success' : 'neutral';
        const allMet = protein === 'success' && calories === 'success' && sleep === 'success' && steps === 'success';

        return { protein, calories, sleep, steps, allMet };
    }, [consumed, dailyGoals, habits]);

    // ── Handlers ───────────────────────────────────────────────────────────────
    const onSelectRoutine = (routine: RoutineTask) => {
        const uniqueTaskId = `${routine.id}-${routine.timeOfDay}`;
        vibrate(10);
        if (session.activeRoutineInfo?.id === uniqueTaskId && session.activeRoutineProgress?.isStarted) {
            dispatch(actions.setActiveScreen('RutinaActiva'));
        } else {
            dispatch(actions.startRoutine(routine));
        }
    };

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

    return {
        userName,
        capitalizedDate,
        customMantra,
        tasksToDisplay,
        cardioWeek,
        consumed,
        dailyGoals,
        kcalPct,
        kcalRemaining,
        isKcalOver,
        session,
        progress,
        weeklySchedule,
        habitStatuses,
        isLoggingActivity,
        isRuckingActive,
        onSelectRoutine,
        handleSaveRun:     (log) => { dispatch(thunks.saveCardioLibreLogThunk(log));  setIsLoggingActivity(null); },
        handleSaveHike:    (log) => { dispatch(thunks.saveSenderismoLogThunk(log));   setIsLoggingActivity(null); },
        handleSaveRucking: (log) => { dispatch(thunks.saveRuckingLogThunk(log));      setIsLoggingActivity(null); },
        openActivityLog:   (type) => { vibrate(5); setIsLoggingActivity(type); },
        closeActivityLog:  ()     => setIsLoggingActivity(null),
        setIsRuckingActive,
        finishRucking: () => {
            dispatch(actions.updateDailyHabit({ ruckingSessionMet: true }));
            setIsRuckingActive(false);
        },
        onToggleSleep,
        onToggleSteps,
        openProfile:   () => dispatch(actions.openProfile()),
        openNutrition: () => dispatch(actions.setActiveScreen('Nutrición')),
        openPlanner:   () => {
            dispatch(actions.setNavigationTarget('library-planner'));
            dispatch(actions.setActiveScreen('Biblioteca'));
        },
    };
};

