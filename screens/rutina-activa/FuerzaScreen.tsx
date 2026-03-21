
import React, { useState, useMemo, useContext, useEffect } from 'react';
import { StrengthStep, LoggedSet, DesgloseFuerza, RoutineStep } from '../../types';
import Button from '../../components/Button';
import IconButton from '../../components/IconButton';
import Tag from '../../components/Tag';
import { InformationCircleIcon, ClockIcon, ChartBarIcon, CalendarIcon, StrengthIcon, CalculatorIcon, CheckIcon } from '../../components/icons';
import { AppContext } from '../../contexts';
import { selectHistorialDeSesiones, selectAllExercises } from '../../selectors/workoutSelectors';
import { vibrate } from '../../utils/helpers';
import PlateCalculatorModal from '../../components/dialogs/PlateCalculatorModal';
import NextUpIndicator from '../../components/NextUpIndicator';

interface FuerzaScreenProps {
    step: StrengthStep;
    onSetComplete: (setLog: LoggedSet) => void;
    loggedSets: LoggedSet[];
    onShowExerciseDetails: () => void;
    nextStep?: RoutineStep;
}

const FuerzaScreen: React.FC<FuerzaScreenProps> = ({ step, onSetComplete, loggedSets, onShowExerciseDetails, nextStep }) => {
    const { state } = useContext(AppContext)!;
    const activeRoutine = state.session.activeRoutine;
    const technicalFocus = activeRoutine?.technicalFocus;

    const historialDeSesiones = selectHistorialDeSesiones(state);
    const allExercises = selectAllExercises(state);
    const exercise = allExercises[step.exerciseId];
    const [showCalculator, setShowCalculator] = useState(false);

    // Filter historical sessions to find the last time this exercise was performed
    const previousSessionData = useMemo(() => {
        const prevSession = [...historialDeSesiones]
            .sort((a, b) => new Date(b.fecha_completado).getTime() - new Date(a.fecha_completado).getTime())
            .find(s => s.desglose_ejercicios.some(e => 'exerciseId' in e && e.exerciseId === step.exerciseId));
        
        if (!prevSession) return null;
        
        const exerciseData = prevSession.desglose_ejercicios.find(e => 'exerciseId' in e && e.exerciseId === step.exerciseId) as DesgloseFuerza;
        if (!exerciseData || !exerciseData.sets) return null;

        return {
            date: new Date(prevSession.fecha_completado),
            sets: exerciseData.sets
        };
    }, [historialDeSesiones, step.exerciseId]);
    
    const currentSetIndex = loggedSets.length;
    const isFinished = currentSetIndex >= step.sets;
    
    // Auto-fill logic based on previous set or previous session
    const initialSet = useMemo(() => {
        if (currentSetIndex > 0) return loggedSets[currentSetIndex - 1];
        if (previousSessionData && previousSessionData.sets[currentSetIndex]) {
            const prevSet = previousSessionData.sets[currentSetIndex];
            return { weight: prevSet.weight, reps: prevSet.reps };
        }
        return { weight: 0, reps: 0 };
    }, [currentSetIndex, loggedSets, previousSessionData]);

    const [weight, setWeight] = useState<string>('');
    const [reps, setReps] = useState<string>('');
    const [rir, setRir] = useState<number | null>(null);

    useEffect(() => {
        setWeight(initialSet.weight > 0 ? initialSet.weight.toString() : '');
        setReps(initialSet.reps > 0 ? initialSet.reps.toString() : '');
        setRir(null);
    }, [initialSet, currentSetIndex]);
    
    const handleCompleteSet = () => {
        vibrate(20);
        onSetComplete({ 
            weight: parseFloat(weight) || 0, 
            reps: parseInt(reps) || 0,
            rir: rir ?? undefined
        });
    };

    const getRelativeTime = (date: Date) => {
        const diff = new Date().getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        if (days === 0) return 'Hoy';
        if (days === 1) return 'Ayer';
        return `Hace ${days} d`;
    };

    const prevSetData = previousSessionData?.sets[currentSetIndex];
    
    return (
        <div className="flex flex-col h-full relative bg-bg-base/50 overflow-hidden">
            {showCalculator && (
                <PlateCalculatorModal 
                    targetWeight={parseFloat(weight) || 20} 
                    onClose={() => setShowCalculator(false)} 
                />
            )}
            
            <div className="flex-grow overflow-y-auto px-6 pt-6 pb-40 hide-scrollbar flex flex-col">
                
                {/* HUD Header */}
                <div className="flex flex-col gap-2 flex-shrink-0 animate-fade-in-down">
                    <div className="flex justify-between items-start">
                        <div>
                            <Tag tone="protein" variant="status" className="mb-3">
                                LOGGING SET {currentSetIndex + 1}/{step.sets}
                            </Tag>
                            <h1 className="text-3xl sm:text-4xl font-display font-black text-text-primary uppercase tracking-tight leading-none drop-shadow-md pr-4">
                                {step.title}
                            </h1>
                        </div>
                        <IconButton 
                            onClick={() => { vibrate(5); onShowExerciseDetails(); }}
                            variant="icon-only"
                            icon={InformationCircleIcon}
                            label="Ver Técnica"
                        />
                    </div>

                    {/* HUD Stats Row */}
                    <div className="flex items-center gap-3 mt-2 opacity-80">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-text-secondary uppercase tracking-widest">
                            <ChartBarIcon className="w-4 h-4 text-brand-accent" />
                            Target: <span className="text-brand-accent">{step.reps}</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-surface-border"></div>
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-text-secondary uppercase tracking-widest">
                            <ClockIcon className="w-4 h-4 text-brand-accent" />
                            Descanso: <span className="text-brand-accent">{step.rest}s</span>
                        </div>
                    </div>
                </div>

                {technicalFocus && (
                    <div className="mt-6 p-4 rounded-2xl bg-brand-accent/5 border border-brand-accent/20 flex items-start gap-3 backdrop-blur-sm animate-fade-in-up">
                        <InformationCircleIcon className="w-5 h-5 text-brand-accent flex-shrink-0 mt-0.5" />
                        <p className="text-xs font-medium text-text-primary leading-relaxed shadow-sm">{technicalFocus}</p>
                    </div>
                )}

                {!isFinished && (
                    <div className="flex-grow flex flex-col justify-center mt-8 space-y-8 min-h-[300px]">
                        
                        {/* THE MASSIVE INPUTS */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Weight Input */}
                            <div className="bg-surface-bg/60 backdrop-blur-md border border-surface-border rounded-[2rem] p-5 relative shadow-sm flex flex-col group focus-within:border-brand-accent/50 focus-within:ring-1 focus-within:ring-brand-accent/50 transition-all">
                                <div className="flex justify-between items-center mb-4">
                                    <label className="text-xs font-bold text-text-secondary uppercase tracking-[0.2em]">Carga (kg)</label>
                                    <IconButton 
                                        onClick={() => { vibrate(5); setShowCalculator(true); }}
                                        variant="ghost"
                                        size="small"
                                        icon={CalculatorIcon}
                                        label="Calculadora"
                                    />
                                </div>
                                <input 
                                    type="number" 
                                    value={weight} 
                                    onChange={(e) => setWeight(e.target.value)} 
                                    className="w-full bg-transparent text-center text-5xl sm:text-6xl font-display font-black text-text-primary outline-none p-0 leading-none placeholder:text-text-muted tracking-tighter"
                                    placeholder="0"
                                    inputMode="decimal"
                                />
                                {prevSetData && (
                                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-surface-bg border border-surface-border px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md whitespace-nowrap">
                                        <CalendarIcon className="w-3 h-3 text-text-muted" />
                                        <span className="text-[9px] font-bold uppercase tracking-widest text-text-muted">Previo: <span className="text-text-primary">{prevSetData.weight}kg</span></span>
                                    </div>
                                )}
                            </div>

                            {/* Reps Input */}
                            <div className="bg-surface-bg/60 backdrop-blur-md border border-surface-border rounded-[2rem] p-5 relative shadow-sm flex flex-col focus-within:border-brand-accent/50 focus-within:ring-1 focus-within:ring-brand-accent/50 transition-all">
                                <label className="text-xs font-bold text-text-secondary uppercase tracking-[0.2em] mb-4">Reps</label>
                                <input 
                                    type="number" 
                                    value={reps} 
                                    onChange={(e) => setReps(e.target.value)} 
                                    className="w-full bg-transparent text-center text-5xl sm:text-6xl font-display font-black text-text-primary outline-none p-0 leading-none placeholder:text-text-muted tracking-tighter mt-auto"
                                    placeholder="0"
                                    inputMode="numeric"
                                />
                                {prevSetData && (
                                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-surface-bg border border-surface-border px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md whitespace-nowrap">
                                        <span className="text-[9px] font-bold uppercase tracking-widest text-text-muted">Previo: <span className="text-text-primary">{prevSetData.reps}</span></span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* PREMIUM RIR SELECTOR */}
                        <div className="w-full animate-fade-in-up" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
                            <div className="flex items-center justify-between mb-3 px-1">
                                <p className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em]">Reps en Reserva (RIR)</p>
                                <InformationCircleIcon className="w-4 h-4 text-text-muted opacity-50" />
                            </div>
                            <div className="bg-surface-bg/80 backdrop-blur-md p-1.5 rounded-[1.5rem] border border-surface-border flex">
                                {[0, 1, 2, 3].map((val) => {
                                    const isSelected = rir === val;
                                    return (
                                        <button
                                            key={val}
                                            onClick={() => { vibrate(5); setRir(val); }}
                                            className={`
                                                flex-1 py-3 sm:py-4 rounded-[1.25rem] text-sm font-bold transition-all duration-300 relative
                                                ${isSelected ? 'text-black shadow-sm' : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'}
                                            `}
                                        >
                                            {isSelected && (
                                                <div className="absolute inset-0 bg-brand-accent rounded-[1.25rem] shadow-[0_0_15px_rgba(var(--color-brand-accent-rgb),0.3)] pointer-events-none layout-transition"></div>
                                            )}
                                            <span className="relative z-10">{val === 3 ? '3+' : val}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* CURRENT SESSION LOGGER TAPE */}
                <div className="mt-8 mb-4 flex-shrink-0 flex justify-center">
                    <div className="flex gap-2.5 overflow-x-auto hide-scrollbar px-4 py-2">
                        {Array.from({ length: step.sets }).map((_, i) => {
                            const isLogged = i < currentSetIndex;
                            const isCurrent = i === currentSetIndex;

                            return (
                                <div key={i} className={`
                                    flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0 transition-all duration-300
                                    ${isLogged 
                                        ? 'bg-brand-accent text-brand-accent-foreground shadow-[0_0_12px_rgba(var(--color-brand-accent-rgb),0.4)]' 
                                        : isCurrent 
                                            ? 'bg-surface-bg ring-2 ring-brand-accent text-text-primary scale-110 shadow-md' 
                                            : 'bg-surface-hover/60 text-text-muted opacity-60'
                                    }
                                `}>
                                    {isLogged ? (
                                        <CheckIcon className="w-5 h-5 text-brand-accent-foreground" />
                                    ) : (
                                        <span className={`text-[11px] font-bold uppercase tracking-widest ${isCurrent ? 'text-text-primary shadow-sm' : ''}`}>S{i+1}</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {nextStep && (
                    <div className="mt-auto pt-4">
                        <NextUpIndicator step={nextStep} />
                    </div>
                )}
            </div>

            {/* FIXED ACTION FOOTER */}
            {!isFinished && (
                <div className="absolute bottom-0 left-0 right-0 p-6 pb-safe bg-bg-base border-t border-surface-border shadow-[0_-8px_24px_-8px_rgba(0,0,0,0.08)] z-40">
                    <Button 
                        variant="primary"
                        onClick={handleCompleteSet} 
                        size="large" 
                        className="w-full max-w-sm mx-auto"
                    >
                        REGISTRAR SERIE
                    </Button>
                </div>
            )}
        </div>
    );
};

export default FuerzaScreen;
