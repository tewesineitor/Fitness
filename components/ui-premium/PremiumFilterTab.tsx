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
      'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm',
      'transition-all duration-200 active:scale-95 select-none whitespace-nowrap',
      isActive
        ? 'bg-zinc-100 text-zinc-950 font-bold shadow-[0_0_15px_rgba(244,244,245,0.15)]'
        : 'bg-zinc-900/50 text-zinc-400 border border-zinc-800 hover:bg-zinc-800',
    ].join(' ')}
  >
    {icon && <span className="flex items-center">{icon}</span>}
    <span>{label}</span>
    {count !== undefined && (
      <span
        className={[
          'px-1.5 rounded text-[10px] tabular-nums font-normal',
          isActive
            ? 'bg-zinc-950/20 text-zinc-700'
            : 'bg-zinc-800/60 text-zinc-500',
        ].join(' ')}
      >
        {count}
      </span>
    )}
  </button>
);

export default PremiumFilterTab;
