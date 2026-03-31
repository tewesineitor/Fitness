import React, { useState } from 'react';
const Utensils: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
    <path d="M7 2v20"/>
    <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
  </svg>
);

const ChevronDown: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6"/>
  </svg>
);
import SquishyCard from '../ui-premium/SquishyCard';
import {
  EyebrowText,
  MutedText,
  GiantValue,
  StatLabel,
} from '../ui-premium/Typography';
import PremiumButton from '../ui-premium/PremiumButton';

export interface MacroBreakdown {
  p: number;
  c: number;
  f: number;
}

export interface LoggedIngredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
  kcal: number;
  macros: MacroBreakdown;
}

export interface DailyLogMeal {
  id: string;
  title: string;
  time: string;
  totalKcal: number;
  totalMacros: MacroBreakdown;
  isCustom: boolean;
  imageUrl?: string;
  ingredients: LoggedIngredient[];
}

interface MealLogCardProps {
  meal: DailyLogMeal;
}

export const MealLogCard: React.FC<MealLogCardProps> = ({ meal }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => setExpanded((prev) => !prev);

  const getDominantMacroColor = () => {
    const { p, c, f } = meal.totalMacros;
    if (p >= c && p >= f) return 'text-violet-400';
    if (c >= p && c >= f) return 'text-emerald-400';
    return 'text-rose-400';
  };

  return (
    <div className="w-full">
      <SquishyCard interactive padding="sm" onClick={toggleExpand}>
        <div className="flex items-center gap-4">
          {/* Smart Placeholder & Picture */}
          <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 flex-none bg-zinc-800/50 backdrop-blur-md flex items-center justify-center">
            {!meal.isCustom && meal.imageUrl ? (
              <img
                src={meal.imageUrl}
                alt={meal.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <Utensils className={`w-6 h-6 ${getDominantMacroColor()}`} />
            )}
          </div>

          {/* Header Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <EyebrowText className="text-sm text-zinc-100 truncate normal-case tracking-normal">
                {meal.title}
              </EyebrowText>
              <MutedText>• {meal.time}</MutedText>
            </div>
            <StatLabel className="text-xs mt-1 block truncate">
              <span className="text-violet-500">P</span>: {meal.totalMacros.p}g{' '}
              <span className="text-cyan-400">C</span>: {meal.totalMacros.c}g{' '}
              <span className="text-orange-500">G</span>: {meal.totalMacros.f}g
            </StatLabel>
          </div>

          {/* Value & Chevron */}
          <div className="flex items-center gap-3 shrink-0">
            <GiantValue className="text-2xl">{meal.totalKcal}</GiantValue>
            <ChevronDown
              className={`w-5 h-5 text-zinc-500 transition-transform duration-300 ${
                expanded ? 'rotate-180' : ''
              }`}
            />
          </div>
        </div>

        {/* Expanded Area */}
        <div
          className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
            expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <EyebrowText className="text-[10px] mb-2 mt-4 block">INGREDIENTES</EyebrowText>
            
            <div className="flex flex-col gap-2.5 mt-3">
              {meal.ingredients.map((ing) => (
                <div key={ing.id} className="flex flex-row items-center gap-3 text-xs">
                  <div className="tabular-nums tracking-tight text-zinc-400 w-10 flex-none">
                    [{ing.amount}{ing.unit}]
                  </div>
                  
                  <div className="text-zinc-300 truncate flex-1">
                    {ing.name}
                  </div>
                  
                  {/* Dotted separator or empty space to right align macros */}
                  <div className="flex-none flex items-center justify-end gap-3 text-right">
                    <div className="tabular-nums tracking-tight text-zinc-400 w-[60px]">
                      [{ing.kcal} kcal]
                    </div>
                    <div className="tabular-nums tracking-tight text-zinc-500 w-[95px]">
                      [<span className="text-violet-500/80">P</span>:{ing.macros.p}g{' '}
                      <span className="text-cyan-400/80">C</span>:{ing.macros.c}g{' '}
                      <span className="text-orange-500/80">G</span>:{ing.macros.f}g]
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              <PremiumButton variant="ghost" size="sm" onClick={() => console.log('Edit ' + meal.id)}>
                Editar
              </PremiumButton>
              <PremiumButton 
                variant="ghost" 
                size="sm" 
                onClick={() => console.log('Delete ' + meal.id)} 
                className="!text-rose-400 hover:!text-rose-300 !border-rose-400/20 hover:!bg-rose-400/10"
              >
                Eliminar
              </PremiumButton>
            </div>
          </div>
        </div>
      </SquishyCard>
    </div>
  );
};
