import React, { useState, useEffect, useRef } from 'react';
import Button from '../../components/Button';
import { PlayIcon, PauseIcon, StopIcon, FireIcon, ClockIcon, ChevronRightIcon } from '../../components/icons';
import { vibrate } from '../../utils/helpers';

interface RuckingSessionProps {
    onFinish: (sessionData: { duration: number; weight: number; calories: number }) => void;
    onCancel: () => void;
}

const RuckingSession: React.FC<RuckingSessionProps> = ({ onFinish, onCancel }) => {
    const [step, setStep] = useState<'setup' | 'active' | 'summary'>('setup');
    const [weight, setWeight] = useState<number>(10); // Default 10kg
    const [targetTime, setTargetTime] = useState<number>(30); // Default 30min
    
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [calories, setCalories] = useState(0);
    
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // MET value for Rucking (approximate)
    // Walking 5.6 km/h uphill/carrying load ~ 6-8 METs
    const calculateCalories = (seconds: number, weightKg: number) => {
        // Simple estimation: ~600-700 kcal/hr for vigorous rucking
        // Let's use a formula: (MET * 3.5 * weightBody) / 200 * minutes?
        // Simplified: ~0.15 kcal/kg_total/min
        // Assuming 75kg body weight + weightKg
        const totalWeight = 75 + weightKg; 
        const kcalPerMin = 0.1 * totalWeight; // Conservative estimate
        return (kcalPerMin * (seconds / 60));
    };

    useEffect(() => {
        if (isActive) {
            timerRef.current = setInterval(() => {
                setElapsedTime(prev => {
                    const newTime = prev + 1;
                    setCalories(calculateCalories(newTime, weight));
                    return newTime;
                });
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [isActive, weight]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleStart = () => {
        vibrate(10);
        setIsActive(true);
        setStep('active');
    };

    const handlePause = () => {
        vibrate(10);
        setIsActive(!isActive);
    };

    const handleStop = () => {
        vibrate(20);
        setIsActive(false);
        setStep('summary');
    };

    const handleSave = () => {
        onFinish({ duration: elapsedTime, weight, calories });
    };

    if (step === 'setup') {
        return (
            <div className="flex flex-col h-full bg-bg-base p-6 animate-fade-in-up">
                <header className="mb-8">
                    <button onClick={onCancel} className="text-text-secondary hover:text-white flex items-center gap-1 text-xs uppercase tracking-widest mb-4">
                        <ChevronRightIcon className="w-4 h-4 rotate-180" /> Cancelar
                    </button>
                    <h1 className="text-2xl font-black text-white uppercase tracking-tighter italic">Rucking Setup</h1>
                    <p className="text-text-secondary text-xs mt-1">Configura tu carga y objetivo.</p>
                </header>

                <div className="space-y-8 flex-grow">
                    {/* Weight Input */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-bold text-brand-accent uppercase tracking-[0.2em]">Peso en Mochila (kg)</label>
                        <div className="flex items-center gap-4">
                            <button onClick={() => setWeight(Math.max(0, weight - 1))} className="w-12 h-12 rounded-xl bg-surface-hover border border-surface-border flex items-center justify-center text-xl font-bold text-white hover:bg-brand-accent hover:text-black transition-colors">-</button>
                            <div className="flex-grow text-center bg-surface-bg border border-surface-border rounded-xl py-3">
                                <span className="text-3xl font-black text-white font-mono">{weight}</span>
                                <span className="text-xs text-text-secondary ml-1 font-bold">KG</span>
                            </div>
                            <button onClick={() => setWeight(weight + 1)} className="w-12 h-12 rounded-xl bg-surface-hover border border-surface-border flex items-center justify-center text-xl font-bold text-white hover:bg-brand-accent hover:text-black transition-colors">+</button>
                        </div>
                    </div>

                    {/* Target Time Input */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-bold text-brand-accent uppercase tracking-[0.2em]">Tiempo Objetivo (min)</label>
                        <div className="flex items-center gap-4">
                            <button onClick={() => setTargetTime(Math.max(5, targetTime - 5))} className="w-12 h-12 rounded-xl bg-surface-hover border border-surface-border flex items-center justify-center text-xl font-bold text-white hover:bg-brand-accent hover:text-black transition-colors">-</button>
                            <div className="flex-grow text-center bg-surface-bg border border-surface-border rounded-xl py-3">
                                <span className="text-3xl font-black text-white font-mono">{targetTime}</span>
                                <span className="text-xs text-text-secondary ml-1 font-bold">MIN</span>
                            </div>
                            <button onClick={() => setTargetTime(targetTime + 5)} className="w-12 h-12 rounded-xl bg-surface-hover border border-surface-border flex items-center justify-center text-xl font-bold text-white hover:bg-brand-accent hover:text-black transition-colors">+</button>
                        </div>
                    </div>
                </div>

                <Button onClick={handleStart} size="large" className="w-full py-6 text-sm tracking-[0.25em]">INICIAR SESIÓN</Button>
            </div>
        );
    }

    if (step === 'active') {
        const progress = Math.min((elapsedTime / (targetTime * 60)) * 100, 100);
        
        return (
            <div className="flex flex-col h-full bg-black relative overflow-hidden">
                {/* Background Pulse */}
                {isActive && (
                    <div className="absolute inset-0 bg-brand-accent/5 animate-pulse pointer-events-none"></div>
                )}

                <div className="relative z-10 flex flex-col h-full p-6">
                    <header className="flex justify-between items-center mb-10">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
                            <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">En Curso</span>
                        </div>
                        <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">{weight} KG LOAD</div>
                    </header>

                    <div className="flex-grow flex flex-col items-center justify-center">
                        {/* Timer Circle */}
                        <div className="relative w-64 h-64 flex items-center justify-center mb-12">
                            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="45" fill="none" stroke="#1a1a1a" strokeWidth="4" />
                                <circle 
                                    cx="50" cy="50" r="45" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    strokeWidth="4" 
                                    strokeDasharray="283" 
                                    strokeDashoffset={283 - (283 * progress) / 100}
                                    className="text-brand-accent transition-all duration-1000 ease-linear"
                                />
                            </svg>
                            <div className="text-center">
                                <span className="block text-6xl font-black text-white font-mono tracking-tighter">{formatTime(elapsedTime)}</span>
                                <span className="text-xs font-bold text-text-secondary uppercase tracking-[0.3em] mt-2">Tiempo Total</span>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-8 w-full max-w-xs">
                            <div className="text-center">
                                <FireIcon className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                                <span className="block text-2xl font-black text-white font-mono">{calories.toFixed(0)}</span>
                                <span className="text-[9px] font-bold text-text-secondary uppercase tracking-widest">Kcal Est.</span>
                            </div>
                            <div className="text-center">
                                <ClockIcon className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                                <span className="block text-2xl font-black text-white font-mono">{targetTime}</span>
                                <span className="text-[9px] font-bold text-text-secondary uppercase tracking-widest">Meta Min</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-auto">
                        <button 
                            onClick={handlePause}
                            className={`py-6 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all ${isActive ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 hover:bg-yellow-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500/20'}`}
                        >
                            {isActive ? <><PauseIcon className="w-4 h-4" /> Pausar</> : <><PlayIcon className="w-4 h-4" /> Reanudar</>}
                        </button>
                        <button 
                            onClick={handleStop}
                            className="py-6 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 bg-surface-hover text-white border border-surface-border hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all"
                        >
                            <StopIcon className="w-4 h-4" /> Terminar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-bg-base p-6 animate-fade-in-up">
            <div className="flex-grow flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-brand-accent/10 rounded-full flex items-center justify-center mb-6 text-brand-accent border border-brand-accent/20">
                    <FireIcon className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic mb-2">¡Sesión Completada!</h2>
                <p className="text-text-secondary text-sm mb-10">Gran trabajo, soldado.</p>

                <div className="w-full max-w-sm bg-surface-bg border border-surface-border rounded-2xl p-6 space-y-6">
                    <div className="flex justify-between items-center border-b border-surface-border pb-4">
                        <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">Tiempo</span>
                        <span className="text-xl font-black text-white font-mono">{formatTime(elapsedTime)}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-surface-border pb-4">
                        <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">Carga</span>
                        <span className="text-xl font-black text-white font-mono">{weight} kg</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">Calorías</span>
                        <span className="text-xl font-black text-brand-accent font-mono">{calories.toFixed(0)} kcal</span>
                    </div>
                </div>
            </div>

            <Button onClick={handleSave} size="large" className="w-full py-6 text-sm tracking-[0.25em]">GUARDAR PROGRESO</Button>
        </div>
    );
};

export default RuckingSession;
