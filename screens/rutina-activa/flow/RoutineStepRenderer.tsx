import React from 'react';
import { Exercise, LoggedSet, RoutineStep, RoutineTask, WorkoutStats } from '../../../types';
import CardioScreen from '../CardioScreen';
import FuerzaScreen from '../FuerzaScreen';
import InfoStepScreen from '../InfoStepScreen';
import PostRoutineScreen from '../PostRoutineScreen';
import PoseScreen from '../PoseScreen';
import RestoScreen from '../RestoScreen';

interface RoutineStepRendererProps {
    activeRoutine: RoutineTask;
    allExercises: Record<string, Exercise>;
    cardioWeek: number;
    currentFlow: RoutineStep[];
    currentStep?: RoutineStep;
    currentStepIndex: number;
    isMainWorkoutFinished: boolean;
    isResting: boolean;
    advanceAfterRest: boolean;
    nextStep?: RoutineStep;
    restDuration: number;
    maxRestDuration?: number;
    loggedSetsForCurrentStep: LoggedSet[];
    workoutStats: WorkoutStats;
    onAddExercise: () => void;
    onFinishWorkout: () => void;
    onHandleRestComplete: () => void;
    onHandleSetComplete: (setLog: LoggedSet) => void;
    onHandleSkipStep: () => void;
    onHandleStepComplete: () => void;
    onHandleProceedToCooldown: () => void;
    onShowExerciseDetails: (exerciseId: string) => void;
}

const RoutineStepRenderer: React.FC<RoutineStepRendererProps> = ({
    activeRoutine,
    allExercises,
    cardioWeek,
    currentFlow,
    currentStep,
    currentStepIndex,
    isMainWorkoutFinished,
    isResting,
    advanceAfterRest,
    nextStep,
    restDuration,
    maxRestDuration,
    loggedSetsForCurrentStep,
    workoutStats,
    onAddExercise,
    onFinishWorkout,
    onHandleRestComplete,
    onHandleSetComplete,
    onHandleSkipStep,
    onHandleStepComplete,
    onHandleProceedToCooldown,
    onShowExerciseDetails,
}) => {
    const hasCooldown = currentFlow.some((step) => step.type === 'cooldown');

    if (isMainWorkoutFinished) {
        return (
            <PostRoutineScreen
                onFinish={onHandleProceedToCooldown}
                onAddExercise={onAddExercise}
                stats={workoutStats}
                finishButtonText={hasCooldown ? 'Ir al Enfriamiento' : 'Finalizar y Ver Resumen'}
            />
        );
    }

    if (activeRoutine.type === 'cardio') {
        return <CardioScreen cardioWeek={cardioWeek} onComplete={onFinishWorkout} />;
    }

    if (isResting) {
        const nextUpStep = advanceAfterRest ? nextStep : currentStep;
        return (
            <RestoScreen
                duration={restDuration}
                maxDuration={maxRestDuration}
                onComplete={onHandleRestComplete}
                nextStep={nextUpStep}
            />
        );
    }

    if (!currentStep) return null;

    switch (currentStep.type) {
        case 'warmup': {
            const firstStrengthStep = currentFlow.slice(currentStepIndex + 1).find((step) => step.type === 'exercise') as RoutineStep | undefined;
            const potentiateExerciseName = firstStrengthStep && firstStrengthStep.type === 'exercise'
                ? allExercises[firstStrengthStep.exerciseId]?.name
                : undefined;

            return (
                <InfoStepScreen
                    step={currentStep}
                    onComplete={onHandleStepComplete}
                    onSkipAll={onHandleSkipStep}
                    onShowExerciseDetails={onShowExerciseDetails}
                    potentiateExerciseName={potentiateExerciseName}
                />
            );
        }
        case 'cooldown':
            return (
                <InfoStepScreen
                    step={currentStep}
                    onComplete={onHandleStepComplete}
                    onSkipAll={onHandleSkipStep}
                    onShowExerciseDetails={onShowExerciseDetails}
                />
            );
        case 'exercise':
            return (
                <FuerzaScreen
                    step={currentStep}
                    onSetComplete={onHandleSetComplete}
                    loggedSets={loggedSetsForCurrentStep}
                    onShowExerciseDetails={() => onShowExerciseDetails(currentStep.exerciseId)}
                    nextStep={nextStep}
                />
            );
        case 'pose':
        case 'meditation':
            return (
                <PoseScreen
                    step={currentStep}
                    onComplete={onHandleStepComplete}
                    onShowExerciseDetails={() => onShowExerciseDetails((currentStep as any).exerciseId)}
                />
            );
        default:
            return <p>Paso desconocido.</p>;
    }
};

export default RoutineStepRenderer;
