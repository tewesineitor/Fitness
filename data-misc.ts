import { DailyGoals } from './types';

export const dailyGoals: DailyGoals = {
  kcal: 2000,
  protein: 150,
  carbs: 195,
  fat: 70,
  fatMin: 55,
  fatMax: 90,
  carbMin: 140,
  carbMax: 225,
};

export const cacoMethodData = [
    { week: 1, runInterval: 60, walkInterval: 120, repetitions: 7 },
    { week: 2, runInterval: 120, walkInterval: 120, repetitions: 5 },
    { week: 3, runInterval: 180, walkInterval: 120, repetitions: 4 },
    { week: 4, runInterval: 240, walkInterval: 120, repetitions: 3 },
    { week: 5, runInterval: 300, walkInterval: 120, repetitions: 3 },
    { week: 6, runInterval: 420, walkInterval: 180, repetitions: 2 },
    { week: 7, runInterval: 480, walkInterval: 120, repetitions: 2 },
    { week: 8, runInterval: 540, walkInterval: 120, repetitions: 2 },
];
