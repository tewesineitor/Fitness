import React from 'react';
import Card from '../../Card';
import Tag from '../../Tag';
import type { MacroNutrients } from '../../../types';
import { ChevronRightIcon, PlateIcon } from '../../icons';

interface PlateSummaryCollapsedDockProps {
  plateCount: number;
  macros: MacroNutrients;
  animateKcal: boolean;
  onExpand: () => void;
}

const PlateSummaryCollapsedDock: React.FC<PlateSummaryCollapsedDockProps> = ({
  plateCount,
  macros,
  animateKcal,
  onExpand,
}) => (
  <div className="fixed bottom-5 left-1/2 z-50 w-[94%] max-w-lg -translate-x-1/2 animate-slide-up-fade-in">
    <Card
      as="button"
      onClick={onExpand}
      variant="glass"
      className="group relative flex w-full items-center justify-between overflow-hidden rounded-[1.8rem] border-white/10 px-4 py-4 shadow-2xl"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-r from-brand-accent/10 via-brand-protein/10 to-transparent" />

      <div className="relative z-10 flex items-center gap-4">
        <div className="relative flex h-14 w-14 items-center justify-center rounded-[1.4rem] border border-surface-border/70 bg-surface-bg/80">
          <PlateIcon className="h-6 w-6 text-text-primary" />
          <div className="absolute -right-2 -top-2 rounded-full border-2 border-surface-bg bg-text-primary px-2 py-1 text-[10px] font-black text-bg-base shadow-md">
            {plateCount}
          </div>
        </div>

        <div className="text-left">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">Meal in progress</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span
              className={`font-mono text-3xl font-black leading-none tracking-[-0.08em] text-text-primary transition-all duration-300 ${
                animateKcal ? 'scale-[1.04] text-brand-accent' : ''
              }`}
            >
              {macros.kcal.toFixed(0)}
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">kcal</span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Tag variant="status" tone="protein" size="sm">
              {macros.protein.toFixed(0)}g P
            </Tag>
            <Tag variant="status" tone="carbs" size="sm">
              {macros.carbs.toFixed(0)}g C
            </Tag>
            <Tag variant="status" tone="neutral" size="sm">
              {macros.fat.toFixed(0)}g G
            </Tag>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-surface-border/70 bg-surface-bg/85 text-text-primary transition-transform duration-200 group-hover:translate-x-0.5">
        <ChevronRightIcon className="h-5 w-5 rotate-90" />
      </div>
    </Card>
  </div>
);

export default PlateSummaryCollapsedDock;
