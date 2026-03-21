import React, { useContext } from 'react';
import { InfoStep } from '../../types';
import { AppContext } from '../../contexts';
import { selectAllExercises } from '../../selectors/workoutSelectors';
import { useInfoStepFlow } from './hooks/useInfoStepFlow';
import InfoStepScreenView from './flow/InfoStepScreenView';

interface InfoStepScreenProps {
    step: InfoStep;
    onComplete: () => void;
    onSkipAll: () => void;
    onShowExerciseDetails: (exerciseId: string) => void;
    potentiateExerciseName?: string;
}

const InfoStepScreen: React.FC<InfoStepScreenProps> = ({ step, onComplete, onSkipAll, onShowExerciseDetails, potentiateExerciseName }) => {
    const { state } = useContext(AppContext)!;
    const allExercises = selectAllExercises(state);

    const flow = useInfoStepFlow({
        step,
        allExercises,
        onComplete,
        potentiateExerciseName,
    });

    if (!flow.currentExercise) {
        return <div className="flex h-full items-center justify-center text-text-muted">Cargando...</div>;
    }

    return (
        <InfoStepScreenView
            currentItemIndex={flow.currentItemIndex}
            currentItemReps={flow.currentItemReps}
            currentExercise={flow.currentExercise}
            isWarmup={flow.isWarmup}
            onAdvance={flow.advanceToNextItem}
            onShowExerciseDetails={() => onShowExerciseDetails(flow.currentExercise.id)}
            onSkipAll={onSkipAll}
            onTimerTick={flow.handleTimerTick}
            potentiateExerciseName={potentiateExerciseName}
            showPotentiationInfo={flow.showPotentiationInfo}
            timeLeft={flow.timeLeft}
            totalItems={step.items.length}
        />
    );
};

export default InfoStepScreen;
