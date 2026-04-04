import React from 'react';
import SquishyCard from './SquishyCard';
import PremiumButton from './PremiumButton';
import { MutedText, StatLabel } from './Typography';

export interface WorkoutRoutine {
  title: string;
  description: string;
  imageUrl?: string;
  focus: string;
  estimatedTimeMin: number;
  exerciseCount: number;
}

interface RoutineCardProps {
  routine: WorkoutRoutine;
  onView?: () => void;
  className?: string;
}

const RoutineCard: React.FC<RoutineCardProps> = ({ routine, onView, className = '' }) => {
  const { title, description, imageUrl, focus, estimatedTimeMin, exerciseCount } = routine;

  return (
    <SquishyCard
      interactive
      padding="none"
      className={['overflow-hidden flex flex-col w-full max-w-[340px] mx-auto', className].filter(Boolean).join(' ')}
    >
      {/* Hero h-56 */}
      <div className="relative h-56 bg-surface-bg flex-shrink-0">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-surface-raised via-surface-bg to-bg-base" />
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-base to-transparent" />

        {/* Superpuesto: header */}
        <div className="absolute inset-0 z-10 flex flex-col justify-between p-6">
          <div>
            <StatLabel className="uppercase tracking-wider">
              <span className="text-brand-accent">{focus}</span>
              <span className="text-text-muted"> • </span>
              <span className="text-brand-accent">{estimatedTimeMin} MIN</span>
            </StatLabel>
            <span className="text-2xl font-bold text-text-primary leading-tight block mt-1 mb-3">{title}</span>
          </div>

          {/* Metadata row — bottom of image */}
          <div className="flex items-center justify-start gap-3">
            <StatLabel className="text-text-secondary text-xs tracking-wider uppercase">{exerciseCount} BLOQUES</StatLabel>
            <span className="text-surface-border">|</span>
            <StatLabel className="text-text-secondary text-xs tracking-wider uppercase">ENFOQUE {focus}</StatLabel>
          </div>
        </div>
      </div>

      <div className="p-5 flex flex-col gap-3 flex-1">
        <MutedText className="!text-text-secondary">{description}</MutedText>
        <PremiumButton
          variant="primary"
          size="md"
          className="w-full mt-4"
          onClick={onView}
        >
          VER RUTINA
        </PremiumButton>
      </div>
    </SquishyCard>
  );
};

export default RoutineCard;
