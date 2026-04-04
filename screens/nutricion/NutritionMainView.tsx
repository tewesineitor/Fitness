import React from 'react';
import type { LoggedMeal } from '../../types';
import { useNutritionLogic } from './hooks/useNutritionLogic';
import MealEditorModal from '../../components/dialogs/MealEditorModal';
import ConfirmationDialog from '../../components/dialogs/ConfirmationDialog';
import { ChevronRightIcon, PencilIcon, PlusIcon, TrashIcon } from '../../components/icons';
import { vibrate } from '../../utils/helpers';

const ChevronDown: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

// ── Arc math ─────────────────────────────────────────────────────────────────
const CIRC = 2 * Math.PI * 40; // ≈ 251.33

// ── Sub: barra de macro simple (Proteína) ───────────────────────────────────
const MacroBar: React.FC<{
    label: string; value: number; goalG: number; pct: number;
    trackClass: string; fillClass: string; labelClass: string;
}> = ({ label, value, goalG, pct, trackClass, fillClass, labelClass }) => (
    <div className="space-y-2">
        <div className="flex justify-between text-xs font-black uppercase tracking-widest">
            <span className={labelClass}>{label}</span>
            <span className="text-zinc-100 font-semibold tabular-nums">
                {Math.round(value)}g
                <span className="text-zinc-600 font-normal"> / {goalG}g</span>
            </span>
        </div>
        <div className={`h-3 rounded-full overflow-hidden ${trackClass}`}>
            <div
                className={`h-full rounded-full transition-all duration-700 ${fillClass}`}
                style={{ width: `${pct}%` }}
            />
        </div>
    </div>
);

// ── Sub: barra de macro inteligente con notch de mínimo ──────────────────────
const SmartMacroBar: React.FC<{
    label: string;
    spentG: number;    // consumido actualmente
    targetG: number;   // meta ideal
    floorG: number;    // mínimo innegociable
    maxG: number;      // límite absoluto (track base)
    minMet: boolean;   // bandera del hook
    fillClass: string;
    glowClass: string;
    labelClass: string;
}> = ({ label, spentG, targetG, floorG, maxG, minMet, fillClass, glowClass, labelClass }) => {
    const safeMax  = Math.max(maxG, spentG, 1);
    const fillPct  = Math.min((spentG / safeMax) * 100, 100);
    const notchPct = Math.min((floorG / safeMax) * 100, 100);

    return (
        <div className="space-y-2">
            <div className="flex items-baseline justify-between">
                <span className={`text-xs font-black uppercase tracking-widest ${labelClass}`}>{label}</span>
                <span className="text-xs text-zinc-100 font-semibold tabular-nums">
                    {Math.round(spentG)}g
                    <span className="text-zinc-500 font-normal"> / {targetG}g</span>
                </span>
            </div>
            <div className="relative h-3 bg-zinc-800 rounded-full overflow-visible">
                <div
                    className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 ${
                        minMet ? `${fillClass} ${glowClass}` : `${fillClass} opacity-50`
                    }`}
                    style={{ width: `${fillPct}%` }}
                />
                <div
                    className="absolute top-0 bottom-0 w-[2px] bg-white/70 z-10 rounded-full"
                    style={{ left: `${notchPct}%` }}
                    title={`Mínimo: ${floorG}g`}
                />
            </div>
        </div>
    );
};

// ── Sub: tarjeta mutable de macro (3 estados) ─────────────────────────────────
const SmartMacroCard: React.FC<{
    label: string;
    spentG: number;
    floorG: number;
    maxG: number;
    availableG: number;
    minMet: boolean;
    overMax: boolean;
    accentClass: string;     // color del icono/número en zona flexible
    iconBgClass: string;     // bg del icono
    iconChar: string;
}> = ({ label, spentG, floorG, maxG, availableG, minMet, overMax, accentClass, iconBgClass, iconChar }) => {
    const missingG  = Math.round(Math.max(0, floorG - spentG));
    const overageG  = Math.round(Math.max(0, spentG - maxG));

    if (overMax) {
        return (
            <div className="bg-red-500/10 border border-red-500/30 rounded-[1.25rem] p-5 flex items-center justify-between">
                <div>
                    <p className="text-[9px] font-black uppercase text-red-400 tracking-widest mb-1">{label}</p>
                    <p className="text-3xl font-heading font-black text-red-400 leading-none">
                        0<span className="text-sm font-normal text-red-500/70 ml-1">g</span>
                    </p>
                    <p className="text-[10px] text-red-400 mt-1">Límite excedido por {overageG}g</p>
                </div>
                <div className="w-11 h-11 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-red-400 font-black text-lg leading-none">!</span>
                </div>
            </div>
        );
    }

    if (minMet) {
        return (
            <div className={`bg-zinc-900/60 border border-zinc-800/60 rounded-[1.25rem] p-5 flex items-center justify-between` + ` border-l-2 border-l-${accentClass.replace('text-', '')}`} style={{ borderLeftColor: 'currentColor' }}>
                <div>
                    <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${accentClass}`}>{label}</p>
                    <p className="text-3xl font-heading font-black text-white leading-none">
                        {Math.round(availableG)}<span className="text-sm font-normal text-zinc-400 ml-1">g</span>
                    </p>
                    <p className="text-[10px] text-zinc-400 mt-1">Disp. hasta el máx ({maxG}g)</p>
                </div>
                <div className={`w-11 h-11 ${iconBgClass} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <span className={`${accentClass} font-black text-lg leading-none`}>{iconChar}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-[1.25rem] p-5 flex items-center justify-between">
            <div>
                <p className="text-[9px] font-black uppercase text-zinc-500 tracking-widest mb-1">{label}</p>
                <p className="text-3xl font-heading font-black text-white leading-none">
                    {missingG}<span className="text-sm font-normal text-zinc-400 ml-1">g</span>
                </p>
                <p className="text-[10px] text-zinc-400 mt-1">Faltan para el mínimo ({floorG}g)</p>
            </div>
            <div className="w-11 h-11 bg-zinc-800/80 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-zinc-500 font-black text-lg leading-none">{iconChar}</span>
            </div>
        </div>
    );
};

// ── Componente principal ──────────────────────────────────────────────────────

interface NutritionMainViewProps {
    onGoToAddFood: () => void;
}

export const NutritionMainView: React.FC<NutritionMainViewProps> = ({ onGoToAddFood }) => {
    const n = useNutritionLogic(onGoToAddFood);

    const [expandedId, setExpandedId] = React.useState<string | null>(null);

    const arcOffset = CIRC * (1 - n.kcalPct / 100);

    return (
        <div className="relative w-full min-h-screen">

            {/* ── Modales ──────────────────────────────────────────────────── */}
            {n.mealToEdit ? (
                <MealEditorModal meal={n.mealToEdit} onSave={n.onSaveEdit} onClose={n.onCancelEdit} />
            ) : null}
            {n.mealToDelete ? (
                <ConfirmationDialog
                    title="Eliminar comida"
                    message={`¿Eliminar "${n.mealToDelete.name}"? Esta acción no se puede deshacer.`}
                    onConfirm={n.onConfirmDelete}
                    onCancel={n.onCancelDelete}
                    confirmText="Eliminar"
                />
            ) : null}

            {/* ── Canvas principal ─────────────────────────────────────────── */}
            <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-52 space-y-8">

                {/* ══ SECCIÓN 1: Fecha + Anillo Calórico ══════════════════════ */}
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center animate-fade-in-up">

                    {/* Navegador de fecha */}
                    <div className="lg:col-span-4 flex items-center gap-5 justify-center lg:justify-start">
                        <button
                            onClick={() => { vibrate(5); n.onPreviousDay(); }}
                            className="w-14 h-14 rounded-full bg-zinc-900/70 border border-zinc-800/60 flex items-center justify-center active:scale-90 transition-transform flex-shrink-0"
                            aria-label="Día anterior"
                        >
                            <ChevronRightIcon className="w-5 h-5 text-zinc-400 rotate-180" />
                        </button>

                        <div className="text-center flex-1">
                            <h1 className="font-heading font-black text-4xl text-white leading-none tracking-tight">
                                {n.dateLabel}
                            </h1>
                            <p className="text-zinc-400 font-medium text-sm mt-1 capitalize">
                                {n.fullDateLabel}
                            </p>
                            {!n.isToday && (
                                <button
                                    onClick={() => { vibrate(5); n.onGoToday(); }}
                                    className="text-brand-accent text-[10px] font-black uppercase tracking-widest mt-2 block mx-auto"
                                >
                                    Ir a hoy
                                </button>
                            )}
                        </div>

                        <button
                            onClick={() => { vibrate(5); n.onNextDay(); }}
                            disabled={n.isToday}
                            className={`w-14 h-14 rounded-full bg-zinc-900/70 border border-zinc-800/60 flex items-center justify-center active:scale-90 transition-transform flex-shrink-0 ${n.isToday ? 'opacity-25 pointer-events-none' : ''}`}
                            aria-label="Día siguiente"
                        >
                            <ChevronRightIcon className="w-5 h-5 text-zinc-400" />
                        </button>
                    </div>

                    {/* Tarjeta glassmorphism: anillo + barras */}
                    <div className="lg:col-span-8 bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-[2rem] p-8 flex flex-col sm:flex-row items-center gap-10">

                        {/* Anillo SVG con gradiente */}
                        <div className="relative w-48 h-48 flex-shrink-0">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                <defs>
                                    <linearGradient id="kcalArcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%"   stopColor="#34d399" />
                                        <stop offset="100%" stopColor="#22d3ee" />
                                    </linearGradient>
                                </defs>
                                {/* Pista */}
                                <circle
                                    cx="50" cy="50" r="40"
                                    fill="transparent"
                                    stroke="#27272a"
                                    strokeWidth="12"
                                />
                                {/* Progreso */}
                                <circle
                                    cx="50" cy="50" r="40"
                                    fill="transparent"
                                    stroke={n.isKcalOver ? '#ef4444' : 'url(#kcalArcGrad)'}
                                    strokeWidth="12"
                                    strokeDasharray={CIRC}
                                    strokeDashoffset={arcOffset}
                                    strokeLinecap="round"
                                    className="transition-all duration-700"
                                />
                            </svg>
                            {/* Centro */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className={`text-3xl font-heading font-black leading-none ${n.isKcalOver ? 'text-red-400' : 'text-white'}`}>
                                    {n.isKcalOver ? '!' : Math.round(n.kcalRemaining)}
                                </span>
                                <span className="text-[9px] uppercase tracking-widest text-brand-accent font-black mt-0.5">
                                    {n.isKcalOver ? 'excedido' : 'kcal rest.'}
                                </span>
                                <span className="text-[8px] font-mono text-zinc-400 mt-0.5">
                                    / {n.dailyGoals.kcal}
                                </span>
                            </div>
                        </div>

                        {/* Barras de macros */}
                        <div className="flex-1 w-full space-y-6">
                            <MacroBar
                                label="Proteína"
                                value={n.macrosForDay.protein}
                                goalG={n.dailyGoals.protein}
                                pct={n.proteinPct}
                                trackClass="bg-surface-raised"
                                fillClass="bg-brand-protein"
                                labelClass="text-brand-protein"
                            />
                            <SmartMacroBar
                                label="Carbos"
                                spentG={n.macrosForDay.carbs}
                                targetG={n.carbTargetG}
                                floorG={n.carbFloorG}
                                maxG={n.carbMaxG}
                                minMet={n.isCarbMinMet}
                                fillClass="bg-brand-carbs"
                                glowClass=""
                                labelClass="text-brand-carbs"
                            />
                            <SmartMacroBar
                                label="Grasas"
                                spentG={n.macrosForDay.fat}
                                targetG={n.fatTargetG}
                                floorG={n.fatFloorG}
                                maxG={n.fatMaxG}
                                minMet={n.isFatMinMet}
                                fillClass="bg-brand-fat"
                                glowClass=""
                                labelClass="text-brand-fat"
                            />
                        </div>
                    </div>
                </section>

                {/* ══ SECCIÓN 2: Bolsa Compartida ══════════════════════════════ */}
                <section
                    className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-[2rem] p-8 relative overflow-hidden animate-fade-in-up"
                    style={{ animationDelay: '60ms' }}
                >
                    {/* Halo decorativo */}
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-brand-accent/5 blur-[100px] rounded-full pointer-events-none" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-8 h-8 rounded-xl bg-brand-accent/10 flex items-center justify-center flex-shrink-0">
                                <span className="text-brand-accent text-sm font-black leading-none">◈</span>
                            </div>
                            <div>
                                <h2 className="text-sm font-black uppercase tracking-widest text-zinc-300">
                                    Bolsa Compartida C+G
                                </h2>
                                <p className="text-[10px] text-zinc-400 mt-0.5">
                                    Tras cubrir proteína ({n.dailyGoals.protein}g)
                                </p>
                            </div>
                        </div>

                        {/* Bento Grid 3 columnas */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <SmartMacroCard
                                label="Carbos"
                                spentG={n.macrosForDay.carbs}
                                floorG={n.carbFloorG}
                                maxG={n.carbMaxG}
                                availableG={n.carbAvailableG}
                                minMet={n.isCarbMinMet}
                                overMax={n.isCarbOverMax}
                                accentClass="text-brand-carbs"
                                iconBgClass="bg-brand-carbs/10"
                                iconChar="↑"
                            />
                            <SmartMacroCard
                                label="Grasas"
                                spentG={n.macrosForDay.fat}
                                floorG={n.fatFloorG}
                                maxG={n.fatMaxG}
                                availableG={n.fatAvailableG}
                                minMet={n.isFatMinMet}
                                overMax={n.isFatOverMax}
                                accentClass="text-brand-fat"
                                iconBgClass="bg-brand-fat/10"
                                iconChar="◆"
                            />
                            {/* Tarjeta 3: Kcal Flexibles */}
                            <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-[1.25rem] p-5 flex items-center justify-between">
                                <div>
                                    <p className="text-[9px] font-black uppercase text-zinc-400 tracking-widest mb-1">Kcal Flexibles</p>
                                    <p className={`text-3xl font-heading font-black leading-none ${
                                        n.isKcalOver ? 'text-red-400' : 'text-white'
                                    }`}>
                                        {Math.round(n.kcalRemaining)}
                                        <span className="text-sm font-normal text-zinc-400 ml-1">kcal</span>
                                    </p>
                                    <p className="text-[10px] text-zinc-400 mt-1">Presupuesto de energía</p>
                                </div>
                                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                    n.isKcalOver ? 'bg-red-500/20' : 'bg-brand-accent/10'
                                }`}>
                                    <span className={`font-black text-lg leading-none ${
                                        n.isKcalOver ? 'text-red-400' : 'text-brand-accent'
                                    }`}>⚡</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ══ SECCIÓN 3: Registro de Comidas ══════════════════════════ */}
                <section
                    className="space-y-5 animate-fade-in-up"
                    style={{ animationDelay: '120ms' }}
                >
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-heading font-black text-white tracking-tight">
                            Registro del día
                        </h2>
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                            {n.mealsForDay.length} {n.mealsForDay.length === 1 ? 'comida' : 'comidas'}
                        </span>
                    </div>

                    {n.mealsForDay.length === 0 ? (
                        <div className="bg-zinc-900/40 border border-zinc-800/40 rounded-[1.5rem] p-10 flex flex-col items-center gap-3">
                            <span className="text-3xl">🍽️</span>
                            <p className="text-zinc-400 text-sm font-medium">Sin comidas registradas hoy</p>
                        </div>
                    ) : (
                    <div className="space-y-4">
                        {n.mealsForDay.map((meal: LoggedMeal) => {
                            const mealTime = new Date(meal.timestamp).toLocaleTimeString('es-ES', {
                                hour: '2-digit', minute: '2-digit',
                            });
                            const isOpen = expandedId === meal.id;
                            const hasIngredients = meal.foods && meal.foods.length > 0;
                            return (
                                <div
                                    key={meal.id}
                                    className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-[1.5rem] overflow-hidden"
                                >
                                    {/* ── Header táctil (zona de toggle) ── */}
                                    <div
                                        className="p-4 flex gap-4 items-center cursor-pointer active:bg-zinc-800/40 transition-colors select-none"
                                        onClick={() => { vibrate(3); setExpandedId(isOpen ? null : meal.id); }}
                                    >
                                        {/* Thumbnail */}
                                        <div className="w-20 h-20 rounded-2xl flex-shrink-0 bg-gradient-to-br from-brand-accent/20 to-brand-carbs/20 border border-surface-border" />

                                        {/* Info central */}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-heading font-bold text-text-primary text-lg leading-tight truncate mb-1">
                                                {meal.name ?? 'Comida'}
                                            </h4>
                                            <p className="text-xs text-text-secondary font-mono mb-2">{mealTime}</p>
                                            <div className="flex gap-4 flex-wrap">
                                                <span className="text-sm font-semibold text-brand-protein tabular-nums">
                                                    P: {Math.round(meal.macros.protein)}g
                                                </span>
                                                <span className="text-sm font-semibold text-brand-carbs tabular-nums">
                                                    C: {Math.round(meal.macros.carbs)}g
                                                </span>
                                                <span className="text-sm font-semibold text-brand-fat tabular-nums">
                                                    G: {Math.round(meal.macros.fat)}g
                                                </span>
                                            </div>
                                        </div>

                                        {/* Kcal + Chevron (derecha, alineados verticalmente) */}
                                        <div className="flex flex-col items-center gap-2 flex-shrink-0">
                                            <div className="text-center">
                                                <p className="text-xl font-heading font-black text-white leading-none">
                                                    {Math.round(meal.macros.kcal)}
                                                </p>
                                                <p className="text-[9px] font-black text-zinc-400 uppercase tracking-wide">
                                                    kcal
                                                </p>
                                            </div>
                                            <ChevronDown className={`w-5 h-5 text-zinc-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                                        </div>
                                    </div>

                                    {/* ── Acciones (Editar / Eliminar) ── */}
                                    <div className="flex justify-end gap-2 px-4 pb-3 -mt-1">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); vibrate(5); n.onRequestEdit(meal); }}
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-raised text-text-secondary hover:text-text-primary text-xs font-semibold transition-colors"
                                            aria-label="Editar"
                                        >
                                            <PencilIcon className="w-3 h-3" /> Editar
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); vibrate(10); n.onRequestDelete(meal); }}
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800/80 text-zinc-400 hover:text-red-400 text-xs font-semibold transition-colors"
                                            aria-label="Eliminar"
                                        >
                                            <TrashIcon className="w-3 h-3" /> Eliminar
                                        </button>
                                    </div>

                                    {/* ── Panel expandido ── */}
                                    {isOpen && (
                                        <div className="border-t border-zinc-800/50 px-5 pt-4 pb-5 space-y-3">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-3">Ingredientes</p>
                                            {hasIngredients ? (
                                                meal.foods.map((food, i) => {
                                                    const m = food.foodItem.macrosPerPortion;
                                                    const p = food.portions;
                                                    const fi = food.foodItem;
                                                    const amount = fi.rawWeightG
                                                        ? `${Math.round(fi.rawWeightG * p)}g`
                                                        : fi.cookedWeightG
                                                            ? `${Math.round(fi.cookedWeightG * p)}g`
                                                            : p === 1
                                                                ? fi.standardPortion
                                                                : `${p} pza`;
                                                    return (
                                                        <div key={i} className="flex items-center justify-between gap-2">
                                                            {/* Cantidad */}
                                                            <span className="text-xs text-zinc-500 tabular-nums w-12 text-right flex-shrink-0 mr-1">{amount}</span>
                                                            {/* Nombre */}
                                                            <span className="text-sm text-zinc-200 font-medium flex-1 truncate">{fi.name}</span>
                                                            {/* Kcal + macros */}
                                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                                <span className="text-xs text-zinc-400 tabular-nums w-14 text-right">
                                                                    {Math.round(m.kcal * p)} kcal
                                                                </span>
                                                                <div className="flex gap-1.5">
                                                                    <span className="text-xs text-brand-protein/80 tabular-nums">P:{Math.round(m.protein * p)}g</span>
                                                                    <span className="text-xs text-brand-carbs/80 tabular-nums">C:{Math.round(m.carbs * p)}g</span>
                                                                    <span className="text-xs text-brand-fat/80 tabular-nums">G:{Math.round(m.fat * p)}g</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <p className="text-xs text-zinc-500 italic">Sin ingredientes registrados</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    )}
                </section>
            </div>

            {/* ── Fade mask: desvanecimiento inferior premium ─────────────── */}
            <div className="fixed bottom-0 left-0 w-full h-52 bg-gradient-to-t from-bg-base to-transparent pointer-events-none z-40" />

            {/* ── FAB premium ──────────────────────────────────────────────── */}
            <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50">
                <button
                    onClick={() => { vibrate(10); n.onGoToAddFood(); }}
                    className="flex items-center gap-3 bg-brand-accent text-brand-accent-foreground font-black uppercase tracking-widest text-sm px-10 py-5 rounded-full active:scale-95 transition-transform"
                >
                    <PlusIcon className="w-5 h-5" />
                    Añadir comida
                </button>
            </div>
        </div>
    );
};

export default NutritionMainView;

