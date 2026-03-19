import { ProfileState, Action, Theme } from '../types';
import * as actionTypes from '../actions/actionTypes';
import { dailyGoals as defaultGoals } from '../data';

export const initialProfileState: ProfileState = {
    userName: '',
    dailyGoals: defaultGoals,
    theme: (localStorage.getItem('fitArchitectTheme') as Theme) || 'system',
    customMantra: '',
};

export const profileReducer = (state: ProfileState = initialProfileState, action: Action): ProfileState => {
    switch (action.type) {
        case actionTypes.UPDATE_PROFILE:
            return { ...state, userName: action.payload.name, dailyGoals: action.payload.goals, customMantra: action.payload.customMantra };
        case actionTypes.UPDATE_THEME:
            // The side effect (localStorage) is now handled in AppProvider.tsx
            return { ...state, theme: action.payload };
        default:
            return state;
    }
};