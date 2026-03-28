import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AppContext } from '../../../contexts';
import type { DesgloseFuerza, LoggedSet, StrengthStep } from '../../../types';
import { selectAllExercises, selectHistorialDeSesiones } from '../../../selectors/workoutSelectors';
import { vibrate } from '../../../utils/helpers';

interface FuerzaSetProgressItem {
  key: string;
  label: string;
  isLogged: boolean;
  isCurrent: boolean;
}

interface FuerzaRirOption {
  value: number;
  label: string;
  isActive: boolean;
}

export interface FuerzaScreenViewState {
  exerciseName: string;
  technicalFocus: string | undefined;
  targetReps: string;
  restSeconds: number;
  currentSetIndex: number;
  totalSets: number;
  isFinished: boolean;
  weight: string;
  reps: string;
  rir: number | null;
  previousSessionRelativeTime: string | undefined;
  previousWeightLabel: string | undefined;
  previousRepsLabel: string | undefined;
  showCalculator: boolean;
  calculatorTargetWeight: number;
  setProgressItems: FuerzaSetProgressItem[];
  rirOptions: FuerzaRirOption[];
  registerButtonLabel: string;
}

export interface FuerzaScreenActions {
  updateWeight: (value: string) => void;
  updateReps: (value: string) => void;
  selectRir: (value: number | null) => void;
  incrementWeight: () => void;
  decrementWeight: () => void;
  incrementReps: () => void;
  decrementReps: () => void;
  openCalculator: () => void;
  closeCalculator: () => void;
  showExerciseDetails: () => void;
  handleCompleteSet: () => void;
}

export interface FuerzaScreenController {
  state: FuerzaScreenViewState;
  actions: FuerzaScreenActions;
}

interface UseFuerzaScreenControllerParams {
  step: StrengthStep;
  loggedSets: LoggedSet[];
  onSetComplete: (setLog: LoggedSet) => void;
  onShowExerciseDetails: () => void;
}

export function useFuerzaScreenController({
  step,
  loggedSets,
  onSetComplete,
  onShowExerciseDetails,
}: UseFuerzaScreenControllerParams): FuerzaScreenController {
  const { state } = useContext(AppContext)!;
  const historialDeSesiones = selectHistorialDeSesiones(state);
  const allExercises = selectAllExercises(state);

  const exercise = allExercises[step.exerciseId];
  const technicalFocus = state.session.activeRoutine?.technicalFocus;

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

  const currentSetIndex = loggedSets.length;
  const isFinished = currentSetIndex >= step.sets;

  const initialSet = useMemo(() => {
    if (currentSetIndex > 0) return loggedSets[currentSetIndex - 1];
    if (previousSessionData?.sets[currentSetIndex]) {
      const prev = previousSessionData.sets[currentSetIndex];
      return { weight: prev.weight, reps: prev.reps };
    }
    return { weight: 0, reps: 0 };
  }, [currentSetIndex, loggedSets, previousSessionData]);

  const [weight, setWeight] = useState<string>('');
  const [reps, setReps] = useState<string>('');
  const [rir, setRir] = useState<number | null>(null);
  const [showCalculator, setShowCalculator] = useState(false);

  useEffect(() => {
    setWeight(initialSet.weight > 0 ? initialSet.weight.toString() : '');
    setReps(initialSet.reps > 0 ? initialSet.reps.toString() : '');
    setRir(null);
  }, [initialSet]);

  const previousSessionRelativeTime = useMemo(() => {
    if (!previousSessionData) return undefined;
    const diff = Date.now() - previousSessionData.date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Hoy';
    if (days === 1) return 'Ayer';
    return `Hace ${days} d`;
  }, [previousSessionData]);

  const previousSetData = previousSessionData?.sets[currentSetIndex];

  const setProgressItems = useMemo(
    () =>
      Array.from({ length: step.sets }, (_, index) => ({
        key: `set-${index + 1}`,
        label: `S${index + 1}`,
        isLogged: index < currentSetIndex,
        isCurrent: index === currentSetIndex && !isFinished,
      })),
    [currentSetIndex, isFinished, step.sets],
  );

  const rirOptions = useMemo(
    () =>
      ([0, 1, 2, 3] as const).map((value) => ({
        value,
        label: value === 3 ? '3+' : String(value),
        isActive: rir === value,
      })),
    [rir],
  );

  const updateWeight = useCallback((value: string) => {
    setWeight(value);
  }, []);

  const updateReps = useCallback((value: string) => {
    setReps(value);
  }, []);

  const selectRir = useCallback((value: number | null) => {
    vibrate(8);
    setRir(value);
  }, []);

  const decrementWeight = useCallback(() => {
    const currentWeight = parseFloat(weight) || 0;
    const next = Math.max(0, currentWeight - 2.5);
    vibrate(8);
    setWeight(next % 1 === 0 ? String(next) : next.toFixed(1));
  }, [weight]);

  const incrementWeight = useCallback(() => {
    const currentWeight = parseFloat(weight) || 0;
    const next = currentWeight + 2.5;
    vibrate(8);
    setWeight(next % 1 === 0 ? String(next) : next.toFixed(1));
  }, [weight]);

  const decrementReps = useCallback(() => {
    const currentReps = parseInt(reps, 10) || 0;
    vibrate(8);
    setReps(String(Math.max(0, currentReps - 1)));
  }, [reps]);

  const incrementReps = useCallback(() => {
    const currentReps = parseInt(reps, 10) || 0;
    vibrate(8);
    setReps(String(currentReps + 1));
  }, [reps]);

  const openCalculator = useCallback(() => {
    vibrate(5);
    setShowCalculator(true);
  }, []);

  const closeCalculator = useCallback(() => {
    setShowCalculator(false);
  }, []);

  const showExerciseDetails = useCallback(() => {
    vibrate(5);
    onShowExerciseDetails();
  }, [onShowExerciseDetails]);

  const handleCompleteSet = useCallback(() => {
    vibrate(20);
    onSetComplete({
      weight: parseFloat(weight) || 0,
      reps: parseInt(reps, 10) || 0,
      rir: rir ?? undefined,
    });
  }, [onSetComplete, rir, reps, weight]);

  return {
    state: {
      exerciseName: exercise?.name ?? step.title,
      technicalFocus,
      targetReps: step.reps,
      restSeconds: step.rest,
      currentSetIndex,
      totalSets: step.sets,
      isFinished,
      weight,
      reps,
      rir,
      previousSessionRelativeTime,
      previousWeightLabel: previousSetData ? `Previo: ${previousSetData.weight} kg` : undefined,
      previousRepsLabel: previousSetData ? `Previo: ${previousSetData.reps} reps` : undefined,
      showCalculator,
      calculatorTargetWeight: parseFloat(weight) || 20,
      setProgressItems,
      rirOptions,
      registerButtonLabel: `Registrar Serie ${currentSetIndex + 1}/${step.sets}`,
    },
    actions: {
      updateWeight,
      updateReps,
      selectRir,
      incrementWeight,
      decrementWeight,
      incrementReps,
      decrementReps,
      openCalculator,
      closeCalculator,
      showExerciseDetails,
      handleCompleteSet,
    },
  };
}
