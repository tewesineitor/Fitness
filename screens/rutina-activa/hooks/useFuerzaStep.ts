import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AppContext } from '../../../contexts';
import type { DesgloseFuerza, LoggedSet, StrengthStep } from '../../../types';
import { selectAllExercises, selectHistorialDeSesiones } from '../../../selectors/workoutSelectors';
import { vibrate } from '../../../utils/helpers';

// ── Public interface ─────────────────────────────────────────────────────────

export interface FuerzaStepState {
  // Exercise metadata
  exerciseName: string;
  technicalFocus: string | undefined;

  // Set progress
  currentSetIndex: number;
  totalSets: number;
  isFinished: boolean;

  // Input values
  weight: string;
  reps: string;
  rir: number | null;

  // Previous session reference
  prevSetData: { weight: number; reps: number } | undefined;
  previousSessionRelativeTime: string | undefined;

  // Calculator
  showCalculator: boolean;
  calculatorTargetWeight: number;

  // Actions
  setWeight: (v: string) => void;
  setReps: (v: string) => void;
  setRir: (v: number | null) => void;
  setShowCalculator: (v: boolean) => void;
  handleCompleteSet: () => void;
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useFuerzaStep(
  step: StrengthStep,
  loggedSets: LoggedSet[],
  onSetComplete: (setLog: LoggedSet) => void,
): FuerzaStepState {
  const { state } = useContext(AppContext)!;
  const historialDeSesiones = selectHistorialDeSesiones(state);
  const allExercises = selectAllExercises(state);

  const exercise = allExercises[step.exerciseId];
  const technicalFocus = state.session.activeRoutine?.technicalFocus;

  // ── Previous session data ─────────────────────────────────────────────────
  const previousSessionData = useMemo(() => {
    const prevSession = [...historialDeSesiones]
      .sort(
        (a, b) =>
          new Date(b.fecha_completado).getTime() - new Date(a.fecha_completado).getTime(),
      )
      .find((session) =>
        session.desglose_ejercicios.some(
          (item) => 'exerciseId' in item && item.exerciseId === step.exerciseId,
        ),
      );

    if (!prevSession) return null;

    const exerciseData = prevSession.desglose_ejercicios.find(
      (item) => 'exerciseId' in item && item.exerciseId === step.exerciseId,
    ) as DesgloseFuerza;

    if (!exerciseData?.sets) return null;

    return {
      date: new Date(prevSession.fecha_completado),
      sets: exerciseData.sets,
    };
  }, [historialDeSesiones, step.exerciseId]);

  // ── Set progress ──────────────────────────────────────────────────────────
  const currentSetIndex = loggedSets.length;
  const isFinished = currentSetIndex >= step.sets;

  // ── Initial values pre-filled from last session or previous set ───────────
  const initialSet = useMemo(() => {
    if (currentSetIndex > 0) return loggedSets[currentSetIndex - 1];
    if (previousSessionData?.sets[currentSetIndex]) {
      const prev = previousSessionData.sets[currentSetIndex];
      return { weight: prev.weight, reps: prev.reps };
    }
    return { weight: 0, reps: 0 };
  }, [currentSetIndex, loggedSets, previousSessionData]);

  // ── Input state ───────────────────────────────────────────────────────────
  const [weight, setWeight] = useState<string>('');
  const [reps, setReps] = useState<string>('');
  const [rir, setRir] = useState<number | null>(null);
  const [showCalculator, setShowCalculator] = useState(false);

  useEffect(() => {
    setWeight(initialSet.weight > 0 ? initialSet.weight.toString() : '');
    setReps(initialSet.reps > 0 ? initialSet.reps.toString() : '');
    setRir(null);
  }, [initialSet, currentSetIndex]);

  // ── Set completion ────────────────────────────────────────────────────────
  const handleCompleteSet = useCallback(() => {
    vibrate(20);
    onSetComplete({
      weight: parseFloat(weight) || 0,
      reps: parseInt(reps, 10) || 0,
      rir: rir ?? undefined,
    });
  }, [onSetComplete, rir, reps, weight]);

  // ── Relative date helper ──────────────────────────────────────────────────
  const previousSessionRelativeTime = useMemo(() => {
    if (!previousSessionData) return undefined;
    const diff = Date.now() - previousSessionData.date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Hoy';
    if (days === 1) return 'Ayer';
    return `Hace ${days} d`;
  }, [previousSessionData]);

  return {
    exerciseName: exercise?.name ?? step.title,
    technicalFocus,
    currentSetIndex,
    totalSets: step.sets,
    isFinished,
    weight,
    reps,
    rir,
    prevSetData: previousSessionData?.sets[currentSetIndex],
    previousSessionRelativeTime,
    showCalculator,
    calculatorTargetWeight: parseFloat(weight) || 20,
    setWeight,
    setReps,
    setRir,
    setShowCalculator,
    handleCompleteSet,
  };
}
