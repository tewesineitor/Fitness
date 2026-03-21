import React, { useContext, useEffect, useMemo, useState } from 'react';
import type { DesgloseFuerza, LoggedSet, RoutineStep, StrengthStep } from '../../types';
import Button from '../../components/Button';
import Card from '../../components/Card';
import ChipButton from '../../components/ChipButton';
import IconButton from '../../components/IconButton';
import Tag from '../../components/Tag';
import {
  CalculatorIcon,
  CheckIcon,
  ChartBarIcon,
  ClockIcon,
  InformationCircleIcon,
} from '../../components/icons';
import PlateCalculatorModal from '../../components/dialogs/PlateCalculatorModal';
import NextUpIndicator from '../../components/NextUpIndicator';
import ImmersiveFocusShell from '../../components/layout/ImmersiveFocusShell';
import { AppContext } from '../../contexts';
import { selectAllExercises, selectHistorialDeSesiones } from '../../selectors/workoutSelectors';
import { vibrate } from '../../utils/helpers';

interface FuerzaScreenProps {
  step: StrengthStep;
  onSetComplete: (setLog: LoggedSet) => void;
  loggedSets: LoggedSet[];
  onShowExerciseDetails: () => void;
  nextStep?: RoutineStep;
}

const FuerzaScreen: React.FC<FuerzaScreenProps> = ({ step, onSetComplete, loggedSets, onShowExerciseDetails, nextStep }) => {
  const { state } = useContext(AppContext)!;
  const activeRoutine = state.session.activeRoutine;
  const technicalFocus = activeRoutine?.technicalFocus;

  const historialDeSesiones = selectHistorialDeSesiones(state);
  const allExercises = selectAllExercises(state);
  const exercise = allExercises[step.exerciseId];
  const [showCalculator, setShowCalculator] = useState(false);

  const previousSessionData = useMemo(() => {
    const prevSession = [...historialDeSesiones]
      .sort((a, b) => new Date(b.fecha_completado).getTime() - new Date(a.fecha_completado).getTime())
      .find((session) => session.desglose_ejercicios.some((item) => 'exerciseId' in item && item.exerciseId === step.exerciseId));

    if (!prevSession) return null;

    const exerciseData = prevSession.desglose_ejercicios.find((item) => 'exerciseId' in item && item.exerciseId === step.exerciseId) as DesgloseFuerza;
    if (!exerciseData || !exerciseData.sets) return null;

    return {
      date: new Date(prevSession.fecha_completado),
      sets: exerciseData.sets,
    };
  }, [historialDeSesiones, step.exerciseId]);

  const currentSetIndex = loggedSets.length;
  const isFinished = currentSetIndex >= step.sets;

  const initialSet = useMemo(() => {
    if (currentSetIndex > 0) return loggedSets[currentSetIndex - 1];
    if (previousSessionData && previousSessionData.sets[currentSetIndex]) {
      const prevSet = previousSessionData.sets[currentSetIndex];
      return { weight: prevSet.weight, reps: prevSet.reps };
    }
    return { weight: 0, reps: 0 };
  }, [currentSetIndex, loggedSets, previousSessionData]);

  const [weight, setWeight] = useState<string>('');
  const [reps, setReps] = useState<string>('');
  const [rir, setRir] = useState<number | null>(null);

  useEffect(() => {
    setWeight(initialSet.weight > 0 ? initialSet.weight.toString() : '');
    setReps(initialSet.reps > 0 ? initialSet.reps.toString() : '');
    setRir(null);
  }, [initialSet, currentSetIndex]);

  const handleCompleteSet = () => {
    vibrate(20);
    onSetComplete({
      weight: parseFloat(weight) || 0,
      reps: parseInt(reps) || 0,
      rir: rir ?? undefined,
    });
  };

  const getRelativeTime = (date: Date) => {
    const diff = new Date().getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Hoy';
    if (days === 1) return 'Ayer';
    return `Hace ${days} d`;
  };

  const prevSetData = previousSessionData?.sets[currentSetIndex];

  return (
    <ImmersiveFocusShell
      contentClassName="pb-40 pt-6"
      bottomBar={
        !isFinished ? (
          <Button variant="high-contrast" onClick={handleCompleteSet} size="large" className="mx-auto w-full max-w-xl">
            Registrar serie
          </Button>
        ) : undefined
      }
    >
      {showCalculator ? <PlateCalculatorModal targetWeight={parseFloat(weight) || 20} onClose={() => setShowCalculator(false)} /> : null}

      <div className="mx-auto flex max-w-xl flex-col">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Tag variant="status" tone="protein" size="sm">
                {isFinished ? 'Bloque completo' : `Set ${currentSetIndex + 1}/${step.sets}`}
              </Tag>
              <h1 className="mt-4 text-3xl font-black uppercase tracking-[-0.06em] text-text-primary sm:text-4xl">
                {step.title}
              </h1>
              {exercise ? (
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  Registra carga, repeticiones y RIR con referencia de la sesion anterior.
                </p>
              ) : null}
            </div>

            <IconButton
              onClick={() => { vibrate(5); onShowExerciseDetails(); }}
              variant="secondary"
              icon={InformationCircleIcon}
              label="Ver tecnica"
            />
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Tag variant="status" tone="accent" size="sm" icon={ChartBarIcon}>
              Target {step.reps}
            </Tag>
            <Tag variant="status" tone="neutral" size="sm" icon={ClockIcon}>
              Descanso {step.rest}s
            </Tag>
            {previousSessionData ? (
              <Tag variant="status" tone="neutral" size="sm">
                Ultima vez {getRelativeTime(previousSessionData.date)}
              </Tag>
            ) : null}
          </div>

          {technicalFocus ? (
            <Card variant="accent" className="mt-5 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-accent">Technical focus</p>
              <p className="mt-2 text-sm leading-relaxed text-text-primary">{technicalFocus}</p>
            </Card>
          ) : null}

          {!isFinished ? (
            <div className="mt-8 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Card variant="glass" className="space-y-4 p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">Carga (kg)</p>
                    <IconButton
                      onClick={() => { vibrate(5); setShowCalculator(true); }}
                      variant="ghost"
                      size="small"
                      icon={CalculatorIcon}
                      label="Abrir calculadora"
                    />
                  </div>

                  <input
                    type="number"
                    value={weight}
                    onChange={(event) => setWeight(event.target.value)}
                    className="w-full bg-transparent text-center font-mono text-6xl font-black leading-none tracking-[-0.08em] text-text-primary outline-none placeholder:text-text-muted"
                    placeholder="0"
                    inputMode="decimal"
                  />

                  {prevSetData ? (
                    <Tag variant="overlay" tone="neutral" size="sm">
                      Previo {prevSetData.weight} kg
                    </Tag>
                  ) : null}
                </Card>

                <Card variant="glass" className="space-y-4 p-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">Reps</p>

                  <input
                    type="number"
                    value={reps}
                    onChange={(event) => setReps(event.target.value)}
                    className="w-full bg-transparent text-center font-mono text-6xl font-black leading-none tracking-[-0.08em] text-text-primary outline-none placeholder:text-text-muted"
                    placeholder="0"
                    inputMode="numeric"
                  />

                  {prevSetData ? (
                    <Tag variant="overlay" tone="neutral" size="sm">
                      Previo {prevSetData.reps} reps
                    </Tag>
                  ) : null}
                </Card>
              </div>

              <Card variant="default" className="space-y-4 p-5">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">RIR</p>
                  <Tag variant="status" tone="neutral" size="sm">
                    Reps en reserva
                  </Tag>
                </div>

                <div className="flex gap-2">
                  {[0, 1, 2, 3].map((value) => (
                    <ChipButton
                      key={value}
                      onClick={() => { vibrate(5); setRir(value); }}
                      active={rir === value}
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

          <div className="mt-8">
            <Card variant="default" className="p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">Series registradas</p>
                <Tag variant="overlay" tone="accent" size="sm" count={loggedSets.length}>
                  Log
                </Tag>
              </div>

              <div className="mt-4 flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
                {Array.from({ length: step.sets }).map((_, index) => {
                  const isLogged = index < currentSetIndex;
                  const isCurrent = index === currentSetIndex;
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
