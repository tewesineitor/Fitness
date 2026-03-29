import React from 'react';

type SquishyCardRadius = 'xl' | '2xl' | '3xl' | 'squishy';
type SquishyCardPadding = 'sm' | 'md' | 'lg';

interface SquishyCardProps {
  children: React.ReactNode;
  className?: string;
  radius?: SquishyCardRadius;
  padding?: SquishyCardPadding;
  interactive?: boolean;
  onClick?: () => void;
}

const radiusClasses: Record<SquishyCardRadius, string> = {
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
  squishy: 'rounded-[2rem]',
};

const paddingClasses: Record<SquishyCardPadding, string> = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

const SquishyCard: React.FC<SquishyCardProps> = ({
  children,
  className = '',
  radius = 'squishy',
  padding = 'md',
  interactive = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={[
        'bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50',
        radiusClasses[radius],
        paddingClasses[padding],
        interactive
          ? 'cursor-pointer select-none hover:brightness-[1.08] active:scale-[0.98] active:bg-zinc-800/40 transition-all duration-200 ease-out'
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
