import { AppState } from '../types';
export const selectSessionState = (state: AppState) => state.session;
export const selectDailyProgress = (state: AppState) => state.session.dailyProgress;
export const selectActiveRoutine = (state: AppState) => state.session.activeRoutine;
export const selectActiveRoutineInfo = (state: AppState) => state.session.activeRoutineInfo;
export const selectWorkoutSummaryData = (state: AppState) => state.session.workoutSummaryData;
export const selectCardioLogData = (state: AppState) => state.session.cardioLogData;