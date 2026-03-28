import type { AddedFood } from './nutrition';

export type Screen = 'Hoy' | 'Nutrición' | 'Biblioteca' | 'Progreso' | 'Playground' | 'RutinaActiva';

export type SyncStatus = 'synced' | 'syncing' | 'error' | 'offline';

export interface MealBuilderState {
    foods: AddedFood[];
    mealName?: string;
}

export interface UIState {
    activeScreen: Screen;
    toastMessage: string | null;
    isProfileOpen: boolean;
    showPhaseChangeModal: boolean;
    isModalOpen: boolean;
    isBottomNavVisible: boolean;
    navigationTarget: 'library-planner' | null;
    mealBuilderInitialState: MealBuilderState | null;
    syncStatus: SyncStatus;
}
