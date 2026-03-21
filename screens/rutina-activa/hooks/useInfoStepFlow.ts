import { useEffect, useRef, useState } from 'react';
import { Exercise, InfoStep } from '../../../types';
import { vibrate } from '../../../utils/helpers';

export const INFO_STEP_DURATION = 60;

interface UseInfoStepFlowArgs {
    step: InfoStep;
    allExercises: Record<string, Exercise>;
    onComplete: () => void;
    potentiateExerciseName?: string;
}

export const useInfoStepFlow = ({
    step,
    allExercises,
    onComplete,
    potentiateExerciseName,
}: UseInfoStepFlowArgs) => {
    const [currentItemIndex, setCurrentItemIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(INFO_STEP_DURATION);
    const [showPotentiationInfo, setShowPotentiationInfo] = useState(false);
    const hasVibratedRef = useRef<Record<number, boolean>>({});

    useEffect(() => {
        setCurrentItemIndex(0);
        setTimeLeft(INFO_STEP_DURATION);
        setShowPotentiationInfo(false);
        hasVibratedRef.current = {};
    }, [step]);

    const currentItem = step.items[currentItemIndex];
    const currentExercise = currentItem?.exerciseId ? allExercises[currentItem.exerciseId] ?? null : null;
    const isWarmup = step.type === 'warmup';
    const currentItemReps = currentItem?.reps;

    useEffect(() => {
        if (!currentExercise) {
            onComplete();
        }
    }, [currentExercise, onComplete]);

    const advanceToNextItem = () => {
        hasVibratedRef.current = {};

        if (currentItemIndex < step.items.length - 1) {
            setCurrentItemIndex((value) => value + 1);
            setTimeLeft(INFO_STEP_DURATION);
            return;
        }

        if (potentiateExerciseName) {
            setShowPotentiationInfo(true);
        } else {
            onComplete();
        }
    };

    const handleTimerTick = (remaining: number) => {
        setTimeLeft(remaining);

        if (remaining <= 3 && remaining > 0 && !hasVibratedRef.current[remaining]) {
            vibrate(50);
            hasVibratedRef.current[remaining] = true;
        }

        if (remaining <= 0) {
            vibrate([100, 50, 100]);
            setTimeout(advanceToNextItem, 0);
        }
    };

    return {
        currentItemIndex,
        currentExercise,
        currentItemReps,
        handleTimerTick,
        isWarmup,
        showPotentiationInfo,
        timeLeft,
        advanceToNextItem,
        setShowPotentiationInfo,
    };
};
