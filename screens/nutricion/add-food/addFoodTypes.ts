import { FoodItem } from '../../../types';

export type FoodCategory = FoodItem['category'];
export type MainCategory = 'Todos' | 'Proteínas' | 'Carbohidratos' | 'Frutas y Verduras' | 'Grasas' | 'Preparados';
export type ProcessingState = 'fetching' | 'analyzing' | null;
