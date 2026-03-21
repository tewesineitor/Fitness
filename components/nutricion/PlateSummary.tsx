import React, { useState, useEffect, useMemo } from 'react';
import { AddedFood, MacroNutrients, MealType, DailyGoals } from '../../types';
import Button from '../Button';
import ChipButton from '../ChipButton';
import Input from '../Input';
import IconButton from '../IconButton';
import StepperControl from '../StepperControl';
import Tag from '../Tag';
import { TrashIcon, XIcon, ChevronRightIcon, CheckCircleIcon, ChartBarIcon, FireIcon, PlateIcon } from '../icons';
import { CompactMacroCard, UnifiedMacroRow } from './plate-summary/MacroBlocks';
import { DEFAULT_CARB_ABS_MAX, DEFAULT_CARB_MIN, DEFAULT_FAT_ABS_MAX, DEFAULT_FAT_MIN, getMacroStatus } from './plate-summary/macroStatus';

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

    const totalFlexibleBudgetKcal = (dailyGoals.carbs * 4) + (dailyGoals.fat * 9);

    const remainingKcalForFat = totalFlexibleBudgetKcal - (totalConsumed.carbs * 4);
    const rawFatLimit = remainingKcalForFat / 9;
    const fatLimit = Math.min(Math.max(0, rawFatLimit), fatLimits.max);

    const remainingKcalForCarbs = totalFlexibleBudgetKcal - (totalConsumed.fat * 9);
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
  const mealTypes: MealType[] = ['Desayuno', 'Almuerzo', 'Cena', 'Colación'];

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
      <div className="fixed bottom-6 left-1/2 z-50 w-[94%] max-w-lg -translate-x-1/2 animate-slide-up-fade-in">
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          className="relative flex w-full items-center justify-between rounded-[24px] border border-surface-border bg-surface-bg/95 p-3 shadow-2xl backdrop-blur-xl transition-all active:scale-[0.98]"
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-[18px] border border-surface-border bg-surface-hover">
                <PlateIcon className="h-7 w-7 text-text-primary" />
              </div>
              <div className="absolute -right-2 -top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 border-surface-bg bg-text-primary text-[11px] font-black text-bg-base shadow-md">
                {plate.length}
              </div>
            </div>
            <div className="text-left">
              <div className="flex items-baseline gap-1.5">
                <span className={`font-mono text-2xl font-black tracking-tighter text-text-primary transition-all ${animateKcal ? 'scale-110 text-brand-accent' : ''}`}>
                  {macros.kcal.toFixed(0)}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">kcal</span>
              </div>
              <div className="mt-0.5 flex gap-3">
                <span className="font-mono text-[10px] font-bold text-brand-protein">P: {macros.protein.toFixed(0)}g</span>
                <span className="font-mono text-[10px] font-bold text-brand-carbs">C: {macros.carbs.toFixed(0)}g</span>
                <span className="font-mono text-[10px] font-bold text-brand-fat">G: {macros.fat.toFixed(0)}g</span>
              </div>
            </div>
          </div>
          <IconButton
            icon={ChevronRightIcon}
            label="Expandir resumen del plato"
            variant="secondary"
            size="large"
            className="mr-1 rotate-90 bg-text-primary text-bg-base border-transparent hover:bg-text-primary/90 hover:text-bg-base"
          />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/80 transition-opacity animate-fade-in sm:items-center sm:p-4 sm:backdrop-blur-sm">
      <div className="flex h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border border-surface-border bg-bg-base shadow-2xl animate-slide-up sm:h-auto sm:max-h-[90vh] sm:rounded-3xl">
        <header className="z-10 flex items-center justify-between border-b border-surface-border bg-surface-bg p-5">
          <div className="flex flex-col">
            <h1 className="text-xl font-black uppercase tracking-tight leading-none text-text-primary">Tu Plato</h1>
            <Tag variant="status" tone="accent" size="sm" className="mt-1.5 w-fit">
              {selectedMealType}
            </Tag>
          </div>
          <IconButton onClick={() => setIsExpanded(false)} icon={XIcon} label="Cerrar plato" variant="secondary" size="medium" />
        </header>

        <div className="flex-grow overflow-y-auto bg-bg-base pb-10 hide-scrollbar">
          <div className="px-5 py-6">
            <div className="flex gap-1 rounded-full border border-surface-border bg-surface-hover p-1">
              {mealTypes.map((type) => (
                <ChipButton
                  key={type}
                  onClick={() => onSelectMealType(type)}
                  active={selectedMealType === type}
                  tone="accent"
                  size="medium"
                  className="flex-1"
                >
                  {type}
                </ChipButton>
              ))}
            </div>
          </div>

          <div className="px-6 mb-8">
            <div className="mb-6 flex items-end justify-between border-b border-surface-border pb-6">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl border border-brand-accent/10 bg-brand-accent/5 p-4 text-brand-accent">
                  <FireIcon className="h-7 w-7" />
                </div>
                <div>
                  <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.25em] text-text-secondary opacity-60">Energia Total</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-mono text-4xl font-bold tracking-tighter leading-none text-text-primary">{macros.kcal.toFixed(0)}</span>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-text-secondary">kcal</span>
                  </div>
                </div>
              </div>

              {dailyGoals && consumedMacros && (
                <ChipButton
                  onClick={() => setShowDetailedStats(!showDetailedStats)}
                  active={showDetailedStats}
                  tone="neutral"
                  size="small"
                  icon={ChartBarIcon}
                >
                  {showDetailedStats ? 'Ocultar' : 'Detalles'}
                </ChipButton>
              )}
            </div>

            {dailyGoals && consumedMacros && carbStatus && fatStatus ? (
              <>
                {!showDetailedStats && (
                  <div className="grid grid-cols-3 gap-2 animate-fade-in-up">
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
                      colorClass="text-brand-fat"
                      isCritical={fatStatus.isBelowMin}
                    />
                  </div>
                )}

                {showDetailedStats && (
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
                      colorClass="bg-brand-fat"
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-xl bg-surface-bg p-4 text-center">
                <p className="text-xs text-text-secondary">Configura tus metas para ver el presupuesto dinamico.</p>
              </div>
            )}
          </div>

          <div className="mb-6 h-2 border-y border-surface-border bg-bg-base" />

          <div className="px-5">
            <div className="mb-5 flex items-center justify-between px-1">
              <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-text-secondary opacity-60">
                Ingredientes ({plate.length})
              </label>
              <Button onClick={onClear} variant="destructive" size="small" icon={TrashIcon}>
                Limpiar
              </Button>
            </div>

            <div className="space-y-3">
              {plate.map((item) => {
                const displayQty = item.portions;
                const cleanPortion = item.foodItem.standardPortion.split('(')[0].trim();
                const totalRaw = item.foodItem.rawWeightG ? item.foodItem.rawWeightG * displayQty : null;
                const totalCooked = item.foodItem.cookedWeightG ? item.foodItem.cookedWeightG * displayQty : null;
                const itemProtein = (item.foodItem.macrosPerPortion?.protein || 0) * displayQty;
                const itemCarbs = (item.foodItem.macrosPerPortion?.carbs || 0) * displayQty;
                const itemFat = (item.foodItem.macrosPerPortion?.fat || 0) * displayQty;
                const itemKcal = (item.foodItem.macrosPerPortion?.kcal || 0) * displayQty;

                return (
                  <div key={item.foodItem.id} className="group flex flex-col gap-2 rounded-2xl border border-surface-border bg-surface-bg p-3 transition-all hover:border-surface-border/80">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold leading-tight text-text-primary">{item.foodItem.name}</p>
                        <div className="mt-0.5 flex items-center gap-1.5">
                          <span className="truncate text-[10px] font-medium text-text-secondary">{cleanPortion}</span>
                          {(totalRaw && totalCooked) ? (
                            <>
                              <span className="text-[8px] text-text-secondary/40">•</span>
                              <span className="font-mono text-[9px] text-text-secondary">{totalRaw.toFixed(0)}g to {totalCooked.toFixed(0)}g</span>
                            </>
                          ) : (totalRaw && !cleanPortion.includes('g')) ? (
                            <>
                              <span className="text-[8px] text-text-secondary/40">•</span>
                              <span className="font-mono text-[9px] text-text-secondary">{totalRaw.toFixed(0)}g</span>
                            </>
                          ) : null}
                        </div>
                      </div>
                      <IconButton
                        onClick={() => onUpdateItemPortion(item.foodItem.id, 0)}
                        icon={TrashIcon}
                        label={`Eliminar ${item.foodItem.name}`}
                        variant="ghost"
                        size="small"
                        className="flex-shrink-0"
                      />
                    </div>

                    <div className="mt-1 flex items-center justify-between gap-2">
                      <div className="flex gap-2.5 text-[9px] font-mono font-bold">
                        <div className="flex flex-col">
                          <span className="mb-0.5 text-[7px] uppercase leading-none text-brand-protein/60">Prot</span>
                          <span className="leading-none text-brand-protein">{itemProtein.toFixed(1)}g</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="mb-0.5 text-[7px] uppercase leading-none text-brand-carbs/60">Carb</span>
                          <span className="leading-none text-brand-carbs">{itemCarbs.toFixed(1)}g</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="mb-0.5 text-[7px] uppercase leading-none text-brand-fat/60">Gras</span>
                          <span className="leading-none text-brand-fat">{itemFat.toFixed(1)}g</span>
                        </div>
                        <div className="ml-0.5 flex flex-col border-l border-surface-border pl-2">
                          <span className="mb-0.5 text-[7px] uppercase leading-none text-text-secondary/60">Kcal</span>
                          <span className="leading-none text-text-primary">{itemKcal.toFixed(0)}</span>
                        </div>
                      </div>

                      <StepperControl
                        value={item.portions.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                        onValueClick={() => onEditItemPortion(item)}
                        onDecrement={() => onUpdateItemPortion(item.foodItem.id, item.portions - 0.5)}
                        onIncrement={() => onUpdateItemPortion(item.foodItem.id, item.portions + 0.5)}
                        decrementLabel={`Reducir porcion de ${item.foodItem.name}`}
                        incrementLabel={`Aumentar porcion de ${item.foodItem.name}`}
                        className="rounded-xl"
                        valueClassName="min-w-[2.5rem] text-xs"
                        size="small"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 mb-4">
              <label className="mb-2.5 block pl-1 text-[9px] font-bold uppercase tracking-[0.25em] text-text-secondary opacity-60">
                Timing de Nutrientes
              </label>
              <div className="flex gap-2">
                <ChipButton
                  onClick={() => onTimingChange?.('pre-workout')}
                  active={timing === 'pre-workout'}
                  tone="accent"
                  size="medium"
                  className="flex-1"
                >
                  Pre-Entreno
                </ChipButton>
                <ChipButton
                  onClick={() => onTimingChange?.('post-workout')}
                  active={timing === 'post-workout'}
                  tone="success"
                  size="medium"
                  className="flex-1"
                >
                  Post-Entreno
                </ChipButton>
              </div>
            </div>

            <div className="mb-8">
              <label className="mb-2.5 block pl-1 text-[9px] font-bold uppercase tracking-[0.25em] text-text-secondary opacity-60">
                Nombre del Plato
              </label>
              <Input
                type="text"
                value={mealName}
                onChange={(e) => onMealNameChange(e.target.value)}
                placeholder="Ej. Comida Post-Entreno"
                className="text-sm font-bold uppercase tracking-wider"
                containerClassName="w-full"
              />
            </div>

            <div className="mb-12 mt-6 px-4">
              <Button
                onClick={onRegister}
                variant="high-contrast"
                size="large"
                className="w-full rounded-2xl py-5 text-xs font-black tracking-[0.2em] shadow-2xl"
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
