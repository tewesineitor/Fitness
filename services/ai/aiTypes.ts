import type { FoodCategory, MealType } from '../../types';

export interface ExtractedNutritionData {
    serving_size_string: string | null;
    protein_g: number | null;
    carbs_g: number | null;
    fat_g: number | null;
}

export interface ExtractedActivityData {
    distance_km: number | null;
    duration_min: number | null;
    calories_kcal: number | null;
    avg_heart_rate_ppm: number | null;
    elevation_gain_m: number | null;
    weight_carried_kg?: number | null;
}

export interface GeneratedRecipeResponse {
    name: string;
    mealType: MealType;
    foods: Array<{ foodItemId: string; portions: number }>;
    preparation: string;
}

export interface OpenFoodFactsProductData {
    [key: string]: unknown;
    code?: string;
    product_name?: string;
    brands?: string;
}

export interface AnalyzedProductResponse {
    kcal: number | null;
    protein_g: number | null;
    carbs_g: number | null;
    fat_g: number | null;
    serving_name: string | null;
    serving_weight_g: number | null;
    category: FoodCategory | null;
    correction_applied: boolean;
}

export interface AnalyzedProductData {
    kcal: number | null;
    proteinG: number | null;
    carbsG: number | null;
    fatG: number | null;
    servingName: string | null;
    servingWeightG: number | null;
    category: FoodCategory | null;
    correctionApplied: boolean;
}
