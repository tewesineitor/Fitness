import React from 'react';
import SquishyCard from './SquishyCard';
import { EyebrowText, GiantValue, StatLabel, MutedText } from './Typography';
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
    isFatMinMet,
    isFatMinimumAtRisk,
  } = useFlexibleMacros(target, consumed);

  // ── Ring color ────────────────────────────────────────────────────────────
  const ringStrokeClass = isKcalOver
    ? 'stroke-rose-500'
    : kcalProgress > 0.85
    ? 'stroke-amber-400'
    : 'stroke-emerald-400';
  const dashOffset = CIRCUMFERENCE * (1 - Math.min(kcalProgress, 1));

  // ── Alert condition (grasas en peligro) ──────────────────────────────────────
  const isAlert = !isFatMinMet || isFatMinimumAtRisk;

  // ── Kcal disponibles en la Bolsa Compartida ──────────────────────────────────
  const sharedBudgetKcal = target.carbIdeal * 4 + target.fatIdeal * 9;
  const kcalDisponibles = Math.max(
    0,
    sharedBudgetKcal - consumed.carbs * 4 - consumed.fat * 9,
  );

  return (
    <div className={['flex flex-col gap-4', className].filter(Boolean).join(' ')}>

      {/* ── Bloque Superior: Innegociables ────────────────────────────────── */}
      <SquishyCard padding="lg" className="flex flex-row items-center gap-8 mb-4">
        {/* Left: Calorie ring */}
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
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
            <GiantValue className="!text-3xl !leading-none">
              {Math.round(kcalRemaining)}
            </GiantValue>
            <MutedText>kcal rest.</MutedText>
          </div>
        </div>

        {/* Right: Proteína */}
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <EyebrowText>PROTEÍNA</EyebrowText>
            <StatLabel>{Math.round(consumed.protein)}g / {target.protein}g</StatLabel>
          </div>
          <div className="relative h-2 rounded-full bg-zinc-800/50 overflow-hidden">
            <div
              className="absolute w-[2px] h-full bg-white/40 z-10"
              style={{ left: '100%' }}
            />
            <div
              className="h-2 rounded-full bg-violet-500 transition-all duration-700 ease-out"
              style={{ width: `${Math.min(proteinProgress * 100, 100)}%` }}
            />
          </div>
          <MutedText>Innegociable · no comparte presupuesto</MutedText>
        </div>
      </SquishyCard>

      {/* ── Bloque Inferior: Bolsa Compartida (Bento Grid) ───────────────────── */}
      <div className="bg-zinc-900/40 rounded-[2rem] p-6 border border-white/5">
        <EyebrowText className="text-cyan-400 mb-4 flex items-center gap-2">
          BOLSA COMPARTIDA C+G
        </EyebrowText>

        <div className="grid grid-cols-3 gap-4">

          {/* Tarjeta: Carbohidratos */}
          <SquishyCard
            padding="md"
            className={[
              'flex flex-col gap-1',
              isAlert ? '!bg-amber-400/10 !border-amber-400/30' : '',
            ].filter(Boolean).join(' ')}
          >
            <EyebrowText className={isAlert ? 'text-amber-400' : ''}>
              CARBOS
            </EyebrowText>
            <GiantValue className="!text-3xl !leading-none">
              {Math.round(consumed.carbs)}g
            </GiantValue>
            <MutedText>Meta: {target.carbIdeal}g</MutedText>
          </SquishyCard>

          {/* Tarjeta: Grasas */}
          <SquishyCard
            padding="md"
            className={[
              'flex flex-col gap-1',
              isAlert
                ? '!bg-rose-500/10 !border-rose-500/30 shadow-[inset_0_0_20px_rgba(244,63,94,0.1)]'
                : '',
            ].filter(Boolean).join(' ')}
          >
            <EyebrowText className={isAlert ? 'text-rose-400' : ''}>
              GRASAS
            </EyebrowText>
            <GiantValue
              className={`!text-3xl !leading-none ${isAlert ? '!text-rose-400' : ''}`}
            >
              {Math.round(consumed.fat)}g
            </GiantValue>
            <MutedText className={isAlert ? 'text-rose-400/70' : ''}>
              Mín: {target.fatMin}g
            </MutedText>
          </SquishyCard>

          {/* Tarjeta: Kcal Flexibles */}
          <SquishyCard padding="md" className="flex flex-col gap-1">
            <EyebrowText>KCAL C+G</EyebrowText>
            <GiantValue className="!text-3xl !leading-none">
              {Math.round(kcalDisponibles)}
            </GiantValue>
            <MutedText>Presupuesto</MutedText>
          </SquishyCard>

        </div>
      </div>
    </div>
  );
};

export default MasterNutritionDashboard;
