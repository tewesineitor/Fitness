import { ProfileState, Theme } from '../types';
import type { AppAction } from '../actions';
import * as actionTypes from '../actions/actionTypes';
import { dailyGoals as defaultGoals } from '../data-misc';

export const initialProfileState: ProfileState = {
    userName: '',
    dailyGoals: defaultGoals,
    bodyGoalWeightKg: null,
    theme: (localStorage.getItem('fitArchitectTheme') as Theme) || 'system',
    customMantra: '',
};

export const profileReducer = (state: ProfileState = initialProfileState, action: AppAction): ProfileState => {
    switch (action.type) {
        case actionTypes.UPDATE_PROFILE:
            return {
                ...state,
                userName: action.payload.name,
                dailyGoals: action.payload.goals,
                customMantra: action.payload.customMantra,
                bodyGoalWeightKg: action.payload.bodyGoalWeightKg,
            };
        case actionTypes.UPDATE_THEME:
            return { ...state, theme: action.payload };
        default:
            return state;
    }
};
