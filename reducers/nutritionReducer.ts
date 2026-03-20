
import { NutritionState, Recipe, FoodItem, LoggedMeal } from '../types';
import type { AppAction } from '../actions';
import * as actionTypes from '../actions/actionTypes';

export const initialNutritionState: NutritionState = {
    myRecipes: [],
    customFoodItems: [],
    consumedMacros: { kcal: 0, protein: 0, carbs: 0, fat: 0 },
    loggedMeals: [],
    favoritedPlanRecipeIds: [],
    allFoods: [],
    allRecipes: [],
};

export const nutritionReducer = (state: NutritionState = initialNutritionState, action: AppAction): NutritionState => {
    switch (action.type) {
        case actionTypes.REGISTER_MEAL: {
             const { mealItems, name, timing } = action.payload;
             const mealMacros = mealItems.reduce((acc, item) => {
                 acc.kcal += item.foodItem.macrosPerPortion.kcal * item.portions;
                 acc.protein += item.foodItem.macrosPerPortion.protein * item.portions;
                 acc.carbs += item.foodItem.macrosPerPortion.carbs * item.portions;
                 acc.fat += item.foodItem.macrosPerPortion.fat * item.portions;
                 return acc;
             }, { kcal: 0, protein: 0, carbs: 0, fat: 0 });

             const newConsumedMacros = {
                 kcal: state.consumedMacros.kcal + mealMacros.kcal,
                 protein: state.consumedMacros.protein + mealMacros.protein,
                 carbs: state.consumedMacros.carbs + mealMacros.carbs,
                 fat: state.consumedMacros.fat + mealMacros.fat,
             };
             
             const newMeal: LoggedMeal = { id: `meal-${Date.now()}`, name, foods: mealItems, macros: mealMacros, timestamp: new Date(), timing };
             const newLoggedMeals = [newMeal, ...state.loggedMeals];

             return { ...state, consumedMacros: newConsumedMacros, loggedMeals: newLoggedMeals };
        }
        case actionTypes.UPDATE_LOGGED_MEAL: {
            const updatedMeal: LoggedMeal = action.payload;
            const oldMealIndex = state.loggedMeals.findIndex(m => m.id === updatedMeal.id);
            
            if (oldMealIndex === -1) return state;

            const oldMeal = state.loggedMeals[oldMealIndex];

            // 1. Revert macros from old meal
            let newConsumedMacros = {
                kcal: state.consumedMacros.kcal - oldMeal.macros.kcal,
                protein: state.consumedMacros.protein - oldMeal.macros.protein,
                carbs: state.consumedMacros.carbs - oldMeal.macros.carbs,
                fat: state.consumedMacros.fat - oldMeal.macros.fat,
            };

            // 2. Calculate new macros for the updated meal
            const newMealMacros = updatedMeal.foods.reduce((acc, item) => {
                 acc.kcal += item.foodItem.macrosPerPortion.kcal * item.portions;
                 acc.protein += item.foodItem.macrosPerPortion.protein * item.portions;
                 acc.carbs += item.foodItem.macrosPerPortion.carbs * item.portions;
                 acc.fat += item.foodItem.macrosPerPortion.fat * item.portions;
                 return acc;
            }, { kcal: 0, protein: 0, carbs: 0, fat: 0 });

            updatedMeal.macros = newMealMacros;

            // 3. Add new macros to total
            newConsumedMacros = {
                kcal: newConsumedMacros.kcal + newMealMacros.kcal,
                protein: newConsumedMacros.protein + newMealMacros.protein,
                carbs: newConsumedMacros.carbs + newMealMacros.carbs,
                fat: newConsumedMacros.fat + newMealMacros.fat,
            };

            // 4. Update array
            const newLoggedMeals = [...state.loggedMeals];
            newLoggedMeals[oldMealIndex] = updatedMeal;

            return { ...state, consumedMacros: newConsumedMacros, loggedMeals: newLoggedMeals };
        }
        case actionTypes.DELETE_LOGGED_MEAL: {
            const mealToDelete = state.loggedMeals.find(m => m.id === action.payload);
            if (!mealToDelete) return state;

            const newConsumedMacros = {
                kcal: state.consumedMacros.kcal - mealToDelete.macros.kcal,
                protein: state.consumedMacros.protein - mealToDelete.macros.protein,
                carbs: state.consumedMacros.carbs - mealToDelete.macros.carbs,
                fat: state.consumedMacros.fat - mealToDelete.macros.fat,
            };
            const newLoggedMeals = state.loggedMeals.filter(m => m.id !== action.payload);
            return { ...state, consumedMacros: newConsumedMacros, loggedMeals: newLoggedMeals };
        }
        case actionTypes.ADD_MY_RECIPE: {
            const newRecipe: Recipe = { ...action.payload, id: `my-recipe-${Date.now()}`, type: 'user' };
            return { ...state, myRecipes: [...state.myRecipes, newRecipe] };
        }
        case actionTypes.UPDATE_MY_RECIPE: {
            const newMyRecipes = state.myRecipes.map(r => r.id === action.payload.id ? action.payload : r);
            return { ...state, myRecipes: newMyRecipes };
        }
        case actionTypes.DELETE_MY_RECIPE: {
            const newMyRecipes = state.myRecipes.filter(r => r.id !== action.payload);
            return { ...state, myRecipes: newMyRecipes };
        }
        case actionTypes.ADD_CUSTOM_FOOD: {
            const newFood: FoodItem = { ...action.payload, id: `custom-${action.payload.name.replace(/\s+/g, '-')}-${Date.now()}`, isUserCreated: true };
            return { ...state, customFoodItems: [...state.customFoodItems, newFood] };
        }
        case actionTypes.SAVE_USER_MODIFIED_FOOD: {
            const updatedFood = action.payload;
            const existingIndex = state.customFoodItems.findIndex(f => f.id === updatedFood.id);
            let newCustomFoods;

            if (existingIndex > -1) {
                // Update existing item in custom list
                newCustomFoods = [...state.customFoodItems];
                newCustomFoods[existingIndex] = updatedFood;
            } else {
                // Add edited default item to custom list
                newCustomFoods = [...state.customFoodItems, updatedFood];
            }
            
            const newMyRecipes = state.myRecipes.map(recipe => ({
                ...recipe,
                foods: recipe.foods.map(addedFood => addedFood.foodItem.id === updatedFood.id ? { ...addedFood, foodItem: updatedFood } : addedFood)
            }));
            
            return { ...state, customFoodItems: newCustomFoods, myRecipes: newMyRecipes };
        }
        case actionTypes.RESET_EDITED_DEFAULT_FOOD: {
            const foodIdToReset = action.payload;
            const newCustomFoods = state.customFoodItems.filter(f => f.id !== foodIdToReset);
             return { ...state, customFoodItems: newCustomFoods };
        }
        case actionTypes.DELETE_CUSTOM_FOOD: {
             const newCustomFoods = state.customFoodItems.filter(f => f.id !== action.payload);
             return { ...state, customFoodItems: newCustomFoods };
        }
        case actionTypes.TOGGLE_RECIPE_FAVORITE: {
            const recipeId = action.payload;
            const userRecipeIndex = state.myRecipes.findIndex(r => r.id === recipeId);

            // Handle user recipes
            if (userRecipeIndex > -1) {
                const newMyRecipes = [...state.myRecipes];
                const recipeToUpdate = { ...newMyRecipes[userRecipeIndex] };
                recipeToUpdate.isFavorite = !recipeToUpdate.isFavorite;
                newMyRecipes[userRecipeIndex] = recipeToUpdate;
                return { ...state, myRecipes: newMyRecipes };
            }

            // Handle plan recipes
            const isFavorited = state.favoritedPlanRecipeIds.includes(recipeId);
            if (isFavorited) {
                return {
                    ...state,
                    favoritedPlanRecipeIds: state.favoritedPlanRecipeIds.filter(id => id !== recipeId),
                };
            } else {
                return {
                    ...state,
                    favoritedPlanRecipeIds: [...state.favoritedPlanRecipeIds, recipeId],
                };
            }
        }
        default:
            return state;
    }
};
