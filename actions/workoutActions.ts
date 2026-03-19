import * as actionTypes from './actionTypes';
import { RoutineTask, Exercise, DayOfWeek, TimeOfDay, HistorialDeSesionesEntry } from '../types';

export const addUserRoutine = (payload: Omit<RoutineTask, 'id' | 'isUserCreated'>) => ({ type: actionTypes.ADD_USER_ROUTINE, payload } as const);
export const updateUserRoutine = (payload: RoutineTask) => ({ type: actionTypes.UPDATE_USER_ROUTINE, payload } as const);
export const deleteUserRoutine = (payload: string) => ({ type: actionTypes.DELETE_USER_ROUTINE, payload } as const);
export const addUserExercise = (payload: Omit<Exercise, 'id' | 'isUserCreated'>) => ({ type: actionTypes.ADD_USER_EXERCISE, payload } as const);
export const updateUserExercise = (payload: Exercise) => ({ type: actionTypes.UPDATE_USER_EXERCISE, payload } as const);
export const deleteUserExercise = (payload: string) => ({ type: actionTypes.DELETE_USER_EXERCISE, payload } as const);
export const assignRoutineToDay = (payload: { day: DayOfWeek, time: TimeOfDay, routineId: string | null }) => ({ type: actionTypes.ASSIGN_ROUTINE_TO_DAY, payload } as const);
export const incrementCardioWeek = () => ({ type: actionTypes.INCREMENT_CARDIO_WEEK } as const);
export const addSessionToHistory = (payload: HistorialDeSesionesEntry) => ({ type: actionTypes.ADD_SESSION_TO_HISTORY, payload } as const);
export const generateExerciseImageStart = (payload: string) => ({ type: actionTypes.GENERATE_EXERCISE_IMAGE_START, payload } as const);
export const generateExerciseImageSuccess = (payload: { exerciseId: string, imageUrl: string }) => ({ type: actionTypes.GENERATE_EXERCISE_IMAGE_SUCCESS, payload } as const);
export const generateExerciseImageFailure = (payload: string) => ({ type: actionTypes.GENERATE_EXERCISE_IMAGE_FAILURE, payload } as const);