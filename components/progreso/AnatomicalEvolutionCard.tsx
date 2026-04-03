import React from 'react';
import Button from '../Button';
import { TapeMeasureIcon, PlusIcon } from '../icons';
import MeasurementModal from '../dialogs/MeasurementModal';
import { useBodyMetricsController } from '@/screens/progreso/hooks/useBodyMetricsController';

const MeasurementItem: React.FC<{ label: string; value?: number | null; unit?: string; diff: number | null }> = ({
    label,
    value,
    unit = 'cm',
    diff,
}) => (
    <div className="flex flex-col items-start p-3 sm:p-4 bg-surface-hover/20 rounded-2xl border border-surface-border/30 hover:bg-surface-hover/50 hover:-translate-y-0.5 transition-all duration-300 group/item cursor-default">
        <span className="text-[10px] sm:text-xs font-bold text-text-secondary uppercase tracking-widest mb-1 group-hover/item:text-brand-accent transition-colors w-full">{label}</span>
        <div className="flex items-baseline gap-1 w-full mt-auto">
            <span className="text-lg sm:text-xl font-heading font-black text-text-primary tracking-tighter">
                {value ? value : '--'}
            </span>
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest flex-shrink-0">{unit}</span>
            {diff !== null && (
                <span className={`text-[10px] font-bold ml-1 ${diff > 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {diff > 0 ? '+' : ''}{diff.toFixed(1)}
                </span>
            )}
        </div>
    </div>
);

const AnatomicalEvolutionCard: React.FC = () => {
    const controller = useBodyMetricsController();
    const { state, actions } = controller;

    return (
        <>
            <div className="bg-surface-bg border border-surface-border rounded-3xl p-5 shadow-lg relative overflow-hidden group h-full flex flex-col">
                <div className="flex justify-between items-start mb-6 relative z-10">
                    <div>
                        <h2 className="text-sm font-heading font-black text-text-primary uppercase tracking-[0.2em] flex items-center gap-2 mb-1">
                            <TapeMeasureIcon className="w-5 h-5 text-brand-accent" />
                            Antropometria
                        </h2>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">
                            {state.latestEntryLabel}
                        </p>
                    </div>
                    <Button 
                        variant="secondary" 
                        size="small" 
                        onClick={actions.openModal}
                        className="!p-2 rounded-full bg-surface-hover border-surface-border hover:bg-white hover:text-black transition-all"
                        icon={PlusIcon}
                    />
                </div>

                <div className="flex-grow flex flex-col justify-center relative z-10 mb-6">
                    <div className="mb-4">
                        <div className="flex items-center justify-between p-4 bg-brand-accent/5 rounded-2xl border border-brand-accent/20 hover:bg-brand-accent/10 hover:-translate-y-0.5 transition-all duration-300">
                            <div>
                                <span className="text-[10px] font-bold text-brand-accent uppercase tracking-widest block mb-1">Peso Actual</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-black text-text-primary tracking-tighter">{state.currentWeight || '--'}</span>
                                    <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">kg</span>
                                    {state.weightDiff !== null && (
                                        <span className={`text-[10px] font-bold ml-1 ${state.weightDiff > 0 ? 'text-red-400' : 'text-green-400'}`}>
                                            {state.weightDiff > 0 ? '+' : ''}{state.weightDiff.toFixed(1)}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-1">Objetivo</span>
                                <div className="flex items-baseline gap-1 justify-end">
                                    <span className="text-xl font-black text-text-primary/60 tracking-tighter">{state.goalWeight !== null ? state.goalWeight.toFixed(1) : '--'}</span>
                                    <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">kg</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 flex-grow">
                        {state.measurementItems.map((item) => (
                            <MeasurementItem
                                key={item.key}
                                label={item.label}
                                value={item.value}
                                unit={item.unit}
                                diff={item.diff}
                            />
                        ))}
                    </div>
                </div>

                <div className="mt-auto pt-4 border-t border-surface-border/50 relative z-10">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Progreso General</span>
                        <span className="text-xs font-black text-brand-accent">{state.goalWeight !== null ? `${state.progressPercent}%` : 'Define objetivo'}</span>
                    </div>
                    <div className="h-2 w-full bg-surface-hover rounded-full overflow-hidden">
                        <div
                            className="h-full bg-brand-accent rounded-full shadow-[0_0_10px_rgba(var(--color-brand-accent-rgb),0.4)]"
                            style={{ width: `${state.progressPercent}%` }}
                        />
                    </div>
                </div>

                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-brand-accent/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-brand-accent/10 transition-colors duration-500"></div>
            </div>

            {state.isModalOpen && <MeasurementModal controller={controller} />}
        </>
    );
};

export default AnatomicalEvolutionCard;
