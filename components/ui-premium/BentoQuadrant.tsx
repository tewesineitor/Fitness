import React from 'react';
import SquishyCard from './SquishyCard';
import { MutedText, StatLabel, StatValue } from './Typography';

interface BentoQuadrantProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  colorToken?: string;
  className?: string;
}

const BentoQuadrant: React.FC<BentoQuadrantProps> = ({
  title,
  value,
  unit,
  icon,
  colorToken = 'text-brand-accent',
  className = '',
}) => (
  <SquishyCard
    padding="sm"
    className={['flex flex-col justify-between aspect-square', className].filter(Boolean).join(' ')}
  >
    <div className="flex items-center justify-between">
      <StatLabel>{title}</StatLabel>
      <span className={['flex-shrink-0', colorToken].join(' ')}>{icon}</span>
    </div>

    <div className="flex flex-col gap-0">
      <StatValue className={['text-4xl leading-none', colorToken].join(' ')}>
        {value}
      </StatValue>
      {unit ? <MutedText>{unit}</MutedText> : null}
    </div>
  </SquishyCard>
);

export default BentoQuadrant;
