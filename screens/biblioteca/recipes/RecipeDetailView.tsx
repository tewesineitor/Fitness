
import React, { useMemo, useContext, useEffect } from 'react';
import { Recipe, MacroNutrients } from '../../../types';
import Button from '../../../components/Button';
import { ChevronRightIcon, PencilIcon, StarIcon, CheckIcon, PlateIcon, FireIcon } from '../../../components/icons';
import { AppContext } from '../../../contexts';
import { calculateMacros } from '../../../utils/helpers';
import * as thunks from '../../../thunks';
import * as actions from '../../../actions';

const defaultRecipeImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop';

// --- COMPONENTS ---

const DetailMacroItem: React.FC<{ label: string; value: number; unit?: string; colorClass: string }> = ({ label, value, unit = 'g', colorClass }) => (
    <div className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-surface-bg border border-surface-border relative overflow-hidden group">
        <div className={`absolute top-0 w-full h-0.5 ${colorClass} opacity-50`}></div>
        <span className="text-xl font-black text-text-primary group-hover:scale-110 group-active:scale-95 transition-transform">{value.toFixed(0)}<span className="text-[9px] font-bold text-text-secondary ml-0.5">{unit}</span></span>
        <span className="text-[8px] font-bold text-text-secondary uppercase tracking-widest mt-0.5">{label}</span>
    </div>
);

const RecipeDetailView: React.FC<{ recipe: Recipe, onBack: () => void, onGoToEditor: () => void }> = ({ recipe, onBack, onGoToEditor }) => {
    const { state, dispatch } = useContext(AppContext)!;
    const macros = useMemo(() => calculateMacros(recipe.foods), [recipe.foods]);
    const imageUrl = recipe.imageUrl || defaultRecipeImage;

    // Asegurar que el Navbar esté oculto al entrar en el detalle
    useEffect(() => {
        dispatch(actions.setBottomNavVisible(false));
        return () => {
            // No es estrictamente necesario restaurarlo aquí si la navegación principal lo maneja,
            // pero es buena práctica de limpieza.
        };
    }, [dispatch]);

    const handleRegister = () => {
        dispatch(thunks.registerMealThunk(recipe.foods, recipe.name));
        onBack();
    };

    const handleCustomize = () => {
        dispatch(actions.setMealBuilderState({ foods: recipe.foods, mealName: recipe.name }));
        dispatch(actions.setActiveScreen('Nutrición'));
    };

    const isFavorite = useMemo(() => {
        if (recipe.type === 'user') {
            const userRecipe = state.nutrition.myRecipes.find(r => r.id === recipe.id);
            return !!userRecipe?.isFavorite;
        }
        return state.nutrition.favoritedPlanRecipeIds.includes(recipe.id);
    }, [recipe, state.nutrition.myRecipes, state.nutrition.favoritedPlanRecipeIds]);
    
    const handleToggleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation();
        dispatch(actions.toggleRecipeFavorite(recipe.id));
    };

    return (
        <div className="h-full w-full relative flex flex-col">
            
            {/* 1. Fixed Header Controls (Always on top) */}
            <div className="fixed top-0 left-0 right-0 z-40 p-4 max-w-3xl mx-auto flex justify-between items-start pointer-events-none">
                <Button 
                    variant="tertiary" 
                    onClick={onBack} 
                    icon={ChevronRightIcon} 
                    className="pointer-events-auto bg-surface-bg/40 backdrop-blur-md !p-3 rounded-full border border-surface-border text-text-primary hover:bg-surface-bg/60 [&_svg]:rotate-180 shadow-lg active:scale-95"
                />
                
                <div className="flex gap-2 pointer-events-auto">
                    <button
                        onClick={handleToggleFavorite}
                        className={`p-3 rounded-full backdrop-blur-md border transition-all shadow-sm active:scale-95 ${
                            isFavorite 
                                ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400' 
                                : 'bg-surface-bg/40 border-surface-border text-text-primary hover:bg-surface-bg/60'
                        }`}
                    >
                        <StarIcon className="w-5 h-5" />
                    </button>
                    {recipe.type === 'user' && (
                        <button onClick={onGoToEditor} className="p-3 bg-surface-bg/40 backdrop-blur-md border border-surface-border rounded-full text-text-primary hover:bg-surface-bg/60 transition-all shadow-sm active:scale-95">
                            <PencilIcon className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>

            {/* 2. Scrollable Container */}
            <div className="hide-scrollbar">
                
                {/* Hero Section (Image + Title Overlay) */}
                <div className="relative w-full h-[55vh]">
                    <img 
                        src={imageUrl} 
                        alt={recipe.name} 
                        className="w-full h-full object-cover" 
                    />
                    
                    {/* Strong Gradient for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/40 to-transparent"></div>
                    
                    {/* Title Overlay Positioned at Bottom of Image */}
                    <div className="absolute bottom-16 left-0 right-0 px-6 pb-2 z-10">
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-brand-accent/20 border border-brand-accent/30 mb-3 backdrop-blur-md">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-accent shadow-[0_0_5px_currentColor]"></div>
                            <span className="text-[9px] font-bold text-text-primary uppercase tracking-widest">{recipe.mealType || 'General'}</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black text-text-primary uppercase tracking-tight leading-none drop-shadow-sm">
                            {recipe.name}
                        </h1>
                    </div>
                </div>

                {/* Content Sheet (Overlaps Image) */}
                {/* Reduced padding from pb-36 to pb-28 */}
                <div className="relative z-20 -mt-12 bg-bg-base rounded-t-[2.5rem] px-5 pt-8 pb-6 border-t border-surface-border min-h-[50vh] shadow-lg flex flex-col gap-4">
                    
                    {/* Handle Bar Visual */}
                    <div className="w-12 h-1 bg-white/10 rounded-full mx-auto -mb-1"></div>

                    {/* Macro Matrix */}
                    <div className="grid grid-cols-4 gap-2">
                        <DetailMacroItem label="Kcal" value={macros.kcal} unit="" colorClass="bg-brand-accent" />
                        <DetailMacroItem label="Prot" value={macros.protein} colorClass="bg-brand-protein" />
                        <DetailMacroItem label="Carb" value={macros.carbs} colorClass="bg-brand-carbs" />
                        <DetailMacroItem label="Fat" value={macros.fat} colorClass="bg-brand-fat" />
                    </div>

                    {/* Ingredients */}
                    <div>
                        <h3 className="text-xs font-bold text-text-secondary uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                            <PlateIcon className="w-4 h-4" /> Ingredientes
                        </h3>
                        <div className="space-y-2">
                            {recipe.foods.map((food, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-surface-bg/50 border border-surface-border hover:bg-surface-hover hover:border-surface-border/80 transition-colors group">
                                    <span className="font-bold text-sm text-text-primary group-hover:text-text-primary transition-colors">{food.foodItem.name}</span>
                                    <span className="text-[10px] font-mono text-text-secondary bg-surface-bg/40 px-2 py-1 rounded border border-surface-border">{food.portions} x {food.foodItem.standardPortion}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Instructions */}
                    <div>
                        <h3 className="text-xs font-bold text-text-secondary uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                            <FireIcon className="w-4 h-4" /> Instrucciones
                        </h3>
                        <div className="p-5 rounded-2xl bg-surface-bg border border-surface-border relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-brand-accent/20"></div>
                            <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap font-medium">{recipe.preparation || "Sin instrucciones."}</p>
                        </div>
                    </div>

                    {/* Action Buttons (Static at end of scroll) */}
                    <div className="mt-4 flex flex-col gap-3">
                        <Button onClick={handleRegister} variant="high-contrast" size="large" className="w-full py-4 shadow-sm shadow-brand-accent/20 text-xs hover:shadow-brand-accent/40 animate-pulse-subtle active:scale-[0.98] transition-all" icon={CheckIcon}>
                            REGISTRAR CONSUMO
                        </Button>
                        <Button onClick={handleCustomize} variant="secondary" size="large" className="w-full py-4 font-bold tracking-widest text-xs active:scale-[0.98] transition-all" icon={PlateIcon}>
                            PERSONALIZAR EN MI PLATO
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipeDetailView;
