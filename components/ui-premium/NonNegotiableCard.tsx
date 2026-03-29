import React from 'react';
import SquishyCard from './SquishyCard';
import { EyebrowText, MonoValue, MutedText } from './Typography';

interface NonNegotiableCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  meta?: string;
  className?: string;
  onClick?: () => void;
}

const NonNegotiableCard: React.FC<NonNegotiableCardProps> = ({
  icon,
  title,
  description,
  meta,
  className = '',
  onClick,
}) => {
  return (
    <SquishyCard
      padding="sm"
      interactive={Boolean(onClick)}
      onClick={onClick}
      className={['flex items-center gap-3', className].filter(Boolean).join(' ')}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-zinc-800/80 text-zinc-300">
        {icon}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <EyebrowText>{title}</EyebrowText>
        <MutedText>{description}</MutedText>
      </div>

      {meta ? <MonoValue className="shrink-0 text-zinc-400">{meta}</MonoValue> : null}
    </SquishyCard>
  );
};

export default NonNegotiableCard;
