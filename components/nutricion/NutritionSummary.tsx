import React, { useMemo, useState } from 'react';
import { DailyGoals, MacroNutrients } from '../../types';
import Button from '../Button';
import Card from '../Card';
import IconButton from '../IconButton';
import Modal from '../Modal';
import Tag from '../Tag';
import { FireIcon, InformationCircleIcon, SparklesIcon } from '../icons';
import NutritionStatCard from './NutritionStatCard';
import {
  AdvancedMacroRow,
  DEFAULT_CARB_ABS_MAX,
  DEFAULT_CARB_MIN,
  DEFAULT_FAT_ABS_MAX,
  DEFAULT_FAT_MIN,
} from './MacroBarSystem';

interface NutritionSummaryProps {
  consumed: MacroNutrients;
  goals: DailyGoals;
  mealsCount: number;
  dateLabel: string;
}

const NutritionSummary: React.FC<NutritionSummaryProps> = ({
  consumed,
  goals,
  mealsCount,
  dateLabel,
}) => {
  const [showInfoModal, setShowInfoModal] = useState(false);

  const fatMin = goals.fatMin || DEFAULT_FAT_MIN;
  const fatMax = goals.fatMax || DEFAULT_FAT_ABS_MAX;
  const carbMin = goals.carbMin || DEFAULT_CARB_MIN;
  const carbMax = goals.carbMax || DEFAULT_CARB_ABS_MAX;

  const idealFat = goals.fat;
  const idealCarbs = goals.carbs;
  const totalFlexibleBudgetKcal = idealCarbs * 4 + idealFat * 9;

  const remainingKcalForFat = totalFlexibleBudgetKcal - consumed.carbs * 4;
  const rawFatLimit = remainingKcalForFat / 9;
  const dynamicFatMax = Math.min(Math.max(0, rawFatLimit), fatMax);

  const remainingKcalForCarbs = totalFlexibleBudgetKcal - consumed.fat * 9;
  const rawCarbLimit = remainingKcalForCarbs / 4;
  const dynamicCarbMax = Math.min(Math.max(0, rawCarbLimit), carbMax);

  const calorieLimit = goals.kcal;
  const remainingKcal = calorieLimit - consumed.kcal;
  const isKcalOver = remainingKcal < 0;
  const calorieProgress = calorieLimit > 0 ? Math.min((consumed.kcal / calorieLimit) * 100, 100) : 0;
  const proteinProgress = goals.protein > 0 ? Math.min((consumed.protein / goals.protein) * 100, 999) : 0;

  const fuelStatus = useMemo(() => {
    if (isKcalOver) {
      return {
        badge: 'Excedido',
        tone: 'danger' as const,
        copy: 'Hoy ya rebasó el presupuesto energético. Conviene controlar la siguiente comida.',
      };
    }

    if (calorieProgress >= 85) {
      return {
        badge: 'Afinado',
        tone: 'accent' as const,
        copy: 'El día está cerca del objetivo. Mantén precisión en el último bloque de comida.',
      };
    }

    return {
      badge: 'Abierto',
      tone: 'success' as const,
      copy: 'Todavía hay margen de maniobra para completar proteína y energía sin forzar el cierre.',
    };
  }, [calorieProgress, isKcalOver]);

  const proteinBadge =
    proteinProgress >= 100 ? 'Meta' : proteinProgress >= 80 ? 'Cerca' : 'En progreso';

  return (
    <>
      {showInfoModal ? (
        <Modal onClose={() => setShowInfoModal(false)} className="max-w-lg">
          <div className="space-y-5 p-6">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl border border-brand-accent/20 bg-brand-accent/10 p-3">
                <SparklesIcon className="h-6 w-6 text-brand-accent" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-brand-accent">Guía de balance</p>
                <h3 className="text-xl font-black tracking-[-0.03em] text-text-primary">Cómo leer el panel</h3>
              </div>
            </div>

            <Card variant="inset" className="p-4">
              <h4 className="text-sm font-bold uppercase tracking-[0.16em] text-text-primary">Proteína fija</h4>
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                La proteína se lee contra una meta estable. El objetivo es completar el día sin depender del presupuesto dinámico.
              </p>
            </Card>

            <Card variant="inset" className="p-4">
              <h4 className="text-sm font-bold uppercase tracking-[0.16em] text-text-primary">Carbos y grasa comparten presupuesto</h4>
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                Cuando sube uno de los dos, el margen disponible del otro cae. El panel calcula ese intercambio para que el cierre del día no rompa tu objetivo calórico.
              </p>
            </Card>

            <Button onClick={() => setShowInfoModal(false)} className="w-full" size="large" variant="high-contrast">
              Cerrar lectura
            </Button>
          </div>
        </Modal>
      ) : null}

      <div className="space-y-4">
        <Card variant="glass" className="relative overflow-hidden p-5 sm:p-6">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(var(--color-brand-accent-rgb),0.14),transparent_35%),linear-gradient(135deg,rgba(255,255,255,0.03),transparent_58%)]" />

          <div className="relative grid gap-5 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Tag variant="overlay" tone={fuelStatus.tone} size="sm">
                  {fuelStatus.badge}
                </Tag>
                <Tag variant="overlay" tone="neutral" size="sm">
                  {dateLabel}
                </Tag>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-text-secondary">Fuel ledger</p>
                <div className="flex items-end gap-3">
                  <span className={`text-5xl font-black tracking-[-0.06em] sm:text-6xl ${isKcalOver ? 'text-danger' : 'text-text-primary'}`}>
                    {consumed.kcal.toFixed(0)}
                  </span>
                  <span className="pb-1 text-sm font-bold uppercase tracking-[0.18em] text-text-secondary">/ {calorieLimit} kcal</span>
                </div>
                <p className="max-w-2xl text-sm leading-6 text-text-secondary">{fuelStatus.copy}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.18em] text-text-secondary">
                  <span>Cobertura del día</span>
                  <span>{Math.round(calorieProgress)}%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full border border-surface-border bg-surface-hover/70">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${isKcalOver ? 'bg-danger' : 'bg-brand-accent'}`}
                    style={{ width: `${calorieProgress}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <NutritionStatCard
                eyebrow="Restante"
                value={remainingKcal > 0 ? remainingKcal.toFixed(0) : 0}
                detail={isKcalOver ? 'Sin margen disponible en kcal.' : 'Presupuesto todavía utilizable hoy.'}
                icon={FireIcon}
                tone={isKcalOver ? 'danger' : 'accent'}
                badge="kcal"
              />
              <NutritionStatCard
                eyebrow="Proteína"
                value={`${Math.round(Math.min(proteinProgress, 999))}%`}
                detail={`${consumed.protein.toFixed(0)}g de ${goals.protein.toFixed(0)}g`}
                tone="protein"
                badge={proteinBadge}
              />
              <NutritionStatCard
                eyebrow="Registros"
                value={mealsCount}
                detail={mealsCount === 0 ? 'Sin bloques cargados.' : `${mealsCount} bloque${mealsCount === 1 ? '' : 's'} registrados hoy.`}
                tone="neutral"
                badge={mealsCount === 0 ? 'Vacío' : 'Activo'}
              />
            </div>
          </div>
        </Card>

        <Card variant="default" className="p-5 sm:p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-text-secondary">Macro orchestration</p>
              <h3 className="text-xl font-black tracking-[-0.03em] text-text-primary">Distribución diaria</h3>
              <p className="text-sm leading-6 text-text-secondary">
                Proteína contra meta fija. Carbos y grasas se recalibran según el presupuesto energético disponible.
              </p>
            </div>

            <IconButton
              onClick={() => setShowInfoModal(true)}
              icon={InformationCircleIcon}
              label="Ver explicación del balance nutricional"
              variant="secondary"
              size="medium"
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-4">
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

            <div className="grid gap-3">
              <NutritionStatCard
                eyebrow="Límite dinámico carbos"
                value={`${dynamicCarbMax.toFixed(0)}g`}
                detail="Máximo disponible hoy sin romper el intercambio con grasas."
                tone="carbs"
              />
              <NutritionStatCard
                eyebrow="Límite dinámico grasas"
                value={`${dynamicFatMax.toFixed(0)}g`}
                detail="Margen actual de grasas según el consumo total del día."
                tone="accent"
              />
              <NutritionStatCard
                eyebrow="Marco de lectura"
                value={isKcalOver ? 'Ajustar' : 'Control'}
                detail="Si te acercas al techo calórico, las próximas decisiones deben ser más limpias y simples."
                tone={isKcalOver ? 'danger' : 'success'}
              />
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export { NutritionSummary };
export default NutritionSummary;
