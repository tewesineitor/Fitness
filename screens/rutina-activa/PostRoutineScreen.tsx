import React, { useEffect } from 'react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Tag from '../../components/Tag';
import { ChartBarIcon, FireIcon, PlusIcon, TrophyIcon } from '../../components/icons';
import type { WorkoutStats } from '../../types';
import { vibrate } from '../../utils/helpers';

interface PostRoutineScreenProps {
  onFinish: () => void;
  onAddExercise: () => void;
  stats: WorkoutStats;
  finishButtonText?: string;
}

const PostRoutineScreen: React.FC<PostRoutineScreenProps> = ({ onFinish, onAddExercise, stats, finishButtonText }) => {
  const totalVolume = stats.weightLifted;
  const exercisesDone = Object.keys(stats.logs).length;

  useEffect(() => {
    const timeout = setTimeout(() => {
      vibrate([100, 50, 100, 50, 200]);
    }, 300);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-bg-base">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-brand-accent/10 to-transparent" />

      <div className="flex-1 overflow-y-auto px-6 pb-36 pt-10 hide-scrollbar">
        <div className="mx-auto flex max-w-md flex-col items-center text-center">
          <Tag variant="status" tone="accent" size="sm">
            Session Complete
          </Tag>

          <div className="relative mt-8">
            <div className="absolute inset-0 rounded-full bg-brand-accent/20 blur-[60px]" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-[2rem] border border-brand-accent/20 bg-brand-accent/12 text-brand-accent shadow-xl">
              <TrophyIcon className="h-12 w-12" />
            </div>
          </div>

          <h1 className="mt-8 text-4xl font-black uppercase tracking-[-0.07em] text-text-primary">Mision cumplida</h1>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-text-secondary">
            La sesion quedo registrada. Revisa el resumen y decide si quieres sumar un extra antes de cerrar.
          </p>

          <div className="mt-8 grid w-full grid-cols-2 gap-3">
            <Card variant="accent" className="row-span-2 p-5 text-left">
              <div className="mb-5 inline-flex rounded-[1rem] border border-brand-accent/15 bg-brand-accent/10 p-3 text-brand-accent">
                <ChartBarIcon className="h-5 w-5" />
              </div>
              <p className="font-mono text-5xl font-black leading-none tracking-[-0.08em] text-text-primary">
                {(totalVolume / 1000).toFixed(1)}
              </p>
              <p className="mt-2 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">Toneladas movidas</p>
            </Card>

            <Card variant="default" className="p-5 text-left">
              <p className="font-mono text-4xl font-black leading-none tracking-[-0.06em] text-text-primary">{exercisesDone}</p>
              <p className="mt-2 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">Ejercicios</p>
            </Card>

            <Card variant="accent" className="flex items-center gap-3 p-5 text-left">
              <div className="rounded-full border border-brand-accent/15 bg-brand-accent/10 p-2 text-brand-accent">
                <FireIcon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-lg font-black uppercase tracking-[-0.04em] text-text-primary">Solida</p>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-accent">Intensidad</p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 border-t border-surface-border bg-bg-base px-6 pb-safe pt-5 shadow-[0_-8px_24px_-8px_rgba(0,0,0,0.08)]">
        <div className="mx-auto flex w-full max-w-md flex-col gap-3">
          <Button
            variant="high-contrast"
            onClick={() => { vibrate(15); onFinish(); }}
            size="large"
            className="w-full"
          >
            {finishButtonText || 'Finalizar sesion'}
          </Button>

          <Button
            variant="secondary"
            onClick={() => { vibrate(5); onAddExercise(); }}
            className="w-full"
            icon={PlusIcon}
          >
            Anadir extra
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostRoutineScreen;
