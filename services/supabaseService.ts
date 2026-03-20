import { getSupabase } from './supabaseClient';
import { Exercise, RoutineTask as Routine, FoodItem, Recipe, AppState } from '../types';
import { createPersistedStateSnapshot, PersistedAppState } from '../statePersistence';

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

// --- SEEDING LOGIC ---
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

// --- FETCHING LOGIC ---
export const fetchStaticData = async (): Promise<{
    foods: FoodItem[];
    exercises: Record<string, Exercise>;
    routines: Routine[];
    recipes: Recipe[];
}> => {
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
            supabase.from('recipes').select('*')
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

// --- USER STATE LOGIC ---
// Since the app relies heavily on a complex Redux state, we will sync the entire state 
// to a 'user_state' table for now to ensure all forms and edits are persisted to the DB.
// In a production app, this would be broken down into individual tables (profiles, logs, etc.)

export const fetchUserState = async (): Promise<PersistedAppState | null> => {
    const supabase = getSupabase();
    if (!supabase) return null;
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;
    
    try {
        const { data, error } = await supabase
            .from('user_state')
            .select('state_json')
            .eq('user_id', session.user.id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                // No rows found
                return null;
            }
            throw error;
        }

        return data.state_json as PersistedAppState;
    } catch (error: unknown) {
        console.error('Error fetching user state from Supabase:', error);
        return null;
    }
};

export const saveUserState = async (state: AppState | PersistedAppState, userId?: string) => {
    const supabase = getSupabase();
    if (!supabase) return;
    
    try {
        const effectiveUserId = userId ?? (await supabase.auth.getSession()).data.session?.user?.id;
        if (!effectiveUserId) return;

        const stateToSave = createPersistedStateSnapshot(state);
        stateToSave.lastUpdated = Date.now();

        const { error } = await supabase
            .from('user_state')
            .upsert({ 
                user_id: effectiveUserId, 
                state_json: stateToSave,
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id' });

        if (error) throw error;
    } catch (error: unknown) {
        console.error('Error saving user state to Supabase:', error);
        throw error;
    }
};
