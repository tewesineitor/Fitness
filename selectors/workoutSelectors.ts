import { AppState } from '../types';
export const selectWorkoutState = (state: AppState) => state.workout;
export const selectUserRoutines = (state: AppState) => state.workout.userRoutines;
export const selectUserExercises = (state: AppState) => state.workout.userExercises;
export const selectWeeklySchedule = (state: AppState) => state.workout.weeklySchedule;
export const selectCardioWeek = (state: AppState) => state.workout.cardioWeek;
export const selectHistorialDeSesiones = (state: AppState) => state.workout.historialDeSesiones;
export const selectAllExercises = (state: AppState) => state.workout.allExercises;
export const selectExerciseImages = (state: AppState) => state.workout.exerciseImages;