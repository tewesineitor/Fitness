import { Dispatch, SetStateAction, useEffect } from 'react';
import { RoutineStep, WorkoutStats } from '../../../types';

interface UseRoutineTimersArgs {
    isStarted: boolean;
    isResting: boolean;
    isMainWorkoutFinished: boolean;
    currentStep?: RoutineStep;
    setGlobalTime: Dispatch<SetStateAction<number>>;
    setWorkoutStats: Dispatch<SetStateAction<WorkoutStats>>;
}

export const useRoutineTimers = ({
    isStarted,
    isResting,
    isMainWorkoutFinished,
    currentStep,
    setGlobalTime,
    setWorkoutStats,
}: UseRoutineTimersArgs) => {
    useEffect(() => {
        if (!isStarted) return;

        const timer = window.setInterval(() => {
            setGlobalTime((prev) => prev + 1);
        }, 1000);

        return () => window.clearInterval(timer);
    }, [isStarted, setGlobalTime]);

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
                setWorkoutStats((prev) => {
                    const stepKey = currentStep.type === 'exercise' ? currentStep.exerciseId : currentStep.title;
                    const newDurations = { ...prev.exerciseDurations };
                    newDurations[stepKey] = (newDurations[stepKey] || 0) + 1;
                    return { ...prev, exerciseDurations: newDurations };
                });
            }, 1000);
        }

        return () => {
            if (timerId) window.clearInterval(timerId);
        };
    }, [currentStep, isMainWorkoutFinished, isResting, isStarted, setWorkoutStats]);
};
