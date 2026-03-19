import * as actionTypes from './actionTypes';
import { DailyGoals, Theme } from '../types';

export const updateProfile = (payload: { name: string; goals: DailyGoals; customMantra: string }) => ({ type: actionTypes.UPDATE_PROFILE, payload } as const);
export const updateTheme = (payload: Theme) => ({ type: actionTypes.UPDATE_THEME, payload } as const);
