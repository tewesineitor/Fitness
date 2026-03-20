
import * as actionTypes from './actionTypes';
import { Screen, AddedFood } from '../types';

export const setActiveScreen = (payload: Screen) => ({ type: actionTypes.SET_ACTIVE_SCREEN, payload } as const);
export const showToast = (payload: string) => ({ type: actionTypes.SHOW_TOAST, payload } as const);
export const clearToast = () => ({ type: actionTypes.CLEAR_TOAST } as const);
export const openProfile = () => ({ type: actionTypes.OPEN_PROFILE } as const);
export const closeProfile = () => ({ type: actionTypes.CLOSE_PROFILE } as const);
export const showPhaseChangeModal = () => ({ type: actionTypes.SHOW_PHASE_CHANGE_MODAL } as const);
export const dismissPhaseChangeModal = () => ({ type: actionTypes.DISMISS_PHASE_CHANGE_MODAL } as const);
export const openModal = () => ({ type: actionTypes.OPEN_MODAL } as const);
export const closeModal = () => ({ type: actionTypes.CLOSE_MODAL } as const);
export const setBottomNavVisible = (payload: boolean) => ({ type: actionTypes.SET_BOTTOM_NAV_VISIBLE, payload } as const);
export const setNavigationTarget = (payload: 'library-planner' | null) => ({ type: actionTypes.SET_NAVIGATION_TARGET, payload } as const);
export const setMealBuilderState = (payload: { foods: AddedFood[], mealName?: string } | null) => ({ type: actionTypes.SET_MEAL_BUILDER_STATE, payload } as const);
export const setSyncStatus = (payload: import('../types').SyncStatus) => ({ type: actionTypes.SET_SYNC_STATUS, payload } as const);
