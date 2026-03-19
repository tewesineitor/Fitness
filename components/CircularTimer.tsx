
import React, { useEffect, useState, useRef } from 'react';

interface CircularTimerProps {
  initialDuration: number;
  timeLeft?: number; // Optional prop if controlled externally
  size?: number;
  strokeWidth?: number;
  strokeColor?: string;
  onTick?: (remaining: number) => void; // Callback to inform parent of internal time
}

const CircularTimer: React.FC<CircularTimerProps> = ({ 
    initialDuration, 
    timeLeft: externalTimeLeft, 
    size = 200, 
    strokeWidth = 16, 
    strokeColor = 'text-brand-accent',
    onTick
}) => {
  // We use an internal state driven by timestamps to be accurate
  const [internalTimeLeft, setInternalTimeLeft] = useState(externalTimeLeft ?? initialDuration);
  const endTimeRef = useRef<number>(Date.now() + (externalTimeLeft ?? initialDuration) * 1000);
  
  // Sync if external prop changes drastically (e.g. user adds time)
  useEffect(() => {
      if (externalTimeLeft !== undefined) {
          // If the deviation is large (>1s), resync the end time target
          const expectedEndTime = Date.now() + externalTimeLeft * 1000;
          if (Math.abs(expectedEndTime - endTimeRef.current) > 1000) {
              endTimeRef.current = expectedEndTime;
              setInternalTimeLeft(externalTimeLeft);
          }
      }
  }, [externalTimeLeft]);

  // The precise timer loop
  useEffect(() => {
      const intervalId = setInterval(() => {
          const now = Date.now();
          const remaining = Math.max(0, Math.ceil((endTimeRef.current - now) / 1000));
          
          setInternalTimeLeft(remaining);
          if (onTick) onTick(remaining);

          if (remaining <= 0) {
              clearInterval(intervalId);
          }
      }, 200); // Check more frequently than 1s to feel responsive

      return () => clearInterval(intervalId);
  }, [onTick]);

  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  
  // Use the internal time for rendering
  const displayTime = internalTimeLeft;
  
  const progress = initialDuration > 0 ? Math.max(0, displayTime) / initialDuration : 0;
  const offset = circumference * (1 - progress);

  const minutes = Math.floor(displayTime / 60);
  const seconds = displayTime % 60;

  const fontSizeClass = size >= 250 ? 'text-5xl sm:text-7xl' : 'text-4xl sm:text-5xl';

  return (
    <div className="relative" style={{ width: size, height: size, maxWidth: '100%', maxHeight: '100%' }}>
      <svg className="w-full h-full" viewBox={`0 0 ${size} ${size}`}>
        <circle
          stroke="var(--color-surface-border)"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={center}
          cy={center}
        />
        <circle
          className={strokeColor}
          stroke="currentColor"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          r={radius}
          cx={center}
          cy={center}
          transform={`rotate(-90 ${center} ${center})`}
          style={{ transition: 'stroke-dashoffset 0.5s linear' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className={`${fontSizeClass} font-bold tracking-tighter tabular-nums`}>
          {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </span>
        <span className="text-sm text-text-secondary uppercase tracking-widest">Restante</span>
      </div>
    </div>
  );
};

export default CircularTimer;
