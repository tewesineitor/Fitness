
import * as actionTypes from './actionTypes';
import { AddedFood, Recipe, FoodItem, LoggedMeal } from '../types';

export const registerMeal = (payload: { mealItems: AddedFood[], name?: string, timing?: 'pre-workout' | 'post-workout' | 'general' }) => ({ type: actionTypes.REGISTER_MEAL, payload } as const);
export const updateLoggedMeal = (payload: LoggedMeal) => ({ type: actionTypes.UPDATE_LOGGED_MEAL, payload } as const);
export const deleteLoggedMeal = (payload: string) => ({ type: actionTypes.DELETE_LOGGED_MEAL, payload } as const);
export const addMyRecipe = (payload: Omit<Recipe, 'id' | 'type'>) => ({ type: actionTypes.ADD_MY_RECIPE, payload } as const);
export const updateMyRecipe = (payload: Recipe) => ({ type: actionTypes.UPDATE_MY_RECIPE, payload } as const);
export const deleteMyRecipe = (payload: string) => ({ type: actionTypes.DELETE_MY_RECIPE, payload } as const);
export const addCustomFood = (payload: Omit<FoodItem, 'id'>) => ({ type: actionTypes.ADD_CUSTOM_FOOD, payload } as const);
export const saveUserModifiedFood = (payload: FoodItem) => ({ type: actionTypes.SAVE_USER_MODIFIED_FOOD, payload } as const);
export const resetEditedDefaultFood = (payload: string) => ({ type: actionTypes.RESET_EDITED_DEFAULT_FOOD, payload } as const);
export const deleteCustomFood = (payload: string) => ({ type: actionTypes.DELETE_CUSTOM_FOOD, payload } as const);
export const toggleRecipeFavorite = (payload: string) => ({ type: actionTypes.TOGGLE_RECIPE_FAVORITE, payload } as const);
