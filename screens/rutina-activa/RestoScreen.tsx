import React, { useEffect, useRef, useState } from 'react';
import CircularTimer from '../../components/CircularTimer';
import NextUpIndicator from '../../components/NextUpIndicator';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Tag from '../../components/Tag';
import type { RoutineStep } from '../../types';
import { ChevronRightIcon, PlusIcon } from '../../components/icons';
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
    } else if (remaining === 1 && !hasVibratedRef.current) {
      vibrate([200, 100, 200]);
      hasVibratedRef.current = true;
    }
  };

  const handleAddSeconds = () => {
    vibrate(5);
    setTimeLeft((prev) => prev + 15);
    if (maxDuration) {
      const newTimeLeft = timeLeft + 15;
      const timePassed = initialDuration - newTimeLeft;
      if (timePassed < duration) hasVibratedRef.current = false;
    } else {
      hasVibratedRef.current = false;
    }
  };

  let timerColor = 'text-brand-accent';
  let statusText = 'Recuperacion';
  let statusTone: 'accent' | 'success' | 'danger' = 'accent';

  if (maxDuration) {
    const timePassed = initialDuration - timeLeft;
    if (timePassed >= duration) {
      timerColor = 'text-success';
      statusText = 'Listo';
      statusTone = 'success';
    } else {
      statusText = 'Descansando';
    }
  } else if (timeLeft <= 10) {
    timerColor = 'text-danger';
    statusText = 'Preparate';
    statusTone = 'danger';
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-bg-base">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-brand-accent/10 to-transparent" />
      <div className="flex-1 overflow-y-auto px-6 pb-32 pt-8 hide-scrollbar">
        <div className="mx-auto flex h-full max-w-md flex-col">
          <div className="text-center">
            <Tag variant="status" tone={statusTone} size="sm">
              Rest Phase
            </Tag>
            <h2 className={`mt-4 text-4xl font-black uppercase tracking-[-0.06em] ${timerColor}`}>{statusText}</h2>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-text-secondary">
              Mantente en control, recupera respiracion y entra a la siguiente serie con una transicion limpia.
            </p>
          </div>

          <div className="my-auto py-8">
            <Card variant="glass" className="flex flex-col items-center gap-6 p-6 text-center shadow-xl">
              <CircularTimer
                initialDuration={initialDuration}
                timeLeft={timeLeft}
                strokeColor={timerColor}
                size={240}
                strokeWidth={10}
                onTick={handleTimerTick}
              />
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-text-secondary">Tiempo restante</p>
                <p className="mt-2 text-sm font-medium text-text-secondary">
                  {maxDuration ? `Objetivo base ${duration}s` : 'Cuenta regresiva de recuperacion'}
                </p>
              </div>
            </Card>
          </div>

          {nextStep ? (
            <div className="mt-auto">
              <NextUpIndicator step={nextStep} />
            </div>
          ) : null}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 border-t border-surface-border bg-bg-base px-6 pb-safe pt-5 shadow-[0_-8px_24px_-8px_rgba(0,0,0,0.08)]">
        <div className="mx-auto flex w-full max-w-md gap-3">
          <Button onClick={handleAddSeconds} variant="secondary" size="large" icon={PlusIcon} className="flex-1">
            +15s
          </Button>
          <Button
            onClick={() => {
              vibrate(15);
              onComplete();
            }}
            variant="high-contrast"
            size="large"
            icon={ChevronRightIcon}
            iconPosition="right"
            className="flex-[1.4]"
          >
            {maxDuration && initialDuration - timeLeft >= duration ? 'Continuar' : 'Omitir'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RestoScreen;
