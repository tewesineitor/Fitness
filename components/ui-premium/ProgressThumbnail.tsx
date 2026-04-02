import React from 'react';
import SquishyCard from './SquishyCard';
import { EyebrowText, StatLabel, MutedText } from './Typography';

export interface ProgressThumbnailProps {
  id: string;
  imageUrl: string;
  date: string;
  weight: number;
  weightUnit: 'kg' | 'lbs';
  bodyFatPercentage?: number;
  isSelectable?: boolean;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onClick?: (id: string) => void;
}

export const ProgressThumbnail: React.FC<ProgressThumbnailProps> = ({
  id,
  imageUrl,
  date,
  weight,
  weightUnit,
  bodyFatPercentage,
  isSelectable = false,
  isSelected = false,
  onSelect,
  onClick,
}) => {
  const handleClick = () => {
    if (isSelectable && onSelect) {
      onSelect(id);
    } else if (onClick) {
      onClick(id);
    }
  };

  return (
    <SquishyCard 
      interactive 
      padding="none"
      className="aspect-[3/4] overflow-hidden relative group"
      onClick={handleClick}
    >
      {/* Capa de Imagen */}
      <img
        src={imageUrl}
        alt={`Progreso - ${date}`}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Capa de Gradiente */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent pointer-events-none" />

      {/* Footer HUD (Data) */}
      <div className="absolute inset-x-0 bottom-0 p-4 flex justify-between items-end pointer-events-none">
        
        {/* Left: Date */}
        <div className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/50 rounded-lg px-2.5 py-1">
          <EyebrowText className="!text-[10px] text-zinc-100 uppercase tracking-widest">{date}</EyebrowText>
        </div>

        {/* Right: Métrica de Peso */}
        <div className="flex flex-col items-end">
          <StatLabel className="!text-xl !font-black !text-emerald-400 tabular-nums !tracking-tight">
            {weight} <span className="text-[10px] text-zinc-500 font-normal uppercase">{weightUnit}</span>
          </StatLabel>
          {bodyFatPercentage !== undefined && (
            <MutedText className="text-[10px]">{bodyFatPercentage}% Grasa</MutedText>
          )}
        </div>
      </div>

      {/* Indicador de Selección */}
      {isSelectable && (
        <div 
          className={`absolute top-3 right-3 size-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 z-10 ${
            isSelected 
              ? 'bg-emerald-400 border-emerald-500 shadow-[0_0_10px_rgba(52,211,153,0.5)]' 
              : 'border-zinc-700 bg-zinc-950/40 backdrop-blur-sm'
          }`}
        >
          {isSelected && (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </div>
      )}
    </SquishyCard>
  );
};

export default ProgressThumbnail;
