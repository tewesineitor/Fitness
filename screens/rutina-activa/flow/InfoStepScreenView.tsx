import React from 'react';
import Button from '../../../components/Button';
import CircularTimer from '../../../components/CircularTimer';
import Tag from '../../../components/Tag';
import { ChevronRightIcon, FireIcon, InformationCircleIcon, StrengthIcon, YogaIcon } from '../../../components/icons';
import { Exercise } from '../../../types';
import { vibrate } from '../../../utils/helpers';
import { INFO_STEP_DURATION } from '../hooks/useInfoStepFlow';

interface PotentiationScreenProps {
    exerciseName: string;
    onStartWorkout: () => void;
}

export const PotentiationScreen: React.FC<PotentiationScreenProps> = ({ exerciseName, onStartWorkout }) => (
    <div className="flex flex-col relative h-full overflow-y-auto hide-scrollbar px-6 py-12 text-center animate-fade-in-up">
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-accent/20 blur-[80px] pointer-events-none" />

        <div className="flex grow flex-col items-center justify-center z-10">
            <div className="mb-8 flex-shrink-0 rounded-3xl border border-surface-border bg-surface-bg/50 p-6 shadow-lg shadow-black/50 ring-1 ring-brand-accent/20 backdrop-blur-md">
                <StrengthIcon className="h-16 w-16 text-brand-accent drop-shadow-[0_0_15px_rgba(var(--color-brand-accent-rgb),0.5)]" />
            </div>

            <Tag variant="status" tone="accent" size="sm" className="mb-4">
                Series de aproximacion
            </Tag>

            <h1 className="mb-8 text-4xl font-display font-black uppercase leading-none tracking-tighter text-text-primary drop-shadow-md sm:text-5xl">
                Preparar
            </h1>

            <div className="w-full max-w-sm">
                <p className="mb-4 break-words text-xl font-bold uppercase tracking-tight text-text-primary">{exerciseName}</p>
                <div className="mx-auto mb-4 h-px w-16 bg-brand-accent/30" />
                <p className="px-4 text-sm font-medium text-text-secondary">
                    Realiza 2-3 series con peso ligero para activar el sistema nervioso antes de tu primera serie de trabajo.
                </p>
            </div>
        </div>

        <div className="mt-8 w-full max-w-sm pb-safe z-10 flex-shrink-0">
            <Button
                variant="primary"
                size="large"
                onClick={() => { vibrate(15); onStartWorkout(); }}
                className="w-full py-5 text-sm font-extrabold uppercase tracking-widest shadow-[0_0_30px_rgba(var(--color-brand-accent-rgb),0.3)] transition-all hover:scale-[1.02] active:scale-95"
            >
                Comenzar set
            </Button>
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

    return (
        <div className="relative flex h-full flex-col overflow-hidden bg-bg-base/50">
            <header className="z-10 flex-shrink-0 px-6 pt-8 text-center animate-fade-in-down">
                <Tag variant="status" tone={isWarmup ? 'protein' : 'accent'} size="sm" className="mx-auto" icon={Icon} count={`${currentItemIndex + 1}/${totalItems}`}>
                    {label}
                </Tag>
            </header>

            <div className="relative z-10 flex w-full flex-grow flex-col items-center justify-center">
                <div className="relative mb-8 flex items-center justify-center scale-110 transform sm:scale-125">
                    <div className={`pointer-events-none absolute inset-0 rounded-full blur-[60px] opacity-20 transition-colors duration-1000 ${progressTone}`} />
                    <CircularTimer
                        initialDuration={INFO_STEP_DURATION}
                        timeLeft={timeLeft}
                        strokeColor={accentClass}
                        size={220}
                        strokeWidth={8}
                        onTick={onTimerTick}
                    />
                </div>

                <div className="w-full max-w-sm px-6 text-center animate-fade-in-up">
                    <h2 className="mb-2 text-3xl font-display font-black uppercase leading-tight tracking-tight text-text-primary drop-shadow-md">
                        {currentExercise.name}
                    </h2>

                    <div className="flex items-center justify-center gap-3">
                        {currentItemReps && (
                            <Tag variant="status" tone="neutral" size="sm">
                                {currentItemReps}
                            </Tag>
                        )}
                        <Button
                            variant="ghost"
                            size="small"
                            onClick={() => { vibrate(5); onShowExerciseDetails(); }}
                            icon={InformationCircleIcon}
                            className="text-xs uppercase"
                        >
                            Tecnica
                        </Button>
                    </div>
                </div>
            </div>

            <footer className="z-20 flex-shrink-0 space-y-4 border-t border-surface-border bg-bg-base px-6 pb-6 pt-6 pb-safe">
                <div className="flex h-1.5 w-full items-center gap-1 rounded-full border border-surface-border bg-surface-bg p-0.5">
                    {Array.from({ length: totalItems }).map((_, index) => (
                            <div key={index} className="relative h-full flex-1 overflow-hidden rounded-full bg-white/5">
                            {index <= currentItemIndex && (
                                <div
                                    className={`absolute inset-0 ${progressTone} ${index === currentItemIndex ? 'animate-progress-fill' : ''}`}
                                    style={index === currentItemIndex ? { width: `${((INFO_STEP_DURATION - timeLeft) / INFO_STEP_DURATION) * 100}%` } : {}}
                                />
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex gap-3">
                    <Button
                        variant="secondary"
                        onClick={() => { vibrate(5); onSkipAll(); }}
                        className="flex-1 text-[10px] uppercase"
                    >
                        Saltar
                    </Button>
                    <Button
                        variant="high-contrast"
                        onClick={() => { vibrate(10); onAdvance(); }}
                        icon={ChevronRightIcon}
                        iconPosition="right"
                        className="flex-[2] text-xs"
                    >
                        Siguiente
                    </Button>
                </div>
            </footer>
        </div>
    );
};

export default InfoStepScreenView;
