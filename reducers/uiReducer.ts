
import { UIState, Action, Achievement, Screen } from '../types';
import { achievementsData } from '../data';
import * as actionTypes from '../actions/actionTypes';

export const initialUIState: UIState = {
    activeScreen: 'Hoy',
    unlockedAchievements: [],
    achievementToShow: null,
    toastMessage: null,
    isProfileOpen: false,
    showPhaseChangeModal: false,
    isModalOpen: false,
    isBottomNavVisible: true,
    navigationTarget: null,
    mealBuilderInitialState: null,
    syncStatus: 'synced',
};

export const uiReducer = (state: UIState = initialUIState, action: Action): UIState => {
    switch (action.type) {
        case actionTypes.SET_ACTIVE_SCREEN:
            return { ...state, activeScreen: action.payload };
        case actionTypes.SHOW_TOAST:
            return { ...state, toastMessage: action.payload };
        case actionTypes.CLEAR_TOAST:
            return { ...state, toastMessage: null };
        case actionTypes.UNLOCK_ACHIEVEMENT: {
            if (state.unlockedAchievements.includes(action.payload)) return state;
            const newUnlocked = [...state.unlockedAchievements, action.payload];
            const achievement = achievementsData[action.payload];
            return { ...state, unlockedAchievements: newUnlocked, achievementToShow: achievement ? { ...achievement } : null };
        }
        case actionTypes.DISMISS_ACHIEVEMENT:
            return { ...state, achievementToShow: null };
        case actionTypes.OPEN_PROFILE:
            return { ...state, isProfileOpen: true };
        case actionTypes.CLOSE_PROFILE:
            return { ...state, isProfileOpen: false };
        case actionTypes.SHOW_PHASE_CHANGE_MODAL:
             return { ...state, showPhaseChangeModal: true };
        case actionTypes.DISMISS_PHASE_CHANGE_MODAL:
            return { ...state, showPhaseChangeModal: false };
        case actionTypes.OPEN_MODAL:
            return { ...state, isModalOpen: true };
        case actionTypes.CLOSE_MODAL:
            return { ...state, isModalOpen: false };
        case actionTypes.SET_BOTTOM_NAV_VISIBLE:
            return { ...state, isBottomNavVisible: action.payload };
        case actionTypes.SET_NAVIGATION_TARGET:
            return { ...state, navigationTarget: action.payload };
        case actionTypes.SET_MEAL_BUILDER_STATE:
            return { ...state, mealBuilderInitialState: action.payload };
        case actionTypes.SET_SYNC_STATUS:
            return { ...state, syncStatus: action.payload };
        default:
            return state;
    }
};
