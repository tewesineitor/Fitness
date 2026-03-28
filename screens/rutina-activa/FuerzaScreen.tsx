import React from 'react';
import type { LoggedSet, RoutineStep, StrengthStep } from '../../types';
import { useFuerzaScreenController } from './hooks/useFuerzaScreenController';
import NextUpIndicator from '../../components/NextUpIndicator';
import PlateCalculatorModal from '../../components/dialogs/PlateCalculatorModal';
import { CalculatorIcon, CheckIcon, InformationCircleIcon } from '../../components/icons';
import { PremiumButton, PremiumStepper, PremiumBadge, SegmentedTabs } from '../../components/ui-premium';

interface FuerzaScreenProps {
  step: StrengthStep;
  onSetComplete: (setLog: LoggedSet) => void;
  loggedSets: LoggedSet[];
  onShowExerciseDetails: () => void;
  nextStep?: RoutineStep;
}

// ── Screen ────────────────────────────────────────────────────────────────────
const FuerzaScreen: React.FC<FuerzaScreenProps> = ({
  step,
  onSetComplete,
  loggedSets,
  onShowExerciseDetails,
  nextStep,
}) => {
  const { state, actions } = useFuerzaScreenController({
    step,
    loggedSets,
    onSetComplete,
    onShowExerciseDetails,
  });

  return (
    <div className="fixed inset-0 z-[100] bg-zinc-950 overflow-y-auto hide-scrollbar">
      {state.showCalculator ? (
        <PlateCalculatorModal
          targetWeight={state.calculatorTargetWeight}
          onClose={actions.closeCalculator}
        />
      ) : null}

      <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col gap-8 px-4 pt-6 pb-36">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <header className="flex flex-col gap-4 animate-fade-in-up">

          {/* Set progress dots */}
          <div className="flex flex-wrap items-center gap-4">
            {state.setProgressItems.map((item) => (
              <div
                key={item.key}
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-black transition-all duration-300"
                style={{
                  backgroundColor: item.isLogged
                    ? 'rgb(74 222 128)'
                    : item.isCurrent
                    ? 'rgba(74,222,128,0.15)'
                    : 'rgba(39,39,42,0.8)',
                  border: item.isCurrent
                    ? '1.5px solid rgb(74 222 128)'
                    : item.isLogged
                    ? 'none'
                    : '1.5px solid rgba(63,63,70,0.6)',
                  color: item.isLogged
                    ? '#052e16'
                    : item.isCurrent
                    ? 'rgb(74 222 128)'
                    : '#71717a',
                }}
              >
                {item.isLogged ? <CheckIcon className="h-3.5 w-3.5" /> : item.label}
              </div>
            ))}
            {state.isFinished ? (
              <span
                className="ml-2 text-[9px] font-black uppercase text-emerald-400"
                style={{ letterSpacing: 'var(--letter-spacing-caps)' }}
              >
                Bloque completo
              </span>
            ) : null}
          </div>

          {/* Title + info button */}
          <div className="flex items-start justify-between gap-3">
            <h1 className="font-heading text-4xl font-black text-white leading-tight tracking-tight flex-1">
              {state.exerciseName}
            </h1>
            <button
              onClick={actions.showExerciseDetails}
              className="w-10 h-10 rounded-full bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center flex-shrink-0 active:scale-90 transition-all duration-100 select-none"
            >
              <InformationCircleIcon className="w-4 h-4 text-zinc-400" />
            </button>
          </div>

          {/* Meta pills */}
          <div className="flex flex-wrap gap-2">
            <span
              className="text-[9px] font-black uppercase px-3 py-1.5 rounded-full bg-zinc-800/50 text-zinc-400"
              style={{ letterSpacing: 'var(--letter-spacing-caps)' }}
            >
              Descanso {state.restSeconds}s
            </span>
            {state.previousSessionRelativeTime ? (
              <span
                className="text-[9px] font-black uppercase px-3 py-1.5 rounded-full bg-zinc-800/50 text-zinc-400"
                style={{ letterSpacing: 'var(--letter-spacing-caps)' }}
              >
                Última vez {state.previousSessionRelativeTime}
              </span>
            ) : null}
          </div>
        </header>

        {/* ── Technical focus ────────────────────────────────────────────── */}
        {state.technicalFocus && (
          <div className="animate-fade-in-up">
            <PremiumBadge icon="ℹ️">{state.technicalFocus}</PremiumBadge>
          </div>
        )}

        {/* ── Steppers + RIR ─────────────────────────────────────────────── */}
        {!state.isFinished ? (
          <div className="flex flex-col gap-4 animate-fade-in-up">

            <PremiumStepper
              label="Carga (kg)"
              value={state.weight}
              onDecrement={actions.decrementWeight}
              onIncrement={actions.incrementWeight}
              prevLabel={state.previousWeightLabel}
              accessorySlot={
                <button
                  onClick={actions.openCalculator}
                  className="w-8 h-8 rounded-full bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center active:scale-90 transition-all duration-100 select-none"
                >
                  <CalculatorIcon className="w-3.5 h-3.5 text-zinc-400" />
                </button>
              }
            />

            <div className="text-emerald-400 font-bold text-xl uppercase tracking-widest text-center mb-2">
              Objetivo: {state.targetReps}
            </div>
            <PremiumStepper
              label="Repeticiones"
              value={state.reps}
              onDecrement={actions.decrementReps}
              onIncrement={actions.incrementReps}
              prevLabel={state.previousRepsLabel}
            />

            {/* RIR segmented control */}
            <SegmentedTabs
              label="RIR — Reps en reserva"
              options={state.rirOptions.map((o) => ({ label: o.label, value: o.value }))}
              selectedValue={state.rirOptions.find((o) => o.isActive)?.value ?? ''}
              onChange={(val) => actions.selectRir(val as number)}
            />
          </div>
        ) : null}

        {/* ── Next up ────────────────────────────────────────────────────── */}
        {nextStep ? (
          <div className="animate-fade-in-up">
            <NextUpIndicator step={nextStep} />
          </div>
        ) : null}
      </div>

      {/* Fade mask */}
      <div className="pointer-events-none fixed bottom-0 left-0 z-10 h-36 w-full bg-gradient-to-t from-zinc-950 to-transparent" />

      {/* CTA FAB */}
      {!state.isFinished ? (
        <div className="fixed bottom-8 left-0 right-0 z-20 flex justify-center px-4">
          <div className="w-full max-w-sm">
            <PremiumButton
              variant="primary"
              size="lg"
              onPress={actions.handleCompleteSet}
            >
              {state.registerButtonLabel}
            </PremiumButton>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default FuerzaScreen;
