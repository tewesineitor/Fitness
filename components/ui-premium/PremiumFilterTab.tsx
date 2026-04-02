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
      'relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm',
      'transition-all duration-200 active:scale-95 select-none whitespace-nowrap',
      'bg-zinc-900/50 backdrop-blur-md border border-zinc-800 hover:bg-zinc-800/80',
      isActive ? 'bg-zinc-100/10 text-white font-bold' : 'text-zinc-400',
    ].join(' ')}
  >
    {icon && (
      <span className={["flex items-center", isActive ? "text-emerald-400" : "text-zinc-500"].join(' ')}>
        {icon}
      </span>
    )}
    <span>{label}</span>
    {count !== undefined && (
      <span
        className={[
          'px-1.5 rounded text-[10px] tabular-nums font-normal',
          isActive
            ? 'bg-zinc-800/80 text-zinc-100'
            : 'bg-zinc-800/60 text-zinc-500',
        ].join(' ')}
      >
        {count}
      </span>
    )}
    {isActive && (
      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)] animate-pulse" />
    )}
  </button>
);

export default PremiumFilterTab;
