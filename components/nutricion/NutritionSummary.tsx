import React, { useState } from 'react';
import { MacroNutrients, DailyGoals } from '../../types';
import Button from '../Button';
import IconButton from '../IconButton';
import Modal from '../Modal';
import { SparklesIcon, FireIcon, InformationCircleIcon } from '../icons';
import {
  AdvancedMacroRow,
  DEFAULT_FAT_ABS_MAX,
  DEFAULT_FAT_MIN,
  DEFAULT_CARB_ABS_MAX,
  DEFAULT_CARB_MIN,
} from './MacroBarSystem';

export const NutritionSummary: React.FC<{ consumed: MacroNutrients; goals: DailyGoals }> = ({ consumed, goals }) => {
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
  const kcalPercent = Math.min((consumed.kcal / calorieLimit) * 100, 100);

  return (
    <div className="bg-surface-bg rounded-xl overflow-hidden border border-surface-border shadow-sm">
      {showInfoModal && (
        <Modal onClose={() => setShowInfoModal(false)} className="max-w-sm">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-brand-accent/10 rounded-xl border border-brand-accent/20">
                <SparklesIcon className="w-6 h-6 text-brand-accent" />
              </div>
              <h3 className="text-lg font-bold text-text-primary uppercase tracking-tight">Dinamica de Energia</h3>
            </div>

            <div className="space-y-6">
              <div className="bg-surface-hover p-4 rounded-xl border border-surface-border">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-text-primary"></div>
                  <h4 className="text-sm font-bold text-text-primary uppercase tracking-widest">Fase Independiente (Ideal)</h4>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Mientras estes en zona blanca, tus Carbohidratos y Grasas son independientes.
                </p>
              </div>

              <div className="bg-warning/10 p-4 rounded-xl border border-warning/20">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-warning"></div>
                  <h4 className="text-sm font-bold text-warning uppercase tracking-widest">Fase Flex (Compartida)</h4>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Si excedes la meta Ideal, entras en una bolsa compartida.
                </p>
              </div>
            </div>

            <Button onClick={() => setShowInfoModal(false)} className="w-full mt-6" size="medium" variant="primary">
              Entendido
            </Button>
          </div>
        </Modal>
      )}

      <div className="p-6 pb-5 relative overflow-hidden">
        <div className="flex justify-between items-start relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <FireIcon className={`w-3.5 h-3.5 ${isKcalOver ? 'text-danger' : 'text-brand-accent'}`} />
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Objetivo Diario</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-4xl sm:text-5xl font-heading font-bold tracking-tight leading-none ${isKcalOver ? 'text-danger' : 'text-text-primary'}`}>
                {consumed.kcal.toFixed(0)}
              </span>
              <span className="text-sm font-bold text-text-secondary/40 uppercase tracking-widest">/ {calorieLimit}</span>
            </div>
          </div>

          <div className="text-right">
            <span className="block text-[9px] font-bold text-text-secondary uppercase tracking-widest mb-1 opacity-60">Restante</span>
            <div className={`text-3xl font-heading font-bold leading-none ${remainingKcal < 0 ? 'text-danger' : 'text-brand-accent'}`}>
              {remainingKcal > 0 ? remainingKcal.toFixed(0) : 0}
            </div>
          </div>
        </div>

        <div className="mt-5 h-2 w-full bg-surface-hover rounded-full overflow-hidden border border-surface-border/30">
          <div
            className={`h-full transition-all duration-1000 ease-out relative ${isKcalOver ? 'bg-danger' : 'bg-text-primary'}`}
            style={{ width: `${kcalPercent}%` }}
          />
        </div>
      </div>

      <div className="h-px w-full bg-surface-border"></div>

      <div className="p-6 pt-5 pb-5 relative">
        <div className="flex justify-between items-end px-1 border-b border-surface-border pb-2.5 mb-6">
          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest opacity-60">Macro</span>
          <span className="text-[9px] font-bold text-text-secondary uppercase tracking-widest opacity-40">RESTANTE / LIMITE</span>
        </div>

        <AdvancedMacroRow
          label="Proteina"
          current={consumed.protein}
          ideal={goals.protein}
          min={goals.protein}
          absoluteMax={goals.protein}
          dynamicLimit={goals.protein}
          colorClass="bg-brand-protein"
          isProtein={true}
        />

        <div className="mt-8 relative pl-4">
          <div className="absolute left-0 top-1 bottom-1 w-0.5 rounded-full bg-surface-border opacity-50"></div>
          <div className="flex items-center gap-2.5 mb-6">
            <span className="text-[9px] font-bold text-text-secondary uppercase tracking-widest opacity-50 bg-surface-bg pr-2">Balance Energetico (Compartido)</span>
            <IconButton
              onClick={() => setShowInfoModal(true)}
              icon={InformationCircleIcon}
              label="Informacion sobre balance compartido"
              variant="ghost"
              size="small"
            />
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

      <div className="px-6 py-4 bg-surface-hover/30 flex items-start gap-3.5 border-t border-surface-border">
        <SparklesIcon className="w-4 h-4 text-brand-accent flex-shrink-0 mt-0.5 opacity-60" />
        <p className="text-[10px] text-text-secondary leading-relaxed font-medium">
          <span className="text-brand-accent font-bold uppercase tracking-widest mr-1">Calculo Dinamico:</span> Las barras se ajustan solas.{' '}
          <Button onClick={() => setShowInfoModal(true)} variant="tertiary" size="small" className="h-auto px-0 py-0 text-[10px] font-semibold normal-case tracking-normal underline decoration-brand-accent/30 hover:text-text-primary hover:decoration-brand-accent">
            Ver detalles.
          </Button>
        </p>
      </div>
    </div>
  );
};

export default NutritionSummary;

