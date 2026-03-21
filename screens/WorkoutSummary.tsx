
import React, { useContext, useMemo } from 'react';
import { HistorialDeSesionesEntry, DesgloseFuerza, DesgloseTiempo, DesgloseCardioLibre } from '../types';
import { ArrowUpIcon, ArrowDownIcon, StarIcon, ClockIcon, FireIcon, HeartIcon, MountainIcon, StrengthIcon, CheckCircleIcon } from '../components/icons';
import { AppContext } from '../contexts';
import Button from '../components/Button';
import FloatingDock from '../components/FloatingDock';
import { vibrate } from '../utils/helpers';

// --- Reusable Components for this Screen ---

const StatCard: React.FC<{ label: string; value: string; icon: React.FC<{className?: string}>; isPR?: boolean }> = ({ label, value, icon: Icon, isPR = false }) => (
    <div className={`p-4 rounded-2xl flex flex-col items-center justify-center text-center border ${isPR ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-surface-bg border-surface-border shadow-sm'}`}>
        <div className={`p-2 rounded-full mb-2 ${isPR ? 'bg-yellow-500/20 text-yellow-400' : 'bg-surface-hover text-brand-accent'}`}>
            <Icon className="w-5 h-5" />
        </div>
        <p className={`text-3xl font-heading font-bold tracking-tight ${isPR ? 'text-yellow-400' : 'text-text-primary'}`}>{value}</p>
        <p className="text-[9px] font-bold text-text-secondary uppercase tracking-widest mt-0.5">{label}</p>
    </div>
);

const ExerciseSummaryCard: React.FC<{
    currentExercise: DesgloseFuerza;
    isNewPR?: boolean;
}> = ({ currentExercise, isNewPR = false }) => {
    
    // Calculate best set for display
    const bestSet = useMemo(() => {
        if (!currentExercise.sets || currentExercise.sets.length === 0) return null;
        return [...currentExercise.sets].sort((a, b) => b.weight - a.weight || b.reps - a.reps)[0];
    }, [currentExercise.sets]);

    // Calculate total volume
    const volume = useMemo(() => {
        return currentExercise.sets.reduce((acc, s) => acc + (s.weight * s.reps), 0);
    }, [currentExercise.sets]);

    if (!bestSet) return null;

    return (
        <div className="bg-surface-bg p-4 rounded-2xl relative overflow-hidden group border border-surface-border shadow-sm hover:bg-surface-hover transition-colors">
            {isNewPR && (
                <div className="absolute top-0 right-0 p-2">
                    <StarIcon className="w-4 h-4 text-yellow-400" />
                </div>
            )}
            
            <div className="flex justify-between items-start mb-2 pr-6">
                <h3 className="text-lg font-heading font-bold text-white uppercase tracking-wide leading-none">{currentExercise.nombre_ejercicio}</h3>
            </div>

            <div className="flex items-center justify-between mt-2">
                <div className="bg-brand-accent/5 px-3 py-1.5 rounded-lg border border-brand-accent/10">
                    <p className="text-[9px] text-text-secondary uppercase tracking-wider mb-0.5">Mejor Serie</p>
                    <p className="text-base font-heading font-bold text-white tracking-wide">{bestSet.weight}kg <span className="text-text-secondary font-sans text-xs lowercase">x</span> {bestSet.reps}</p>
                </div>
                <div className="text-right">
                    <p className="text-[9px] text-text-secondary uppercase tracking-wider mb-0.5">Volumen</p>
                    <p className="text-sm font-mono text-text-secondary">{volume} kg</p>
                </div>
            </div>
        </div>
    );
};

// --- Cardio Summary --- (Kept mostly similar but ensuring consistent button style)

const CardioStatItem: React.FC<{ icon: React.FC<{className?: string}>, value: string, label: string, unit: string }> = ({ icon: Icon, value, label, unit }) => (
    <div className="p-4 rounded-2xl flex flex-col items-center justify-center text-center bg-surface-bg border border-surface-border shadow-sm">
        <Icon className="w-6 h-6 text-brand-accent mb-2" />
        <p className="text-3xl font-heading font-bold text-text-primary tracking-tight">{value}</p>
        <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">{label} <span className="opacity-50 lowercase">({unit})</span></p>
    </div>
);

const CardioLibreSummary: React.FC<{ entry: HistorialDeSesionesEntry, onExit: () => void }> = ({ entry, onExit }) => {
    const details = entry.desglose_ejercicios[0] as DesgloseCardioLibre;
    
    const titleMap: Record<string, string> = {
        'cardioLibre': 'Carrera',
        'senderismo': 'Senderismo',
        'rucking': 'Rucking',
        'cardio': 'Cardio Progresivo'
    };
    const title = titleMap[entry.tipo_rutina] || 'Actividad';
    const distanceDisplay = details.distance > 0 ? details.distance.toFixed(2) : '0.00';

    return (
        <div className="h-full w-full flex flex-col animate-fade-in-up bg-bg-base overflow-hidden">
            <div className="p-4 sm:p-6 h-full flex flex-col w-full relative">
                <header className="mb-8 flex-shrink-0 pt-4">
                    <p className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span>
                        Resumen de Sesión
                    </p>
                    <h1 className="text-3xl sm:text-4xl font-heading font-black text-text-primary uppercase tracking-tight">{title}</h1>
                    <p className="text-sm font-medium text-text-secondary mt-1">{new Date(entry.fecha_completado).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                </header>
                
                <div className="flex-grow overflow-y-auto space-y-6 hide-scrollbar pb-32">
                    <div className="text-center py-8 relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-accent/5 rounded-full blur-3xl pointer-events-none"></div>
                        <p className="text-9xl font-heading font-black text-text-primary tracking-tighter drop-shadow-lg relative z-10">{distanceDisplay}</p>
                        <p className="text-sm font-bold text-brand-accent uppercase tracking-[0.3em] relative z-10">Kilómetros</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <CardioStatItem icon={ClockIcon} value={details.pace || '-'} label="Ritmo" unit="min/km" />
                        <CardioStatItem icon={ClockIcon} value={`${entry.duracion_total_min}`} label="Tiempo" unit="min" />
                        <CardioStatItem icon={FireIcon} value={`${details.calories || '-'}`} label="Energía" unit="kcal" />
                        <CardioStatItem icon={HeartIcon} value={`${details.heartRate || '-'}`} label="Pulso" unit="ppm" />
                        {entry.tipo_rutina === 'rucking' && details.weightCarried && (
                            <CardioStatItem icon={StrengthIcon} value={`${details.weightCarried}`} label="Peso" unit="kg" />
                        )}
                    </div>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 pb-safe bg-bg-base border-t border-surface-border z-40">
                        <Button 
                            onClick={() => { vibrate(10); onExit(); }} 
                            variant="high-contrast"
                            className="w-full py-5 text-sm shadow-[0_4px_14px_0_rgba(var(--color-text-primary-rgb),0.2)]" 
                            size="large"
                        >
                            FINALIZAR SESIÓN
                        </Button>
                </div>
            </div>
        </div>
    );
};


// --- Main Screen ---

interface WorkoutSummaryScreenProps {
  onExit: () => void;
  isHistoricalView?: boolean;
  historicalEntry: HistorialDeSesionesEntry;
}

export const WorkoutSummaryScreen: React.FC<WorkoutSummaryScreenProps> = ({ onExit, isHistoricalView = false, historicalEntry }) => {
    const { state } = useContext(AppContext)!;
    const { newPRs } = state.session.workoutSummaryData || { newPRs: [] };
    
    if (historicalEntry.tipo_rutina === 'cardioLibre' || historicalEntry.tipo_rutina === 'senderismo' || historicalEntry.tipo_rutina === 'rucking' || historicalEntry.tipo_rutina === 'cardio') {
        return <CardioLibreSummary entry={historicalEntry} onExit={onExit} />;
    }
    
    const totalVolume = historicalEntry.desglose_ejercicios.reduce((total, ex) => {
        if ('sets' in ex && Array.isArray(ex.sets)) {
            return total + ex.sets.reduce((vol, set) => vol + set.weight * set.reps, 0);
        }
        return total;
    }, 0);
    
    const strengthExercises = historicalEntry.desglose_ejercicios.filter(
        (ex): ex is DesgloseFuerza => 'sets' in ex && Array.isArray((ex as DesgloseFuerza).sets) && (ex as DesgloseFuerza).sets.length > 0
    );
    const timedExercises = historicalEntry.desglose_ejercicios.filter((ex): ex is DesgloseTiempo => 'duracion_completada_seg' in ex);

    return (
        <div className="h-full w-full flex flex-col animate-fade-in-up bg-bg-base overflow-hidden">
            <div className="p-4 sm:p-6 h-full flex flex-col w-full relative">
                <header className="mb-6 flex-shrink-0 pt-4">
                    <p className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span>
                        Resumen de Entrenamiento
                    </p>
                    <h1 className="text-2xl sm:text-3xl font-heading font-black text-white uppercase tracking-tight leading-none mb-1 drop-shadow-md">{historicalEntry.nombre_rutina}</h1>
                    <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">{new Date(historicalEntry.fecha_completado).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                </header>

                <div className="flex-grow overflow-y-auto space-y-8 hide-scrollbar pb-32">
                    {/* Overall Stats */}
                    <div className="grid grid-cols-2 gap-3">
                        <StatCard label="Duración" value={`${historicalEntry.duracion_total_min}'`} icon={ClockIcon} />
                        <StatCard label="Volumen Total" value={totalVolume > 0 ? `${(totalVolume / 1000).toFixed(1)}k` : '-'} icon={StrengthIcon} />
                        <StatCard label="Ejercicios" value={`${historicalEntry.desglose_ejercicios.length}`} icon={CheckCircleIcon} />
                        <StatCard label="Nuevos Récords" value={`${newPRs?.length || 0}`} icon={StarIcon} isPR={true} />
                    </div>

                    {/* Per-Exercise Summary List */}
                    {strengthExercises.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 mb-4 px-1">
                                <h3 className="text-xs font-black text-text-secondary uppercase tracking-[0.2em]">Desempeño por Ejercicio</h3>
                            </div>
                            <div className="space-y-3">
                                {strengthExercises.map((ex, index) => (
                                    <ExerciseSummaryCard 
                                        key={index} 
                                        currentExercise={ex} 
                                        isNewPR={!isHistoricalView && newPRs?.includes(ex.exerciseId)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {timedExercises.length > 0 && (
                        <div>
                             <div className="flex items-center gap-2 mb-4 px-1 mt-6">
                                <h3 className="text-xs font-black text-text-secondary uppercase tracking-[0.2em]">Bloques de Tiempo</h3>
                            </div>
                             <div className="space-y-3">
                                {timedExercises.map((ex, i) => {
                                    const duration = ex.duracion_completada_seg;
                                    return (
                                        <div key={i} className="bg-surface-bg p-4 rounded-xl flex justify-between items-center border border-surface-border shadow-sm hover:bg-surface-hover transition-colors">
                                            <p className="font-heading font-bold text-white text-lg uppercase">{ex.nombre_ejercicio}</p>
                                            <p className="text-brand-accent font-heading text-xl font-bold">{Math.floor(duration / 60)}m {duration % 60}s</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Fixed Footer with Solid Button */}
                {/* Fixed Footer with Solid Button */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 pb-safe bg-bg-base border-t border-surface-border z-40">
                        <Button 
                            onClick={() => { vibrate(10); onExit(); }} 
                            variant="high-contrast"
                            className="w-full py-5 text-sm shadow-[0_4px_14px_0_rgba(var(--color-text-primary-rgb),0.2)]" 
                            size="large"
                        >
                            {isHistoricalView ? 'CERRAR RESUMEN' : 'FINALIZAR ENTRENAMIENTO'}
                        </Button>
                </div>
            </div>
        </div>
    );
};
