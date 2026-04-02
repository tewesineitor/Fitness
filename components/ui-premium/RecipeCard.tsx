import React from 'react';
import SquishyCard from './SquishyCard';
import IconButton from './IconButton';
import { EyebrowText, MutedText, StatLabel } from './Typography';

const StarIcon: React.FC<{ size?: number; className?: string }> = ({ size = 14, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const PlusIcon: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export interface RecipeMacros {
  protein: number;
  carbs: number;
  fat: number;
}

export interface Recipe {
  title: string;
  description: string;
  imageUrl?: string;
  category?: string;
  isFavorite?: boolean;
  portions: number;
  prepTimeMin: number;
  totals: {
    kcal: number;
    macros: RecipeMacros;
  };
}

interface RecipeCardProps {
  recipe: Recipe;
  onQuickAdd?: () => void;
  onClick?: () => void;
  className?: string;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onQuickAdd, onClick, className = '' }) => {
  const { title, description, imageUrl, totals, category, isFavorite } = recipe;

  return (
    <SquishyCard
      interactive
      padding="none"
      className={['overflow-hidden flex flex-col w-full max-w-[340px] mx-auto', className].filter(Boolean).join(' ')}
      onClick={onClick}
    >
      {/* Hero */}
      <div className="relative h-44 bg-zinc-900 flex-shrink-0">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-950" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 to-transparent" />

        {/* Favorite badge — top right */}
        {isFavorite && (
          <div className="absolute top-3 right-3 z-20 bg-zinc-950/40 p-1.5 rounded-full backdrop-blur-sm">
            <StarIcon size={16} className="text-amber-400" />
          </div>
        )}

        {/* Quick Add */}
        <div className="absolute bottom-3 right-3 z-10">
          <IconButton
            icon={<PlusIcon size={18} />}
            variant="solid"
            size="md"
            onClick={(e) => { e.stopPropagation(); onQuickAdd?.(); }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-2 flex-1">
        <div className="flex items-center justify-between mb-2">
          <StatLabel className="!text-xl !font-black !tabular-nums !text-emerald-400">{totals.kcal} <span className="text-xs text-zinc-500 font-normal">KCAL</span></StatLabel>
          <span className="text-xs uppercase tracking-wider text-zinc-400">{category ?? 'RECETA'}</span>
        </div>

        <EyebrowText className="!text-lg !text-zinc-100 !normal-case !tracking-normal leading-snug mb-2">
          {title}
        </EyebrowText>

        <MutedText className="line-clamp-2">{description}</MutedText>

        {/* Macro pills */}
        <div className="flex items-center gap-2 flex-wrap mt-auto pt-1">
          <span className="inline-flex items-center bg-zinc-900 rounded-full px-3 py-1">
            <span className="font-mono text-xs tabular-nums text-zinc-300"><span className="text-violet-400">P</span>: {totals.macros.protein}g</span>
          </span>
          <span className="inline-flex items-center bg-zinc-900 rounded-full px-3 py-1">
            <span className="font-mono text-xs tabular-nums text-zinc-300"><span className="text-emerald-400">C</span>: {totals.macros.carbs}g</span>
          </span>
          <span className="inline-flex items-center bg-zinc-900 rounded-full px-3 py-1">
            <span className="font-mono text-xs tabular-nums text-zinc-300"><span className="text-rose-400">G</span>: {totals.macros.fat}g</span>
          </span>
        </div>
      </div>
    </SquishyCard>
  );
};

export default RecipeCard;
