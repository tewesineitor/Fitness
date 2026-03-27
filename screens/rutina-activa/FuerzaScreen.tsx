import React from 'react';
import type { LoggedSet, RoutineStep, StrengthStep } from '../../types';
import { useFuerzaStep } from './hooks/useFuerzaStep';
import { vibrate } from '../../utils/helpers';

import NextUpIndicator from '../../components/NextUpIndicator';
import PlateCalculatorModal from '../../components/dialogs/PlateCalculatorModal';
import {
  CalculatorIcon,
  CheckIcon,
  InformationCircleIcon,
} from '../../components/icons';

interface FuerzaScreenProps {
  step: StrengthStep;
  onSetComplete: (setLog: LoggedSet) => void;
  loggedSets: LoggedSet[];
  onShowExerciseDetails: () => void;
  nextStep?: RoutineStep;
}

// ── Tactile Stepper ───────────────────────────────────────────────────────────
const Stepper: React.FC<{
  label: string;
  value: string;
  onDecrement: () => void;
  onIncrement: () => void;
  prevLabel?: string;
  accessorySlot?: React.ReactNode;
}> = ({ label, value, onDecrement, onIncrement, prevLabel, accessorySlot }) => (
  <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-[2rem] p-6 flex flex-col gap-4">
    <div className="flex items-center justify-between">
      <span
        className="text-[9px] font-black uppercase text-zinc-400"
        style={{ letterSpacing: 'var(--letter-spacing-caps)' }}
      >
        {label}
      </span>
      <div className="flex items-center gap-2">
        {prevLabel && (
          <span className="text-[9px] font-bold text-zinc-500">{prevLabel}</span>
        )}
        {accessorySlot}
      </div>
    </div>

    <div className="flex items-center justify-between gap-4">
      {/* Decrement */}
      <button
        onPointerDown={() => { vibrate(8); onDecrement(); }}
        className="w-16 h-16 rounded-full bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center text-2xl font-black text-zinc-300 active:scale-90 active:bg-zinc-700 transition-all duration-100 select-none flex-shrink-0"
      >
        −
      </button>

      {/* Value display */}
      <span className="font-mono text-6xl font-black text-white leading-none tracking-tight flex-1 text-center">
        {value === '' ? '0' : value}
      </span>

      {/* Increment */}
      <button
        onPointerDown={() => { vibrate(8); onIncrement(); }}
        className="w-16 h-16 rounded-full bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center text-2xl font-black text-zinc-300 active:scale-90 active:bg-zinc-700 transition-all duration-100 select-none flex-shrink-0"
      >
        +
      </button>
    </div>
  </div>
);

// ── Main component ────────────────────────────────────────────────────────────
const FuerzaScreen: React.FC<FuerzaScreenProps> = ({
  step,
  onSetComplete,
  loggedSets,
  onShowExerciseDetails,
  nextStep,
}) => {
  const f = useFuerzaStep(step, loggedSets, onSetComplete);

  const weightNum = parseFloat(f.weight) || 0;
  const repsNum   = parseInt(f.reps, 10) || 0;

  const handleWeightDecrement = () => {
    const next = Math.max(0, weightNum - 2.5);
    f.setWeight(next % 1 === 0 ? String(next) : next.toFixed(1));
  };
  const handleWeightIncrement = () => {
    const next = weightNum + 2.5;
    f.setWeight(next % 1 === 0 ? String(next) : next.toFixed(1));
  };
  const handleRepsDecrement = () => f.setReps(String(Math.max(0, repsNum - 1)));
  const handleRepsIncrement = () => f.setReps(String(repsNum + 1));

  return (
    <div className="fixed inset-0 bg-zinc-950 z-50 overflow-y-auto hide-scrollbar">

      {/* Plate calculator overlay */}
      {f.showCalculator ? (
        <PlateCalculatorModal
          targetWeight={f.calculatorTargetWeight}
          onClose={() => f.setShowCalculator(false)}
        />
      ) : null}

      <div className="max-w-2xl mx-auto w-full flex flex-col gap-8 px-4 py-12">

        {/* ── HEADER ────────────────────────────────────────────────────── */}
        <header className="flex flex-col gap-4 animate-fade-in-up">

          {/* Set progress dots */}
          <div className="flex items-center gap-2">
            {Array.from({ length: f.totalSets }).map((_, index) => {
              const isLogged  = index < f.currentSetIndex;
              const isCurrent = index === f.currentSetIndex && !f.isFinished;
              return (
                <div
                  key={index}
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-black transition-all duration-300"
                  style={{
                    backgroundColor: isLogged ? '#4ade80' : isCurrent ? 'rgba(74,222,128,0.15)' : 'rgba(39,39,42,0.8)',
                    border: isCurrent ? '1.5px solid #4ade80' : isLogged ? 'none' : '1.5px solid rgba(63,63,70,0.6)',
                    color: isLogged ? '#052e16' : isCurrent ? '#4ade80' : '#71717a',
                  }}
                >
                  {isLogged ? <CheckIcon className="h-3.5 w-3.5" /> : `S${index + 1}`}
                </div>
              );
            })}

            {f.isFinished && (
              <span
                className="ml-2 text-[9px] font-black uppercase text-emerald-400"
                style={{ letterSpacing: 'var(--letter-spacing-caps)' }}
              >
                Bloque completo
              </span>
            )}
          </div>

          {/* Title row */}
          <div className="flex items-start justify-between gap-3">
            <h1 className="font-heading text-4xl font-black text-white leading-tight tracking-tight flex-1">
              {f.exerciseName}
            </h1>

            {/* Info button */}
            <button
              onClick={() => { vibrate(5); onShowExerciseDetails(); }}
              className="w-10 h-10 rounded-full bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center flex-shrink-0 active:scale-90 transition-all duration-100 select-none"
            >
              <InformationCircleIcon className="w-4 h-4 text-zinc-400" />
            </button>
          </div>

          {/* Meta chips */}
          <div className="flex flex-wrap gap-2">
            <span
              className="text-[9px] font-black uppercase px-3 py-1.5 rounded-full"
              style={{ letterSpacing: 'var(--letter-spacing-caps)', backgroundColor: 'rgba(74,222,128,0.12)', color: '#4ade80' }}
            >
              Target {step.reps} reps
            </span>
            <span
              className="text-[9px] font-black uppercase px-3 py-1.5 rounded-full"
              style={{ letterSpacing: 'var(--letter-spacing-caps)', backgroundColor: 'rgba(63,63,70,0.5)', color: '#a1a1aa' }}
            >
              Descanso {step.rest}s
            </span>
            {f.previousSessionRelativeTime && (
              <span
                className="text-[9px] font-black uppercase px-3 py-1.5 rounded-full"
                style={{ letterSpacing: 'var(--letter-spacing-caps)', backgroundColor: 'rgba(63,63,70,0.5)', color: '#a1a1aa' }}
              >
                Última vez {f.previousSessionRelativeTime}
              </span>
            )}
          </div>
        </header>

        {/* ── TECHNICAL FOCUS ───────────────────────────────────────────── */}
        {f.technicalFocus && (
          <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-[2rem] px-5 py-4 animate-fade-in-up">
            <span
              className="text-[9px] font-black uppercase text-emerald-400"
              style={{ letterSpacing: 'var(--letter-spacing-caps)' }}
            >
              Technical focus
            </span>
            <p className="mt-1.5 text-sm text-zinc-300 leading-relaxed">{f.technicalFocus}</p>
          </div>
        )}

        {/* ── INPUT STEPPERS ────────────────────────────────────────────── */}
        {!f.isFinished && (
          <div className="flex flex-col gap-4 animate-fade-in-up">

            {/* Weight stepper */}
            <Stepper
              label="Carga (kg)"
              value={f.weight}
              onDecrement={handleWeightDecrement}
              onIncrement={handleWeightIncrement}
              prevLabel={f.prevSetData ? `Previo: ${f.prevSetData.weight} kg` : undefined}
              accessorySlot={
                <button
                  onClick={() => { vibrate(5); f.setShowCalculator(true); }}
                  className="w-8 h-8 rounded-full bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center active:scale-90 transition-all duration-100 select-none"
                >
                  <CalculatorIcon className="w-3.5 h-3.5 text-zinc-400" />
                </button>
              }
            />

            {/* Reps stepper */}
            <Stepper
              label="Repeticiones"
              value={f.reps}
              onDecrement={handleRepsDecrement}
              onIncrement={handleRepsIncrement}
              prevLabel={f.prevSetData ? `Previo: ${f.prevSetData.reps} reps` : undefined}
            />

            {/* RIR Segmented Control */}
            <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-[2rem] p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span
                  className="text-[9px] font-black uppercase text-zinc-400"
                  style={{ letterSpacing: 'var(--letter-spacing-caps)' }}
                >
                  RIR — Reps en reserva
                </span>
              </div>
              <div className="flex gap-2">
                {([0, 1, 2, 3] as const).map((value) => {
                  const isActive = f.rir === value;
                  return (
                    <button
                      key={value}
                      onPointerDown={() => { vibrate(8); f.setRir(value); }}
                      className="flex-1 py-4 rounded-[1.25rem] text-base font-black transition-all duration-150 active:scale-95 select-none"
                      style={{
                        backgroundColor: isActive ? '#4ade80' : 'rgba(39,39,42,0.8)',
                        color: isActive ? '#052e16' : '#a1a1aa',
                        border: isActive ? 'none' : '1.5px solid rgba(63,63,70,0.5)',
                      }}
                    >
                      {value === 3 ? '3+' : value}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* ── NEXT UP ───────────────────────────────────────────────────── */}
        {nextStep && (
          <div className="animate-fade-in-up">
            <NextUpIndicator step={nextStep} />
          </div>
        )}

      </div>

      {/* ── FADE MASK ─────────────────────────────────────────────────────── */}
      <div className="pointer-events-none fixed bottom-0 left-0 w-full h-36 bg-gradient-to-t from-zinc-950 to-transparent z-10" />

      {/* ── REGISTRAR SERIE FAB ───────────────────────────────────────────── */}
      {!f.isFinished && (
        <div className="fixed bottom-8 left-0 right-0 z-20 flex justify-center px-4">
          <button
            onClick={f.handleCompleteSet}
            className="w-full max-w-sm bg-emerald-400 text-zinc-950 font-black text-sm uppercase rounded-full py-5 shadow-[0_0_40px_rgba(52,211,153,0.35)] active:scale-[0.97] transition-all duration-150 select-none"
            style={{ letterSpacing: 'var(--letter-spacing-caps)' }}
          >
            Registrar Serie {f.currentSetIndex + 1}/{f.totalSets}
          </button>
        </div>
      )}

    </div>
  );
};

export default FuerzaScreen;
