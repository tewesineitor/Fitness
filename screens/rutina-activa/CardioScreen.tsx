import React, { useEffect, useMemo, useRef, useState } from 'react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Tag from '../../components/Tag';
import ImmersiveFocusShell from '../../components/layout/ImmersiveFocusShell';
import { CardioIcon, ChevronRightIcon } from '../../components/icons';
import { cacoMethodData } from '../../data';
import { vibrate } from '../../utils/helpers';

interface CardioScreenProps {
  cardioWeek: number;
  onComplete: () => void;
}

const CardioScreen: React.FC<CardioScreenProps> = ({ cardioWeek, onComplete }) => {
  const weekData = useMemo(() => cacoMethodData.find((data) => data.week === cardioWeek) || cacoMethodData[0], [cardioWeek]);

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
      setIntervalTimeLeft((prev) => {
        if (prev <= 1) {
          vibrate([100, 50, 100]);

          if (isRunInterval) {
            setIsRunInterval(false);
            return weekData.walkInterval;
          }

          if (currentRep < weekData.repetitions) {
            setCurrentRep((value) => value + 1);
            setIsRunInterval(true);
            return weekData.runInterval;
          }

          setTimeout(() => onCompleteRef.current(), 0);
          return 0;
        }
        return prev - 1;
      });
      setTotalTimeElapsed((value) => value + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isRunInterval, currentRep, weekData]);

  const progressPercent = Math.min((totalTimeElapsed / totalDuration) * 100, 100);
  const intervalLabel = isRunInterval ? 'Corre' : 'Camina';
  const intervalTone = isRunInterval ? 'accent' : 'protein';

  return (
    <ImmersiveFocusShell
      contentClassName="pb-32 pt-8"
      bottomBar={
        <Button
          variant="high-contrast"
          onClick={() => { vibrate(10); onComplete(); }}
          size="large"
          className="mx-auto w-full max-w-md"
          icon={ChevronRightIcon}
        >
          Finalizar cardio
        </Button>
      }
    >
      <div className="mx-auto flex h-full max-w-md flex-col">
          <div className="text-center">
            <Tag variant="status" tone="accent" size="sm">
              Week {cardioWeek}
            </Tag>
            <div className="mt-5 flex justify-center">
              <div className="rounded-[1.5rem] border border-surface-border bg-surface-bg/80 p-5 shadow-sm">
                <CardioIcon className="h-10 w-10 text-brand-accent" />
              </div>
            </div>
            <h2 className="mt-5 text-4xl font-black uppercase tracking-[-0.07em] text-text-primary">{intervalLabel}</h2>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">
              Rep {currentRep}/{weekData.repetitions} · corre {weekData.runInterval}s / camina {weekData.walkInterval}s
            </p>
          </div>

          <div className="my-auto py-8">
            <Card variant="glass" className="space-y-6 p-6 shadow-xl">
              <div className="text-center">
                <Tag variant="status" tone={intervalTone} size="sm">
                  Intervalo activo
                </Tag>
                <p className="mt-4 font-mono text-7xl font-black leading-none tracking-[-0.08em] text-text-primary">
                  {Math.floor(intervalTimeLeft / 60)}:{(intervalTimeLeft % 60).toString().padStart(2, '0')}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Card variant="default" className="p-4 text-center">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">Progreso</p>
                  <p className="mt-2 font-mono text-3xl font-black text-text-primary">{Math.round(progressPercent)}%</p>
                </Card>
                <Card variant="default" className="p-4 text-center">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">Tiempo total</p>
                  <p className="mt-2 font-mono text-3xl font-black text-text-primary">{Math.floor(totalTimeElapsed / 60)}:{(totalTimeElapsed % 60).toString().padStart(2, '0')}</p>
                </Card>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">
                  <span>Progreso total</span>
                  <span>{Math.round(progressPercent)}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full border border-surface-border bg-bg-base">
                  <div className="h-full bg-brand-accent transition-all duration-1000" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>
            </Card>
          </div>
        </div>
    </ImmersiveFocusShell>
  );
};

export default CardioScreen;
