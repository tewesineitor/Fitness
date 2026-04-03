import React, { ReactNode } from 'react';

export type StatTrend = 'up' | 'down' | 'neutral';

interface StatChipProps {
  /** Primary numeric or text value */
  value: string | number;
  /** Unit label (g, kg, km, %, etc.) */
  unit?: string;
  /** Secondary descriptor line */
  label: string;
  /** Optional trend indicator: positive / negative / neutral */
  trend?: StatTrend;
  /** Coloring accent class (e.g., 'text-brand-protein') */
  colorClass?: string;
  /** Optional icon */
  icon?: React.FC<{ className?: string }>;
  /** Whether the chip should fill its grid cell height */
  fullHeight?: boolean;
  className?: string;
}

/**
 * StatChip — Obsidian Protocol v2.0
 *
 * Compact data tile for bento grids.
 * Displays a primary value, a unit, a label, and an optional trend arrow.
 *
 * Usage:
 *   <StatChip value="78.4" unit="kg" label="Peso" trend="down" />
 *   <StatChip value="142" unit="g" label="Proteína" colorClass="text-brand-protein" />
 */
const StatChip: React.FC<StatChipProps> = ({
  value,
  unit,
  label,
  trend,
  colorClass = 'text-text-primary',
  icon: Icon,
  fullHeight = false,
  className = '',
}) => {
  const trendIcon: Record<StatTrend, string> = {
    up:      '↑',
    down:    '↓',
    neutral: '→',
  };
  const trendColor: Record<StatTrend, string> = {
    up:      'text-success',
    down:    'text-danger',
    neutral: 'text-text-muted',
  };

  return (
    <div
      className={[
        'bg-surface-bg rounded-2xl border border-surface-border shadow-sm',
        'p-3.5 flex flex-col gap-1',
        fullHeight ? 'h-full' : '',
        className,
      ].join(' ')}
    >
      {/* Label row */}
      <div className="flex items-center gap-1.5">
        {Icon && <Icon className="w-3 h-3 text-text-muted flex-shrink-0" />}
        <span className="text-[8px] font-black uppercase tracking-[0.18em] text-text-muted truncate">
          {label}
        </span>
      </div>

      {/* Value row */}
      <div className="flex items-baseline gap-1 mt-auto">
        <span className={`font-mono font-black text-xl leading-none ${colorClass}`}>
          {value}
        </span>
        {unit && (
          <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider">
            {unit}
          </span>
        )}
        {trend && (
          <span className={`ml-auto text-[10px] font-black ${trendColor[trend]}`}>
            {trendIcon[trend]}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatChip;
