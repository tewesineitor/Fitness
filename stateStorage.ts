import {
    AppState,
    HistorialDeMetricasEntry,
} from './types';
import {
    createPersistedStateSnapshot,
    PersistedAppState,
} from './persistedState';
import { hydratePersistedState } from './stateHydration';

const createStorageKey = (userId?: string) => (userId ? `fitArchitectState_${userId}` : 'fitArchitectState');

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null;

const isQuotaExceededError = (error: unknown): error is { name?: string; code?: number } =>
    isRecord(error) && (
        error.name === 'QuotaExceededError' ||
        error.code === 22
    );

const stripPhotoUrlsFromMetricHistory = (metricHistory: HistorialDeMetricasEntry[]): HistorialDeMetricasEntry[] =>
    metricHistory.map(({ url_foto, ...entry }) => entry);

export const loadStateFromStorage = (userId?: string, themeOverride?: string | null): AppState | undefined => {
    try {
        const serializedState = localStorage.getItem(createStorageKey(userId));
        if (serializedState === null) {
            return undefined;
        }

        const parsedState = JSON.parse(serializedState);
        return hydratePersistedState(parsedState, themeOverride);
    } catch (error) {
        console.error('Could not load state from localStorage', error);
        return undefined;
    }
};

export const saveStateToStorage = (state: AppState | PersistedAppState, userId?: string) => {
    try {
        const key = createStorageKey(userId);
        const stateToSave = createPersistedStateSnapshot(state, { normalizeSyncStatus: true });
        stateToSave.lastUpdated = Date.now();

        localStorage.setItem(key, JSON.stringify(stateToSave));
    } catch (error: unknown) {
        if (isQuotaExceededError(error)) {
            console.error('LocalStorage Quota Exceeded! Removing images to save critical data.');
            try {
                const key = createStorageKey(userId);
                const stateWithoutPhotos = createPersistedStateSnapshot(state, { normalizeSyncStatus: true });
                if (stateWithoutPhotos.progress?.metricHistory) {
                    stateWithoutPhotos.progress.metricHistory = stripPhotoUrlsFromMetricHistory(stateWithoutPhotos.progress.metricHistory);
                }

                localStorage.setItem(key, JSON.stringify(stateWithoutPhotos));
                alert('Alerta de almacenamiento: tu navegador esta lleno. Las fotos nuevas no se guardaran, pero tu progreso numerico si.');
            } catch (retryError) {
                console.error('Critical Storage Failure', retryError);
            }
        } else {
            console.error('Could not save state to localStorage', error);
        }
    }
};
