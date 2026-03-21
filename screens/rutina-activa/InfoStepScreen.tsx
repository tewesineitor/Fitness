
import React, { useState, useEffect, useContext, useRef } from 'react';
import { InfoStep } from '../../types';
import { AppContext } from '../../contexts';
import { selectAllExercises } from '../../selectors/workoutSelectors';
import Button from '../../components/Button';
import { FireIcon, YogaIcon, InformationCircleIcon, StrengthIcon, ChevronRightIcon } from '../../components/icons';
import CircularTimer from '../../components/CircularTimer';
import { vibrate } from '../../utils/helpers';

interface InfoStepScreenProps {
  step: InfoStep;
  onComplete: () => void;
  onSkipAll: () => void;
  onShowExerciseDetails: (exerciseId: string) => void;
  potentiateExerciseName?: string;
}

const DURATION = 60;

// Potentiation Screen (The "Get Ready" screen - Premium Redesign)
const PotentiationScreen: React.FC<{ exerciseName: string; onStartWorkout: () => void }> = ({ exerciseName, onStartWorkout }) => (
    <div className="flex flex-col h-full px-6 py-12 justify-center items-center text-center animate-fade-in-up overflow-y-auto hide-scrollbar relative">
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-accent/20 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="flex-grow flex flex-col justify-center items-center w-full z-10">
            <div className="p-6 bg-surface-bg/50 backdrop-blur-md rounded-3xl mb-8 border border-surface-border shadow-lg shadow-black/50 ring-1 ring-brand-accent/20 flex-shrink-0">
                <StrengthIcon className="w-16 h-16 text-brand-accent drop-shadow-[0_0_15px_rgba(var(--color-brand-accent-rgb),0.5)]" />
            </div>
            
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-accent mb-4">
                Series de Aproximación
            </h2>
            
            <h1 className="text-4xl sm:text-5xl font-display font-black text-text-primary uppercase tracking-tighter leading-none flex-shrink-0 drop-shadow-md mb-8">
                ¡PREPARAR!
            </h1>
            
            <div className="w-full max-w-sm">
                <p className="font-bold text-text-primary text-xl uppercase tracking-tight mb-4 break-words">{exerciseName}</p>
                <div className="h-px w-16 mx-auto bg-brand-accent/30 mb-4"></div>
                <p className="text-sm text-text-secondary font-medium px-4">
                    Realiza 2-3 series con peso ligero para activar el sistema nervioso antes de tu primera serie de trabajo.
                </p>
            </div>
        </div>
        
        <div className="w-full max-w-sm mt-8 pb-safe flex-shrink-0 z-10">
            <Button 
                variant="primary" 
                size="large" 
                onClick={() => { vibrate(15); onStartWorkout(); }} 
                className="w-full py-5 rounded-2xl shadow-[0_0_30px_rgba(var(--color-brand-accent-rgb),0.3)] text-sm font-extrabold tracking-widest uppercase hover:scale-[1.02] active:scale-95 transition-all"
            >
                COMENZAR SET
            </Button>
        </div>
    </div>
);

const InfoStepScreen: React.FC<InfoStepScreenProps> = ({ step, onComplete, onSkipAll, onShowExerciseDetails, potentiateExerciseName }) => {
    const { state } = useContext(AppContext)!;
    const allExercises = selectAllExercises(state);
    
    const [currentItemIndex, setCurrentItemIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(DURATION);
    const [showPotentiationInfo, setShowPotentiationInfo] = useState(false);
    
    // For haptic feedback precisely on ticks
    const hasVibratedRef = useRef<{ [key: number]: boolean }>({});

    const currentItem = React.useMemo(() => {
        return step.items[currentItemIndex];
    }, [step.items, currentItemIndex]);
    
    const currentExercise = React.useMemo(() => {
        const exerciseId = currentItem?.exerciseId;
        return exerciseId ? allExercises[exerciseId] : null;
    }, [currentItem, allExercises]);

    const advanceToNextItem = () => {
        hasVibratedRef.current = {}; // Reset vibrations
        if (currentItemIndex < step.items.length - 1) {
            setCurrentItemIndex(i => i + 1);
            setTimeLeft(DURATION);
        } else {
            if (potentiateExerciseName) {
                setShowPotentiationInfo(true);
            } else {
                onComplete();
            }
        }
    };

    // Auto-advance logic integrated into the CircularTimer callback for precision
    const handleTimerTick = (remaining: number) => {
        setTimeLeft(remaining);
        
        // Vibrate at 3, 2, 1
        if (remaining <= 3 && remaining > 0 && !hasVibratedRef.current[remaining]) {
            vibrate(50);
            hasVibratedRef.current[remaining] = true;
        }

        if (remaining <= 0) {
            vibrate([100, 50, 100]); // End sequence
            setTimeout(advanceToNextItem, 0); // Defer state update slightly
        }
    };

    if (showPotentiationInfo && potentiateExerciseName) {
        return <PotentiationScreen exerciseName={potentiateExerciseName} onStartWorkout={onComplete} />;
    }

    if (!currentExercise) {
        useEffect(() => { onComplete(); }, [onComplete]);
        return <div className="flex h-full items-center justify-center text-text-muted">Cargando...</div>;
    }

    const isWarmup = step.type === 'warmup';
    const Icon = isWarmup ? FireIcon : YogaIcon;
    const colorClass = isWarmup ? 'text-brand-fat' : 'text-brand-accent';
    const reps = currentItem.reps;

    return (
        <div className="flex flex-col h-full relative overflow-hidden bg-bg-base/50">
            {/* Header Area */}
            <div className="pt-8 px-6 text-center z-10 flex-shrink-0 animate-fade-in-down">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-bg/80 border border-surface-border backdrop-blur-md shadow-sm">
                    <Icon className={`w-3.5 h-3.5 ${colorClass}`} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-primary">
                        {isWarmup ? 'CALENTAMIENTO' : 'ENFRIAMIENTO'}
                    </span>
                    <span className="text-[10px] font-bold text-text-secondary">
                        {currentItemIndex + 1}/{step.items.length}
                    </span>
                </div>
            </div>

            {/* ZEN MODE: Massive Centered Timer & Info */}
            <div className="flex-grow flex flex-col items-center justify-center z-10 w-full relative">
                
                {/* Visual Timer */}
                <div className="relative flex items-center justify-center mb-8 transform scale-110 sm:scale-125">
                    {/* Ambient glow matching timer color */}
                    <div className={`absolute inset-0 rounded-full blur-[60px] opacity-20 pointer-events-none transition-colors duration-1000 ${isWarmup ? 'bg-brand-fat' : 'bg-brand-accent'}`}></div>
                    
                    <CircularTimer 
                        initialDuration={DURATION} 
                        timeLeft={timeLeft} 
                        strokeColor={colorClass}
                        size={220}
                        strokeWidth={8}
                        onTick={handleTimerTick}
                    />
                </div>

                {/* Exercise Info strictly contained below the timer */}
                <div className="text-center w-full px-6 max-w-sm animate-fade-in-up">
                    <h2 className="text-3xl font-display font-black text-text-primary uppercase tracking-tight leading-tight mb-2 drop-shadow-md">
                        {currentExercise.name}
                    </h2>
                    
                    <div className="flex items-center justify-center gap-3">
                        {reps && (
                            <span className="text-sm font-bold text-text-primary uppercase tracking-widest bg-surface-bg/50 px-3 py-1 rounded-lg border border-surface-border">
                                {reps}
                            </span>
                        )}
                        <button 
                            onClick={() => { vibrate(5); onShowExerciseDetails(currentExercise.id); }}
                            className="text-xs font-bold text-text-secondary hover:text-text-primary uppercase tracking-widest flex items-center gap-1 transition-colors px-2 py-1"
                        >
                            <InformationCircleIcon className="w-4 h-4" />
                            Técnica
                        </button>
                    </div>
                </div>
            </div>

            {/* Fixed Bottom Controls */}
            <div className="flex-shrink-0 pb-safe pb-6 px-6 pt-6 bg-bg-base border-t border-surface-border z-20 space-y-4">
                {/* Progress Strip */}
                <div className="flex items-center gap-1 h-1.5 w-full bg-surface-bg rounded-full p-0.5 border border-surface-border">
                    {step.items.map((_, index) => (
                        <div key={index} className={`h-full flex-1 rounded-full bg-white/5 overflow-hidden relative`}>
                            {index <= currentItemIndex && (
                                <div 
                                    className={`absolute inset-0 ${isWarmup ? 'bg-brand-fat' : 'bg-brand-accent'} ${index === currentItemIndex ? 'animate-progress-fill' : ''}`} 
                                    style={index === currentItemIndex ? { width: `${((DURATION - timeLeft) / DURATION) * 100}%` } : {}}
                                />
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex gap-3">
                    <Button 
                        variant="tertiary" 
                        onClick={() => { vibrate(5); onSkipAll(); }} 
                        className="flex-1 !bg-surface-bg !border-surface-border hover:!bg-surface-hover hover:text-text-primary text-text-muted font-bold text-[10px] uppercase tracking-widest"
                    >
                        SALTAR
                    </Button>
                    <Button 
                        variant="secondary" 
                        onClick={() => { vibrate(10); advanceToNextItem(); }} 
                        className="flex-[2] bg-text-primary text-bg-base font-extrabold text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(var(--color-text-primary-rgb),0.2)] hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        <span className="flex items-center justify-center gap-1">
                            SIGUIENTE <ChevronRightIcon className="w-4 h-4" />
                        </span>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default InfoStepScreen;
