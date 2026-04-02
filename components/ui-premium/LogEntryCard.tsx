import React from 'react';
import SquishyCard from './SquishyCard';
import { EyebrowText, MutedText, StatLabel } from './Typography';

export interface LogEntryCardProps {
  id: string;
  date: string;
  type: 'strength' | 'cardio' | 'anthropometry';
  title: string;
  heroValue: string;
  heroUnit: string;
  metadata: {
    label: string;
    subValue: string;
  };
  hasAISummary?: boolean;
  hasNotes?: boolean;
  isPR?: boolean;
}

// HUD Style Icons
const DumbbellIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.4 14.4 9.6 9.6" />
    <path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.768 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z" />
    <path d="m21.5 21.5-1.4-1.4" />
    <path d="M3.9 3.9 2.5 2.5" />
    <path d="M6.404 2.757a2 2 0 1 0-2.829 2.829l1.768-1.767a2 2 0 1 0 2.829 2.828L1.808 13.011a2 2 0 1 0-2.829-2.829l1.768-1.768a2 2 0 1 0-2.828-2.829z" />
  </svg>
);

const ZapIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
  </svg>
);

const RulerIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.4 2.4 0 0 1 0-3.4l2.6-2.6a2.4 2.4 0 0 1 3.4 0Z" />
    <path d="m14.5 12.5 2-2" />
    <path d="m11.5 9.5 2-2" />
    <path d="m8.5 6.5 2-2" />
    <path d="m17.5 15.5 2-2" />
  </svg>
);

const CrownIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
  </svg>
);

const SparklesIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="M5 3v4" />
    <path d="M19 17v4" />
    <path d="M3 5h4" />
    <path d="M17 19h4" />
  </svg>
);

const FileTextIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <path d="M10 9H8" />
    <path d="M16 13H8" />
    <path d="M16 17H8" />
  </svg>
);

const typeConfig = {
  strength: {
    containerClass: "bg-zinc-800/50 text-zinc-300 group-hover:bg-zinc-700/50",
    Icon: DumbbellIcon,
  },
  cardio: {
    containerClass: "bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20",
    Icon: ZapIcon,
  },
  anthropometry: {
    containerClass: "bg-violet-500/10 text-violet-400 group-hover:bg-violet-500/20",
    Icon: RulerIcon,
  }
};

export const LogEntryCard: React.FC<LogEntryCardProps> = ({
  id,
  date,
  type,
  title,
  heroValue,
  heroUnit,
  metadata,
  hasAISummary,
  hasNotes,
  isPR
}) => {
  const config = typeConfig[type];
  const IconProps = config.Icon;

  return (
    <SquishyCard interactive className="p-4 flex items-center gap-4 group">
      {/* IDENTIDAD POLIMÓRFICA */}
      <div className={`size-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${config.containerClass}`}>
        <IconProps />
      </div>

      {/* CENTRO: INFOMACIÓN BASE */}
      <div className="flex flex-col flex-1">
        <div className="flex gap-2 items-center">
          <MutedText className="!text-[10px] uppercase tracking-wider">{date}</MutedText>
        </div>
        <EyebrowText className="!text-base line-clamp-1">{title}</EyebrowText>
        <div className="flex items-center gap-1.5 mt-0.5">
          <MutedText className="text-xs">{metadata.label}:</MutedText>
          <span className="text-xs font-medium text-zinc-300">{metadata.subValue}</span>
        </div>
      </div>

      {/* DERECHA: HUD METRIC & FLAGS */}
      <div className="flex flex-col items-end gap-1 ml-auto border-l border-zinc-800/50 pl-4 shrink-0">
        <div className="flex items-center gap-1.5 min-h-[14px]">
          {isPR && <CrownIcon className="text-amber-400" />}
          {hasAISummary && <SparklesIcon className="text-violet-400" />}
          {hasNotes && <FileTextIcon className="text-zinc-500" />}
        </div>
        <StatLabel className="text-xl font-black text-emerald-400 tabular-nums tracking-tight">
          {heroValue} <span className="text-[10px] text-zinc-500 font-normal uppercase">{heroUnit}</span>
        </StatLabel>
      </div>
    </SquishyCard>
  );
};

export default LogEntryCard;
