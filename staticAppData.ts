import {
    AppState,
    Exercise,
    FoodItem,
    Recipe,
    RoutineTask,
} from './types';

export type StaticDataBundle = {
    exercises: Record<string, Exercise>;
    routines: RoutineTask[];
    foods: FoodItem[];
    recipes: Recipe[];
};

export const mergeStaticAppData = (
    state: AppState,
    staticData: StaticDataBundle
): AppState => ({
    ...state,
    workout: {
        ...state.workout,
        allExercises: {
            ...staticData.exercises,
            ...state.workout.allExercises,
        },
        userRoutines: [
            ...staticData.routines,
            ...state.workout.userRoutines.filter((routine) => routine.isUserCreated),
        ],
    },
    nutrition: {
        ...state.nutrition,
        allFoods: staticData.foods,
        allRecipes: staticData.recipes,
    },
});
