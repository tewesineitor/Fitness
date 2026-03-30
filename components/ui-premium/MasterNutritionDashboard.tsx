import React from 'react';
import SquishyCard from './SquishyCard';
import { EyebrowText, GiantValue, MonoValue, StatLabel, StatValue, MutedText } from './Typography';
import {
  useFlexibleMacros,
  FlexibleMacroTarget,
  FlexibleMacroConsumed,
} from './useFlexibleMacros';

const RING_SIZE = 160;
const STROKE_W = 14;
const RADIUS = (RING_SIZE - STROKE_W) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const CENTER = RING_SIZE / 2;

// ── MarkerRow ────────────────────────────────────────────────────────────────
interface MarkerRowProps {
  minVal: number;
  idealVal: number;
  maxVal: number;
}

const MarkerRow: React.FC<MarkerRowProps> = ({ minVal, idealVal, maxVal }) => {
  const markers = [
    { label: 'MIN',   pct: (minVal   / maxVal) * 100, colorClass: 'text-zinc-500' },
    { label: 'IDEAL', pct: (idealVal / maxVal) * 100, colorClass: 'text-zinc-400' },
    { label: 'MAX',   pct: 100,                        colorClass: 'text-zinc-500' },
  ] as const;

  return (
    <div className="relative h-7 select-none" aria-hidden="true">
      {markers.map(({ label, pct, colorClass }) => (
        <div
          key={label}
          className={`absolute flex flex-col items-center gap-px bottom-0 -translate-x-1/2 ${colorClass}`}
          style={{ left: `${pct}%` }}
        >
          <EyebrowText className={`!text-[8px] !leading-none ${colorClass}`}>{label}</EyebrowText>
          <span className="text-[6px] leading-none">&#9660;</span>
        </div>
      ))}
    </div>
  );
};

// ── FlexibleMacroRow ─────────────────────────────────────────────────────────
interface FlexibleMacroRowProps {
  name: string;
  current: number;
  absoluteMax: number;
  minVal: number;
  idealVal: number;
  dynamicMax: number;
  barPct: number;
  barClass: string;
  eyebrowColorClass?: string;
  glow?: boolean;
  alertText?: string;
  alertClass?: string;
}

const FlexibleMacroRow: React.FC<FlexibleMacroRowProps> = ({
  name, current, absoluteMax, minVal, idealVal, dynamicMax,
  barPct, barClass, eyebrowColorClass = '', glow = false,
  alertText, alertClass = 'text-rose-400',
}) => (
  <div className="flex flex-col gap-0.5">
    <div className="flex items-baseline gap-1.5 flex-wrap">
      <EyebrowText className={eyebrowColorClass}>{name}</EyebrowText>
      <span className="text-zinc-600 font-black text-[10px]">–</span>
      <StatValue className="!text-base !leading-none">{Math.round(current)}g</StatValue>
      <MutedText>(Rango: {minVal}–{Math.round(dynamicMax)}g)</MutedText>
    </div>
    <MarkerRow minVal={minVal} idealVal={idealVal} maxVal={absoluteMax} />
    <div className={`rounded-full ${glow ? 'shadow-lg shadow-rose-500/60' : ''}`}>
      <div className="h-2 rounded-full bg-zinc-800/50 overflow-hidden">
        <div
          className={`h-2 rounded-full transition-all duration-700 ease-out ${barClass}`}
          style={{ width: `${Math.min(barPct, 100)}%` }}
        />
      </div>
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
    dynamicFatMax,
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
  const carbEyebrowClass = isCarbOverMax
    ? 'text-rose-400'
    : carbOverIdeal
    ? 'text-amber-400'
    : 'text-emerald-400';

  const carbPct = target.carbMax > 0
    ? (consumed.carbs / target.carbMax) * 100
    : 0;

  const carbAlertText = isCarbOverMax
    ? 'Límite absoluto superado — bolsa compartida comprometida.'
    : carbOverIdeal
    ? 'Excediendo ideal · comprime la bolsa de grasas.'
    : undefined;

  // ── Fat bar semantic color ───────────────────────────────────────────────
  const fatOverIdeal = consumed.fat > target.fatIdeal;
  const fatBarClass = !isFatMinMet
    ? 'bg-rose-500'
    : fatOverIdeal
    ? 'bg-amber-400'
    : 'bg-emerald-400';
  const fatEyebrowClass = !isFatMinMet
    ? 'text-rose-400'
    : fatOverIdeal
    ? 'text-amber-400'
    : 'text-emerald-400';

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
      {/* ── Hero: Anillo Maestro ─────────────────────────────────────────── */}
      <div className="grid grid-cols-[1fr,2fr] items-center gap-12">
        {/* Left: Ring SVG */}
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
              fill="none" strokeWidth={STROKE_W}
              className="stroke-zinc-800"
            />
            <circle
              cx={CENTER} cy={CENTER} r={RADIUS}
              fill="none" strokeWidth={STROKE_W}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              className={`${ringStrokeClass} transition-all duration-700 ease-out`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
            <GiantValue className="!text-4xl !leading-none">
              {Math.round(kcalRemaining)}
            </GiantValue>
            <MutedText>kcal rest.</MutedText>
          </div>
        </div>

        {/* Right: Leyenda calórica */}
        <div className="flex flex-col gap-2">
          <EyebrowText>CALORÍAS RESTANTES</EyebrowText>
          <MonoValue className="!text-2xl !leading-none">
            {Math.round(consumed.kcal)}
            <span className="text-zinc-500 font-normal text-sm"> / {target.kcal}</span>
          </MonoValue>
          <MutedText>{Math.round(kcalProgress * 100)}% consumido</MutedText>
          {isKcalOver && (
            <MutedText className="text-rose-400">Presupuesto excedido</MutedText>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-zinc-800/50" />

      {/* ── Macro bars: P / C / F ────────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        {/* Proteína — innegociable, sin marcadores de rango */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <EyebrowText>PROTEÍNA</EyebrowText>
            <StatLabel>{Math.round(consumed.protein)}g / {target.protein}g</StatLabel>
          </div>
          <div className="h-2 rounded-full bg-zinc-800/50 overflow-hidden">
            <div
              className="h-2 rounded-full bg-violet-500 transition-all duration-700 ease-out"
              style={{ width: `${Math.min(proteinProgress * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Carbohidratos — Bolsa Compartida con marcadores */}
        <FlexibleMacroRow
          name="CARBOHIDRATOS"
          current={consumed.carbs}
          absoluteMax={target.carbMax}
          minVal={target.carbMin}
          idealVal={target.carbIdeal}
          dynamicMax={dynamicCarbMax}
          barPct={carbPct}
          barClass={carbBarClass}
          eyebrowColorClass={carbEyebrowClass}
          alertText={carbAlertText}
          alertClass={isCarbOverMax ? 'text-rose-400' : 'text-amber-400'}
        />

        {/* Grasas — Bolsa Compartida con marcadores + glow de peligro */}
        <FlexibleMacroRow
          name="GRASAS"
          current={consumed.fat}
          absoluteMax={target.fatMax}
          minVal={target.fatMin}
          idealVal={target.fatIdeal}
          dynamicMax={dynamicFatMax}
          barPct={fatPct}
          barClass={fatBarClass}
          eyebrowColorClass={fatEyebrowClass}
          glow={!isFatMinMet}
          alertText={fatAlertText}
          alertClass="text-rose-400"
        />
      </div>
    </SquishyCard>
  );
};

export default MasterNutritionDashboard;
