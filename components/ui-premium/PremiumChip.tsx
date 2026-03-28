import React from 'react';

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
      'inline-flex items-center rounded-full px-3 py-1 text-xs font-bold',
      toneClasses[tone],
      className,
    ]
      .filter(Boolean)
      .join(' ')}
  >
    {children}
  </span>
);

export default PremiumChip;
