import { SessionState, Action } from '../types';
import * as actionTypes from '../actions/actionTypes';

export const initialSessionState: SessionState = {
    dailyProgress: { completedTasks: [], lastResetDate: new Date().toISOString().split('T')[0] },
    dailyHabits: { sleepHours: 0, stepsGoalMet: false, ruckingSessionMet: false },
    activeRoutine: null,
    activeRoutineProgress: null,
    pausedRoutine: null,
    activeRoutineInfo: null,
    workoutSummaryData: null,
    cardioLogData: null,
};

export const sessionReducer = (state: SessionState = initialSessionState, action: Action): SessionState => {
    switch(action.type) {
        case actionTypes.UPDATE_DAILY_HABIT:
            return { ...state, dailyHabits: { ...state.dailyHabits, ...action.payload } };
            
        case actionTypes.START_ROUTINE: {
            const routine = action.payload;
            const uniqueTaskId = `${routine.id}-${routine.timeOfDay}`;
            return { 
                ...state, 
                activeRoutine: routine, 
                activeRoutineInfo: { id: uniqueTaskId, progress: 0 }, 
                pausedRoutine: null,
                activeRoutineProgress: {
                    isStarted: false,
                    currentFlow: routine.flow,
                    currentStepIndex: 0,
                    globalTime: 0,
                    workoutStats: {
                        exercisesCompleted: 0,
                        duration: 0,
                        weightLifted: 0,
                        logs: {},
                        exerciseDurations: {},
                    }
                }
            };
        }
        case actionTypes.EXIT_ROUTINE:
            return { ...state, activeRoutine: null, activeRoutineInfo: null, pausedRoutine: null, activeRoutineProgress: null };
        
        case actionTypes.UPDATE_ACTIVE_ROUTINE_STATE:
            return { ...state, activeRoutineProgress: action.payload };
        
        case actionTypes.PAUSE_ROUTINE:
            return { ...state, activeRoutine: null, activeRoutineInfo: null, pausedRoutine: action.payload };
        
        case actionTypes.UPDATE_ACTIVE_ROUTINE_PROGRESS:
            return { ...state, activeRoutineInfo: action.payload };
        
        case actionTypes.SET_WORKOUT_SUMMARY:
             return { ...state, workoutSummaryData: action.payload };
        case actionTypes.CLOSE_SUMMARY:
            return { ...state, workoutSummaryData: null };

        case actionTypes.SET_CARDIO_LOG_DATA:
            return { ...state, cardioLogData: action.payload };
        case actionTypes.CLEAR_CARDIO_LOG_DATA:
            return { ...state, cardioLogData: null };
            
        case actionTypes.COMPLETE_TASK:
            if (state.dailyProgress.completedTasks.includes(action.payload)) {
                return state;
            }
            return { ...state, dailyProgress: { ...state.dailyProgress, completedTasks: [...state.dailyProgress.completedTasks, action.payload] } };
        
        case actionTypes.UNCOMPLETE_TASK:
            return { ...state, dailyProgress: { ...state.dailyProgress, completedTasks: state.dailyProgress.completedTasks.filter(id => id !== action.payload) } };
        
        case actionTypes.RESET_DAILY_PROGRESS:
            return {
                ...state,
                dailyProgress: {
                    completedTasks: [],
                    lastResetDate: new Date().toISOString().split('T')[0]
                },
                dailyHabits: { sleepHours: 0, stepsGoalMet: false, ruckingSessionMet: false }
            };
            
        default:
            return state;
    }
}