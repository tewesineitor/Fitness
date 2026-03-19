
import React, { useMemo, useContext } from 'react';
import { Recipe } from '../../types';
import { PlusIcon, FireIcon, PlateIcon } from '../icons';
import { calculateMacros, defaultRecipeImage } from '../../utils/helpers';
import { AppContext } from '../../contexts';
import * as actions from '../../actions';

interface RecipePreviewCardProps {
    recipe: Recipe;
    onClick: () => void;
    onQuickAdd?: () => void;
}

const RecipePreviewCard: React.FC<RecipePreviewCardProps> = ({ recipe, onClick, onQuickAdd }) => {
    const { dispatch } = useContext(AppContext)!;
    const macros = useMemo(() => calculateMacros(recipe.foods), [recipe.foods]);
    const imageUrl = recipe.imageUrl || defaultRecipeImage;

    const handleCustomize = (e: React.MouseEvent) => {
        e.stopPropagation();
        dispatch(actions.setMealBuilderState({ foods: recipe.foods, mealName: recipe.name }));
        dispatch(actions.setActiveScreen('Nutrición'));
    };

    return (
        <div 
            onClick={onClick}
            className="relative w-40 sm:w-48 aspect-[3/4] flex-shrink-0 rounded-3xl overflow-hidden group cursor-pointer bg-surface-bg border border-surface-border snap-start transition-all hover:scale-[1.02] active:scale-95 shadow-sm"
        >
            {/* Background Image */}
            <img 
                src={imageUrl} 
                alt={recipe.name} 
                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" 
                loading="lazy"
            />
            
            {/* Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/20 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent opacity-60"></div>

            {/* Top Badge */}
            <div className="absolute top-3 left-3">
                <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-surface-border text-[8px] font-bold text-white uppercase tracking-widest">
                    {recipe.mealType || 'General'}
                </span>
            </div>

            {/* Action Buttons */}
            <div className="absolute top-3 right-3 flex flex-col gap-2">
                {onQuickAdd && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); onQuickAdd(); }}
                        className="w-7 h-7 flex items-center justify-center rounded-full bg-brand-accent text-black shadow-lg hover:scale-110 active:scale-90 transition-all z-10"
                        title="Registrar Rápido"
                    >
                        <PlusIcon className="w-4 h-4" />
                    </button>
                )}
                <button 
                    onClick={handleCustomize}
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-black/60 backdrop-blur-md border border-surface-border text-text-primary shadow-lg hover:bg-brand-accent hover:text-bg-base hover:scale-110 active:scale-90 transition-all z-10"
                    title="Cargar a Mi Plato"
                >
                    <PlateIcon className="w-4 h-4" />
                </button>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                <h4 className="font-black text-text-primary text-sm leading-tight line-clamp-2 uppercase tracking-tight mb-2 drop-shadow-md">
                    {recipe.name}
                </h4>
                
                <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-text-secondary">
                            {macros.protein.toFixed(0)}g Prot
                        </span>
                    </div>
                    <div className="flex items-center gap-1 text-brand-accent">
                        <FireIcon className="w-3 h-3" />
                        <span className="text-xs font-black leading-none">{macros.kcal.toFixed(0)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipePreviewCard;
