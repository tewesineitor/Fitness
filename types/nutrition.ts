export interface MacroNutrients {
    kcal: number;
    protein: number;
    carbs: number;
    fat: number;
}

export type FoodCategory =
    | 'Grasas y Aceites'
    | 'Carnicería (Pollo)'
    | 'Carnicería (Res)'
    | 'Carnicería (Cerdo)'
    | 'Pescadería'
    | 'Huevo y Lácteos'
    | 'Embutidos'
    | 'Tortillas y Maíz'
    | 'Panadería'
    | 'Cereales y Tubérculos'
    | 'Legumbres'
    | 'Frutas'
    | 'Verduras'
    | 'Semillas y Frutos Secos'
    | 'Condimentos y Salsas'
    | 'Enlatados'
    | 'Calle (Antojitos)'
    | 'Calle (Caldos)'
    | 'Suplementos'
    | 'Untables / Extras';

export interface FoodItem {
    id: string;
    name: string;
    brand?: string;
    category: FoodCategory;
    standardPortion: string;
    rawWeightG?: number;
    cookedWeightG?: number;
    macrosPerPortion: MacroNutrients;
    isUserCreated?: boolean;
    needsReview?: boolean;
}

export interface AddedFood {
    foodItem: FoodItem;
    portions: number;
}

export type MealType = 'Desayuno' | 'Almuerzo' | 'Cena' | 'Colación';

export interface Recipe {
    id: string;
    name: string;
    type: 'plan' | 'user';
    imageUrl?: string;
    mealType?: MealType;
    foods: AddedFood[];
    preparation?: string;
    isFavorite?: boolean;
}

export interface LoggedMeal {
    id: string;
    name?: string;
    foods: AddedFood[];
    macros: MacroNutrients;
    timestamp: Date;
    timing?: 'pre-workout' | 'post-workout' | 'general';
}

export interface NutritionState {
    myRecipes: Recipe[];
    customFoodItems: FoodItem[];
    consumedMacros: MacroNutrients;
    loggedMeals: LoggedMeal[];
    favoritedPlanRecipeIds: string[];
    allFoods: FoodItem[];
    allRecipes: Recipe[];
}
