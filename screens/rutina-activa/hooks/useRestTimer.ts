import { useCallback, useEffect, useRef, useState } from 'react';
import { vibrate } from '../../../utils/helpers';

// ── Public interface ─────────────────────────────────────────────────────────

export type RestStatusTone = 'accent' | 'success' | 'danger';

export interface RestTimerState {
  timeLeft: number;
  initialDuration: number;

  // Derived display state
  timerColor: string;
  statusText: string;
  statusTone: RestStatusTone;
  isReadyToProceed: boolean;
  skipButtonLabel: string;

  // Actions
  onTick: (remaining: number) => void;
  onAddSeconds: () => void;
}

// ── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Manages the countdown rest timer between sets.
 *
 * OPTIMIZATION NOTE: `onTick` is wrapped with `useCallback(fn, [])` and reads
 * all time-sensitive values from refs instead of state/props.  This guarantees
 * a stable reference across re-renders, which prevents CircularTimer's internal
 * `setInterval` (whose `useEffect` deps include `onTick`) from restarting on
 * every parent re-render tick.
 */
export function useRestTimer(
  duration: number,
  maxDuration: number | undefined,
  onComplete: () => void,
): RestTimerState {
  const startDuration = maxDuration ?? duration;

  const [timeLeft, setTimeLeft] = useState(startDuration);
  const [initialDuration, setInitialDuration] = useState(startDuration);

  // ── Refs for stable callbacks ─────────────────────────────────────────────
  const onCompleteRef = useRef(onComplete);
  const hasVibratedRef = useRef(false);
  // Prop mirrors — updated synchronously so onTick callback sees latest values
  const durationRef = useRef(duration);
  const maxDurationRef = useRef(maxDuration);
  const initialDurationRef = useRef(startDuration);
  const timeLeftRef = useRef(startDuration);

  // Keep prop mirrors current
  useEffect(() => {
    durationRef.current = duration;
    maxDurationRef.current = maxDuration;
  }, [duration, maxDuration]);

  // Keep onComplete ref current
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Reset timer when duration props change
  useEffect(() => {
    const newStart = maxDuration ?? duration;
    setTimeLeft(newStart);
    setInitialDuration(newStart);
    initialDurationRef.current = newStart;
    timeLeftRef.current = newStart;
    hasVibratedRef.current = false;
  }, [duration, maxDuration]);

  // ── Stable tick handler (zero deps — reads exclusively from refs) ─────────
  const onTick = useCallback((remaining: number) => {
    setTimeLeft(remaining);
    timeLeftRef.current = remaining;

    if (remaining <= 0) {
      setTimeout(() => onCompleteRef.current(), 0);
      return;
    }

    const maxDur = maxDurationRef.current;
    const baseDur = durationRef.current;
    const initDur = initialDurationRef.current;

    if (maxDur) {
      const timePassed = initDur - remaining;
      if (timePassed >= baseDur && !hasVibratedRef.current) {
        vibrate([200, 100, 200]);
        hasVibratedRef.current = true;
      }
    } else if (remaining === 1 && !hasVibratedRef.current) {
      vibrate([200, 100, 200]);
      hasVibratedRef.current = true;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onAddSeconds = useCallback(() => {
    vibrate(5);
    const added = timeLeftRef.current + 15;
    setTimeLeft(added);
    timeLeftRef.current = added;

    const maxDur = maxDurationRef.current;
    const baseDur = durationRef.current;
    const initDur = initialDurationRef.current;

    if (maxDur) {
      const timePassed = initDur - added;
      if (timePassed < baseDur) hasVibratedRef.current = false;
    } else {
      hasVibratedRef.current = false;
    }
  }, []);

  // ── Derived display state ─────────────────────────────────────────────────
  let timerColor = 'text-brand-accent';
  let statusText = 'Recuperacion';
  let statusTone: RestStatusTone = 'accent';
  let isReadyToProceed = false;

  if (maxDuration) {
    const timePassed = initialDuration - timeLeft;
    if (timePassed >= duration) {
      timerColor = 'text-success';
      statusText = 'Listo';
      statusTone = 'success';
      isReadyToProceed = true;
    } else {
      statusText = 'Descansando';
    }
  } else if (timeLeft <= 10) {
    timerColor = 'text-danger';
    statusText = 'Preparate';
    statusTone = 'danger';
  }

  return {
    timeLeft,
    initialDuration,
    timerColor,
    statusText,
    statusTone,
    isReadyToProceed,
    skipButtonLabel: isReadyToProceed ? 'Continuar' : 'Omitir',
    onTick,
    onAddSeconds,
  };
}
