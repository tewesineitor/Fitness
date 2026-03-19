import * as actionTypes from './actionTypes';
import { RoutineTask, WorkoutStats, HistorialDeSesionesEntry } from '../types';

export const startRoutine = (payload: RoutineTask) => ({ type: actionTypes.START_ROUTINE, payload } as const);
export const exitRoutine = () => ({ type: actionTypes.EXIT_ROUTINE } as const);
export const pauseRoutine = (payload: { routine: RoutineTask, stats: WorkoutStats, currentStepIndex: number, globalTime: number }) => ({ type: actionTypes.PAUSE_ROUTINE, payload } as const);
export const updateActiveRoutineProgress = (payload: { id: string, progress: number }) => ({ type: actionTypes.UPDATE_ACTIVE_ROUTINE_PROGRESS, payload } as const);
export const setWorkoutSummary = (payload: { historicalEntry: HistorialDeSesionesEntry, newPRs?: string[] } | null) => ({ type: actionTypes.SET_WORKOUT_SUMMARY, payload } as const);
export const closeSummary = () => ({ type: actionTypes.CLOSE_SUMMARY } as const);
export const setCardioLogData = (payload: { routine: RoutineTask, stats: WorkoutStats } | null) => ({ type: actionTypes.SET_CARDIO_LOG_DATA, payload } as const);
export const clearCardioLogData = () => ({ type: actionTypes.CLEAR_CARDIO_LOG_DATA } as const);
export const completeTask = (payload: string) => ({ type: actionTypes.COMPLETE_TASK, payload } as const);
export const uncompleteTask = (payload: string) => ({ type: actionTypes.UNCOMPLETE_TASK, payload } as const);
export const updateDailyHabit = (payload: Partial<import('../types').DailyHabits>) => ({ type: actionTypes.UPDATE_DAILY_HABIT, payload } as const);
export const updateActiveRoutineState = (payload: import('../types').ActiveRoutineProgress) => ({ type: actionTypes.UPDATE_ACTIVE_ROUTINE_STATE, payload } as const);
export const resetDailyProgress = () => ({ type: actionTypes.RESET_DAILY_PROGRESS } as const);