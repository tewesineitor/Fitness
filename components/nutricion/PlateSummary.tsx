
import React, { useState, useEffect, useMemo } from 'react';
import { AddedFood, MacroNutrients, MealType, DailyGoals } from '../../types';
import Button from '../Button';
import { TrashIcon, PlusIcon, XIcon, MinusIcon, ChevronRightIcon, CheckCircleIcon, SparklesIcon, FireIcon, ChartBarIcon, PlateIcon } from '../icons';

// --- CONFIGURACIÓN DE LÍMITES POR DEFECTO ---
const DEFAULT_FAT_ABS_MAX = 90;
const DEFAULT_FAT_MIN = 55; 
const DEFAULT_CARB_ABS_MAX = 225;
const DEFAULT_CARB_MIN = 140; 

// --- HELPER: Lógica de Estado ---
const getMacroStatus = (
    currentTotal: number, 
    ideal: number,
    min: number,
    absoluteMax: number,
    dynamicLimit: number
) => {
    const isBelowMin = dynamicLimit < min; 
    const isSqueezed = dynamicLimit < ideal;
    
    const ceiling = Math.min(absoluteMax, dynamicLimit);
    const isFlexing = !isSqueezed && currentTotal > ideal && currentTotal <= ceiling;
    const isOverLimit = currentTotal > ceiling;

    const displayLimit = (currentTotal <= ideal && !isSqueezed) ? ideal : ceiling;
    const displayRemaining = displayLimit - currentTotal;

    let statusText = '';
    let statusColor = 'text-text-secondary';
    
    if (isOverLimit) {
        statusText = 'EXCEDIDO';
        statusColor = 'text-red-500';
    } else if (isBelowMin) {
        statusText = 'DÉFICIT CRÍTICO';
        statusColor = 'text-yellow-500';
    } else if (isFlexing) {
        statusText = 'FLEX';
        statusColor = 'text-orange-400';
    } else if (isSqueezed) {
        statusText = 'REDUCIDO';
        statusColor = 'text-text-primary';
    }

    return { 
        statusText, 
        statusColor, 
        remaining: displayRemaining, 
        displayLimit, 
        ceiling, 
        isBelowMin, 
        isSqueezed, 
        isFlexing, 
        isOverLimit 
    };
};

// --- COMPONENTE: TARJETA COMPACTA (OPTIMIZADA) ---
const CompactMacroCard: React.FC<{
    label: string;
    mealValue: number;
    remaining: number;
    limit: number;
    statusText: string;
    statusColor: string;
    colorClass: string; 
    isCritical?: boolean;
}> = ({ label, mealValue, remaining, limit, statusText, statusColor, colorClass, isCritical }) => (
    <div className={`bg-surface-bg border p-3 rounded-2xl flex flex-col justify-between relative overflow-hidden transition-all h-full ${isCritical ? 'border-yellow-500/40 bg-yellow-500/5' : 'border-surface-border'}`}>
        <div className="flex justify-between items-start mb-1">
            <span className="text-[8px] font-bold text-text-secondary uppercase tracking-[0.2em]">{label}</span>
            {statusText && (
                <span className={`text-[7px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-surface-hover border border-surface-border ${statusColor}`}>
                    {statusText}
                </span>
            )}
        </div>
        
        <div className="flex items-baseline gap-0.5 mb-2">
            <span className={`text-xl font-bold font-mono tracking-tighter leading-none ${colorClass}`}>
                +{mealValue.toFixed(0)}
            </span>
            <span className={`text-[9px] font-bold ${colorClass.replace('text-', 'text-opacity-70 ')}`}>g</span>
        </div>

        <div className="mt-auto pt-2 border-t border-surface-border flex justify-between items-end">
            <span className="text-[7px] text-text-secondary font-bold uppercase tracking-widest opacity-50">Rest.</span>
            <div className="text-right leading-none">
                <span className={`text-[10px] font-mono font-bold ${remaining < 0 ? 'text-red-500' : 'text-text-primary'}`}>
                    {remaining.toFixed(0)}
                </span>
                <span className="text-[8px] text-text-secondary opacity-40 font-bold ml-0.5">
                    /{limit.toFixed(0)}
                </span>
            </div>
        </div>
    </div>
);

// --- COMPONENTE: BARRA EXPANDIDA ---
const UnifiedMacroRow: React.FC<{
    label: string;
    consumed: number; 
    current: number; 
    ideal: number;
    min: number; 
    absoluteMax: number;
    dynamicLimit: number; 
    colorClass: string;
    unit?: string;
    isProtein?: boolean; 
}> = ({ label, consumed, current, ideal, min, absoluteMax, dynamicLimit, colorClass, unit = 'g', isProtein = false }) => {
    
    const totalAfterMeal = consumed + current;
    const { statusText, statusColor, remaining, displayLimit, ceiling, isBelowMin, isSqueezed, isFlexing, isOverLimit } = getMacroStatus(totalAfterMeal, ideal, min, absoluteMax, dynamicLimit);

    if (isProtein) {
        const remainingProt = ideal - totalAfterMeal;
        const totalScale = ideal * 1.2;
        const getPct = (v: number) => Math.min((v/totalScale)*100, 100);
        return (
            <div className="mb-4 last:mb-0">
                <div className="flex justify-between items-end mb-1">
                    <span className={`text-[10px] font-black uppercase tracking-[0.15em] text-text-secondary`}>{label}</span>
                    <div className="flex items-baseline gap-1">
                        <span className={`text-sm font-bold font-mono ${remainingProt < 0 ? 'text-brand-protein' : 'text-text-primary'}`}>{remainingProt.toFixed(0)}</span>
                        <span className="text-[9px] text-text-secondary opacity-50">/ {ideal.toFixed(0)}</span>
                    </div>
                </div>
                <div className="h-2 w-full bg-surface-hover rounded-full relative overflow-hidden border border-surface-border">
                    <div className="absolute top-0 bottom-0 w-0.5 bg-text-primary z-30" style={{ left: `${getPct(ideal)}%` }}></div>
                    <div className="absolute top-0 bottom-0 left-0 bg-text-primary/10 h-full rounded-l-sm" style={{ width: `${getPct(consumed)}%` }}></div>
                    <div className={`absolute top-0 bottom-0 h-full ${colorClass}`} style={{ left: `${getPct(consumed)}%`, width: `${getPct(current)}%` }}></div>
                </div>
            </div>
        );
    }

    const totalScale = absoluteMax * 1.05; 
    const getPct = (val: number) => Math.min((val / totalScale) * 100, 100);
    const consumedPct = getPct(consumed);
    const currentPct = getPct(current);
    const minPct = getPct(min);
    const idealPct = getPct(ideal);
    const ceilingPct = getPct(ceiling); 
    const absMaxPct = getPct(absoluteMax);
    let barColor = colorClass;
    if (isOverLimit) barColor = 'bg-red-500';
    else if (isFlexing) barColor = 'bg-orange-400';

    return (
        <div className="mb-4 last:mb-0">
            <div className="flex justify-between items-end mb-1">
                <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black uppercase tracking-[0.15em] text-text-secondary`}>{label}</span>
                    {statusText && <span className={`text-[7px] font-bold ${statusColor}`}>{statusText}</span>}
                </div>
                <div className="flex items-baseline gap-1">
                    <span className={`text-sm font-bold font-mono ${remaining < 0 ? 'text-red-500' : isFlexing ? 'text-orange-400' : 'text-text-primary'}`}>{remaining.toFixed(0)}</span>
                    <span className="text-[9px] text-text-secondary opacity-50">/ {displayLimit.toFixed(0)}</span>
                </div>
            </div>

            <div className="h-2 w-full bg-surface-hover rounded-md relative overflow-hidden border border-surface-border">
                {/* Fixed: Use style object instead of complex class for gradient to prevent syntax errors */}
                {isSqueezed && (
                    <div 
                        className="absolute top-0 bottom-0 z-0 opacity-30 border-l border-red-500/50" 
                        style={{ 
                            left: `${ceilingPct}%`, 
                            width: `${idealPct - ceilingPct}%`,
                            backgroundImage: 'repeating-linear-gradient(45deg, #ef4444 0, #ef4444 2px, transparent 2px, transparent 6px)' 
                        }}
                    ></div>
                )}
                
                <div className="absolute top-0 bottom-0 w-px bg-yellow-600/50 z-0 dashed" style={{ left: `${minPct}%` }}></div>
                {!isSqueezed && <div className="absolute top-0 bottom-0 w-px bg-text-primary/20 z-0 dashed" style={{ left: `${idealPct}%` }}></div>}
                
                <div className={`absolute top-0 bottom-0 w-0.5 z-30 shadow-[0_0_5px_currentColor] ${isBelowMin ? 'bg-yellow-400' : 'bg-text-primary'}`} style={{ left: `${ceilingPct}%` }}></div>

                <div className="absolute top-0 bottom-0 left-0 bg-text-primary/10 h-full rounded-l-sm" style={{ width: `${consumedPct}%` }}></div>
                <div className={`absolute top-0 bottom-0 h-full transition-all duration-500 ${barColor}`} style={{ left: `${consumedPct}%`, width: `${currentPct}%` }}></div>
            </div>
        </div>
    );
};


interface PlateSummaryProps {
    plate: AddedFood[];
    macros: MacroNutrients; 
    mealName: string;
    onMealNameChange: (name: string) => void;
    onRegister: () => void;
    onClear: () => void;
    selectedMealType: MealType | null;
    onSelectMealType: (type: MealType) => void;
    onUpdateItemPortion: (foodId: string, newPortions: number) => void;
    onEditItemPortion: (item: AddedFood) => void;
    dailyGoals?: DailyGoals;
    consumedMacros?: MacroNutrients; 
    timing?: 'pre-workout' | 'post-workout' | 'general';
    onTimingChange?: (timing: 'pre-workout' | 'post-workout' | 'general') => void;
}

const PlateSummary: React.FC<PlateSummaryProps> = ({ 
    plate, macros, mealName, onMealNameChange, onRegister, onClear, 
    selectedMealType, onSelectMealType, onUpdateItemPortion, onEditItemPortion, dailyGoals, consumedMacros,
    timing, onTimingChange
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showDetailedStats, setShowDetailedStats] = useState(false);
    const [animateKcal, setAnimateKcal] = useState(false);
    
    const totalConsumed = useMemo(() => {
        if (!consumedMacros) return macros;
        return {
            kcal: consumedMacros.kcal + macros.kcal,
            protein: consumedMacros.protein + macros.protein,
            carbs: consumedMacros.carbs + macros.carbs,
            fat: consumedMacros.fat + macros.fat,
        };
    }, [consumedMacros, macros]);

    const { fatLimits, carbLimits } = useMemo(() => {
        if(!dailyGoals) return { 
            fatLimits: { min: DEFAULT_FAT_MIN, max: DEFAULT_FAT_ABS_MAX },
            carbLimits: { min: DEFAULT_CARB_MIN, max: DEFAULT_CARB_ABS_MAX }
        };

        return {
            fatLimits: { min: dailyGoals.fatMin || DEFAULT_FAT_MIN, max: dailyGoals.fatMax || DEFAULT_FAT_ABS_MAX },
            carbLimits: { min: dailyGoals.carbMin || DEFAULT_CARB_MIN, max: dailyGoals.carbMax || DEFAULT_CARB_ABS_MAX }
        }
    }, [dailyGoals]);

    const dynamicData = useMemo(() => {
        if (!dailyGoals) return { fatLimit: 999, carbLimit: 999 };

        const totalFlexibleBudgetKcal = (dailyGoals.carbs * 4) + (dailyGoals.fat * 9);

        const remainingKcalForFat = totalFlexibleBudgetKcal - (totalConsumed.carbs * 4);
        const rawFatLimit = remainingKcalForFat / 9;
        const fatLimit = Math.min(Math.max(0, rawFatLimit), fatLimits.max);

        const remainingKcalForCarbs = totalFlexibleBudgetKcal - (totalConsumed.fat * 9);
        const rawCarbLimit = remainingKcalForCarbs / 4;
        const carbLimit = Math.min(Math.max(0, rawCarbLimit), carbLimits.max);

        return { fatLimit, carbLimit };
    }, [dailyGoals, totalConsumed, fatLimits, carbLimits]);

    const carbStatus = useMemo(() => 
        dailyGoals ? getMacroStatus(totalConsumed.carbs, dailyGoals.carbs, carbLimits.min, carbLimits.max, dynamicData.carbLimit) : null,
    [totalConsumed.carbs, dailyGoals, dynamicData.carbLimit, carbLimits]);

    const fatStatus = useMemo(() => 
        dailyGoals ? getMacroStatus(totalConsumed.fat, dailyGoals.fat, fatLimits.min, fatLimits.max, dynamicData.fatLimit) : null,
    [totalConsumed.fat, dailyGoals, dynamicData.fatLimit, fatLimits]);

    const proteinRemaining = dailyGoals ? dailyGoals.protein - totalConsumed.protein : 0;

    useEffect(() => {
        if (plate.length > 0) {
            setAnimateKcal(true);
            const timer = setTimeout(() => setAnimateKcal(false), 300);
            return () => clearTimeout(timer);
        }
    }, [macros.kcal]);

    const mealTypes: MealType[] = ['Desayuno', 'Almuerzo', 'Cena', 'Colación'];

    if (plate.length === 0) return null;

    if (!isExpanded) {
        return (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up-fade-in w-[94%] max-w-lg">
                <button 
                    onClick={() => setIsExpanded(true)}
                    className="w-full relative group flex items-center justify-between bg-surface-bg/95 backdrop-blur-xl border border-surface-border rounded-[24px] p-3 shadow-2xl active:scale-[0.98] transition-all"
                >
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-14 h-14 bg-surface-hover rounded-[18px] flex items-center justify-center border border-surface-border">
                                <PlateIcon className="w-7 h-7 text-text-primary" />
                            </div>
                            <div className="absolute -top-2 -right-2 bg-text-primary text-bg-base text-[11px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-surface-bg shadow-md z-10">
                                {plate.length}
                            </div>
                        </div>
                        <div className="text-left">
                            <div className="flex items-baseline gap-1.5">
                                <span className={`text-2xl font-black font-mono text-text-primary tracking-tighter ${animateKcal ? 'text-brand-accent scale-110' : ''} transition-all`}>
                                    {macros.kcal.toFixed(0)}
                                </span>
                                <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">kcal</span>
                            </div>
                            <div className="flex gap-3 mt-0.5">
                                <span className="text-[10px] font-bold font-mono text-brand-protein">P: {macros.protein.toFixed(0)}g</span>
                                <span className="text-[10px] font-bold font-mono text-brand-carbs">C: {macros.carbs.toFixed(0)}g</span>
                                <span className="text-[10px] font-bold font-mono text-brand-fat">G: {macros.fat.toFixed(0)}g</span>
                            </div>
                        </div>
                    </div>
                    <div className="w-12 h-12 bg-text-primary text-bg-base rounded-[18px] flex items-center justify-center shadow-lg mr-1">
                        <ChevronRightIcon className="w-6 h-6 -rotate-90" />
                    </div>
                </button>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[60] flex justify-center items-end sm:items-center bg-black/80 backdrop-blur-sm sm:p-4 transition-opacity animate-fade-in">
            <div className="w-full max-w-2xl bg-bg-base sm:rounded-3xl rounded-t-3xl h-[92vh] sm:h-auto sm:max-h-[90vh] flex flex-col shadow-2xl border border-surface-border animate-slide-up overflow-hidden">
                {/* --- Header (Fixed) --- */}
                <header className="flex items-center justify-between p-5 border-b border-surface-border bg-surface-bg z-10">
                    <div className="flex flex-col">
                        <h1 className="text-xl font-black text-text-primary uppercase tracking-tight leading-none">
                            Tu Plato
                        </h1>
                        <span className="text-[10px] font-bold text-brand-accent uppercase tracking-[0.2em] mt-1.5 opacity-80">{selectedMealType}</span>
                    </div>
                    <button 
                        onClick={() => setIsExpanded(false)} 
                        className="p-2.5 bg-surface-hover rounded-full hover:bg-surface-border text-text-secondary hover:text-text-primary transition-all active:scale-90"
                    >
                        <XIcon className="w-5 h-5" />
                    </button>
                </header>

                {/* --- Scrollable Content --- */}
                <div className="flex-grow overflow-y-auto hide-scrollbar bg-bg-base pb-10">
                <div className="px-5 py-6">
                    <div className="flex p-1 bg-surface-hover rounded-2xl border border-surface-border">
                        {mealTypes.map(type => (
                            <button 
                                key={type} 
                                onClick={() => onSelectMealType(type)} 
                                className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl transition-all duration-300 ${
                                    selectedMealType === type 
                                        ? 'bg-surface-bg border border-surface-border text-text-primary shadow-sm' 
                                        : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                                }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="px-6 mb-8">
                    <div className="flex items-end justify-between mb-6 pb-6 border-b border-surface-border">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-brand-accent/5 rounded-2xl border border-brand-accent/10 text-brand-accent">
                                <FireIcon className="w-7 h-7" />
                            </div>
                            <div>
                                <span className="block text-[10px] font-bold text-text-secondary uppercase tracking-[0.25em] mb-1 opacity-60">Energía Total</span>
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-4xl font-bold text-text-primary font-mono tracking-tighter leading-none">{macros.kcal.toFixed(0)}</span>
                                    <span className="text-[11px] text-text-secondary font-bold uppercase tracking-widest">kcal</span>
                                </div>
                            </div>
                        </div>
                        
                        {dailyGoals && consumedMacros && (
                            <button 
                                onClick={() => setShowDetailedStats(!showDetailedStats)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all ${
                                    showDetailedStats 
                                        ? 'bg-text-primary text-surface-bg border-text-primary' 
                                        : 'bg-surface-hover text-text-secondary border-surface-border hover:text-text-primary hover:border-text-primary/30'
                                }`}
                            >
                                {showDetailedStats ? 'Ocultar' : 'Detalles'}
                                <ChartBarIcon className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>

                    {dailyGoals && consumedMacros && carbStatus && fatStatus ? (
                        <>
                            {!showDetailedStats && (
                                <div className="grid grid-cols-3 gap-2 animate-fade-in-up">
                                    <CompactMacroCard 
                                        label="Proteína"
                                        mealValue={macros.protein}
                                        remaining={proteinRemaining}
                                        limit={dailyGoals.protein}
                                        statusText={proteinRemaining < 0 ? 'META+' : ''}
                                        statusColor="text-brand-protein border-brand-protein/30"
                                        colorClass="text-brand-protein"
                                    />
                                    <CompactMacroCard 
                                        label="Carbos"
                                        mealValue={macros.carbs}
                                        remaining={carbStatus.remaining}
                                        limit={carbStatus.displayLimit}
                                        statusText={carbStatus.statusText}
                                        statusColor={carbStatus.statusColor}
                                        colorClass="text-brand-carbs"
                                        isCritical={carbStatus.isBelowMin}
                                    />
                                    <CompactMacroCard 
                                        label="Grasas"
                                        mealValue={macros.fat}
                                        remaining={fatStatus.remaining}
                                        limit={fatStatus.displayLimit}
                                        statusText={fatStatus.statusText}
                                        statusColor={fatStatus.statusColor}
                                        colorClass="text-brand-fat"
                                        isCritical={fatStatus.isBelowMin}
                                    />
                                </div>
                            )}

                            {showDetailedStats && (
                                <div className="space-y-4 animate-fade-in-up">
                                    <UnifiedMacroRow 
                                        label="Proteína"
                                        consumed={consumedMacros.protein}
                                        current={macros.protein}
                                        ideal={dailyGoals.protein}
                                        min={dailyGoals.protein} 
                                        absoluteMax={dailyGoals.protein}
                                        dynamicLimit={dailyGoals.protein} 
                                        colorClass="bg-brand-protein"
                                        isProtein={true}
                                    />
                                    <UnifiedMacroRow 
                                        label="Carbohidratos"
                                        consumed={consumedMacros.carbs}
                                        current={macros.carbs}
                                        ideal={dailyGoals.carbs}
                                        min={carbLimits.min}
                                        absoluteMax={carbLimits.max}
                                        dynamicLimit={dynamicData.carbLimit}
                                        colorClass="bg-brand-carbs"
                                    />
                                    <UnifiedMacroRow 
                                        label="Grasas"
                                        consumed={consumedMacros.fat}
                                        current={macros.fat}
                                        ideal={dailyGoals.fat}
                                        min={fatLimits.min}
                                        absoluteMax={fatLimits.max}
                                        dynamicLimit={dynamicData.fatLimit}
                                        colorClass="bg-brand-fat"
                                    />
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="p-4 bg-surface-bg rounded-xl text-center">
                            <p className="text-xs text-text-secondary">Configura tus metas para ver el presupuesto dinámico.</p>
                        </div>
                    )}
                </div>

                <div className="h-2 bg-bg-base border-y border-surface-border mb-6"></div>

                <div className="px-5">
                    <div className="flex justify-between items-center mb-5 px-1">
                        <label className="text-[10px] font-bold uppercase text-text-secondary tracking-[0.25em] opacity-60">
                            Ingredientes ({plate.length})
                        </label>
                        <button onClick={onClear} className="text-[10px] text-red-400 font-bold hover:text-red-300 flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-red-400/10 transition-all border border-transparent hover:border-red-400/20">
                            <TrashIcon className="w-3.5 h-3.5" /> LIMPIAR
                        </button>
                    </div>
                    
                    <div className="space-y-3">
                        {plate.map(item => {
                            const displayQty = item.portions;
                            const cleanPortion = item.foodItem.standardPortion.split('(')[0].trim();
                            
                            // Calculations for Total Weight based on current portions
                            const totalRaw = item.foodItem.rawWeightG ? item.foodItem.rawWeightG * displayQty : null;
                            const totalCooked = item.foodItem.cookedWeightG ? item.foodItem.cookedWeightG * displayQty : null;

                            // Macros for this specific item
                            const itemProtein = (item.foodItem.macrosPerPortion?.protein || 0) * displayQty;
                            const itemCarbs = (item.foodItem.macrosPerPortion?.carbs || 0) * displayQty;
                            const itemFat = (item.foodItem.macrosPerPortion?.fat || 0) * displayQty;
                            const itemKcal = (item.foodItem.macrosPerPortion?.kcal || 0) * displayQty;

                            return (
                                <div key={item.foodItem.id} className="bg-surface-bg p-3 rounded-2xl flex flex-col gap-2 border border-surface-border hover:border-surface-border/80 transition-all group">
                                    {/* Top Row: Name, Quantity, and Delete */}
                                    <div className="flex justify-between items-center gap-2">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-text-primary text-sm leading-tight truncate">{item.foodItem.name}</p>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <span className="font-medium text-text-secondary text-[10px] truncate">{cleanPortion}</span>
                                                {(totalRaw && totalCooked) ? (
                                                    <>
                                                        <span className="text-text-secondary/40 text-[8px]">•</span>
                                                        <span className="text-[9px] text-text-secondary font-mono">{totalRaw.toFixed(0)}g → {totalCooked.toFixed(0)}g</span>
                                                    </>
                                                ) : (totalRaw && !cleanPortion.includes('g')) && (
                                                    <>
                                                        <span className="text-text-secondary/40 text-[8px]">•</span>
                                                        <span className="text-[9px] text-text-secondary font-mono">{totalRaw.toFixed(0)}g</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => onUpdateItemPortion(item.foodItem.id, 0)}
                                            className="p-1.5 text-text-secondary/50 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-colors flex-shrink-0"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                    
                                    {/* Bottom Row: Macros and Controls */}
                                    <div className="flex items-center justify-between gap-2 mt-1">
                                        {/* Macros */}
                                        <div className="flex gap-2.5 text-[9px] font-mono font-bold">
                                            <div className="flex flex-col">
                                                <span className="text-brand-protein/60 text-[7px] uppercase mb-0.5 leading-none">Prot</span>
                                                <span className="text-brand-protein leading-none">{itemProtein.toFixed(1)}g</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-brand-carbs/60 text-[7px] uppercase mb-0.5 leading-none">Carb</span>
                                                <span className="text-brand-carbs leading-none">{itemCarbs.toFixed(1)}g</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-brand-fat/60 text-[7px] uppercase mb-0.5 leading-none">Gras</span>
                                                <span className="text-brand-fat leading-none">{itemFat.toFixed(1)}g</span>
                                            </div>
                                            <div className="flex flex-col pl-2 ml-0.5 border-l border-surface-border">
                                                <span className="text-text-secondary/60 text-[7px] uppercase mb-0.5 leading-none">Kcal</span>
                                                <span className="text-text-primary leading-none">{itemKcal.toFixed(0)}</span>
                                            </div>
                                        </div>
                                        
                                        {/* Controls */}
                                        <div className="flex items-center bg-surface-hover rounded-xl border border-surface-border overflow-hidden">
                                            <button 
                                                onClick={() => onUpdateItemPortion(item.foodItem.id, item.portions - 0.5)}
                                                className="p-1.5 hover:bg-surface-border text-text-secondary hover:text-text-primary transition-colors"
                                            >
                                                <MinusIcon className="w-3 h-3" />
                                            </button>
                                            <button 
                                                onClick={() => onEditItemPortion(item)}
                                                className="min-w-[2.5rem] text-center font-bold font-mono text-xs text-text-primary hover:text-brand-accent transition-all cursor-pointer"
                                            >
                                                {item.portions.toLocaleString(undefined, {maximumFractionDigits:1})}
                                            </button>
                                            <button 
                                                onClick={() => onUpdateItemPortion(item.foodItem.id, item.portions + 0.5)}
                                                className="p-1.5 hover:bg-surface-border text-text-secondary hover:text-text-primary transition-colors"
                                            >
                                                <PlusIcon className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div className="mt-8 mb-4">
                        <label className="text-[9px] font-bold uppercase text-text-secondary tracking-[0.25em] mb-2.5 block pl-1 opacity-60">
                            Timing de Nutrientes
                        </label>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => onTimingChange?.('pre-workout')}
                                className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all flex items-center justify-center gap-2 ${timing === 'pre-workout' ? 'bg-brand-accent/20 text-brand-accent border-brand-accent shadow-[0_0_15px_rgba(var(--color-brand-accent-rgb),0.2)]' : 'bg-surface-hover text-text-secondary border-surface-border hover:border-brand-accent/30'}`}
                            >
                                <span className="text-sm">⚡</span> Pre-Entreno
                            </button>
                            <button 
                                onClick={() => onTimingChange?.('post-workout')}
                                className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all flex items-center justify-center gap-2 ${timing === 'post-workout' ? 'bg-green-500/20 text-green-400 border-green-500 shadow-[0_0_15px_rgba(74,222,128,0.2)]' : 'bg-surface-hover text-text-secondary border-surface-border hover:border-green-500/30'}`}
                            >
                                <span className="text-sm">🔋</span> Post-Entreno
                            </button>
                        </div>
                    </div>

                    <div className="mb-8">
                        <label className="text-[9px] font-bold uppercase text-text-secondary tracking-[0.25em] mb-2.5 block pl-1 opacity-60">
                            Nombre del Plato
                        </label>
                        <input 
                            type="text" 
                            value={mealName} 
                            onChange={(e) => onMealNameChange(e.target.value)} 
                            placeholder="Ej. 'Comida Post-Entreno'" 
                            className="w-full p-4.5 bg-surface-bg border border-surface-border rounded-2xl text-text-primary placeholder:text-text-secondary/30 focus:border-brand-accent/50 outline-none transition-all text-sm font-bold uppercase tracking-wider"
                        />
                    </div>

                    <div className="mt-6 mb-12 px-4">
                        <Button 
                            onClick={onRegister} 
                            variant="high-contrast"
                            size="large" 
                            className="w-full font-black tracking-[0.2em] text-xs shadow-2xl rounded-2xl py-5"
                            icon={CheckCircleIcon}
                        >
                            REGISTRAR COMIDA
                        </Button>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
};

export default PlateSummary;
