import React, { ButtonHTMLAttributes } from 'react';
import type { IconComponent } from '../types';

interface ChipButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  tone?: 'neutral' | 'accent' | 'protein' | 'carbs' | 'success' | 'danger';
  size?: 'small' | 'medium';
  icon?: IconComponent;
}

const activeTones: Record<NonNullable<ChipButtonProps['tone']>, string> = {
  neutral: 'bg-text-primary text-bg-base border-text-primary shadow-md',
  accent: 'bg-brand-accent text-brand-accent-foreground border-brand-accent shadow-md shadow-brand-accent/30',
  protein: 'bg-brand-protein text-slate-950 border-brand-protein shadow-md shadow-brand-protein/20',
  carbs: 'bg-brand-carbs text-slate-950 border-brand-carbs shadow-md shadow-brand-carbs/20',
  success: 'bg-success text-slate-950 border-success shadow-md shadow-success/20',
  danger: 'bg-danger text-white border-danger shadow-md shadow-danger/25',
};

const sizes: Record<NonNullable<ChipButtonProps['size']>, string> = {
  small: 'h-8 px-3 text-[10px] tracking-[0.18em]',
  medium: 'h-9 px-4 text-[11px] tracking-[0.18em]',
};

const ChipButton: React.FC<ChipButtonProps> = ({
  active = false,
  tone = 'neutral',
  size = 'small',
  icon: Icon,
  className = '',
  children,
  type = 'button',
  ...props
}) => {
  const stateClass = active
    ? activeTones[tone]
    : 'bg-surface-bg text-text-secondary border-surface-border shadow-sm hover:bg-surface-hover hover:text-text-primary hover:border-text-secondary/20';

  return (
    <button
      type={type}
      className={[
        'inline-flex items-center justify-center gap-1.5 rounded-full border font-semibold uppercase select-none whitespace-nowrap',
        'transition-all duration-200 ease-[var(--ease-smooth)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base',
        'active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none',
        sizes[size],
        stateClass,
        className,
      ].join(' ')}
      aria-pressed={active}
      {...props}
    >
      {Icon && <Icon className={size === 'small' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />}
      <span>{children}</span>
    </button>
  );
};

export default ChipButton;
