import React from 'react';
import Button from '../../../components/Button';
import Card from '../../../components/Card';
import CircularTimer from '../../../components/CircularTimer';
import Tag from '../../../components/Tag';
import { ChevronRightIcon, FireIcon, InformationCircleIcon, StrengthIcon, YogaIcon } from '../../../components/icons';
import type { Exercise } from '../../../types';
import { vibrate } from '../../../utils/helpers';
import { INFO_STEP_DURATION } from '../hooks/useInfoStepFlow';

interface PotentiationScreenProps {
  exerciseName: string;
  onStartWorkout: () => void;
}

export const PotentiationScreen: React.FC<PotentiationScreenProps> = ({ exerciseName, onStartWorkout }) => (
  <div className="relative flex h-full flex-col overflow-y-auto px-6 py-10 text-center hide-scrollbar">
    <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-brand-accent/12 to-transparent" />

    <div className="relative z-10 mx-auto flex h-full w-full max-w-md flex-col items-center justify-center">
      <Tag variant="status" tone="accent" size="sm">
        Potentiation
      </Tag>

      <div className="mt-8 rounded-[2rem] border border-brand-accent/20 bg-brand-accent/10 p-6 text-brand-accent shadow-xl">
        <StrengthIcon className="h-16 w-16" />
      </div>

      <h1 className="mt-8 text-4xl font-black uppercase tracking-[-0.06em] text-text-primary">Preparar</h1>
      <p className="mt-4 text-xl font-black uppercase tracking-[-0.03em] text-text-primary">{exerciseName}</p>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-text-secondary">
        Realiza 2-3 series con carga ligera para activar el patron antes de tu primera serie de trabajo.
      </p>

      <div className="mt-10 w-full">
        <Button
          variant="high-contrast"
          size="large"
          onClick={() => { vibrate(15); onStartWorkout(); }}
          className="w-full"
        >
          Comenzar set
        </Button>
      </div>
    </div>
  </div>
);

interface InfoStepScreenViewProps {
  currentItemIndex: number;
  currentItemReps?: string;
  currentExercise: Exercise;
  isWarmup: boolean;
  onAdvance: () => void;
  onShowExerciseDetails: () => void;
  onSkipAll: () => void;
  showPotentiationInfo: boolean;
  timeLeft: number;
  totalItems: number;
  onTimerTick: (remaining: number) => void;
  potentiateExerciseName?: string;
}

const InfoStepScreenView: React.FC<InfoStepScreenViewProps> = ({
  currentItemIndex,
  currentItemReps,
  currentExercise,
  isWarmup,
  onAdvance,
  onShowExerciseDetails,
  onSkipAll,
  showPotentiationInfo,
  timeLeft,
  totalItems,
  onTimerTick,
  potentiateExerciseName,
}) => {
  if (showPotentiationInfo && potentiateExerciseName) {
    return <PotentiationScreen exerciseName={potentiateExerciseName} onStartWorkout={onAdvance} />;
  }

  const Icon = isWarmup ? FireIcon : YogaIcon;
  const accentClass = isWarmup ? 'text-brand-fat' : 'text-brand-accent';
  const progressTone = isWarmup ? 'bg-brand-fat' : 'bg-brand-accent';
  const label = isWarmup ? 'Calentamiento' : 'Enfriamiento';
  const tagTone = isWarmup ? 'protein' : 'accent';

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-bg-base">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-brand-accent/10 to-transparent" />

      <div className="flex-1 overflow-y-auto px-6 pb-32 pt-8 hide-scrollbar">
        <div className="mx-auto flex h-full max-w-md flex-col">
          <div className="text-center">
            <Tag variant="status" tone={tagTone} size="sm" count={`${currentItemIndex + 1}/${totalItems}`}>
              {label}
            </Tag>
          </div>

          <div className="my-auto py-8">
            <Card variant="glass" className="space-y-6 p-6 text-center shadow-xl">
              <div className="flex justify-center">
                <div className="rounded-[1.4rem] border border-surface-border bg-surface-bg/80 p-4">
                  <Icon className={`h-8 w-8 ${accentClass}`} />
                </div>
              </div>

              <div className="flex justify-center">
                <CircularTimer
                  initialDuration={INFO_STEP_DURATION}
                  timeLeft={timeLeft}
                  strokeColor={accentClass}
                  size={220}
                  strokeWidth={8}
                  onTick={onTimerTick}
                />
              </div>

              <div>
                <h2 className="text-3xl font-black uppercase tracking-[-0.05em] text-text-primary">{currentExercise.name}</h2>
                {currentItemReps ? (
                  <div className="mt-3 flex justify-center">
                    <Tag variant="status" tone="neutral" size="sm">
                      {currentItemReps}
                    </Tag>
                  </div>
                ) : null}
              </div>

              <Button
                variant="secondary"
                size="medium"
                onClick={() => { vibrate(5); onShowExerciseDetails(); }}
                icon={InformationCircleIcon}
                className="w-full"
              >
                Ver tecnica
              </Button>
            </Card>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 border-t border-surface-border bg-bg-base px-6 pb-safe pt-5 shadow-[0_-8px_24px_-8px_rgba(0,0,0,0.08)]">
        <div className="mx-auto flex w-full max-w-md flex-col gap-4">
          <div className="flex h-2 w-full items-center gap-1 rounded-full border border-surface-border bg-surface-bg p-0.5">
            {Array.from({ length: totalItems }).map((_, index) => (
              <div key={index} className="relative h-full flex-1 overflow-hidden rounded-full bg-bg-base">
                {index <= currentItemIndex ? (
                  <div
                    className={`absolute inset-y-0 left-0 ${progressTone} ${index === currentItemIndex ? 'animate-progress-fill' : ''}`}
                    style={index === currentItemIndex ? { width: `${((INFO_STEP_DURATION - timeLeft) / INFO_STEP_DURATION) * 100}%` } : { width: '100%' }}
                  />
                ) : null}
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => { vibrate(5); onSkipAll(); }} className="flex-1">
              Saltar
            </Button>
            <Button
              variant="high-contrast"
              onClick={() => { vibrate(10); onAdvance(); }}
              icon={ChevronRightIcon}
              iconPosition="right"
              className="flex-[1.4]"
            >
              Siguiente
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoStepScreenView;
