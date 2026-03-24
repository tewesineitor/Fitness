import React from 'react';
import type { LoggedMeal } from '../../types';
import { useNutritionLogic } from '../../hooks/useNutritionLogic';
import MealEditorModal from '../../components/dialogs/MealEditorModal';
import ConfirmationDialog from '../../components/dialogs/ConfirmationDialog';
import { ChevronRightIcon, PencilIcon, PlusIcon, TrashIcon } from '../../components/icons';
import { vibrate } from '../../utils/helpers';

// ── Arc math ─────────────────────────────────────────────────────────────────
const CIRC = 2 * Math.PI * 40; // ≈ 251.33

// ── QA Visual: mock meals para evaluación del diseño ─────────────────────────
const MOCK_MEALS: LoggedMeal[] = [
    {
        id: 'mock-1',
        name: 'Classic Poached Eggs',
        timestamp: new Date(),
        macros: { kcal: 420, protein: 24, carbs: 32, fat: 18 },
        foods: [],
    },
    {
        id: 'mock-2',
        name: 'Vitality Green Juice',
        timestamp: new Date(),
        macros: { kcal: 115, protein: 4, carbs: 22, fat: 1 },
        foods: [],
    },
];

// ── Sub: barra de macro ───────────────────────────────────────────────────────
const MacroBar: React.FC<{
    label: string; value: number; goal: number; pct: number;
    trackClass: string; fillClass: string; labelClass: string;
}> = ({ label, value, goal, pct, trackClass, fillClass, labelClass }) => (
    <div className="space-y-2">
        <div className="flex justify-between text-xs font-black uppercase tracking-widest">
            <span className={labelClass}>{label}</span>
            <span className="text-white">
                {Math.round(value)}g
                <span className="text-zinc-600"> / {goal}g</span>
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

// ── Componente principal ──────────────────────────────────────────────────────

interface NutritionMainViewProps {
    onGoToAddFood: () => void;
}

export const NutritionMainView: React.FC<NutritionMainViewProps> = ({ onGoToAddFood }) => {
    const n = useNutritionLogic(onGoToAddFood);

    // QA override: sustituye mealsForDay con datos hardcoded
    const displayMeals: LoggedMeal[] = MOCK_MEALS;

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
            <div className="px-4 sm:px-6 lg:px-10 pt-6 pb-40 space-y-8">

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
                            <p className="text-zinc-500 font-medium text-sm mt-1 capitalize">
                                {n.fullDateLabel}
                            </p>
                            {!n.isToday && (
                                <button
                                    onClick={() => { vibrate(5); n.onGoToday(); }}
                                    className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mt-2 block mx-auto"
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
                                <span className="text-[9px] uppercase tracking-widest text-emerald-400 font-black mt-0.5">
                                    {n.isKcalOver ? 'excedido' : 'kcal rest.'}
                                </span>
                                <span className="text-[8px] font-mono text-zinc-600 mt-0.5">
                                    / {n.dailyGoals.kcal}
                                </span>
                            </div>
                        </div>

                        {/* Barras de macros */}
                        <div className="flex-1 w-full space-y-6">
                            <MacroBar
                                label="Proteína"
                                value={n.macrosForDay.protein}
                                goal={n.dailyGoals.protein}
                                pct={n.proteinPct}
                                trackClass="bg-zinc-800"
                                fillClass="bg-emerald-400"
                                labelClass="text-emerald-400"
                            />
                            <MacroBar
                                label="Carbos"
                                value={n.macrosForDay.carbs}
                                goal={n.dailyGoals.carbs}
                                pct={n.carbsPct}
                                trackClass="bg-zinc-800"
                                fillClass="bg-cyan-400"
                                labelClass="text-cyan-400"
                            />
                            <MacroBar
                                label="Grasas"
                                value={n.macrosForDay.fat}
                                goal={n.dailyGoals.fat}
                                pct={n.fatPct}
                                trackClass="bg-zinc-800"
                                fillClass="bg-purple-400"
                                labelClass="text-purple-400"
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
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-400/5 blur-[100px] rounded-full pointer-events-none" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-xl bg-emerald-400/10 flex items-center justify-center flex-shrink-0">
                                <span className="text-emerald-400 text-sm font-black leading-none">◈</span>
                            </div>
                            <h2 className="text-sm font-black uppercase tracking-widest text-zinc-300">
                                Bolsa Compartida C+G
                            </h2>
                        </div>
                        <p className="text-xs text-zinc-600 mb-6 leading-relaxed pl-11">
                            Presupuesto carbs+grasas tras cubrir proteína ({n.dailyGoals.protein}g)
                        </p>

                        {/* Barra de progreso */}
                        <div className="mb-6">
                            <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-700 ${n.carbFatBudgetPct >= 100
                                        ? 'bg-red-500'
                                        : 'bg-gradient-to-r from-cyan-400 to-emerald-400'}`}
                                    style={{ width: `${n.carbFatBudgetPct}%` }}
                                />
                            </div>
                            <div className="flex justify-between mt-2">
                                <span className="text-[10px] font-mono text-zinc-600">{n.carbFatSpentKcal} kcal usadas</span>
                                <span className="text-[10px] font-mono text-zinc-600">/ {n.carbFatBudgetKcal} kcal</span>
                            </div>
                        </div>

                        {/* Pisos disponibles */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-[1.25rem] p-5 flex items-center justify-between">
                                <div>
                                    <p className="text-[9px] font-black uppercase text-zinc-500 tracking-widest mb-1">
                                        Carbs disp.
                                    </p>
                                    <p className="text-3xl font-heading font-black text-white leading-none">
                                        {n.carbFloorG}
                                        <span className="text-sm font-normal text-zinc-500 ml-1">g</span>
                                    </p>
                                </div>
                                <div className="w-11 h-11 bg-cyan-400/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <span className="text-cyan-400 font-black text-lg leading-none">↑</span>
                                </div>
                            </div>
                            <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-[1.25rem] p-5 flex items-center justify-between">
                                <div>
                                    <p className="text-[9px] font-black uppercase text-zinc-500 tracking-widest mb-1">
                                        Grasas disp.
                                    </p>
                                    <p className="text-3xl font-heading font-black text-white leading-none">
                                        {n.fatFloorG}
                                        <span className="text-sm font-normal text-zinc-500 ml-1">g</span>
                                    </p>
                                </div>
                                <div className="w-11 h-11 bg-purple-400/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <span className="text-purple-400 font-black text-base leading-none">◆</span>
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
                            {displayMeals.length} {displayMeals.length === 1 ? 'comida' : 'comidas'}
                        </span>
                    </div>

                    <div className="space-y-4">
                        {displayMeals.map((meal: LoggedMeal) => {
                            const mealTime = new Date(meal.timestamp).toLocaleTimeString('es-ES', {
                                hour: '2-digit', minute: '2-digit',
                            });
                            return (
                                <div
                                    key={meal.id}
                                    className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-[1.5rem] p-4 flex gap-4 items-center transition-colors hover:bg-zinc-800/40"
                                >
                                    {/* Placeholder visual de comida */}
                                    <div className="w-20 h-20 rounded-2xl flex-shrink-0 bg-gradient-to-br from-emerald-900/50 to-cyan-900/40 border border-emerald-800/20" />

                                    {/* Info central */}
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-heading font-bold text-white text-sm leading-tight truncate mb-1">
                                            {meal.name ?? 'Comida'}
                                        </h4>
                                        <p className="text-[10px] text-zinc-600 font-mono mb-2">{mealTime}</p>
                                        <div className="flex gap-3 flex-wrap">
                                            <span className="text-[10px] text-zinc-500 font-black uppercase">
                                                P: <span className="text-emerald-400">{Math.round(meal.macros.protein)}g</span>
                                            </span>
                                            <span className="text-[10px] text-zinc-500 font-black uppercase">
                                                C: <span className="text-cyan-400">{Math.round(meal.macros.carbs)}g</span>
                                            </span>
                                            <span className="text-[10px] text-zinc-500 font-black uppercase">
                                                G: <span className="text-purple-400">{Math.round(meal.macros.fat)}g</span>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Kcal + acciones */}
                                    <div className="flex flex-col items-end gap-3 flex-shrink-0">
                                        <div className="text-right">
                                            <p className="text-xl font-heading font-black text-white leading-none">
                                                {Math.round(meal.macros.kcal)}
                                            </p>
                                            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-wide">
                                                kcal
                                            </p>
                                        </div>
                                        <div className="flex gap-1.5">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); vibrate(5); n.onRequestEdit(meal); }}
                                                className="w-8 h-8 rounded-xl bg-zinc-800/80 flex items-center justify-center text-zinc-400 hover:text-emerald-400 transition-colors"
                                                aria-label="Editar"
                                            >
                                                <PencilIcon className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); vibrate(10); n.onRequestDelete(meal); }}
                                                className="w-8 h-8 rounded-xl bg-zinc-800/80 flex items-center justify-center text-zinc-400 hover:text-red-400 transition-colors"
                                                aria-label="Eliminar"
                                            >
                                                <TrashIcon className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            </div>

            {/* ── FAB premium ──────────────────────────────────────────────── */}
            <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50">
                <button
                    onClick={() => { vibrate(10); n.onGoToAddFood(); }}
                    className="flex items-center gap-3 bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest text-sm px-10 py-5 rounded-full shadow-[0_0_30px_rgba(52,211,153,0.2)] active:scale-95 transition-transform"
                >
                    <PlusIcon className="w-5 h-5" />
                    Añadir comida
                </button>
            </div>
        </div>
    );
};

export default NutritionMainView;
