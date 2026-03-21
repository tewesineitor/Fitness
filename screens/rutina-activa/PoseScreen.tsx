import React, { useContext, useEffect, useRef, useState } from 'react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import CircularTimer from '../../components/CircularTimer';
import Tag from '../../components/Tag';
import ImmersiveFocusShell from '../../components/layout/ImmersiveFocusShell';
import { InformationCircleIcon, MeditationIcon, YogaIcon } from '../../components/icons';
import { AppContext } from '../../contexts';
import { selectAllExercises } from '../../selectors/workoutSelectors';
import type { MeditationStep, YogaStep } from '../../types';

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
  const subtitle = step.type === 'pose' ? 'Manten la postura con respiracion estable.' : 'Mantente presente y regula la respiracion.';

  const [timeLeft, setTimeLeft] = useState(step.duration);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    setTimeLeft(step.duration);
  }, [step.duration]);

  useEffect(() => {
    if (timeLeft <= 0) {
      setTimeout(() => onCompleteRef.current(), 0);
      return;
    }

    const timerId = window.setInterval(() => {
      setTimeLeft((prevTime) => {
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
  const tone = step.type === 'pose' ? 'accent' : 'protein';

  return (
    <ImmersiveFocusShell contentClassName="py-8">
      <div className="mx-auto flex h-full max-w-md flex-col text-center">
          <div>
            <Tag variant="status" tone={tone} size="sm">
              {step.type === 'pose' ? 'Pose Hold' : 'Meditation'}
            </Tag>

            <div className="mt-5 flex justify-center">
              <div className="rounded-[1.5rem] border border-surface-border bg-surface-bg/80 p-5 shadow-sm">
                <Icon className="h-10 w-10 text-brand-accent" />
              </div>
            </div>

            <h2 className="mt-5 text-3xl font-black uppercase tracking-[-0.05em] text-text-primary">{step.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">{subtitle}</p>
          </div>

          <div className="my-auto py-8">
            <Card variant="glass" className="flex flex-col items-center gap-6 p-6 shadow-xl">
              <CircularTimer initialDuration={step.duration} timeLeft={timeLeft} size={240} strokeWidth={10} />
              <Button
                onClick={onShowExerciseDetails}
                disabled={!canShowDetails}
                variant="secondary"
                size="medium"
                icon={InformationCircleIcon}
                className="w-full"
              >
                Ver tecnica
              </Button>
            </Card>
          </div>
        </div>
    </ImmersiveFocusShell>
  );
};

export default PoseScreen;
