import { Exercise, FoodItem, Recipe, RoutineTask as Routine } from '../types';
import { getSupabase } from './supabaseClient';

type DefaultStaticData = {
    foods: FoodItem[];
    exercises: Record<string, Exercise>;
    routines: Routine[];
    recipes: Recipe[];
};

type SeedableTable = 'foods' | 'exercises' | 'routines' | 'recipes';

let defaultStaticDataPromise: Promise<DefaultStaticData> | null = null;

const loadDefaultStaticData = async (): Promise<DefaultStaticData> => {
    if (!defaultStaticDataPromise) {
        defaultStaticDataPromise = import('../data').then((module) => ({
            foods: module.foodData,
            exercises: module.exercises,
            routines: module.defaultRoutines,
            recipes: module.recipesData,
        }));
    }

    return defaultStaticDataPromise;
};

const seedTableIfEmpty = async <Row extends { id: string }>(
    table: SeedableTable,
    rows: Row[]
) => {
    const supabase = getSupabase();
    if (!supabase || rows.length === 0) return;

    const { count, error: countError } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

    if (countError) {
        throw countError;
    }

    if (count !== 0) {
        return;
    }

    const { error: upsertError } = await supabase.from(table).upsert(rows, { onConflict: 'id' });
    if (upsertError) {
        throw upsertError;
    }
};

export const seedDatabaseIfEmpty = async () => {
    const supabase = getSupabase();
    if (!supabase) return;

    try {
        const defaults = await loadDefaultStaticData();
        await Promise.all([
            seedTableIfEmpty('foods', defaults.foods),
            seedTableIfEmpty('exercises', Object.values(defaults.exercises)),
            seedTableIfEmpty('routines', defaults.routines),
            seedTableIfEmpty('recipes', defaults.recipes),
        ]);
    } catch (error: unknown) {
        console.error('Error checking/seeding database:', error);
    }
};

export const fetchStaticData = async (): Promise<DefaultStaticData> => {
    const supabase = getSupabase();
    const defaults = await loadDefaultStaticData();
    if (!supabase) {
        return defaults;
    }

    try {
        const [foodsRes, exercisesRes, routinesRes, recipesRes] = await Promise.all([
            supabase.from('foods').select('*'),
            supabase.from('exercises').select('*'),
            supabase.from('routines').select('*'),
            supabase.from('recipes').select('*'),
        ]);

        const foods = foodsRes.data as FoodItem[] || defaults.foods;

        const exercisesArray = exercisesRes.data as Exercise[] || Object.values(defaults.exercises);
        const exercises = exercisesArray.reduce((acc, ex) => {
            acc[ex.id] = ex;
            return acc;
        }, {} as Record<string, Exercise>);

        const routines = routinesRes.data as Routine[] || defaults.routines;
        const recipes = recipesRes.data as Recipe[] || defaults.recipes;

        return { foods, exercises, routines, recipes };
    } catch (error: unknown) {
        console.error('Error fetching static data from Supabase:', error);
        return defaults;
    }
};
