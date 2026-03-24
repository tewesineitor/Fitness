import React from 'react';
import type { LoggedMeal } from '../../types';
import { useNutritionLogic } from '../../hooks/useNutritionLogic';
import MealEditorModal from '../../components/dialogs/MealEditorModal';
import ConfirmationDialog from '../../components/dialogs/ConfirmationDialog';
import { ChevronRightIcon, PencilIcon, PlusIcon, TrashIcon } from '../../components/icons';
import { vibrate } from '../../utils/helpers';

// ── Constante del arco SVG (radio=40) ───────────────────────────────────────
const CIRCUMFERENCE = 2 * Math.PI * 40; // ≈ 251.33

// ── Barra de macro reutilizable ──────────────────────────────────────────────
const MacroBar: React.FC<{
    label: string;
    value: number;
    goal: number;
    pct: number;
    barClass: string;
    labelClass: string;
}> = ({ label, value, goal, pct, barClass, labelClass }) => (
    <div className="space-y-1.5">
        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-text-muted">
            <span className={labelClass}>{label}</span>
            <span className="text-text-primary">
                {Math.round(value)}g
                <span className="text-text-muted/60"> / {goal}g</span>
            </span>
        </div>
        <div className="h-3 bg-surface-hover rounded-pill overflow-hidden">
            <div
                className={`h-full rounded-pill transition-all duration-700 ${barClass}`}
                style={{ width: `${pct}%` }}
            />
        </div>
    </div>
);

// ── Chip de macro para tarjetas de comida ────────────────────────────────────
const MacroChip: React.FC<{ value: number; label: string; colorClass: string }> = ({ value, label, colorClass }) => (
    <span className={`inline-flex items-baseline gap-0.5 text-[9px] font-black font-mono bg-surface-hover border border-surface-border rounded-tag px-1.5 py-0.5 ${colorClass}`}>
        {Math.round(value)}<span className="text-text-muted font-normal">{label}</span>
    </span>
);

// ── Componente principal ─────────────────────────────────────────────────────

interface NutritionMainViewProps {
    onGoToAddFood: () => void;
}

export const NutritionMainView: React.FC<NutritionMainViewProps> = ({ onGoToAddFood }) => {
    const n = useNutritionLogic(onGoToAddFood);

    const arcOffset = CIRCUMFERENCE * (1 - n.kcalPct / 100);

    return (
        <div className="relative w-full">

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

            <div className="px-4 sm:px-6 pb-36 mx-auto max-w-2xl w-full pt-4 space-y-6">

                {/* ── SECCIÓN 1: Navegador de fecha + Anillo Calórico ─────── */}
                <section className="bg-surface-raised border border-surface-border rounded-card p-6 shadow-md animate-fade-in-up">
                    {/* Eyebrow */}
                    <p className="text-[9px] font-black uppercase tracking-[0.22em] text-text-muted mb-4">
                        Nutrición
                    </p>

                    {/* Navegador de fecha */}
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={() => { vibrate(5); n.onPreviousDay(); }}
                            className="w-11 h-11 rounded-pill bg-surface-hover border border-surface-border flex items-center justify-center active:scale-90 transition-transform"
                            aria-label="Día anterior"
                        >
                            <ChevronRightIcon className="w-4 h-4 text-text-secondary rotate-180" />
                        </button>

                        <button
                            onClick={() => { vibrate(5); n.onGoToday(); }}
                            className="text-center"
                            disabled={n.isToday}
                        >
                            <h1 className="font-heading font-black text-3xl text-text-primary leading-none tracking-tight">
                                {n.dateLabel}
                            </h1>
                            <p className="text-[11px] text-text-muted font-medium mt-1 capitalize">
                                {n.fullDateLabel}
                            </p>
                        </button>

                        <button
                            onClick={() => { vibrate(5); n.onNextDay(); }}
                            disabled={n.isToday}
                            className={`w-11 h-11 rounded-pill bg-surface-hover border border-surface-border flex items-center justify-center active:scale-90 transition-transform ${n.isToday ? 'opacity-30 pointer-events-none' : ''}`}
                            aria-label="Día siguiente"
                        >
                            <ChevronRightIcon className="w-4 h-4 text-text-secondary" />
                        </button>
                    </div>

                    {/* Anillo calórico + barras de macros */}
                    <div className="flex flex-col sm:flex-row items-center gap-8">

                        {/* Anillo SVG */}
                        <div className="relative w-44 h-44 flex-shrink-0">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                <defs>
                                    <linearGradient id="kcalArcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="currentColor" className="text-brand-accent" />
                                        <stop offset="100%" stopColor="currentColor" className="text-brand-protein" />
                                    </linearGradient>
                                </defs>
                                {/* Pista de fondo */}
                                <circle
                                    cx="50" cy="50" r="40"
                                    fill="transparent"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    className="text-surface-hover"
                                />
                                {/* Arco de progreso */}
                                <circle
                                    cx="50" cy="50" r="40"
                                    fill="transparent"
                                    stroke={n.isKcalOver
                                        ? 'rgb(var(--color-danger-rgb))'
                                        : 'url(#kcalArcGrad)'}
                                    strokeWidth="12"
                                    strokeDasharray={CIRCUMFERENCE}
                                    strokeDashoffset={arcOffset}
                                    strokeLinecap="round"
                                    className="transition-all duration-700"
                                />
                            </svg>
                            {/* Etiqueta central */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className={`text-3xl font-heading font-black leading-none ${n.isKcalOver ? 'text-danger' : 'text-text-primary'}`}>
                                    {n.isKcalOver ? '!' : Math.round(n.kcalRemaining)}
                                </span>
                                <span className="text-[9px] uppercase tracking-widest text-brand-accent font-black mt-0.5">
                                    {n.isKcalOver ? 'excedido' : 'kcal rest.'}
                                </span>
                                <span className="text-[8px] font-mono text-text-muted mt-0.5">
                                    / {n.dailyGoals.kcal} kcal
                                </span>
                            </div>
                        </div>

                        {/* Barras de macros */}
                        <div className="flex-1 w-full space-y-5">
                            <MacroBar
                                label="Proteína"
                                value={n.macrosForDay.protein}
                                goal={n.dailyGoals.protein}
                                pct={n.proteinPct}
                                barClass="bg-brand-accent"
                                labelClass="text-brand-accent"
                            />
                            <MacroBar
                                label="Carbos"
                                value={n.macrosForDay.carbs}
                                goal={n.dailyGoals.carbs}
                                pct={n.carbsPct}
                                barClass="bg-brand-carbs"
                                labelClass="text-brand-carbs"
                            />
                            <MacroBar
                                label="Grasas"
                                value={n.macrosForDay.fat}
                                goal={n.dailyGoals.fat}
                                pct={n.fatPct}
                                barClass="bg-brand-fat"
                                labelClass="text-brand-fat"
                            />
                        </div>
                    </div>
                </section>

                {/* ── SECCIÓN 2: Bolsa Compartida ──────────────────────────── */}
                <section
                    className="bg-surface-raised border border-surface-border rounded-card p-6 shadow-md relative overflow-hidden animate-fade-in-up"
                    style={{ animationDelay: '60ms' }}
                >
                    <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 rounded-pill bg-brand-carbs flex-shrink-0" />
                        <p className="text-[9px] font-black uppercase tracking-[0.22em] text-text-secondary">
                            Bolsa Compartida C+G
                        </p>
                    </div>
                    <p className="text-[10px] text-text-muted mb-4 leading-relaxed">
                        Presupuesto carbs+grasas tras cubrir proteína ({n.dailyGoals.protein}g)
                    </p>

                    {/* Barra de progreso */}
                    <div className="mb-5">
                        <div className="h-3 w-full bg-surface-hover rounded-pill overflow-hidden">
                            <div
                                className={`h-full rounded-pill transition-all duration-700 ${n.carbFatBudgetPct >= 100 ? 'bg-danger' : 'bg-brand-carbs'}`}
                                style={{ width: `${n.carbFatBudgetPct}%` }}
                            />
                        </div>
                        <div className="flex justify-between mt-2">
                            <span className="text-[9px] font-mono text-text-muted">{n.carbFatSpentKcal} kcal usadas</span>
                            <span className="text-[9px] font-mono text-text-muted">/ {n.carbFatBudgetKcal} kcal</span>
                        </div>
                    </div>

                    {/* Pisos disponibles */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-surface-hover/50 border border-brand-carbs/20 rounded-input p-4 flex items-center justify-between">
                            <div>
                                <p className="text-[8px] font-black uppercase text-brand-carbs tracking-widest mb-0.5">
                                    Carbs disp.
                                </p>
                                <p className="text-2xl font-heading font-black text-text-primary leading-none">
                                    {n.carbFloorG}<span className="text-sm font-normal text-text-muted ml-0.5">g</span>
                                </p>
                            </div>
                            <div className="w-10 h-10 bg-brand-carbs/10 rounded-input flex items-center justify-center flex-shrink-0">
                                <span className="text-brand-carbs font-black text-lg leading-none">↑</span>
                            </div>
                        </div>
                        <div className="bg-surface-hover/50 border border-brand-fat/20 rounded-input p-4 flex items-center justify-between">
                            <div>
                                <p className="text-[8px] font-black uppercase text-brand-fat tracking-widest mb-0.5">
                                    Grasas disp.
                                </p>
                                <p className="text-2xl font-heading font-black text-text-primary leading-none">
                                    {n.fatFloorG}<span className="text-sm font-normal text-text-muted ml-0.5">g</span>
                                </p>
                            </div>
                            <div className="w-10 h-10 bg-brand-fat/10 rounded-input flex items-center justify-center flex-shrink-0">
                                <span className="text-brand-fat font-black text-base leading-none">◆</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── SECCIÓN 3: Registro del día ──────────────────────────── */}
                <section
                    className="animate-fade-in-up"
                    style={{ animationDelay: '120ms' }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-heading font-black text-xl text-text-primary tracking-tight">
                            Registro del día
                        </h2>
                        <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                            {n.mealsForDay.length} {n.mealsForDay.length === 1 ? 'comida' : 'comidas'}
                        </span>
                    </div>

                    {n.mealsForDay.length > 0 ? (
                        <div className="space-y-3">
                            {n.mealsForDay.map((meal: LoggedMeal) => {
                                const isExpanded = n.expandedMealId === meal.id;
                                const mealTime = new Date(meal.timestamp).toLocaleTimeString('es-ES', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                });
                                return (
                                    <div
                                        key={meal.id}
                                        className="bg-surface-raised border border-surface-border rounded-card p-4 flex flex-col gap-3 transition-colors hover:bg-surface-hover/30"
                                    >
                                        {/* Cabecera */}
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0 flex-1">
                                                <p className="font-heading font-black text-sm text-text-primary truncate leading-tight">
                                                    {meal.name ?? 'Comida'}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[8px] font-mono text-text-muted">{mealTime}</span>
                                                    <span className="text-[8px] font-bold text-text-muted bg-surface-hover border border-surface-border rounded-pill px-1.5 py-0.5">
                                                        {meal.foods.length} item{meal.foods.length !== 1 ? 's' : ''}
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => { vibrate(5); n.onToggleExpand(meal.id); }}
                                                className="text-text-muted hover:text-brand-accent transition-colors duration-200 flex-shrink-0 mt-0.5"
                                                aria-label={isExpanded ? 'Colapsar' : 'Expandir'}
                                            >
                                                <ChevronRightIcon className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                                            </button>
                                        </div>

                                        {/* Chips de macros */}
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            <MacroChip value={meal.macros.kcal}    label=" kcal" colorClass="text-text-secondary" />
                                            <MacroChip value={meal.macros.protein} label="g P"   colorClass="text-brand-accent" />
                                            <MacroChip value={meal.macros.carbs}   label="g C"   colorClass="text-brand-carbs" />
                                            <MacroChip value={meal.macros.fat}     label="g G"   colorClass="text-brand-fat" />
                                        </div>

                                        {/* Lista expandida de alimentos */}
                                        {isExpanded && (
                                            <div className="border-t border-surface-border/60 pt-2 space-y-1.5">
                                                {meal.foods.map((f, i) => (
                                                    <div key={i} className="flex justify-between items-baseline gap-2">
                                                        <span className="text-[11px] text-text-primary font-medium truncate flex-1">
                                                            {f.foodItem.name}
                                                        </span>
                                                        <span className="text-[9px] text-text-muted font-mono flex-shrink-0">
                                                            {f.portions.toFixed(1)} × {f.foodItem.standardPortion}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Acciones */}
                                        <div className="flex gap-2 pt-2 border-t border-surface-border/40">
                                            <button
                                                onClick={() => { vibrate(5); n.onRequestEdit(meal); }}
                                                className="flex-1 flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-text-secondary hover:text-brand-accent bg-surface-hover rounded-input py-2.5 transition-colors"
                                            >
                                                <PencilIcon className="w-3.5 h-3.5" />
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => { vibrate(10); n.onRequestDelete(meal); }}
                                                className="flex-1 flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-danger/60 hover:text-danger bg-surface-hover rounded-input py-2.5 transition-colors"
                                            >
                                                <TrashIcon className="w-3.5 h-3.5" />
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        /* ── Estado vacío ─────────────────────────────────── */
                        <div className="border border-dashed border-surface-border bg-surface-hover/30 rounded-card p-8 py-14 flex flex-col items-center gap-3 text-center">
                            <div className="w-12 h-12 rounded-pill bg-surface-hover border border-surface-border flex items-center justify-center">
                                <PlusIcon className="w-5 h-5 text-text-muted" />
                            </div>
                            <p className="text-[11px] font-black uppercase text-text-primary tracking-widest">
                                {n.isToday ? 'Sin registros hoy' : 'Sin registros este día'}
                            </p>
                            <p className="text-[10px] text-text-secondary leading-relaxed max-w-[220px]">
                                {n.isToday
                                    ? 'Registra tu primera comida usando el botón de abajo.'
                                    : 'No hay comidas archivadas para esta fecha.'}
                            </p>
                            {!n.isToday && (
                                <button
                                    onClick={() => { vibrate(5); n.onGoToday(); }}
                                    className="text-brand-accent text-xs font-bold uppercase tracking-widest mt-1"
                                >
                                    Volver a hoy
                                </button>
                            )}
                        </div>
                    )}
                </section>
            </div>

            {/* ── FAB flotante ─────────────────────────────────────────────── */}
            <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none flex justify-center pb-24 px-4">
                <button
                    onClick={() => { vibrate(10); n.onGoToAddFood(); }}
                    className="pointer-events-auto flex items-center gap-3 bg-brand-accent text-brand-accent-foreground font-black uppercase tracking-widest text-sm px-8 py-4 rounded-pill shadow-glow active:scale-95 transition-transform"
                >
                    <PlusIcon className="w-5 h-5" />
                    Añadir comida
                </button>
            </div>
        </div>
    );
};

export default NutritionMainView;
