import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../contexts';
import { DailyGoals, Theme } from '../types';
import { ChevronRightIcon, SunIcon, MoonIcon, MonitorIcon, UserCircleIcon, SparklesIcon, CheckIcon, ChartBarIcon, FireIcon, ArrowsVerticalIcon, ArrowDownIcon, CalculatorIcon } from '../components/icons';
import Button from '../components/Button';
import Input from '../components/Input';

import { getSupabase } from '../services/supabaseClient';

// --- SUB-COMPONENTS ---

const SectionHeader: React.FC<{ title: string; colorClass?: string }> = ({ title, colorClass = "bg-brand-accent" }) => (
    <h2 className="text-xs font-bold text-text-secondary uppercase tracking-[0.2em] mb-3 pl-1 flex items-center gap-2">
        <div className={`w-1.5 h-1.5 rounded-full ${colorClass} shadow-[0_0_8px_currentColor]`}></div>
        {title}
    </h2>
);

const ThemeTile: React.FC<{
    theme: Theme;
    currentTheme: Theme;
    onSelect: (t: Theme) => void;
    icon: React.FC<{ className?: string }>;
    label: string;
}> = ({ theme, currentTheme, onSelect, icon: Icon, label }) => {
    const isActive = currentTheme === theme;
    return (
        <button
            onClick={() => onSelect(theme)}
            className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl border transition-all duration-300 relative overflow-hidden group ${
                isActive 
                    ? 'bg-brand-accent/10 border-brand-accent/50 text-brand-accent shadow-[0_0_15px_rgba(var(--color-brand-accent-rgb),0.15)]' 
                    : 'bg-surface-bg border-surface-border text-text-secondary hover:bg-surface-hover hover:text-text-primary'
            }`}
        >
            <Icon className={`w-5 h-5 mb-1.5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
            <span className="text-[9px] font-bold uppercase tracking-widest">{label}</span>
            {isActive && <div className="absolute top-1.5 right-1.5 w-1 h-1 bg-brand-accent rounded-full shadow-[0_0_5px_currentColor]"></div>}
        </button>
    );
};

// --- MAIN SCREEN ---

const PerfilScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { state, dispatch, showToast } = useContext(AppContext)!;
    
    const [name, setName] = useState('');
    const [customMantra, setCustomMantra] = useState('');
    const [goals, setGoals] = useState<DailyGoals>({
        kcal: 0,
        protein: 0,
        carbs: 0,
        fat: 0
    });
    
    const [showAdvanced, setShowAdvanced] = useState(false);
    // Cycle state: Balanced -> Strict -> Relaxed
    const [nextAutoMode, setNextAutoMode] = useState<'balanced' | 'strict' | 'relaxed'>('balanced');
    const [activeModeLabel, setActiveModeLabel] = useState<string | null>(null);

    useEffect(() => {
        if (state.profile) {
            setName(state.profile.userName);
            setGoals(state.profile.dailyGoals);
            setCustomMantra(state.profile.customMantra || '');
        }
    }, [state.profile]);

    // Auto-calculate Calories when Macros change
    useEffect(() => {
        const calculatedKcal = (goals.protein * 4) + (goals.carbs * 4) + (goals.fat * 9);
        // Only update if difference is significant to avoid rounding jitters, 
        // but ensure we update state.
        if (Math.abs(calculatedKcal - goals.kcal) > 1) {
            setGoals(prev => ({ ...prev, kcal: Math.round(calculatedKcal) }));
        }
    }, [goals.protein, goals.carbs, goals.fat]);

    const handleGoalChange = (field: keyof DailyGoals, value: string) => {
        setGoals(prev => ({ ...prev, [field]: parseFloat(value) || 0 }));
        if (String(field).includes('Min') || String(field).includes('Max')) {
            setActiveModeLabel('Manual'); // Reset label if user edits manually
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

    const handleSave = () => {
        if (!name.trim()) {
            showToast('El nombre de usuario es obligatorio');
            return;
        }
        dispatch({ type: 'UPDATE_PROFILE', payload: { name, goals, customMantra } });
        showToast('Perfil actualizado correctamente');
        onClose(); 
    };

    const { theme } = state.profile;
    const updateTheme = (newTheme: Theme) => dispatch({ type: 'UPDATE_THEME', payload: newTheme });

    const getModeColor = (mode: string | null) => {
        if (mode === 'Estricto') return 'text-brand-fat border-brand-fat/30 bg-brand-fat/10';
        if (mode === 'Flexible') return 'text-brand-carbs border-brand-carbs/30 bg-brand-carbs/10';
        if (mode === 'Balanceado') return 'text-brand-accent border-brand-accent/30 bg-brand-accent/10';
        return 'text-text-secondary border-surface-border bg-surface-bg';
    };

    return (
        <div className="h-full animate-slide-up flex flex-col bg-bg-base overflow-hidden">
            {/* Header */}
            <header className="flex-shrink-0 px-4 sm:px-6 pt-6 pb-2 border-b border-surface-border/10 bg-surface-bg/80 backdrop-blur-md sticky top-0 z-20">
                <div className="flex justify-between items-center mb-2">
                    <Button variant="tertiary" onClick={onClose} icon={ChevronRightIcon} className="!p-0 [&_svg]:rotate-180 text-text-secondary hover:text-text-primary text-xs uppercase tracking-widest">
                        Volver
                    </Button>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-text-primary uppercase tracking-tight">
                    Mi <span className="text-brand-accent">Perfil</span>
                </h1>
            </header>
            
            {/* Scrollable Content */}
            <div className="flex-grow overflow-y-auto w-full px-4 sm:px-6 py-5 pb-32 space-y-5 hide-scrollbar">
                
                {/* Section 1: Identity */}
                <section>
                    <SectionHeader title="Identidad" />
                    <div className="bg-surface-bg p-4 rounded-2xl space-y-4 border border-surface-border shadow-sm">
                        <Input 
                            label="Nombre de Usuario" 
                            value={name} 
                            onChange={e => setName(e.target.value)} 
                            placeholder="Tu nombre" 
                            icon={UserCircleIcon}
                        />
                        
                        <div>
                            <label className="text-[9px] font-bold text-text-secondary uppercase tracking-[0.15em] mb-1.5 flex items-center gap-1.5 pl-1 opacity-70">
                                <SparklesIcon className="w-3 h-3 text-brand-accent" />
                                Mantra Personal
                            </label>
                            <textarea
                                value={customMantra}
                                onChange={(e) => setCustomMantra(e.target.value)}
                                placeholder="Escribe una frase que te inspire..."
                                rows={2}
                                className="w-full bg-surface-bg border border-surface-border rounded-xl p-4 text-sm text-white font-bold focus:border-brand-accent outline-none transition-all placeholder:text-white/20 resize-none font-mono leading-relaxed"
                            />
                        </div>
                    </div>
                </section>

                {/* Section 2: Interface */}
                <section>
                    <SectionHeader title="Interfaz Visual" colorClass="bg-text-primary" />
                    <div className="bg-surface-bg p-4 rounded-2xl border border-surface-border shadow-sm">
                        <div className="grid grid-cols-3 gap-3">
                            <ThemeTile theme="light" currentTheme={theme} onSelect={updateTheme} icon={SunIcon} label="Claro" />
                            <ThemeTile theme="dark" currentTheme={theme} onSelect={updateTheme} icon={MoonIcon} label="Oscuro" />
                            <ThemeTile theme="system" currentTheme={theme} onSelect={updateTheme} icon={MonitorIcon} label="Auto" />
                        </div>
                    </div>
                </section>

                {/* Section 3: Goals HUD */}
                <section>
                    <SectionHeader title="Metas Nutricionales" colorClass="bg-brand-fat" />
                    
                    <div className="bg-surface-bg p-4 rounded-2xl border-l-2 border-l-brand-accent border-y border-r border-surface-border space-y-5 hover:bg-surface-hover/50 transition-colors shadow-sm">
                        {/* Calories (Big) */}
                        <div className="bg-surface-bg rounded-xl p-4 border border-surface-border relative overflow-hidden group focus-within:border-brand-accent transition-colors">
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
                                focusClassName="focus-within:border-brand-protein focus-within:ring-1 focus-within:ring-brand-protein/50 focus-within:shadow-[0_0_10px_rgba(var(--color-brand-protein-rgb),0.2)]"
                                suffix="g"
                            />
                            <Input 
                                label="Carbos" 
                                value={goals.carbs} 
                                onChange={e => handleGoalChange('carbs', e.target.value)} 
                                type="number"
                                focusClassName="focus-within:border-brand-carbs focus-within:ring-1 focus-within:ring-brand-carbs/50 focus-within:shadow-[0_0_10px_rgba(var(--color-brand-carbs-rgb),0.2)]"
                                suffix="g"
                            />
                            <Input 
                                label="Grasas" 
                                value={goals.fat} 
                                onChange={e => handleGoalChange('fat', e.target.value)} 
                                type="number"
                                focusClassName="focus-within:border-brand-fat focus-within:ring-1 focus-within:ring-brand-fat/50 focus-within:shadow-[0_0_10px_rgba(var(--color-brand-fat-rgb),0.2)]"
                                suffix="g"
                            />
                        </div>
                    </div>
                </section>

                {/* Section 4: Advanced Ranges */}
                <section>
                    <button 
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="flex items-center gap-2 w-full mb-3 group"
                    >
                        <SectionHeader title="Rangos Flexibles (Avanzado)" colorClass="bg-text-secondary" />
                        <ArrowDownIcon className={`w-4 h-4 text-text-secondary transition-transform duration-300 ${showAdvanced ? 'rotate-180' : ''}`} />
                    </button>

                    <div className={`transition-all duration-500 overflow-hidden ${showAdvanced ? 'max-h-[700px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="bg-surface-bg p-4 rounded-2xl border border-surface-border hover:bg-surface-hover/50 space-y-4 shadow-sm">
                            
                            {/* Explanation & Controls */}
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
                                    {/* UPDATED BUTTON: Fixed Visibility */}
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
                                {/* Carbs Block */}
                                <div className="space-y-3 p-3 bg-black/20 rounded-xl border border-white/5 relative group focus-within:border-brand-carbs/30 transition-colors">
                                    <div className="flex justify-between items-end mb-1">
                                        <span className="text-[10px] font-bold text-brand-carbs uppercase tracking-widest">Carbohidratos</span>
                                        <span className="text-[8px] font-mono text-text-secondary opacity-70 bg-black/40 px-1.5 py-0.5 rounded border border-white/5">Meta: {goals.carbs}g</span>
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

                                {/* Fat Block */}
                                <div className="space-y-3 p-3 bg-black/20 rounded-xl border border-white/5 relative group focus-within:border-brand-fat/30 transition-colors">
                                    <div className="flex justify-between items-end mb-1">
                                        <span className="text-[10px] font-bold text-brand-fat uppercase tracking-widest">Grasas</span>
                                        <span className="text-[8px] font-mono text-text-secondary opacity-70 bg-black/40 px-1.5 py-0.5 rounded border border-white/5">Meta: {goals.fat}g</span>
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

                            {/* Disclaimer */}
                            <p className="text-[8px] text-text-secondary/40 text-center mt-2 leading-relaxed px-4 italic">
                                * Los rangos sugeridos son estimaciones algorítmicas basadas en tu meta principal. Ajusta estos valores según tus preferencias y tolerancia personal.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Logout Section */}
                <section className="mb-12 mt-8">
                    <SectionHeader title="Ajustes de Cuenta" colorClass="bg-text-secondary" />
                    <div className="bg-surface-bg p-4 rounded-2xl border border-surface-border shadow-sm space-y-3">
                        <Button 
                            onClick={() => {
                                onClose();
                                dispatch({ type: 'UPDATE_PROFILE', payload: { name: '', goals, customMantra } });
                            }} 
                            variant="secondary" 
                            className="w-full text-text-primary"
                        >
                            Ver Onboarding
                        </Button>
                        <Button 
                            onClick={async () => {
                                const supabase = getSupabase();
                                if (supabase) {
                                    await supabase.auth.signOut();
                                }
                            }} 
                            variant="tertiary" 
                            className="w-full text-red-500 hover:bg-red-500/10 border border-red-500/20"
                        >
                            Cerrar Sesión
                        </Button>
                    </div>
                </section>

            </div>

            {/* Fixed Footer */}
            <div className="flex-shrink-0 p-4 sm:p-6 border-t border-surface-border/10 bg-surface-bg/80 backdrop-blur-md sticky bottom-0 z-20">
                <Button 
                    onClick={handleSave} 
                    variant="primary" 
                    size="large" 
                    className="w-full py-4 text-xs font-bold tracking-widest uppercase shadow-lg shadow-brand-accent/20" 
                    icon={CheckIcon}
                >
                    GUARDAR CAMBIOS
                </Button>
            </div>
        </div>
    );
};

export default PerfilScreen;