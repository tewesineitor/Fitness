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
      <div className="relative h-56 bg-zinc-900 flex-shrink-0">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-950" />
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />

        {/* Superpuesto: header */}
        <div className="absolute inset-0 z-10 flex flex-col justify-between p-6">
          <div>
            <StatLabel className="uppercase tracking-wider">
              <span className="text-emerald-400">{focus}</span>
              <span className="text-zinc-400"> • </span>
              <span className="text-emerald-400">{estimatedTimeMin} MIN</span>
            </StatLabel>
            <span className="text-2xl font-bold text-white leading-tight block mt-1 mb-3">{title}</span>
          </div>

          {/* Metadata row — bottom of image */}
          <div className="flex items-center justify-start gap-3">
            <StatLabel className="text-zinc-200 text-xs tracking-wider uppercase">{exerciseCount} BLOQUES</StatLabel>
            <span className="text-zinc-600">|</span>
            <StatLabel className="text-zinc-200 text-xs tracking-wider uppercase">ENFOQUE {focus}</StatLabel>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <MutedText className="!text-zinc-300">{description}</MutedText>
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
