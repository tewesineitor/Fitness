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

const RING_SIZE = 240;
const STROKE_W = 24;
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
    className="h-14 w-14 rounded-full border border-surface-border bg-surface-bg/80 hover:border-text-secondary hover:bg-surface-raised/90 flex items-center justify-center flex-shrink-0 active:scale-90 transition-all duration-150 select-none text-text-muted hover:text-text-primary"
  >
    <svg width="14" height="14" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      {direction === 'prev'
        ? <path d="M6.5 1.5 3 5l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        : <path d="M3.5 1.5 7 5l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      }
    </svg>
  </button>
);

interface BarMarker {
  pct: number;
  label?: string;
}

interface BarRowProps {
  label: string;
  current: string | number;
  goalText: string;
  pct: number;
  fillClass: string;
  labelClass?: string;
  markers?: BarMarker[];
}

const BarRow: React.FC<BarRowProps> = ({
  label,
  current,
  goalText,
  pct,
  fillClass,
  labelClass = '',
  markers,
}) => (
  <div className="flex flex-col gap-2">
    <div className="flex items-end justify-between">
      <EyebrowText className={labelClass}>{label}</EyebrowText>
      <div className="flex items-baseline gap-1.5">
        <MonoValue className="!text-[14px] sm:!text-[15px] !text-text-primary !font-bold leading-none tracking-tight">{current}</MonoValue>
        <MutedText className="!text-[10px] sm:!text-[11px] font-bold tracking-tight text-text-muted opacity-80">{goalText}</MutedText>
      </div>
    </div>

    <div className="relative h-4">
      <div className="absolute inset-0 overflow-hidden rounded-full border border-white/5 bg-surface-raised">
        <div
          className={['h-full rounded-full transition-all duration-700 ease-out', fillClass].join(' ')}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>

      {markers?.map((marker, idx) => marker.pct > 0 ? (
        <div
          key={idx}
          className="absolute top-0 bottom-0 w-[2px] bg-white/60 z-10"
          style={{ left: `${marker.pct}%` }}
        >
          {marker.label ? (
            <MutedText className="absolute left-1/2 top-[120%] -translate-x-1/2 whitespace-nowrap !text-[9px] font-semibold tracking-wider text-text-muted">
              {marker.label}
            </MutedText>
          ) : null}
        </div>
      ) : null)}
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

    <div className="grid grid-cols-3 gap-3 border-t border-surface-border/50 pt-4">
      {[
        { label: 'MIN', value: `${min}g` },
        { label: 'IDEAL', value: `${ideal}g` },
        { label: 'MAX', value: `${max}g` },
      ].map((item) => (
        <div key={item.label} className="flex flex-col items-center gap-1 text-center">
          <StatLabel className="text-text-muted">{item.label}</StatLabel>
          <MonoValue>{item.value}</MonoValue>
        </div>
      ))}
    </div>

    <div className={['rounded-2xl px-4 py-2.5 text-center text-[11px] font-bold tracking-wide', pillClass].join(' ')}>
      {pillText}
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
    ? 'stroke-danger'
    : isAlert || kcalProgress > 0.85
      ? 'stroke-warning'
      : 'stroke-brand-accent';
  const dashOffset = CIRCUMFERENCE * (1 - Math.min(kcalProgress, 1));

  const carbBarClass = isAlert
    ? 'bg-warning'
    : 'bg-brand-carbs';
  const fatBarClass = isAlert
    ? 'bg-danger'
    : 'bg-brand-fat';
  const carbLabelClass = isAlert ? '!text-warning' : '!text-brand-carbs';
  const fatLabelClass = isAlert ? '!text-danger' : '!text-brand-fat';

  const proteinPct = proteinProgress * 100;
  const carbPct = target.carbMax > 0 ? (consumed.carbs / target.carbMax) * 100 : 0;
  const fatPct = target.fatMax > 0 ? (consumed.fat / target.fatMax) * 100 : 0;

  const carbMarkers = target.carbMax > 0 ? [
    { pct: (target.carbMin / target.carbMax) * 100, label: 'MÍN' },
    { pct: (target.carbIdeal / target.carbMax) * 100, label: 'IDEAL' }
  ] : [];

  const fatMarkers = target.fatMax > 0 ? [
    { pct: (target.fatMin / target.fatMax) * 100, label: 'MÍN' },
    { pct: (target.fatIdeal / target.fatMax) * 100, label: 'IDEAL' }
  ] : [];

  const kcalStr = Math.round(kcalRemaining).toString();
  const isLargeKcal = kcalStr.length >= 4;
  const kcalFontSizeClass = isLargeKcal ? 'text-[length:var(--font-size-kcal-ring-tight)]' : 'text-[length:var(--font-size-kcal-ring)]';

  const carbCardClass = isAlert ? '!bg-surface-raised/60 !border-warning/30' : '!bg-surface-bg/60 !border-surface-border/50';
  const fatCardClass = isAlert
    ? '!bg-surface-raised/60 !border-danger/30'
    : '!bg-surface-bg/60 !border-surface-border/50';
  const carbValueClass = isAlert ? '!text-warning' : '';
  const fatValueClass = isAlert ? '!text-danger' : '';

  const fatGap = Math.max(0, Math.round(target.fatMin - consumed.fat));
  const fatPillText = isFatMinMet
    ? 'Mínimo cubierto'
    : `Faltan ${fatGap}g para el mínimo vital`;
  const fatPillClass = isFatMinMet
    ? 'bg-brand-accent/20 text-brand-accent'
    : 'bg-danger/20 text-danger animate-pulse';

  const carbPillText = consumed.carbs >= target.carbMax
    ? 'Límite máximo alcanzado'
    : consumed.carbs >= target.carbIdeal
      ? 'Ideal alcanzado'
      : `${Math.round(target.carbIdeal - consumed.carbs)}g para el ideal`;
  const carbPillClass = consumed.carbs >= target.carbMax
    ? 'bg-warning/20 text-warning'
    : consumed.carbs >= target.carbIdeal
      ? 'bg-brand-accent/20 text-brand-accent'
      : 'bg-surface-raised/60 text-text-muted';

  return (
    <div className={['flex flex-col gap-4', className].filter(Boolean).join(' ')}>
      <section className="grid gap-10 lg:grid-cols-[minmax(15rem,0.7fr)_minmax(0,1.7fr)] lg:items-center">
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-8">
            <NavButton direction="prev" onClick={onPrevDay} />
            <div className="flex min-w-[8rem] flex-col items-center gap-2 text-center">
              <GiantValue className="!leading-none tabular-nums tracking-tight text-text-primary">
                {dayLabel}
              </GiantValue>
              <MutedText className="text-sm sm:text-base tracking-wide">{dateSubtitleCap}</MutedText>
            </div>
            <NavButton direction="next" onClick={onNextDay} />
          </div>
        </div>

        <SquishyCard padding="lg" className="flex flex-col gap-8 sm:flex-row sm:items-center sm:gap-14 lg:p-12">
          <div className="relative w-full max-w-[240px] aspect-square flex-shrink-0 mx-auto sm:mx-0">
            <svg
              viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
              className="w-full h-full -rotate-90"
              aria-hidden="true"
            >
              <circle
                cx={CENTER}
                cy={CENTER}
                r={RADIUS}
                fill="none"
                strokeWidth={STROKE_W}
                className="stroke-surface-raised"
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

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pt-1">
              <GiantValue className={[kcalFontSizeClass, '!leading-none tabular-nums tracking-tight text-text-primary mb-0.5'].join(' ')}>
                {kcalStr}
              </GiantValue>
              <EyebrowText className={isKcalOver ? '!text-danger' : isAlert || kcalProgress > 0.85 ? '!text-warning' : '!text-brand-accent'}>
                KCAL REST.
              </EyebrowText>
              <MutedText className="!text-[10px] mt-0.5">/ {target.kcal}</MutedText>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-6 pt-2 pb-4">
            <BarRow
              label="PROTEÍNA"
              current={`${Math.round(consumed.protein)}G`}
              goalText={`/ ${target.protein}G`}
              pct={proteinPct}
              fillClass="bg-brand-accent"
              labelClass="!text-brand-accent"
            />
            <BarRow
              label="CARBOS"
              current={`${Math.round(consumed.carbs)}G`}
              goalText={target.carbMax > 0 ? `/ ${target.carbMax}G` : ''}
              pct={carbPct}
              fillClass={carbBarClass}
              labelClass={carbLabelClass}
              markers={carbMarkers}
            />
            <BarRow
              label="GRASAS"
              current={`${Math.round(consumed.fat)}G`}
              goalText={target.fatMax > 0 ? `/ ${target.fatMax}G` : ''}
              pct={fatPct}
              fillClass={fatBarClass}
              labelClass={fatLabelClass}
              markers={fatMarkers}
            />
          </div>
        </SquishyCard>
      </section>

      <SquishyCard padding="md">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="flex-shrink-0 text-brand-accent">
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
