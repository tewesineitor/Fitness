import React from 'react';
import type { RoutineStep } from '../../types';
import { useRestTimer } from '../../components/ui-premium';
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

type RestVisualState = 'recovery' | 'ready' | 'urgency';

function getVisualState(currentTime: number, minimumTime: number): RestVisualState {
  if (currentTime <= 10) return 'urgency';
  if (currentTime <= minimumTime) return 'ready';
  return 'recovery';
}

const RestoScreen: React.FC<RestoScreenProps> = ({ duration, maxDuration, onComplete, nextStep }) => {
  const targetTime = maxDuration ?? duration;
  const t = useRestTimer(targetTime, 10);
  const isReadyToProceed = maxDuration ? t.elapsedTime >= duration : t.isFinished;
  const visualState = getVisualState(t.currentTime, t.minimumTime);

  const timerColor = maxDuration
    ? isReadyToProceed ? 'text-success' : 'text-brand-accent'
    : visualState === 'urgency' ? 'text-danger' : visualState === 'ready' ? 'text-success' : 'text-brand-accent';

  const statusText = maxDuration
    ? isReadyToProceed ? 'Listo' : 'Descansando'
    : visualState === 'urgency' ? 'Preparate' : visualState === 'ready' ? 'Listo' : 'Recuperacion';

  const statusTone = maxDuration
    ? isReadyToProceed ? 'success' : 'accent'
    : visualState === 'urgency' ? 'danger' : visualState === 'ready' ? 'success' : 'accent';

  const skipButtonLabel = isReadyToProceed ? 'Continuar' : 'Omitir';

  return (
    <ImmersiveFocusShell
      contentClassName="pb-32 pt-8"
      bottomBar={
        <div className="mx-auto flex w-full max-w-md gap-3">
          <Button
            onClick={() => { vibrate(5); t.addTime(15); }}
            variant="secondary"
            size="large"
            icon={PlusIcon}
            className="flex-1"
          >
            +15s
          </Button>
          <Button
            onClick={() => { t.skipRest(); vibrate(15); onComplete(); }}
            variant="high-contrast"
            size="large"
            icon={ChevronRightIcon}
            iconPosition="right"
            className="flex-[1.4]"
          >
            {skipButtonLabel}
          </Button>
        </div>
      }
    >
      <div className="mx-auto flex h-full max-w-md flex-col">
        <div className="text-center">
          <Tag variant="status" tone={statusTone} size="sm">
            Rest Phase
          </Tag>
          <h2 className={`mt-4 text-4xl font-black uppercase tracking-[-0.06em] ${timerColor}`}>
            {statusText}
          </h2>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-text-secondary">
            Mantente en control, recupera respiracion y entra a la siguiente serie con una transicion limpia.
          </p>
        </div>

        <div className="my-auto py-8">
          <Card variant="glass" className="flex flex-col items-center gap-6 p-6 text-center shadow-xl">
            <CircularTimer
              initialDuration={t.targetTime}
              timeLeft={t.currentTime}
              strokeColor={timerColor}
              size={240}
              strokeWidth={10}
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
