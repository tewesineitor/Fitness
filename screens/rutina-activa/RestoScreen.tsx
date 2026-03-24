import React from 'react';
import type { RoutineStep } from '../../types';
import { useRestTimer } from './hooks/useRestTimer';
import { vibrate } from '../../utils/helpers';

import CircularTimer from '../../components/CircularTimer';
import NextUpIndicator from '../../components/NextUpIndicator';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Tag from '../../components/Tag';
import ImmersiveFocusShell from '../../components/layout/ImmersiveFocusShell';
import { ChevronRightIcon, PlusIcon } from '../../components/icons';

interface RestoScreenProps {
  duration: number;
  maxDuration?: number;
  onComplete: () => void;
  nextStep?: RoutineStep;
}

const RestoScreen: React.FC<RestoScreenProps> = ({ duration, maxDuration, onComplete, nextStep }) => {
  const t = useRestTimer(duration, maxDuration, onComplete);

  return (
    <ImmersiveFocusShell
      contentClassName="pb-32 pt-8"
      bottomBar={
        <div className="mx-auto flex w-full max-w-md gap-3">
          <Button
            onClick={t.onAddSeconds}
            variant="secondary"
            size="large"
            icon={PlusIcon}
            className="flex-1"
          >
            +15s
          </Button>
          <Button
            onClick={() => { vibrate(15); onComplete(); }}
            variant="high-contrast"
            size="large"
            icon={ChevronRightIcon}
            iconPosition="right"
            className="flex-[1.4]"
          >
            {t.skipButtonLabel}
          </Button>
        </div>
      }
    >
      <div className="mx-auto flex h-full max-w-md flex-col">
        {/* ── Status header ──────────────────────────────────────────────── */}
        <div className="text-center">
          <Tag variant="status" tone={t.statusTone} size="sm">
            Rest Phase
          </Tag>
          <h2 className={`mt-4 text-4xl font-black uppercase tracking-[-0.06em] ${t.timerColor}`}>
            {t.statusText}
          </h2>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-text-secondary">
            Mantente en control, recupera respiracion y entra a la siguiente serie con una transicion limpia.
          </p>
        </div>

        {/* ── Circular timer ─────────────────────────────────────────────── */}
        <div className="my-auto py-8">
          <Card variant="glass" className="flex flex-col items-center gap-6 p-6 text-center shadow-xl">
            <CircularTimer
              initialDuration={t.initialDuration}
              timeLeft={t.timeLeft}
              strokeColor={t.timerColor}
              size={240}
              strokeWidth={10}
              onTick={t.onTick}
            />
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-text-secondary">
                Tiempo restante
              </p>
              <p className="mt-2 text-sm font-medium text-text-secondary">
                {maxDuration ? `Objetivo base ${duration}s` : 'Cuenta regresiva de recuperacion'}
              </p>
            </div>
          </Card>
        </div>

        {/* ── Next up indicator ──────────────────────────────────────────── */}
        {nextStep ? (
          <div className="mt-auto">
            <NextUpIndicator step={nextStep} />
          </div>
        ) : null}
      </div>
    </ImmersiveFocusShell>
  );
};

export default RestoScreen;
