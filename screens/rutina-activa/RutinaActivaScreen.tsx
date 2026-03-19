
import React, { useState, useEffect, useContext, useMemo } from 'react';
import { AppContext } from '../../contexts';
import { RoutineTask, WorkoutStats, RoutineStep, StrengthStep, LoggedSet, Exercise, YogaStep, MeditationStep, InfoStep } from '../../types';
import * as thunks from '../../thunks';
import * as actions from '../../actions';
import { selectAllExercises, selectCardioWeek } from '../../selectors/workoutSelectors';
import { cacoMethodData } from '../../data';
import { useWakeLock } from '../../hooks/useWakeLock';

import ImmersiveBackground from '../../components/ImmersiveBackground';
import Button from '../../components/Button';
import InfoStepScreen from './InfoStepScreen';
import FuerzaScreen from './FuerzaScreen';
import RestoScreen from './RestoScreen';
import PoseScreen from './PoseScreen';
import CardioScreen from './CardioScreen';
import ConfirmationDialog from '../../components/dialogs/ConfirmationDialog';
import PostRoutineScreen from './PostRoutineScreen';
import AddExerciseModal from './AddExerciseModal';
import ExerciseDetailSheet from './ExerciseDetailSheet';
import SetSelectorModal from '../../components/dialogs/SetSelectorModal';
import { StrengthIcon, ClockIcon, YogaIcon, CardioIcon, ChevronRightIcon, XIcon, SaveIcon } from '../../components/icons';
import { vibrate } from '../../utils/helpers';
import Modal from '../../components/Modal';

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

    // ACTIVATE WAKE LOCK when workout is started and not finished
    useWakeLock(isStarted && !isMainWorkoutFinished);

    const [workoutStats, setWorkoutStats] = useState<WorkoutStats>(activeRoutineProgress?.workoutStats ?? {
        exercisesCompleted: 0,
        duration: 0,
        weightLifted: 0,
        logs: {},
        exerciseDurations: {},
    });

    // Sync local state to global state for persistence
    useEffect(() => {
        if (isStarted) {
            dispatch(actions.updateActiveRoutineState({
                isStarted,
                currentFlow,
                currentStepIndex,
                globalTime,
                workoutStats
            }));
        }
    }, [isStarted, currentFlow, currentStepIndex, globalTime, workoutStats, dispatch]);

    useEffect(() => {
        if (!isStarted) return;
        const timer = window.setInterval(() => setGlobalTime(prev => prev + 1), 1000);
        return () => window.clearInterval(timer);
    }, [isStarted]);

    const currentStep = useMemo(() => currentFlow[currentStepIndex], [currentFlow, currentStepIndex]);
    const nextStep = useMemo(() => currentFlow[currentStepIndex + 1], [currentFlow, currentStepIndex]);
    
    const loggedSetsForCurrentStep = useMemo(() => {
        if (currentStep && currentStep.type === 'exercise') {
            return workoutStats.logs[currentStep.exerciseId] || [];
        }
        return []; 
    }, [currentStep, workoutStats.logs]);

    useEffect(() => {
        let timerId: number | undefined;

        const isExerciseActive = 
            isStarted &&
            !isResting && 
            !isMainWorkoutFinished && 
            currentStep &&
            (currentStep.type === 'exercise' || currentStep.type === 'pose' || currentStep.type === 'meditation');

        if (isExerciseActive) {
            timerId = window.setInterval(() => {
                setWorkoutStats(prev => {
                    const stepKey = (currentStep as StrengthStep | YogaStep).exerciseId || (currentStep as MeditationStep).title;
                    const newDurations = { ...prev.exerciseDurations };
                    newDurations[stepKey] = (newDurations[stepKey] || 0) + 1;
                    return { ...prev, exerciseDurations: newDurations };
                });
            }, 1000);
        }

        return () => {
            if (timerId) window.clearInterval(timerId);
        };
    }, [isStarted, isResting, isMainWorkoutFinished, currentStep]);

    const advanceToNextStep = () => {
        const firstCooldownIndex = currentFlow.findIndex(step => step.type === 'cooldown');
        const isLastMainStep = (firstCooldownIndex !== -1 && currentStepIndex === firstCooldownIndex - 1) || (firstCooldownIndex === -1 && currentStepIndex === currentFlow.length - 1);

        if (isLastMainStep && !isMainWorkoutFinished) {
            setIsMainWorkoutFinished(true);
        } else if (currentStepIndex < currentFlow.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
        } else {
            handleFinishWorkout();
        }
    };
    
    const handleSkipStep = () => {
        if (currentStep && currentStep.type === 'exercise') {
            const exerciseId = currentStep.exerciseId;
            setWorkoutStats(prev => {
                const newLogs = { ...prev.logs };
                delete newLogs[exerciseId];
                return { ...prev, logs: newLogs };
            });
        }
        
        // Reset resting state if skipping during rest
        setIsResting(false);
        setAdvanceAfterRest(false);
        
        advanceToNextStep();
        setShowConfirmSkip(false);
    };

    const handleStepComplete = () => {
        advanceToNextStep();
    };
    
    const handleRestComplete = () => {
        setIsResting(false);
        if (advanceAfterRest) {
            setAdvanceAfterRest(false);
            advanceToNextStep();
        }
    };

    const handleSetComplete = (setLog: LoggedSet) => {
        const step = currentStep as StrengthStep;
        const exerciseId = step.exerciseId;
        const currentLogs = workoutStats.logs[exerciseId] || [];
        const newLogs = [...currentLogs, setLog];

        setWorkoutStats(prev => ({
            ...prev,
            logs: { ...prev.logs, [exerciseId]: newLogs },
            weightLifted: prev.weightLifted + (setLog.weight * setLog.reps),
            exercisesCompleted: Object.keys(prev.logs).length
        }));

        const isLastSet = newLogs.length >= step.sets;
        
        setAdvanceAfterRest(isLastSet);
        setRestDuration(step.rest);
        setMaxRestDuration(step.restMax);
        setIsResting(true);
    };
    
    const handleFinishWorkout = () => {
        const finalStats = { ...workoutStats, duration: globalTime };
        dispatch(thunks.finishRoutineThunk({ ...activeRoutine, flow: currentFlow }, finalStats));
        setShowConfirmExit(false);
    };
    
    const handleProceedToCooldown = () => {
        setIsMainWorkoutFinished(false);
        const firstCooldownIndex = currentFlow.findIndex(step => step.type === 'cooldown');
        if (firstCooldownIndex !== -1) {
            setCurrentStepIndex(firstCooldownIndex);
        } else {
            handleFinishWorkout();
        }
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
                rest: 60
            };
        } else if (exerciseToAdd.category === 'yoga' || exerciseToAdd.category === 'postura') {
            newStep = { type: 'pose', exerciseId: exerciseToAdd.id, title: exerciseToAdd.name, duration: 60 };
        } else {
            setExerciseToAdd(null);
            return;
        }
        
        const firstCooldownIndex = currentFlow.findIndex(step => step.type === 'cooldown');
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

    const renderCurrentStep = () => {
        const hasCooldown = currentFlow.some(step => step.type === 'cooldown');

        if (isMainWorkoutFinished) {
            return <PostRoutineScreen
                onFinish={handleProceedToCooldown}
                onAddExercise={() => setShowAddExerciseModal(true)}
                stats={workoutStats}
                finishButtonText={hasCooldown ? "Ir al Enfriamiento" : "Finalizar y Ver Resumen"}
            />;
        }

        if (activeRoutine.type === 'cardio') {
            return <CardioScreen cardioWeek={cardioWeek} onComplete={handleFinishWorkout} />;
        }

        if (isResting) {
            const nextUpStep = advanceAfterRest ? nextStep : currentStep;
            return <RestoScreen 
                duration={restDuration}
                maxDuration={maxRestDuration}
                onComplete={handleRestComplete}
                nextStep={nextUpStep}
            />;
        }

        if (!currentStep) return null;

        switch (currentStep.type) {
            case 'warmup':
                const firstStrengthStep = currentFlow.slice(currentStepIndex + 1).find(step => step.type === 'exercise') as StrengthStep | undefined;
                const potentiateExerciseName = firstStrengthStep ? allExercises[firstStrengthStep.exerciseId]?.name : undefined;
                return <InfoStepScreen 
                            step={currentStep} 
                            onComplete={handleStepComplete} 
                            onSkipAll={handleSkipStep} 
                            onShowExerciseDetails={handleShowExerciseDetails}
                            potentiateExerciseName={potentiateExerciseName}
                        />;
            case 'cooldown':
                return <InfoStepScreen step={currentStep} onComplete={handleStepComplete} onSkipAll={handleSkipStep} onShowExerciseDetails={handleShowExerciseDetails} />;
            case 'exercise':
                return <FuerzaScreen 
                            step={currentStep} 
                            onSetComplete={handleSetComplete} 
                            loggedSets={loggedSetsForCurrentStep}
                            onShowExerciseDetails={() => handleShowExerciseDetails(currentStep.exerciseId)}
                            nextStep={nextStep}
                        />;
            case 'pose':
            case 'meditation':
                return <PoseScreen 
                            step={currentStep} 
                            onComplete={handleStepComplete}
                            onShowExerciseDetails={() => handleShowExerciseDetails((currentStep as YogaStep).exerciseId)}
                        />;
            default:
                return <p>Paso desconocido.</p>;
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
    }, [currentStep, nextStep, isResting, advanceAfterRest, currentStepIndex]);

    const bgExercise = currentExerciseId ? allExercises[currentExerciseId] : undefined;

    // Pre-start view
    const renderPreStart = () => (
        <div className="flex-grow w-full overflow-y-auto hide-scrollbar">
            <div className="flex flex-col items-center justify-center min-h-full px-6 py-12 text-center animate-fade-in-up max-w-3xl mx-auto">
                <div className="bg-brand-accent/10 p-8 rounded-full mb-8 border border-brand-accent/20 shadow-[0_0_40px_rgba(var(--color-brand-accent-rgb),0.2)]">
                    <StrengthIcon className="w-20 h-20 text-brand-accent" />
                </div>
                <h1 className="text-4xl font-black text-white uppercase tracking-tight mb-4">{activeRoutine.name}</h1>
                <p className="text-text-secondary text-sm mb-8 max-w-xs mx-auto">
                    {activeRoutine.flow.length} bloques programados. <br/>Asegúrate de tener tu equipo listo.
                </p>

                {/* Staggered Exercise List */}
                <div className="w-full max-w-sm space-y-2 mb-8 text-left max-h-[40vh] overflow-y-auto hide-scrollbar pr-2">
                    {activeRoutine.flow.map((step, index) => {
                        if (step.type !== 'exercise') return null;
                        const exercise = allExercises[step.exerciseId];
                        if (!exercise) return null;
                        return (
                            <div 
                                key={index} 
                                className="flex items-center gap-3 p-3 bg-surface-bg/50 rounded-xl border border-surface-border animate-fade-in-up backdrop-blur-sm shadow-sm"
                                style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
                            >
                                <div className="w-10 h-10 rounded-lg bg-surface-hover flex items-center justify-center text-brand-accent flex-shrink-0 border border-surface-border">
                                    <StrengthIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white leading-tight line-clamp-1">{exercise.name}</p>
                                    <p className="text-[10px] text-text-secondary uppercase tracking-wider">{step.sets} Series x {step.reps}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* UPDATED BUTTON to use high-contrast variant */}
                <Button 
                    variant="high-contrast"
                    onClick={() => { vibrate(10); setIsStarted(true); }} 
                    className="w-full max-w-xs py-5 rounded-full"
                >
                    Comenzar Rutina
                </Button>
                <Button 
                    variant="tertiary" 
                    onClick={() => { vibrate(5); dispatch(actions.exitRoutine()); }} 
                    className="mt-4 !text-xs !p-2 !bg-transparent hover:!bg-white/5 text-text-secondary hover:text-white"
                >
                    Cancelar
                </Button>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-black text-text-primary font-sans h-[100dvh]">
            {/* Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <ImmersiveBackground exercise={bgExercise} />
                <div className="absolute inset-0 bg-black/70 backdrop-blur-[4px]"></div>
            </div>

            {/* Modals */}
            {showConfirmExit && (
                <Modal onClose={() => setShowConfirmExit(false)}>
                    <div className="p-6 text-center">
                        <div className="mx-auto bg-brand-accent/10 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                            <SaveIcon className="w-8 h-8 text-brand-accent" />
                        </div>
                        <h2 className="text-xl font-bold text-text-primary mb-2">¿Terminar entrenamiento?</h2>
                        <p className="text-text-secondary mb-6 text-sm">
                            Has completado <strong>{workoutStats.exercisesCompleted}</strong> ejercicios. <br/>
                            Si terminas ahora, se guardará todo tu progreso actual en el historial.
                        </p>
                        
                        <div className="flex flex-col gap-3">
                            <Button 
                                variant="primary" 
                                onClick={() => { vibrate(10); handleFinishWorkout(); }} 
                                className="w-full py-4 text-base shadow-lg shadow-brand-accent/20"
                            >
                                Terminar y Guardar Progreso
                            </Button>
                            
                            <Button 
                                variant="destructive" 
                                onClick={() => { vibrate(10); dispatch(actions.exitRoutine()); setShowConfirmExit(false); }} 
                                className="w-full bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20"
                            >
                                Salir sin guardar (Descartar)
                            </Button>

                            <Button 
                                variant="tertiary" 
                                onClick={() => setShowConfirmExit(false)} 
                                className="w-full text-xs text-text-secondary"
                            >
                                Cancelar y volver a la rutina
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
            {showConfirmSkip && <ConfirmationDialog title="Saltar Paso" message="No se guardará el progreso de este ejercicio." onConfirm={handleSkipStep} onCancel={() => setShowConfirmSkip(false)} confirmText="Saltar" />}
            {showAddExerciseModal && <AddExerciseModal onSelect={handleSelectExerciseToAdd} onClose={() => setShowAddExerciseModal(false)} />}
            {exerciseToAdd && <SetSelectorModal onSelect={handleSetSelection} onClose={() => setExerciseToAdd(null)} />}
            {exerciseToShowDetails && <ExerciseDetailSheet exercise={exerciseToShowDetails} onClose={() => setExerciseToShowDetails(null)} />}
            
            {/* Header (Only active during workout) */}
            {isStarted && !isMainWorkoutFinished && (
                <header className="relative z-30 flex items-center justify-between px-6 pt-6 pb-2 max-w-3xl mx-auto w-full">
                    {/* Time */}
                    <div className="flex items-center gap-2 bg-surface-bg/80 border border-surface-border rounded-full px-4 py-2 backdrop-blur-md shadow-sm">
                        <div className={`w-2 h-2 rounded-full ${isResting ? 'bg-brand-accent animate-pulse' : 'bg-green-400'}`}></div>
                        <span className="font-mono text-sm font-bold text-white tabular-nums">
                            {new Date(globalTime * 1000).toISOString().substr(14, 5)}
                        </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <Button 
                            variant="secondary" 
                            size="small" 
                            onClick={() => setShowConfirmSkip(true)} 
                            className="!w-10 !h-10 !p-0 rounded-full bg-surface-bg/80 border-surface-border"
                            icon={ChevronRightIcon}
                        />
                        <Button 
                            variant="destructive" 
                            size="small" 
                            onClick={() => setShowConfirmExit(true)} 
                            className="!w-10 !h-10 !p-0 rounded-full bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
                            icon={XIcon}
                        />
                    </div>
                </header>
            )}
            
            {/* Main Content */}
            <main className="flex-grow relative z-10 flex flex-col h-full overflow-hidden max-w-3xl mx-auto w-full">
                {!isStarted ? renderPreStart() : (
                    <div className="w-full h-full flex flex-col">
                        {renderCurrentStep()}
                    </div>
                )}
            </main>
        </div>
    );
};

export default RutinaActivaScreen;
