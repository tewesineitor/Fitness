import { AppState, ReplaceStateAction } from '../types';
import type { AppAction } from '../actions';
import { uiReducer } from './uiReducer';
import { profileReducer } from './profileReducer';
import { progressReducer } from './progressReducer';
import { workoutReducer } from './workoutReducer';
import { nutritionReducer } from './nutritionReducer';
import { sessionReducer } from './sessionReducer';

export const rootReducer = (state: AppState, action: AppAction | ReplaceStateAction): AppState => {
    if (action.type === 'REPLACE_STATE') {
        return action.payload;
    }
    
    return {
        ui: uiReducer(state.ui, action),
        profile: profileReducer(state.profile, action),
        progress: progressReducer(state.progress, action),
        workout: workoutReducer(state.workout, action),
        nutrition: nutritionReducer(state.nutrition, action),
        session: sessionReducer(state.session, action),
    };
};
