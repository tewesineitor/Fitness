
import { AppState, MacroNutrients } from '../types';

export const selectNutritionState = (state: AppState) => state.nutrition;
export const selectMyRecipes = (state: AppState) => state.nutrition.myRecipes;
export const selectCustomFoodItems = (state: AppState) => state.nutrition.customFoodItems;
export const selectLoggedMeals = (state: AppState) => state.nutrition.loggedMeals;

export const selectConsumedMacros = (state: AppState): MacroNutrients => {
    const today = new Date();
    
    // Helper to check if two dates are the same calendar day
    const isSameDay = (d1: Date, d2: Date) => 
        d1.getDate() === d2.getDate() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getFullYear() === d2.getFullYear();

    const loggedMeals = state.nutrition.loggedMeals || [];
    
    return loggedMeals.reduce((acc, meal) => {
        // Ensure we work with a Date object
        const mealDate = meal.timestamp instanceof Date ? meal.timestamp : new Date(meal.timestamp);
        
        if (isSameDay(mealDate, today)) {
            return {
                kcal: acc.kcal + (meal.macros.kcal || 0),
                protein: acc.protein + (meal.macros.protein || 0),
                carbs: acc.carbs + (meal.macros.carbs || 0),
                fat: acc.fat + (meal.macros.fat || 0),
            };
        }
        return acc;
    }, { kcal: 0, protein: 0, carbs: 0, fat: 0 });
};
