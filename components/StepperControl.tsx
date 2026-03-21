import React from 'react';
import Button from './Button';
import IconButton from './IconButton';
import { MinusIcon, PlusIcon } from './icons';

interface StepperControlProps {
  value: React.ReactNode;
  decrementLabel: string;
  incrementLabel: string;
  onDecrement: () => void;
  onIncrement: () => void;
  onValueClick?: () => void;
  className?: string;
  valueClassName?: string;
  size?: 'small' | 'medium';
}

const StepperControl: React.FC<StepperControlProps> = ({
  value,
  decrementLabel,
  incrementLabel,
  onDecrement,
  onIncrement,
  onValueClick,
  className = '',
  valueClassName = '',
  size = 'medium',
}) => {
  const controlSize = size === 'small' ? 'small' : 'medium';

  return (
    <div className={['inline-flex items-center gap-1 rounded-xl border border-surface-border bg-surface-hover p-1 shadow-sm', className].join(' ')}>
      <IconButton
        onClick={onDecrement}
        icon={MinusIcon}
        label={decrementLabel}
        variant="ghost"
        size={controlSize}
      />
      {onValueClick ? (
        <Button
          onClick={onValueClick}
          variant="ghost"
          size={controlSize}
          className={['min-w-[2.75rem] px-2 font-mono text-text-primary', valueClassName].join(' ')}
        >
          {value}
        </Button>
      ) : (
        <div className={['min-w-[2.75rem] px-2 text-center font-mono text-sm font-semibold text-text-primary', valueClassName].join(' ')}>
          {value}
        </div>
      )}
      <IconButton
        onClick={onIncrement}
        icon={PlusIcon}
        label={incrementLabel}
        variant="ghost"
        size={controlSize}
      />
    </div>
  );
};

export default StepperControl;
