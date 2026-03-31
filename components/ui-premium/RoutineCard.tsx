import React from 'react';
import SquishyCard from './SquishyCard';
import PremiumButton from './PremiumButton';
import { GiantValue, MutedText, StatLabel } from './Typography';

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
            <StatLabel className="text-emerald-400 uppercase tracking-wider">
              {focus} • {estimatedTimeMin} MIN
            </StatLabel>
            <GiantValue className="!text-2xl !leading-tight mt-1 mb-3">{title}</GiantValue>
          </div>

          {/* Clinical pills — bottom of image */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-white/10 backdrop-blur-md rounded-full px-3 py-1 text-[10px] text-zinc-200 uppercase tracking-wider">
              {exerciseCount} bloques
            </span>
            <span className="bg-white/10 backdrop-blur-md rounded-full px-3 py-1 text-[10px] text-zinc-200 uppercase tracking-wider">
              enfoque: {focus}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <MutedText className="text-xs">{description}</MutedText>
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
