import { AppState } from './types';
import { initialUIState } from './reducers/uiReducer';
import { initialProfileState } from './reducers/profileReducer';
import { initialProgressState } from './reducers/progressReducer';
import { initialWorkoutState } from './reducers/workoutReducer';
import { initialNutritionState } from './reducers/nutritionReducer';
import { initialSessionState } from './reducers/sessionReducer';

export const initialState: AppState = {
    ui: initialUIState,
    profile: initialProfileState,
    progress: initialProgressState,
    workout: initialWorkoutState,
    nutrition: initialNutritionState,
    session: initialSessionState,
};