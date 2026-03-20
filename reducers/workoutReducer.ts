import { WorkoutState, DayOfWeek, TimeOfDay, Exercise, RoutineTask, HistorialDeSesionesEntry, DesgloseFuerza, DesgloseCardioLibre } from '../types';
import type { AppAction } from '../actions';
import * as actionTypes from '../actions/actionTypes';

export const initialWorkoutState: WorkoutState = {
    userRoutines: [],
    userExercises: [],
    weeklySchedule: {
        Lunes: { Mañana: 'default-torso' },
        Martes: { Mañana: 'default-pierna' },
        Jueves: { Mañana: 'default-torso-2' },
        Viernes: { Mañana: 'default-pierna-2' },
    },
    cardioWeek: 1,
    historialDeSesiones: [],
    allExercises: {},
    exerciseImages: {},
};

export const workoutReducer = (state: WorkoutState = initialWorkoutState, action: AppAction): WorkoutState => {
    switch(action.type) {
        case actionTypes.ADD_USER_ROUTINE: {
            const newRoutine: RoutineTask = { ...action.payload, id: `user-routine-${Date.now()}`, isUserCreated: true };
            return { ...state, userRoutines: [...state.userRoutines, newRoutine] };
        }
        case actionTypes.UPDATE_USER_ROUTINE: {
            const updatedRoutines = state.userRoutines.map(r => r.id === action.payload.id ? action.payload : r);
            return { ...state, userRoutines: updatedRoutines };
        }
        case actionTypes.DELETE_USER_ROUTINE: {
            const routineId = action.payload;
            const filteredRoutines = state.userRoutines.filter(r => r.id !== routineId);
            const cleanedSchedule = Object.entries(state.weeklySchedule).reduce((scheduleAcc, [day, daySchedule]) => {
                const filteredDaySchedule = Object.entries(daySchedule || {}).reduce((dayAcc, [time, scheduledRoutineId]) => {
                    if (scheduledRoutineId !== routineId) {
                        dayAcc[time] = scheduledRoutineId;
                    }
                    return dayAcc;
                }, {} as Record<string, string>);

                if (Object.keys(filteredDaySchedule).length > 0) {
                    scheduleAcc[day] = filteredDaySchedule;
                }

                return scheduleAcc;
            }, {} as Record<string, Record<string, string>>);

            return { ...state, userRoutines: filteredRoutines, weeklySchedule: cleanedSchedule };
        }
        case actionTypes.ADD_USER_EXERCISE: {
             const newExercise: Exercise = { ...action.payload, id: `user-exercise-${Date.now()}`, isUserCreated: true, };
             const newUserExercises = [...state.userExercises, newExercise];
             const newAllExercises = { ...state.allExercises, [newExercise.id]: newExercise };
             return { ...state, userExercises: newUserExercises, allExercises: newAllExercises };
        }
        case actionTypes.UPDATE_USER_EXERCISE: {
            const newUserExercises = state.userExercises.map(ex => ex.id === action.payload.id ? action.payload : ex);
            const newAllExercises = { ...state.allExercises, [action.payload.id]: action.payload };
            return { ...state, userExercises: newUserExercises, allExercises: newAllExercises };
        }
        case actionTypes.DELETE_USER_EXERCISE: {
            const newUserExercises = state.userExercises.filter(ex => ex.id !== action.payload);
            const newAllExercises = { ...state.allExercises };
            delete newAllExercises[action.payload];
            return { ...state, userExercises: newUserExercises, allExercises: newAllExercises };
        }
        case actionTypes.ASSIGN_ROUTINE_TO_DAY: {
            const { day, time, routineId } = action.payload;
            const newSchedule = { ...state.weeklySchedule };
            if (!newSchedule[day]) newSchedule[day] = {};
            const daySchedule = { ...newSchedule[day] };
            if (routineId) daySchedule[time] = routineId;
            else delete daySchedule[time];
            newSchedule[day] = daySchedule;
            if (Object.keys(newSchedule[day]!).length === 0) delete newSchedule[day];
            return { ...state, weeklySchedule: newSchedule };
        }
        case actionTypes.INCREMENT_CARDIO_WEEK: {
             const newWeek = Math.min(state.cardioWeek + 1, 8);
             return { ...state, cardioWeek: newWeek };
        }
        case actionTypes.ADD_SESSION_TO_HISTORY: {
            const newHistory = [action.payload, ...state.historialDeSesiones].sort((a, b) => new Date(b.fecha_completado).getTime() - new Date(a.fecha_completado).getTime());
            return { ...state, historialDeSesiones: newHistory };
        }
        case actionTypes.GENERATE_EXERCISE_IMAGE_START:
            return { ...state, exerciseImages: { ...state.exerciseImages, [action.payload]: 'generating' } };
        case actionTypes.GENERATE_EXERCISE_IMAGE_SUCCESS:
            return { ...state, exerciseImages: { ...state.exerciseImages, [action.payload.exerciseId]: action.payload.imageUrl } };
        case actionTypes.GENERATE_EXERCISE_IMAGE_FAILURE:
            return { ...state, exerciseImages: { ...state.exerciseImages, [action.payload]: 'failed' } };
        default:
            return state;
    }
};
