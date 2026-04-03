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
    bodyGoalWeightKg: number | null;
    theme: Theme;
    customMantra: string;
}
