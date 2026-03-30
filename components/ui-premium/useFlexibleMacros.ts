import { useMemo } from 'react';

export interface FlexibleMacroTarget {
  kcal: number;
  protein: number;
  carbMin: number;
  carbIdeal: number;
  carbMax: number;
  fatMin: number;
  fatIdeal: number;
  fatMax: number;
}

export interface FlexibleMacroConsumed {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface UseFlexibleMacrosReturn {
  kcalRemaining: number;
  kcalProgress: number;
  isKcalOver: boolean;

  proteinProgress: number;

  dynamicCarbMax: number;
  dynamicFatMax: number;

  carbProgress: number;
  fatProgress: number;

  isFatMinimumAtRisk: boolean;
  isCarbOverMax: boolean;
  isFatOverMax: boolean;
  isCarbMinMet: boolean;
  isFatMinMet: boolean;
}

export function useFlexibleMacros(
  target: FlexibleMacroTarget,
  consumed: FlexibleMacroConsumed,
): UseFlexibleMacrosReturn {
  return useMemo(() => {
    const kcalRemaining = Math.max(0, target.kcal - consumed.kcal);
    const kcalProgress = target.kcal > 0 ? Math.min(consumed.kcal / target.kcal, 1) : 0;
    const isKcalOver = consumed.kcal > target.kcal;

    const proteinProgress = target.protein > 0
      ? Math.min(consumed.protein / target.protein, 1)
      : 0;

    // ── Bolsa Compartida ─────────────────────────────────────────────────────
    // Total shared calorie budget for carbs + fat (after protein is locked)
    const sharedBudgetKcal = target.carbIdeal * 4 + target.fatIdeal * 9;

    // Dynamic max for fat = how many fat grams fit in what carbs haven't used
    const kcalLeftForFat = sharedBudgetKcal - consumed.carbs * 4;
    const dynamicFatMax = Math.min(Math.max(0, kcalLeftForFat / 9), target.fatMax);

    // Dynamic max for carbs = how many carb grams fit in what fat hasn't used
    const kcalLeftForCarbs = sharedBudgetKcal - consumed.fat * 9;
    const dynamicCarbMax = Math.min(Math.max(0, kcalLeftForCarbs / 4), target.carbMax);

    const carbProgress = target.carbMax > 0
      ? Math.min(consumed.carbs / target.carbMax, 1)
      : 0;
    const fatProgress = target.fatMax > 0
      ? Math.min(consumed.fat / target.fatMax, 1)
      : 0;

    const isCarbOverMax = consumed.carbs > target.carbMax;
    const isFatOverMax = consumed.fat > target.fatMax;
    const isCarbMinMet = consumed.carbs >= target.carbMin;
    const isFatMinMet = consumed.fat >= target.fatMin;

    // Fat minimum at risk: fat still needed can't be covered by remaining kcal
    const fatStillNeeded = Math.max(0, target.fatMin - consumed.fat);
    const kcalNeededForFatMin = fatStillNeeded * 9;
    const isFatMinimumAtRisk = kcalNeededForFatMin > kcalRemaining;

    return {
      kcalRemaining,
      kcalProgress,
      isKcalOver,
      proteinProgress,
      dynamicCarbMax,
      dynamicFatMax,
      carbProgress,
      fatProgress,
      isFatMinimumAtRisk,
      isCarbOverMax,
      isFatOverMax,
      isCarbMinMet,
      isFatMinMet,
    };
  }, [target, consumed]);
}
