export interface HistorialDeMetricasEntry {
    id_registro: string;
    fecha_registro: string;
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
