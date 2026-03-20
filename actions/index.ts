import type { AppState } from '../types';
import * as uiActions from './uiActions';
import * as profileActions from './profileActions';
import * as progressActions from './progressActions';
import * as nutritionActions from './nutritionActions';
import * as workoutActions from './workoutActions';
import * as sessionActions from './sessionActions';

export * from './uiActions';
export * from './profileActions';
export * from './progressActions';
export * from './nutritionActions';
export * from './workoutActions';
export * from './sessionActions';

type ActionUnion<TModule> = {
    [K in keyof TModule]: TModule[K] extends (...args: unknown[]) => infer TResult ? TResult : never;
}[keyof TModule];

export type AppAction =
    | ActionUnion<typeof uiActions>
    | ActionUnion<typeof profileActions>
    | ActionUnion<typeof progressActions>
    | ActionUnion<typeof nutritionActions>
    | ActionUnion<typeof workoutActions>
    | ActionUnion<typeof sessionActions>
    | { type: 'REPLACE_STATE'; payload: AppState };
