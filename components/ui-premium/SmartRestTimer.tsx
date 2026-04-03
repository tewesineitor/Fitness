import React from 'react';
import PremiumButton from './PremiumButton';
import { GiantValue, StatLabel } from './Typography';
import { useRestTimer } from './useRestTimer';

const SVG_SIZE = 320;
const STROKE_WIDTH = 14;
const RADIUS = 144;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

type RestPhase = 'recovery' | 'ready' | 'urgency';

interface PhaseConfig {
  ringColor: string;
  valueColor: string;
  labelClass: string;
  message: string;
  ringStyle: React.CSSProperties;
}

const phaseConfig: Record<RestPhase, PhaseConfig> = {
  recovery: {
    ringColor: 'text-cyan-400',
    valueColor: 'text-cyan-400',
    labelClass: '!text-cyan-400',
    message: 'RECUPERANDO',
    ringStyle: {},
  },
  ready: {
    ringColor: 'text-emerald-400',
    valueColor: 'text-emerald-400',
    labelClass: '!text-emerald-400',
    message: 'LISTO PARA INICIAR',
    ringStyle: { filter: 'drop-shadow(0 0 12px rgba(52,211,153,0.4))' },
  },
  urgency: {
    ringColor: 'text-amber-400',
    valueColor: 'text-amber-400',
    labelClass: '!text-amber-400',
    message: 'ULTIMOS SEGUNDOS',
    ringStyle: {},
  },
};

interface SmartRestTimerProps {
  targetTime: number;
  minimumTime: number;
  onSkip?: () => void;
  className?: string;
}

function derivePhase(currentTime: number, minimumTime: number): RestPhase {
  if (currentTime <= 10) return 'urgency';
  if (currentTime <= minimumTime) return 'ready';
  return 'recovery';
}

function formatSeconds(seconds: number): string {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

const SmartRestTimer: React.FC<SmartRestTimerProps> = ({
  targetTime,
  minimumTime,
  onSkip,
  className = '',
}) => {
  const { currentTime, completionRatio, addTime, skipRest } = useRestTimer(targetTime, minimumTime);
  const phase = derivePhase(currentTime, minimumTime);
  const config = phaseConfig[phase];
  const dashOffset = CIRCUMFERENCE * (1 - completionRatio);

  const handleSkip = () => {
    skipRest();
    onSkip?.();
  };

  return (
    <div
      className={['flex flex-col items-center gap-6 w-full max-w-[400px] mx-auto', className].filter(Boolean).join(' ')}
    >
      <div className="relative inline-flex items-center justify-center" style={{ width: SVG_SIZE, height: SVG_SIZE }}>
        <svg
          width={SVG_SIZE}
          height={SVG_SIZE}
          viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
          className="-rotate-90"
          aria-hidden="true"
        >
          <circle
            cx={160}
            cy={160}
            r={RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth={STROKE_WIDTH}
            className="text-zinc-800/50"
          />
          <circle
            cx={160}
            cy={160}
            r={RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            className={`${config.ringColor} transition-all duration-200 ease-linear`}
            style={config.ringStyle}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
          <GiantValue className={config.valueColor}>{formatSeconds(currentTime)}</GiantValue>
          <StatLabel className={config.labelClass}>{config.message}</StatLabel>
        </div>
      </div>

      <div className="flex flex-col w-full gap-3">
        <PremiumButton variant="ghost" size="sm" onClick={() => addTime(15)}>
          +15s
        </PremiumButton>
        <PremiumButton variant="primary" size="md" className="w-full" onClick={handleSkip}>
          INICIAR SERIE
        </PremiumButton>
      </div>
    </div>
  );
};

export default SmartRestTimer;
