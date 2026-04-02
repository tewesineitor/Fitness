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
      'bg-zinc-950/20 backdrop-blur-lg shadow-inner border border-zinc-800/60',
      'transition-all duration-200 active:scale-95 select-none whitespace-nowrap',
      'hover:bg-zinc-800/60',
      isActive ? 'text-emerald-400 font-bold' : 'text-zinc-500',
    ].join(' ')}
  >
    {icon && (
      <span className={[
        'flex items-center size-4',
        isActive ? 'text-emerald-400' : 'text-zinc-600',
      ].join(' ')}>
        {icon}
      </span>
    )}
    <span>{label}</span>
    {count !== undefined && (
      <span className={[
        'px-1 rounded text-[9px] tabular-nums font-normal',
        isActive
          ? 'bg-emerald-400/10 text-emerald-400'
          : 'bg-zinc-800/60 text-zinc-600',
      ].join(' ')}>
        {count}
      </span>
    )}
    {isActive && (
      <div className="absolute inset-x-0 bottom-0 h-px bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)] animate-pulse" />
    )}
  </button>
);

export default PremiumFilterTab;
