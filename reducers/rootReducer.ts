import { AppState, Action } from '../types';
import { uiReducer } from './uiReducer';
import { profileReducer } from './profileReducer';
import { progressReducer } from './progressReducer';
import { workoutReducer } from './workoutReducer';
import { nutritionReducer } from './nutritionReducer';
import { sessionReducer } from './sessionReducer';

export const rootReducer = (state: AppState, action: Action | { type: 'REPLACE_STATE', payload: AppState }): AppState => {
    if (action.type === 'REPLACE_STATE') {
        return action.payload;
    }
    
    return {
        ui: uiReducer(state.ui, action as Action),
        profile: profileReducer(state.profile, action as Action),
        progress: progressReducer(state.progress, action as Action),
        workout: workoutReducer(state.workout, action as Action),
        nutrition: nutritionReducer(state.nutrition, action as Action),
        session: sessionReducer(state.session, action as Action),
    };
};