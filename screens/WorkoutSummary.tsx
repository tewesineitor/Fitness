import React, { useContext, useMemo } from 'react';
import { AppContext } from '../contexts';
import Button from '../components/Button';
import Card from '../components/Card';
import Tag from '../components/Tag';
import PageHeader from '../components/layout/PageHeader';
import PageSection from '../components/layout/PageSection';
import {
  CheckCircleIcon,
  ClockIcon,
  FireIcon,
  HeartIcon,
  MountainIcon,
  SparklesIcon,
  StarIcon,
  StrengthIcon,
} from '../components/icons';
import { vibrate } from '../utils/helpers';
import type {
  DesgloseCardioLibre,
  DesgloseFuerza,
  DesgloseTiempo,
  HistorialDeSesionesEntry,
} from '../types';

const formatSessionDate = (value: string) =>
  new Date(value).toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

const formatCardioTitle = (type: HistorialDeSesionesEntry['tipo_rutina']) => {
  const titles: Record<string, string> = {
    cardioLibre: 'Carrera libre',
    senderismo: 'Senderismo',
    rucking: 'Rucking',
    cardio: 'Cardio progresivo',
  };

  return titles[type] ?? 'Actividad';
};

const SummaryStatCard: React.FC<{
  label: string;
  value: string;
  helper?: string;
  tone?: 'neutral' | 'accent' | 'success' | 'protein';
  icon: React.FC<{ className?: string }>;
}> = ({ label, value, helper, tone = 'neutral', icon: Icon }) => (
  <Card variant="glass" className="p-4 sm:p-5">
    <div className="flex items-start justify-between gap-3">
      <div className="space-y-2">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-text-secondary">{label}</p>
        <div className="flex items-end gap-2">
          <span className="font-mono text-4xl font-black tracking-[-0.06em] text-text-primary">{value}</span>
        </div>
        {helper ? <p className="text-sm text-text-secondary">{helper}</p> : null}
      </div>

      <Tag variant="overlay" tone={tone} size="sm" icon={Icon}>
        Metric
      </Tag>
    </div>
  </Card>
);

const ExerciseSummaryCard: React.FC<{
  exercise: DesgloseFuerza;
  isNewPR?: boolean;
}> = ({ exercise, isNewPR = false }) => {
  const bestSet = useMemo(() => {
    if (!exercise.sets?.length) return null;
    return [...exercise.sets].sort((a, b) => b.weight - a.weight || b.reps - a.reps)[0];
  }, [exercise.sets]);

  const volume = useMemo(
    () => exercise.sets.reduce((acc, set) => acc + set.weight * set.reps, 0),
    [exercise.sets]
  );

  if (!bestSet) return null;

  return (
    <Card variant="elevated" className="p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Tag variant="status" tone={isNewPR ? 'accent' : 'neutral'} size="sm" icon={isNewPR ? StarIcon : StrengthIcon}>
              {isNewPR ? 'Nuevo record' : 'Fuerza'}
            </Tag>
          </div>

          <h3 className="text-lg font-black uppercase tracking-[-0.03em] text-text-primary">
            {exercise.nombre_ejercicio}
          </h3>
        </div>

        <div className="rounded-2xl border border-brand-accent/15 bg-brand-accent/8 p-3 text-brand-accent">
          <StrengthIcon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Card variant="default" className="p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-text-secondary">Mejor serie</p>
          <p className="mt-2 text-2xl font-black tracking-[-0.05em] text-text-primary">
            {bestSet.weight}kg <span className="text-sm text-text-secondary">x {bestSet.reps}</span>
          </p>
        </Card>

        <Card variant="default" className="p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-text-secondary">Volumen</p>
          <p className="mt-2 text-2xl font-black tracking-[-0.05em] text-text-primary">{volume} kg</p>
        </Card>
      </div>
    </Card>
  );
};

const TimeBlockCard: React.FC<{ block: DesgloseTiempo }> = ({ block }) => {
  const minutes = Math.floor(block.duracion_completada_seg / 60);
  const seconds = block.duracion_completada_seg % 60;

  return (
    <Card variant="default" className="p-4 sm:p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-text-secondary">Bloque de tiempo</p>
          <h3 className="mt-2 text-lg font-black uppercase tracking-[-0.03em] text-text-primary">
            {block.nombre_ejercicio}
          </h3>
        </div>

        <Tag variant="overlay" tone="accent" size="sm" icon={ClockIcon}>
          {minutes}m {seconds}s
        </Tag>
      </div>
    </Card>
  );
};

const CardioSummaryScreen: React.FC<{
  entry: HistorialDeSesionesEntry;
  onExit: () => void;
  isHistoricalView: boolean;
}> = ({ entry, onExit, isHistoricalView }) => {
  const details = entry.desglose_ejercicios[0] as DesgloseCardioLibre;
  const distanceDisplay = details.distance > 0 ? details.distance.toFixed(2) : '0.00';

  return (
    <div className="relative h-full overflow-hidden bg-bg-base">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(var(--color-brand-accent-rgb),0.12),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(var(--color-brand-protein-rgb),0.08),transparent_35%)]" />

      <div className="relative z-10 flex h-full flex-col">
        <div className="overflow-y-auto pb-32">
          <PageHeader
            size="wide"
            eyebrow={
              <Tag variant="overlay" tone="accent" size="sm" icon={SparklesIcon}>
                Session recap
              </Tag>
            }
            title={formatCardioTitle(entry.tipo_rutina)}
            subtitle={formatSessionDate(entry.fecha_completado)}
          />

          <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 pb-10 sm:px-6">
            <PageSection
              eyebrow="Metrica principal"
              title="Distancia registrada"
              subtitle="Resumen editorial del bloque cardio para cerrar la sesion con contexto claro."
              surface="glass"
            >
              <div className="space-y-5">
                <div className="text-center">
                  <p className="font-mono text-[5.5rem] font-black leading-none tracking-[-0.09em] text-text-primary sm:text-[7rem]">
                    {distanceDisplay}
                  </p>
                  <p className="mt-2 text-[11px] font-black uppercase tracking-[0.28em] text-brand-accent">
                    Kilometros
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <SummaryStatCard icon={ClockIcon} label="Tiempo" value={`${entry.duracion_total_min} min`} tone="accent" />
                  <SummaryStatCard icon={ClockIcon} label="Ritmo" value={details.pace || '-'} helper="min/km" />
                  <SummaryStatCard icon={FireIcon} label="Energia" value={`${details.calories || '-'}`} helper="kcal" tone="success" />
                  <SummaryStatCard icon={HeartIcon} label="Pulso" value={`${details.heartRate || '-'}`} helper="ppm" />
                  {entry.tipo_rutina === 'rucking' && details.weightCarried ? (
                    <SummaryStatCard icon={MountainIcon} label="Carga" value={`${details.weightCarried} kg`} helper="peso cargado" tone="protein" />
                  ) : null}
                </div>
              </div>
            </PageSection>
          </div>
        </div>

        <div className="border-t border-surface-border bg-bg-base/95 p-4 pb-safe backdrop-blur-xl">
          <div className="mx-auto w-full max-w-3xl">
            <Button
              onClick={() => {
                vibrate(10);
                onExit();
              }}
              variant="high-contrast"
              size="large"
              className="w-full"
            >
              {isHistoricalView ? 'Cerrar resumen' : 'Finalizar sesion'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface WorkoutSummaryScreenProps {
  onExit: () => void;
  isHistoricalView?: boolean;
  historicalEntry: HistorialDeSesionesEntry;
}

export const WorkoutSummaryScreen: React.FC<WorkoutSummaryScreenProps> = ({
  onExit,
  isHistoricalView = false,
  historicalEntry,
}) => {
  const { state } = useContext(AppContext)!;
  const { newPRs = [] } = state.session.workoutSummaryData || {};

  if (
    historicalEntry.tipo_rutina === 'cardioLibre' ||
    historicalEntry.tipo_rutina === 'senderismo' ||
    historicalEntry.tipo_rutina === 'rucking' ||
    historicalEntry.tipo_rutina === 'cardio'
  ) {
    return <CardioSummaryScreen entry={historicalEntry} onExit={onExit} isHistoricalView={isHistoricalView} />;
  }

  const totalVolume = historicalEntry.desglose_ejercicios.reduce((total, exercise) => {
    if ('sets' in exercise && Array.isArray(exercise.sets)) {
      return total + exercise.sets.reduce((volume, set) => volume + set.weight * set.reps, 0);
    }

    return total;
  }, 0);

  const strengthExercises = historicalEntry.desglose_ejercicios.filter(
    (exercise): exercise is DesgloseFuerza =>
      'sets' in exercise && Array.isArray((exercise as DesgloseFuerza).sets) && (exercise as DesgloseFuerza).sets.length > 0
  );

  const timedExercises = historicalEntry.desglose_ejercicios.filter(
    (exercise): exercise is DesgloseTiempo => 'duracion_completada_seg' in exercise
  );

  return (
    <div className="relative h-full overflow-hidden bg-bg-base">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(var(--color-brand-accent-rgb),0.12),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(var(--color-success-rgb),0.08),transparent_35%)]" />

      <div className="relative z-10 flex h-full flex-col">
        <div className="overflow-y-auto pb-32">
          <PageHeader
            size="wide"
            eyebrow={
              <Tag variant="overlay" tone="accent" size="sm" icon={SparklesIcon}>
                Workout recap
              </Tag>
            }
            title={historicalEntry.nombre_rutina}
            subtitle={formatSessionDate(historicalEntry.fecha_completado)}
          />

          <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 pb-10 sm:px-6">
            <PageSection
              eyebrow="Resumen general"
              title="Lectura de la sesion"
              subtitle="Volumen, duracion y records del bloque completado."
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <SummaryStatCard icon={ClockIcon} label="Duracion" value={`${historicalEntry.duracion_total_min} min`} tone="accent" />
                <SummaryStatCard icon={StrengthIcon} label="Volumen total" value={totalVolume > 0 ? `${(totalVolume / 1000).toFixed(1)}k` : '-'} helper="kg movidos" tone="protein" />
                <SummaryStatCard icon={CheckCircleIcon} label="Ejercicios" value={`${historicalEntry.desglose_ejercicios.length}`} />
                <SummaryStatCard icon={StarIcon} label="Nuevos records" value={`${newPRs.length}`} tone="success" />
              </div>
            </PageSection>

            {strengthExercises.length > 0 ? (
              <PageSection
                eyebrow="Fuerza"
                title="Desempeno por ejercicio"
                subtitle="Mejores series y volumen acumulado por movimiento."
              >
                <div className="space-y-3">
                  {strengthExercises.map((exercise) => (
                    <ExerciseSummaryCard
                      key={`${exercise.exerciseId}-${exercise.nombre_ejercicio}`}
                      exercise={exercise}
                      isNewPR={!isHistoricalView && newPRs.includes(exercise.exerciseId)}
                    />
                  ))}
                </div>
              </PageSection>
            ) : null}

            {timedExercises.length > 0 ? (
              <PageSection
                eyebrow="Tiempo"
                title="Bloques cronometrados"
                subtitle="Resumen de segmentos por duracion dentro de la sesion."
              >
                <div className="space-y-3">
                  {timedExercises.map((exercise, index) => (
                    <TimeBlockCard key={`${exercise.nombre_ejercicio}-${index}`} block={exercise} />
                  ))}
                </div>
              </PageSection>
            ) : null}
          </div>
        </div>

        <div className="border-t border-surface-border bg-bg-base/95 p-4 pb-safe backdrop-blur-xl">
          <div className="mx-auto w-full max-w-3xl">
            <Button
              onClick={() => {
                vibrate(10);
                onExit();
              }}
              variant="high-contrast"
              size="large"
              className="w-full"
            >
              {isHistoricalView ? 'Cerrar resumen' : 'Finalizar entrenamiento'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
