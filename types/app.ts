import type { NutritionState } from './nutrition';
import type { ProfileState } from './profile';
import type { ProgressState } from './progress';
import type { SessionState } from './session';
import type { UIState } from './ui';
import type { WorkoutState } from './workout';

export interface AppState {
    ui: UIState;
    profile: ProfileState;
    progress: ProgressState;
    workout: WorkoutState;
    nutrition: NutritionState;
    session: SessionState;
    lastUpdated?: number;
}

export interface Action {
    type: string;
    payload?: unknown;
}

export interface ReplaceStateAction {
    type: 'REPLACE_STATE';
    payload: AppState;
}

export type ThunkAction<ReturnType = void> = (
    dispatch: ThunkDispatch,
    getState: () => AppState
) => ReturnType;

export type ThunkDispatch<ActionType extends Action = Action> = <ReturnType = void>(
    action: ActionType | ThunkAction<ReturnType>
) => ReturnType;
