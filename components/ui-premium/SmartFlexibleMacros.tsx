import React from 'react';
import SquishyCard from './SquishyCard';
import {
  EyebrowText,
  StatLabel,
  StatValue,
  MutedText,
  BodyText,
} from './Typography';
import {
  useFlexibleMacros,
  FlexibleMacroTarget,
  FlexibleMacroConsumed,
} from './useFlexibleMacros';

interface RulerGaugeProps {
  current: number;
  min: number;
  ideal: number;
  absoluteMax: number;
  dynamicMax: number;
  isAlert: boolean;
  fillColor: string;
  alertColor: string;
}

const RulerGauge: React.FC<RulerGaugeProps> = ({
  current,
  min,
  ideal,
  absoluteMax,
  dynamicMax,
  isAlert,
  fillColor,
  alertColor,
}) => {
  const clampedCurrent = Math.min(current, absoluteMax);
  const fillPct = absoluteMax > 0 ? (clampedCurrent / absoluteMax) * 100 : 0;
  const minPct = absoluteMax > 0 ? (min / absoluteMax) * 100 : 0;
  const idealPct = absoluteMax > 0 ? (ideal / absoluteMax) * 100 : 0;
  const dynPct = absoluteMax > 0 ? Math.min((dynamicMax / absoluteMax) * 100, 100) : 0;

  const activeFill = isAlert ? alertColor : fillColor;

  return (
    <div className="flex flex-col gap-1.5">
      {/* Track */}
      <div className="relative h-3 rounded-full bg-zinc-800/50 overflow-visible">
        {/* Fill */}
        <div
          className={`absolute left-0 top-0 h-3 rounded-full transition-all duration-700 ease-out ${activeFill}`}
          style={{ width: `${fillPct}%` }}
        />

        {/* Dynamic max indicator — dashed vertical line */}
        {dynPct < 100 && (
          <div
            className="absolute top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-amber-400/60"
            style={{ left: `${dynPct}%` }}
            title={`Límite dinámico: ${Math.round(dynamicMax)}g`}
          />
        )}

        {/* MIN tick */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-zinc-500"
          style={{ left: `${minPct}%` }}
        />

        {/* IDEAL tick */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-zinc-400"
          style={{ left: `${idealPct}%` }}
        />
      </div>

      {/* Tick labels */}
      <div className="relative h-4">
        <span
          className="absolute -translate-x-1/2"
          style={{ left: `${minPct}%` }}
        >
          <StatLabel className="text-zinc-500">MIN</StatLabel>
        </span>
        <span
          className="absolute -translate-x-1/2"
          style={{ left: `${idealPct}%` }}
        >
          <StatLabel className="text-zinc-400">IDEAL</StatLabel>
        </span>
        <span className="absolute right-0">
          <StatLabel className="text-zinc-500">MAX</StatLabel>
        </span>
      </div>
    </div>
  );
};

interface SmartFlexibleMacrosProps {
  target: FlexibleMacroTarget;
  consumed: FlexibleMacroConsumed;
  className?: string;
}

const SmartFlexibleMacros: React.FC<SmartFlexibleMacrosProps> = ({
  target,
  consumed,
  className = '',
}) => {
  const {
    proteinProgress,
    dynamicCarbMax,
    dynamicFatMax,
    isFatMinimumAtRisk,
    isFatMinMet,
  } = useFlexibleMacros(target, consumed);

  const proteinPct = proteinProgress * 100;

  return (
    <SquishyCard
      padding="lg"
      className={['flex flex-col gap-6', className].filter(Boolean).join(' ')}
    >
      {/* ── Proteína hero ───────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <EyebrowText className="text-violet-500">PROTEÍNA — INNEGOCIABLE</EyebrowText>
          <StatLabel>{Math.round(consumed.protein)} / {target.protein}g</StatLabel>
        </div>
        <div className="h-3 rounded-full bg-zinc-800/50 overflow-hidden">
          <div
            className="h-3 rounded-full bg-violet-500 transition-all duration-700 ease-out"
            style={{ width: `${proteinPct}%` }}
          />
        </div>
        <div className="flex items-center justify-between">
          <MutedText>Meta fija · no comparte presupuesto</MutedText>
          <StatValue className="text-violet-500">{Math.round(proteinPct)}%</StatValue>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-zinc-800/50" />

      {/* ── Carbohidratos ruler ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <EyebrowText className={isFatMinimumAtRisk ? 'text-amber-400' : 'text-cyan-400'}>
            CARBOHIDRATOS
          </EyebrowText>
          <div className="flex items-center gap-2">
            <StatLabel>{Math.round(consumed.carbs)}g</StatLabel>
            <MutedText>/ dyn. {Math.round(dynamicCarbMax)}g</MutedText>
          </div>
        </div>

        <RulerGauge
          current={consumed.carbs}
          min={target.carbMin}
          ideal={target.carbIdeal}
          absoluteMax={target.carbMax}
          dynamicMax={dynamicCarbMax}
          isAlert={isFatMinimumAtRisk}
          fillColor="bg-cyan-400"
          alertColor="bg-amber-400"
        />

        {isFatMinimumAtRisk && (
          <BodyText>
            <span className="text-amber-400">⚠ </span>
            <MutedText className="text-amber-400">
              Los carbos consumidos comprimen el margen de grasas disponible.
            </MutedText>
          </BodyText>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-zinc-800/50" />

      {/* ── Grasas ruler ────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <EyebrowText className={isFatMinimumAtRisk ? 'text-rose-400' : 'text-orange-500'}>
            GRASAS
          </EyebrowText>
          <div className="flex items-center gap-2">
            <StatLabel>{Math.round(consumed.fat)}g</StatLabel>
            <MutedText>/ dyn. {Math.round(dynamicFatMax)}g</MutedText>
          </div>
        </div>

        <RulerGauge
          current={consumed.fat}
          min={target.fatMin}
          ideal={target.fatIdeal}
          absoluteMax={target.fatMax}
          dynamicMax={dynamicFatMax}
          isAlert={isFatMinimumAtRisk}
          fillColor="bg-orange-500"
          alertColor="bg-rose-500"
        />

        {isFatMinimumAtRisk && (
          <MutedText className="text-rose-400">
            ⚠ Límite dinámico alcanzado — mínimo vital de grasas en riesgo.
          </MutedText>
        )}
        {!isFatMinimumAtRisk && !isFatMinMet && (
          <MutedText>
            Aún por debajo del mínimo · margen disponible para completar.
          </MutedText>
        )}
      </div>
    </SquishyCard>
  );
};

export default SmartFlexibleMacros;
