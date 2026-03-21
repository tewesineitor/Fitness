import React from 'react';
import type { IconComponent } from '../types';

interface OptionTileProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconComponent;
  title: string;
  description?: string;
  active?: boolean;
  tone?: 'accent' | 'neutral' | 'carbs' | 'protein' | 'success';
}

const toneClasses: Record<NonNullable<OptionTileProps['tone']>, string> = {
  accent: 'text-brand-accent border-brand-accent/20 bg-brand-accent/5',
  neutral: 'text-text-primary border-surface-border bg-surface-bg',
  carbs: 'text-brand-carbs border-brand-carbs/20 bg-brand-carbs/5',
  protein: 'text-brand-protein border-brand-protein/20 bg-brand-protein/5',
  success: 'text-success border-success/20 bg-success/5',
};

const OptionTile: React.FC<OptionTileProps> = ({
  icon: Icon,
  title,
  description,
  active = false,
  tone = 'neutral',
  className = '',
  type = 'button',
  ...props
}) => {
  return (
    <button
      type={type}
      className={[
        'flex w-full flex-col items-center justify-center rounded-2xl border px-5 py-6 text-center',
        'transition-all duration-200 ease-[var(--ease-smooth)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base',
        active ? `${toneClasses[tone]} shadow-md` : 'border-surface-border bg-surface-bg text-text-primary shadow-sm hover:-translate-y-px hover:border-brand-accent/20 hover:bg-surface-hover hover:shadow-md',
        className,
      ].join(' ')}
      {...props}
    >
      <div className="mb-3 rounded-full border border-current/15 bg-current/5 p-4">
        <Icon className="h-8 w-8" />
      </div>
      <span className="text-xs font-bold uppercase tracking-wider">{title}</span>
      {description ? <span className="mt-1 text-[11px] font-medium text-text-secondary">{description}</span> : null}
    </button>
  );
};

export default OptionTile;
