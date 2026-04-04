import React from 'react';

type SquishyCardRadius = 'xl' | '2xl' | '3xl' | 'squishy';
type SquishyCardPadding = 'none' | 'sm' | 'md' | 'lg';

interface SquishyCardProps {
  children: React.ReactNode;
  className?: string;
  radius?: SquishyCardRadius;
  padding?: SquishyCardPadding;
  interactive?: boolean;
  active?: boolean;
  onClick?: () => void;
}

const radiusClasses: Record<SquishyCardRadius, string> = {
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
  squishy: 'rounded-[2rem]',
};

const paddingClasses: Record<SquishyCardPadding, string> = {
  none: 'p-0',
  sm: 'p-3 md:p-4',
  md: 'p-4 md:p-6',
  lg: 'p-5 md:p-6 xl:p-8',
};

const SquishyCard: React.FC<SquishyCardProps> = ({
  children,
  className = '',
  radius = 'squishy',
  padding = 'md',
  interactive = false,
  active = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={[
        'bg-surface-bg backdrop-blur-xl border transition-all duration-200 ease-out',
        active ? 'border-brand-accent/40 ring-1 ring-brand-accent/30 bg-surface-raised' : 'border-surface-border/70',
        radiusClasses[radius],
        paddingClasses[padding],
        interactive
          ? 'cursor-pointer select-none hover:brightness-[1.06] active:scale-[0.98] active:bg-surface-hover'
          : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
};

export default SquishyCard;
