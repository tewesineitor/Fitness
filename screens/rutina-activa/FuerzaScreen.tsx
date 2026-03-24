import React from 'react';
import type { LoggedSet, RoutineStep, StrengthStep } from '../../types';
import { useFuerzaStep } from './hooks/useFuerzaStep';
import { vibrate } from '../../utils/helpers';

import Button from '../../components/Button';
import Card from '../../components/Card';
import ChipButton from '../../components/ChipButton';
import IconButton from '../../components/IconButton';
import Tag from '../../components/Tag';
import NextUpIndicator from '../../components/NextUpIndicator';
import ImmersiveFocusShell from '../../components/layout/ImmersiveFocusShell';
import PlateCalculatorModal from '../../components/dialogs/PlateCalculatorModal';
import {
  CalculatorIcon,
  CheckIcon,
  ChartBarIcon,
  ClockIcon,
  InformationCircleIcon,
} from '../../components/icons';

interface FuerzaScreenProps {
  step: StrengthStep;
  onSetComplete: (setLog: LoggedSet) => void;
  loggedSets: LoggedSet[];
  onShowExerciseDetails: () => void;
  nextStep?: RoutineStep;
}

const FuerzaScreen: React.FC<FuerzaScreenProps> = ({
  step,
  onSetComplete,
  loggedSets,
  onShowExerciseDetails,
  nextStep,
}) => {
  const f = useFuerzaStep(step, loggedSets, onSetComplete);

  return (
    <ImmersiveFocusShell
      contentClassName="pb-40 pt-6"
      bottomBar={
        !f.isFinished ? (
          <Button
            variant="high-contrast"
            onClick={f.handleCompleteSet}
            size="large"
            className="mx-auto w-full max-w-xl"
          >
            Registrar serie
          </Button>
        ) : undefined
      }
    >
      {/* ── Plate calculator overlay ──────────────────────────────────────── */}
      {f.showCalculator ? (
        <PlateCalculatorModal
          targetWeight={f.calculatorTargetWeight}
          onClose={() => f.setShowCalculator(false)}
        />
      ) : null}

      <div className="mx-auto flex max-w-xl flex-col">
        {/* ── Exercise header ─────────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <Tag variant="status" tone="protein" size="sm">
              {f.isFinished ? 'Bloque completo' : `Set ${f.currentSetIndex + 1}/${f.totalSets}`}
            </Tag>
            <h1 className="mt-4 text-3xl font-black uppercase tracking-[-0.06em] text-text-primary sm:text-4xl">
              {f.exerciseName}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">
              Registra carga, repeticiones y RIR con referencia de la sesion anterior.
            </p>
          </div>

          <IconButton
            onClick={() => { vibrate(5); onShowExerciseDetails(); }}
            variant="secondary"
            icon={InformationCircleIcon}
            label="Ver tecnica"
          />
        </div>

        {/* ── Target & rest meta-tags ──────────────────────────────────────── */}
        <div className="mt-5 flex flex-wrap gap-2">
          <Tag variant="status" tone="accent" size="sm" icon={ChartBarIcon}>
            Target {step.reps}
          </Tag>
          <Tag variant="status" tone="neutral" size="sm" icon={ClockIcon}>
            Descanso {step.rest}s
          </Tag>
          {f.previousSessionRelativeTime ? (
            <Tag variant="status" tone="neutral" size="sm">
              Ultima vez {f.previousSessionRelativeTime}
            </Tag>
          ) : null}
        </div>

        {/* ── Technical focus callout ──────────────────────────────────────── */}
        {f.technicalFocus ? (
          <Card variant="accent" className="mt-5 p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-accent">
              Technical focus
            </p>
            <p className="mt-2 text-sm leading-relaxed text-text-primary">{f.technicalFocus}</p>
          </Card>
        ) : null}

        {/* ── Input cards (weight / reps / RIR) ───────────────────────────── */}
        {!f.isFinished ? (
          <div className="mt-8 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Weight */}
              <Card variant="glass" className="space-y-4 p-5">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">
                    Carga (kg)
                  </p>
                  <IconButton
                    onClick={() => { vibrate(5); f.setShowCalculator(true); }}
                    variant="ghost"
                    size="small"
                    icon={CalculatorIcon}
                    label="Abrir calculadora"
                  />
                </div>
                <input
                  type="number"
                  value={f.weight}
                  onChange={(e) => f.setWeight(e.target.value)}
                  className="w-full bg-transparent text-center font-mono text-6xl font-black leading-none tracking-[-0.08em] text-text-primary outline-none placeholder:text-text-muted"
                  placeholder="0"
                  inputMode="decimal"
                />
                {f.prevSetData ? (
                  <Tag variant="overlay" tone="neutral" size="sm">
                    Previo {f.prevSetData.weight} kg
                  </Tag>
                ) : null}
              </Card>

              {/* Reps */}
              <Card variant="glass" className="space-y-4 p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">
                  Reps
                </p>
                <input
                  type="number"
                  value={f.reps}
                  onChange={(e) => f.setReps(e.target.value)}
                  className="w-full bg-transparent text-center font-mono text-6xl font-black leading-none tracking-[-0.08em] text-text-primary outline-none placeholder:text-text-muted"
                  placeholder="0"
                  inputMode="numeric"
                />
                {f.prevSetData ? (
                  <Tag variant="overlay" tone="neutral" size="sm">
                    Previo {f.prevSetData.reps} reps
                  </Tag>
                ) : null}
              </Card>
            </div>

            {/* RIR */}
            <Card variant="default" className="space-y-4 p-5">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">
                  RIR
                </p>
                <Tag variant="status" tone="neutral" size="sm">
                  Reps en reserva
                </Tag>
              </div>
              <div className="flex gap-2">
                {[0, 1, 2, 3].map((value) => (
                  <ChipButton
                    key={value}
                    onClick={() => { vibrate(5); f.setRir(value); }}
                    active={f.rir === value}
                    tone="accent"
                    size="medium"
                    className="flex-1"
                  >
                    {value === 3 ? '3+' : value}
                  </ChipButton>
                ))}
              </div>
            </Card>
          </div>
        ) : null}

        {/* ── Set log tracker ──────────────────────────────────────────────── */}
        <div className="mt-8">
          <Card variant="default" className="p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">
                Series registradas
              </p>
              <Tag variant="overlay" tone="accent" size="sm" count={loggedSets.length}>
                Log
              </Tag>
            </div>
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
              {Array.from({ length: f.totalSets }).map((_, index) => {
                const isLogged = index < f.currentSetIndex;
                const isCurrent = index === f.currentSetIndex;
                return (
                  <div
                    key={index}
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-black uppercase tracking-[0.16em] transition-all ${
                      isLogged
                        ? 'bg-brand-accent text-brand-accent-foreground shadow-md shadow-brand-accent/20'
                        : isCurrent
                          ? 'border border-brand-accent bg-surface-bg text-text-primary'
                          : 'border border-surface-border bg-surface-hover text-text-muted'
                    }`}
                  >
                    {isLogged ? <CheckIcon className="h-4 w-4" /> : `S${index + 1}`}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* ── Next up indicator ────────────────────────────────────────────── */}
        {nextStep ? (
          <div className="mt-6">
            <NextUpIndicator step={nextStep} />
          </div>
        ) : null}
      </div>
    </ImmersiveFocusShell>
  );
};

export default FuerzaScreen;
