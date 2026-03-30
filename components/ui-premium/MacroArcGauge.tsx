import React from 'react';
import SquishyCard from './SquishyCard';
import { CardTitle, EyebrowText, MonoValue, MutedText, StatLabel, StatValue } from './Typography';

type MacroTone = 'emerald' | 'amber' | 'sky' | 'violet' | 'cyan' | 'orange';

export interface MacroArcGaugeItem {
  label: string;
  value: number;
  target: number;
  unit?: string;
  tone?: MacroTone;
}

interface MacroArcGaugeProps {
  eyebrow?: string;
  title?: string;
  macros: MacroArcGaugeItem[];
  className?: string;
}

const toneClasses: Record<MacroTone, string> = {
  emerald: 'text-emerald-400',
  amber: 'text-amber-300',
  sky: 'text-sky-300',
  violet: 'text-violet-500',
  cyan: 'text-cyan-400',
  orange: 'text-orange-500',
};

const radii = [46, 36, 26];

const clampProgress = (value: number, target: number) => {
  if (target <= 0) {
    return 0;
  }

  return Math.min(value / target, 1);
};

const MacroArcGauge: React.FC<MacroArcGaugeProps> = ({
  eyebrow = 'Hoy / Macros',
  title = 'Macro Arc Gauge',
  macros,
  className = '',
}) => {
  const visibleMacros = macros.slice(0, 3);
  const totalValue = visibleMacros.reduce((sum, macro) => sum + macro.value, 0);
  const totalTarget = visibleMacros.reduce((sum, macro) => sum + macro.target, 0);
  const averageProgress = visibleMacros.length
    ? visibleMacros.reduce((sum, macro) => sum + clampProgress(macro.value, macro.target), 0) / visibleMacros.length
    : 0;

  return (
    <SquishyCard padding="lg" className={['flex flex-col gap-6', className].filter(Boolean).join(' ')}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <EyebrowText>{eyebrow}</EyebrowText>
          <CardTitle>{title}</CardTitle>
        </div>
        <MonoValue>{totalValue} / {totalTarget} g</MonoValue>
      </div>

      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="relative mx-auto h-64 w-64 shrink-0">
          <svg viewBox="0 0 120 120" className="h-full w-full">
            {visibleMacros.map((macro, index) => {
              const radius = radii[index] ?? radii[radii.length - 1];
              const circumference = 2 * Math.PI * radius;
              const progress = clampProgress(macro.value, macro.target);
              const strokeDashoffset = circumference * (1 - progress);
              const toneClass = toneClasses[macro.tone ?? 'emerald'];

              return (
                <g key={macro.label} transform="rotate(-90 60 60)">
                  <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="5"
                    className="text-zinc-800"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className={toneClass}
                  />
                </g>
              );
            })}
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <StatValue className="text-3xl text-emerald-400">{Math.round(averageProgress * 100)}%</StatValue>
            <StatLabel>Cumplimiento</StatLabel>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-3">
          {visibleMacros.map((macro) => {
            const progress = Math.round(clampProgress(macro.value, macro.target) * 100);

            return (
              <div
                key={macro.label}
                className="flex items-center justify-between gap-4 rounded-2xl border border-zinc-800/50 bg-zinc-900/80 backdrop-blur-sm px-4 py-3"
              >
                <div className="flex flex-col gap-1">
                  <EyebrowText>{macro.label}</EyebrowText>
                  <MutedText>{progress}% de la meta</MutedText>
                </div>
                <MonoValue>
                  {macro.value} / {macro.target} {macro.unit ?? 'g'}
                </MonoValue>
              </div>
            );
          })}
        </div>
      </div>
    </SquishyCard>
  );
};

export default MacroArcGauge;
