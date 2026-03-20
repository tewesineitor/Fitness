
import React, { useEffect } from 'react';
import Button from '../../components/Button';
import { PlusIcon, TrophyIcon, ChartBarIcon, FireIcon } from '../../components/icons';
import { WorkoutStats } from '../../types';
import { vibrate } from '../../utils/helpers';

interface PostRoutineScreenProps {
    onFinish: () => void;
    onAddExercise: () => void;
    stats: WorkoutStats;
    finishButtonText?: string;
}

const PostRoutineScreen: React.FC<PostRoutineScreenProps> = ({ onFinish, onAddExercise, stats, finishButtonText }) => {
    const totalVolume = stats.weightLifted;
    const exercisesDone = Object.keys(stats.logs).length;

    // Trigger success haptics on mount
    useEffect(() => {
        const timeout = setTimeout(() => {
            vibrate([100, 50, 100, 50, 200]);
        }, 300);
        return () => clearTimeout(timeout);
    }, []);

    return (
        <div className="flex flex-col h-full w-full bg-bg-base relative overflow-hidden">
            
            {/* Scrollable Content */}
            <div className="flex-grow overflow-y-auto hide-scrollbar px-6 py-10 pb-40 flex flex-col items-center">
                
                {/* Hero / Trophy Area */}
                <div className="mt-8 mb-12 flex flex-col items-center text-center animate-fade-in-down">
                    <div className="relative mb-8">
                        {/* Ambient glow behind trophy */}
                        <div className="absolute inset-0 bg-brand-accent/30 drop-shadow-[0_0_80px_rgba(var(--color-brand-accent-rgb),0.8)] rounded-full blur-2xl"></div>
                        
                        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-[2.5rem] bg-gradient-to-br from-brand-accent to-brand-protein flex items-center justify-center shadow-2xl rotate-3 ring-1 ring-white/20 z-10">
                            <TrophyIcon className="w-12 h-12 sm:w-14 sm:h-14 text-black drop-shadow-sm" />
                        </div>
                    </div>
                    
                    <h1 className="text-4xl sm:text-5xl font-display font-black text-white uppercase tracking-tighter leading-[0.9] drop-shadow-md">
                        Misión<br/>Cumplida
                    </h1>
                </div>

                {/* BENTO GRID STATS (Staggered Reveal) */}
                <div className="w-full max-w-sm grid grid-cols-2 gap-3 sm:gap-4 mb-auto">
                    
                    {/* BENTO CARD 1: Total Volume (Large Left Column) */}
                    <div 
                        className="col-span-1 row-span-2 bg-surface-bg/80 backdrop-blur-md p-5 rounded-[2rem] border border-surface-border flex flex-col justify-between shadow-lg relative overflow-hidden animate-fade-in-up"
                        style={{ animationDelay: '150ms', animationFillMode: 'both' }}
                    >
                        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-brand-accent/10 rounded-full blur-2xl pointer-events-none"></div>
                        <div className="p-2 bg-brand-accent/10 rounded-xl w-max mb-6">
                            <ChartBarIcon className="w-5 h-5 text-brand-accent" />
                        </div>
                        <div>
                            <p className="text-4xl font-heading font-black text-white tracking-tighter leading-none mb-1">
                                {(totalVolume / 1000).toFixed(1)}<span className="text-lg text-brand-accent">T</span>
                            </p>
                            <p className="text-[9px] font-bold text-text-secondary uppercase tracking-[0.2em] leading-snug">
                                Tonelaje Total MovidO
                            </p>
                        </div>
                    </div>

                    {/* BENTO CARD 2: Exercises Done (Top Right) */}
                    <div 
                        className="col-span-1 bg-surface-bg/80 backdrop-blur-md p-4 rounded-3xl border border-surface-border flex flex-col justify-center shadow-lg animate-fade-in-up"
                        style={{ animationDelay: '300ms', animationFillMode: 'both' }}
                    >
                        <p className="text-3xl font-heading font-black text-white tracking-tighter leading-none mb-1">
                            {exercisesDone}
                        </p>
                        <p className="text-[9px] font-bold text-text-secondary uppercase tracking-[0.2em]">
                            Ejercicios Completados
                        </p>
                    </div>

                    {/* BENTO CARD 3: Session Quality (Bottom Right - placeholder for aesthetic feel) */}
                    <div 
                        className="col-span-1 bg-gradient-to-br from-brand-accent/20 to-transparent p-4 rounded-3xl border border-brand-accent/30 flex items-center gap-3 shadow-lg animate-fade-in-up"
                        style={{ animationDelay: '450ms', animationFillMode: 'both' }}
                    >
                        <div className="p-2 bg-brand-accent/20 rounded-full text-brand-accent">
                            <FireIcon className="w-5 h-5" />
                        </div>
                        <div>
                             <p className="text-lg font-heading font-black text-white tracking-tighter leading-none">
                                Épico
                            </p>
                            <p className="text-[8px] font-bold text-brand-accent uppercase tracking-[0.2em]">
                                Intensidad
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            {/* Fixed Actions Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-6 pb-safe bg-gradient-to-t from-black via-black/95 to-transparent z-20 animate-fade-in-up" style={{ animationDelay: '600ms', animationFillMode: 'both' }}>
                <div className="flex flex-col gap-3 w-full max-w-sm mx-auto">
                    <Button 
                        variant="primary"
                        onClick={() => { vibrate(15); onFinish(); }} 
                        size="large" 
                        className="w-full py-5 rounded-2xl shadow-[0_0_30px_rgba(var(--color-brand-accent-rgb),0.3)] hover:scale-[1.02] active:scale-95 transition-all text-sm font-extrabold tracking-widest uppercase"
                    >
                        {finishButtonText || 'FINALIZAR SESIÓN'}
                    </Button>
                    
                    <Button 
                        variant="tertiary"
                        onClick={() => { vibrate(5); onAddExercise(); }} 
                        className="w-full py-4 rounded-2xl bg-surface-bg border border-surface-border text-text-secondary hover:text-white hover:bg-surface-hover active:scale-[0.98] transition-all font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
                        icon={PlusIcon}
                    >
                        AÑADIR EXTRA
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PostRoutineScreen;
