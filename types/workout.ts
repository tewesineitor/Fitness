export type RoutineTaskType =
    | 'strength'
    | 'cardio'
    | 'yoga'
    | 'meditation'
    | 'cardioLibre'
    | 'senderismo'
    | 'rucking'
    | 'posture';

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
    weightCarried?: number;
    notes?: string;
}

export type DesgloseEjercicio = DesgloseFuerza | DesgloseTiempo | DesgloseCardioLibre;

export interface HistorialDeSesionesEntry {
    id_sesion: string;
    nombre_rutina: string;
    tipo_rutina: RoutineTaskType;
    fecha_completado: string;
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
    technicalFocus?: string;
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
