import React, { useContext, useState, useEffect, useRef } from 'react';
import { YogaStep, MeditationStep } from '../../types';
import CircularTimer from '../../components/CircularTimer';
import { InformationCircleIcon, YogaIcon, MeditationIcon } from '../../components/icons';
import { AppContext } from '../../contexts';
import { selectAllExercises } from '../../selectors/workoutSelectors';
import Button from '../../components/Button';

interface PoseScreenProps {
  step: YogaStep | MeditationStep;
  onComplete: () => void;
  onShowExerciseDetails: () => void;
}

const PoseScreen: React.FC<PoseScreenProps> = ({ step, onComplete, onShowExerciseDetails }) => {
  const { state } = useContext(AppContext)!;
  const allExercises = selectAllExercises(state);
  
  const exercise = 'exerciseId' in step ? allExercises[step.exerciseId] : null;
  const canShowDetails = !!exercise;
  const subtitle = step.type === 'pose' ? 'Mantén la postura' : 'Concéntrate en tu respiración';

  // FIX: Add state and logic to manage the timer countdown.
  const [timeLeft, setTimeLeft] = useState(step.duration);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Reset timer if step duration changes
  useEffect(() => {
    setTimeLeft(step.duration);
  }, [step.duration]);

  // Timer logic
  useEffect(() => {
    if (timeLeft <= 0) {
      setTimeout(() => onCompleteRef.current(), 0);
      return;
    }

    const timerId = window.setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timerId);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [timeLeft]);

  const Icon = step.type === 'pose' ? YogaIcon : MeditationIcon;

  return (
    <div className="flex flex-col items-center text-center w-full h-full px-4 py-6 animate-pop-in">
        <div className="flex-grow flex flex-col items-center justify-center overflow-y-auto hide-scrollbar w-full">
            <div className="inline-flex items-center gap-3 mb-4">
                <div className="p-3 bg-surface-bg rounded-full">
                    <Icon className="w-8 h-8 text-brand-accent" />
                </div>
            </div>
            <button 
                onClick={onShowExerciseDetails}
                disabled={!canShowDetails}
                className="group flex items-center justify-center gap-2 text-center w-full mb-2 py-2 rounded-lg transition-colors hover:bg-surface-bg disabled:hover:bg-transparent"
            >
                <h2 className="text-3xl font-bold transition-colors group-hover:text-brand-accent">{step.title}</h2>
                {canShowDetails && <InformationCircleIcon className="w-6 h-6 text-text-secondary transition-colors group-hover:text-brand-accent" />}
            </button>
            <p className="text-text-secondary mb-8">{subtitle}</p>
        </div>
        
        <div className="flex-shrink-0 w-full flex justify-center pb-safe">
             <CircularTimer initialDuration={step.duration} timeLeft={timeLeft} />
        </div>
    </div>
  );
};

export default PoseScreen;