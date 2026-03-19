import { getSupabase } from './supabaseClient';
import { Exercise, RoutineTask as Routine, FoodItem, Recipe, AppState } from '../types';
import { exercises as defaultExercises, defaultRoutines, foodData as defaultFoods, recipesData as defaultRecipes } from '../data';

// --- SEEDING LOGIC ---
export const seedDatabaseIfEmpty = async () => {
    const supabase = getSupabase();
    if (!supabase) return;
    try {
        // Check if foods exist
        const { count: foodCount, error: foodError } = await supabase.from('foods').select('*', { count: 'exact', head: true });
        if (foodError) throw foodError;
        
        if (foodCount === 0) {
            console.log('Seeding foods...');
            const { error } = await supabase.from('foods').upsert(defaultFoods, { onConflict: 'id' });
            if (error) console.error('Error seeding foods:', error);
        }

        // Check if exercises exist
        const { count: exCount, error: exError } = await supabase.from('exercises').select('*', { count: 'exact', head: true });
        if (exError) throw exError;

        if (exCount === 0) {
            console.log('Seeding exercises...');
            const exercisesArray = Object.values(defaultExercises);
            const { error } = await supabase.from('exercises').upsert(exercisesArray, { onConflict: 'id' });
            if (error) console.error('Error seeding exercises:', error);
        }

        // Check if routines exist
        const { count: routineCount, error: routineError } = await supabase.from('routines').select('*', { count: 'exact', head: true });
        if (routineError) throw routineError;

        if (routineCount === 0) {
            console.log('Seeding routines...');
            const { error } = await supabase.from('routines').upsert(defaultRoutines, { onConflict: 'id' });
            if (error) console.error('Error seeding routines:', error);
        }

        // Check if recipes exist
        const { count: recipeCount, error: recipeError } = await supabase.from('recipes').select('*', { count: 'exact', head: true });
        if (recipeError) throw recipeError;

        if (recipeCount === 0) {
            console.log('Seeding recipes...');
            const { error } = await supabase.from('recipes').upsert(defaultRecipes, { onConflict: 'id' });
            if (error) console.error('Error seeding recipes:', error);
        }

        console.log('Database check complete.');
    } catch (error) {
        console.error('Error checking/seeding database:', error);
    }
};

// --- FETCHING LOGIC ---
export const fetchStaticData = async () => {
    const supabase = getSupabase();
    if (!supabase) {
        return {
            foods: defaultFoods,
            exercises: defaultExercises,
            routines: defaultRoutines,
            recipes: defaultRecipes
        };
    }
    try {
        const [foodsRes, exercisesRes, routinesRes, recipesRes] = await Promise.all([
            supabase.from('foods').select('*'),
            supabase.from('exercises').select('*'),
            supabase.from('routines').select('*'),
            supabase.from('recipes').select('*')
        ]);

        const foods = foodsRes.data as FoodItem[] || defaultFoods;
        
        const exercisesArray = exercisesRes.data as Exercise[] || Object.values(defaultExercises);
        const exercises = exercisesArray.reduce((acc, ex) => {
            acc[ex.id] = ex;
            return acc;
        }, {} as Record<string, Exercise>);

        const routines = routinesRes.data as Routine[] || defaultRoutines;
        const recipes = recipesRes.data as Recipe[] || defaultRecipes;

        return { foods, exercises, routines, recipes };
    } catch (error) {
        console.error('Error fetching static data from Supabase:', error);
        return {
            foods: defaultFoods,
            exercises: defaultExercises,
            routines: defaultRoutines,
            recipes: defaultRecipes
        };
    }
};

// --- USER STATE LOGIC ---
// Since the app relies heavily on a complex Redux state, we will sync the entire state 
// to a 'user_state' table for now to ensure all forms and edits are persisted to the DB.
// In a production app, this would be broken down into individual tables (profiles, logs, etc.)

export const fetchUserState = async (): Promise<AppState | null> => {
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

        return data.state_json as AppState;
    } catch (error) {
        console.error('Error fetching user state from Supabase:', error);
        return null;
    }
};

export const saveUserState = async (state: AppState) => {
    const supabase = getSupabase();
    if (!supabase) return;
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;
    
    try {
        // Create a serializable copy of the state
        const stateToSave = JSON.parse(JSON.stringify(state));
        stateToSave.lastUpdated = Date.now();

        // Manually convert Set to Array for storage
        if (state.progress.progressTracker.activityDates instanceof Set) {
            stateToSave.progress.progressTracker.activityDates = Array.from(state.progress.progressTracker.activityDates);
        }

        const { error } = await supabase
            .from('user_state')
            .upsert({ 
                user_id: session.user.id, 
                state_json: stateToSave,
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id' });

        if (error) throw error;
    } catch (error) {
        console.error('Error saving user state to Supabase:', error);
    }
};
