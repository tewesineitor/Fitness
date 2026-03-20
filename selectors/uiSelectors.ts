
import { AppState } from '../types';
export const selectActiveScreen = (state: AppState) => state.ui.activeScreen;
export const selectToastMessage = (state: AppState) => state.ui.toastMessage;
export const selectIsProfileOpen = (state: AppState) => state.ui.isProfileOpen;
export const selectShowPhaseChangeModal = (state: AppState) => state.ui.showPhaseChangeModal;
export const selectIsBottomNavVisible = (state: AppState) => state.ui.isBottomNavVisible;
export const selectMealBuilderInitialState = (state: AppState) => state.ui.mealBuilderInitialState;
export const selectSyncStatus = (state: AppState) => state.ui.syncStatus;
