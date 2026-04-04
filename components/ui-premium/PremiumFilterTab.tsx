import React from 'react';

export interface PremiumFilterTabProps {
  id: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
  isActive: boolean;
  onClick: (id: string) => void;
}

const PremiumFilterTab: React.FC<PremiumFilterTabProps> = ({
  id,
  label,
  icon,
  count,
  isActive,
  onClick,
}) => (
  <button
    type="button"
    onClick={() => onClick(id)}
    className={[
      'relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm',
      'bg-surface-bg/60 backdrop-blur-lg border border-surface-border/80',
      'transition-all duration-200 active:scale-95 select-none whitespace-nowrap',
      'hover:bg-surface-raised/60',
      isActive ? 'text-brand-accent font-bold' : 'text-text-muted',
    ].join(' ')}
  >
    {icon && (
      <span className={[
        'flex items-center size-4',
        isActive ? 'text-brand-accent' : 'text-text-muted',
      ].join(' ')}>
        {icon}
      </span>
    )}
    <span>{label}</span>
    {count !== undefined && (
      <span className={[
        'px-1 rounded text-[9px] tabular-nums font-normal',
        isActive
          ? 'bg-brand-accent/10 text-brand-accent'
          : 'bg-surface-raised/60 text-text-muted',
      ].join(' ')}>
        {count}
      </span>
    )}
    {isActive && (
      <div className="absolute inset-x-0 bottom-0 h-px bg-brand-accent rounded-full animate-pulse" />
    )}
  </button>
);

export default PremiumFilterTab;
