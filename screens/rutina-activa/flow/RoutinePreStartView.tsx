import React from 'react';
import Button from '../../../components/Button';
import Tag from '../../../components/Tag';
import { StrengthIcon, FireIcon, YogaIcon } from '../../../components/icons';
import { Exercise, RoutineTask, RoutineStep } from '../../../types';
import { vibrate } from '../../../utils/helpers';

interface RoutinePreStartViewProps {
    activeRoutine: RoutineTask;
    allExercises: Record<string, Exercise>;
    onStart: () => void;
    onBack: () => void;
}

const RoutineStepPreview: React.FC<{
    step: RoutineStep;
    index: number;
    allExercises: Record<string, Exercise>;
}> = ({ step, index, allExercises }) => {
    let stepName = step.title || 'Bloque';
    let stepDesc = '';
    let Icon = StrengthIcon;
    const isLightStep = step.type === 'warmup' || step.type === 'cooldown';

    if (step.type === 'exercise') {
        const exercise = allExercises[step.exerciseId];
        stepName = exercise ? exercise.name : step.title;
        stepDesc = `${step.sets} series x ${step.reps}`;
    } else if (step.type === 'warmup') {
        Icon = FireIcon;
        stepDesc = `${step.items.length} movimientos`;
    } else if (step.type === 'cooldown') {
        Icon = YogaIcon;
        stepDesc = 'Recuperacion activa';
    } else if (step.type === 'pose') {
        Icon = YogaIcon;
        const exercise = allExercises[step.exerciseId];
        stepName = exercise ? exercise.name : step.title;
        stepDesc = step.duration ? `${step.duration}s` : '';
    }

    return (
        <div
            className="group flex items-start gap-4 animate-fade-in-up"
            style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'both' }}
        >
            <div className={`mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl border-2 transition-transform group-hover:scale-110 sm:h-12 sm:w-12 ${isLightStep ? 'border-surface-border bg-surface-bg text-text-secondary' : 'border-brand-accent/30 bg-surface-hover text-brand-accent shadow-[0_0_10px_rgba(var(--color-brand-accent-rgb),0.1)]'}`}>
                <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>

            <div className="flex-grow rounded-2xl border border-surface-border bg-surface-bg/60 p-4 shadow-sm backdrop-blur-md transition-colors group-hover:bg-surface-hover">
                <h3 className={`mb-1 text-sm font-bold leading-tight sm:text-base ${isLightStep ? 'text-text-secondary' : 'text-text-primary'}`}>
                    {stepName}
                </h3>
                <Tag variant="status" tone="accent" size="sm">
                    {stepDesc}
                </Tag>
            </div>
        </div>
    );
};

const RoutinePreStartView: React.FC<RoutinePreStartViewProps> = ({ activeRoutine, allExercises, onStart, onBack }) => {
    return (
        <div className="relative flex w-full flex-grow flex-col">
            <div className="pointer-events-none absolute left-0 right-0 top-0 z-10 h-32 bg-gradient-to-b from-black/60 to-transparent" />

            <div className="relative z-20 mx-auto w-full max-w-3xl flex-grow overflow-y-auto px-6 pb-40 pt-20 hide-scrollbar">
                <div className="mb-10 flex flex-col items-center text-center animate-fade-in-up">
                    <div className="mb-6 rounded-[2rem] border border-surface-border bg-surface-bg/50 p-6 shadow-lg shadow-black/50 ring-1 ring-brand-accent/20 backdrop-blur-md">
                        <StrengthIcon className="h-16 w-16 text-brand-accent drop-shadow-[0_0_15px_rgba(var(--color-brand-accent-rgb),0.5)]" />
                    </div>
                    <h1 className="mb-3 text-4xl font-display font-black uppercase tracking-tight text-text-primary drop-shadow-md">{activeRoutine.name}</h1>
                    <Tag variant="status" tone="neutral" size="sm">
                        {activeRoutine.flow.length} bloques programados
                    </Tag>
                </div>

                <div className="relative mx-auto w-full max-w-md px-2">
                    <div className="absolute left-[27px] top-6 bottom-6 z-0 w-0.5 bg-surface-border sm:left-[31px]" />
                    <div className="relative z-10 space-y-4">
                        {activeRoutine.flow.map((step, index) => (
                            (step.type === 'exercise' || step.type === 'warmup' || step.type === 'cooldown' || step.type === 'pose')
                                ? <RoutineStepPreview key={`${step.type}-${index}`} step={step} index={index} allExercises={allExercises} />
                                : null
                        ))}
                    </div>
                </div>
            </div>

            <div className="sticky bottom-0 left-0 right-0 z-40 flex flex-col items-center gap-3 bg-gradient-to-t from-bg-base via-bg-base/95 to-transparent p-6 pb-safe">
                <Button
                    variant="primary"
                    size="large"
                    onClick={() => { vibrate(15); onStart(); }}
                    className="relative z-50 w-full max-w-sm animate-pop-in py-5 text-sm font-extrabold uppercase tracking-widest shadow-[0_0_30px_rgba(var(--color-brand-accent-rgb),0.3)] transition-all hover:scale-[1.02] active:scale-95"
                >
                    Comenzar rutina
                </Button>
                <Button
                    variant="ghost"
                    size="small"
                    onClick={() => { vibrate(5); onBack(); }}
                    className="relative z-50 text-[11px] uppercase"
                >
                    Volver
                </Button>
            </div>
        </div>
    );
};

export default RoutinePreStartView;
