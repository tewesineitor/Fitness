import React, { useEffect, useMemo, useState } from 'react';
import type { AddedFood, DailyGoals, MacroNutrients, MealType } from '../../types';
import DialogSectionCard from '../DialogSectionCard';
import Button from '../Button';
import ChipButton from '../ChipButton';
import Input from '../Input';
import IconButton from '../IconButton';
import Tag from '../Tag';
import { ChartBarIcon, CheckCircleIcon, FireIcon, TrashIcon, XIcon } from '../icons';
import { CompactMacroCard, UnifiedMacroRow } from './plate-summary/MacroBlocks';
import {
  DEFAULT_CARB_ABS_MAX,
  DEFAULT_CARB_MIN,
  DEFAULT_FAT_ABS_MAX,
  DEFAULT_FAT_MIN,
  getMacroStatus,
} from './plate-summary/macroStatus';
import PlateIngredientCard from './plate-summary/PlateIngredientCard';
import PlateSummaryCollapsedDock from './plate-summary/PlateSummaryCollapsedDock';

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

const mealTypes: MealType[] = ['Desayuno', 'Almuerzo', 'Cena', 'Colaci\u00F3n'];

const mealTypeLabels: Record<string, string> = {
  Desayuno: 'Desayuno',
  Almuerzo: 'Almuerzo',
  Cena: 'Cena',
  ['Colaci\u00F3n']: 'Colacion',
};

const PlateSummary: React.FC<PlateSummaryProps> = ({
  plate,
  macros,
  mealName,
  onMealNameChange,
  onRegister,
  onClear,
  selectedMealType,
  onSelectMealType,
  onUpdateItemPortion,
  onEditItemPortion,
  dailyGoals,
  consumedMacros,
  timing,
  onTimingChange,
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
    if (!dailyGoals) {
      return {
        fatLimits: { min: DEFAULT_FAT_MIN, max: DEFAULT_FAT_ABS_MAX },
        carbLimits: { min: DEFAULT_CARB_MIN, max: DEFAULT_CARB_ABS_MAX },
      };
    }

    return {
      fatLimits: { min: dailyGoals.fatMin || DEFAULT_FAT_MIN, max: dailyGoals.fatMax || DEFAULT_FAT_ABS_MAX },
      carbLimits: { min: dailyGoals.carbMin || DEFAULT_CARB_MIN, max: dailyGoals.carbMax || DEFAULT_CARB_ABS_MAX },
    };
  }, [dailyGoals]);

  const dynamicData = useMemo(() => {
    if (!dailyGoals) return { fatLimit: 999, carbLimit: 999 };

    const totalFlexibleBudgetKcal = dailyGoals.carbs * 4 + dailyGoals.fat * 9;

    const remainingKcalForFat = totalFlexibleBudgetKcal - totalConsumed.carbs * 4;
    const rawFatLimit = remainingKcalForFat / 9;
    const fatLimit = Math.min(Math.max(0, rawFatLimit), fatLimits.max);

    const remainingKcalForCarbs = totalFlexibleBudgetKcal - totalConsumed.fat * 9;
    const rawCarbLimit = remainingKcalForCarbs / 4;
    const carbLimit = Math.min(Math.max(0, rawCarbLimit), carbLimits.max);

    return { fatLimit, carbLimit };
  }, [dailyGoals, totalConsumed, fatLimits, carbLimits]);

  const carbStatus = useMemo(
    () => (dailyGoals ? getMacroStatus(totalConsumed.carbs, dailyGoals.carbs, carbLimits.min, carbLimits.max, dynamicData.carbLimit) : null),
    [totalConsumed.carbs, dailyGoals, dynamicData.carbLimit, carbLimits]
  );

  const fatStatus = useMemo(
    () => (dailyGoals ? getMacroStatus(totalConsumed.fat, dailyGoals.fat, fatLimits.min, fatLimits.max, dynamicData.fatLimit) : null),
    [totalConsumed.fat, dailyGoals, dynamicData.fatLimit, fatLimits]
  );

  const proteinRemaining = dailyGoals ? dailyGoals.protein - totalConsumed.protein : 0;
  const selectedMealLabel = selectedMealType ? mealTypeLabels[selectedMealType] || selectedMealType : 'Meal';

  useEffect(() => {
    if (plate.length > 0) {
      setAnimateKcal(true);
      const timer = setTimeout(() => setAnimateKcal(false), 300);
      return () => clearTimeout(timer);
    }
  }, [macros.kcal, plate.length]);

  if (plate.length === 0) return null;

  if (!isExpanded) {
    return (
      <PlateSummaryCollapsedDock
        plateCount={plate.length}
        macros={macros}
        animateKcal={animateKcal}
        onExpand={() => setIsExpanded(true)}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/75 px-0 py-0 backdrop-blur-md sm:items-center sm:px-4 sm:py-4">
      <div className="flex h-[100dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[2rem] border border-surface-border bg-bg-base shadow-2xl sm:h-auto sm:max-h-[92vh] sm:rounded-[2rem]">
        <div className="relative overflow-hidden border-b border-surface-border p-5">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-brand-accent/10 via-brand-protein/10 to-transparent" />

          <div className="relative z-10 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <Tag variant="status" tone="accent" size="sm">
                Plate Builder
              </Tag>
              <h2 className="mt-3 text-2xl font-black uppercase tracking-[-0.05em] text-text-primary">Tu plato</h2>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                Edita porciones, revisa presupuesto de macros y registra la comida sin romper el flujo.
              </p>
            </div>

            <IconButton onClick={() => setIsExpanded(false)} icon={XIcon} label="Cerrar plato" variant="secondary" size="small" />
          </div>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-5 hide-scrollbar">
          <div className="overflow-hidden rounded-[1.75rem] border border-surface-border bg-surface-bg/80 p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Tag variant="status" tone="neutral" size="sm">
                    {selectedMealLabel}
                  </Tag>
                  <Tag variant="overlay" tone="accent" size="sm" count={plate.length}>
                    Items
                  </Tag>
                </div>

                <div className="mt-4 flex items-end gap-3">
                  <div className="rounded-full border border-brand-accent/15 bg-brand-accent/8 p-3 text-brand-accent">
                    <FireIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-text-secondary">Energia total</p>
                    <div className="mt-1 flex items-end gap-2">
                      <span className="font-mono text-5xl font-black leading-none tracking-[-0.08em] text-text-primary">
                        {macros.kcal.toFixed(0)}
                      </span>
                      <span className="pb-1 text-[10px] font-black uppercase tracking-[0.22em] text-text-secondary">kcal</span>
                    </div>
                  </div>
                </div>
              </div>

              {dailyGoals && consumedMacros ? (
                <ChipButton
                  onClick={() => setShowDetailedStats((value) => !value)}
                  active={showDetailedStats}
                  tone="neutral"
                  size="small"
                  icon={ChartBarIcon}
                >
                  {showDetailedStats ? 'Resumen' : 'Detalles'}
                </ChipButton>
              ) : null}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <Tag variant="status" tone="protein" size="sm">
                {macros.protein.toFixed(1)}g protein
              </Tag>
              <Tag variant="status" tone="carbs" size="sm">
                {macros.carbs.toFixed(1)}g carbs
              </Tag>
              <Tag variant="status" tone="neutral" size="sm">
                {macros.fat.toFixed(1)}g grasas
              </Tag>
            </div>

            <div className="mt-5">
              {dailyGoals && consumedMacros && carbStatus && fatStatus ? (
                showDetailedStats ? (
                  <div className="space-y-4 animate-fade-in-up">
                    <UnifiedMacroRow
                      label="Proteina"
                      consumed={consumedMacros.protein}
                      current={macros.protein}
                      ideal={dailyGoals.protein}
                      min={dailyGoals.protein}
                      absoluteMax={dailyGoals.protein}
                      dynamicLimit={dailyGoals.protein}
                      colorClass="bg-brand-protein"
                      isProtein
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
                      colorClass="bg-text-primary"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 animate-fade-in-up">
                    <CompactMacroCard
                      label="Proteina"
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
                      colorClass="text-text-primary"
                      isCritical={fatStatus.isBelowMin}
                    />
                  </div>
                )
              ) : (
                <div className="rounded-[1.25rem] border border-surface-border bg-bg-base px-4 py-4 text-sm text-text-secondary">
                  Configura tus metas diarias para ver presupuesto dinamico y tension entre macros.
                </div>
              )}
            </div>
          </div>

          <DialogSectionCard className="space-y-4 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-text-secondary">Meal framing</p>
                <h3 className="mt-2 text-lg font-black uppercase tracking-[-0.04em] text-text-primary">Contexto de la comida</h3>
              </div>
              <Tag variant="status" tone="neutral" size="sm">
                {selectedMealLabel}
              </Tag>
            </div>

            <div>
              <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">Tipo de comida</p>
              <div className="flex flex-wrap gap-2">
                {mealTypes.map((type) => (
                  <ChipButton
                    key={type}
                    onClick={() => onSelectMealType(type)}
                    active={selectedMealType === type}
                    tone="accent"
                    size="medium"
                  >
                    {mealTypeLabels[type] || type}
                  </ChipButton>
                ))}
              </div>
            </div>

            {onTimingChange ? (
              <div>
                <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">Timing</p>
                <div className="flex flex-wrap gap-2">
                  <ChipButton
                    onClick={() => onTimingChange('pre-workout')}
                    active={timing === 'pre-workout'}
                    tone="accent"
                    size="medium"
                  >
                    Pre workout
                  </ChipButton>
                  <ChipButton
                    onClick={() => onTimingChange('post-workout')}
                    active={timing === 'post-workout'}
                    tone="success"
                    size="medium"
                  >
                    Post workout
                  </ChipButton>
                </div>
              </div>
            ) : null}

            <Input
              type="text"
              value={mealName}
              onChange={(event) => onMealNameChange(event.target.value)}
              label="Nombre del plato"
              placeholder="Ej. Comida post workout"
              className="text-sm font-semibold"
              containerClassName="w-full"
            />
          </DialogSectionCard>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3 px-1">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-text-secondary">Ingredientes</p>
                <p className="mt-1 text-sm font-medium text-text-secondary">{plate.length} elementos activos en el plato.</p>
              </div>

              <Button onClick={onClear} variant="destructive" size="small" icon={TrashIcon}>
                Limpiar
              </Button>
            </div>

            <div className="space-y-3">
              {plate.map((item) => (
                <PlateIngredientCard
                  key={item.foodItem.id}
                  item={item}
                  onUpdateItemPortion={onUpdateItemPortion}
                  onEditItemPortion={onEditItemPortion}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-surface-border p-5">
          <div className="mb-4 flex items-center justify-between rounded-[1.35rem] border border-surface-border bg-surface-bg/80 px-4 py-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">Ready to register</p>
              <p className="mt-1 text-sm font-medium text-text-primary">{plate.length} items - {macros.kcal.toFixed(0)} kcal</p>
            </div>
            <Tag variant="overlay" tone="accent" size="sm">
              {selectedMealLabel}
            </Tag>
          </div>

          <Button
            onClick={onRegister}
            variant="high-contrast"
            size="large"
            className="w-full rounded-[1.35rem] py-5 text-xs font-black tracking-[0.2em] shadow-2xl"
            icon={CheckCircleIcon}
          >
            REGISTRAR COMIDA
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlateSummary;
