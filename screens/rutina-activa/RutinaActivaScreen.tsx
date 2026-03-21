import React, { useContext, useMemo, useState } from 'react';
import { AppContext } from '../../contexts';
import { RoutineTask, WorkoutStats, RoutineStep, StrengthStep, LoggedSet, Exercise, YogaStep, MeditationStep, InfoStep } from '../../types';
import * as thunks from '../../thunks';
import * as actions from '../../actions';
import { selectAllExercises, selectCardioWeek } from '../../selectors/workoutSelectors';
import { useWakeLock } from '../../hooks/useWakeLock';

import ImmersiveBackground from '../../components/ImmersiveBackground';
import Modal from '../../components/Modal';
import ConfirmationDialog from '../../components/dialogs/ConfirmationDialog';
import AddExerciseModal from './AddExerciseModal';
import ExerciseDetailSheet from './ExerciseDetailSheet';
import SetSelectorModal from '../../components/dialogs/SetSelectorModal';
import RoutinePreStartView from './flow/RoutinePreStartView';
import RoutineSessionHeader from './flow/RoutineSessionHeader';
import RoutineStepRenderer from './flow/RoutineStepRenderer';
import { useRoutineTimers } from './hooks/useRoutineTimers';

interface RutinaActivaScreenProps {
    activeRoutine: RoutineTask;
}

const RutinaActivaScreen: React.FC<RutinaActivaScreenProps> = ({ activeRoutine }) => {
    const { state, dispatch } = useContext(AppContext)!;
    const { activeRoutineProgress } = state.session;
    const allExercises = selectAllExercises(state);
    const cardioWeek = selectCardioWeek(state);

    const [isStarted, setIsStarted] = useState(activeRoutineProgress?.isStarted ?? false);
    const [currentFlow, setCurrentFlow] = useState<RoutineStep[]>(activeRoutineProgress?.currentFlow ?? activeRoutine.flow);
    const [currentStepIndex, setCurrentStepIndex] = useState(activeRoutineProgress?.currentStepIndex ?? 0);
    const [globalTime, setGlobalTime] = useState(activeRoutineProgress?.globalTime ?? 0);
    const [isResting, setIsResting] = useState(false);
    const [restDuration, setRestDuration] = useState(0);
    const [maxRestDuration, setMaxRestDuration] = useState<number | undefined>(undefined);
    const [showConfirmExit, setShowConfirmExit] = useState(false);
    const [showConfirmSkip, setShowConfirmSkip] = useState(false);
    const [isMainWorkoutFinished, setIsMainWorkoutFinished] = useState(false);
    const [showAddExerciseModal, setShowAddExerciseModal] = useState(false);
    const [advanceAfterRest, setAdvanceAfterRest] = useState(false);
    const [exerciseToShowDetails, setExerciseToShowDetails] = useState<Exercise | null>(null);
    const [exerciseToAdd, setExerciseToAdd] = useState<Exercise | null>(null);

    useWakeLock(isStarted && !isMainWorkoutFinished);

    const [workoutStats, setWorkoutStats] = useState<WorkoutStats>(
        activeRoutineProgress?.workoutStats ?? {
            exercisesCompleted: 0,
            duration: 0,
            weightLifted: 0,
            logs: {},
            exerciseDurations: {},
        }
    );

    useRoutineTimers({
        isStarted,
        isResting,
        isMainWorkoutFinished,
        currentStep: currentFlow[currentStepIndex],
        setGlobalTime,
        setWorkoutStats,
    });

    const currentStep = useMemo(() => currentFlow[currentStepIndex], [currentFlow, currentStepIndex]);
    const nextStep = useMemo(() => currentFlow[currentStepIndex + 1], [currentFlow, currentStepIndex]);

    const loggedSetsForCurrentStep = useMemo(() => {
        if (currentStep && currentStep.type === 'exercise') {
            return workoutStats.logs[currentStep.exerciseId] || [];
        }
        return [];
    }, [currentStep, workoutStats.logs]);

    const handleFinishWorkout = () => {
        const finalStats = { ...workoutStats, duration: globalTime };
        dispatch(thunks.finishRoutineThunk({ ...activeRoutine, flow: currentFlow }, finalStats));
        setShowConfirmExit(false);
    };

    const handleAdvanceStep = () => {
        const firstCooldownIndex = currentFlow.findIndex((step) => step.type === 'cooldown');
        const isLastMainStep =
            (firstCooldownIndex !== -1 && currentStepIndex === firstCooldownIndex - 1) ||
            (firstCooldownIndex === -1 && currentStepIndex === currentFlow.length - 1);

        if (isLastMainStep && !isMainWorkoutFinished) {
            setIsMainWorkoutFinished(true);
            return;
        }

        if (currentStepIndex < currentFlow.length - 1) {
            setCurrentStepIndex((value) => value + 1);
            return;
        }

        handleFinishWorkout();
    };

    const handleSkipStep = () => {
        if (currentStep && currentStep.type === 'exercise') {
            const exerciseId = currentStep.exerciseId;
            setWorkoutStats((prev) => {
                const newLogs = { ...prev.logs };
                delete newLogs[exerciseId];
                return {
                    ...prev,
                    logs: newLogs,
                    exercisesCompleted: Object.keys(newLogs).length,
                };
            });
        }

        setIsResting(false);
        setAdvanceAfterRest(false);
        handleAdvanceStep();
        setShowConfirmSkip(false);
    };

    const handleRestComplete = () => {
        setIsResting(false);
        if (advanceAfterRest) {
            setAdvanceAfterRest(false);
            handleAdvanceStep();
        }
    };

    const handleSetComplete = (setLog: LoggedSet) => {
        const step = currentStep as StrengthStep;
        const exerciseId = step.exerciseId;
        const currentLogs = workoutStats.logs[exerciseId] || [];
        const newLogs = [...currentLogs, setLog];

        setWorkoutStats((prev) => ({
            ...prev,
            logs: { ...prev.logs, [exerciseId]: newLogs },
            weightLifted: prev.weightLifted + setLog.weight * setLog.reps,
            exercisesCompleted: Object.keys({ ...prev.logs, [exerciseId]: newLogs }).length,
        }));

        const isLastSet = newLogs.length >= step.sets;
        setAdvanceAfterRest(isLastSet);
        setRestDuration(step.rest);
        setMaxRestDuration(step.restMax);
        setIsResting(true);
    };

    const handleProceedToCooldown = () => {
        setIsMainWorkoutFinished(false);
        const firstCooldownIndex = currentFlow.findIndex((step) => step.type === 'cooldown');
        if (firstCooldownIndex !== -1) {
            setCurrentStepIndex(firstCooldownIndex);
            return;
        }

        handleFinishWorkout();
    };

    const handleSelectExerciseToAdd = (exercise: Exercise) => {
        setShowAddExerciseModal(false);
        setExerciseToAdd(exercise);
    };

    const handleSetSelection = (numberOfSets: number) => {
        if (!exerciseToAdd) return;

        let newStep: RoutineStep;
        if (exerciseToAdd.category === 'fuerza') {
            newStep = {
                type: 'exercise',
                exerciseId: exerciseToAdd.id,
                title: exerciseToAdd.name,
                sets: numberOfSets,
                reps: '8-12',
                rir: '1',
                rest: 60,
            };
        } else if (exerciseToAdd.category === 'yoga' || exerciseToAdd.category === 'postura') {
            newStep = {
                type: 'pose',
                exerciseId: exerciseToAdd.id,
                title: exerciseToAdd.name,
                duration: 60,
            };
        } else {
            setExerciseToAdd(null);
            return;
        }

        const firstCooldownIndex = currentFlow.findIndex((step) => step.type === 'cooldown');
        const insertionIndex = firstCooldownIndex !== -1 ? firstCooldownIndex : currentFlow.length;

        const newFlow = [...currentFlow];
        newFlow.splice(insertionIndex, 0, newStep);
        setCurrentFlow(newFlow);

        if (isMainWorkoutFinished) {
            setCurrentStepIndex(insertionIndex);
        }

        setIsMainWorkoutFinished(false);
        setExerciseToAdd(null);
    };

    const handleShowExerciseDetails = (exerciseId: string) => {
        const exercise = allExercises[exerciseId];
        if (exercise) {
            setExerciseToShowDetails(exercise);
        }
    };

    const currentExerciseId = useMemo(() => {
        const stepForBg = isResting ? (advanceAfterRest ? nextStep : currentStep) : currentStep;

        if (!stepForBg) return undefined;
        if ('exerciseId' in stepForBg) return stepForBg.exerciseId;
        if (stepForBg.type === 'warmup' || stepForBg.type === 'cooldown') {
            const infoStep = stepForBg as InfoStep;
            return infoStep.items[0]?.exerciseId;
        }

        return undefined;
    }, [advanceAfterRest, currentStep, currentStepIndex, isResting, nextStep]);

    const bgExercise = currentExerciseId ? allExercises[currentExerciseId] : undefined;

    return (
        <div className="fixed inset-0 z-50 flex h-[100dvh] flex-col bg-bg-base font-sans text-text-primary">
            <div className="pointer-events-none absolute inset-0 z-0">
                <ImmersiveBackground exercise={bgExercise} />
                <div className="absolute inset-0 bg-bg-base/90 backdrop-blur-[8px]" />
            </div>

            {showConfirmExit && (
                <Modal onClose={() => setShowConfirmExit(false)}>
                    <div className="p-6 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-accent/10">
                            <svg className="h-8 w-8 text-brand-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 8v4l3 3" />
                                <path d="M12 22a10 10 0 1 0-10-10" />
                            </svg>
                        </div>
                        <h2 className="mb-2 text-xl font-bold text-text-primary">Terminar entrenamiento?</h2>
                        <p className="mb-6 text-sm text-text-secondary">
                            Has completado <strong>{workoutStats.exercisesCompleted}</strong> ejercicios. <br />
                            Si terminas ahora, se guardara todo tu progreso actual en el historial.
                        </p>

                        <div className="flex flex-col gap-3">
                            <button
                                type="button"
                                onClick={() => { setShowConfirmExit(false); handleFinishWorkout(); }}
                                className="w-full rounded-2xl bg-brand-accent px-4 py-4 text-base font-bold text-black transition-all hover:brightness-105"
                            >
                                Terminar y guardar progreso
                            </button>
                            <button
                                type="button"
                                onClick={() => { dispatch(actions.exitRoutine()); setShowConfirmExit(false); }}
                                className="w-full rounded-2xl border border-danger/20 bg-danger/10 px-4 py-4 text-sm font-bold text-danger transition-colors hover:bg-danger/15"
                            >
                                Salir sin guardar
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowConfirmExit(false)}
                                className="w-full text-xs font-bold uppercase tracking-widest text-text-secondary"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {showConfirmSkip && (
                <ConfirmationDialog
                    title="Saltar paso"
                    message="No se guardara el progreso de este ejercicio."
                    onConfirm={handleSkipStep}
                    onCancel={() => setShowConfirmSkip(false)}
                    confirmText="Saltar"
                />
            )}

            {showAddExerciseModal && <AddExerciseModal onSelect={handleSelectExerciseToAdd} onClose={() => setShowAddExerciseModal(false)} />}
            {exerciseToAdd && <SetSelectorModal onSelect={handleSetSelection} onClose={() => setExerciseToAdd(null)} />}
            {exerciseToShowDetails && <ExerciseDetailSheet exercise={exerciseToShowDetails} onClose={() => setExerciseToShowDetails(null)} />}

            {isStarted && !isMainWorkoutFinished && (
                <RoutineSessionHeader
                    globalTime={globalTime}
                    isResting={isResting}
                    onSkip={() => setShowConfirmSkip(true)}
                    onExit={() => setShowConfirmExit(true)}
                />
            )}

            <main className="relative z-10 mx-auto flex h-full w-full max-w-3xl flex-grow flex-col overflow-hidden">
                {!isStarted ? (
                    <RoutinePreStartView
                        activeRoutine={activeRoutine}
                        allExercises={allExercises}
                        onStart={() => setIsStarted(true)}
                        onBack={() => dispatch(actions.exitRoutine())}
                    />
                ) : (
                    <RoutineStepRenderer
                        activeRoutine={activeRoutine}
                        allExercises={allExercises}
                        cardioWeek={cardioWeek}
                        currentFlow={currentFlow}
                        currentStep={currentStep}
                        currentStepIndex={currentStepIndex}
                        isMainWorkoutFinished={isMainWorkoutFinished}
                        isResting={isResting}
                        advanceAfterRest={advanceAfterRest}
                        nextStep={nextStep}
                        restDuration={restDuration}
                        maxRestDuration={maxRestDuration}
                        loggedSetsForCurrentStep={loggedSetsForCurrentStep}
                        workoutStats={workoutStats}
                        onAddExercise={() => setShowAddExerciseModal(true)}
                        onFinishWorkout={handleFinishWorkout}
                        onHandleRestComplete={handleRestComplete}
                        onHandleSetComplete={handleSetComplete}
                        onHandleSkipStep={handleSkipStep}
                        onHandleStepComplete={handleAdvanceStep}
                        onHandleProceedToCooldown={handleProceedToCooldown}
                        onShowExerciseDetails={handleShowExerciseDetails}
                    />
                )}
            </main>
        </div>
    );
};

export default RutinaActivaScreen;
