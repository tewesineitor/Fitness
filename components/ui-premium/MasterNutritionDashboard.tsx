import React from 'react';
import SquishyCard from './SquishyCard';
import { EyebrowText, GiantValue, StatLabel, StatValue, MutedText } from './Typography';
import {
  useFlexibleMacros,
  FlexibleMacroTarget,
  FlexibleMacroConsumed,
} from './useFlexibleMacros';

const RING_SIZE = 120;
const STROKE_W = 12;
const RADIUS = (RING_SIZE - STROKE_W) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const CENTER = RING_SIZE / 2;

interface MacroRowProps {
  label: string;
  current: number;
  displayMax: number;
  barPct: number;
  barClass: string;
  rightLabel: string;
  alertText?: string;
  alertClass?: string;
}

const MacroRow: React.FC<MacroRowProps> = ({
  label,
  barPct,
  barClass,
  rightLabel,
  alertText,
  alertClass = 'text-rose-400',
}) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex items-center justify-between">
      <EyebrowText>{label}</EyebrowText>
      <StatLabel>{rightLabel}</StatLabel>
    </div>
    <div className="h-2 rounded-full bg-zinc-800/50 overflow-hidden">
      <div
        className={`h-2 rounded-full transition-all duration-700 ease-out ${barClass}`}
        style={{ width: `${Math.min(barPct, 100)}%` }}
      />
    </div>
    {alertText && (
      <MutedText className={alertClass}>{alertText}</MutedText>
    )}
  </div>
);

interface MasterNutritionDashboardProps {
  target: FlexibleMacroTarget;
  consumed: FlexibleMacroConsumed;
  className?: string;
}

const MasterNutritionDashboard: React.FC<MasterNutritionDashboardProps> = ({
  target,
  consumed,
  className = '',
}) => {
  const {
    kcalRemaining,
    kcalProgress,
    isKcalOver,
    proteinProgress,
    dynamicCarbMax,
    isFatMinMet,
    isFatMinimumAtRisk,
    isCarbOverMax,
  } = useFlexibleMacros(target, consumed);

  // ── Ring stroke semantic color ───────────────────────────────────────────
  const ringStrokeClass = isKcalOver
    ? 'stroke-rose-500'
    : kcalProgress > 0.85
    ? 'stroke-amber-400'
    : 'stroke-emerald-400';

  const dashOffset = CIRCUMFERENCE * (1 - Math.min(kcalProgress, 1));

  // ── Carbs bar semantic color ─────────────────────────────────────────────
  const carbOverIdeal = consumed.carbs > target.carbIdeal;
  const carbBarClass = isCarbOverMax
    ? 'bg-rose-500'
    : carbOverIdeal
    ? 'bg-amber-400'
    : 'bg-emerald-400';

  const carbPct = target.carbMax > 0
    ? (consumed.carbs / target.carbMax) * 100
    : 0;

  const carbAlertText = isCarbOverMax
    ? 'Límite absoluto superado — bolsa compartida comprometida.'
    : carbOverIdeal
    ? `Excediendo ideal · límite dinámico: ${Math.round(dynamicCarbMax)}g`
    : undefined;

  const carbAlertClass = isCarbOverMax ? 'text-rose-400' : 'text-amber-400';

  // ── Fat bar semantic color ───────────────────────────────────────────────
  const fatOverIdeal = consumed.fat > target.fatIdeal;
  const fatBarClass = !isFatMinMet
    ? 'bg-rose-500'
    : fatOverIdeal
    ? 'bg-amber-400'
    : 'bg-emerald-400';

  const fatPct = target.fatMax > 0
    ? (consumed.fat / target.fatMax) * 100
    : 0;

  const fatAlertText = isFatMinimumAtRisk
    ? 'Mínimo vital inalcanzable con el presupuesto restante.'
    : !isFatMinMet
    ? `Por debajo del mínimo (${target.fatMin}g) · ajusta carbos.`
    : undefined;

  return (
    <SquishyCard
      padding="lg"
      className={['flex flex-col gap-8', className].filter(Boolean).join(' ')}
    >
      {/* ── Hero: Calorie ring ────────────────────────────────────────────── */}
      <div className="flex items-center gap-6">
        {/* SVG ring */}
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
            {/* Track */}
            <circle
              cx={CENTER} cy={CENTER} r={RADIUS}
              fill="none"
              strokeWidth={STROKE_W}
              className="stroke-zinc-800"
            />
            {/* Progress */}
            <circle
              cx={CENTER} cy={CENTER} r={RADIUS}
              fill="none"
              strokeWidth={STROKE_W}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              className={`${ringStrokeClass} transition-all duration-700 ease-out`}
            />
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
            <GiantValue className="!text-2xl !leading-none">
              {Math.round(kcalRemaining)}
            </GiantValue>
            <MutedText>kcal</MutedText>
          </div>
        </div>

        {/* Ring legend */}
        <div className="flex flex-col gap-1.5">
          <EyebrowText>CALORÍAS RESTANTES</EyebrowText>
          <StatValue>
            {Math.round(consumed.kcal)}{' '}
            <span className="text-zinc-500 font-normal">/ {target.kcal}</span>
          </StatValue>
          <MutedText>
            {Math.round(kcalProgress * 100)}% consumido
          </MutedText>
          {isKcalOver && (
            <MutedText className="text-rose-400">
              Presupuesto excedido
            </MutedText>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-zinc-800/50" />

      {/* ── Macro bars: P / C / F ────────────────────────────────────────── */}
      <div className="flex flex-col gap-5">
        {/* Proteína — innegociable */}
        <MacroRow
          label="PROTEÍNA"
          current={consumed.protein}
          displayMax={target.protein}
          barPct={proteinProgress * 100}
          barClass="bg-violet-500"
          rightLabel={`${Math.round(consumed.protein)}g / ${target.protein}g`}
        />

        {/* Carbohidratos — Bolsa Compartida */}
        <MacroRow
          label="CARBOHIDRATOS"
          current={consumed.carbs}
          displayMax={target.carbMax}
          barPct={carbPct}
          barClass={carbBarClass}
          rightLabel={`${Math.round(consumed.carbs)}g / ${target.carbMax}g`}
          alertText={carbAlertText}
          alertClass={carbAlertClass}
        />

        {/* Grasas — Bolsa Compartida */}
        <MacroRow
          label="GRASAS"
          current={consumed.fat}
          displayMax={target.fatMax}
          barPct={fatPct}
          barClass={fatBarClass}
          rightLabel={`${Math.round(consumed.fat)}g · mín. ${target.fatMin}g`}
          alertText={fatAlertText}
          alertClass="text-rose-400"
        />
      </div>
    </SquishyCard>
  );
};

export default MasterNutritionDashboard;
