import React from 'react';
import SquishyCard from './SquishyCard';
import { EyebrowText, GiantValue, StatLabel, MutedText } from './Typography';
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

// ── NavButton (ghost circle arrow) ────────────────────────────────────────────
interface NavButtonProps {
  direction: 'prev' | 'next';
  onClick?: () => void;
}

const NavButton: React.FC<NavButtonProps> = ({ direction, onClick }) => (
  <button
    onClick={onClick}
    aria-label={direction === 'prev' ? 'Día anterior' : 'Día siguiente'}
    className="w-8 h-8 rounded-full bg-zinc-800/60 border border-zinc-700/50 flex items-center justify-center flex-shrink-0 active:scale-90 transition-all duration-100 select-none"
  >
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      {direction === 'prev'
        ? <path d="M6.5 1.5 3 5l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        : <path d="M3.5 1.5 7 5l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      }
    </svg>
  </button>
);

// ── BarRow ───────────────────────────────────────────────────────────────
interface BarRowProps {
  label: string;
  rightLabel: string;
  pct: number;
  colorClass: string;
  labelColorClass?: string;
  markerPct?: number;
}

const BarRow: React.FC<BarRowProps> = ({
  label, rightLabel, pct, colorClass, labelColorClass = '', markerPct,
}) => (
  <div className="flex flex-col gap-1">
    <div className="flex items-center justify-between">
      <EyebrowText className={labelColorClass}>{label}</EyebrowText>
      <StatLabel>{rightLabel}</StatLabel>
    </div>
    <div className="relative h-2 rounded-full bg-zinc-800/50 overflow-hidden">
      {markerPct !== undefined && (
        <div
          className="absolute w-[2px] h-full bg-white/40 z-10"
          style={{ left: `${markerPct}%` }}
        />
      )}
      <div
        className={`h-2 rounded-full transition-all duration-700 ease-out ${colorClass}`}
        style={{ width: `${Math.min(pct, 100)}%` }}
      />
    </div>
  </div>
);

// ── IconInfo (inline SVG) ─────────────────────────────────────────────────
const IconInfo: React.FC = () => (
  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <circle cx="6" cy="6" r="5.5" stroke="currentColor" strokeWidth="1.2" />
    <path d="M6 5.5v3M6 3.5h.01" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

// ── BentoMacroCard (SquishyCard-based) ─────────────────────────────────────
interface BentoMacroCardProps {
  label: string;
  value: number;
  unit: string;
  subtitle: string;
  labelColorClass?: string;
  valueColorClass?: string;
  cardClass?: string;
}

const BentoMacroCard: React.FC<BentoMacroCardProps> = ({
  label, value, unit, subtitle,
  labelColorClass = '', valueColorClass = '', cardClass = '',
}) => (
  <SquishyCard
    interactive
    padding="sm"
    className={['flex flex-col gap-2', cardClass].filter(Boolean).join(' ')}
  >
    <EyebrowText className={labelColorClass}>{label}</EyebrowText>
    <div className="flex items-baseline gap-0.5">
      <GiantValue className={`!text-3xl !leading-none ${valueColorClass}`}>{value}</GiantValue>
      <MutedText className={valueColorClass}>{unit}</MutedText>
    </div>
    <MutedText>{subtitle}</MutedText>
  </SquishyCard>
);

interface MasterNutritionDashboardProps {
  target: FlexibleMacroTarget;
  consumed: FlexibleMacroConsumed;
  date?: Date;
  onPrevDay?: () => void;
  onNextDay?: () => void;
  className?: string;
}

const MasterNutritionDashboard: React.FC<MasterNutritionDashboardProps> = ({
  target, consumed, date, onPrevDay, onNextDay, className = '',
}) => {
  const {
    kcalRemaining,
    kcalProgress,
    isKcalOver,
    proteinProgress,
    isFatMinMet,
    isFatMinimumAtRisk,
  } = useFlexibleMacros(target, consumed);

  // ── Date label ───────────────────────────────────────────────────────────
  const d = date ?? new Date();
  const isToday = !date;
  const dayLabel = isToday ? 'HOY' : d.toLocaleDateString('es-ES', { weekday: 'short' }).toUpperCase();
  const dateSubtitle = d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  const dateSubtitleCap = dateSubtitle.charAt(0).toUpperCase() + dateSubtitle.slice(1);

  // ── Ring color ────────────────────────────────────────────────────────────
  const ringStrokeClass = isKcalOver
    ? 'stroke-rose-500'
    : kcalProgress > 0.85
    ? 'stroke-amber-400'
    : 'stroke-emerald-400';
  const dashOffset = CIRCUMFERENCE * (1 - Math.min(kcalProgress, 1));

  // ── Alert condition ──────────────────────────────────────────────────────────
  const isAlert = !isFatMinMet || isFatMinimumAtRisk;

  // ── Bar colors ────────────────────────────────────────────────────────────
  const carbBarClass   = isAlert ? 'bg-amber-400'  : 'bg-emerald-400';
  const fatBarClass    = isAlert ? 'bg-rose-500'   : 'bg-emerald-400';
  const carbLabelClass = isAlert ? '!text-amber-400' : '';
  const fatLabelClass  = isAlert ? '!text-rose-400'  : '';

  // ── Bar percentages & markers ──────────────────────────────────────────────
  const proteinPct    = proteinProgress * 100;
  const carbPct       = target.carbMax > 0 ? (consumed.carbs / target.carbMax) * 100 : 0;
  const fatPct        = target.fatMax  > 0 ? (consumed.fat   / target.fatMax)  * 100 : 0;
  const carbMarkerPct = target.carbMax > 0 ? (target.carbIdeal / target.carbMax) * 100 : 0;
  const fatMarkerPct  = target.fatMax  > 0 ? (target.fatMin   / target.fatMax)  * 100 : 0;

  // ── Bolsa Compartida kcal disponibles ───────────────────────────────────────
  const sharedBudgetKcal = target.carbIdeal * 4 + target.fatIdeal * 9;
  const kcalDisponibles  = Math.max(0, sharedBudgetKcal - consumed.carbs * 4 - consumed.fat * 9);

  // ── Bento card alert classes ────────────────────────────────────────────────
  const carbCardClass  = isAlert ? '!bg-amber-400/10 !border-amber-400/30' : '!bg-zinc-900/50';
  const fatCardClass   = isAlert
    ? '!bg-rose-500/10 !border-rose-500/30 shadow-[inset_0_0_20px_rgba(244,63,94,0.08)]'
    : '!bg-zinc-900/50';
  const kcalCardClass  = '!bg-zinc-900/50';
  const carbValueClass = isAlert ? '!text-amber-400' : '';
  const fatValueClass  = isAlert ? '!text-rose-400'  : '';

  // ── Dynamic subtitles ─────────────────────────────────────────────────────
  const fatGap      = Math.max(0, Math.round(target.fatMin - consumed.fat));
  const fatSubtitle = isFatMinMet
    ? 'Mínimo cubierto'
    : `Faltan ${fatGap}g para el mín`;
  const carbGap      = Math.max(0, Math.round(target.carbIdeal - consumed.carbs));
  const carbSubtitle = consumed.carbs > target.carbMax
    ? 'Límite excedido'
    : consumed.carbs >= target.carbIdeal
    ? 'Ideal alcanzado'
    : `${carbGap}g para el ideal`;

  return (
    <div className={['flex flex-col gap-4', className].filter(Boolean).join(' ')}>

      {/* ── Header Nutricional: Fecha + Ring + Barras ────────────────────── */}
      <div className="flex flex-row gap-4 items-stretch">

        {/* Columna Izquierda: Selector de Fecha */}
        <div className="w-1/3 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <NavButton direction="prev" onClick={onPrevDay} />
            <div className="flex flex-col items-center gap-0.5">
              <GiantValue className="!text-3xl !leading-none">{dayLabel}</GiantValue>
              <MutedText className="text-center">{dateSubtitleCap}</MutedText>
            </div>
            <NavButton direction="next" onClick={onNextDay} />
          </div>
        </div>

        {/* Columna Derecha: Anillo + Barras */}
        <SquishyCard padding="md" className="flex-1 flex flex-row items-center gap-6">

          {/* Anillo de Calorías */}
          <div
            className="relative flex-shrink-0"
            style={{ width: RING_SIZE, height: RING_SIZE }}
          >
            <svg
              width={RING_SIZE} height={RING_SIZE}
              viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
              className="-rotate-90" aria-hidden="true"
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
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
              <GiantValue className="!text-2xl !leading-none">
                {Math.round(kcalRemaining)}
              </GiantValue>
              <MutedText>kcal</MutedText>
            </div>
          </div>

          {/* Barras: Prot / Carbos / Grasas */}
          <div className="flex-1 flex flex-col gap-3">
            <BarRow
              label="PROTEÍNA"
              rightLabel={`${Math.round(consumed.protein)}g / ${target.protein}g`}
              pct={proteinPct}
              colorClass="bg-violet-500"
            />
            <BarRow
              label="CARBOS"
              rightLabel={`${Math.round(consumed.carbs)}g / ${target.carbMax}g`}
              pct={carbPct}
              colorClass={carbBarClass}
              labelColorClass={carbLabelClass}
              markerPct={carbMarkerPct}
            />
            <BarRow
              label="GRASAS"
              rightLabel={`${Math.round(consumed.fat)}g / ${target.fatMax}g`}
              pct={fatPct}
              colorClass={fatBarClass}
              labelColorClass={fatLabelClass}
              markerPct={fatMarkerPct}
            />
          </div>
        </SquishyCard>
      </div>

      {/* ── Bolsa Compartida C+G ─────────────────────────────────────────────── */}
      <SquishyCard padding="md">
        <div className="mb-4">
          <EyebrowText className="!text-zinc-100 flex items-center gap-2">
            <span className="text-emerald-400 flex-shrink-0">
              <IconInfo />
            </span>
            BOLSA COMPARTIDA C+G
          </EyebrowText>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <BentoMacroCard
            label="CARBOS"
            value={Math.round(consumed.carbs)}
            unit="g"
            subtitle={carbSubtitle}
            cardClass={carbCardClass}
            labelColorClass={carbLabelClass}
            valueColorClass={carbValueClass}
          />
          <BentoMacroCard
            label="GRASAS"
            value={Math.round(consumed.fat)}
            unit="g"
            subtitle={fatSubtitle}
            cardClass={fatCardClass}
            labelColorClass={fatLabelClass}
            valueColorClass={fatValueClass}
          />
          <BentoMacroCard
            label="KCAL C+G"
            value={Math.round(kcalDisponibles)}
            unit="kcal"
            subtitle="Presupuesto"
            cardClass={kcalCardClass}
          />
        </div>
      </SquishyCard>
    </div>
  );
};

export default MasterNutritionDashboard;
