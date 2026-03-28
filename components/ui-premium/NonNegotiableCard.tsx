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
      padding="md"
      interactive={Boolean(onClick)}
      onClick={onClick}
      className={['flex items-center gap-4', className].filter(Boolean).join(' ')}
    >
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-zinc-300">
        {icon}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <EyebrowText>{title}</EyebrowText>
        <MutedText>{description}</MutedText>
      </div>

      {meta ? <MonoValue className="text-zinc-400">{meta}</MonoValue> : null}
    </SquishyCard>
  );
};

export default NonNegotiableCard;
