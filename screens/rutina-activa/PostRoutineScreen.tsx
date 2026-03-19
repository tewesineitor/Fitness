
import React from 'react';
import Button from '../../components/Button';
import { PlusIcon, TrophyIcon } from '../../components/icons';
import FloatingDock from '../../components/FloatingDock';
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

    return (
        <div className="flex flex-col h-full w-full bg-bg-base relative overflow-hidden">
            
            {/* Scrollable Content */}
            <div className="flex-grow overflow-y-auto hide-scrollbar px-6 py-10 pb-40 flex flex-col items-center text-center">
                {/* Trophy & Title */}
                <div className="mb-12 mt-auto">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[2rem] bg-gradient-to-br from-brand-accent to-blue-500 flex items-center justify-center shadow-[0_0_20px_rgba(var(--color-brand-accent-rgb),0.2)] mb-6 sm:mb-8 mx-auto rotate-3 ring-4 ring-black">
                        <TrophyIcon className="w-10 h-10 sm:w-12 sm:h-12 text-black" />
                    </div>
                    
                    <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter leading-none mb-3 drop-shadow-sm">
                        Misión<br/>Cumplida
                    </h1>
                    <div className="h-1 w-12 bg-brand-accent mx-auto rounded-full"></div>
                </div>

                {/* Stats Grid */}
                <div className="w-full grid grid-cols-2 gap-4 mb-auto">
                    <div className="bg-surface-bg p-4 sm:p-5 rounded-3xl border border-surface-border flex flex-col items-center justify-center gap-1 shadow-sm">
                        <p className="text-2xl sm:text-3xl font-black text-white tracking-tighter">{(totalVolume / 1000).toFixed(1)}k</p>
                        <p className="text-[9px] font-bold text-text-secondary uppercase tracking-[0.2em]">Kg Totales</p>
                    </div>
                     <div className="bg-surface-bg p-4 sm:p-5 rounded-3xl border border-surface-border flex flex-col items-center justify-center gap-1 shadow-sm">
                        <p className="text-2xl sm:text-3xl font-black text-white tracking-tighter">{exercisesDone}</p>
                        <p className="text-[9px] font-bold text-text-secondary uppercase tracking-[0.2em]">Ejercicios</p>
                    </div>
                </div>
            </div>

            {/* Fixed Actions Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-5 pb-safe bg-gradient-to-t from-black via-black/95 to-transparent z-20">
                <div className="flex flex-col gap-3 w-full">
                    <Button 
                        variant="high-contrast"
                        onClick={() => { vibrate(10); onFinish(); }} 
                        size="large" 
                        className="w-full py-4 rounded-full shadow-lg text-sm border-none"
                    >
                        {finishButtonText ? finishButtonText.toUpperCase() : 'FINALIZAR SESIÓN'}
                    </Button>
                    
                    <Button 
                        variant="secondary"
                        onClick={() => { vibrate(5); onAddExercise(); }} 
                        className="w-full py-3 rounded-full border border-surface-border bg-surface-hover text-text-secondary hover:text-white hover:bg-surface-border active:scale-[0.98] transition-all font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                        icon={PlusIcon}
                    >
                        Añadir Extra
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PostRoutineScreen;
