
import { ProgressState, Action, DesgloseFuerza, HistorialDeMetricasEntry } from '../types';
import * as actionTypes from '../actions/actionTypes';

export const initialProgressState: ProgressState = {
    metricHistory: [],
    planStartDate: new Date(),
    progressTracker: { 
        consecutiveDaysMacrosMet: 0, 
        lastDateMacrosMet: '', 
        lastWeeklyReset: '', 
        completedMeditationSessions: 0, 
        activityDates: new Set(), 
        journeyProgress: [], 
        phaseChangeModalShown: false, 
        personalRecords: {}, 
    },
};

const calculateE1RM = (weight: number, reps: number) => weight * (1 + reps / 30);

export const progressReducer = (state: ProgressState = initialProgressState, action: Action): ProgressState => {
    switch (action.type) {
        case actionTypes.START_CHALLENGE:
            return { ...state, planStartDate: new Date() };
        case actionTypes.DISMISS_PHASE_CHANGE_MODAL:
            return { ...state, progressTracker: { ...state.progressTracker, phaseChangeModalShown: true } };
        
        case actionTypes.ADD_METRIC_ENTRY: {
            const { date, weight, waist, hips, neck, shoulders, chest, thigh, biceps, photoUrl } = action.payload;
            const existingEntryIndex = state.metricHistory.findIndex(e => e.fecha_registro === date);
            const newHistory = [...state.metricHistory];
            if (existingEntryIndex > -1) {
                const existing = { ...newHistory[existingEntryIndex] };
                if (weight !== undefined) existing.peso_kg = weight;
                if (waist !== undefined) existing.cintura_cm = waist;
                if (hips !== undefined) existing.caderas_cm = hips;
                if (neck !== undefined) existing.cuello_cm = neck;
                if (shoulders !== undefined) existing.hombros_cm = shoulders;
                if (chest !== undefined) existing.pecho_cm = chest;
                if (thigh !== undefined) existing.muslo_cm = thigh;
                if (biceps !== undefined) existing.biceps_cm = biceps;
                if (photoUrl !== undefined) existing.url_foto = photoUrl;
                newHistory[existingEntryIndex] = existing;
            } else {
                newHistory.push({
                    id_registro: `metric-${Date.now()}`,
                    fecha_registro: date,
                    peso_kg: weight,
                    cintura_cm: waist,
                    caderas_cm: hips,
                    cuello_cm: neck,
                    hombros_cm: shoulders,
                    pecho_cm: chest,
                    muslo_cm: thigh,
                    biceps_cm: biceps,
                    url_foto: photoUrl
                });
            }
            return { ...state, metricHistory: newHistory.sort((a,b) => new Date(a.fecha_registro).getTime() - new Date(b.fecha_registro).getTime()) };
        }
        
        case actionTypes.ADD_SESSION_TO_HISTORY: {
            const newSession = action.payload;
            const newPersonalRecords = { ...state.progressTracker.personalRecords };
            
            if (newSession.tipo_rutina === 'strength') {
                const strengthExercises = newSession.desglose_ejercicios.filter(
                    (ex): ex is DesgloseFuerza => 'sets' in ex && Array.isArray((ex as DesgloseFuerza).sets)
                );
                strengthExercises.forEach(ex => {
                    if (!ex.sets || ex.sets.length === 0) return;
                    
                    const bestE1RM = ex.sets.reduce((maxE1RM, set) => Math.max(maxE1RM, calculateE1RM(set.peso, set.reps)), 0);
                    const oldPR = newPersonalRecords[ex.exerciseId]?.weight || 0;
                    if (bestE1RM > oldPR) {
                        newPersonalRecords[ex.exerciseId] = { weight: bestE1RM, date: newSession.fecha_completado };
                    }
                });
            }
            
            return { ...state, progressTracker: { ...state.progressTracker, personalRecords: newPersonalRecords } };
        }
        default:
            return state;
    }
};
