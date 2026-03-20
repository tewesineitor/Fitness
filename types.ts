
import type { ComponentType } from 'react';

export type IconComponent = ComponentType<{ className?: string }>;

// --- UI Types ---
export type Screen = 'Hoy' | 'Nutrición' | 'Biblioteca' | 'Progreso' | 'RutinaActiva';

export type SyncStatus = 'synced' | 'syncing' | 'error' | 'offline';

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

export interface MealBuilderState {
    foods: AddedFood[];
    mealName?: string;
}

// --- Profile Types ---
export type Theme = 'light' | 'dark' | 'system';

export interface DailyGoals {
    kcal: number;
    protein: number;
    carbs: number;
    fat: number;
    fatMin?: number;
    fatMax?: number;
    carbMin?: number;
    carbMax?: number;
}

export interface ProfileState {
    userName: string;
    dailyGoals: DailyGoals;
    theme: Theme;
    customMantra: string;
}

// --- Progress Types ---
export interface HistorialDeMetricasEntry {
    id_registro: string;
    fecha_registro: string; // ISO string YYYY-MM-DD
    peso_kg?: number;
    cintura_cm?: number;
    caderas_cm?: number;
    cuello_cm?: number;
    hombros_cm?: number;
    pecho_cm?: number;
    muslo_cm?: number;
    biceps_cm?: number;
    url_foto?: string;
}

export interface PersonalRecord {
    weight: number;
    date: string;
}

export interface ProgressTracker {
    consecutiveDaysMacrosMet: number;
    lastDateMacrosMet: string;
    lastWeeklyReset: string;
    completedMeditationSessions: number;
    activityDates: Set<string> | string[]; 
    journeyProgress: boolean[];
    phaseChangeModalShown: boolean;
    personalRecords: Record<string, PersonalRecord>;
}

export interface ProgressState {
    metricHistory: HistorialDeMetricasEntry[];
    planStartDate: Date | null;
    progressTracker: ProgressTracker;
}

// --- Workout Types ---
export type RoutineTaskType = 'strength' | 'cardio' | 'yoga' | 'meditation' | 'cardioLibre' | 'senderismo' | 'rucking' | 'posture';
export type DayOfWeek = 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo';
export type TimeOfDay = 'Mañana' | 'Mediodía' | 'Noche';

export interface LoggedSet {
    weight: number;
    reps: number;
    serie?: number;
    rir?: number;
}

export interface DesgloseFuerza {
    exerciseId: string;
    nombre_ejercicio: string;
    duracion_ejercicio_seg: number;
    sets: LoggedSet[];
}

export interface DesgloseTiempo {
    nombre_ejercicio: string;
    duracion_completada_seg: number;
}

export interface DesgloseCardioLibre {
    distance: number;
    duration: number;
    pace?: string;
    calories?: number;
    heartRate?: number;
    elevation?: number;
    weightCarried?: number; // For Rucking
    notes?: string;
}

export type DesgloseEjercicio = DesgloseFuerza | DesgloseTiempo | DesgloseCardioLibre;

export interface HistorialDeSesionesEntry {
    id_sesion: string;
    nombre_rutina: string;
    tipo_rutina: RoutineTaskType;
    fecha_completado: string; // ISO String
    duracion_total_min: number;
    desglose_ejercicios: DesgloseEjercicio[];
}

export interface Exercise {
    id: string;
    name: string;
    category: 'fuerza' | 'calentamiento' | 'movilidad' | 'estiramiento' | 'postura' | 'yoga' | 'cardio';
    isBodyweight: boolean;
    gifUrl: string;
    description: string;
    isUserCreated?: boolean;
}

export type ExerciseLibraryCategory = Exclude<Exercise['category'], 'cardio'>;

export interface StrengthStep {
    type: 'exercise';
    title: string;
    exerciseId: string;
    sets: number;
    reps: string; 
    rir: string;
    rest: number; 
    restMax?: number;
}

export interface YogaStep {
    type: 'pose';
    title: string;
    exerciseId: string;
    duration: number;
}

export interface MeditationStep {
    type: 'meditation';
    title: string;
    duration: number;
}

export interface InfoStep {
    type: 'warmup' | 'cooldown';
    title: string;
    subtitle?: string;
    items: { exerciseId: string; reps?: string }[];
}

export type RoutineStep = StrengthStep | YogaStep | MeditationStep | InfoStep;

export interface RoutineTask {
    id: string;
    name: string;
    timeOfDay: TimeOfDay;
    type: RoutineTaskType;
    flow: RoutineStep[];
    isUserCreated?: boolean;
    technicalFocus?: string; // New field for "Foco Técnico"
}

export interface WorkoutState {
    userRoutines: RoutineTask[];
    userExercises: Exercise[];
    weeklySchedule: Record<string, Record<string, string> | undefined>; 
    cardioWeek: number;
    historialDeSesiones: HistorialDeSesionesEntry[];
    allExercises: Record<string, Exercise>;
    exerciseImages: Record<string, string>; 
}

// --- Nutrition Types ---
export interface MacroNutrients {
    kcal: number;
    protein: number;
    carbs: number;
    fat: number;
}

export interface FoodItem {
    id: string;
    name: string;
    brand?: string;
    category: 'Grasas y Aceites' | 'Carnicería (Pollo)' | 'Carnicería (Res)' | 'Carnicería (Cerdo)' | 'Pescadería' | 'Huevo y Lácteos' | 'Embutidos' | 'Tortillas y Maíz' | 'Panadería' | 'Cereales y Tubérculos' | 'Legumbres' | 'Frutas' | 'Verduras' | 'Semillas y Frutos Secos' | 'Condimentos y Salsas' | 'Enlatados' | 'Calle (Antojitos)' | 'Calle (Caldos)' | 'Suplementos' | 'Untables / Extras';
    standardPortion: string;
    rawWeightG?: number;
    cookedWeightG?: number;
    macrosPerPortion: MacroNutrients;
    isUserCreated?: boolean;
    needsReview?: boolean;
}

export interface AddedFood {
    foodItem: FoodItem;
    portions: number;
}

export type MealType = 'Desayuno' | 'Almuerzo' | 'Cena' | 'Colación';

export interface Recipe {
    id: string;
    name: string;
    type: 'plan' | 'user';
    imageUrl?: string;
    mealType?: MealType;
    foods: AddedFood[];
    preparation?: string;
    isFavorite?: boolean;
}

export interface LoggedMeal {
    id: string;
    name?: string;
    foods: AddedFood[];
    macros: MacroNutrients;
    timestamp: Date;
    timing?: 'pre-workout' | 'post-workout' | 'general';
}

export interface NutritionState {
    myRecipes: Recipe[];
    customFoodItems: FoodItem[];
    consumedMacros: MacroNutrients;
    loggedMeals: LoggedMeal[];
    favoritedPlanRecipeIds: string[];
    allFoods: FoodItem[];
    allRecipes: Recipe[];
}

// --- Session Types ---
export interface WorkoutStats {
    exercisesCompleted: number;
    duration: number;
    weightLifted: number;
    logs: Record<string, LoggedSet[]>; 
    exerciseDurations: Record<string, number>; 
}

export interface DailyHabits {
    sleepHours: number;
    stepsGoalMet: boolean;
    ruckingSessionMet: boolean;
}

export interface ActiveRoutineProgress {
    isStarted: boolean;
    currentFlow: RoutineStep[];
    currentStepIndex: number;
    globalTime: number;
    workoutStats: WorkoutStats;
}

export interface SessionState {
    dailyProgress: { completedTasks: string[], lastResetDate: string };
    dailyHabits: DailyHabits;
    activeRoutine: RoutineTask | null;
    activeRoutineProgress: ActiveRoutineProgress | null;
    pausedRoutine: {
        routine: RoutineTask;
        stats: WorkoutStats;
        currentStepIndex: number;
        globalTime: number;
    } | null;
    activeRoutineInfo: { id: string; progress: number } | null;
    workoutSummaryData: { historicalEntry: HistorialDeSesionesEntry; newPRs?: string[] } | null;
    cardioLogData: { routine: RoutineTask; stats: WorkoutStats } | null;
}

// --- Library Types ---
export type LibraryTab = 'routines' | 'recipes' | 'exercises';

export interface LibraryItem {
    title: string;
    content: string;
    items?: { name: string; description: string; icon?: IconComponent }[];
}

export interface LibraryCategory {
    category: string;
    items: LibraryItem[];
}

// --- Navigation Types ---
export type FlowState =
    | { type: 'none' }
    | { type: 'recipe'; initial?: Recipe | 'new' }
    | { type: 'routine'; mode?: 'planner' | 'routines'; initialRoutine?: RoutineTask | 'new' }
    | { type: 'exercise'; category?: ExerciseLibraryCategory | null; initialExercise?: Exercise };

// --- App State & Actions ---
export interface AppState {
    ui: UIState;
    profile: ProfileState;
    progress: ProgressState;
    workout: WorkoutState;
    nutrition: NutritionState;
    session: SessionState;
    lastUpdated?: number;
}

export interface Action {
    type: string;
    payload?: unknown;
}

export interface ReplaceStateAction {
    type: 'REPLACE_STATE';
    payload: AppState;
}

export type ThunkAction<ReturnType = void> = (
    dispatch: ThunkDispatch,
    getState: () => AppState
) => ReturnType;

export type ThunkDispatch<ActionType extends Action = Action> = <ReturnType = void>(action: ActionType | ThunkAction<ReturnType>) => ReturnType;
