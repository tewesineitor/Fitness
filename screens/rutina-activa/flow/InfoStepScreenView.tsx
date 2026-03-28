import React from 'react';
import CircularTimer from '../../../components/CircularTimer';
import { InformationCircleIcon, StrengthIcon } from '../../../components/icons';
import type { Exercise } from '../../../types';
import { vibrate } from '../../../utils/helpers';
import { INFO_STEP_DURATION } from '../hooks/useInfoStepFlow';

// ── Potentiation (Preparar) ───────────────────────────────────────────────────
interface PotentiationScreenProps {
  exerciseName: string;
  onStartWorkout: () => void;
}

export const PotentiationScreen: React.FC<PotentiationScreenProps> = ({ exerciseName, onStartWorkout }) => (
  <div className="flex h-full flex-col">
    {/* Atmospheric glow */}
    <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(52,211,153,0.15),transparent_70%)]" />

    {/* Centered floating content */}
    <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-8 px-6 text-center">
      <span
        className="text-[9px] font-black uppercase text-emerald-400"
        style={{ letterSpacing: 'var(--letter-spacing-caps)' }}
      >
        Potentiation
      </span>

      {/* Icon — no box, floats */}
      <div className="text-emerald-400">
        <StrengthIcon className="h-20 w-20" />
      </div>

      <div className="flex flex-col gap-3">
        <h1 className="font-heading text-4xl font-black text-white leading-tight tracking-tight">
          Preparar
        </h1>
        <p className="text-xl font-black text-emerald-400 leading-tight">{exerciseName}</p>
      </div>

      <p className="max-w-xs text-sm text-zinc-400 leading-relaxed">
        Realiza 2–3 series con carga ligera para activar el patrón antes de tu primera serie de trabajo.
      </p>
    </div>

    {/* Fade mask */}
    <div className="pointer-events-none absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-zinc-950 to-transparent z-10" />

    {/* FAB */}
    <div className="relative z-20 flex flex-col items-center px-6 pb-10 pt-4">
      <button
        onPointerDown={() => { vibrate(15); onStartWorkout(); }}
        className="bg-emerald-400 text-zinc-950 font-black text-lg rounded-full py-5 w-full max-w-sm mx-auto shadow-[0_0_30px_rgba(52,211,153,0.3)] hover:scale-105 transition-transform active:bg-emerald-500 select-none"
        style={{ letterSpacing: 'var(--letter-spacing-caps)' }}
      >
        Comenzar
      </button>
    </div>
  </div>
);

// ── Warmup / Cooldown step view ───────────────────────────────────────────────
interface InfoStepScreenViewProps {
  currentItemIndex: number;
  currentItemReps?: string;
  currentExercise: Exercise;
  isWarmup: boolean;
  onAdvance: () => void;
  onShowExerciseDetails: () => void;
  onSkipAll: () => void;
  showPotentiationInfo: boolean;
  timeLeft: number;
  totalItems: number;
  onTimerTick: (remaining: number) => void;
  potentiateExerciseName?: string;
}

const InfoStepScreenView: React.FC<InfoStepScreenViewProps> = ({
  currentItemIndex,
  currentItemReps,
  currentExercise,
  isWarmup,
  onAdvance,
  onShowExerciseDetails,
  onSkipAll,
  showPotentiationInfo,
  timeLeft,
  totalItems,
  onTimerTick,
  potentiateExerciseName,
}) => {
  if (showPotentiationInfo && potentiateExerciseName) {
    return <PotentiationScreen exerciseName={potentiateExerciseName} onStartWorkout={onAdvance} />;
  }

  const label = isWarmup ? 'Calentamiento' : 'Enfriamiento';

  return (
    <div className="flex h-full flex-col">
      {/* Atmospheric glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-brand-accent/10 to-transparent" />

      {/* Progress bar — top, no box wrapper */}
      <div className="relative z-10 flex flex-col gap-3 px-6 pt-4">
        <div className="flex items-center justify-between">
          <span
            className="text-[9px] font-black uppercase text-emerald-400"
            style={{ letterSpacing: 'var(--letter-spacing-caps)' }}
          >
            {label}
          </span>
          <span className="text-[9px] font-bold text-zinc-400">
            {currentItemIndex + 1} / {totalItems}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalItems }).map((_, index) => (
            <div key={index} className="h-1.5 flex-1 rounded-full overflow-hidden bg-zinc-800">
              {index < currentItemIndex && (
                <div className="h-full w-full bg-emerald-400" />
              )}
              {index === currentItemIndex && (
                <div
                  className="h-full bg-emerald-400 transition-all duration-500"
                  style={{ width: `${((INFO_STEP_DURATION - timeLeft) / INFO_STEP_DURATION) * 100}%` }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Floating content — no card cage */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-8 px-6 text-center">
        {/* Timer — colossal, no wrapper, no decorative icon */}
        <CircularTimer
          initialDuration={INFO_STEP_DURATION}
          timeLeft={timeLeft}
          strokeColor="text-emerald-400"
          size={320}
          strokeWidth={10}
          onTick={onTimerTick}
        />

        {/* Exercise name + reps chip */}
        <div className="flex flex-col items-center gap-3">
          <h2 className="font-heading text-4xl font-black text-white leading-tight tracking-tight">
            {currentExercise.name}
          </h2>
          {currentItemReps && (
            <p className="text-3xl font-black text-emerald-400 uppercase tracking-widest">
              {currentItemReps}
            </p>
          )}
        </div>

        {/* Info link — subtle */}
        <button
          onClick={() => { vibrate(5); onShowExerciseDetails(); }}
          className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-zinc-200 transition-colors select-none"
        >
          <InformationCircleIcon className="w-3.5 h-3.5" />
          Ver técnica
        </button>
      </div>

      {/* Fade mask */}
      <div className="pointer-events-none absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-zinc-950 to-transparent z-10" />

      {/* FAB + Saltar */}
      <div className="relative z-20 flex flex-col items-center gap-2 px-6 pb-10 pt-4">
        <button
          onPointerDown={() => { vibrate(10); onAdvance(); }}
          className="bg-emerald-400 text-zinc-950 font-black text-lg rounded-full py-5 w-full max-w-sm mx-auto shadow-[0_0_30px_rgba(52,211,153,0.3)] hover:scale-105 transition-transform active:bg-emerald-500 select-none"
          style={{ letterSpacing: 'var(--letter-spacing-caps)' }}
        >
          Siguiente
        </button>
        <button
          onPointerDown={() => { vibrate(5); onSkipAll(); }}
          className="text-zinc-400 font-bold py-3 text-sm uppercase select-none hover:text-zinc-200 transition-colors"
          style={{ letterSpacing: 'var(--letter-spacing-caps)' }}
        >
          Saltar todo
        </button>
      </div>
    </div>
  );
};

export default InfoStepScreenView;
