import { useState, useEffect, useCallback } from 'react';

export type RestPhase = 'recovery' | 'ready' | 'urgency';

export interface UseRestTimerReturn {
  currentTime: number;
  phase: RestPhase;
  progress: number;
  formattedTime: string;
  addTime: (seconds: number) => void;
  skipRest: () => void;
  isFinished: boolean;
}

export function useRestTimer(targetTime: number, minimumTime: number): UseRestTimerReturn {
  const [currentTime, setCurrentTime] = useState(targetTime);
  const [initialTarget] = useState(targetTime);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentTime((t) => (t <= 0 ? 0 : t - 1));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const phase: RestPhase =
    currentTime > minimumTime ? 'recovery' :
    currentTime > 10 ? 'ready' :
    'urgency';

  const progress = initialTarget > 0 ? Math.min(1, currentTime / initialTarget) : 0;

  const formattedTime = `${Math.floor(currentTime / 60)}:${String(currentTime % 60).padStart(2, '0')}`;

  const addTime = useCallback((seconds: number) => {
    setCurrentTime((t) => t + seconds);
  }, []);

  const skipRest = useCallback(() => {
    setCurrentTime(0);
  }, []);

  return {
    currentTime,
    phase,
    progress,
    formattedTime,
    addTime,
    skipRest,
    isFinished: currentTime <= 0,
  };
}
