import React from 'react';
import Button from '../../../components/Button';
import Card from '../../../components/Card';
import Tag from '../../../components/Tag';
import { CheckCircleIcon, ClockIcon, SparklesIcon } from '../../../components/icons';

interface RoutineExitDialogProps {
  completedExercises: number;
  elapsedSeconds: number;
  onConfirmFinish: () => void;
  onDiscard: () => void;
  onCancel: () => void;
}

const formatElapsed = (seconds: number) => {
  if (seconds < 60) return `${seconds}s`;

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes} min`;
};

const RoutineExitDialog: React.FC<RoutineExitDialogProps> = ({
  completedExercises,
  elapsedSeconds,
  onConfirmFinish,
  onDiscard,
  onCancel,
}) => {
  return (
    <div className="space-y-5 p-6">
      <div className="space-y-3">
        <Tag variant="overlay" tone="accent" size="sm" icon={SparklesIcon}>
          Session control
        </Tag>
        <div className="space-y-2">
          <h2 className="text-2xl font-black tracking-[-0.04em] text-text-primary">Terminar entrenamiento</h2>
          <p className="text-sm leading-6 text-text-secondary">
            Puedes cerrar ahora y guardar el avance registrado, o salir sin conservar la sesion.
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Card variant="inset" className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-brand-accent/20 bg-brand-accent/10 text-brand-accent">
              <CheckCircleIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-text-secondary">Ejercicios</p>
              <p className="mt-1 text-2xl font-black tracking-[-0.04em] text-text-primary">{completedExercises}</p>
            </div>
          </div>
        </Card>

        <Card variant="inset" className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-surface-border bg-surface-hover text-text-primary">
              <ClockIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-text-secondary">Tiempo</p>
              <p className="mt-1 text-2xl font-black tracking-[-0.04em] text-text-primary">{formatElapsed(elapsedSeconds)}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card variant="glass" className="p-4">
        <p className="text-sm leading-6 text-text-secondary">
          Si cierras con guardado, el resumen y los registros actuales se conservan en historial. Si descartas, esta
          sesion se abandona sin persistir cambios.
        </p>
      </Card>

      <div className="flex flex-col gap-3">
        <Button variant="high-contrast" size="large" onClick={onConfirmFinish} className="w-full">
          Terminar y guardar
        </Button>
        <Button variant="destructive" size="large" onClick={onDiscard} className="w-full">
          Salir sin guardar
        </Button>
        <Button variant="secondary" size="large" onClick={onCancel} className="w-full">
          Seguir entrenando
        </Button>
      </div>
    </div>
  );
};

export default RoutineExitDialog;
