
import { AppState } from '../types';
export const selectUiState = (state: AppState) => state.ui;
export const selectActiveScreen = (state: AppState) => state.ui.activeScreen;
export const selectToastMessage = (state: AppState) => state.ui.toastMessage;
export const selectUnlockedAchievements = (state: AppState) => state.ui.unlockedAchievements;
export const selectAchievementToShow = (state: AppState) => state.ui.achievementToShow;
export const selectIsProfileOpen = (state: AppState) => state.ui.isProfileOpen;
export const selectShowPhaseChangeModal = (state: AppState) => state.ui.showPhaseChangeModal;
export const selectIsModalOpen = (state: AppState) => state.ui.isModalOpen;
export const selectIsBottomNavVisible = (state: AppState) => state.ui.isBottomNavVisible;
export const selectMealBuilderInitialState = (state: AppState) => state.ui.mealBuilderInitialState;
export const selectSyncStatus = (state: AppState) => state.ui.syncStatus;
