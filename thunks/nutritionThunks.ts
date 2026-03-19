
import { ThunkAction, AddedFood, Recipe, FoodItem, MacroNutrients } from '../types';
import * as actions from '../actions';
import * as thunks from '../thunks';
import * as aiService from '../services/aiService';
import { selectCustomFoodItems } from '../selectors/nutritionSelectors';


export const registerMealThunk = (mealItems: AddedFood[], name?: string, timing?: 'pre-workout' | 'post-workout' | 'general'): ThunkAction => (dispatch) => {
    dispatch(actions.registerMeal({ mealItems, name, timing }));
    dispatch(thunks.showToastThunk('✓ Comida registrada en tu diario'));
};

export const generateRecipeThunk = (prompt: string): ThunkAction<Promise<{ success: true, data: Omit<Recipe, 'id' | 'type' | 'imageUrl'> } | { success: false, error: string }>> => async (dispatch, getState) => {
    const state = getState();
    const customFoodItems = selectCustomFoodItems(state);
    
    const allFoods = state.nutrition.allFoods;
    
    const foodMap = new Map<string, FoodItem>();
    allFoods.forEach(food => foodMap.set(food.id, food));
    customFoodItems.forEach(food => foodMap.set(food.id, food));
    const allFoodData = Array.from(foodMap.values());
    
    const result = await aiService.generateRecipe(prompt, allFoodData);

    return result;
};

export const fetchProductByBarcodeThunk = (barcode: string): ThunkAction<Promise<any | null>> => async (dispatch) => {
    try {
        const response = await fetch(`https://mx.openfoodfacts.org/api/v2/product/${barcode}.json`);

        if (response.status === 404) {
            dispatch(thunks.showToastThunk('Producto no encontrado en la base de datos'));
            return null;
        }

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        
        if (data.status === 1 && data.product) {
            dispatch(thunks.showToastThunk('✓ Producto encontrado'));
            return data.product;
        } else {
            dispatch(thunks.showToastThunk('Producto no encontrado en la base de datos'));
            return null;
        }
    } catch (error) {
        console.error("Error fetching product by barcode:", error);
        dispatch(thunks.showToastThunk('Error de red al buscar'));
        return null;
    }
};

export const processScannedProductThunk = (productData: any): ThunkAction<Promise<{ foodItem: FoodItem | null; needsConfirmation: boolean }>> => async (dispatch) => {
    const aiResult = await aiService.analyzeNutritionData(productData);

    if (aiResult.success && aiResult.data.kcal !== null && aiResult.data.kcal > 0) {
        const analyzed = aiResult.data;
        
        // Ensure consistency if AI determines it's a 100g serving
        if (analyzed.servingName?.trim().toLowerCase() === '100 g' && analyzed.servingWeightG !== 100) {
            analyzed.servingWeightG = 100;
        }

        const aiMacros: MacroNutrients = {
            kcal: analyzed.kcal || 0,
            protein: analyzed.proteinG || 0,
            carbs: analyzed.carbsG || 0,
            fat: analyzed.fatG || 0,
        };

        const foodItem: FoodItem = {
            id: `off-${productData.code}`,
            name: productData.product_name || 'Nombre Desconocido',
            brand: productData.brands || undefined,
            category: analyzed.category || 'Suplementos',
            standardPortion: analyzed.servingName || '1 porción',
            rawWeightG: analyzed.servingWeightG || undefined,
            macrosPerPortion: aiMacros,
            isUserCreated: false,
            needsReview: analyzed.correctionApplied, // Needs review if AI had to correct it
        };
        
        return { foodItem, needsConfirmation: analyzed.correctionApplied };
    }

    // --- FINAL FALLBACK: AI failed, return a skeleton item for manual entry ---
    console.error("AI analysis failed. Returning skeleton item for manual review.");
    const foodItem: FoodItem = {
        id: `off-${productData.code}`,
        name: productData.product_name || 'Nombre Desconocido',
        brand: productData.brands || undefined,
        category: 'Suplementos',
        standardPortion: '1 porción',
        rawWeightG: undefined,
        macrosPerPortion: { kcal: 0, protein: 0, carbs: 0, fat: 0 },
        isUserCreated: false,
        needsReview: true,
    };
    return { foodItem, needsConfirmation: false }; // Go directly to editor as it's empty
};


export const extractNutritionDataThunk = (
    base64Image: string,
    mimeType: string
): ThunkAction<Promise<aiService.ExtractedNutritionData | null>> => async (dispatch) => {
    const result = await aiService.extractNutritionDataFromImage(base64Image, mimeType);

    if (result.success === false) {
        dispatch(thunks.showToastThunk(result.error));
        return null;
    }

    dispatch(thunks.showToastThunk('✓ Datos extraídos con IA'));
    return result.data;
};