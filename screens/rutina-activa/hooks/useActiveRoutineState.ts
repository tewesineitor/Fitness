import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { AppContext } from '../../../contexts';
import {
  Exercise,
  InfoStep,
  LoggedSet,
  RoutineStep,
  RoutineTask,
  StrengthStep,
  WorkoutStats,
} from '../../../types';
import * as thunks from '../../../thunks';
import * as actions from '../../../actions';
import { selectAllExercises, selectCardioWeek } from '../../../selectors/workoutSelectors';
import { useWakeLock } from '../../../hooks/useWakeLock';
import { useRoutineTimers } from './useRoutineTimers';

// ── Public interface ─────────────────────────────────────────────────────────

export interface ActiveRoutineState {
  // Derived from context
  allExercises: Record<string, Exercise>;
  cardioWeek: number;

  // Flow
  currentFlow: RoutineStep[];
  currentStep: RoutineStep | undefined;
  nextStep: RoutineStep | undefined;
  currentStepIndex: number;
  loggedSetsForCurrentStep: LoggedSet[];
  bgExercise: Exercise | undefined;

  // Workout stats & time
  workoutStats: WorkoutStats;
  globalTime: number;

  // Phase flags
  isStarted: boolean;
  isResting: boolean;
  isMainWorkoutFinished: boolean;
  advanceAfterRest: boolean;
  restDuration: number;
  maxRestDuration: number | undefined;

  // UI overlay flags
  showConfirmExit: boolean;
  showConfirmSkip: boolean;
  showAddExerciseModal: boolean;
  exerciseToShowDetails: Exercise | null;
  exerciseToAdd: Exercise | null;

  // ── Actions ────────────────────────────────────────────────────────────────
  onStart: () => void;
  onBack: () => void;
  onFinishWorkout: () => void;
  onAdvanceStep: () => void;
  onSkipStep: () => void;
  onRestComplete: () => void;
  onSetComplete: (setLog: LoggedSet) => void;
  onProceedToCooldown: () => void;
  onSelectExerciseToAdd: (exercise: Exercise) => void;
  onSetSelection: (numberOfSets: number) => void;
  onShowExerciseDetails: (exerciseId: string) => void;

  // UI flag setters
  setShowConfirmExit: (v: boolean) => void;
  setShowConfirmSkip: (v: boolean) => void;
  setShowAddExerciseModal: (v: boolean) => void;
  setExerciseToShowDetails: (e: Exercise | null) => void;
  setExerciseToAdd: (e: Exercise | null) => void;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Returns a setState wrapper that also writes the new value into a ref
 * so callbacks with `[]` deps can read the always-current value without
 * needing to be recreated on every state change.
 */
function useSyncedState<T>(
  initial: T,
): [T, Dispatch<SetStateAction<T>>, MutableRefObject<T>] {
  const ref = useRef<T>(initial);
  const [state, rawSet] = useState<T>(initial);

  const setState = useCallback<Dispatch<SetStateAction<T>>>((updater) => {
    rawSet((prev) => {
      const next =
        typeof updater === 'function'
          ? (updater as (p: T) => T)(prev)
          : updater;
      ref.current = next;
      return next;
    });
  }, []);

  return [state, setState, ref];
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useActiveRoutineState(activeRoutine: RoutineTask): ActiveRoutineState {
  const { state, dispatch } = useContext(AppContext)!;
  const { activeRoutineProgress } = state.session;
  const allExercises = selectAllExercises(state);
  const cardioWeek = selectCardioWeek(state);

  // ── State (with ref mirrors for use in stable callbacks) ──────────────────

  const [isStarted, setIsStarted] = useState(activeRoutineProgress?.isStarted ?? false);

  const [currentFlow, setCurrentFlow, currentFlowRef] = useSyncedState<RoutineStep[]>(
    activeRoutineProgress?.currentFlow ?? activeRoutine.flow,
  );
  const [currentStepIndex, setCurrentStepIndex, currentStepIndexRef] = useSyncedState(
    activeRoutineProgress?.currentStepIndex ?? 0,
  );
  const [globalTime, setGlobalTime, globalTimeRef] = useSyncedState(
    activeRoutineProgress?.globalTime ?? 0,
  );
  const [workoutStats, setWorkoutStats, workoutStatsRef] = useSyncedState<WorkoutStats>(
    activeRoutineProgress?.workoutStats ?? {
      exercisesCompleted: 0,
      duration: 0,
      weightLifted: 0,
      logs: {},
      exerciseDurations: {},
    },
  );

  // These change only on user actions — simpler ref sync via useEffect is fine
  const [isResting, setIsResting] = useState(false);
  const [restDuration, setRestDuration] = useState(0);
  const [maxRestDuration, setMaxRestDuration] = useState<number | undefined>(undefined);
  const [isMainWorkoutFinished, setIsMainWorkoutFinished] = useState(false);
  const [advanceAfterRest, setAdvanceAfterRest] = useState(false);

  const isMainWorkoutFinishedRef = useRef(false);
  const advanceAfterRestRef = useRef(false);

  useEffect(() => { isMainWorkoutFinishedRef.current = isMainWorkoutFinished; }, [isMainWorkoutFinished]);
  useEffect(() => { advanceAfterRestRef.current = advanceAfterRest; }, [advanceAfterRest]);

  // UI overlays — no ref needed
  const [showConfirmExit, setShowConfirmExit] = useState(false);
  const [showConfirmSkip, setShowConfirmSkip] = useState(false);
  const [showAddExerciseModal, setShowAddExerciseModal] = useState(false);
  const [exerciseToShowDetails, setExerciseToShowDetails] = useState<Exercise | null>(null);
  const [exerciseToAdd, setExerciseToAdd] = useState<Exercise | null>(null);

  // ── Wake lock ─────────────────────────────────────────────────────────────
  useWakeLock(isStarted && !isMainWorkoutFinished);

  // ── Timers (pass ref-backed setters so the timer interval never recreates) ─
  useRoutineTimers({
    isStarted,
    isResting,
    isMainWorkoutFinished,
    currentStep: currentFlow[currentStepIndex],
    setGlobalTime,
    setWorkoutStats,
  });

  // ── Derived (memoized) ────────────────────────────────────────────────────
  const currentStep = useMemo(
    () => currentFlow[currentStepIndex],
    [currentFlow, currentStepIndex],
  );
  const nextStep = useMemo(
    () => currentFlow[currentStepIndex + 1],
    [currentFlow, currentStepIndex],
  );

  const loggedSetsForCurrentStep = useMemo(() => {
    if (currentStep?.type === 'exercise') {
      return workoutStats.logs[currentStep.exerciseId] ?? [];
    }
    return [];
  }, [currentStep, workoutStats.logs]);

  const bgExercise = useMemo(() => {
    const stepForBg = isResting
      ? (advanceAfterRest ? currentFlow[currentStepIndex + 1] : currentFlow[currentStepIndex])
      : currentFlow[currentStepIndex];

    if (!stepForBg) return undefined;
    if ('exerciseId' in stepForBg) return allExercises[(stepForBg as { exerciseId: string }).exerciseId];
    if (stepForBg.type === 'warmup' || stepForBg.type === 'cooldown') {
      return allExercises[(stepForBg as InfoStep).items[0]?.exerciseId ?? ''];
    }
    return undefined;
  }, [advanceAfterRest, allExercises, currentFlow, currentStepIndex, isResting]);

  // ── Stable callbacks (useCallback(fn, []) — read refs, not state) ─────────

  const onFinishWorkout = useCallback(() => {
    const finalStats = { ...workoutStatsRef.current, duration: globalTimeRef.current };
    dispatch(thunks.finishRoutineThunk({ ...activeRoutine, flow: currentFlowRef.current }, finalStats));
    setShowConfirmExit(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Internal advance — reads from refs, never recreated
  const advanceStep = useCallback(() => {
    const flow = currentFlowRef.current;
    const idx = currentStepIndexRef.current;
    const finished = isMainWorkoutFinishedRef.current;

    const firstCooldownIndex = flow.findIndex((s) => s.type === 'cooldown');
    const isLastMainStep =
      (firstCooldownIndex !== -1 && idx === firstCooldownIndex - 1) ||
      (firstCooldownIndex === -1 && idx === flow.length - 1);

    if (isLastMainStep && !finished) {
      setIsMainWorkoutFinished(true);
      isMainWorkoutFinishedRef.current = true;
      return;
    }

    if (idx < flow.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      return;
    }

    // Last step — finish
    const finalStats = { ...workoutStatsRef.current, duration: globalTimeRef.current };
    dispatch(thunks.finishRoutineThunk({ ...activeRoutine, flow }, finalStats));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onAdvanceStep = advanceStep;

  const onSkipStep = useCallback(() => {
    const step = currentFlowRef.current[currentStepIndexRef.current];
    if (step?.type === 'exercise') {
      const exerciseId = (step as StrengthStep).exerciseId;
      setWorkoutStats((prev) => {
        const newLogs = { ...prev.logs };
        delete newLogs[exerciseId];
        return { ...prev, logs: newLogs, exercisesCompleted: Object.keys(newLogs).length };
      });
    }
    setIsResting(false);
    setAdvanceAfterRest(false);
    advanceAfterRestRef.current = false;
    setShowConfirmSkip(false);
    advanceStep();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRestComplete = useCallback(() => {
    setIsResting(false);
    if (advanceAfterRestRef.current) {
      setAdvanceAfterRest(false);
      advanceAfterRestRef.current = false;
      advanceStep();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSetComplete = useCallback((setLog: LoggedSet) => {
    const step = currentFlowRef.current[currentStepIndexRef.current] as StrengthStep;
    const exerciseId = step.exerciseId;

    // Compute isLastSet using the ref mirror (no closure staleness)
    const prevLogs = workoutStatsRef.current.logs[exerciseId] ?? [];
    const nextLogCount = prevLogs.length + 1;
    const isLastSet = nextLogCount >= step.sets;

    // Update workout stats
    setWorkoutStats((prev) => {
      const currentLogs = prev.logs[exerciseId] ?? [];
      const newLogs = [...currentLogs, setLog];
      const allLogs = { ...prev.logs, [exerciseId]: newLogs };
      return {
        ...prev,
        logs: allLogs,
        weightLifted: prev.weightLifted + setLog.weight * setLog.reps,
        exercisesCompleted: Object.keys(allLogs).length,
      };
    });

    // Transition to rest phase
    setAdvanceAfterRest(isLastSet);
    advanceAfterRestRef.current = isLastSet;
    setRestDuration(step.rest);
    setMaxRestDuration(step.restMax);
    setIsResting(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onProceedToCooldown = useCallback(() => {
    setIsMainWorkoutFinished(false);
    isMainWorkoutFinishedRef.current = false;
    const flow = currentFlowRef.current;
    const firstCooldownIndex = flow.findIndex((s) => s.type === 'cooldown');
    if (firstCooldownIndex !== -1) {
      setCurrentStepIndex(firstCooldownIndex);
    } else {
      const finalStats = { ...workoutStatsRef.current, duration: globalTimeRef.current };
      dispatch(thunks.finishRoutineThunk({ ...activeRoutine, flow }, finalStats));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSelectExerciseToAdd = useCallback((exercise: Exercise) => {
    setShowAddExerciseModal(false);
    setExerciseToAdd(exercise);
  }, []);

  const onSetSelection = useCallback((numberOfSets: number) => {
    const exercise = exerciseToAdd;
    if (!exercise) return;

    let newStep: RoutineStep;
    if (exercise.category === 'fuerza') {
      newStep = {
        type: 'exercise',
        exerciseId: exercise.id,
        title: exercise.name,
        sets: numberOfSets,
        reps: '8-12',
        rir: '1',
        rest: 60,
      } as RoutineStep;
    } else if (exercise.category === 'yoga' || exercise.category === 'postura') {
      newStep = {
        type: 'pose',
        exerciseId: exercise.id,
        title: exercise.name,
        duration: 60,
      } as RoutineStep;
    } else {
      setExerciseToAdd(null);
      return;
    }

    const flow = currentFlowRef.current;
    const firstCooldownIndex = flow.findIndex((s) => s.type === 'cooldown');
    const insertionIndex = firstCooldownIndex !== -1 ? firstCooldownIndex : flow.length;
    const newFlow = [...flow];
    newFlow.splice(insertionIndex, 0, newStep);

    setCurrentFlow(newFlow);
    if (isMainWorkoutFinishedRef.current) {
      setCurrentStepIndex(insertionIndex);
    }
    setIsMainWorkoutFinished(false);
    isMainWorkoutFinishedRef.current = false;
    setExerciseToAdd(null);
  // exerciseToAdd is intentionally captured from closure since this callback is created
  // when exerciseToAdd changes (via the state setter trigger from onSelectExerciseToAdd).
  // Using state here is safe because this callback is not in the hot re-render path.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exerciseToAdd]);

  const onShowExerciseDetails = useCallback((exerciseId: string) => {
    const ex = allExercises[exerciseId];
    if (ex) setExerciseToShowDetails(ex);
  // allExercises from context is stable between renders
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onStart = useCallback(() => setIsStarted(true), []);
  const onBack = useCallback(() => dispatch(actions.exitRoutine()), [dispatch]);

  const setShowConfirmExitCb = useCallback((v: boolean) => setShowConfirmExit(v), []);
  const setShowConfirmSkipCb = useCallback((v: boolean) => setShowConfirmSkip(v), []);
  const setShowAddExerciseModalCb = useCallback((v: boolean) => setShowAddExerciseModal(v), []);
  const setExerciseToShowDetailsCb = useCallback((e: Exercise | null) => setExerciseToShowDetails(e), []);
  const setExerciseToAddCb = useCallback((e: Exercise | null) => setExerciseToAdd(e), []);

  return {
    allExercises,
    cardioWeek,
    currentFlow,
    currentStep,
    nextStep,
    currentStepIndex,
    loggedSetsForCurrentStep,
    bgExercise,
    workoutStats,
    globalTime,
    isStarted,
    isResting,
    isMainWorkoutFinished,
    advanceAfterRest,
    restDuration,
    maxRestDuration,
    showConfirmExit,
    showConfirmSkip,
    showAddExerciseModal,
    exerciseToShowDetails,
    exerciseToAdd,
    onStart,
    onBack,
    onFinishWorkout,
    onAdvanceStep,
    onSkipStep,
    onRestComplete,
    onSetComplete,
    onProceedToCooldown,
    onSelectExerciseToAdd,
    onSetSelection,
    onShowExerciseDetails,
    setShowConfirmExit: setShowConfirmExitCb,
    setShowConfirmSkip: setShowConfirmSkipCb,
    setShowAddExerciseModal: setShowAddExerciseModalCb,
    setExerciseToShowDetails: setExerciseToShowDetailsCb,
    setExerciseToAdd: setExerciseToAddCb,
  };
}
