import React from 'react';

// --- CONFIGURACIÓN DE LÍMITES POR DEFECTO ---
export const DEFAULT_FAT_ABS_MAX = 90;
export const DEFAULT_FAT_MIN = 55; 
export const DEFAULT_CARB_ABS_MAX = 225;
export const DEFAULT_CARB_MIN = 140; 

// --- HELPER: AXIS TICK ---
export const AxisTick: React.FC<{ 
    pct: number; 
    label: string; 
    value: number; 
    color?: string; 
    align?: 'left' | 'center' | 'right';
}> = ({ pct, label, value, color = 'text-text-secondary', align = 'center' }) => {
    let translate = '-translate-x-1/2';
    if (align === 'left') translate = '-translate-x-0'; 
    if (align === 'right') translate = '-translate-x-full'; 

    return (
        <div className={`absolute top-0 flex flex-col ${align === 'left' ? 'items-start' : align === 'right' ? 'items-end' : 'items-center'} ${translate}`} style={{ left: `${pct}%` }}>
            <div className={`w-px h-1 mb-1 ${color.replace('text-', 'bg-').split('/')[0] + '/20'}`}></div>
            <span className={`text-[7px] font-bold uppercase tracking-widest leading-none mb-0.5 opacity-60 ${color}`}>{label}</span>
            <span className={`text-[9px] font-bold font-mono leading-none ${color}`}>{value.toFixed(0)}</span>
        </div>
    );
};

// --- COMPONENTE: BARRA AVANZADA ---
export const AdvancedMacroRow: React.FC<{
    label: string;
    current: number; 
    ideal: number;
    min: number; 
    absoluteMax: number;
    dynamicLimit: number; 
    colorClass: string;
    unit?: string;
    isProtein?: boolean; 
}> = ({ label, current, ideal, min, absoluteMax, dynamicLimit, colorClass, unit = 'g', isProtein = false }) => {
    
    const totalScale = absoluteMax * 1.05; 
    const getPct = (val: number) => Math.min((val / totalScale) * 100, 100);

    const currentPct = getPct(current);
    const dynamicLimitPct = getPct(dynamicLimit);
    const idealPct = getPct(ideal);
    const minPct = getPct(min);
    const absMaxPct = getPct(absoluteMax);

    const textColorClass = colorClass.replace('bg-', 'text-');

    if (isProtein) {
        const remainingProt = ideal - current;
        const isMet = current >= ideal;
        
        return (
            <div className="mb-8 last:mb-0 relative group">
                <div className="flex justify-between items-end mb-2.5">
                    <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase tracking-widest text-text-primary/70`}>{label}</span>
                        <span className="bg-brand-protein/10 text-brand-protein px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wider border border-brand-protein/20">PRIORIDAD</span>
                    </div>
                    <div className="text-right">
                        <div className="flex flex-col items-end">
                            <div className="flex items-baseline gap-1.5">
                                <span className={`text-2xl font-heading font-bold ${remainingProt < 0 ? 'text-brand-protein' : 'text-text-primary'}`}>
                                    {remainingProt < 0 ? '+' + Math.abs(remainingProt).toFixed(0) : remainingProt.toFixed(0)}
                                </span>
                                <span className="text-[10px] font-bold text-text-secondary opacity-40 uppercase tracking-wider">/ {ideal.toFixed(0)} {unit}</span>
                            </div>
                            {isMet && <span className="text-[9px] font-bold text-brand-protein uppercase tracking-widest mt-0.5">META CUMPLIDA</span>}
                        </div>
                    </div>
                </div>
                
                <div className="h-2 w-full bg-surface-hover rounded-full relative overflow-hidden border border-surface-border/50">
                    <div className="absolute top-0 bottom-0 w-0.5 bg-text-primary z-30" style={{ left: `${idealPct}%` }}></div>
                    <div className={`absolute top-0 bottom-0 h-full transition-all duration-1000 ease-out ${colorClass}`} style={{ left: 0, width: `${currentPct}%` }}>
                    </div>
                </div>
                
                <div className="relative w-full h-7 mt-1.5">
                    <AxisTick pct={0} label="" value={0} align="left" color="text-text-secondary/30" />
                    <AxisTick pct={idealPct} label="META" value={ideal} color="text-text-primary" />
                </div>
            </div>
        );
    }

    const isBelowMin = dynamicLimit < min; 
    const isSqueezed = dynamicLimit < ideal;
    
    const ceiling = Math.min(absoluteMax, dynamicLimit);
    const isFlexing = !isSqueezed && current > ideal && current <= ceiling;
    const displayLimit = (current <= ideal && !isSqueezed) ? ideal : ceiling;
    const isOverLimit = current > ceiling;
    const displayRemaining = displayLimit - current;

    let statusText = '';
    let statusColor = 'text-text-secondary';
    let barColor = colorClass;

    if (isOverLimit) {
        statusText = 'EXCEDIDO';
        statusColor = 'text-red-500';
        barColor = 'bg-red-500';
    } else if (isBelowMin) {
        statusText = 'DÉFICIT CRÍTICO';
        statusColor = 'text-yellow-500';
    } else if (isFlexing) {
        statusText = 'FLEX';
        statusColor = 'text-orange-400';
        barColor = 'bg-orange-400';
    } else if (isSqueezed) {
        statusText = 'REDUCIDO';
        statusColor = 'text-text-primary';
    }

    return (
        <div className="mb-8 last:mb-0 relative group">
            <div className="flex justify-between items-end mb-2.5">
                <div className="flex flex-col">
                    <span className={`text-[10px] font-bold uppercase tracking-widest text-text-primary/70`}>{label}</span>
                    <div className="flex items-baseline gap-1 mt-1">
                        <span className={`text-2xl font-heading font-bold leading-none ${textColorClass}`}>
                            {current.toFixed(0)}
                        </span>
                        <span className={`text-xs font-bold ${textColorClass} opacity-70`}>{unit}</span>
                    </div>
                </div>
                
                <div className="text-right">
                    <div className="flex flex-col items-end">
                        <div className="flex items-baseline gap-1.5">
                            <span className={`text-2xl font-heading font-bold ${displayRemaining < 0 ? 'text-red-500' : isFlexing ? 'text-orange-400' : 'text-text-primary'}`}>
                                {displayRemaining.toFixed(0)}
                            </span>
                            <span className={`text-[10px] font-bold opacity-40 uppercase tracking-wider ${isBelowMin ? 'text-yellow-500' : 'text-text-secondary'}`}>
                                / {displayLimit.toFixed(0)}
                            </span>
                        </div>
                        {statusText && <span className={`text-[9px] font-bold uppercase tracking-widest mt-0.5 ${statusColor}`}>{statusText}</span>}
                    </div>
                </div>
            </div>

            <div className="h-2 w-full bg-surface-hover rounded-full relative overflow-hidden border border-surface-border/50">
                
                {isBelowMin && (
                    <div 
                        className="absolute top-0 bottom-0 z-10 opacity-40 bg-yellow-500/20" 
                        style={{ 
                            left: `${dynamicLimitPct}%`, 
                            width: `${minPct - dynamicLimitPct}%`, 
                        }}
                    ></div>
                )}

                {isSqueezed && (
                    <div 
                        className="absolute top-0 bottom-0 z-0 opacity-20 bg-red-500/20" 
                        style={{ 
                            left: `${dynamicLimitPct}%`, 
                            width: `${idealPct - dynamicLimitPct}%`, 
                        }}
                    ></div>
                )}

                <div className="absolute top-0 bottom-0 w-px bg-yellow-600/30 z-0" style={{ left: `${minPct}%` }}></div>
                {!isSqueezed && <div className="absolute top-0 bottom-0 w-px bg-text-secondary/20 z-0" style={{ left: `${idealPct}%` }}></div>}
                <div className="absolute top-0 bottom-0 w-px bg-red-500/30 z-0" style={{ left: `${absMaxPct}%` }}></div>

                <div className={`absolute top-0 bottom-0 w-0.5 z-30 ${isBelowMin ? 'bg-yellow-400' : 'bg-text-primary'}`} style={{ left: `${dynamicLimitPct}%` }}></div>

                <div className={`absolute top-0 bottom-0 h-full transition-all duration-1000 ease-out ${barColor}`} style={{ left: 0, width: `${currentPct}%` }}>
                </div>
            </div>
            
            <div className="relative w-full h-8 mt-1.5">
                <AxisTick pct={0} label="" value={0} align="left" color="text-text-secondary/30" />
                <AxisTick pct={minPct} label="MIN" value={min} color="text-yellow-600/70" />

                {isSqueezed && (
                    <AxisTick 
                        pct={dynamicLimitPct} 
                        label={isBelowMin ? "LIMITE" : "AJUSTE"} 
                        value={dynamicLimit} 
                        color={isBelowMin ? "text-yellow-500" : "text-text-primary"} 
                    />
                )}

                {!isSqueezed && (
                    <AxisTick pct={idealPct} label="IDEAL" value={ideal} color="text-text-secondary" />
                )}

                <AxisTick pct={absMaxPct} label="MAX" value={absoluteMax} align="right" color="text-red-500/60" />
            </div>
        </div>
    );
};
