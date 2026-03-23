import React from 'react';
import type { LoggedMeal } from '../../types';
import { useNutritionLogic } from '../../hooks/useNutritionLogic';
import Card from '../../components/Card';
import Button from '../../components/Button';
import MacroArcGauge from '../../components/MacroArcGauge';
import MealEditorModal from '../../components/dialogs/MealEditorModal';
import ConfirmationDialog from '../../components/dialogs/ConfirmationDialog';
import { BowlIcon, ChevronRightIcon, PencilIcon, PlusIcon, TrashIcon } from '../../components/icons';
import { vibrate } from '../../utils/helpers';

// ── Inline atomic helpers ────────────────────────────────────────────────────

const MicroBar: React.FC<{
    label: string;
    value: number;
    goal: number;
    pct: number;
    barClass: string;
    textClass: string;
}> = ({ label, value, goal, pct, barClass, textClass }) => (
    <div className="flex items-center gap-2">
        <span className={`text-[8px] font-black uppercase w-3 flex-shrink-0 ${textClass}`}>{label}</span>
        <div className="flex-1 h-1.5 rounded-pill bg-surface-hover overflow-hidden">
            <div
                className={`h-full rounded-pill transition-all duration-700 ${barClass}`}
                style={{ width: `${pct}%` }}
            />
        </div>
        <span className="text-[9px] font-mono text-text-muted w-14 text-right leading-none">
            {Math.round(value)}<span className="text-text-muted/50">/{goal}g</span>
        </span>
    </div>
);

const MacroChip: React.FC<{ value: number; label: string; colorClass: string }> = ({ value, label, colorClass }) => (
    <span className={`inline-flex items-baseline gap-0.5 text-[9px] font-black font-mono bg-surface-hover border border-surface-border rounded-tag px-1.5 py-0.5 ${colorClass}`}>
        {Math.round(value)}<span className="text-text-muted font-normal">{label}</span>
    </span>
);

// ── Main component ───────────────────────────────────────────────────────────

interface NutritionMainViewProps {
    onGoToAddFood: () => void;
}

export const NutritionMainView: React.FC<NutritionMainViewProps> = ({ onGoToAddFood }) => {
    const n = useNutritionLogic(onGoToAddFood);

    return (
        <div className="relative w-full">

            {/* ── Dialogs ──────────────────────────────────────────────────── */}
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

            {/* ── Bento Grid ───────────────────────────────────────────────── */}
            <div className="grid grid-cols-12 gap-3 px-4 sm:px-6 pb-36 mx-auto max-w-2xl w-full pt-4">

                {/* ── ROW 1: HEADER SUMMARY (col-12) ────────────────────── */}
                <Card
                    variant="glass"
                    className="col-span-12 p-5 shadow-glow animate-fade-in-up"
                >
                    {/* Date navigator row */}
                    <div className="flex items-start justify-between gap-3 mb-5">
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-[0.22em] text-text-secondary mb-0.5">
                                Nutrición
                            </p>
                            <h1 className="font-heading font-black text-2xl text-text-primary leading-none tracking-tight">
                                {n.dateLabel}
                            </h1>
                            <p className="text-[11px] text-text-secondary mt-0.5 capitalize">
                                {n.fullDateLabel}
                            </p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                            <Button
                                variant="icon-only"
                                size="small"
                                icon={ChevronRightIcon}
                                label="Día anterior"
                                onClick={() => { vibrate(5); n.onPreviousDay(); }}
                                className="[&_svg]:rotate-180"
                            />
                            {!n.isToday && (
                                <Button
                                    variant="ghost"
                                    size="small"
                                    onClick={() => { vibrate(5); n.onGoToday(); }}
                                >
                                    Hoy
                                </Button>
                            )}
                            <Button
                                variant="icon-only"
                                size="small"
                                icon={ChevronRightIcon}
                                label="Día siguiente"
                                onClick={() => { vibrate(5); n.onNextDay(); }}
                                className={n.isToday ? 'opacity-30 pointer-events-none' : ''}
                            />
                        </div>
                    </div>

                    {/* Macro summary row */}
                    <div className="flex items-center gap-4">
                        {/* Kcal arc */}
                        <div className="flex-shrink-0">
                            <MacroArcGauge
                                pct={n.kcalPct}
                                value={Math.round(n.macrosForDay.kcal)}
                                unit="kcal"
                                isOver={n.isKcalOver}
                                strokeClass={n.isKcalOver ? 'stroke-danger' : 'stroke-brand-accent'}
                                textClass={n.isKcalOver ? 'text-danger' : 'text-text-primary'}
                                size={88}
                                strokeWidth={7}
                            />
                        </div>

                        {/* Remaining label */}
                        <div className="flex flex-col gap-0.5 min-w-0 flex-shrink-0">
                            <p className={`font-heading font-black text-sm leading-tight ${n.isKcalOver ? 'text-danger' : 'text-text-primary'}`}>
                                {n.isKcalOver ? 'Excedido' : `${Math.round(n.kcalRemaining)}`}
                            </p>
                            <p className="text-[9px] font-mono text-text-muted leading-tight">
                                {n.isKcalOver ? 'límite superado' : 'kcal restantes'}
                            </p>
                            <p className="text-[8px] font-mono text-text-muted/50">
                                / {n.dailyGoals.kcal} kcal
                            </p>
                        </div>

                        {/* Macro micro-bars */}
                        <div className="flex flex-col gap-2 flex-1 min-w-0">
                            <MicroBar label="P" value={n.macrosForDay.protein} goal={n.dailyGoals.protein} pct={n.proteinPct} barClass="bg-brand-accent" textClass="text-brand-accent" />
                            <MicroBar label="C" value={n.macrosForDay.carbs}   goal={n.dailyGoals.carbs}   pct={n.carbsPct}   barClass="bg-brand-carbs"  textClass="text-brand-carbs" />
                            <MicroBar label="G" value={n.macrosForDay.fat}     goal={n.dailyGoals.fat}     pct={n.fatPct}     barClass="bg-brand-fat"    textClass="text-brand-fat" />
                        </div>
                    </div>
                </Card>

                {/* ── ROW 2: BOLSA COMPARTIDA (col-12 sm:col-7) ─────────── */}
                <Card
                    variant="accent"
                    className="col-span-12 sm:col-span-7 p-5 animate-fade-in-up"
                    style={{ animationDelay: '60ms' }}
                >
                    <p className="text-[9px] font-black uppercase tracking-[0.22em] text-text-secondary mb-1">
                        Bolsa Compartida
                    </p>
                    <p className="text-[10px] text-text-secondary mb-3 leading-relaxed">
                        Presupuesto C+G tras cubrir proteína ({n.dailyGoals.protein}g)
                    </p>

                    {/* Progress bar */}
                    <div className="mb-3">
                        <div className="h-2 w-full bg-surface-hover rounded-pill overflow-hidden">
                            <div
                                className={`h-full rounded-pill transition-all duration-700 ${n.carbFatBudgetPct >= 100 ? 'bg-danger' : 'bg-brand-carbs'}`}
                                style={{ width: `${n.carbFatBudgetPct}%` }}
                            />
                        </div>
                        <div className="flex justify-between mt-1.5">
                            <span className="text-[9px] font-mono text-text-muted">{n.carbFatSpentKcal} kcal usado</span>
                            <span className="text-[9px] font-mono text-text-muted">/ {n.carbFatBudgetKcal} kcal</span>
                        </div>
                    </div>

                    {/* Floor indicators */}
                    <div className="grid grid-cols-2 gap-2">
                        <div className="bg-surface-hover/40 border border-brand-carbs/20 rounded-input p-2.5">
                            <p className="text-[8px] font-black uppercase text-brand-carbs tracking-widest mb-0.5">
                                Carbs disp.
                            </p>
                            <p className="text-xl font-black font-mono text-text-primary leading-none">
                                {n.carbFloorG}<span className="text-xs font-normal text-text-muted">g</span>
                            </p>
                        </div>
                        <div className="bg-surface-hover/40 border border-brand-fat/20 rounded-input p-2.5">
                            <p className="text-[8px] font-black uppercase text-brand-fat tracking-widest mb-0.5">
                                Grasas disp.
                            </p>
                            <p className="text-xl font-black font-mono text-text-primary leading-none">
                                {n.fatFloorG}<span className="text-xs font-normal text-text-muted">g</span>
                            </p>
                        </div>
                    </div>
                </Card>

                {/* ── ROW 2 RIGHT: MEAL COUNT STAT (col-12 sm:col-5) ────── */}
                <Card
                    variant="default"
                    className="col-span-12 sm:col-span-5 p-5 flex flex-col justify-between animate-fade-in-up"
                    style={{ animationDelay: '80ms' }}
                >
                    <p className="text-[9px] font-black uppercase tracking-[0.22em] text-text-secondary mb-3">
                        Bitácora del día
                    </p>
                    <div className="flex-grow flex items-center justify-center">
                        <div className="text-center">
                            <p className="font-heading font-black text-5xl text-text-primary leading-none tracking-tight">
                                {n.mealsForDay.length}
                            </p>
                            <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest mt-1">
                                {n.mealsForDay.length === 1 ? 'comida' : 'comidas'}
                            </p>
                        </div>
                    </div>
                    <p className="text-[9px] text-text-muted text-center mt-3">
                        {n.isToday ? 'registradas hoy' : `en ${n.dateLabel}`}
                    </p>
                </Card>

                {/* ── ROW 3: BITÁCORA BENTO (col-12) ───────────────────── */}
                <div
                    className="col-span-12 animate-fade-in-up"
                    style={{ animationDelay: '120ms' }}
                >
                    {n.mealsForDay.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {n.mealsForDay.map((meal: LoggedMeal) => {
                                const isExpanded = n.expandedMealId === meal.id;
                                const mealTime = new Date(meal.timestamp).toLocaleTimeString('es-ES', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                });
                                return (
                                    <Card key={meal.id} variant="elevated" className="p-4 flex flex-col gap-3">
                                        {/* Meal header */}
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0 flex-1">
                                                <p className="font-heading font-black text-sm text-text-primary truncate leading-tight">
                                                    {meal.name}
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

                                        {/* Macro chips */}
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            <MacroChip value={meal.macros.kcal}    label="kcal" colorClass="text-brand-accent" />
                                            <MacroChip value={meal.macros.protein} label="P"    colorClass="text-brand-accent" />
                                            <MacroChip value={meal.macros.carbs}   label="C"    colorClass="text-brand-carbs"  />
                                            <MacroChip value={meal.macros.fat}     label="G"    colorClass="text-brand-fat"    />
                                        </div>

                                        {/* Expanded food list */}
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

                                        {/* Actions */}
                                        <div className="flex gap-2 pt-2 border-t border-surface-border/40 mt-auto">
                                            <Button
                                                variant="ghost"
                                                size="small"
                                                icon={PencilIcon}
                                                onClick={() => { vibrate(5); n.onRequestEdit(meal); }}
                                                className="flex-1"
                                            >
                                                Editar
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="small"
                                                icon={TrashIcon}
                                                onClick={() => { vibrate(10); n.onRequestDelete(meal); }}
                                                className="flex-1"
                                            >
                                                Eliminar
                                            </Button>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    ) : (
                        /* ── Empty State ───────────────────────────────────── */
                        <Card variant="inset" className="p-6 py-10 flex flex-col items-center gap-3">
                            <div className="w-12 h-12 rounded-pill bg-surface-hover flex items-center justify-center">
                                <BowlIcon className="w-6 h-6 text-text-muted" />
                            </div>
                            <p className="text-[11px] font-black uppercase text-text-primary tracking-widest text-center">
                                {n.isToday ? 'Sin registros hoy' : 'Sin registros este día'}
                            </p>
                            <p className="text-[10px] text-text-secondary text-center leading-relaxed max-w-[220px]">
                                {n.isToday
                                    ? 'Registra tu primera comida del día usando el botón de abajo.'
                                    : 'No hay comidas archivadas para esta fecha.'}
                            </p>
                            {!n.isToday && (
                                <Button
                                    variant="ghost"
                                    size="small"
                                    onClick={() => { vibrate(5); n.onGoToday(); }}
                                >
                                    Volver a hoy
                                </Button>
                            )}
                        </Card>
                    )}
                </div>
            </div>

            {/* ── FAB flotante ─────────────────────────────────────────────── */}
            <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none flex justify-center pb-24 px-4">
                <Button
                    variant="primary"
                    size="large"
                    icon={PlusIcon}
                    onClick={() => { vibrate(10); n.onGoToAddFood(); }}
                    className="pointer-events-auto shadow-glow-lg rounded-pill px-8"
                >
                    Añadir comida
                </Button>
            </div>
        </div>
    );
};

export default NutritionMainView;
