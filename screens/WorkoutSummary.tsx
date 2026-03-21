import React, { useContext } from 'react';
import { AppContext } from '../contexts';
import {
  DesgloseCardioLibre,
  DesgloseFuerza,
  DesgloseTiempo,
  HistorialDeSesionesEntry,
} from '../types';
import Button from '../components/Button';
import Card from '../components/Card';
import EmptyState from '../components/feedback/EmptyState';
import {
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  FireIcon,
  HeartIcon,
  MountainIcon,
  SparklesIcon,
  StarIcon,
  StrengthIcon,
} from '../components/icons';
import PageContainer from '../components/layout/PageContainer';
import PageHeader from '../components/layout/PageHeader';
import PageSection from '../components/layout/PageSection';
import Tag from '../components/Tag';
import { vibrate } from '../utils/helpers';

interface WorkoutSummaryScreenProps {
  onExit: () => void;
  isHistoricalView?: boolean;
  historicalEntry: HistorialDeSesionesEntry;
}

interface SummaryMetricCardProps {
  label: string;
  value: React.ReactNode;
  detail: React.ReactNode;
  icon: React.FC<{ className?: string }>;
  tone?: 'neutral' | 'accent' | 'success' | 'danger';
  badge?: React.ReactNode;
}

const toneClassMap: Record<NonNullable<SummaryMetricCardProps['tone']>, string> = {
  neutral: 'text-text-primary',
  accent: 'text-brand-accent',
  success: 'text-success',
  danger: 'text-danger',
};

const cardioTitleMap: Record<string, string> = {
  cardioLibre: 'Carrera',
  senderismo: 'Senderismo',
  rucking: 'Rucking',
  cardio: 'Cardio progresivo',
};

const isCardioStyleSummary = (entry: HistorialDeSesionesEntry) =>
  entry.tipo_rutina === 'cardioLibre' ||
  entry.tipo_rutina === 'senderismo' ||
  entry.tipo_rutina === 'rucking' ||
  entry.tipo_rutina === 'cardio';

const formatSessionDate = (value: string) =>
  new Date(value).toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

const formatTimedBlock = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
};

const SummaryMetricCard: React.FC<SummaryMetricCardProps> = ({
  label,
  value,
  detail,
  icon: Icon,
  tone = 'neutral',
  badge,
}) => (
  <Card variant="glass" className="p-4 sm:p-5">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0 space-y-2">
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${toneClassMap[tone]}`} />
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-text-secondary">{label}</p>
        </div>
        <div className={`text-3xl font-black tracking-[-0.05em] ${toneClassMap[tone]}`}>{value}</div>
        <p className="text-sm leading-6 text-text-secondary">{detail}</p>
      </div>

      {badge !== undefined ? (
        <Tag variant="status" tone={tone === 'neutral' ? 'accent' : tone} size="sm">
          {badge}
        </Tag>
      ) : null}
    </div>
  </Card>
);

const StrengthExerciseResultCard: React.FC<{
  exercise: DesgloseFuerza;
  isNewPR: boolean;
}> = ({ exercise, isNewPR }) => {
  const bestSet = [...exercise.sets].sort((a, b) => b.weight - a.weight || b.reps - a.reps)[0];
  const volume = exercise.sets.reduce((total, set) => total + set.weight * set.reps, 0);

  return (
    <Card variant={isNewPR ? 'accent' : 'default'} className="p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-black tracking-[-0.03em] text-text-primary">
              {exercise.nombre_ejercicio}
            </h3>
            {isNewPR ? (
              <Tag variant="status" tone="accent" size="sm" icon={StarIcon}>
                PR
              </Tag>
            ) : null}
          </div>
          <p className="mt-1 text-sm leading-6 text-text-secondary">
            {exercise.sets.length} series registradas y {volume.toFixed(0)} kg de volumen total.
          </p>
        </div>

        <Tag variant="status" tone="neutral" size="sm">
          {exercise.sets.length} series
        </Tag>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Card variant="inset" className="p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-text-secondary">Mejor serie</p>
          <p className="mt-2 text-2xl font-black tracking-[-0.04em] text-text-primary">
            {bestSet.weight} kg
          </p>
          <p className="mt-1 text-sm leading-6 text-text-secondary">{bestSet.reps} repeticiones</p>
        </Card>

        <Card variant="inset" className="p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-text-secondary">Volumen</p>
          <p className="mt-2 text-2xl font-black tracking-[-0.04em] text-brand-accent">
            {volume.toFixed(0)} kg
          </p>
          <p className="mt-1 text-sm leading-6 text-text-secondary">
            Suma total de peso movido en este ejercicio.
          </p>
        </Card>
      </div>
    </Card>
  );
};

const TimedBlockCard: React.FC<{ block: DesgloseTiempo }> = ({ block }) => (
  <Card variant="default" className="p-4 sm:p-5">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-lg font-black tracking-[-0.03em] text-text-primary">{block.nombre_ejercicio}</p>
        <p className="mt-1 text-sm leading-6 text-text-secondary">
          Bloque por tiempo completado dentro de la sesion.
        </p>
      </div>
      <Tag variant="status" tone="accent" size="sm">
        {formatTimedBlock(block.duracion_completada_seg)}
      </Tag>
    </div>
  </Card>
);

const CardioSummaryView: React.FC<{
  entry: HistorialDeSesionesEntry;
  isHistoricalView: boolean;
  onExit: () => void;
}> = ({ entry, isHistoricalView, onExit }) => {
  const details = (entry.desglose_ejercicios[0] as DesgloseCardioLibre | undefined) ?? {
    distance: 0,
    duration: 0,
  };
  const title = cardioTitleMap[entry.tipo_rutina] ?? 'Actividad';

  const metricCards: SummaryMetricCardProps[] = [
    {
      label: 'Tiempo',
      value: `${entry.duracion_total_min} min`,
      detail: 'Duracion total registrada en la sesion.',
      icon: ClockIcon,
    },
    {
      label: 'Ritmo',
      value: details.pace ?? '-',
      detail: 'Ritmo promedio reportado.',
      icon: SparklesIcon,
      tone: 'accent',
    },
    {
      label: 'Energia',
      value: typeof details.calories === 'number' ? `${details.calories}` : '-',
      detail: 'Gasto energetico estimado.',
      icon: FireIcon,
    },
    {
      label: 'Pulso',
      value: typeof details.heartRate === 'number' ? `${details.heartRate}` : '-',
      detail: 'Frecuencia cardiaca promedio.',
      icon: HeartIcon,
    },
  ];

  if (typeof details.elevation === 'number') {
    metricCards.push({
      label: 'Elevacion',
      value: `${details.elevation}`,
      detail: 'Metros de desnivel acumulado.',
      icon: MountainIcon,
    });
  }

  if (typeof details.weightCarried === 'number') {
    metricCards.push({
      label: 'Carga',
      value: `${details.weightCarried} kg`,
      detail: 'Peso cargado durante la sesion.',
      icon: StrengthIcon,
    });
  }

  return (
    <div className="relative flex h-[100dvh] flex-col overflow-hidden bg-bg-base text-text-primary">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(var(--color-brand-accent-rgb),0.16),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_38%)]" />

      <div className="relative z-10 flex-1 overflow-y-auto pb-32">
        <PageHeader
          size="wide"
          eyebrow={
            <Tag variant="overlay" tone="accent" size="sm" icon={SparklesIcon}>
              {isHistoricalView ? 'Session archive' : 'Session complete'}
            </Tag>
          }
          title={title}
          subtitle={`Cierre editorial del bloque cardio para ${formatSessionDate(entry.fecha_completado)}.`}
          actions={
            <Tag variant="status" tone="neutral" size="sm" icon={CalendarIcon}>
              {formatSessionDate(entry.fecha_completado)}
            </Tag>
          }
        />

        <PageContainer size="compact" className="flex flex-col gap-6 pb-8">
          <Card variant="glass" className="relative overflow-hidden p-5 sm:p-6">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(var(--color-brand-accent-rgb),0.18),transparent_36%),linear-gradient(135deg,rgba(255,255,255,0.05),transparent_56%)]" />
            <div className="relative grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-text-secondary">Distance ledger</p>
                <div className="flex items-end gap-3">
                  <span className="text-6xl font-black tracking-[-0.07em] text-text-primary sm:text-7xl">
                    {details.distance.toFixed(2)}
                  </span>
                  <span className="pb-2 text-sm font-bold uppercase tracking-[0.18em] text-brand-accent">
                    km
                  </span>
                </div>
                <p className="max-w-2xl text-sm leading-6 text-text-secondary">
                  Lectura rapida de la sesion con distancia, ritmo y energia dentro de un cierre visual consistente.
                </p>
              </div>

              <SummaryMetricCard
                label="Actividad"
                value={title}
                detail="Tipo de sesion completada."
                icon={StrengthIcon}
                tone="accent"
                badge={entry.tipo_rutina}
              />
            </div>
          </Card>

          <PageSection
            eyebrow="Performance"
            title="Metricas de sesion"
            subtitle="Resumen del bloque cardio con los valores reportados al cierre."
          >
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {metricCards.map((metric) => (
                <SummaryMetricCard key={metric.label} {...metric} />
              ))}
            </div>
          </PageSection>

          {details.notes ? (
            <PageSection eyebrow="Notas" title="Observaciones" subtitle="Contexto adicional registrado en la sesion.">
              <Card variant="inset" className="p-4 sm:p-5">
                <p className="text-sm leading-6 text-text-secondary">{details.notes}</p>
              </Card>
            </PageSection>
          ) : null}
        </PageContainer>
      </div>

      <div className="relative z-10 border-t border-surface-border/80 bg-bg-base/92 p-4 pb-safe backdrop-blur-xl sm:p-6">
        <PageContainer size="compact" className="!px-0">
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
        </PageContainer>
      </div>
    </div>
  );
};

export const WorkoutSummaryScreen: React.FC<WorkoutSummaryScreenProps> = ({
  onExit,
  isHistoricalView = false,
  historicalEntry,
}) => {
  const { state } = useContext(AppContext)!;
  const newPRs = state.session.workoutSummaryData?.newPRs ?? [];

  if (isCardioStyleSummary(historicalEntry)) {
    return (
      <CardioSummaryView
        entry={historicalEntry}
        isHistoricalView={isHistoricalView}
        onExit={onExit}
      />
    );
  }

  const totalVolume = historicalEntry.desglose_ejercicios.reduce((total, exercise) => {
    if ('sets' in exercise && Array.isArray(exercise.sets)) {
      return total + exercise.sets.reduce((volume, set) => volume + set.weight * set.reps, 0);
    }
    return total;
  }, 0);

  const strengthExercises = historicalEntry.desglose_ejercicios.filter(
    (exercise): exercise is DesgloseFuerza =>
      'sets' in exercise &&
      Array.isArray((exercise as DesgloseFuerza).sets) &&
      (exercise as DesgloseFuerza).sets.length > 0
  );
  const timedExercises = historicalEntry.desglose_ejercicios.filter(
    (exercise): exercise is DesgloseTiempo => 'duracion_completada_seg' in exercise
  );

  return (
    <div className="relative flex h-[100dvh] flex-col overflow-hidden bg-bg-base text-text-primary">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(var(--color-brand-accent-rgb),0.14),transparent_40%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_36%)]" />

      <div className="relative z-10 flex-1 overflow-y-auto pb-32">
        <PageHeader
          size="wide"
          eyebrow={
            <Tag variant="overlay" tone="accent" size="sm" icon={SparklesIcon}>
              {isHistoricalView ? 'Session archive' : 'Session complete'}
            </Tag>
          }
          title={historicalEntry.nombre_rutina}
          subtitle={`Resumen editorial del entrenamiento cerrado el ${formatSessionDate(historicalEntry.fecha_completado)}.`}
          actions={
            <Tag variant="status" tone="neutral" size="sm" icon={CalendarIcon}>
              {formatSessionDate(historicalEntry.fecha_completado)}
            </Tag>
          }
        />

        <PageContainer size="compact" className="flex flex-col gap-6 pb-8">
          <Card variant="glass" className="relative overflow-hidden p-5 sm:p-6">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(var(--color-brand-accent-rgb),0.18),transparent_36%),linear-gradient(135deg,rgba(255,255,255,0.05),transparent_56%)]" />
            <div className="relative space-y-5">
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-text-secondary">Workout ledger</p>
                <h2 className="text-3xl font-black tracking-[-0.05em] text-text-primary sm:text-4xl">
                  Cierre premium del bloque de fuerza.
                </h2>
                <p className="max-w-2xl text-sm leading-6 text-text-secondary">
                  Esta vista prioriza el volumen total, el numero de ejercicios trabajados y los records detectados.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <SummaryMetricCard
                  label="Duracion"
                  value={`${historicalEntry.duracion_total_min} min`}
                  detail="Tiempo total invertido en la sesion."
                  icon={ClockIcon}
                />
                <SummaryMetricCard
                  label="Volumen"
                  value={totalVolume > 0 ? `${(totalVolume / 1000).toFixed(1)}k` : '-'}
                  detail="Peso total movilizado durante el entrenamiento."
                  icon={StrengthIcon}
                  tone="accent"
                  badge="kg"
                />
                <SummaryMetricCard
                  label="Ejercicios"
                  value={historicalEntry.desglose_ejercicios.length}
                  detail="Bloques con registro al finalizar."
                  icon={CheckCircleIcon}
                />
                <SummaryMetricCard
                  label="Records"
                  value={newPRs.length}
                  detail="Mejoras detectadas en esta sesion."
                  icon={StarIcon}
                  tone={newPRs.length > 0 ? 'accent' : 'neutral'}
                  badge={newPRs.length > 0 ? 'PR' : 'Base'}
                />
              </div>
            </div>
          </Card>

          <PageSection
            eyebrow="Performance"
            title="Desempeno por ejercicio"
            subtitle="Mejor serie y volumen por cada ejercicio de fuerza con registros."
          >
            {strengthExercises.length > 0 ? (
              <div className="space-y-3">
                {strengthExercises.map((exercise, index) => (
                  <StrengthExerciseResultCard
                    key={`${exercise.exerciseId}-${index}`}
                    exercise={exercise}
                    isNewPR={!isHistoricalView && newPRs.includes(exercise.exerciseId)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<StrengthIcon className="h-7 w-7" />}
                title="No hay ejercicios de fuerza en esta sesion"
                description="El resumen no encontro bloques con series registradas para mostrar desempeno por ejercicio."
              />
            )}
          </PageSection>

          {timedExercises.length > 0 ? (
            <PageSection
              eyebrow="Timed blocks"
              title="Bloques por tiempo"
              subtitle="Segmentos cerrados por duracion dentro del mismo entrenamiento."
            >
              <div className="grid gap-3">
                {timedExercises.map((exercise, index) => (
                  <TimedBlockCard key={`${exercise.nombre_ejercicio}-${index}`} block={exercise} />
                ))}
              </div>
            </PageSection>
          ) : null}
        </PageContainer>
      </div>

      <div className="relative z-10 border-t border-surface-border/80 bg-bg-base/92 p-4 pb-safe backdrop-blur-xl sm:p-6">
        <PageContainer size="compact" className="!px-0">
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
        </PageContainer>
      </div>
    </div>
  );
};
