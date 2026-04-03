import React, { useState, useContext, useMemo, useEffect } from 'react';
import { Recipe, RoutineTask, Exercise, LibraryCategory, DayOfWeek, LibraryTab, FlowState } from '../types';
import { AppContext } from '../contexts';
import * as actions from '../actions';
import * as thunks from '../thunks';
import { selectUserRoutines } from '../selectors/workoutSelectors';
import { 
    CalendarIcon, 
    PlateIcon, 
    StrengthIcon, 
    BookOpenIcon, 
    PlusIcon, 
    SearchIcon, 
    ChevronRightIcon, 
    FireIcon, 
    YogaIcon, 
    PostureIcon, 
    MindsetIcon, 
    ChartBarIcon 
} from '../components/icons';
import Button from '../components/Button';
import SectionHeader from '../components/legacy/SectionHeader';
import PillTabs from '../components/legacy/PillTabs';
import ConfirmationDialog from '../components/dialogs/ConfirmationDialog';
import RecipePreviewCard from '../components/cards/RecipePreviewCard';
import RoutineCard from '../components/cards/RoutineCard';
import { PageHeader } from '../components/layout';
import RecipeFlow from './biblioteca/RecipeViews';
import RoutineFlow from './biblioteca/RoutineViews';
import ExerciseFlow from './biblioteca/ExerciseViews';


const getMusclesWorked = (description: string): string | null => {
    const match = description.match(/\*\*Músculos trabajados:\*\*\s*(.*?)(?=\n\n|$)/);
    return match ? match[1].trim().replace(/\.$/, '') : null;
};

const BibliotecaScreen: React.FC = () => {
    const { state, dispatch } = useContext(AppContext)!;
    const [activeTab, setActiveTab] = useState<LibraryTab>('recipes'); // Default to Recipes
    const [currentFlow, setCurrentFlow] = useState<FlowState>({ type: 'none' });
    const [routineToDelete, setRoutineToDelete] = useState<RoutineTask | null>(null);
    const [exerciseSearchTerm, setExerciseSearchTerm] = useState('');

    // Listener for Navigation Targets (Deep Linking)
    useEffect(() => {
        if (state.ui.navigationTarget === 'library-planner') {
            setActiveTab('routines');
            setCurrentFlow({ type: 'routine', mode: 'planner' });
            // Consume the target
            dispatch(actions.setNavigationTarget(null));
        }
    }, [state.ui.navigationTarget, dispatch]);

    const handleBackToLibrary = () => setCurrentFlow({ type: 'none' });
    const launchFlow = (flow: FlowState) => setCurrentFlow(flow);

    const { myRecipes, favoritedPlanRecipeIds } = state.nutrition;
    const { weeklySchedule } = state.workout;
    const userRoutines = selectUserRoutines(state);

    // ... existing handlers (handleDeleteRoutine, handleQuickLogRecipe) ...
    const handleDeleteRoutine = () => {
        if (routineToDelete) {
            dispatch(actions.deleteUserRoutine(routineToDelete.id));
            setRoutineToDelete(null);
        }
    };

    const handleQuickLogRecipe = (recipe: Recipe) => {
        dispatch(thunks.registerMealThunk(recipe.foods, recipe.name));
    };

    const favoritedRecipes = useMemo(() => {
    // ... existing calculations ...
        const userFavorites = myRecipes.filter(r => r.isFavorite);
        const planFavorites = state.nutrition.allRecipes.filter(r => favoritedPlanRecipeIds.includes(r.id));
        return [...userFavorites, ...planFavorites];
    }, [myRecipes, favoritedPlanRecipeIds, state.nutrition.allRecipes]);
    
    const suggestedRecipes = useMemo(() => state.nutrition.allRecipes.slice(0, 5), [state.nutrition.allRecipes]);

    const weeklyRoutineStatus = useMemo(() => {
        const days: DayOfWeek[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
        return days.map(day => !!weeklySchedule[day] && Object.keys(weeklySchedule[day]!).length > 0);
    }, [weeklySchedule]);

    const exerciseCategories = [
    // ... existing code ...
        { key: 'fuerza' as const, name: 'Fuerza', count: 45, icon: StrengthIcon, color: 'text-brand-protein' },
        { key: 'calentamiento' as const, name: 'Calentamiento', count: 12, icon: FireIcon, color: 'text-orange-400' },
        { key: 'movilidad' as const, name: 'Movilidad', count: 8, icon: YogaIcon, color: 'text-brand-accent' },
        { key: 'estiramiento' as const, name: 'Estiramientos', count: 15, icon: YogaIcon, color: 'text-brand-accent' },
        { key: 'postura' as const, name: 'Postura', count: 10, icon: PostureIcon, color: 'text-blue-400' },
    ];
    
    const allExercises = useMemo(() => Object.values(state.workout.allExercises).sort((a: Exercise, b: Exercise) => a.name.localeCompare(b.name)), [state.workout.allExercises]);

    const exerciseSearchResults = useMemo(() => {
        if (!exerciseSearchTerm.trim()) return [];
        return allExercises.filter(ex => ex.name.toLowerCase().includes(exerciseSearchTerm.toLowerCase()));
    }, [exerciseSearchTerm, allExercises]);

    const renderDashboardContent = () => {
        switch (activeTab) {
            case 'recipes':
                return (
                    <div className="space-y-6">
                        <SectionHeader title="Recetas Destacadas" action={{ label: 'Ver Todo', onClick: () => launchFlow({ type: 'recipe' }) }} />
                        
                        {/* Horizontal Scroll with Premium Cards */}
                        <div className="flex gap-4 overflow-x-auto pb-8 -mx-4 sm:-mx-6 px-4 sm:px-6 hide-scrollbar snap-x snap-mandatory">
                             {/* Create New / Calculator Card - Redesigned to fit new style */}
                             <button 
                                onClick={() => launchFlow({ type: 'recipe', initial: 'new' })}
                                className="snap-start flex-shrink-0 w-40 sm:w-48 aspect-[3/4] flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-surface-border bg-surface-bg/40 hover:bg-surface-hover hover:border-brand-accent/50 transition-all group relative overflow-hidden backdrop-blur-sm"
                             >
                                 <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                 
                                 <div className="w-14 h-14 bg-surface-bg rounded-2xl flex items-center justify-center shadow-inner border border-surface-border group-hover:scale-110 group-hover:bg-brand-accent group-hover:text-bg-base transition-all duration-300">
                                     <PlusIcon className="w-6 h-6 text-text-secondary group-hover:text-bg-base transition-colors" />
                                 </div>
                                 <div className="text-center relative z-10 px-2">
                                     <p className="text-xs font-black text-text-primary uppercase tracking-wider group-hover:text-brand-accent transition-colors">Crear Receta</p>
                                     <p className="text-[9px] text-text-secondary font-medium mt-1">Calculadora Nutricional</p>
                                 </div>
                             </button>

                            {(favoritedRecipes.length > 0 ? favoritedRecipes : suggestedRecipes).map(r => 
                                <div key={r.id} className="snap-start">
                                    <RecipePreviewCard 
                                        recipe={r} 
                                        onClick={() => launchFlow({type: 'recipe', initial: r})} 
                                        onQuickAdd={() => handleQuickLogRecipe(r)}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                );
            case 'routines': {
                const routinesByType = userRoutines.reduce((acc: Record<string, RoutineTask[]>, routine) => {
                    let groupName: string;
                    if (['strength'].includes(routine.type)) groupName = 'Fuerza';
                    else if (['cardio', 'cardioLibre', 'senderismo'].includes(routine.type)) groupName = 'Cardio';
                    else groupName = 'Mental & Movilidad';
                    
                    if (!acc[groupName]) acc[groupName] = [];
                    acc[groupName].push(routine);
                    return acc;
                }, {});
                const groupOrder: string[] = ['Fuerza', 'Cardio', 'Mental & Movilidad'];
            
                return (
                    <div className="space-y-6">
                         {routineToDelete && (
                            <ConfirmationDialog
                                title="Eliminar Rutina"
                                message={`¿Confirma la eliminación de la rutina "${routineToDelete.name}"?`}
                                onConfirm={handleDeleteRoutine}
                                onCancel={() => setRoutineToDelete(null)}
                            />
                        )}
                                              {/* Compact Weekly Plan Status */}
                         <div className="bg-surface-bg border border-surface-border px-4 py-3 rounded-2xl relative overflow-hidden shadow-sm">
                             <div className="flex justify-between items-center mb-3">
                                 <h3 className="text-[10px] font-black text-text-secondary tracking-[0.2em] uppercase flex items-center gap-1.5">
                                     <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
                                     Plan Semanal
                                 </h3>
                                 <Button 
                                     variant="ghost"
                                     size="small"
                                     onClick={() => launchFlow({ type: 'routine', mode: 'planner' })} 
                                 >
                                     Gestionar
                                 </Button>
                             </div>
                            
                            {/* Days Row */}
                            <div className="flex justify-between items-center relative z-10">
                                {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, i) => {
                                    const hasRoutine = weeklyRoutineStatus[i];
                                    return (
                                        <div key={day} className="flex flex-col items-center gap-1.5">
                                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold transition-all duration-300 ${
                                                hasRoutine 
                                                    ? 'bg-brand-accent text-bg-base shadow-[0_0_15px_rgba(var(--color-brand-accent-rgb),0.4)] scale-110' 
                                                    : 'bg-surface-hover text-text-secondary border border-surface-border'
                                            }`}>
                                                {day}
                                            </div>
                                            {/* Small indicator dot below */}
                                            <div className={`w-1 h-1 rounded-full transition-colors ${hasRoutine ? 'bg-brand-accent' : 'bg-transparent'}`}></div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Routine Lists */}
                         <div>
                             <SectionHeader 
                                 title="Mis Rutinas" 
                                 action={{ label: 'Crear', onClick: () => launchFlow({ type: 'routine', mode: 'routines', initialRoutine: 'new' }) }} 
                             />
                            
                            {userRoutines.length > 0 ? (
                                <div className="space-y-5">
                                    {groupOrder.map(groupName => {
                                        const routines = routinesByType[groupName];
                                        if (!routines || routines.length === 0) return null;
                                        
                                        return (
                                            <div key={groupName} className="space-y-2">
                                                <h4 className="text-[9px] font-bold text-text-secondary uppercase tracking-[0.2em] pl-1 opacity-70 mb-2">{groupName}</h4>
                                                {routines.map(r => (
                                                    <RoutineCard 
                                                        key={r.id} 
                                                        routine={r} 
                                                        onClick={() => launchFlow({ type: 'routine', mode: 'routines', initialRoutine: r })} 
                                                        onDelete={r.isUserCreated ? () => setRoutineToDelete(r) : undefined}
                                                    />
                                                ))}
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                 <div className="text-center text-text-secondary py-12 bg-surface-bg rounded-2xl border border-dashed border-surface-border">
                                     <p className="text-xs font-medium uppercase tracking-wide">Sin rutinas asignadas</p>
                                     <Button variant="ghost" size="small" onClick={() => launchFlow({ type: 'routine', mode: 'routines', initialRoutine: 'new' })} className="mt-3">Crear ahora</Button>
                                 </div>
                            )}
                        </div>
                    </div>
                );
            }
            // ... rest of switch cases (exercises, guides) ...
            case 'exercises':
                return (
                     <div className="space-y-5">
                        {/* Search Bar */}
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <SearchIcon className="h-4 w-4 text-text-secondary group-focus-within:text-brand-accent transition-colors" />
                            </div>
                            <input
                                type="search"
                                value={exerciseSearchTerm}
                                onChange={(e) => setExerciseSearchTerm(e.target.value)}
                                placeholder="BUSCAR EJERCICIO..."
                                className="w-full pl-10 pr-4 py-3 bg-surface-hover border border-surface-border rounded-xl focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none transition-all text-xs font-medium text-text-primary placeholder:text-text-secondary/40 placeholder:text-[10px] placeholder:tracking-widest"
                            />
                        </div>

                        {exerciseSearchTerm.trim() ? (
                            <div className="space-y-2">
                                {exerciseSearchResults.length > 0 ? (
                                    exerciseSearchResults.map(ex => (
                                        <button 
                                            key={ex.id} 
                                            onClick={() => launchFlow({ type: 'exercise', initialExercise: ex })}
                                            className="w-full text-left p-3 bg-surface-bg border border-surface-border rounded-xl flex items-center gap-3 hover:bg-surface-hover hover:border-brand-accent/50 transition-all group"
                                        >
                                            <div className="w-9 h-9 rounded-lg bg-black/40 border border-surface-border flex items-center justify-center flex-shrink-0">
                                                <StrengthIcon className="w-4 h-4 text-text-secondary group-hover:text-brand-accent transition-colors" />
                                            </div>
                                            <div className="flex-grow min-w-0">
                                                <h4 className="font-bold text-xs text-text-primary group-hover:text-text-primary transition-colors uppercase tracking-wide">{ex.name}</h4>
                                                <p className="text-[9px] text-text-secondary mt-0.5 truncate uppercase tracking-wider">{getMusclesWorked(ex.description) || 'GENERAL'}</p>
                                            </div>
                                            <ChevronRightIcon className="w-3 h-3 text-text-secondary group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    ))
                                ) : (
                                    <div className="text-center py-12">
                                        <p className="text-text-secondary text-xs uppercase tracking-wide">No se encontraron resultados.</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-3">
                                {exerciseCategories.map(({ key, name, count, icon: Icon, color }) => (
                                    <button 
                                        key={key} 
                                        onClick={() => launchFlow({ type: 'exercise', category: key })}
                                        className="bg-surface-bg border border-surface-border p-4 rounded-xl flex flex-col items-start gap-3 hover:border-brand-accent/50 hover:bg-surface-hover transition-all group relative overflow-hidden shadow-sm"
                                    >
                                        <div className={`p-2.5 rounded-lg bg-surface-hover border border-surface-border group-hover:scale-110 transition-transform ${color}`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-xs text-text-primary uppercase tracking-wider">{name}</h4>
                                            <p className="text-[9px] font-mono text-text-secondary mt-0.5">{count} ITEMS</p>
                                        </div>
                                        {/* Hover Glow */}
                                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                );
            default: return null;
        }
    }

    // ... existing renderContent and return ...
    const renderContent = () => {
        switch (currentFlow.type) {
            case 'recipe': return <RecipeFlow onBack={handleBackToLibrary} initialRecipeState={currentFlow.initial} />;
            case 'routine': return <RoutineFlow onBack={handleBackToLibrary} mode={currentFlow.mode} initialRoutine={currentFlow.initialRoutine} />;
            case 'exercise': return <ExerciseFlow onBack={handleBackToLibrary} category={currentFlow.category} initialExercise={currentFlow.initialExercise} />;
            case 'none':
            default:
                return (
                    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 space-y-5">
                        <PageHeader
                            size="compact"
                            title="Biblioteca"
                            subtitle="Recetas, rutinas y ejercicios en un solo sistema."
                            className="animate-fade-in-up"
                        />

                        <div className="animate-fade-in-up" style={{ animationDelay:'60ms' }}>
                            <PillTabs
                                tabs={[
                                    { id: 'routines',  label: 'Rutinas',    icon: CalendarIcon },
                                    { id: 'recipes',   label: 'Recetas',    icon: PlateIcon    },
                                    { id: 'exercises', label: 'Ejercicios', icon: StrengthIcon },
                                ]}
                                activeTab={activeTab}
                                onChange={(id) => setActiveTab(id as LibraryTab)}
                            />
                        </div>

                        <div className="animate-fade-in-up" style={{ animationDelay: '120ms' }}>
                           {renderDashboardContent()}
                        </div>
                    </div>
                );
        }
    };

    return (
        <div>
            {renderContent()}
        </div>
    );
}

export default BibliotecaScreen;
