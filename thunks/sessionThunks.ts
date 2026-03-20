
import { ThunkAction, RoutineTask, WorkoutStats, DesgloseEjercicio, DesgloseFuerza, HistorialDeSesionesEntry, DesgloseTiempo, DesgloseCardioLibre } from '../types';
import * as actions from '../actions';
import * as thunks from '../thunks';
import { selectAllExercises } from '../selectors/workoutSelectors';
import { selectProgressTracker } from '../selectors/progressSelectors';
import { selectCardioLogData } from '../selectors/sessionSelectors';

const calculateE1RM = (weight: number, reps: number) => weight * (1 + reps / 30);

export const finishRoutineThunk = (routine: RoutineTask, stats: WorkoutStats): ThunkAction => (dispatch, getState) => {
    const state = getState();

    if (routine.type === 'cardio') {
        dispatch(actions.setCardioLogData({ routine, stats }));
        dispatch(actions.exitRoutine());
        return;
    }

    const allExercises = selectAllExercises(state);
    const progressTracker = selectProgressTracker(state);

    const loggedExerciseIds = new Set([
        ...Object.keys(stats.logs),
        ...Object.keys(stats.exerciseDurations)
    ]);

    const desglose_ejercicios: DesgloseEjercicio[] = Array.from(loggedExerciseIds).map(key => {
        const exercise = allExercises[key];

        if (stats.logs[key]) { // It's a strength exercise
            return {
                exerciseId: key,
                nombre_ejercicio: exercise?.name || 'Ejercicio Desconocido',
                duracion_ejercicio_seg: stats.exerciseDurations?.[key] || 0,
                sets: stats.logs[key].map((set, index) => ({
                    serie: index + 1,
                    weight: set.weight || 0,
                    reps: set.reps || 0,
                })),
            } as DesgloseFuerza;
        }
        
        if (stats.exerciseDurations[key]) { // It's a timed exercise
            const name = exercise?.name || key; // Fallback to key for meditation titles
            return {
                nombre_ejercicio: name,
                duracion_completada_seg: stats.exerciseDurations[key],
            } as DesgloseTiempo;
        }
        
        return null;
        // FIX: The type predicate `(item): item is DesgloseEjercicio` was incorrect because the type `DesgloseEjercicio` is not assignable to the inferred type of `item` which is `DesgloseFuerza | DesgloseTiempo | null`. Replaced with a simple boolean check to let TypeScript correctly infer the filtered type.
    }).filter(item => item !== null);


    const newHistoryEntry: HistorialDeSesionesEntry = {
        id_sesion: `session-${Date.now()}`,
        nombre_rutina: routine.name,
        tipo_rutina: routine.type,
        fecha_completado: new Date().toISOString(),
        duracion_total_min: Math.round(stats.duration / 60),
        desglose_ejercicios,
    };

    const newPRs: string[] = [];
    if (newHistoryEntry.tipo_rutina === 'strength') {
        // FIX: The original type predicate `(ex): ex is DesgloseFuerza` combined with a complex condition was causing a TypeScript compiler error due to incorrect type inference. The fix is to use a simpler boolean check within the filter and then apply a type assertion `as DesgloseFuerza[]` to the result. This is a clean, safe, and common pattern to handle this scenario without resorting to `any`.
        const strengthExercises = newHistoryEntry.desglose_ejercicios.filter(ex => 'sets' in ex && Array.isArray((ex as DesgloseFuerza).sets)) as DesgloseFuerza[];
        strengthExercises.forEach(ex => {
            if (!ex.sets || ex.sets.length === 0) return;
            const bestE1RM = ex.sets.reduce((maxE1RM, set) => Math.max(maxE1RM, calculateE1RM(set.weight, set.reps)), 0);
            const oldPR = progressTracker.personalRecords[ex.exerciseId]?.weight || 0;
            if (bestE1RM > oldPR) {
                newPRs.push(ex.exerciseId);
            }
        });
    }

    dispatch(actions.addSessionToHistory(newHistoryEntry));
    dispatch(actions.setWorkoutSummary({ historicalEntry: newHistoryEntry, newPRs }));
    dispatch(actions.exitRoutine());
    const uniqueTaskId = `${routine.id}-${routine.timeOfDay}`;
    dispatch(actions.completeTask(uniqueTaskId));

};

export const saveCardioLogThunk = (distance: number, notes: string): ThunkAction => (dispatch, getState) => {
    const state = getState();
    const cardioLogData = selectCardioLogData(state);
    if (!cardioLogData) return;

    const { routine, stats } = cardioLogData;

    const durationMinutes = Math.round(stats.duration / 60);
    const paceDecimal = distance > 0 ? durationMinutes / distance : 0;
    const paceMinutes = Math.floor(paceDecimal);
    const paceSeconds = Math.round((paceDecimal - paceMinutes) * 60);
    const paceString = distance > 0 ? `${paceMinutes}'${paceSeconds.toString().padStart(2, '0')}"` : undefined;

    const desglose: DesgloseCardioLibre = {
        distance: distance,
        duration: durationMinutes,
        pace: paceString,
        calories: Math.round(distance * 65), // Estimate calories
        notes: notes,
    };

    const newHistoryEntry: HistorialDeSesionesEntry = {
        id_sesion: `session-${Date.now()}`,
        nombre_rutina: routine.name,
        tipo_rutina: routine.type,
        fecha_completado: new Date().toISOString(),
        duracion_total_min: durationMinutes,
        desglose_ejercicios: [desglose]
    };
    
    dispatch(actions.addSessionToHistory(newHistoryEntry));
    dispatch(actions.setWorkoutSummary({ historicalEntry: newHistoryEntry }));
    dispatch(actions.clearCardioLogData());
    const uniqueTaskId = `${routine.id}-${routine.timeOfDay}`;
    dispatch(actions.completeTask(uniqueTaskId));
};

export const skipCardioLogThunk = (): ThunkAction => (dispatch) => {
    dispatch(actions.clearCardioLogData());
};

export const saveCardioLibreLogThunk = (log: DesgloseCardioLibre): ThunkAction => (dispatch) => {
    const newHistoryEntry: HistorialDeSesionesEntry = {
        id_sesion: `session-${Date.now()}`,
        nombre_rutina: "Carrera Libre",
        tipo_rutina: 'cardioLibre',
        fecha_completado: new Date().toISOString(),
        duracion_total_min: log.duration,
        desglose_ejercicios: [log]
    };

    dispatch(actions.addSessionToHistory(newHistoryEntry));
    dispatch(thunks.showToastThunk('Carrera registrada con éxito'));
};

export const saveSenderismoLogThunk = (log: DesgloseCardioLibre): ThunkAction => (dispatch) => {
    const newHistoryEntry: HistorialDeSesionesEntry = {
        id_sesion: `session-${Date.now()}`,
        nombre_rutina: "Senderismo Libre",
        tipo_rutina: 'senderismo',
        fecha_completado: new Date().toISOString(),
        duracion_total_min: log.duration,
        desglose_ejercicios: [log]
    };

    dispatch(actions.addSessionToHistory(newHistoryEntry));
    dispatch(thunks.showToastThunk('Senderismo registrado con éxito'));
};

export const saveRuckingLogThunk = (log: DesgloseCardioLibre): ThunkAction => (dispatch) => {
    const newHistoryEntry: HistorialDeSesionesEntry = {
        id_sesion: `session-${Date.now()}`,
        nombre_rutina: "Rucking Libre",
        tipo_rutina: 'rucking',
        fecha_completado: new Date().toISOString(),
        duracion_total_min: log.duration,
        desglose_ejercicios: [log]
    };

    dispatch(actions.addSessionToHistory(newHistoryEntry));
    dispatch(thunks.showToastThunk('Rucking registrado con éxito'));
};
