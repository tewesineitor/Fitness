
import React, { useState, useEffect, useRef } from 'react';
import CircularTimer from '../../components/CircularTimer';
import NextUpIndicator from '../../components/NextUpIndicator';
import { RoutineStep } from '../../types';
import { PlusIcon, ChevronRightIcon } from '../../components/icons';
import { vibrate } from '../../utils/helpers';

interface RestoScreenProps {
  duration: number;
  maxDuration?: number;
  onComplete: () => void;
  nextStep?: RoutineStep;
}

const RestoScreen: React.FC<RestoScreenProps> = ({ duration, maxDuration, onComplete, nextStep }) => {
  const startDuration = maxDuration || duration;
  
  const [timeLeft, setTimeLeft] = useState(startDuration);
  const [initialDuration, setInitialDuration] = useState(startDuration);
  const onCompleteRef = useRef(onComplete);
  const hasVibratedRef = useRef(false);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const newStart = maxDuration || duration;
    setTimeLeft(newStart);
    setInitialDuration(newStart);
    hasVibratedRef.current = false;
  }, [duration, maxDuration]);

  // Function called by CircularTimer every tick
  const handleTimerTick = (remaining: number) => {
      setTimeLeft(remaining);

      if (remaining <= 0) {
          setTimeout(() => onCompleteRef.current(), 0);
          return;
      }

      if (maxDuration) {
          const timePassed = initialDuration - remaining;
          if (timePassed >= duration && !hasVibratedRef.current) {
              vibrate([200, 100, 200]);
              hasVibratedRef.current = true;
          }
      } else {
          if (remaining === 1 && !hasVibratedRef.current) {
               vibrate([200, 100, 200]);
               hasVibratedRef.current = true;
          }
      }
  };

  const handleAddSeconds = () => {
      vibrate(5);
      setTimeLeft(prev => prev + 15);
      if (maxDuration) {
          const newTimeLeft = timeLeft + 15;
          const timePassed = initialDuration - newTimeLeft;
          if (timePassed < duration) hasVibratedRef.current = false;
      } else {
          hasVibratedRef.current = false;
      }
  };

  let timerColor = 'text-brand-accent'; 
  let statusText = 'RECUPERACIÓN';

  if (maxDuration) {
      const timePassed = initialDuration - timeLeft;
      if (timePassed < duration) {
          timerColor = 'text-brand-accent';
          statusText = 'DESCANSANDO';
      } else {
          timerColor = 'text-green-400';
          statusText = 'LISTO'; 
      }
  } else if (timeLeft <= 10) {
      timerColor = 'text-red-400';
      statusText = 'PREPÁRATE';
  }

  // Determine breathing animation class based on color
  let breathingClass = 'animate-pulse'; // Default generic
  if (timerColor === 'text-brand-accent') breathingClass = 'animate-breathe-accent';
  else if (timerColor === 'text-green-400') breathingClass = 'animate-breathe-green';
  else if (timerColor === 'text-red-400') breathingClass = 'animate-breathe-red';

  return (
    <div className="flex flex-col h-full bg-bg-base/80 overflow-hidden relative">
      
      {/* 1. Status Header */}
      <div className="flex-shrink-0 text-center pt-10 px-6 animate-fade-in-down z-10">
          <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-surface-bg/80 border border-surface-border backdrop-blur-md shadow-sm text-[10px] font-black uppercase tracking-[0.25em] text-text-secondary">
              Fase Actual
          </span>
          <h2 className={`text-4xl sm:text-5xl font-display font-black uppercase tracking-tighter mt-4 leading-none drop-shadow-md transition-colors duration-1000 ${timerColor === 'text-green-400' ? 'text-green-400' : 'text-text-primary'}`}>
              {statusText}
          </h2>
      </div>
      
      {/* 2. Immersive Breathing Timer (Centered) */}
      <div className="flex-grow flex items-center justify-center relative py-4 z-0 w-full">
          {/* Breathing Ambient Glow */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] rounded-full blur-[70px] pointer-events-none transition-colors duration-1000 ${timerColor.replace('text-', 'bg-')} ${breathingClass} opacity-30`}></div>
          
          <div className="transform scale-110 sm:scale-125 transition-transform relative z-10">
              <CircularTimer 
                initialDuration={initialDuration} 
                timeLeft={timeLeft} 
                strokeColor={timerColor}
                size={260}
                strokeWidth={10}
                onTick={handleTimerTick} 
              />
          </div>
      </div>
      
      {/* 3. Bottom Controls & Next Up Drawer */}
      <div className="flex-shrink-0 w-full mt-auto space-y-4 pb-safe bg-gradient-to-t from-bg-base via-bg-base/95 to-transparent pt-10 px-6 z-20">
        
        {nextStep && (
            <div className="mb-6 animate-fade-in-up">
                <NextUpIndicator step={nextStep} />
            </div>
        )}

        <div className="flex justify-center gap-6 items-center pb-6">
            <button 
                onClick={handleAddSeconds} 
                className="w-16 h-16 rounded-full bg-surface-bg/80 backdrop-blur-md border border-surface-border flex flex-col items-center justify-center hover:bg-surface-hover hover:border-text-secondary active:scale-95 transition-all text-text-secondary shadow-lg z-10"
                aria-label="Añadir 15 segundos"
            >
                <PlusIcon className="w-5 h-5 mb-0.5" /> 
                <span className="text-[9px] font-bold uppercase tracking-widest">+15s</span>
            </button>
            
            <button 
                onClick={() => { vibrate(15); onComplete(); }} 
                className="w-20 h-20 rounded-full bg-text-primary text-bg-base flex items-center justify-center shadow-[0_0_40px_rgba(var(--color-text-primary-rgb),0.4)] hover:scale-[1.05] active:scale-95 transition-all z-10 ring-4 ring-text-primary/10"
                aria-label={maxDuration && initialDuration - timeLeft >= duration ? 'Continuar' : 'Omitir'}
            >
                <ChevronRightIcon className="w-8 h-8 ml-1" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default RestoScreen;
