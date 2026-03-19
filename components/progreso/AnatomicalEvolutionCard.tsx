import React, { useState, useContext } from 'react';
import { AppContext } from '../../contexts';
import Button from '../Button';
import { TapeMeasureIcon, PlusIcon } from '../icons';
import MeasurementModal from '../dialogs/MeasurementModal';

const MeasurementItem: React.FC<{ label: string; value?: number; unit?: string }> = ({ label, value, unit = "cm" }) => (
    <div className="flex flex-col items-start p-3 sm:p-4 bg-surface-hover/20 rounded-2xl border border-surface-border/30 hover:bg-surface-hover/40 transition-all group/item">
        <span className="text-[10px] sm:text-xs font-bold text-text-secondary uppercase tracking-widest mb-1 group-hover/item:text-brand-accent transition-colors w-full">{label}</span>
        <div className="flex items-baseline gap-1 w-full mt-auto">
            <span className="text-lg sm:text-xl font-heading font-black text-text-primary tracking-tighter">
                {value ? value : '--'}
            </span>
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest flex-shrink-0">{unit}</span>
        </div>
    </div>
);

const AnatomicalEvolutionCard: React.FC = () => {
    const { state } = useContext(AppContext)!;
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Get history
    const history = state.progress.metricHistory;
    const latestEntry = history.length > 0 ? history[history.length - 1] : null;
    const previousEntry = history.length > 1 ? history[history.length - 2] : null;

    const getDiff = (current?: number, prev?: number) => {
        if (current === undefined || prev === undefined) return null;
        const diff = current - prev;
        if (diff === 0) return null;
        return (
            <span className={`text-[10px] font-bold ml-1 ${diff > 0 ? 'text-red-400' : 'text-green-400'}`}>
                {diff > 0 ? '+' : ''}{diff.toFixed(1)}
            </span>
        );
    };

    return (
        <>
            <div className="bg-surface-bg border border-surface-border rounded-3xl p-5 shadow-lg relative overflow-hidden group h-full flex flex-col">
                <div className="flex justify-between items-start mb-6 relative z-10">
                    <div>
                        <h2 className="text-sm font-heading font-black text-text-primary uppercase tracking-[0.2em] flex items-center gap-2 mb-1">
                            <TapeMeasureIcon className="w-5 h-5 text-brand-accent" />
                            Antropometría
                        </h2>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">
                            {latestEntry ? new Date(latestEntry.fecha_registro).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) : 'Sin datos'}
                        </p>
                    </div>
                    <Button 
                        variant="secondary" 
                        size="small" 
                        onClick={() => setIsModalOpen(true)}
                        className="!p-2 rounded-full bg-surface-hover border-surface-border hover:bg-white hover:text-black transition-all"
                        icon={PlusIcon}
                    />
                </div>

                <div className="flex-grow flex flex-col justify-center relative z-10 mb-6">
                    <div className="mb-4">
                        <div className="flex items-center justify-between p-4 bg-brand-accent/5 rounded-2xl border border-brand-accent/20">
                            <div>
                                <span className="text-[10px] font-bold text-brand-accent uppercase tracking-widest block mb-1">Peso Actual</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-black text-text-primary tracking-tighter">{latestEntry?.peso_kg || '--'}</span>
                                    <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">kg</span>
                                    {getDiff(latestEntry?.peso_kg, previousEntry?.peso_kg)}
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-1">Objetivo</span>
                                <div className="flex items-baseline gap-1 justify-end">
                                    <span className="text-xl font-black text-text-primary/60 tracking-tighter">75.0</span>
                                    <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">kg</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 flex-grow">
                        <MeasurementItem label="Cintura" value={latestEntry?.cintura_cm} />
                        <MeasurementItem label="Caderas" value={latestEntry?.caderas_cm} />
                        <MeasurementItem label="Pecho" value={latestEntry?.pecho_cm} />
                        <MeasurementItem label="Hombros" value={latestEntry?.hombros_cm} />
                        <MeasurementItem label="Muslo" value={latestEntry?.muslo_cm} />
                        <MeasurementItem label="Bíceps" value={latestEntry?.biceps_cm} />
                    </div>
                </div>

                {/* Progress Indicator */}
                <div className="mt-auto pt-4 border-t border-surface-border/50 relative z-10">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Progreso General</span>
                        <span className="text-xs font-black text-brand-accent">65%</span>
                    </div>
                    <div className="h-2 w-full bg-surface-hover rounded-full overflow-hidden">
                        <div className="h-full bg-brand-accent rounded-full w-[65%] shadow-[0_0_10px_rgba(var(--color-brand-accent-rgb),0.4)]"></div>
                    </div>
                </div>

                {/* Background Decoration */}
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-brand-accent/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-brand-accent/10 transition-colors duration-500"></div>
            </div>

            {isModalOpen && <MeasurementModal onClose={() => setIsModalOpen(false)} />}
        </>
    );
};

export default AnatomicalEvolutionCard;
