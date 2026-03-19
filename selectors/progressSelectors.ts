import { AppState } from '../types';
export const selectProgressState = (state: AppState) => state.progress;
export const selectMetricHistory = (state: AppState) => state.progress.metricHistory;
export const selectPlanStartDate = (state: AppState) => state.progress.planStartDate;
export const selectProgressTracker = (state: AppState) => state.progress.progressTracker;