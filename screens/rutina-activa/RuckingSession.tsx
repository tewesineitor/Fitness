import React, { useEffect, useRef, useState } from 'react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import StepperControl from '../../components/StepperControl';
import Tag from '../../components/Tag';
import ImmersiveFocusShell from '../../components/layout/ImmersiveFocusShell';
import { ClockIcon, FireIcon, PauseIcon, PlayIcon, StopIcon } from '../../components/icons';
import { vibrate } from '../../utils/helpers';

interface RuckingSessionProps {
  onFinish: (sessionData: { duration: number; weight: number; calories: number }) => void;
  onCancel: () => void;
}

const RuckingSession: React.FC<RuckingSessionProps> = ({ onFinish, onCancel }) => {
  const [step, setStep] = useState<'setup' | 'active' | 'summary'>('setup');
  const [weight, setWeight] = useState<number>(10);
  const [targetTime, setTargetTime] = useState<number>(30);

  const [elapsedTime, setElapsedTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [calories, setCalories] = useState(0);

  const timerRef = useRef<number | null>(null);

  const calculateCalories = (seconds: number, weightKg: number) => {
    const totalWeight = 75 + weightKg;
    const kcalPerMin = 0.1 * totalWeight;
    return kcalPerMin * (seconds / 60);
  };

  useEffect(() => {
    if (isActive) {
      timerRef.current = window.setInterval(() => {
        setElapsedTime((prev) => {
          const newTime = prev + 1;
          setCalories(calculateCalories(newTime, weight));
          return newTime;
        });
      }, 1000);
    } else if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isActive, weight]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    vibrate(10);
    setIsActive(true);
    setStep('active');
  };

  const handlePause = () => {
    vibrate(10);
    setIsActive((value) => !value);
  };

  const handleStop = () => {
    vibrate(20);
    setIsActive(false);
    setStep('summary');
  };

  const handleSave = () => {
    onFinish({ duration: elapsedTime, weight, calories });
  };

  if (step === 'setup') {
    return (
      <ImmersiveFocusShell
        contentClassName="py-8"
        bottomBar={
          <div className="mx-auto flex w-full max-w-md gap-3">
            <Button variant="secondary" size="large" onClick={onCancel} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={handleStart} size="large" className="flex-[1.4]" variant="high-contrast">
              Iniciar sesion
            </Button>
          </div>
        }
      >
        <div className="mx-auto flex h-full max-w-md flex-col">
            <div>
              <Tag variant="status" tone="accent" size="sm">
                Rucking Setup
              </Tag>
              <h1 className="mt-4 text-3xl font-black uppercase tracking-[-0.06em] text-text-primary">Configura la carga</h1>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                Define peso y objetivo antes de iniciar la sesion activa.
              </p>
            </div>

            <div className="my-auto space-y-4 py-8">
              <Card variant="glass" className="space-y-4 p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">Peso en mochila</p>
                <StepperControl
                  value={`${weight} kg`}
                  onDecrement={() => setWeight((value) => Math.max(0, value - 1))}
                  onIncrement={() => setWeight((value) => value + 1)}
                  decrementLabel="Reducir peso"
                  incrementLabel="Aumentar peso"
                  className="w-full justify-between bg-bg-base"
                  valueClassName="text-lg"
                />
              </Card>

              <Card variant="glass" className="space-y-4 p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">Tiempo objetivo</p>
                <StepperControl
                  value={`${targetTime} min`}
                  onDecrement={() => setTargetTime((value) => Math.max(5, value - 5))}
                  onIncrement={() => setTargetTime((value) => value + 5)}
                  decrementLabel="Reducir tiempo"
                  incrementLabel="Aumentar tiempo"
                  className="w-full justify-between bg-bg-base"
                  valueClassName="text-lg"
                />
              </Card>
            </div>
          </div>
      </ImmersiveFocusShell>
    );
  }

  if (step === 'active') {
    const progress = Math.min((elapsedTime / (targetTime * 60)) * 100, 100);

    return (
      <ImmersiveFocusShell
        contentClassName="pb-32 pt-8"
        bottomBar={
          <div className="mx-auto grid w-full max-w-md grid-cols-2 gap-3">
            <Button
              onClick={handlePause}
              variant={isActive ? 'secondary' : 'outline'}
              size="large"
              icon={isActive ? PauseIcon : PlayIcon}
            >
              {isActive ? 'Pausar' : 'Reanudar'}
            </Button>
            <Button onClick={handleStop} variant="destructive" size="large" icon={StopIcon}>
              Terminar
            </Button>
          </div>
        }
      >
        <div className="mx-auto flex h-full max-w-md flex-col">
            <div className="flex items-center justify-between">
              <Tag variant="status" tone="accent" size="sm">
                {isActive ? 'En marcha' : 'Pausado'}
              </Tag>
              <Tag variant="overlay" tone="neutral" size="sm">
                {weight} kg
              </Tag>
            </div>

            <div className="my-auto py-8">
              <Card variant="glass" className="space-y-6 p-6 text-center shadow-xl">
                <p className="font-mono text-7xl font-black leading-none tracking-[-0.08em] text-text-primary">{formatTime(elapsedTime)}</p>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-text-secondary">Tiempo total</p>

                <div className="grid grid-cols-2 gap-3">
                  <Card variant="default" className="p-4 text-center">
                    <FireIcon className="mx-auto h-5 w-5 text-brand-accent" />
                    <p className="mt-3 font-mono text-3xl font-black text-text-primary">{calories.toFixed(0)}</p>
                    <p className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] text-text-secondary">Kcal</p>
                  </Card>
                  <Card variant="default" className="p-4 text-center">
                    <ClockIcon className="mx-auto h-5 w-5 text-brand-accent" />
                    <p className="mt-3 font-mono text-3xl font-black text-text-primary">{targetTime}</p>
                    <p className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] text-text-secondary">Meta min</p>
                  </Card>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">
                    <span>Progreso</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full border border-surface-border bg-bg-base">
                    <div className="h-full bg-brand-accent transition-all duration-1000" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              </Card>
            </div>
          </div>
      </ImmersiveFocusShell>
    );
  }

  return (
    <ImmersiveFocusShell
      contentClassName="pb-32 pt-8"
      bottomBar={
        <Button onClick={handleSave} size="large" className="mx-auto w-full max-w-md" variant="high-contrast">
          Guardar progreso
        </Button>
      }
    >
      <div className="mx-auto flex h-full max-w-md flex-col items-center text-center">
          <Tag variant="status" tone="accent" size="sm">
            Session Complete
          </Tag>

          <div className="my-auto w-full py-8">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.6rem] border border-brand-accent/20 bg-brand-accent/10 text-brand-accent shadow-xl">
              <FireIcon className="h-10 w-10" />
            </div>

            <h2 className="mt-8 text-4xl font-black uppercase tracking-[-0.06em] text-text-primary">Ruck completo</h2>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">Resumen rapido de la sesion antes de guardarla.</p>

            <div className="mt-8 grid grid-cols-1 gap-3">
              <Card variant="default" className="flex items-center justify-between p-5">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">Tiempo</span>
                <span className="font-mono text-2xl font-black text-text-primary">{formatTime(elapsedTime)}</span>
              </Card>
              <Card variant="default" className="flex items-center justify-between p-5">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">Carga</span>
                <span className="font-mono text-2xl font-black text-text-primary">{weight} kg</span>
              </Card>
              <Card variant="accent" className="flex items-center justify-between p-5">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">Calorias</span>
                <span className="font-mono text-2xl font-black text-text-primary">{calories.toFixed(0)} kcal</span>
              </Card>
            </div>
          </div>
        </div>
    </ImmersiveFocusShell>
  );
};

export default RuckingSession;
