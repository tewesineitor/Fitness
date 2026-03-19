
import React, { useReducer, useCallback, useMemo, useEffect, useRef, ReactNode, useState } from 'react';
import { AppState, ThunkDispatch } from './types';
import { AppContext } from './contexts';
import { rootReducer } from './reducers/rootReducer';
import { initialState } from './initialState';
import { exercises as exercisesData, defaultRoutines, dailyGoals as defaultGoals } from './data';
import * as actions from './actions';
import * as thunks from './thunks';
import { fetchUserState, saveUserState, seedDatabaseIfEmpty, fetchStaticData } from './services/supabaseService';
import { getSupabase } from './services/supabaseClient';
import LoginView from './screens/auth/LoginView';

const STORAGE_KEY = 'fitArchitectState';

// Helper to save state, handling non-JSON-friendly types and QUOTA ERRORS
const saveStateToStorage = (state: AppState, userId?: string) => {
    try {
        const key = userId ? `fitArchitectState_${userId}` : 'fitArchitectState';
        // Create a serializable copy of the state
        const stateToSave = JSON.parse(JSON.stringify(state));
        stateToSave.lastUpdated = Date.now();

        // Manually convert Set to Array for storage
        if (state.progress.progressTracker.activityDates instanceof Set) {
            stateToSave.progress.progressTracker.activityDates = Array.from(state.progress.progressTracker.activityDates);
        }

        const serialized = JSON.stringify(stateToSave);
        localStorage.setItem(key, serialized);
    } catch (error: any) {
        if (error.name === 'QuotaExceededError' || error.code === 22) {
            console.error("LocalStorage Quota Exceeded! Removing images to save critical data.");
            // EMERGENCY FALLBACK: Remove photos from the state copy and try saving again
            // This prevents the user from losing their workout progress even if the photo fails
            try {
                const key = userId ? `fitArchitectState_${userId}` : 'fitArchitectState';
                const stateWithoutPhotos = JSON.parse(JSON.stringify(state));
                // Convert Set again
                if (stateWithoutPhotos.progress.progressTracker.activityDates instanceof Set) {
                    stateWithoutPhotos.progress.progressTracker.activityDates = Array.from(stateWithoutPhotos.progress.progressTracker.activityDates);
                }
                
                // Strip photos
                stateWithoutPhotos.progress.metricHistory = stateWithoutPhotos.progress.metricHistory.map((entry: any) => {
                    const { url_foto, ...rest } = entry;
                    return rest; // Remove url_foto
                });

                localStorage.setItem(key, JSON.stringify(stateWithoutPhotos));
                alert("⚠️ Alerta de Almacenamiento: Tu navegador está lleno. Las fotos nuevas no se guardarán, pero tu progreso numérico sí.");
            } catch (retryError) {
                console.error("Critical Storage Failure", retryError);
            }
        } else {
            console.error("Could not save state to localStorage", error);
        }
    }
};

// Helper to load state, handling hydration of special types
const hydrateState = (parsedState: any): AppState => {
    // Hydrate special types
    if (parsedState.progress?.planStartDate) {
        parsedState.progress.planStartDate = new Date(parsedState.progress.planStartDate);
    }
    if (parsedState.progress?.progressTracker?.activityDates && Array.isArray(parsedState.progress.progressTracker.activityDates)) {
        parsedState.progress.progressTracker.activityDates = new Set(parsedState.progress.progressTracker.activityDates);
    }
    if (parsedState.nutrition?.loggedMeals && Array.isArray(parsedState.nutrition.loggedMeals)) {
        parsedState.nutrition.loggedMeals.forEach((meal: any) => {
            if(meal.timestamp) {
                meal.timestamp = new Date(meal.timestamp);
            }
        });
    }
    
    // --- SYNC NEW DATA ---
    // Ensure new exercises from data-exercises.ts are merged into the state
    if (parsedState.workout) {
        parsedState.workout.allExercises = {
            ...exercisesData,
            ...parsedState.workout.allExercises
        };

        // Ensure new default routines from data-routines.ts are added if missing
        const existingRoutineIds = new Set(parsedState.workout.userRoutines.map((r: any) => r.id));
        defaultRoutines.forEach(dr => {
            if (!existingRoutineIds.has(dr.id)) {
                parsedState.workout.userRoutines.push(dr);
            }
        });
    }
    
    // --- MIGRATE DAILY GOALS ---
    // Update old default goals to the new ones
    if (parsedState.profile && parsedState.profile.dailyGoals) {
        const goals = parsedState.profile.dailyGoals;
        if ((goals.kcal === 1950 && goals.protein === 150 && goals.carbs === 191 && goals.fat === 65) || goals.fatMin === undefined) {
            parsedState.profile.dailyGoals = { ...defaultGoals };
        }
    }
    
    // Make sure theme is loaded from storage if available, otherwise default
    parsedState.profile.theme = localStorage.getItem('fitArchitectTheme') || parsedState.profile.theme || 'system';

    // Force the app to start on the correct screen
    if (parsedState.ui) {
        if (parsedState.session?.activeRoutineProgress?.isStarted) {
            parsedState.ui.activeScreen = 'RutinaActiva';
            parsedState.ui.isBottomNavVisible = false;
        } else {
            parsedState.ui.activeScreen = 'Hoy';
            parsedState.ui.isBottomNavVisible = true;
        }
        parsedState.ui.isModalOpen = false;
        parsedState.ui.isProfileOpen = false;
    }

    // Clear session overlays that might hide the nav on reload
    if (parsedState.session) {
        parsedState.session.workoutSummaryData = null;
        parsedState.session.cardioLogData = null;
        
        // --- DAILY RESET ---
        const today = new Date().toISOString().split('T')[0];
        if (parsedState.session.dailyProgress) {
            if (parsedState.session.dailyProgress.lastResetDate !== today) {
                parsedState.session.dailyProgress.completedTasks = [];
                parsedState.session.dailyProgress.lastResetDate = today;
                // Also reset daily habits
                parsedState.session.dailyHabits = { sleepHours: 0, stepsGoalMet: false, ruckingSessionMet: false };
            }
        } else {
            // Initialize if missing (for older versions)
            parsedState.session.dailyProgress = { completedTasks: [], lastResetDate: today };
        }
    }

    return parsedState;
};

const loadStateFromStorage = (userId?: string): AppState | undefined => {
    try {
        const key = userId ? `fitArchitectState_${userId}` : 'fitArchitectState';
        const serializedState = localStorage.getItem(key);
        if (serializedState === null) {
            return undefined;
        }
        
        const parsedState = JSON.parse(serializedState);
        return hydrateState(parsedState);
    } catch (error) {
        console.error("Could not load state from localStorage", error);
        return undefined;
    }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [session, setSession] = useState<any>(null);
    const [authInitialized, setAuthInitialized] = useState(false);
    const [state, dispatch] = useReducer(rootReducer, initialState);
    const stateRef = useRef(state);
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Initialize Auth
    useEffect(() => {
        const supabase = getSupabase();
        if (!supabase) {
            setAuthInitialized(true);
            return;
        }

        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setAuthInitialized(true);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Initialize from Supabase
    useEffect(() => {
        if (!authInitialized) return;
        if (!session) {
            // If logged out, reset state and don't try to fetch
            setIsInitialized(true);
            return;
        }

        const initApp = async () => {
            try {
                // 1. Seed DB if empty
                await seedDatabaseIfEmpty();
                
                // 2. Fetch static data and user state
                const [staticData, dbState] = await Promise.all([
                    fetchStaticData(),
                    fetchUserState()
                ]);
                
                let finalState: AppState;
                const localState = loadStateFromStorage(session?.user?.id);

                if (dbState && localState) {
                    const dbTime = dbState.lastUpdated || 0;
                    const localTime = localState.lastUpdated || 0;
                    
                    if (localTime > dbTime) {
                        console.log("Local state is newer than DB state. Using local state.");
                        finalState = localState;
                        // Trigger a save to DB to sync it up
                        saveUserState(localState);
                    } else {
                        finalState = hydrateState(dbState);
                    }
                } else if (dbState) {
                    finalState = hydrateState(dbState);
                } else if (localState) {
                    finalState = localState;
                } else {
                    finalState = initialState;
                }

                // Merge static data into the state
                finalState = {
                    ...finalState,
                    workout: {
                        ...finalState.workout,
                        allExercises: {
                            ...staticData.exercises,
                            ...finalState.workout.allExercises // User exercises override static ones
                        },
                        userRoutines: [
                            ...staticData.routines,
                            ...finalState.workout.userRoutines.filter(r => r.isUserCreated)
                        ]
                    },
                    nutrition: {
                        ...finalState.nutrition,
                        allFoods: staticData.foods,
                        allRecipes: staticData.recipes
                    }
                };

                dispatch({ type: 'REPLACE_STATE', payload: finalState } as any);
            } catch (error) {
                console.error("Failed to initialize from Supabase, falling back to local storage", error);
                const localState = loadStateFromStorage(session?.user?.id);
                if (localState) {
                    dispatch({ type: 'REPLACE_STATE', payload: localState } as any);
                }
            } finally {
                setIsInitialized(true);
            }
        };
        
        initApp();
    }, [session, authInitialized]);

    // Effect to save state to Supabase and localStorage whenever it changes
    useEffect(() => {
        if (!isInitialized) return;
        
        stateRef.current = state;
        
        // Save to local storage immediately for fast local reloads
        saveStateToStorage(state, session?.user?.id);
        
        // Debounce save to Supabase
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }
        
        saveTimeoutRef.current = setTimeout(async () => {
            dispatch(actions.setSyncStatus('syncing'));
            try {
                await saveUserState(state);
                dispatch(actions.setSyncStatus('synced'));
            } catch (error) {
                console.error("Error saving user state to Supabase:", error);
                dispatch(actions.setSyncStatus('error'));
            }
        }, 2000); // Save to DB 2 seconds after last change
        
    }, [state, isInitialized]);


    const thunkDispatch: ThunkDispatch = useCallback((action) => {
        if (typeof action === 'function') {
            return action(thunkDispatch, () => stateRef.current);
        } else {
            dispatch(action);
            return;
        }
    }, []);

    const showToast = useCallback((message: string) => {
        thunkDispatch(thunks.showToastThunk(message));
    }, [thunkDispatch]);

    const unlockAchievement = useCallback((achievementId: string) => {
        if (!state.ui.unlockedAchievements.includes(achievementId)) {
            thunkDispatch(actions.unlockAchievement(achievementId));
        }
    }, [state.ui.unlockedAchievements, thunkDispatch]);

    // Runtime Daily Reset Check
    useEffect(() => {
        if (!isInitialized) return;

        const checkReset = () => {
            const today = new Date().toISOString().split('T')[0];
            if (state.session.dailyProgress.lastResetDate !== today) {
                thunkDispatch(actions.resetDailyProgress());
            }
        };

        // Check immediately
        checkReset();

        // Check every minute
        const interval = setInterval(checkReset, 60000);
        return () => clearInterval(interval);
    }, [isInitialized, state.session.dailyProgress.lastResetDate, thunkDispatch]);

    const contextValue = useMemo(() => ({
        state,
        dispatch: thunkDispatch,
        showToast,
        unlockAchievement,
    }), [state, thunkDispatch, showToast, unlockAchievement]);


    useEffect(() => {
        const root = window.document.documentElement;
        const theme = state.profile.theme;
        
        // Persist theme choice to localStorage
        localStorage.setItem('fitArchitectTheme', theme);
        
        const applyTheme = () => {
            const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
            if (isDark) {
                root.removeAttribute('data-theme');
            } else {
                root.setAttribute('data-theme', 'light');
            }
        };

        applyTheme();

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const handleChange = () => {
            if (theme === 'system') {
                applyTheme();
            }
        };

        mediaQuery.addEventListener('change', handleChange);

        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, [state.profile.theme]);

    if (!isInitialized || !authInitialized) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-bg-base">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-surface-border border-t-brand-accent rounded-full animate-spin"></div>
                    <p className="mt-4 text-xs font-bold text-text-secondary uppercase tracking-widest">Conectando con Supabase...</p>
                </div>
            </div>
        );
    }

    if (!session) {
        return <LoginView />;
    }

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};
