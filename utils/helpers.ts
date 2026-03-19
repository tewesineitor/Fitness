import { MacroNutrients, AddedFood } from '../types';

export const calculateMacros = (foods: AddedFood[]): MacroNutrients => {
    return foods.reduce((acc, item) => {
        // Added safety checks for missing foodItem or macrosPerPortion
        const itemMacros = item.foodItem?.macrosPerPortion;
        
        if (itemMacros) {
            acc.kcal += (itemMacros.kcal || 0) * item.portions;
            acc.protein += (itemMacros.protein || 0) * item.portions;
            acc.carbs += (itemMacros.carbs || 0) * item.portions;
            acc.fat += (itemMacros.fat || 0) * item.portions;
        }
        return acc;
    }, { kcal: 0, protein: 0, carbs: 0, fat: 0 });
};

export const foodImageMap: Record<string, string> = {
    'chicken': 'https://images.unsplash.com/photo-1598515213692-5f282438d334?q=80&w=400&auto=format&fit=crop',
    'beef': 'https://images.unsplash.com/photo-1603048297172-c925e471a83a?q=80&w=400&auto=format&fit=crop',
    'salmon': 'https://images.unsplash.com/photo-1599043513900-ed6fe01d3833?q=80&w=400&auto=format&fit=crop',
    'tuna': 'https://images.unsplash.com/photo-1595197873138-03f844a491e4?q=80&w=400&auto=format&fit=crop',
    'eggs': 'https://images.unsplash.com/photo-1587486913049-53fc889c07cf?q=80&w=400&auto=format&fit=crop',
    'oaxaca': 'https://images.unsplash.com/photo-1618113824130-9598287c8a67?q=80&w=400&auto=format&fit=crop',
    'yogurt': 'https://images.unsplash.com/photo-1562114703-45ca5b883446?q=80&w=400&auto=format&fit=crop',
    'protein-powder': 'https://images.unsplash.com/photo-1639414923294-4b573d40a02c?q=80&w=400&auto=format&fit=crop',
    'milk': 'https://images.unsplash.com/photo-1550583724-b2692b2ae389?q=80&w=400&auto=format&fit=crop',
    'rice': 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?q=80&w=400&auto=format&fit=crop',
    'pasta': 'https://images.unsplash.com/photo-1588583649503-a5a415512255?q=80&w=400&auto=format&fit=crop',
    'oats': 'https://images.unsplash.com/photo-1520690025582-7f82729f12d8?q=80&w=400&auto=format&fit=crop',
    'potato': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=400&auto=format&fit=crop',
    'tortilla': 'https://images.unsplash.com/photo-1598103442387-03597d141b5a?q=80&w=400&auto=format&fit=crop',
    'bread': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=400&auto=format&fit=crop',
    'banana': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?q=80&w=400&auto=format&fit=crop',
    'avocado': 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?q=80&w=400&auto=format&fit=crop',
    'olive-oil': 'https://images.unsplash.com/photo-1626186455243-73a794b15112?q=80&w=400&auto=format&fit=crop',
    'almonds': 'https://images.unsplash.com/photo-1609353494793-9c869c11a2f1?q=80&w=400&auto=format&fit=crop',
    'peanut-butter': 'https://images.unsplash.com/photo-1615485736034-3ab1a0446706?q=80&w=400&auto=format&fit=crop',
    'lettuce': 'https://images.unsplash.com/photo-1556817411-31ae72fa3ea0?q=80&w=400&auto=format&fit=crop',
    'spinach': 'https://images.unsplash.com/photo-1576045057995-568f588f21fb?q=80&w=400&auto=format&fit=crop',
    'cucumber': 'https://images.unsplash.com/photo-1628868664919-141a05581135?q=80&w=400&auto=format&fit=crop',
    'broccoli': 'https://images.unsplash.com/photo-1587351177733-a03ef19df1de?q=80&w=400&auto=format&fit=crop',
    'carrot': 'https://images.unsplash.com/photo-1590868309235-ea34bed7bd7f?q=80&w=400&auto=format&fit=crop',
    'tomato': 'https://images.unsplash.com/photo-1591300937841-11910903c1cf?q=80&w=400&auto=format&fit=crop',
    'default': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop',
};

export const defaultRecipeImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop';

export const vibrate = (pattern: number | number[] = 10) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(pattern);
    }
};