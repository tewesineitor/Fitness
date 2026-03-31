import React from 'react';
import SquishyCard from './SquishyCard';
import {
  BodyText,
  CardTitle,
  EyebrowText,
  GiantValue,
  MonoValue,
  MutedText,
  StatLabel,
} from './Typography';
import {
  useFlexibleMacros,
  FlexibleMacroTarget,
  FlexibleMacroConsumed,
} from './useFlexibleMacros';

const RING_SIZE = 160;
const STROKE_W = 12;
const RADIUS = (RING_SIZE - STROKE_W) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const CENTER = RING_SIZE / 2;

interface NavButtonProps {
  direction: 'prev' | 'next';
  onClick?: () => void;
}

const NavButton: React.FC<NavButtonProps> = ({ direction, onClick }) => (
  <button
    onClick={onClick}
    aria-label={direction === 'prev' ? 'Día anterior' : 'Día siguiente'}
    className="h-14 w-14 rounded-full border border-zinc-700/50 bg-zinc-900/80 flex items-center justify-center flex-shrink-0 active:scale-90 transition-all duration-100 select-none"
  >
    <svg width="14" height="14" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      {direction === 'prev'
        ? <path d="M6.5 1.5 3 5l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        : <path d="M3.5 1.5 7 5l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      }
    </svg>
  </button>
);

interface BarRowProps {
  label: string;
  current: number;
  goalText: string;
  pct: number;
  fillClass: string;
  labelClass?: string;
  markerPct?: number;
  markerLabel?: string;
}

const BarRow: React.FC<BarRowProps> = ({
  label,
  current,
  goalText,
  pct,
  fillClass,
  labelClass = '',
  markerPct,
  markerLabel,
}) => (
  <div className="flex flex-col gap-3">
    <div className="flex items-end justify-between gap-4">
      <StatLabel className={labelClass}>{label}</StatLabel>
      <div className="flex items-baseline gap-1">
        <MonoValue className="text-zinc-100">{Math.round(current)}g</MonoValue>
        <MutedText>{goalText}</MutedText>
      </div>
    </div>

    <div className="relative h-7 overflow-visible">
      <div className="absolute inset-x-0 top-1/2 h-3 -translate-y-1/2 overflow-hidden rounded-full border border-white/5 bg-zinc-950">
        <div
          className={['h-full rounded-full transition-all duration-700 ease-out', fillClass].join(' ')}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>

      {markerPct !== undefined ? (
        <div
          className="absolute top-1/2 z-10 h-5 -translate-y-1/2"
          style={{ left: `${markerPct}%` }}
        >
          <div className="h-full w-px bg-white/40" />
          {markerLabel ? (
            <MutedText className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap">
              {markerLabel}
            </MutedText>
          ) : null}
        </div>
      ) : null}
    </div>
  </div>
);

const IconInfo: React.FC = () => (
  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <circle cx="6" cy="6" r="5.5" stroke="currentColor" strokeWidth="1.2" />
    <path d="M6 5.5v3M6 3.5h.01" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

interface MacroLimitCardProps {
  label: string;
  value: number;
  min: number;
  ideal: number;
  max: number;
  pillText: string;
  pillClass: string;
  cardClass?: string;
  labelColorClass?: string;
  valueColorClass?: string;
}

const MacroLimitCard: React.FC<MacroLimitCardProps> = ({
  label,
  value,
  min,
  ideal,
  max,
  pillText,
  pillClass,
  cardClass = '',
  labelColorClass = '',
  valueColorClass = '',
}) => (
  <SquishyCard
    interactive
    padding="sm"
    className={['flex h-full flex-col justify-center gap-5', cardClass].filter(Boolean).join(' ')}
  >
    <div className="text-center">
      <EyebrowText className={labelColorClass}>{label}</EyebrowText>
    </div>

    <div className="text-center">
      <div className="flex items-baseline justify-center gap-1">
        <GiantValue className={['!text-5xl !leading-none', valueColorClass].filter(Boolean).join(' ')}>
          {value}
        </GiantValue>
        <MutedText className={valueColorClass}>g</MutedText>
      </div>
    </div>

    <div className="grid grid-cols-3 gap-3 border-t border-white/5 pt-4">
      {[
        { label: 'MIN', value: `${min}g` },
        { label: 'IDEAL', value: `${ideal}g` },
        { label: 'MAX', value: `${max}g` },
      ].map((item) => (
        <div key={item.label} className="flex flex-col items-center gap-1 text-center">
          <StatLabel className="text-zinc-500">{item.label}</StatLabel>
          <MonoValue>{item.value}</MonoValue>
        </div>
      ))}
    </div>

    <div className={['rounded-lg px-3 py-2', pillClass].join(' ')}>
      <BodyText className="text-center text-current">{pillText}</BodyText>
    </div>
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
  target,
  consumed,
  date,
  onPrevDay,
  onNextDay,
  className = '',
}) => {
  const {
    kcalRemaining,
    kcalProgress,
    isKcalOver,
    proteinProgress,
    isFatMinMet,
    isFatMinimumAtRisk,
  } = useFlexibleMacros(target, consumed);

  const d = date ?? new Date();
  const isToday = !date;
  const dayLabel = isToday ? 'HOY' : d.toLocaleDateString('es-ES', { weekday: 'short' }).toUpperCase();
  const dateSubtitle = d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  const dateSubtitleCap = dateSubtitle.charAt(0).toUpperCase() + dateSubtitle.slice(1);

  const isAlert = !isFatMinMet || isFatMinimumAtRisk;

  const ringStrokeClass = isKcalOver
    ? 'stroke-rose-500'
    : isAlert || kcalProgress > 0.85
      ? 'stroke-amber-400'
      : 'stroke-emerald-400';
  const dashOffset = CIRCUMFERENCE * (1 - Math.min(kcalProgress, 1));

  const carbBarClass = isAlert
    ? 'bg-gradient-to-r from-amber-500 to-amber-300'
    : 'bg-gradient-to-r from-emerald-600 to-emerald-400';
  const fatBarClass = isAlert
    ? 'bg-gradient-to-r from-rose-600 to-rose-400'
    : 'bg-gradient-to-r from-emerald-600 to-emerald-400';
  const carbLabelClass = isAlert ? 'text-amber-400' : 'text-zinc-500';
  const fatLabelClass = isAlert ? 'text-rose-400' : 'text-zinc-500';

  const proteinPct = proteinProgress * 100;
  const carbPct = target.carbMax > 0 ? (consumed.carbs / target.carbMax) * 100 : 0;
  const fatPct = target.fatMax > 0 ? (consumed.fat / target.fatMax) * 100 : 0;
  const carbMarkerPct = target.carbMax > 0 ? (target.carbIdeal / target.carbMax) * 100 : 0;
  const fatMarkerPct = target.fatMax > 0 ? (target.fatMin / target.fatMax) * 100 : 0;

  const carbCardClass = isAlert ? '!bg-amber-400/10 !border-amber-400/30' : '!bg-zinc-900/50';
  const fatCardClass = isAlert
    ? '!bg-rose-500/10 !border-rose-500/30'
    : '!bg-zinc-900/50';
  const carbValueClass = isAlert ? '!text-amber-400' : '';
  const fatValueClass = isAlert ? '!text-rose-400' : '';

  const fatGap = Math.max(0, Math.round(target.fatMin - consumed.fat));
  const fatPillText = isFatMinMet
    ? 'Mínimo cubierto'
    : `Faltan ${fatGap}g para el mínimo vital`;
  const fatPillClass = isFatMinMet
    ? 'bg-emerald-400/20 text-emerald-400'
    : 'bg-rose-500/20 text-rose-400 animate-pulse';

  const carbPillText = consumed.carbs >= target.carbMax
    ? 'Límite máximo alcanzado'
    : consumed.carbs >= target.carbIdeal
      ? 'Ideal alcanzado'
      : `${Math.round(target.carbIdeal - consumed.carbs)}g para el ideal`;
  const carbPillClass = consumed.carbs >= target.carbMax
    ? 'bg-amber-400/20 text-amber-400'
    : consumed.carbs >= target.carbIdeal
      ? 'bg-emerald-400/20 text-emerald-400'
      : 'bg-zinc-800/60 text-zinc-400';

  return (
    <div className={['flex flex-col gap-4', className].filter(Boolean).join(' ')}>
      <section className="grid gap-6 lg:grid-cols-[minmax(15rem,0.9fr)_1px_minmax(0,1.7fr)] lg:items-center">
        <div className="flex items-center justify-center lg:justify-start">
          <div className="flex items-center gap-5">
            <NavButton direction="prev" onClick={onPrevDay} />
            <div className="flex min-w-40 flex-col items-center gap-1.5 text-center lg:items-start lg:text-left">
              <GiantValue className="!text-5xl !leading-none tabular-nums tracking-tight">
                {dayLabel}
              </GiantValue>
              <MutedText className="text-sm">{dateSubtitleCap}</MutedText>
            </div>
            <NavButton direction="next" onClick={onNextDay} />
          </div>
        </div>

        <div className="hidden self-stretch bg-white/5 lg:block lg:w-px" />

        <SquishyCard padding="lg" className="flex flex-col gap-8 sm:flex-row sm:items-center sm:gap-10">
          <div className="relative mx-auto h-40 w-40 flex-shrink-0 sm:mx-0">
            <svg
              width={RING_SIZE}
              height={RING_SIZE}
              viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
              className="-rotate-90"
              aria-hidden="true"
            >
              <circle
                cx={CENTER}
                cy={CENTER}
                r={RADIUS}
                fill="none"
                strokeWidth={STROKE_W}
                className="stroke-zinc-800"
              />
              <circle
                cx={CENTER}
                cy={CENTER}
                r={RADIUS}
                fill="none"
                strokeWidth={STROKE_W}
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={dashOffset}
                className={[ringStrokeClass, 'transition-all duration-700 ease-out'].join(' ')}
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-center">
              <GiantValue className="!text-5xl !leading-none tabular-nums tracking-tight">
                {Math.round(kcalRemaining)}
              </GiantValue>
              <EyebrowText className={isKcalOver ? '!text-rose-500' : isAlert || kcalProgress > 0.85 ? '!text-amber-400' : ''}>
                {isKcalOver ? 'Excedido' : 'kcal rest.'}
              </EyebrowText>
              <MutedText>/ {target.kcal}</MutedText>
            </div>
          </div>

          <div className="flex-1 space-y-7">
            <BarRow
              label="PROTEÍNA"
              current={consumed.protein}
              goalText={`/ ${target.protein}g`}
              pct={proteinPct}
              fillClass="bg-gradient-to-r from-violet-600 to-violet-400"
              labelClass="text-violet-500"
            />
            <BarRow
              label="CARBOS"
              current={consumed.carbs}
              goalText={`/ ${target.carbIdeal}g ideal`}
              pct={carbPct}
              fillClass={carbBarClass}
              labelClass={carbLabelClass}
              markerPct={carbMarkerPct}
              markerLabel={`${target.carbIdeal}g`}
            />
            <BarRow
              label="GRASAS"
              current={consumed.fat}
              goalText={`/ ${target.fatIdeal}g ideal`}
              pct={fatPct}
              fillClass={fatBarClass}
              labelClass={fatLabelClass}
              markerPct={fatMarkerPct}
              markerLabel={`${target.fatMin}g`}
            />
          </div>
        </SquishyCard>
      </section>

      <SquishyCard padding="md">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="flex-shrink-0 text-emerald-400">
              <IconInfo />
            </span>
            <CardTitle>Bolsa Compartida C+G</CardTitle>
          </div>

          <BodyText className="max-w-2xl">
            Cubre tus mínimos vitales primero. El resto compártelo según tu energía.
          </BodyText>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <MacroLimitCard
              label="CARBOS"
              value={Math.round(consumed.carbs)}
              min={target.carbMin}
              ideal={target.carbIdeal}
              max={target.carbMax}
              pillText={carbPillText}
              pillClass={carbPillClass}
              cardClass={carbCardClass}
              labelColorClass={carbLabelClass}
              valueColorClass={carbValueClass}
            />
            <MacroLimitCard
              label="GRASAS"
              value={Math.round(consumed.fat)}
              min={target.fatMin}
              ideal={target.fatIdeal}
              max={target.fatMax}
              pillText={fatPillText}
              pillClass={fatPillClass}
              cardClass={fatCardClass}
              labelColorClass={fatLabelClass}
              valueColorClass={fatValueClass}
            />
          </div>
        </div>
      </SquishyCard>
    </div>
  );
};

export default MasterNutritionDashboard;
