
import React, { useState, useMemo, useContext, useEffect } from 'react';
import { StrengthStep, LoggedSet, DesgloseFuerza, RoutineStep } from '../../types';
import Button from '../../components/Button';
import { InformationCircleIcon, ClockIcon, ChartBarIcon, CalendarIcon, StrengthIcon, CalculatorIcon } from '../../components/icons';
import { AppContext } from '../../contexts';
import { selectHistorialDeSesiones, selectAllExercises } from '../../selectors/workoutSelectors';
import ExerciseImage from '../../components/ExerciseImage';
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

    // Logic to find the most recent previous session containing this specific exercise
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
    
    // Auto-fill logic
    const initialSet = useMemo(() => {
        // 1. If we have done a set in *this* session (e.g. Set 1 done, doing Set 2), copy Set 1's weight
        if (currentSetIndex > 0) return loggedSets[currentSetIndex - 1];
        
        // 2. If it's Set 1, try to copy Set 1 from the *previous* session
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
        // Haptic Feedback: Short distinct pulse
        if (navigator.vibrate) navigator.vibrate(50);
        onSetComplete({ 
            weight: parseFloat(weight) || 0, 
            reps: parseInt(reps) || 0,
            rir: rir ?? undefined
        });
    };

    // Helper for relative time (e.g. "Hace 3 días")
    const getRelativeTime = (date: Date) => {
        const diff = new Date().getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        if (days === 0) return 'Hoy';
        if (days === 1) return 'Ayer';
        return `Hace ${days} días`;
    };
    
    return (
        <div className="flex flex-col h-full relative">
            {showCalculator && (
                <PlateCalculatorModal 
                    targetWeight={parseFloat(weight) || 20} 
                    onClose={() => setShowCalculator(false)} 
                />
            )}
            
            <div className="flex-grow overflow-y-auto px-5 pt-2 pb-32 hide-scrollbar">
                {/* --- Header Area --- */}
                <div className="flex justify-between items-start gap-4 mb-4 flex-shrink-0">
                    <div className="flex-grow min-w-0">
                        {/* Activity Badge */}
                        <div className="inline-flex items-center gap-2 mb-2 px-2 py-1 rounded bg-brand-protein/10 border border-brand-protein/20 self-start">
                            <StrengthIcon className="w-3 h-3 text-brand-protein" />
                            <span className="text-[9px] font-bold text-brand-protein uppercase tracking-[0.2em]">Fuerza</span>
                        </div>

                        <h1 className="text-2xl sm:text-3xl font-heading font-black text-white uppercase tracking-tight leading-none mb-3 drop-shadow-sm break-words">
                            {step.title}
                        </h1>
                        
                        {/* Tactical Data Bar */}
                        <div className="flex flex-wrap gap-1.5">
                            <div className="inline-flex items-center gap-1 bg-surface-hover px-2 py-1 rounded border border-surface-border">
                                <ChartBarIcon className="w-2.5 h-2.5 text-brand-accent" />
                                <span className="text-[9px] font-bold text-text-secondary uppercase tracking-wider">Meta: <span className="text-white">{step.reps}</span></span>
                            </div>
                            <div className="inline-flex items-center gap-1 bg-surface-hover px-2 py-1 rounded border border-surface-border">
                                <ClockIcon className="w-2.5 h-2.5 text-brand-accent" />
                                <span className="text-[9px] font-bold text-text-secondary uppercase tracking-wider">Descanso: <span className="text-white">{step.rest}s</span></span>
                            </div>
                            <Button 
                                variant="tertiary" 
                                size="small" 
                                onClick={onShowExerciseDetails} 
                                className="!inline-flex !items-center !gap-1 !bg-surface-hover !px-2 !py-1 !rounded !border !border-surface-border hover:!bg-surface-hover/80 !text-[9px] !font-bold !text-text-secondary !uppercase !tracking-wider"
                                icon={InformationCircleIcon}
                            >
                                Ver Técnica
                            </Button>
                        </div>
                    </div>

                    {/* Compact Thumbnail */}
                    <div className="w-16 h-16 bg-surface-bg border border-surface-border rounded-xl overflow-hidden flex-shrink-0 shadow-sm relative">
                         <ExerciseImage exercise={exercise} className="w-full h-full object-cover opacity-80" />
                    </div>
                </div>

                {/* --- TECHNICAL FOCUS BANNER --- */}
                {technicalFocus && (
                    <div className="w-full bg-brand-accent/10 border border-brand-accent/20 rounded-lg p-3 mb-6 flex items-start gap-3 animate-fade-in-up shadow-[0_0_15px_rgba(var(--color-brand-accent-rgb),0.1)]">
                        <div className="bg-brand-accent/20 p-1.5 rounded-full text-brand-accent mt-0.5 flex-shrink-0">
                            <InformationCircleIcon className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-brand-accent uppercase tracking-widest mb-0.5">Foco Técnico</p>
                            <p className="text-xs font-medium text-white leading-snug">{technicalFocus}</p>
                        </div>
                    </div>
                )}

                {/* --- HISTORICAL REFERENCE BLOCK --- */}
                {previousSessionData && (
                    <div className="flex-shrink-0 mb-6 animate-fade-in-up">
                        <div className="bg-surface-hover/80 border border-brand-accent/20 rounded-xl p-3 backdrop-blur-md shadow-sm">
                            <div className="flex items-center gap-2 mb-2 opacity-70">
                                <CalendarIcon className="w-3 h-3 text-brand-accent" />
                                <span className="text-[9px] font-bold text-brand-accent uppercase tracking-widest">
                                    Última vez ({getRelativeTime(previousSessionData.date)})
                                </span>
                            </div>
                            
                            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
                                {previousSessionData.sets.map((s, idx) => {
                                    const isCorrespondingSet = idx === currentSetIndex;
                                    return (
                                        <div 
                                            key={idx} 
                                            className={`
                                                flex-shrink-0 px-3 py-1.5 rounded-lg border flex flex-col items-center min-w-[70px] transition-all duration-300
                                                ${isCorrespondingSet 
                                                    ? 'bg-brand-accent text-black border-brand-accent shadow-[0_0_15px_rgba(var(--color-brand-accent-rgb),0.3)] transform scale-105' 
                                                    : 'bg-surface-hover text-text-secondary border-surface-border'
                                                }
                                            `}
                                        >
                                            <span className={`text-[8px] uppercase tracking-wider font-bold mb-0.5 ${isCorrespondingSet ? 'text-black/60' : 'text-text-secondary/50'}`}>
                                                Set {idx + 1}
                                            </span>
                                            <span className="font-heading text-lg font-bold whitespace-nowrap">
                                                {s.weight} <span className="text-[10px] font-medium opacity-80 font-sans">kg</span> × {s.reps}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* --- CURRENT SET INDICATOR --- */}
                <div className="flex-shrink-0 flex justify-center mb-6">
                    <div className="flex items-center gap-1.5 bg-surface-hover p-1.5 rounded-full border border-surface-border shadow-sm">
                        {Array.from({ length: step.sets }).map((_, i) => (
                            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i < currentSetIndex ? 'w-4 bg-brand-accent' : i === currentSetIndex ? 'w-8 bg-white shadow-[0_0_10px_white]' : 'w-4 bg-white/10'}`}></div>
                        ))}
                    </div>
                </div>

                {/* --- INPUTS --- */}
                {!isFinished && (
                    <div className="flex-grow flex justify-center gap-3 mb-4">
                        
                        {/* Weight Section */}
                        <div className="flex-1 bg-surface-bg border border-surface-border rounded-2xl p-4 relative shadow-sm flex flex-col">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em]">Carga (kg)</label>
                                {/* Plate Calculator Button */}
                                <Button 
                                    variant="tertiary"
                                    size="small"
                                    onClick={() => setShowCalculator(true)} 
                                    className="!flex !items-center !gap-1 !px-1.5 !py-0.5 !rounded !bg-surface-hover hover:!bg-surface-hover/80 !text-[8px] !font-bold !text-brand-accent !uppercase !tracking-wider !border !border-surface-border"
                                    icon={CalculatorIcon}
                                >
                                    Calc
                                </Button>
                            </div>
                            <input 
                                type="number" 
                                value={weight} 
                                onChange={(e) => setWeight(e.target.value)} 
                                className="w-full bg-transparent text-center text-4xl font-heading font-black text-white outline-none p-0 leading-none placeholder:text-white/10 tracking-tight mt-auto"
                                placeholder="0"
                            />
                        </div>

                        {/* Reps Section */}
                        <div className="flex-1 bg-surface-bg border border-surface-border rounded-2xl p-4 relative shadow-sm flex flex-col">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em]">Reps</label>
                            </div>
                            <input 
                                type="number" 
                                value={reps} 
                                onChange={(e) => setReps(e.target.value)} 
                                className="w-full bg-transparent text-center text-4xl font-heading font-black text-white outline-none p-0 leading-none placeholder:text-white/10 tracking-tight mt-auto"
                                placeholder="0"
                            />
                        </div>
                    </div>
                )}

                {/* --- RIR SELECTOR --- */}
                {!isFinished && (
                    <div className="mb-6 animate-fade-in-up">
                        <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2 pl-1">Reps en Reserva (RIR)</p>
                        <div className="grid grid-cols-4 gap-2">
                            {[0, 1, 2, 3].map((val) => (
                                <button
                                    key={val}
                                    onClick={() => setRir(val)}
                                    className={`
                                        py-3 rounded-xl border transition-all duration-200 font-bold text-sm
                                        ${rir === val 
                                            ? 'bg-brand-accent text-black border-brand-accent shadow-[0_0_10px_rgba(var(--color-brand-accent-rgb),0.4)] scale-105' 
                                            : 'bg-surface-bg text-text-secondary border-surface-border hover:bg-surface-hover'
                                        }
                                    `}
                                >
                                    {val === 3 ? '3+' : val}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- CURRENT SESSION HISTORY (Compact Strip) --- */}
                {loggedSets.length > 0 && (
                    <div className="mt-2 border-t border-surface-border pt-3">
                        <p className="text-[9px] font-bold text-text-secondary uppercase tracking-widest mb-2 pl-1">Sesión Actual</p>
                        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar justify-center">
                            {loggedSets.map((set, i) => (
                                <div key={i} className="flex flex-col items-center bg-black/40 px-3 py-1.5 rounded-lg border border-surface-border min-w-[60px]">
                                    <span className="text-[8px] text-text-secondary uppercase mb-0.5">Set {i+1}</span>
                                    <span className="text-sm font-heading font-bold text-white">{set.weight}x{set.reps}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {nextStep && (
                    <div className="mt-4 mb-2">
                        <NextUpIndicator step={nextStep} />
                    </div>
                )}
            </div>

            {/* --- FIXED ACTION BUTTON --- */}
            <div className="absolute bottom-0 left-0 right-0 p-5 pb-safe bg-gradient-to-t from-black via-black/95 to-transparent z-20">
                <Button 
                    variant="high-contrast"
                    onClick={handleCompleteSet} 
                    size="large" 
                    className="w-full py-3 sm:py-4 rounded-full shadow-lg text-sm"
                >
                    REGISTRAR SERIE {currentSetIndex + 1}
                </Button>
            </div>
        </div>
    );
};
export default FuerzaScreen;
