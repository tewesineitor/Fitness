import React, { useMemo } from 'react';
import Button from '../../../components/Button';
import Card from '../../../components/Card';
import PageHeader from '../../../components/layout/PageHeader';
import PageSection from '../../../components/layout/PageSection';
import Tag from '../../../components/Tag';
import {
  ClockIcon,
  FireIcon,
  MeditationIcon,
  SparklesIcon,
  StrengthIcon,
  YogaIcon,
} from '../../../components/icons';
import { Exercise, RoutineStep, RoutineTask } from '../../../types';
import { vibrate } from '../../../utils/helpers';

interface RoutineLaunchScreenProps {
  activeRoutine: RoutineTask;
  allExercises: Record<string, Exercise>;
  onStart: () => void;
  onBack: () => void;
}

interface LaunchStatProps {
  label: string;
  value: React.ReactNode;
  detail: React.ReactNode;
}

const routineTypeLabelMap: Record<RoutineTask['type'], string> = {
  strength: 'Fuerza',
  cardio: 'Cardio',
  yoga: 'Yoga',
  meditation: 'Meditacion',
  cardioLibre: 'Cardio libre',
  senderismo: 'Senderismo',
  rucking: 'Rucking',
  posture: 'Postura',
};

const LaunchStat: React.FC<LaunchStatProps> = ({ label, value, detail }) => (
  <Card variant="inset" className="p-4">
    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-text-secondary">{label}</p>
    <div className="mt-2 text-3xl font-black tracking-[-0.05em] text-text-primary">{value}</div>
    <p className="mt-1 text-sm leading-6 text-text-secondary">{detail}</p>
  </Card>
);

const getStepPresentation = (step: RoutineStep, allExercises: Record<string, Exercise>) => {
  if (step.type === 'exercise') {
    const exercise = allExercises[step.exerciseId];
    return {
      title: exercise?.name ?? step.title,
      detail: `${step.sets} series · ${step.reps} · RIR ${step.rir}`,
      icon: StrengthIcon,
      tone: 'accent' as const,
    };
  }

  if (step.type === 'warmup') {
    return {
      title: step.title,
      detail: `${step.items.length} movimientos de activacion`,
      icon: FireIcon,
      tone: 'success' as const,
    };
  }

  if (step.type === 'cooldown') {
    return {
      title: step.title,
      detail: `${step.items.length} bloques de enfriamiento`,
      icon: YogaIcon,
      tone: 'neutral' as const,
    };
  }

  if (step.type === 'pose') {
    const exercise = allExercises[step.exerciseId];
    return {
      title: exercise?.name ?? step.title,
      detail: `${step.duration}s de trabajo guiado`,
      icon: YogaIcon,
      tone: 'accent' as const,
    };
  }

  return {
    title: step.title,
    detail: `${'duration' in step ? step.duration : 0}s de enfoque`,
    icon: MeditationIcon,
    tone: 'neutral' as const,
  };
};

const RoutineLaunchScreen: React.FC<RoutineLaunchScreenProps> = ({
  activeRoutine,
  allExercises,
  onStart,
  onBack,
}) => {
  const stepMetrics = useMemo(() => {
    return activeRoutine.flow.reduce(
      (acc, step) => {
        acc.total += 1;

        if (step.type === 'exercise') acc.workSets += step.sets;
        if (step.type === 'warmup' || step.type === 'cooldown') acc.supportBlocks += 1;
        if (step.type === 'pose' || step.type === 'meditation') acc.focusBlocks += 1;

        return acc;
      },
      { total: 0, workSets: 0, supportBlocks: 0, focusBlocks: 0 }
    );
  }, [activeRoutine.flow]);

  return (
    <div className="relative flex h-full w-full flex-col">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top,rgba(var(--color-brand-accent-rgb),0.22),transparent_60%)]" />

      <div className="relative z-10 flex-1 overflow-y-auto pb-40">
        <PageHeader
          size="wide"
          backLabel="Salir"
          onBack={() => {
            vibrate(5);
            onBack();
          }}
          eyebrow={
            <Tag variant="overlay" tone="accent" size="sm" icon={SparklesIcon}>
              Session launch
            </Tag>
          }
          title={activeRoutine.name}
          subtitle={
            activeRoutine.technicalFocus
              ? activeRoutine.technicalFocus
              : 'Entrada premium de la sesion, con lectura clara del bloque de trabajo antes de comenzar.'
          }
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <Tag variant="status" tone="accent" size="sm">
                {routineTypeLabelMap[activeRoutine.type]}
              </Tag>
              <Tag variant="status" tone="neutral" size="sm" icon={ClockIcon}>
                {activeRoutine.timeOfDay}
              </Tag>
            </div>
          }
        />

        <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 sm:px-6">
          <Card variant="glass" className="overflow-hidden p-5 sm:p-6">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(var(--color-brand-accent-rgb),0.18),transparent_36%),linear-gradient(135deg,rgba(255,255,255,0.05),transparent_56%)]" />
            <div className="relative grid gap-4 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-text-secondary">
                  Editorial warm start
                </p>
                <h2 className="text-3xl font-black tracking-[-0.05em] text-text-primary sm:text-4xl">
                  Todo listo para entrar al bloque principal.
                </h2>
                <p className="max-w-2xl text-sm leading-6 text-text-secondary">
                  La vista previa organiza calentamiento, trabajo principal y cierre para que arranques con contexto
                  y sin ruido visual.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                <LaunchStat
                  label="Bloques"
                  value={stepMetrics.total}
                  detail="Pasos programados en la sesion."
                />
                <LaunchStat
                  label="Series"
                  value={stepMetrics.workSets}
                  detail="Volumen planificado de trabajo."
                />
                <LaunchStat
                  label="Soporte"
                  value={stepMetrics.supportBlocks + stepMetrics.focusBlocks}
                  detail="Activacion, enfriamiento o enfoque guiado."
                />
              </div>
            </div>
          </Card>

          <PageSection
            eyebrow="Run of show"
            title="Bloques de la sesion"
            subtitle="Orden completo del flujo para anticipar ritmo, volumen y transiciones."
          >
            <div className="space-y-3">
              {activeRoutine.flow.map((step, index) => {
                const presentation = getStepPresentation(step, allExercises);
                const StepIcon = presentation.icon;

                return (
                  <Card
                    key={`${step.type}-${index}`}
                    variant={index === 0 ? 'glass' : 'default'}
                    className="overflow-hidden p-4 sm:p-5"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl border border-surface-border bg-surface-hover text-brand-accent">
                        <StepIcon className="h-5 w-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Tag variant="status" tone={presentation.tone} size="sm">
                            Paso {index + 1}
                          </Tag>
                          <Tag variant="status" tone="neutral" size="sm">
                            {step.type}
                          </Tag>
                        </div>

                        <h3 className="mt-3 text-lg font-black tracking-[-0.03em] text-text-primary">
                          {presentation.title}
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-text-secondary">{presentation.detail}</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </PageSection>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg-base via-bg-base/96 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 z-20 p-4 pb-safe sm:p-6">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-3 sm:flex-row sm:items-center">
          <Button
            variant="high-contrast"
            size="large"
            onClick={() => {
              vibrate(15);
              onStart();
            }}
            className="w-full sm:flex-1"
          >
            Comenzar rutina
          </Button>
          <Button
            variant="secondary"
            size="large"
            onClick={() => {
              vibrate(5);
              onBack();
            }}
            className="w-full sm:w-auto"
          >
            Volver
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RoutineLaunchScreen;
