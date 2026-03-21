import type { HistorialDeSesionesEntry, LoggedSet, RoutineStep, RoutineTask } from './workout';

export interface WorkoutStats {
    exercisesCompleted: number;
    duration: number;
    weightLifted: number;
    logs: Record<string, LoggedSet[]>;
    exerciseDurations: Record<string, number>;
}

export interface DailyHabits {
    sleepHours: number;
    stepsGoalMet: boolean;
    ruckingSessionMet: boolean;
}

export interface ActiveRoutineProgress {
    isStarted: boolean;
    currentFlow: RoutineStep[];
    currentStepIndex: number;
    globalTime: number;
    workoutStats: WorkoutStats;
}

export interface SessionState {
    dailyProgress: { completedTasks: string[]; lastResetDate: string };
    dailyHabits: DailyHabits;
    activeRoutine: RoutineTask | null;
    activeRoutineProgress: ActiveRoutineProgress | null;
    pausedRoutine: {
        routine: RoutineTask;
        stats: WorkoutStats;
        currentStepIndex: number;
        globalTime: number;
    } | null;
    activeRoutineInfo: { id: string; progress: number } | null;
    workoutSummaryData: { historicalEntry: HistorialDeSesionesEntry; newPRs?: string[] } | null;
    cardioLogData: { routine: RoutineTask; stats: WorkoutStats } | null;
}
