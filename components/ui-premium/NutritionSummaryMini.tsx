import React from 'react';
import SquishyCard from './SquishyCard';
import { EyebrowText, StatLabel, GiantValue, MutedText } from './Typography';
import {
  useFlexibleMacros,
  FlexibleMacroTarget,
  FlexibleMacroConsumed,
} from './useFlexibleMacros';

const RING_SIZE = 140;
const STROKE_W = 12;
const RADIUS = (RING_SIZE - STROKE_W) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const CENTER = RING_SIZE / 2;

interface MacroBarProps {
  label: string;
  current: number;
  target: number;
  unit?: string;
  fillClass: string;
}

const MacroBar: React.FC<MacroBarProps> = ({ label, current, target, unit = 'g', fillClass }) => {
  const pct = target > 0 ? Math.min(current / target, 1) * 100 : 0;
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <EyebrowText>{label}</EyebrowText>
        <StatLabel>{Math.round(current)} / {target}{unit}</StatLabel>
      </div>
      <div className="h-2 rounded-full bg-zinc-800/50 overflow-hidden">
        <div
          className={`h-2 rounded-full transition-all duration-700 ${fillClass}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

interface NutritionSummaryMiniProps {
  target: FlexibleMacroTarget;
  consumed: FlexibleMacroConsumed;
  className?: string;
}

const NutritionSummaryMini: React.FC<NutritionSummaryMiniProps> = ({
  target,
  consumed,
  className = '',
}) => {
  const { kcalRemaining, kcalProgress, isKcalOver } = useFlexibleMacros(target, consumed);

  const dashOffset = CIRCUMFERENCE * (1 - kcalProgress);
  const ringColor = isKcalOver ? 'text-rose-500' : 'text-emerald-400';
  const valueColor = isKcalOver ? 'text-rose-500' : 'text-emerald-400';

  return (
    <SquishyCard
      padding="md"
      className={['flex flex-row items-center gap-6', className].filter(Boolean).join(' ')}
    >
      {/* ── Calorie ring ────────────────────────────────────────────────────── */}
      <div
        className="relative flex-shrink-0"
        style={{ width: RING_SIZE, height: RING_SIZE }}
      >
        <svg
          width={RING_SIZE}
          height={RING_SIZE}
          viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
          className="-rotate-90"
          aria-hidden="true"
        >
          <circle
            cx={CENTER} cy={CENTER} r={RADIUS}
            fill="none" stroke="currentColor"
            strokeWidth={STROKE_W}
            className="text-zinc-800/50"
          />
          <circle
            cx={CENTER} cy={CENTER} r={RADIUS}
            fill="none" stroke="currentColor"
            strokeWidth={STROKE_W}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            className={`${ringColor} transition-all duration-700 ease-out`}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
          <GiantValue className={`text-2xl leading-none ${valueColor}`}>
            {Math.round(kcalRemaining)}
          </GiantValue>
          <MutedText>KCAL REST.</MutedText>
        </div>
      </div>

      {/* ── Macro bars ──────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col gap-3">
        <MacroBar
          label="Proteína"
          current={consumed.protein}
          target={target.protein}
          fillClass="bg-violet-500"
        />
        <MacroBar
          label="Carbohidratos"
          current={consumed.carbs}
          target={target.carbIdeal}
          fillClass="bg-cyan-400"
        />
        <MacroBar
          label="Grasas"
          current={consumed.fat}
          target={target.fatIdeal}
          fillClass="bg-orange-500"
        />
      </div>
    </SquishyCard>
  );
};

export default NutritionSummaryMini;
