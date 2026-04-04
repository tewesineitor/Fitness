import React, { useMemo } from 'react';
import {
  ClockIcon,
  FireIcon,
  MeditationIcon,
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

const routineTypeLabelMap: Record<RoutineTask['type'], string> = {
  strength: 'Fuerza',
  cardio: 'Cardio',
  yoga: 'Yoga',
  meditation: 'Meditación',
  cardioLibre: 'Cardio libre',
  senderismo: 'Senderismo',
  rucking: 'Rucking',
  posture: 'Postura',
};

// ── Step icon + tone resolution ───────────────────────────────────────────────
const getStepPresentation = (step: RoutineStep, allExercises: Record<string, Exercise>) => {
  if (step.type === 'exercise') {
    const exercise = allExercises[step.exerciseId];
    return {
      title: exercise?.name ?? step.title,
      detail: `${step.sets} series · ${step.reps} · RIR ${step.rir}`,
      icon: StrengthIcon,
      accentColor: '#4ade80',
      badgeLabel: 'Trabajo',
    };
  }
  if (step.type === 'warmup') {
    return {
      title: step.title,
      detail: `${step.items.length} movimientos de activación`,
      icon: FireIcon,
      accentColor: '#fb923c',
      badgeLabel: 'Calentamiento',
    };
  }
  if (step.type === 'cooldown') {
    return {
      title: step.title,
      detail: `${step.items.length} bloques de enfriamiento`,
      icon: YogaIcon,
      accentColor: '#22d3ee',
      badgeLabel: 'Enfriamiento',
    };
  }
  if (step.type === 'pose') {
    const exercise = allExercises[step.exerciseId];
    return {
      title: exercise?.name ?? step.title,
      detail: `${step.duration}s de trabajo guiado`,
      icon: YogaIcon,
      accentColor: '#a78bfa',
      badgeLabel: 'Postura',
    };
  }
  return {
    title: step.title,
    detail: `${'duration' in step ? step.duration : 0}s de enfoque`,
    icon: MeditationIcon,
    accentColor: '#94a3b8',
    badgeLabel: 'Meditación',
  };
};

// ── Bento stat card ───────────────────────────────────────────────────────────
const BentoStat: React.FC<{ label: string; value: React.ReactNode; sub: string }> = ({ label, value, sub }) => (
  <div className="bg-surface-bg/50 backdrop-blur-xl border border-surface-border/50 rounded-[2rem] p-5 flex flex-col items-center text-center gap-2 animate-fade-in-up">
    <span className="text-sm font-bold uppercase text-text-secondary">
      {label}
    </span>
    <span className="font-heading text-5xl font-black text-text-primary leading-none tracking-tight">
      {value}
    </span>
    <span className="text-xs text-text-muted leading-snug">{sub}</span>
  </div>
);

// ── Exercise pill row ─────────────────────────────────────────────────────────
const StepPill: React.FC<{
  step: RoutineStep;
  index: number;
  allExercises: Record<string, Exercise>;
}> = ({ step, index, allExercises }) => {
  const p = getStepPresentation(step, allExercises);
  const Icon = p.icon;

  return (
    <div
      className="bg-surface-bg/50 backdrop-blur-xl border border-surface-border/50 rounded-[1.5rem] px-4 py-3.5 flex items-center gap-4 animate-fade-in-up"
      style={{ animationDelay: `${index * 45}ms`, animationFillMode: 'both' }}
    >
      {/* Step number */}
      <span
        className="text-[9px] font-black text-zinc-600 w-5 text-right flex-shrink-0"
        style={{ letterSpacing: 'var(--letter-spacing-caps)' }}
      >
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* Icon bubble — color inherited via CSS currentColor on parent */}
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${p.accentColor}18`, color: p.accentColor }}
      >
        <Icon className="w-4 h-4" />
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-text-primary leading-tight truncate">{p.title}</p>
        <p className="text-xs text-text-secondary mt-0.5 truncate">{p.detail}</p>
      </div>

      {/* Badge */}
      <span
        className="text-[9px] font-black uppercase px-2.5 py-1 rounded-full flex-shrink-0"
        style={{
          color: p.accentColor,
          backgroundColor: `${p.accentColor}15`,
          letterSpacing: 'var(--letter-spacing-caps)',
        }}
      >
        {p.badgeLabel}
      </span>
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
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
    <div className="relative w-full min-h-screen flex flex-col">

      {/* Atmospheric glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(var(--color-brand-accent-rgb),0.12),transparent_70%)]" />

      {/* ── Scrollable content ───────────────────────────────────────────── */}
      <div className="relative z-10 flex-1 overflow-y-auto hide-scrollbar">
        <div className="max-w-4xl mx-auto w-full flex flex-col gap-16 px-4 pb-40 pt-8">

          {/* ── HEADER ──────────────────────────────────────────────────── */}
          <header className="flex items-start justify-between animate-fade-in-up">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span
                  className="text-[9px] font-black uppercase text-brand-accent"
                  style={{ letterSpacing: 'var(--letter-spacing-caps)' }}
                >
                  Session Launch
                </span>
                <span className="text-surface-border">·</span>
                <span
                  className="text-[9px] font-black uppercase text-text-muted flex items-center gap-1"
                  style={{ letterSpacing: 'var(--letter-spacing-caps)' }}
                >
                  <ClockIcon className="w-3 h-3" />
                  {activeRoutine.timeOfDay}
                </span>
                <span className="text-surface-border">·</span>
                <span
                  className="text-[9px] font-black uppercase text-text-muted"
                  style={{ letterSpacing: 'var(--letter-spacing-caps)' }}
                >
                  {routineTypeLabelMap[activeRoutine.type]}
                </span>
              </div>
              <h1 className="font-heading text-4xl font-black text-text-primary leading-tight tracking-tight">
                {activeRoutine.name}
              </h1>
              {activeRoutine.technicalFocus && (
                <p className="text-sm text-text-secondary leading-relaxed max-w-lg">
                  {activeRoutine.technicalFocus}
                </p>
              )}
            </div>

            <button
              onClick={() => { vibrate(5); onBack(); }}
              className="flex-shrink-0 ml-4 mt-1 text-[9px] font-black uppercase text-text-muted hover:text-text-secondary transition-colors"
              style={{ letterSpacing: 'var(--letter-spacing-caps)' }}
            >
              ← Salir
            </button>
          </header>

          {/* ── BENTO STATS 3-col ────────────────────────────────────────── */}
          <div className="grid grid-cols-3 gap-4">
            <BentoStat
              label="Bloques"
              value={stepMetrics.total}
              sub="Pasos en la sesión"
            />
            <BentoStat
              label="Series"
              value={stepMetrics.workSets}
              sub="Volumen planificado"
            />
            <BentoStat
              label="Soporte"
              value={stepMetrics.supportBlocks + stepMetrics.focusBlocks}
              sub="Activación y cierre"
            />
          </div>

          {/* ── RUN OF SHOW ─────────────────────────────────────────────── */}
          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span
                className="text-[9px] font-black uppercase text-text-secondary"
                style={{ letterSpacing: 'var(--letter-spacing-caps)' }}
              >
                Run of show
              </span>
              <span className="text-[9px] font-bold text-text-secondary">
                {activeRoutine.flow.length} bloques
              </span>
            </div>

            {activeRoutine.flow.map((step, index) => (
              <StepPill
                key={`${step.type}-${index}`}
                step={step}
                index={index}
                allExercises={allExercises}
              />
            ))}
          </section>

        </div>
      </div>

      {/* ── FADE MASK ───────────────────────────────────────────────────── */}
      <div className="pointer-events-none fixed bottom-0 left-0 w-full h-44 bg-gradient-to-t from-bg-base to-transparent z-20" />

      {/* ── FAB PRIMARIO ────────────────────────────────────────────────── */}
      <div className="fixed bottom-8 left-0 right-0 z-30 flex flex-col items-center gap-3 px-4">
        <button
          onClick={() => { vibrate(15); onStart(); }}
          className="w-full max-w-sm bg-brand-accent text-brand-accent-foreground font-black text-sm uppercase rounded-full py-5 active:scale-[0.97] transition-all duration-150 select-none"
          style={{ letterSpacing: 'var(--letter-spacing-caps)' }}
        >
          Comenzar Entrenamiento
        </button>
        <button
          onClick={() => { vibrate(5); onBack(); }}
          className="text-[10px] font-bold uppercase text-text-muted hover:text-text-secondary transition-colors select-none"
          style={{ letterSpacing: 'var(--letter-spacing-caps)' }}
        >
          Volver
        </button>
      </div>

    </div>
  );
};

export default RoutineLaunchScreen;
