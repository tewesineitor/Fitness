import React from 'react';
import { LoggedMeal } from '../../types';
import Button from '../Button';
import Card from '../Card';
import IconButton from '../IconButton';
import Tag from '../Tag';
import { EmptyState } from '../feedback';
import { AppleIcon, ArrowDownIcon, BowlIcon, MoonIcon, PencilIcon, SunIcon, TrashIcon } from '../icons';
import { vibrate } from '../../utils/helpers';

interface MealLogProps {
  mealsForDay: LoggedMeal[];
  expandedMealId: string | null;
  onToggleExpand: (mealId: string) => void;
  onEditClick: (meal: LoggedMeal) => void;
  onDeleteClick: (meal: LoggedMeal) => void;
  emptyAction?: React.ReactNode;
  previewCount?: number;
}

const getMealIcon = (meal: LoggedMeal): React.FC<{ className?: string }> => {
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

const formatMealTime = (timestamp: Date) =>
  new Date(timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

export const MealLog: React.FC<MealLogProps> = ({
  mealsForDay,
  expandedMealId,
  onToggleExpand,
  onEditClick,
  onDeleteClick,
  emptyAction,
  previewCount,
}) => {
  if (mealsForDay.length === 0) {
    return (
      <EmptyState
        icon={<BowlIcon className="h-7 w-7" />}
        title="Sin registros en este día"
        description="Cuando registres comidas aquí verás el timeline del día con macros, ingredientes y bloques de energía."
        action={emptyAction}
        className="min-h-[18rem]"
      />
    );
  }

  const visibleMeals = previewCount ? mealsForDay.slice(0, previewCount) : mealsForDay;
  const hiddenMeals = mealsForDay.length - visibleMeals.length;

  return (
    <div className="space-y-4">
      {visibleMeals.map((meal, index) => {
        const Icon = getMealIcon(meal);
        const isExpanded = expandedMealId === meal.id;
        const timingLabel =
          meal.timing === 'pre-workout'
            ? 'Pre'
            : meal.timing === 'post-workout'
              ? 'Post'
              : null;

        return (
          <Card
            key={meal.id}
            variant={isExpanded ? 'glass' : 'default'}
            className={`overflow-hidden p-0 transition-all duration-300 ${isExpanded ? 'border-brand-accent/30 shadow-lg' : ''}`}
          >
            <div className="flex flex-col gap-0">
              <div className="flex items-stretch gap-3 px-4 py-4 sm:px-5">
                <div className="flex w-10 flex-col items-center gap-2 pt-1">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-2xl border ${isExpanded ? 'border-brand-accent/25 bg-brand-accent/10 text-brand-accent' : 'border-surface-border bg-surface-hover text-text-secondary'}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  {index < visibleMeals.length - 1 ? <div className="w-px flex-1 bg-surface-border/80" /> : null}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-text-secondary">
                          {formatMealTime(meal.timestamp)}
                        </p>
                        {timingLabel ? (
                          <Tag variant="status" tone="accent" size="sm">
                            {timingLabel}
                          </Tag>
                        ) : null}
                      </div>

                      <div className="space-y-1">
                        <h3 className="truncate text-lg font-black uppercase tracking-[-0.03em] text-text-primary">
                          {meal.name || formatMealTime(meal.timestamp)}
                        </h3>
                        <p className="text-sm leading-6 text-text-secondary">
                          {meal.foods.length} ingrediente{meal.foods.length === 1 ? '' : 's'} registrados.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <IconButton
                        onClick={() => { vibrate(5); onEditClick(meal); }}
                        icon={PencilIcon}
                        label="Editar registro"
                        variant="ghost"
                        size="small"
                      />
                      <IconButton
                        onClick={() => { vibrate(10); onDeleteClick(meal); }}
                        icon={TrashIcon}
                        label="Eliminar registro"
                        variant="destructive"
                        size="small"
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <Tag variant="status" tone="accent" size="sm">
                      {meal.macros.kcal.toFixed(0)} kcal
                    </Tag>
                    <Tag variant="status" tone="protein" size="sm">
                      {meal.macros.protein.toFixed(0)}p
                    </Tag>
                    <Tag variant="status" tone="carbs" size="sm">
                      {meal.macros.carbs.toFixed(0)}c
                    </Tag>
                    <Tag variant="status" tone="neutral" size="sm">
                      {meal.macros.fat.toFixed(0)}g
                    </Tag>

                    <Button
                      onClick={() => { vibrate(5); onToggleExpand(meal.id); }}
                      variant="ghost"
                      size="small"
                      icon={ArrowDownIcon}
                      iconPosition="right"
                      className={`ml-auto text-[11px] uppercase ${isExpanded ? '[&_svg]:rotate-180 text-brand-accent' : ''}`}
                    >
                      {isExpanded ? 'Ocultar' : 'Detalle'}
                    </Button>
                  </div>
                </div>
              </div>

              {isExpanded ? (
                <div className="border-t border-surface-border/80 bg-surface-hover/30 px-4 py-4 sm:px-5">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {meal.foods.map((food, foodIndex) => {
                      const { foodItem, portions } = food;
                      const cleanPortion = foodItem.standardPortion.split('(')[0].trim();
                      const totalRaw = foodItem.rawWeightG ? foodItem.rawWeightG * portions : null;
                      const totalCooked = foodItem.cookedWeightG ? foodItem.cookedWeightG * portions : null;

                      return (
                        <Card key={`${meal.id}-${foodIndex}`} variant="default" className="p-3.5">
                          <div className="space-y-2">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="truncate text-sm font-bold uppercase tracking-[-0.02em] text-text-primary">
                                  {foodItem.name}
                                </p>
                                <p className="mt-1 text-xs leading-5 text-text-secondary">{cleanPortion}</p>
                              </div>
                              <Tag variant="status" tone="accent" size="sm">
                                {portions.toLocaleString(undefined, { maximumFractionDigits: 1 })}x
                              </Tag>
                            </div>

                            {(totalRaw || totalCooked) ? (
                              <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium text-text-secondary">
                                {totalRaw ? <span>{totalRaw.toFixed(0)}g crudo</span> : null}
                                {totalRaw && totalCooked ? <span className="text-brand-accent/50">→</span> : null}
                                {totalCooked ? <span>{totalCooked.toFixed(0)}g cocido</span> : null}
                              </div>
                            ) : null}
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>
          </Card>
        );
      })}

      {hiddenMeals > 0 ? (
        <Card variant="inset" className="px-4 py-4 text-center">
          <p className="text-sm leading-6 text-text-secondary">
            Hay {hiddenMeals} registro{hiddenMeals === 1 ? '' : 's'} más en este día. Cambia a la vista de bitácora para ver el timeline completo.
          </p>
        </Card>
      ) : null}
    </div>
  );
};

export default MealLog;
