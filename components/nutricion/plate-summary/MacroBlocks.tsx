import React from 'react';
import { getMacroStatus } from './macroStatus';

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
  <div className={`bg-surface-bg border p-3 rounded-2xl flex flex-col justify-between relative overflow-hidden transition-all h-full ${isCritical ? 'border-yellow-500/40 bg-yellow-500/5' : 'border-surface-border'}`}>
    <div className="flex justify-between items-start mb-1">
      <span className="text-[8px] font-bold text-text-secondary uppercase tracking-[0.2em]">{label}</span>
      {statusText && (
        <span className={`text-[7px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-surface-hover border border-surface-border ${statusColor}`}>
          {statusText}
        </span>
      )}
    </div>

    <div className="flex items-baseline gap-0.5 mb-2">
      <span className={`text-xl font-bold font-mono tracking-tighter leading-none ${colorClass}`}>
        +{mealValue.toFixed(0)}
      </span>
      <span className={`text-[9px] font-bold ${colorClass.replace('text-', 'text-opacity-70 ')}`}>g</span>
    </div>

    <div className="mt-auto pt-2 border-t border-surface-border flex justify-between items-end">
      <span className="text-[7px] text-text-secondary font-bold uppercase tracking-widest opacity-50">Rest.</span>
      <div className="text-right leading-none">
        <span className={`text-[10px] font-mono font-bold ${remaining < 0 ? 'text-red-500' : 'text-text-primary'}`}>
          {remaining.toFixed(0)}
        </span>
        <span className="text-[8px] text-text-secondary opacity-40 font-bold ml-0.5">
          /{limit.toFixed(0)}
        </span>
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
  const { statusText, statusColor, remaining, displayLimit, ceiling, isBelowMin, isSqueezed, isFlexing, isOverLimit } = getMacroStatus(totalAfterMeal, ideal, min, absoluteMax, dynamicLimit);

  if (isProtein) {
    const remainingProt = ideal - totalAfterMeal;
    const totalScale = ideal * 1.2;
    const getPct = (v: number) => Math.min((v / totalScale) * 100, 100);
    return (
      <div className="mb-4 last:mb-0">
        <div className="flex justify-between items-end mb-1">
          <span className="text-[10px] font-black uppercase tracking-[0.15em] text-text-secondary">{label}</span>
          <div className="flex items-baseline gap-1">
            <span className={`text-sm font-bold font-mono ${remainingProt < 0 ? 'text-brand-protein' : 'text-text-primary'}`}>{remainingProt.toFixed(0)}</span>
            <span className="text-[9px] text-text-secondary opacity-50">/ {ideal.toFixed(0)}</span>
          </div>
        </div>
        <div className="h-2 w-full bg-surface-hover rounded-full relative overflow-hidden border border-surface-border">
          <div className="absolute top-0 bottom-0 w-0.5 bg-text-primary z-30" style={{ left: `${getPct(ideal)}%` }} />
          <div className="absolute top-0 bottom-0 left-0 bg-text-primary/10 h-full rounded-l-sm" style={{ width: `${getPct(consumed)}%` }} />
          <div className={`absolute top-0 bottom-0 h-full ${colorClass}`} style={{ left: `${getPct(consumed)}%`, width: `${getPct(current)}%` }} />
        </div>
      </div>
    );
  }

  const totalScale = absoluteMax * 1.05;
  const getPct = (val: number) => Math.min((val / totalScale) * 100, 100);
  const consumedPct = getPct(consumed);
  const currentPct = getPct(current);
  const minPct = getPct(min);
  const idealPct = getPct(ideal);
  const ceilingPct = getPct(ceiling);
  let barColor = colorClass;
  if (isOverLimit) barColor = 'bg-red-500';
  else if (isFlexing) barColor = 'bg-orange-400';

  return (
    <div className="mb-4 last:mb-0">
      <div className="flex justify-between items-end mb-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-[0.15em] text-text-secondary">{label}</span>
          {statusText && <span className={`text-[7px] font-bold ${statusColor}`}>{statusText}</span>}
        </div>
        <div className="flex items-baseline gap-1">
          <span className={`text-sm font-bold font-mono ${remaining < 0 ? 'text-red-500' : isFlexing ? 'text-orange-400' : 'text-text-primary'}`}>{remaining.toFixed(0)}</span>
          <span className="text-[9px] text-text-secondary opacity-50">/ {displayLimit.toFixed(0)}</span>
        </div>
      </div>

      <div className="h-2 w-full bg-surface-hover rounded-md relative overflow-hidden border border-surface-border">
        {isSqueezed && (
          <div
            className="absolute top-0 bottom-0 z-0 opacity-30 border-l border-red-500/50"
            style={{
              left: `${ceilingPct}%`,
              width: `${idealPct - ceilingPct}%`,
              backgroundImage: 'repeating-linear-gradient(45deg, #ef4444 0, #ef4444 2px, transparent 2px, transparent 6px)',
            }}
          />
        )}

        <div className="absolute top-0 bottom-0 w-px bg-yellow-600/50 z-0 dashed" style={{ left: `${minPct}%` }} />
        {!isSqueezed && <div className="absolute top-0 bottom-0 w-px bg-text-primary/20 z-0 dashed" style={{ left: `${idealPct}%` }} />}

        <div className={`absolute top-0 bottom-0 w-0.5 z-30 shadow-[0_0_5px_currentColor] ${isBelowMin ? 'bg-yellow-400' : 'bg-text-primary'}`} style={{ left: `${ceilingPct}%` }} />
        <div className="absolute top-0 bottom-0 left-0 bg-text-primary/10 h-full rounded-l-sm" style={{ width: `${consumedPct}%` }} />
        <div className={`absolute top-0 bottom-0 h-full transition-all duration-500 ${barColor}`} style={{ left: `${consumedPct}%`, width: `${currentPct}%` }} />
      </div>
    </div>
  );
};
