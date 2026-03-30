import React from 'react';
import SquishyCard from './SquishyCard';
import { EyebrowText, GiantValue } from './Typography';

interface PremiumStepperProps {
  label: string;
  value: string | number;
  onDecrement: () => void;
  onIncrement: () => void;
  prevLabel?: string;
  accessorySlot?: React.ReactNode;
}

const PremiumStepper: React.FC<PremiumStepperProps> = ({
  label,
  value,
  onDecrement,
  onIncrement,
  prevLabel,
  accessorySlot,
}) => (
  <SquishyCard padding="lg">
    <div className="flex items-center justify-between mb-4">
      <EyebrowText>{label}</EyebrowText>
      <div className="flex items-center gap-2">
        {prevLabel ? (
          <EyebrowText>{prevLabel}</EyebrowText>
        ) : null}
        {accessorySlot}
      </div>
    </div>

    <div className="flex items-center justify-between gap-4">
      <button
        onPointerDown={onDecrement}
        className="w-20 h-20 rounded-full bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center text-3xl font-black text-zinc-300 active:scale-90 active:bg-zinc-700 transition-all duration-100 select-none flex-shrink-0"
      >
        −
      </button>

      <GiantValue className="flex-1 text-center">
        {value === '' || value === undefined ? '0' : value}
      </GiantValue>

      <button
        onPointerDown={onIncrement}
        className="w-20 h-20 rounded-full bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center text-3xl font-black text-zinc-300 active:scale-90 active:bg-zinc-700 transition-all duration-100 select-none flex-shrink-0"
      >
        +
      </button>
    </div>
  </SquishyCard>
);

export default PremiumStepper;
