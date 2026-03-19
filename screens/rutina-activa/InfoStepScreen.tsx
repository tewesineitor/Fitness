
import React, { useState, useEffect, useContext } from 'react';
import { InfoStep } from '../../types';
import { AppContext } from '../../contexts';
import { selectAllExercises } from '../../selectors/workoutSelectors';
import Button from '../../components/Button';
import { CardioIcon, YogaIcon, FireIcon, InformationCircleIcon, StrengthIcon, ChevronRightIcon } from '../../components/icons';
import ExerciseImage from '../../components/ExerciseImage';

interface InfoStepScreenProps {
  step: InfoStep;
  onComplete: () => void;
  onSkipAll: () => void;
  onShowExerciseDetails: (exerciseId: string) => void;
  potentiateExerciseName?: string;
}

const DURATION = 60;

// Potentiation Screen (The "Get Ready" screen)
const PotentiationScreen: React.FC<{ exerciseName: string; onStartWorkout: () => void }> = ({ exerciseName, onStartWorkout }) => (
    <div className="flex flex-col h-full px-6 py-8 justify-center items-center text-center animate-fade-in-up overflow-y-auto hide-scrollbar">
        <div className="flex-grow flex flex-col justify-center items-center w-full">
            <div className="p-6 sm:p-8 bg-brand-accent/5 rounded-full mb-6 border border-brand-accent/20 shadow-[0_0_60px_rgba(var(--color-brand-accent-rgb),0.15)] flex-shrink-0">
                <StrengthIcon className="w-12 h-12 sm:w-16 sm:h-16 text-brand-accent" />
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tighter leading-none mb-6 flex-shrink-0">
                ¡Preparar!
            </h2>
            
            <div className="w-full max-w-sm bg-surface-bg/80 border border-surface-border p-6 rounded-3xl backdrop-blur-md shadow-sm flex-shrink-0">
                <p className="text-[10px] text-text-secondary font-bold mb-2 uppercase tracking-[0.2em]">Aproximación</p>
                <p className="font-black text-white text-lg sm:text-xl uppercase tracking-tight mb-4 break-words">{exerciseName}</p>
                <div className="h-px w-full bg-surface-border mb-4"></div>
                <p className="text-xs sm:text-sm text-text-secondary font-medium">
                    Realiza 2-3 series con poco peso para activar el sistema nervioso.
                </p>
            </div>
        </div>
        
        <div className="w-full max-w-sm mt-6 pb-safe flex-shrink-0">
            <Button variant="high-contrast" size="large" onClick={onStartWorkout} className="w-full py-4 sm:py-5 rounded-full text-sm">
                COMENZAR
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
    
    const currentItem = React.useMemo(() => {
        return step.items[currentItemIndex];
    }, [step.items, currentItemIndex]);
    
    const currentExercise = React.useMemo(() => {
        const exerciseId = currentItem?.exerciseId;
        return exerciseId ? allExercises[exerciseId] : null;
    }, [currentItem, allExercises]);

    useEffect(() => {
        if (!currentExercise || timeLeft <= 0 || showPotentiationInfo) {
            return;
        }
        const timerId = window.setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);
        return () => window.clearInterval(timerId);
    }, [timeLeft, currentExercise, showPotentiationInfo]);
    
    const advanceToNextItem = () => {
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

    useEffect(() => {
        if (timeLeft > 0) return;
        if (showPotentiationInfo) return;
        advanceToNextItem();
    }, [timeLeft, currentItemIndex, step.items.length, onComplete, showPotentiationInfo]);

    if (showPotentiationInfo && potentiateExerciseName) {
        return <PotentiationScreen exerciseName={potentiateExerciseName} onStartWorkout={onComplete} />;
    }

    if (!currentExercise) {
        useEffect(() => { onComplete(); }, [onComplete]);
        return <div>Cargando...</div>;
    }

    const Icon = step.type === 'warmup' ? FireIcon : YogaIcon;
    const reps = currentItem.reps;
    const accentBg = step.type === 'warmup' ? 'bg-brand-fat' : 'bg-brand-accent';

    return (
        <div className="flex flex-col h-full px-6 pt-4 pb-8 overflow-hidden">
            {/* Header */}
            <div className="flex-shrink-0 text-center mb-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-hover border border-surface-border mb-3">
                    <Icon className={`w-3 h-3 ${step.type === 'warmup' ? 'text-brand-fat' : 'text-brand-accent'}`} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">{step.type === 'warmup' ? 'CALENTAMIENTO' : 'ENFRIAMIENTO'}</span>
                </div>
            </div>

            {/* TIMER - NEW POSITION: Large and Centered */}
            <div className="flex justify-center mb-6 flex-shrink-0 animate-fade-in-up">
                 <div className="flex items-center justify-center gap-3 sm:gap-4 bg-surface-bg/50 border border-surface-border px-6 sm:px-8 py-3 sm:py-4 rounded-3xl backdrop-blur-md shadow-sm">
                    <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${accentBg} animate-pulse shadow-[0_0_15px_currentColor]`}></div>
                    <span className="text-4xl sm:text-5xl font-heading font-black text-white tracking-tighter leading-none tabular-nums">
                        {timeLeft}<span className="text-base sm:text-lg ml-1 opacity-50 font-sans font-bold text-text-secondary">s</span>
                    </span>
                 </div>
            </div>

            {/* Content Card (Centered) */}
            <div className="flex-grow flex flex-col items-center justify-center mb-4 min-h-0 overflow-y-auto hide-scrollbar">
                {/* Text Info */}
                <div className="text-center w-full px-2 sm:px-4">
                    <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight leading-tight mb-4 break-words">
                        {currentExercise.name}
                    </h2>
                    {reps && (
                        <p className="text-sm sm:text-base font-bold text-brand-accent uppercase tracking-widest bg-brand-accent/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl inline-block border border-brand-accent/20 mb-6">
                            Objetivo: {reps}
                        </p>
                    )}
                    <Button 
                        variant="tertiary" 
                        size="small" 
                        onClick={() => onShowExerciseDetails(currentExercise.id)} 
                        className="!flex !items-center !justify-center !gap-2 !text-xs !font-bold !text-text-secondary hover:!text-white !uppercase !tracking-widest !mx-auto !bg-surface-bg/50 !px-4 !py-2 !rounded-full !border !border-surface-border"
                        icon={InformationCircleIcon}
                    >
                        Ver Técnica
                    </Button>
                </div>
            </div>

            {/* Footer Controls */}
            <div className="flex-shrink-0 w-full mt-auto space-y-6 pb-safe">
                {/* Progress Bar */}
                <div className="flex items-center gap-1 h-1 w-full px-2">
                    {step.items.map((_, index) => (
                        <div key={index} className={`h-full flex-1 rounded-full bg-white/10 overflow-hidden`}>
                            {index <= currentItemIndex && (
                                <div className={`h-full w-full ${accentBg} ${index === currentItemIndex ? 'animate-progress-fill' : ''}`} style={index === currentItemIndex ? { width: `${((DURATION - timeLeft) / DURATION) * 100}%` } : {}}></div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex gap-3">
                    <Button variant="secondary" onClick={onSkipAll} className="flex-1 !text-[10px] !uppercase !tracking-widest !font-bold">
                        SALTAR TODO
                    </Button>
                    <Button variant="high-contrast" onClick={advanceToNextItem} className="flex-1 font-bold text-xs uppercase tracking-widest shadow-lg">
                        <span className="flex items-center justify-center gap-2">
                            SIGUIENTE <ChevronRightIcon className="w-4 h-4" />
                        </span>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default InfoStepScreen;
