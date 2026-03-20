
import React, { useContext } from 'react';
import { RoutineStep } from '../types';
import { AppContext } from '../contexts';
import { selectAllExercises } from '../selectors/workoutSelectors';
import { ChevronRightIcon } from './icons';

interface NextUpIndicatorProps {
  step?: RoutineStep;
}

const NextUpIndicator: React.FC<NextUpIndicatorProps> = ({ step }) => {
  const { state } = useContext(AppContext)!;
  const allExercises = selectAllExercises(state);

  if (!step) {
    return (
      <div className="bg-transparent p-4 rounded-2xl border border-dashed border-surface-border text-center">
        <p className="font-bold text-text-secondary text-xs uppercase tracking-widest">¡Último Ejercicio!</p>
      </div>
    );
  }

  let title = step.title;
  let exerciseId: string | undefined;

  if ('exerciseId' in step) {
    exerciseId = step.exerciseId;
  } else if (step.type === 'warmup' || step.type === 'cooldown') {
    exerciseId = step.items[0]?.exerciseId;
  }

  const exercise = exerciseId ? allExercises[exerciseId] : null;

  return (
    <div className="bg-surface-bg p-2 pr-4 rounded-2xl flex items-center justify-between animate-fade-in-up border border-surface-border shadow-sm hover:bg-surface-hover hover:border-brand-accent/30 transition-colors group">
      <div className="flex items-center gap-4">
        {exercise?.gifUrl ? (
          <img src={exercise.gifUrl} alt="" className="w-14 h-14 rounded-xl object-cover bg-surface-bg border border-surface-border grayscale group-hover:grayscale-0 transition-all" />
        ) : (
            <div className="w-14 h-14 rounded-xl bg-surface-bg border border-surface-border"></div>
        )}
        <div className="text-left">
          <p className="text-[9px] font-bold text-text-secondary uppercase tracking-widest mb-0.5">A continuación</p>
          <p className="font-bold text-white text-sm leading-tight line-clamp-1 group-hover:text-brand-accent transition-colors">{title}</p>
        </div>
      </div>
      <ChevronRightIcon className="w-5 h-5 text-text-secondary group-hover:translate-x-1 transition-transform" />
    </div>
  );
};

export default NextUpIndicator;
