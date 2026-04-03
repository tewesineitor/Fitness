import React, { useState, useEffect } from 'react';
import { DailyGoals } from '../../types';
import { FireIcon, ArrowDownIcon, CalculatorIcon } from '../icons';
import Button from '../Button';
import Input from '../Input';
import SectionHeader from '../legacy/SectionHeader';

interface MacroSettingsProps {
    goals: DailyGoals;
    setGoals: React.Dispatch<React.SetStateAction<DailyGoals>>;
    showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const MacroSettings: React.FC<MacroSettingsProps> = ({ goals, setGoals, showToast }) => {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [nextAutoMode, setNextAutoMode] = useState<'balanced' | 'strict' | 'relaxed'>('balanced');
    const [activeModeLabel, setActiveModeLabel] = useState<string | null>(null);

    // Auto-calculate Calories when Macros change
    useEffect(() => {
        const calculatedKcal = (goals.protein * 4) + (goals.carbs * 4) + (goals.fat * 9);
        if (Math.abs(calculatedKcal - goals.kcal) > 1) {
            setGoals(prev => ({ ...prev, kcal: Math.round(calculatedKcal) }));
        }
    }, [goals.protein, goals.carbs, goals.fat, setGoals]);

    const handleGoalChange = (field: keyof DailyGoals, value: string) => {
        setGoals(prev => ({ ...prev, [field]: parseFloat(value) || 0 }));
        if (String(field).includes('Min') || String(field).includes('Max')) {
            setActiveModeLabel('Manual');
        }
    };

    const handleGenerateRanges = () => {
        let carbPct = 0.15;
        let fatPct = 0.20;
        let currentLabel = "";
        let nextState: 'balanced' | 'strict' | 'relaxed' = 'balanced';

        switch (nextAutoMode) {
            case 'balanced':
                carbPct = 0.15;
                fatPct = 0.20;
                currentLabel = "Balanceado";
                nextState = 'strict';
                break;
            case 'strict':
                carbPct = 0.10;
                fatPct = 0.10;
                currentLabel = "Estricto";
                nextState = 'relaxed';
                break;
            case 'relaxed':
                carbPct = 0.25;
                fatPct = 0.25;
                currentLabel = "Flexible";
                nextState = 'balanced';
                break;
        }

        const carbBuffer = Math.round(goals.carbs * carbPct);
        const fatBuffer = Math.round(goals.fat * fatPct);

        setGoals(prev => ({
            ...prev,
            carbMin: Math.max(0, Math.round(goals.carbs - carbBuffer)),
            carbMax: Math.round(goals.carbs + carbBuffer),
            fatMin: Math.max(0, Math.round(goals.fat - fatBuffer)),
            fatMax: Math.round(goals.fat + fatBuffer),
        }));
        
        setActiveModeLabel(currentLabel);
        setNextAutoMode(nextState);
        showToast(`Modo ${currentLabel} aplicado`);
    };

    const getModeColor = (mode: string | null) => {
        if (mode === 'Estricto') return 'text-brand-fat border-brand-fat/30 bg-brand-fat/10';
        if (mode === 'Flexible') return 'text-brand-carbs border-brand-carbs/30 bg-brand-carbs/10';
        if (mode === 'Balanceado') return 'text-brand-accent border-brand-accent/30 bg-brand-accent/10';
        return 'text-text-secondary border-surface-border bg-surface-bg';
    };

    return (
        <>
            <section>
                <SectionHeader title="Metas Nutricionales" dotClass="bg-brand-fat" />
                
                <div className="bg-surface-bg p-4 rounded-card border-l-2 border-l-brand-accent border-y border-r border-surface-border space-y-5 hover:bg-surface-hover/50 transition-colors shadow-sm">
                    {/* Calories (Big) */}
                    <div className="bg-surface-bg rounded-input p-4 border border-surface-border relative overflow-hidden group focus-within:border-brand-accent transition-colors">
                        <label className="text-[9px] font-bold text-brand-accent uppercase tracking-[0.15em] mb-1 flex items-center gap-2 relative z-10">
                            <FireIcon className="w-3 h-3" />
                            Objetivo Calórico (Auto)
                        </label>
                        <div className="flex items-baseline justify-center gap-1 relative z-10">
                            <span className="w-full bg-transparent text-4xl font-black text-text-primary text-center outline-none font-heading tracking-tight placeholder:text-surface-border/20 block py-1">
                                {goals.kcal}
                            </span>
                            <span className="text-xs font-bold text-text-secondary uppercase tracking-widest absolute bottom-2 right-0">Kcal</span>
                        </div>
                        {/* Background Glow */}
                        <div className="absolute -right-4 -top-4 w-20 h-20 bg-brand-accent/5 rounded-full blur-xl pointer-events-none group-focus-within:bg-brand-accent/10 transition-colors"></div>
                    </div>

                    {/* Macros (Grid) */}
                    <div className="grid grid-cols-3 gap-3">
                        <Input 
                            label="Proteína" 
                            value={goals.protein} 
                            onChange={e => handleGoalChange('protein', e.target.value)} 
                            type="number"
                            focusClassName="focus-within:border-brand-protein focus-within:ring-1 focus-within:ring-brand-protein/50"
                            suffix="g"
                        />
                        <Input 
                            label="Carbos" 
                            value={goals.carbs} 
                            onChange={e => handleGoalChange('carbs', e.target.value)} 
                            type="number"
                            focusClassName="focus-within:border-brand-carbs focus-within:ring-1 focus-within:ring-brand-carbs/50"
                            suffix="g"
                        />
                        <Input 
                            label="Grasas" 
                            value={goals.fat} 
                            onChange={e => handleGoalChange('fat', e.target.value)} 
                            type="number"
                            focusClassName="focus-within:border-brand-fat focus-within:ring-1 focus-within:ring-brand-fat/50"
                            suffix="g"
                        />
                    </div>
                </div>
            </section>

            {/* Section 4: Advanced Ranges */}
            <section>
                <button 
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center gap-2 w-full mb-1 group"
                >
                    <SectionHeader title="Rangos Flexibles (Avanzado)" />
                    <ArrowDownIcon className={`w-4 h-4 text-text-secondary flex-shrink-0 transition-transform duration-300 ${showAdvanced ? 'rotate-180' : ''}`} />
                </button>

                <div className={`transition-all duration-500 overflow-hidden ${showAdvanced ? 'max-h-[700px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="bg-surface-bg p-4 rounded-card border border-surface-border hover:bg-surface-hover/50 space-y-4 shadow-sm">
                        
                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                                <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest">Modo Actual</p>
                                {activeModeLabel && (
                                    <span className={`text-[9px] font-bold uppercase px-2 py-1 rounded border ${getModeColor(activeModeLabel)}`}>
                                        {activeModeLabel}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-[10px] text-text-secondary leading-relaxed max-w-[60%]">
                                    Calcula límites automáticos. Toca para alternar: Balanceado, Estricto, Flexible.
                                </p>
                                <Button 
                                    variant="primary"
                                    size="small"
                                    onClick={handleGenerateRanges}
                                    className="!text-[9px] !px-4 !py-2 whitespace-nowrap"
                                    icon={CalculatorIcon}
                                >
                                    Auto
                                </Button>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/5">
                            <div className="space-y-3 p-3 bg-surface-hover/30 rounded-input border border-surface-border relative group focus-within:border-brand-carbs/30 transition-colors">
                                <div className="flex justify-between items-end mb-1">
                                    <span className="text-[10px] font-bold text-brand-carbs uppercase tracking-widest">Carbohidratos</span>
                                    <span className="text-[8px] font-mono text-text-secondary bg-surface-hover px-1.5 py-0.5 rounded border border-surface-border">Meta: {goals.carbs}g</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <Input 
                                        label="Mínimo" 
                                        value={goals.carbMin || ''} 
                                        onChange={e => handleGoalChange('carbMin', e.target.value)} 
                                        type="number"
                                        placeholder={(goals.carbs * 0.85).toFixed(0)}
                                        suffix="g"
                                    />
                                    <Input 
                                        label="Máximo" 
                                        value={goals.carbMax || ''} 
                                        onChange={e => handleGoalChange('carbMax', e.target.value)} 
                                        type="number"
                                        placeholder={(goals.carbs * 1.15).toFixed(0)}
                                        suffix="g"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3 p-3 bg-surface-hover/30 rounded-input border border-surface-border relative group focus-within:border-brand-fat/30 transition-colors">
                                <div className="flex justify-between items-end mb-1">
                                    <span className="text-[10px] font-bold text-brand-fat uppercase tracking-widest">Grasas</span>
                                    <span className="text-[8px] font-mono text-text-secondary bg-surface-hover px-1.5 py-0.5 rounded border border-surface-border">Meta: {goals.fat}g</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <Input 
                                        label="Mínimo" 
                                        value={goals.fatMin || ''} 
                                        onChange={e => handleGoalChange('fatMin', e.target.value)} 
                                        type="number"
                                        placeholder={(goals.fat * 0.8).toFixed(0)}
                                        suffix="g"
                                    />
                                    <Input 
                                        label="Máximo" 
                                        value={goals.fatMax || ''} 
                                        onChange={e => handleGoalChange('fatMax', e.target.value)} 
                                        type="number"
                                        placeholder={(goals.fat * 1.2).toFixed(0)}
                                        suffix="g"
                                    />
                                </div>
                            </div>
                        </div>

                        <p className="text-[8px] text-text-secondary/40 text-center mt-2 leading-relaxed px-4 italic">
                            * Los rangos sugeridos son estimaciones algorítmicas basadas en tu meta principal. Ajusta estos valores según tus preferencias y tolerancia personal.
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
};
