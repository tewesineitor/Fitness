import type { IconComponent } from './common';
import type { Exercise, ExerciseLibraryCategory, RoutineTask } from './workout';
import type { Recipe } from './nutrition';

export type LibraryTab = 'routines' | 'recipes' | 'exercises';

export interface LibraryItem {
    title: string;
    content: string;
    items?: { name: string; description: string; icon?: IconComponent }[];
}

export interface LibraryCategory {
    category: string;
    items: LibraryItem[];
}

export type FlowState =
    | { type: 'none' }
    | { type: 'recipe'; initial?: Recipe | 'new' }
    | { type: 'routine'; mode?: 'planner' | 'routines'; initialRoutine?: RoutineTask | 'new' }
    | { type: 'exercise'; category?: ExerciseLibraryCategory | null; initialExercise?: Exercise };
