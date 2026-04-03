import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseRestTimerReturn {
  targetTime: number;
  minimumTime: number;
  currentTime: number;
  elapsedTime: number;
  remainingRatio: number;
  completionRatio: number;
  hasReachedMinimum: boolean;
  addTime: (seconds: number) => void;
  skipRest: () => void;
  reset: (nextTarget?: number) => void;
  isFinished: boolean;
}

const normalizeSeconds = (value: number): number => {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.floor(value));
};

export function useRestTimer(targetTime: number, minimumTime: number): UseRestTimerReturn {
  const normalizedTarget = normalizeSeconds(targetTime);
  const normalizedMinimum = normalizeSeconds(minimumTime);
  const [currentTime, setCurrentTime] = useState(normalizedTarget);
  const endTimeRef = useRef<number | null>(null);

  const reset = useCallback((nextTarget: number = normalizedTarget) => {
    const safeTarget = normalizeSeconds(nextTarget);
    endTimeRef.current = Date.now() + safeTarget * 1000;
    setCurrentTime(safeTarget);
  }, [normalizedTarget]);

  useEffect(() => {
    reset(normalizedTarget);
  }, [normalizedTarget, reset]);

  useEffect(() => {
    if (currentTime <= 0 || endTimeRef.current === null) {
      return;
    }

    const syncRemainingTime = () => {
      const remaining = Math.max(0, Math.ceil((endTimeRef.current! - Date.now()) / 1000));
      setCurrentTime((previous) => (previous === remaining ? previous : remaining));
    };

    syncRemainingTime();
    const id = window.setInterval(syncRemainingTime, 250);
    return () => window.clearInterval(id);
  }, [currentTime > 0]);

  const addTime = useCallback((seconds: number) => {
    const delta = normalizeSeconds(seconds);
    if (delta <= 0) {
      return;
    }

    const baseTime = endTimeRef.current ?? Date.now();
    endTimeRef.current = Math.max(baseTime, Date.now()) + delta * 1000;
    setCurrentTime((time) => time + delta);
  }, []);

  const skipRest = useCallback(() => {
    endTimeRef.current = Date.now();
    setCurrentTime(0);
  }, []);

  const elapsedTime = Math.max(0, normalizedTarget - currentTime);
  const remainingRatio = normalizedTarget > 0 ? Math.min(1, currentTime / normalizedTarget) : 0;
  const completionRatio = 1 - remainingRatio;
  const hasReachedMinimum = currentTime <= normalizedMinimum;

  return {
    targetTime: normalizedTarget,
    minimumTime: normalizedMinimum,
    currentTime,
    elapsedTime,
    remainingRatio,
    completionRatio,
    hasReachedMinimum,
    addTime,
    skipRest,
    reset,
    isFinished: currentTime <= 0,
  };
}
