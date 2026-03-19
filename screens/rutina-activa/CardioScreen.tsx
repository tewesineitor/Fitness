
import React, { useState, useEffect, useMemo } from 'react';
import { cacoMethodData } from '../../data';
import { CardioIcon } from '../../components/icons';

interface CardioScreenProps {
  cardioWeek: number;
  onComplete: () => void;
}

const CardioScreen: React.FC<CardioScreenProps> = ({ cardioWeek, onComplete }) => {
    const weekData = useMemo(() => cacoMethodData.find(d => d.week === cardioWeek) || cacoMethodData[0], [cardioWeek]);
    
    const [currentRep, setCurrentRep] = useState(1);
    const [isRunInterval, setIsRunInterval] = useState(true);
    const [intervalTimeLeft, setIntervalTimeLeft] = useState(weekData.runInterval);
    
    const totalDuration = (weekData.runInterval + weekData.walkInterval) * weekData.repetitions;
    const [totalTimeElapsed, setTotalTimeElapsed] = useState(0);

    useEffect(() => {
        const timer = window.setInterval(() => {
            setIntervalTimeLeft(prev => {
                if (prev <= 1) {
                    // Switch interval
                    if (isRunInterval) {
                        setIsRunInterval(false);
                        return weekData.walkInterval;
                    } else {
                        // End of a full rep
                        if (currentRep < weekData.repetitions) {
                            setCurrentRep(r => r + 1);
                            setIsRunInterval(true);
                            return weekData.runInterval;
                        } else {
                            onComplete();
                            return 0;
                        }
                    }
                }
                return prev - 1;
            });
            setTotalTimeElapsed(t => t + 1);
        }, 1000);

        return () => window.clearInterval(timer);
    }, [isRunInterval, currentRep, weekData, onComplete]);
    
    const progressPercent = (totalTimeElapsed / totalDuration) * 100;

    return (
        <div className="w-full h-full flex flex-col items-center justify-between text-center px-6 py-10 animate-fade-in-up">
            <header className="flex flex-col items-center gap-4">
                <div className="p-4 bg-surface-bg rounded-full border border-surface-border shadow-sm">
                    <CardioIcon className="w-8 h-8 text-brand-accent" />
                </div>
                <div className="bg-surface-bg/60 px-4 py-2 rounded-xl border border-surface-border shadow-sm">
                    <p className="text-xs font-bold text-text-secondary uppercase tracking-widest">Semana {cardioWeek} • Rep {currentRep}/{weekData.repetitions}</p>
                </div>
            </header>

            <main className="flex flex-col items-center justify-center flex-grow overflow-y-auto hide-scrollbar">
                <p className={`text-[12vw] font-black transition-colors leading-none tracking-tighter ${isRunInterval ? 'text-brand-accent drop-shadow-[0_0_30px_rgba(var(--color-brand-accent-rgb),0.5)]' : 'text-brand-protein'}`}>
                    {isRunInterval ? 'CORRE' : 'CAMINA'}
                </p>
                <div className="mt-8 bg-surface-bg/80 border border-surface-border rounded-3xl px-8 py-4 backdrop-blur-md shadow-sm">
                    <p className="text-[15vw] font-bold text-white font-mono leading-none tracking-tighter tabular-nums">
                        {Math.floor(intervalTimeLeft / 60)}:{(intervalTimeLeft % 60).toString().padStart(2, '0')}
                    </p>
                </div>
            </main>

            <footer className="w-full max-w-sm flex-shrink-0 pb-safe">
                <div className="flex justify-between items-end mb-2">
                    <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Progreso Total</p>
                    <p className="text-[10px] font-mono text-brand-accent">{Math.round(progressPercent)}%</p>
                </div>
                <div className="w-full bg-surface-bg rounded-full h-3 overflow-hidden border border-surface-border shadow-inner">
                    <div className="bg-brand-accent h-full transition-all duration-1000 linear shadow-[0_0_10px_rgba(var(--color-brand-accent-rgb),0.5)]" style={{ width: `${progressPercent}%` }}></div>
                </div>
            </footer>
        </div>
    );
};

export default CardioScreen;
