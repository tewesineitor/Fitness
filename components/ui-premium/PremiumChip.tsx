import React from 'react';
import { StatLabel } from './Typography';

interface PremiumChipProps {
  children: React.ReactNode;
  className?: string;
  tone?: 'neutral' | 'accent';
}

const toneClasses: Record<NonNullable<PremiumChipProps['tone']>, string> = {
  neutral: 'bg-zinc-800 text-zinc-400',
  accent: 'bg-emerald-400/10 text-emerald-300',
};

const PremiumChip: React.FC<PremiumChipProps> = ({
  children,
  className = '',
  tone = 'neutral',
}) => (
  <span
    className={[
      'inline-flex items-center rounded-full px-3 py-1',
      toneClasses[tone],
      className,
    ]
      .filter(Boolean)
      .join(' ')}
  >
    <StatLabel>{children}</StatLabel>
  </span>
);

export default PremiumChip;
