import { AppState } from '../types';
export const selectProfileState = (state: AppState) => state.profile;
export const selectUserName = (state: AppState) => state.profile.userName;
export const selectDailyGoals = (state: AppState) => state.profile.dailyGoals;
export const selectBodyGoalWeightKg = (state: AppState) => state.profile.bodyGoalWeightKg;
export const selectTheme = (state: AppState) => state.profile.theme;
export const selectCustomMantra = (state: AppState) => state.profile.customMantra;
