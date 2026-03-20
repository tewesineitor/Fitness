
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { cacoMethodData } from '../../data';
import { CardioIcon, ChevronRightIcon } from '../../components/icons';
import Button from '../../components/Button';
import { vibrate } from '../../utils/helpers';

interface CardioScreenProps {
  cardioWeek: number;
  onComplete: () => void;
}

const CardioScreen: React.FC<CardioScreenProps> = ({ cardioWeek, onComplete }) => {
    const weekData = useMemo(() => cacoMethodData.find(d => d.week === cardioWeek) || cacoMethodData[0], [cardioWeek]);
    
    const [currentRep, setCurrentRep] = useState(1);
    const [isRunInterval, setIsRunInterval] = useState(true);
    const [intervalTimeLeft, setIntervalTimeLeft] = useState(weekData.runInterval);
    const [totalTimeElapsed, setTotalTimeElapsed] = useState(0);
    
    const totalDuration = (weekData.runInterval + weekData.walkInterval) * weekData.repetitions;
    const onCompleteRef = useRef(onComplete);

    useEffect(() => {
        onCompleteRef.current = onComplete;
    }, [onComplete]);

    useEffect(() => {
        const timer = window.setInterval(() => {
            setIntervalTimeLeft(prev => {
                if (prev <= 1) {
                    vibrate([100, 50, 100]); // Haptic notification for interval switch
                    
                    if (isRunInterval) {
                        setIsRunInterval(false);
                        return weekData.walkInterval;
                    } else {
                        if (currentRep < weekData.repetitions) {
                            setCurrentRep(r => r + 1);
                            setIsRunInterval(true);
                            return weekData.runInterval;
                        } else {
                            setTimeout(() => onCompleteRef.current(), 0);
                            return 0;
                        }
                    }
                }
                return prev - 1;
            });
            setTotalTimeElapsed(t => t + 1);
        }, 1000);

        return () => window.clearInterval(timer);
    }, [isRunInterval, currentRep, weekData]);
    
    const progressPercent = Math.min((totalTimeElapsed / totalDuration) * 100, 100);

    return (
        <div className="flex flex-col h-full bg-bg-base/80 overflow-hidden relative">
            <div className="flex-grow flex flex-col items-center justify-between px-6 pt-10 pb-32 animate-fade-in-up">
                
                {/* HUD Header */}
                <header className="flex flex-col items-center gap-4 flex-shrink-0 w-full">
                    <div className="p-4 bg-surface-bg/80 backdrop-blur-md rounded-2xl border border-surface-border shadow-sm ring-1 ring-brand-accent/10">
                        <CardioIcon className="w-10 h-10 text-brand-accent drop-shadow-[0_0_15px_rgba(var(--color-brand-accent-rgb),0.5)]" />
                    </div>
                    <div className="bg-surface-bg/80 backdrop-blur-md px-5 py-2 rounded-full border border-surface-border shadow-sm">
                        <p className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">
                            Semana <span className="text-brand-accent">{cardioWeek}</span> • Rep <span className="text-brand-accent">{currentRep}</span>/{weekData.repetitions}
                        </p>
                    </div>
                </header>

                {/* Massive Timer & Status */}
                <main className="flex flex-col items-center justify-center flex-grow w-full relative my-8">
                     <p className={`text-[15vw] sm:text-[12vw] font-display font-black transition-colors duration-500 leading-none tracking-tighter mb-6 relative z-10 ${isRunInterval ? 'text-brand-accent drop-shadow-[0_0_40px_rgba(var(--color-brand-accent-rgb),0.6)]' : 'text-brand-protein drop-shadow-[0_0_30px_rgba(var(--color-brand-protein-rgb),0.4)]'}`}>
                        {isRunInterval ? 'CORRE' : 'CAMINA'}
                    </p>
                    
                    <div className={`relative z-10 bg-surface-bg/80 border rounded-[2rem] px-10 py-6 backdrop-blur-xl shadow-lg transition-colors duration-500 ${isRunInterval ? 'border-brand-accent/30 ring-1 ring-brand-accent/20' : 'border-surface-border'}`}>
                        <p className="text-[20vw] sm:text-[15vw] font-heading font-black text-white leading-none tracking-tighter tabular-nums drop-shadow-md">
                            {Math.floor(intervalTimeLeft / 60)}:{(intervalTimeLeft % 60).toString().padStart(2, '0')}
                        </p>
                    </div>
                </main>

                {/* Progress Tape */}
                <footer className="w-full max-w-sm flex-shrink-0">
                    <div className="flex justify-between items-end mb-3 px-1">
                        <p className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em]">Progreso Total</p>
                        <p className="text-[10px] font-heading font-bold text-white">{Math.round(progressPercent)}%</p>
                    </div>
                    <div className="w-full bg-surface-bg/80 rounded-full h-2.5 overflow-hidden border border-surface-border shadow-inner relative">
                        <div 
                            className="absolute top-0 left-0 bottom-0 bg-brand-accent transition-all duration-1000 linear shadow-[0_0_15px_rgba(var(--color-brand-accent-rgb),0.6)]" 
                            style={{ width: `${progressPercent}%` }}
                        ></div>
                    </div>
                </footer>
            </div>

            {/* FIXED ACTION FOOTER */}
            <div className="absolute bottom-0 left-0 right-0 p-6 pb-safe bg-gradient-to-t from-black via-black/95 to-transparent z-40">
                <Button 
                    variant="high-contrast"
                    onClick={() => { vibrate(10); onComplete(); }} 
                    size="large" 
                    className="w-full max-w-sm mx-auto py-5 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:scale-[1.02] active:scale-95 transition-all text-sm font-extrabold tracking-widest uppercase flex flex-col gap-1 items-center justify-center leading-none"
                    icon={ChevronRightIcon}
                >
                    <span>FINALIZAR CARDIO</span>
                </Button>
            </div>
        </div>
    );
};

export default CardioScreen;
