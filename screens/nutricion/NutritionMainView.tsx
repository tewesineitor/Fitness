
import React, { useState, useMemo, useContext } from 'react';
import { LoggedMeal, MacroNutrients, DailyGoals } from '../../types';
import { AppContext } from '../../contexts';
import Button from '../../components/Button';
import { ChevronRightIcon, PlusIcon, SunIcon, BowlIcon, AppleIcon, MoonIcon, ArrowDownIcon, TrashIcon, FireIcon, SparklesIcon, ChartBarIcon, PencilIcon, InformationCircleIcon, MoleculeIcon } from '../../components/icons';
import { vibrate } from '../../utils/helpers';
import ConfirmationDialog from '../../components/dialogs/ConfirmationDialog';
import MealEditorModal from '../../components/dialogs/MealEditorModal';
import Modal from '../../components/Modal';
import * as actions from '../../actions';

// --- CONFIGURACIÓN DE LÍMITES POR DEFECTO ---
const DEFAULT_FAT_ABS_MAX = 90;
const DEFAULT_FAT_MIN = 55; 
const DEFAULT_CARB_ABS_MAX = 225;
const DEFAULT_CARB_MIN = 140; 

// --- HELPER: AXIS TICK ---
const AxisTick: React.FC<{ 
    pct: number; 
    label: string; 
    value: number; 
    color?: string; 
    align?: 'left' | 'center' | 'right';
}> = ({ pct, label, value, color = 'text-text-secondary', align = 'center' }) => {
    let translate = '-translate-x-1/2';
    if (align === 'left') translate = '-translate-x-0'; 
    if (align === 'right') translate = '-translate-x-full'; 

    return (
        <div className={`absolute top-0 flex flex-col ${align === 'left' ? 'items-start' : align === 'right' ? 'items-end' : 'items-center'} ${translate}`} style={{ left: `${pct}%` }}>
            <div className={`w-px h-1 mb-1 ${color.replace('text-', 'bg-').split('/')[0] + '/20'}`}></div>
            <span className={`text-[7px] font-bold uppercase tracking-widest leading-none mb-0.5 opacity-60 ${color}`}>{label}</span>
            <span className={`text-[9px] font-bold font-mono leading-none ${color}`}>{value.toFixed(0)}</span>
        </div>
    );
};

// --- COMPONENTE: BARRA AVANZADA ---
const AdvancedMacroRow: React.FC<{
    label: string;
    current: number; 
    ideal: number;
    min: number; 
    absoluteMax: number;
    dynamicLimit: number; 
    colorClass: string;
    unit?: string;
    isProtein?: boolean; 
}> = ({ label, current, ideal, min, absoluteMax, dynamicLimit, colorClass, unit = 'g', isProtein = false }) => {
    
    const totalScale = absoluteMax * 1.05; 
    const getPct = (val: number) => Math.min((val / totalScale) * 100, 100);

    const currentPct = getPct(current);
    const dynamicLimitPct = getPct(dynamicLimit);
    const idealPct = getPct(ideal);
    const minPct = getPct(min);
    const absMaxPct = getPct(absoluteMax);

    const textColorClass = colorClass.replace('bg-', 'text-');

    if (isProtein) {
        const remainingProt = ideal - current;
        const isMet = current >= ideal;
        
        return (
            <div className="mb-8 last:mb-0 relative group">
                <div className="flex justify-between items-end mb-2.5">
                    <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase tracking-widest text-text-secondary`}>{label}</span>
                        <span className="bg-brand-protein/10 text-brand-protein px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wider border border-brand-protein/20">PRIORIDAD</span>
                    </div>
                    <div className="text-right">
                        <div className="flex flex-col items-end">
                            <div className="flex items-baseline gap-1.5">
                                <span className={`text-2xl font-heading font-bold ${remainingProt < 0 ? 'text-brand-protein' : 'text-text-primary'}`}>
                                    {remainingProt < 0 ? '+' + Math.abs(remainingProt).toFixed(0) : remainingProt.toFixed(0)}
                                </span>
                                <span className="text-[10px] font-bold text-text-secondary opacity-40 uppercase tracking-wider">/ {ideal.toFixed(0)} {unit}</span>
                            </div>
                            {isMet && <span className="text-[9px] font-bold text-brand-protein uppercase tracking-widest mt-0.5">META CUMPLIDA</span>}
                        </div>
                    </div>
                </div>
                
                <div className="h-2 w-full bg-surface-hover rounded-full relative overflow-hidden border border-surface-border/50">
                    <div className="absolute top-0 bottom-0 w-0.5 bg-text-primary z-30" style={{ left: `${idealPct}%` }}></div>
                    <div className={`absolute top-0 bottom-0 h-full transition-all duration-1000 ease-out ${colorClass}`} style={{ left: 0, width: `${currentPct}%` }}>
                    </div>
                </div>
                
                <div className="relative w-full h-7 mt-1.5">
                    <AxisTick pct={0} label="" value={0} align="left" color="text-text-secondary/30" />
                    <AxisTick pct={idealPct} label="META" value={ideal} color="text-text-primary" />
                </div>
            </div>
        );
    }

    const isBelowMin = dynamicLimit < min; 
    const isSqueezed = dynamicLimit < ideal;
    
    const ceiling = Math.min(absoluteMax, dynamicLimit);
    const isFlexing = !isSqueezed && current > ideal && current <= ceiling;
    const displayLimit = (current <= ideal && !isSqueezed) ? ideal : ceiling;
    const isOverLimit = current > ceiling;
    const displayRemaining = displayLimit - current;

    let statusText = '';
    let statusColor = 'text-text-secondary';
    let barColor = colorClass;

    if (isOverLimit) {
        statusText = 'EXCEDIDO';
        statusColor = 'text-red-500';
        barColor = 'bg-red-500';
    } else if (isBelowMin) {
        statusText = 'DÉFICIT CRÍTICO';
        statusColor = 'text-yellow-500';
    } else if (isFlexing) {
        statusText = 'FLEX';
        statusColor = 'text-orange-400';
        barColor = 'bg-orange-400';
    } else if (isSqueezed) {
        statusText = 'REDUCIDO';
        statusColor = 'text-text-primary';
    }

    return (
        <div className="mb-8 last:mb-0 relative group">
            <div className="flex justify-between items-end mb-2.5">
                <div className="flex flex-col">
                    <span className={`text-[10px] font-bold uppercase tracking-widest text-text-secondary`}>{label}</span>
                    <div className="flex items-baseline gap-1 mt-1">
                        <span className={`text-2xl font-heading font-bold leading-none ${textColorClass}`}>
                            {current.toFixed(0)}
                        </span>
                        <span className={`text-xs font-bold ${textColorClass} opacity-70`}>{unit}</span>
                    </div>
                </div>
                
                <div className="text-right">
                    <div className="flex flex-col items-end">
                        <div className="flex items-baseline gap-1.5">
                            <span className={`text-2xl font-heading font-bold ${displayRemaining < 0 ? 'text-red-500' : isFlexing ? 'text-orange-400' : 'text-text-primary'}`}>
                                {displayRemaining.toFixed(0)}
                            </span>
                            <span className={`text-[10px] font-bold opacity-40 uppercase tracking-wider ${isBelowMin ? 'text-yellow-500' : 'text-text-secondary'}`}>
                                / {displayLimit.toFixed(0)}
                            </span>
                        </div>
                        {statusText && <span className={`text-[9px] font-bold uppercase tracking-widest mt-0.5 ${statusColor}`}>{statusText}</span>}
                    </div>
                </div>
            </div>

            <div className="h-2 w-full bg-surface-hover rounded-full relative overflow-hidden border border-surface-border/50">
                
                {isBelowMin && (
                    <div 
                        className="absolute top-0 bottom-0 z-10 opacity-40 bg-yellow-500/20" 
                        style={{ 
                            left: `${dynamicLimitPct}%`, 
                            width: `${minPct - dynamicLimitPct}%`, 
                        }}
                    ></div>
                )}

                {isSqueezed && (
                    <div 
                        className="absolute top-0 bottom-0 z-0 opacity-20 bg-red-500/20" 
                        style={{ 
                            left: `${dynamicLimitPct}%`, 
                            width: `${idealPct - dynamicLimitPct}%`, 
                        }}
                    ></div>
                )}

                <div className="absolute top-0 bottom-0 w-px bg-yellow-600/30 z-0" style={{ left: `${minPct}%` }}></div>
                {!isSqueezed && <div className="absolute top-0 bottom-0 w-px bg-text-secondary/20 z-0" style={{ left: `${idealPct}%` }}></div>}
                <div className="absolute top-0 bottom-0 w-px bg-red-500/30 z-0" style={{ left: `${absMaxPct}%` }}></div>

                <div className={`absolute top-0 bottom-0 w-0.5 z-30 ${isBelowMin ? 'bg-yellow-400' : 'bg-text-primary'}`} style={{ left: `${dynamicLimitPct}%` }}></div>

                <div className={`absolute top-0 bottom-0 h-full transition-all duration-1000 ease-out ${barColor}`} style={{ left: 0, width: `${currentPct}%` }}>
                </div>
            </div>
            
            <div className="relative w-full h-8 mt-1.5">
                <AxisTick pct={0} label="" value={0} align="left" color="text-text-secondary/30" />
                <AxisTick pct={minPct} label="MIN" value={min} color="text-yellow-600/70" />

                {isSqueezed && (
                    <AxisTick 
                        pct={dynamicLimitPct} 
                        label={isBelowMin ? "LIMITE" : "AJUSTE"} 
                        value={dynamicLimit} 
                        color={isBelowMin ? "text-yellow-500" : "text-text-primary"} 
                    />
                )}

                {!isSqueezed && (
                    <AxisTick pct={idealPct} label="IDEAL" value={ideal} color="text-text-secondary" />
                )}

                <AxisTick pct={absMaxPct} label="MAX" value={absoluteMax} align="right" color="text-red-500/60" />
            </div>
        </div>
    );
};

const areOnSameDay = (date1: Date, date2: Date) =>
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();

const WeeklySummaryChart: React.FC<{ loggedMeals: LoggedMeal[], dailyGoals: MacroNutrients }> = ({ loggedMeals, dailyGoals }) => {
    const averageMacros = useMemo(() => {
        const today = new Date();
        const macrosByDay: Record<string, MacroNutrients> = {};

        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(today.getDate() - i);
            const dateString = date.toISOString().split('T')[0];
            macrosByDay[dateString] = { kcal: 0, protein: 0, carbs: 0, fat: 0 };
        }

        loggedMeals.forEach(meal => {
            const mealDate = new Date(meal.timestamp);
            const dateString = mealDate.toISOString().split('T')[0];
            if (macrosByDay[dateString]) {
                macrosByDay[dateString].kcal += meal.macros.kcal;
                macrosByDay[dateString].protein += meal.macros.protein;
                macrosByDay[dateString].carbs += meal.macros.carbs;
                macrosByDay[dateString].fat += meal.macros.fat;
            }
        });

        const totalMacros = Object.values(macrosByDay).reduce((acc, dayMacros) => {
            acc.kcal += dayMacros.kcal;
            acc.protein += dayMacros.protein;
            acc.carbs += dayMacros.carbs;
            acc.fat += dayMacros.fat;
            return acc;
        }, { kcal: 0, protein: 0, carbs: 0, fat: 0 });
        
        const numDays = 7;

        return {
            kcal: numDays > 0 ? totalMacros.kcal / numDays : 0,
            protein: numDays > 0 ? totalMacros.protein / numDays : 0,
            carbs: numDays > 0 ? totalMacros.carbs / numDays : 0,
            fat: numDays > 0 ? totalMacros.fat / numDays : 0,
        };
    }, [loggedMeals]);

    const chartItems = [
        { key: 'kcal', label: 'Kcal', colorClass: 'bg-brand-accent', value: averageMacros.kcal, goal: dailyGoals.kcal, unit: '' },
        { key: 'protein', label: 'Prot.', colorClass: 'bg-brand-protein', value: averageMacros.protein, goal: dailyGoals.protein, unit: 'g' },
        { key: 'carbs', label: 'Carbs', colorClass: 'bg-brand-carbs', value: averageMacros.carbs, goal: dailyGoals.carbs, unit: 'g' },
        { key: 'fat', label: 'Grasa', colorClass: 'bg-brand-fat', value: averageMacros.fat, goal: dailyGoals.fat, unit: 'g' },
    ];

    return (
        <section className="bg-surface-bg p-6 rounded-xl relative overflow-hidden border border-surface-border shadow-sm">
            
            <div className="mb-8">
                <h2 className="text-xs font-bold text-text-primary uppercase tracking-widest">Promedio Semanal</h2>
                <p className="text-[9px] text-text-secondary font-bold mt-1 opacity-50 uppercase tracking-widest">ÚLTIMOS 7 DÍAS</p>
            </div>
            
            <div className="relative pt-4">
                <div className="absolute left-0 right-0 top-[calc(50%+0.5rem)] border-t border-dashed border-surface-border z-0">
                    <span className="absolute -top-2.5 right-0 text-[8px] font-bold text-text-secondary/40 bg-surface-bg px-1.5 rounded uppercase tracking-widest">META</span>
                </div>
                
                <div className="grid grid-cols-4 gap-4 h-32 items-end relative z-10">
                    {chartItems.map(item => {
                        const percentage = item.goal > 0 ? Math.min((item.value / item.goal) * 100, 150) : 0; 
                        const barHeight = Math.min(percentage, 100);
                        const overflowHeight = Math.max(0, percentage - 100);

                        return (
                            <div key={item.key} className="flex flex-col h-full items-center justify-end group">
                                <p className="font-bold text-[10px] text-text-primary mb-2 opacity-0 group-hover:opacity-100 transition-opacity absolute top-0 font-mono">{item.value.toFixed(0)}</p>
                                
                                <div className="w-full max-w-[20px] h-full relative flex items-end">
                                    <div className="absolute inset-0 bg-surface-hover rounded-t-sm"></div>
                                    <div className={`w-full rounded-t-sm transition-all duration-1000 ease-out ${item.colorClass}`} style={{ height: `${barHeight}%` }}></div>
                                    {overflowHeight > 0 && (
                                        <div className="absolute bottom-[100%] left-0 right-0 bg-red-500/80 rounded-t-sm transition-all duration-1000 ease-out" style={{ height: `${overflowHeight}%` }}></div>
                                    )}
                                </div>
                                <p className="text-[9px] font-bold text-text-secondary mt-3 uppercase tracking-widest">{item.label}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

// --- NUTRITION SUMMARY UPGRADED ---
const NutritionSummary: React.FC<{ consumed: MacroNutrients; goals: DailyGoals }> = ({ consumed, goals }) => {
    
    const [showInfoModal, setShowInfoModal] = useState(false);

    const fatMin = goals.fatMin || DEFAULT_FAT_MIN;
    const fatMax = goals.fatMax || DEFAULT_FAT_ABS_MAX;
    const carbMin = goals.carbMin || DEFAULT_CARB_MIN;
    const carbMax = goals.carbMax || DEFAULT_CARB_ABS_MAX;

    const idealFat = goals.fat; 
    const idealCarbs = goals.carbs; 

    const totalFlexibleBudgetKcal = (idealCarbs * 4) + (idealFat * 9);

    const remainingKcalForFat = totalFlexibleBudgetKcal - (consumed.carbs * 4);
    const rawFatLimit = remainingKcalForFat / 9;
    const dynamicFatMax = Math.min(Math.max(0, rawFatLimit), fatMax);

    const remainingKcalForCarbs = totalFlexibleBudgetKcal - (consumed.fat * 9);
    const rawCarbLimit = remainingKcalForCarbs / 4;
    const dynamicCarbMax = Math.min(Math.max(0, rawCarbLimit), carbMax);

    const calorieLimit = goals.kcal;
    const remainingKcal = calorieLimit - consumed.kcal;
    const isKcalOver = remainingKcal < 0;
    const kcalPercent = Math.min((consumed.kcal / calorieLimit) * 100, 100);

    return (
        <div className="bg-surface-bg rounded-xl overflow-hidden border border-surface-border shadow-sm">
            {/* Modal de Información */}
            {showInfoModal && (
                <Modal onClose={() => setShowInfoModal(false)} className="max-w-sm">
                    <div className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2.5 bg-brand-accent/10 rounded-xl border border-brand-accent/20">
                                <SparklesIcon className="w-6 h-6 text-brand-accent" />
                            </div>
                            <h3 className="text-lg font-bold text-text-primary uppercase tracking-tight">Dinámica de Energía</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-surface-hover p-4 rounded-xl border border-surface-border">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-2 h-2 rounded-full bg-text-primary"></div>
                                    <h4 className="text-sm font-bold text-text-primary uppercase tracking-widest">Fase Independiente (Ideal)</h4>
                                </div>
                                <p className="text-xs text-text-secondary leading-relaxed">
                                    Mientras estés en zona <strong className="text-text-primary">blanca</strong> (bajo la meta ideal), tus Carbohidratos y Grasas son independientes.
                                    <br/>
                                    "Lo que ves es lo que tienes disponible".
                                </p>
                            </div>

                            <div className="bg-orange-500/10 p-4 rounded-xl border border-orange-500/20">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                                    <h4 className="text-sm font-bold text-orange-400 uppercase tracking-widest">Fase Flex (Compartida)</h4>
                                </div>
                                <p className="text-xs text-text-secondary leading-relaxed">
                                    Si excedes la meta Ideal, entras en una <strong className="text-orange-400">bolsa compartida</strong>. 
                                    <br/><br/>
                                    Ahora ambos macros compiten por las mismas calorías restantes. <strong className="text-text-primary">Si comes más grasa, el límite disponible de carbohidratos bajará automáticamente</strong> para no romper tu techo calórico.
                                </p>
                            </div>
                        </div>

                        <Button onClick={() => setShowInfoModal(false)} className="w-full mt-6" size="medium" variant="primary">Entendido</Button>
                    </div>
                </Modal>
            )}

            {/* 1. Header: Calories HUD */}
            <div className="p-6 pb-5 relative overflow-hidden">
                <div className="flex justify-between items-start relative z-10">
                    <div>
                        <div className="flex items-center gap-2 mb-1.5">
                            <FireIcon className={`w-3.5 h-3.5 ${isKcalOver ? 'text-red-400' : 'text-brand-accent'}`} />
                            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Objetivo Diario</span>
                        </div>
                        <div className="flex items-baseline gap-1.5">
                            <span className={`text-4xl sm:text-5xl font-heading font-bold tracking-tight leading-none ${isKcalOver ? 'text-red-400' : 'text-text-primary'}`}>
                                {consumed.kcal.toFixed(0)}
                            </span>
                            <span className="text-sm font-bold text-text-secondary/40 uppercase tracking-widest">/ {calorieLimit}</span>
                        </div>
                    </div>
                    
                    <div className="text-right">
                        <span className="block text-[9px] font-bold text-text-secondary uppercase tracking-widest mb-1 opacity-60">Restante</span>
                        <div className={`text-3xl font-heading font-bold leading-none ${remainingKcal < 0 ? 'text-red-400' : 'text-brand-accent'}`}>
                            {remainingKcal > 0 ? remainingKcal.toFixed(0) : 0}
                        </div>
                    </div>
                </div>

                <div className="mt-5 h-2 w-full bg-surface-hover rounded-full overflow-hidden border border-surface-border/30">
                    <div 
                        className={`h-full transition-all duration-1000 ease-out relative ${isKcalOver ? 'bg-red-500' : 'bg-text-primary'}`}
                        style={{ width: `${kcalPercent}%` }}
                    >
                    </div>
                </div>
            </div>

            <div className="h-px w-full bg-surface-border"></div>

            {/* 2. Advanced Macros List (Table Style Header) */}
            <div className="p-6 pt-5 pb-5 relative">
                {/* Table Headers */}
                <div className="flex justify-between items-end px-1 border-b border-surface-border pb-2.5 mb-6">
                    <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest opacity-60">
                        Macro
                    </span>
                    <span className="text-[9px] font-bold text-text-secondary uppercase tracking-widest opacity-40">
                        RESTANTE / LIMITE
                    </span>
                </div>

                {/* Protein Section (Priority) */}
                <AdvancedMacroRow 
                    label="Proteína"
                    current={consumed.protein}
                    ideal={goals.protein}
                    min={goals.protein} 
                    absoluteMax={goals.protein}
                    dynamicLimit={goals.protein} 
                    colorClass="bg-brand-protein"
                    isProtein={true}
                />
                
                {/* Shared Energy Block - VISUAL GROUPING */}
                <div className="mt-8 relative pl-4">
                    {/* Visual Connector Line */}
                    <div className="absolute left-0 top-1 bottom-1 w-0.5 rounded-full bg-surface-border opacity-50"></div>
                    
                    {/* Section Header */}
                    <div className="flex items-center gap-2.5 mb-6">
                        <span className="text-[9px] font-bold text-text-secondary uppercase tracking-widest opacity-50 bg-surface-bg pr-2">
                            Balance Energético (Compartido)
                        </span>
                        <button 
                            onClick={() => setShowInfoModal(true)} 
                            className="text-text-secondary hover:text-brand-accent transition-colors p-1"
                            aria-label="Información sobre balance compartido"
                        >
                            <InformationCircleIcon className="w-4 h-4" />
                        </button>
                        <div className="h-px flex-grow bg-surface-border"></div>
                    </div>

                    <AdvancedMacroRow 
                        label="Carbohidratos"
                        current={consumed.carbs}
                        ideal={goals.carbs}
                        min={carbMin}
                        absoluteMax={carbMax}
                        dynamicLimit={dynamicCarbMax}
                        colorClass="bg-brand-carbs"
                    />

                    <AdvancedMacroRow 
                        label="Grasas"
                        current={consumed.fat}
                        ideal={goals.fat}
                        min={fatMin}
                        absoluteMax={fatMax}
                        dynamicLimit={dynamicFatMax}
                        colorClass="bg-brand-fat"
                    />
                </div>
            </div>

            {/* 3. Footer Tip */}
            <div className="px-6 py-4 bg-surface-hover/30 flex items-start gap-3.5 border-t border-surface-border">
                <SparklesIcon className="w-4 h-4 text-brand-accent flex-shrink-0 mt-0.5 opacity-60" />
                <p className="text-[10px] text-text-secondary leading-relaxed font-medium">
                    <span className="text-brand-accent font-bold uppercase tracking-widest mr-1">Cálculo Dinámico:</span> Las barras se ajustan solas. Si excedes el Ideal, entras en modo FLEX y tus macros comparten el presupuesto restante. <button onClick={() => setShowInfoModal(true)} className="underline decoration-brand-accent/30 hover:text-text-primary transition-colors">Ver detalles.</button>
                </p>
            </div>
        </div>
    );
};


interface NutritionMainViewProps {
    onGoToAddFood: () => void;
}

export const NutritionMainView: React.FC<NutritionMainViewProps> = ({ onGoToAddFood }) => {
    const { state, dispatch } = useContext(AppContext)!;
    const { nutrition, profile } = state;
    const [expandedMealId, setExpandedMealId] = useState<string | null>(null);
    const [displayedDate, setDisplayedDate] = useState(new Date());
    const [showDetailedStats, setShowDetailedStats] = useState(false);
    const [mealToDelete, setMealToDelete] = useState<LoggedMeal | null>(null);
    const [mealToEdit, setMealToEdit] = useState<LoggedMeal | null>(null);

    const dailyGoals = profile.dailyGoals;

    const isToday = (someDate: Date) => {
        const today = new Date();
        return someDate.getDate() === today.getDate() &&
               someDate.getMonth() === today.getMonth() &&
               someDate.getFullYear() === today.getFullYear();
    };

    const handlePreviousDay = () => {
        const prevDay = new Date(displayedDate);
        prevDay.setDate(prevDay.getDate() - 1);
        setDisplayedDate(prevDay);
    };

    const handleNextDay = () => {
        if (!isToday(displayedDate)) {
            const nextDay = new Date(displayedDate);
            nextDay.setDate(nextDay.getDate() + 1);
            setDisplayedDate(nextDay);
        }
    };

    const formatDateHeader = (date: Date): string => {
        if (isToday(date)) return "HOY";
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (areOnSameDay(date, yesterday)) return "AYER";
        return date.toLocaleString('es-ES', { day: 'numeric', month: 'long' }).toUpperCase();
    };

    const { mealsForDay, macrosForDay } = useMemo(() => {
        const meals = nutrition.loggedMeals.filter(m => areOnSameDay(new Date(m.timestamp), displayedDate)) ?? [];
        const macros = meals.reduce((acc, meal) => {
            acc.kcal += meal.macros.kcal;
            acc.protein += meal.macros.protein;
            acc.carbs += meal.macros.carbs;
            acc.fat += meal.macros.fat;
            return acc;
        }, { kcal: 0, protein: 0, carbs: 0, fat: 0 });
        return { mealsForDay: meals.sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()), macrosForDay: macros };
    }, [nutrition.loggedMeals, displayedDate]);

    const handleToggleExpand = (mealId: string) => {
        setExpandedMealId(prevId => (prevId === mealId ? null : mealId));
    };

    const handleDeleteClick = (meal: LoggedMeal) => {
        setMealToDelete(meal);
    };

    const handleEditClick = (meal: LoggedMeal) => {
        setMealToEdit(meal);
    };

    const confirmDelete = () => {
        if (mealToDelete) {
            dispatch(actions.deleteLoggedMeal(mealToDelete.id));
            setMealToDelete(null);
        }
    };

    const handleUpdateMeal = (updatedMeal: LoggedMeal) => {
        // If the updated meal has no foods, we treat it as a delete
        if (updatedMeal.foods.length === 0) {
            dispatch(actions.deleteLoggedMeal(updatedMeal.id));
        } else {
            dispatch(actions.updateLoggedMeal(updatedMeal));
        }
        setMealToEdit(null);
    };

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
        <div>
            {mealToEdit && (
                <MealEditorModal 
                    meal={mealToEdit} 
                    onSave={handleUpdateMeal} 
                    onClose={() => setMealToEdit(null)} 
                />
            )}
            
            {mealToDelete && (
                <ConfirmationDialog
                    title="Eliminar Comida"
                    message="¿Estás seguro de que quieres eliminar este registro de comida?"
                    onConfirm={confirmDelete}
                    onCancel={() => setMealToDelete(null)}
                    confirmText="Eliminar"
                />
            )}

            <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
                <header className="animate-fade-in-up flex gap-3 pt-6">
                    <div className="flex-1 flex justify-between items-center bg-surface-bg p-1 rounded-xl border border-surface-border shadow-sm">
                        <Button variant="tertiary" onClick={() => { vibrate(5); handlePreviousDay(); }} icon={ChevronRightIcon} className="!p-2.5 hover:bg-surface-hover rounded-lg [&_svg]:rotate-180 text-text-secondary hover:text-text-primary transition-colors" />
                        <h1 className="text-[11px] font-bold text-text-primary uppercase tracking-[0.2em]">{formatDateHeader(displayedDate)}</h1>
                        <Button variant="tertiary" onClick={() => { vibrate(5); handleNextDay(); }} disabled={isToday(displayedDate)} icon={ChevronRightIcon} className={`!p-2.5 rounded-lg transition-colors ${isToday(displayedDate) ? 'text-surface-border cursor-not-allowed' : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'}`} />
                    </div>
                    
                    {isToday(displayedDate) && (
                        <button 
                            onClick={() => { vibrate(5); onGoToAddFood(); }}
                            className="bg-brand-accent text-white rounded-xl w-14 flex-shrink-0 flex items-center justify-center shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all border border-brand-accent"
                        >
                            <PlusIcon className="w-6 h-6" />
                        </button>
                    )}
                </header>

                {/* MAIN SUMMARY (New Advanced Version) */}
                <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                    <NutritionSummary consumed={macrosForDay} goals={dailyGoals} />
                </div>
                
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
                                        <button onClick={() => { vibrate(5); handleToggleExpand(meal.id); }} className="w-full flex justify-between items-center p-4">
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
                                                        onClick={(e) => { e.stopPropagation(); vibrate(5); handleEditClick(meal); }}
                                                        className="p-2 rounded-lg text-text-secondary hover:text-brand-accent hover:bg-surface-hover transition-colors"
                                                        title="Editar"
                                                    >
                                                        <PencilIcon className="w-3.5 h-3.5" />
                                                    </button>
                                                    
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); vibrate(10); handleDeleteClick(meal); }}
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
                
                <section className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                    <WeeklySummaryChart loggedMeals={nutrition.loggedMeals} dailyGoals={dailyGoals} />
                </section>
            </div>
        </div>
    );
}

export default NutritionMainView;
