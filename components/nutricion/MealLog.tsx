import React from 'react';
import { LoggedMeal } from '../../types';
import { SunIcon, BowlIcon, AppleIcon, MoonIcon, ArrowDownIcon, TrashIcon, PencilIcon } from '../icons';
import { vibrate } from '../../utils/helpers';

interface MealLogProps {
    mealsForDay: LoggedMeal[];
    expandedMealId: string | null;
    onToggleExpand: (mealId: string) => void;
    onEditClick: (meal: LoggedMeal) => void;
    onDeleteClick: (meal: LoggedMeal) => void;
}

export const MealLog: React.FC<MealLogProps> = ({
    mealsForDay,
    expandedMealId,
    onToggleExpand,
    onEditClick,
    onDeleteClick
}) => {
    const getMealIcon = (meal: LoggedMeal): React.FC<{className?: string}> => {
        const name = (meal.name || '').toLowerCase();
        if (name.includes('desayuno')) return SunIcon;
        if (name.includes('comida') || name.includes('almuerzo')) return BowlIcon;
        if (name.includes('merienda') || name.includes('colación')) return AppleIcon;
        if (name.includes('cena')) return MoonIcon;
        
        const hour = new Date(meal.timestamp).getHours();
        if (hour < 11) return SunIcon;
        if (hour < 16) return BowlIcon;
        if (hour < 20) return AppleIcon;
        return MoonIcon;
    };

    return (
        <section className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
             <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-brand-accent rounded-full"></div>
                    Bitácora de Comidas
                </h2>
                <span className="text-[9px] font-bold text-text-secondary/40 uppercase tracking-widest">{mealsForDay.length} {mealsForDay.length === 1 ? 'REGISTRO' : 'REGISTROS'}</span>
             </div>

            <div className="space-y-3">
                {mealsForDay.length > 0 ? (
                    mealsForDay.map(meal => {
                        const Icon = getMealIcon(meal);
                        const isExpanded = expandedMealId === meal.id;

                        return (
                            <div key={meal.id} className={`bg-surface-bg border ${isExpanded ? 'border-brand-accent/30 shadow-md' : 'border-surface-border shadow-sm'} rounded-xl transition-all duration-300 overflow-hidden`}>
                                <button onClick={() => { vibrate(5); onToggleExpand(meal.id); }} className="w-full flex justify-between items-center p-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2.5 rounded-lg border transition-colors ${isExpanded ? 'bg-brand-accent/10 border-brand-accent/20 text-brand-accent' : 'bg-surface-hover border-surface-border text-text-secondary'}`}>
                                            <Icon className="w-5 h-5"/>
                                        </div>
                                        <div className="text-left">
                                            <h3 className="text-[13px] font-bold text-text-primary uppercase tracking-tight">{meal.name || new Date(meal.timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</h3>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-[11px] font-bold text-text-primary font-mono">{meal.macros.kcal.toFixed(0)} kcal</span>
                                                <span className="text-surface-border text-[10px]">|</span>
                                                <div className="flex gap-2 text-[10px] font-bold font-mono">
                                                    <span className="text-brand-protein">{meal.macros.protein.toFixed(0)}p</span>
                                                    <span className="text-brand-carbs">{meal.macros.carbs.toFixed(0)}c</span>
                                                    <span className="text-brand-fat">{meal.macros.fat.toFixed(0)}f</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        {/* Actions Container */}
                                        <div className="flex items-center gap-0.5 mr-2">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); vibrate(5); onEditClick(meal); }}
                                                className="p-2 rounded-lg text-text-secondary hover:text-brand-accent hover:bg-surface-hover transition-colors"
                                                title="Editar"
                                            >
                                                <PencilIcon className="w-3.5 h-3.5" />
                                            </button>
                                            
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); vibrate(10); onDeleteClick(meal); }}
                                                className="p-2 rounded-lg text-text-secondary hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                                title="Eliminar"
                                            >
                                                <TrashIcon className="w-3.5 h-3.5" />
                                            </button>
                                        </div>

                                        <div className={`p-1.5 rounded-lg text-text-secondary transition-transform duration-300 border ${isExpanded ? 'rotate-180 bg-brand-accent/10 border-brand-accent/20 text-brand-accent' : 'bg-surface-hover border-surface-border'}`}>
                                            <ArrowDownIcon className="w-3.5 h-3.5"/>
                                        </div>
                                    </div>
                                </button>
                                
                                {isExpanded && (
                                     <div className="px-4 pb-4 pt-0 animate-fade-in-up">
                                        <div className="h-px w-full bg-surface-border mb-4"></div>
                                        
                                        {/* Macro Grid */}
                                        <div className="grid grid-cols-4 gap-2 mb-4 bg-surface-hover/40 p-3 rounded-lg border border-surface-border">
                                            <div className="text-center">
                                                <span className="block text-xs font-bold text-text-primary font-mono">{meal.macros.kcal.toFixed(0)}</span>
                                                <span className="text-[8px] text-text-secondary uppercase font-bold tracking-widest opacity-60">Kcal</span>
                                            </div>
                                            <div className="text-center border-l border-surface-border">
                                                <span className="block text-xs font-bold text-brand-protein font-mono">{meal.macros.protein.toFixed(0)}g</span>
                                                <span className="text-[8px] text-text-secondary uppercase font-bold tracking-widest opacity-60">Prot</span>
                                            </div>
                                            <div className="text-center border-l border-surface-border">
                                                <span className="block text-xs font-bold text-brand-carbs font-mono">{meal.macros.carbs.toFixed(0)}g</span>
                                                <span className="text-[8px] text-text-secondary uppercase font-bold tracking-widest opacity-60">Carb</span>
                                            </div>
                                            <div className="text-center border-l border-surface-border">
                                                <span className="block text-xs font-bold text-brand-fat font-mono">{meal.macros.fat.toFixed(0)}g</span>
                                                <span className="text-[8px] text-text-secondary uppercase font-bold tracking-widest opacity-60">Fat</span>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            {meal.foods.map((food, index) => {
                                                const { foodItem, portions } = food;
                                                const cleanPortion = foodItem.standardPortion.split('(')[0].trim();
                                                
                                                const totalRaw = foodItem.rawWeightG ? foodItem.rawWeightG * portions : null;
                                                const totalCooked = foodItem.cookedWeightG ? foodItem.cookedWeightG * portions : null;

                                                return (
                                                    <div key={index} className="flex flex-col border-b border-surface-border last:border-0 pb-2.5 pt-2 last:pb-0 group">
                                                        <div className="flex justify-between items-baseline gap-3">
                                                            <span className="font-bold text-[11px] text-text-primary uppercase tracking-tight truncate">{foodItem.name}</span>
                                                            <span className="text-[9px] text-text-secondary font-bold font-mono flex-shrink-0 bg-surface-hover px-1.5 py-0.5 rounded border border-surface-border">
                                                                <span className="text-brand-accent">{portions.toLocaleString(undefined, {maximumFractionDigits: 1})}</span>
                                                                <span className="opacity-40 mx-1">×</span>
                                                                <span className="opacity-70">{cleanPortion}</span>
                                                            </span>
                                                        </div>

                                                        {(totalRaw || totalCooked) && (
                                                            <div className="flex items-center gap-2 text-[9px] text-text-secondary/60 font-bold font-mono mt-1.5">
                                                                <div className="w-1 h-1 rounded-full bg-surface-border"></div>
                                                                {totalRaw && (
                                                                    <span>{totalRaw.toFixed(0)}g CRUDO</span>
                                                                )}
                                                                {totalRaw && totalCooked && (
                                                                    <span className="text-brand-accent/40">→</span>
                                                                )}
                                                                {totalCooked && (
                                                                    <span>{totalCooked.toFixed(0)}g COCIDO</span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-16 bg-surface-bg/20 rounded-xl border border-dashed border-surface-border p-6">
                        <div className="w-12 h-12 bg-surface-hover rounded-full flex items-center justify-center mx-auto mb-4 text-text-secondary/30">
                            <BowlIcon className="w-6 h-6" />
                        </div>
                        <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Sin registros para este día</p>
                        <p className="text-[9px] text-text-secondary/50 font-bold mt-1 uppercase tracking-widest max-w-[200px] mx-auto">TOCA EL BOTÓN "+" PARA COMENZAR</p>
                    </div>
                )}
            </div>
        </section>
    );
};
