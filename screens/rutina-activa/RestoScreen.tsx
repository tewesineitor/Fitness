
import React, { useState, useEffect, useRef } from 'react';
import CircularTimer from '../../components/CircularTimer';
import NextUpIndicator from '../../components/NextUpIndicator';
import { RoutineStep } from '../../types';
import { PlusIcon, ChevronRightIcon } from '../../components/icons';

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

  // Function called by CircularTimer every tick with accurate remaining time
  const handleTimerTick = (remaining: number) => {
      setTimeLeft(remaining);

      // Auto-advance
      if (remaining <= 0) {
          setTimeout(() => onCompleteRef.current(), 0);
          return;
      }

      // Haptic Logic
      if (maxDuration) {
          // For Range Timers: Check if we are inside the 'optional' zone
          // initialDuration = max time (e.g. 180s)
          // duration = min time (e.g. 60s)
          // timePassed = initial - remaining.
          // We vibrate when timePassed >= duration (min rest met)
          const timePassed = initialDuration - remaining;
          
          if (timePassed >= duration && !hasVibratedRef.current) {
              if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
              hasVibratedRef.current = true;
          }
      } else {
          // Fixed Timer
          if (remaining === 1 && !hasVibratedRef.current) {
               if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
               hasVibratedRef.current = true;
          }
      }
  };

  const handleAddSeconds = () => {
      setTimeLeft(prev => prev + 15);
      // Reset vibration if needed
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

  return (
    <div className="flex flex-col h-full px-6 py-4 animate-pop-in">
      
      {/* 1. Status Header */}
      <div className="flex-shrink-0 text-center mb-8">
          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.25em] bg-surface-hover px-3 py-1 rounded-full border border-surface-border">Estado</span>
          <h2 className={`text-3xl font-black uppercase tracking-tight mt-2 ${statusText === 'LISTO' ? 'text-green-400' : 'text-white'}`}>{statusText}</h2>
      </div>
      
      {/* 2. Timer (Centered vertically) */}
      <div className="flex-grow flex items-center justify-center relative py-4 min-h-0">
          {/* Ambient Glow */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-64 sm:h-64 rounded-full blur-[60px] opacity-20 pointer-events-none transition-colors duration-1000 ${timerColor.replace('text-', 'bg-')}`}></div>
          <div className="transform scale-75 sm:scale-100 md:scale-125 lg:scale-150 transition-transform">
              <CircularTimer 
                initialDuration={initialDuration} 
                timeLeft={timeLeft} // Pass the state so CircularTimer syncs if we add seconds
                strokeColor={timerColor}
                size={240}
                strokeWidth={10}
                onTick={handleTimerTick} // Use the accurate tick from inside
              />
          </div>
      </div>
      
      {/* 3. Bottom Controls & Next Up */}
      <div className="flex-shrink-0 w-full mt-auto space-y-4 pb-safe">
        {nextStep && (
            <div className="mb-2">
                <NextUpIndicator step={nextStep} />
            </div>
        )}

        <div className="flex justify-center gap-6 items-center">
            <button 
                onClick={handleAddSeconds} 
                className="w-16 h-16 rounded-full bg-surface-bg border border-surface-border flex flex-col items-center justify-center hover:bg-surface-hover active:scale-[0.98] transition-all text-text-secondary shadow-sm"
                aria-label="Añadir 15 segundos"
            >
                <PlusIcon className="w-5 h-5 mb-1" /> 
                <span className="text-[9px] font-bold uppercase tracking-widest">+15s</span>
            </button>
            
            <button 
                onClick={onComplete} 
                className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-[1.05] active:scale-[0.98] transition-all z-10"
                aria-label={maxDuration && initialDuration - timeLeft >= duration ? 'Continuar' : 'Omitir'}
            >
                <ChevronRightIcon className="w-8 h-8" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default RestoScreen;
