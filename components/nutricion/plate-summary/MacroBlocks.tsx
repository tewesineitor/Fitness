import React from 'react';
import { getMacroStatus } from './macroStatus';

const compactToneMap: Record<string, string> = {
  'text-brand-protein': 'border-brand-protein/20 bg-brand-protein/6',
  'text-brand-carbs': 'border-brand-carbs/20 bg-brand-carbs/6',
  'text-text-primary': 'border-surface-border bg-surface-bg',
};

export const CompactMacroCard: React.FC<{
  label: string;
  mealValue: number;
  remaining: number;
  limit: number;
  statusText: string;
  statusColor: string;
  colorClass: string;
  isCritical?: boolean;
}> = ({ label, mealValue, remaining, limit, statusText, statusColor, colorClass, isCritical }) => (
  <div
    className={`relative overflow-hidden rounded-[1.35rem] border p-4 transition-all ${
      isCritical ? 'border-yellow-500/30 bg-yellow-500/8' : compactToneMap[colorClass] || 'border-surface-border bg-surface-bg'
    }`}
  >
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">{label}</p>
        <div className="mt-3 flex items-end gap-1.5">
          <span className={`font-mono text-3xl font-black leading-none tracking-[-0.08em] ${colorClass}`}>
            +{mealValue.toFixed(0)}
          </span>
          <span className={`pb-0.5 text-[10px] font-black uppercase tracking-[0.18em] ${colorClass}`}>g</span>
        </div>
      </div>

      {statusText ? (
        <span className={`rounded-full border px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.18em] ${statusColor}`}>
          {statusText}
        </span>
      ) : null}
    </div>

    <div className="mt-5 flex items-end justify-between border-t border-surface-border/60 pt-3">
      <span className="text-[9px] font-black uppercase tracking-[0.18em] text-text-secondary">Restante</span>
      <div className="text-right">
        <span className={`font-mono text-base font-black ${remaining < 0 ? 'text-danger' : 'text-text-primary'}`}>
          {remaining.toFixed(0)}
        </span>
        <span className="ml-1 text-[10px] font-semibold text-text-secondary">/ {limit.toFixed(0)}</span>
      </div>
    </div>
  </div>
);

export const UnifiedMacroRow: React.FC<{
  label: string;
  consumed: number;
  current: number;
  ideal: number;
  min: number;
  absoluteMax: number;
  dynamicLimit: number;
  colorClass: string;
  isProtein?: boolean;
}> = ({ label, consumed, current, ideal, min, absoluteMax, dynamicLimit, colorClass, isProtein = false }) => {
  const totalAfterMeal = consumed + current;
  const { statusText, statusColor, remaining, displayLimit, ceiling, isBelowMin, isSqueezed, isFlexing, isOverLimit } =
    getMacroStatus(totalAfterMeal, ideal, min, absoluteMax, dynamicLimit);

  if (isProtein) {
    const remainingProt = ideal - totalAfterMeal;
    const totalScale = ideal * 1.2;
    const getPct = (value: number) => Math.min((value / totalScale) * 100, 100);

    return (
      <div className="rounded-[1.25rem] border border-surface-border bg-surface-bg/85 p-4">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-text-secondary">{label}</p>
            <p className="mt-1 text-sm font-medium text-text-secondary">Objetivo lineal sobre el total del dia.</p>
          </div>
          <div className="text-right">
            <p className={`font-mono text-xl font-black ${remainingProt < 0 ? 'text-brand-protein' : 'text-text-primary'}`}>
              {remainingProt.toFixed(0)}
            </p>
            <p className="text-[10px] font-semibold text-text-secondary">/ {ideal.toFixed(0)}</p>
          </div>
        </div>

        <div className="relative h-3 overflow-hidden rounded-full border border-surface-border bg-surface-hover">
          <div className="absolute top-0 bottom-0 left-0 bg-text-primary/10" style={{ width: `${getPct(consumed)}%` }} />
          <div className={`absolute top-0 bottom-0 ${colorClass}`} style={{ left: `${getPct(consumed)}%`, width: `${getPct(current)}%` }} />
          <div className="absolute top-0 bottom-0 w-px bg-text-primary/40" style={{ left: `${getPct(ideal)}%` }} />
        </div>
      </div>
    );
  }

  const totalScale = absoluteMax * 1.05;
  const getPct = (value: number) => Math.min((value / totalScale) * 100, 100);
  const consumedPct = getPct(consumed);
  const currentPct = getPct(current);
  const minPct = getPct(min);
  const idealPct = getPct(ideal);
  const ceilingPct = getPct(ceiling);
  let barColor = colorClass;
  if (isOverLimit) barColor = 'bg-red-500';
  else if (isFlexing) barColor = 'bg-orange-400';

  return (
    <div className="rounded-[1.25rem] border border-surface-border bg-surface-bg/85 p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-text-secondary">{label}</p>
            {statusText ? <span className={`text-[9px] font-black uppercase tracking-[0.18em] ${statusColor}`}>{statusText}</span> : null}
          </div>
          <p className="mt-1 text-sm font-medium text-text-secondary">
            {isBelowMin ? 'Presupuesto comprimido.' : 'Comparativo contra consumo acumulado.'}
          </p>
        </div>

        <div className="text-right">
          <p
            className={`font-mono text-xl font-black ${
              remaining < 0 ? 'text-danger' : isFlexing ? 'text-orange-400' : 'text-text-primary'
            }`}
          >
            {remaining.toFixed(0)}
          </p>
          <p className="text-[10px] font-semibold text-text-secondary">/ {displayLimit.toFixed(0)}</p>
        </div>
      </div>

      <div className="relative h-3 overflow-hidden rounded-full border border-surface-border bg-surface-hover">
        {isSqueezed ? (
          <div
            className="absolute top-0 bottom-0 z-0 opacity-30"
            style={{
              left: `${ceilingPct}%`,
              width: `${idealPct - ceilingPct}%`,
              backgroundImage: 'repeating-linear-gradient(45deg, #ef4444 0, #ef4444 2px, transparent 2px, transparent 6px)',
            }}
          />
        ) : null}

        <div className="absolute top-0 bottom-0 left-0 bg-text-primary/10" style={{ width: `${consumedPct}%` }} />
        <div className={`absolute top-0 bottom-0 ${barColor}`} style={{ left: `${consumedPct}%`, width: `${currentPct}%` }} />
        <div className="absolute top-0 bottom-0 w-px bg-yellow-500/60" style={{ left: `${minPct}%` }} />
        <div className="absolute top-0 bottom-0 w-px bg-text-primary/35" style={{ left: `${ceilingPct}%` }} />
      </div>
    </div>
  );
};
