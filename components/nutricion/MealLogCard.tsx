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
const Pencil: React.FC<{ size?: number }> = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
  </svg>
);
const Trash2: React.FC<{ size?: number }> = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 6h18M19 6l-1 14H6L5 6M9 6V4h6v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);
import SquishyCard from '../ui-premium/SquishyCard';
import {
  EyebrowText,
  MutedText,
  StatLabel,
} from '../ui-premium/Typography';

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
              <EyebrowText className="!text-lg !text-zinc-100 !normal-case !tracking-normal mb-1 truncate">
                {meal.title}
              </EyebrowText>
              <MutedText>• {meal.time}</MutedText>
            </div>
            <StatLabel className="text-sm mt-1 block truncate">
              <span className="text-violet-400">P</span>: {meal.totalMacros.p}g{' '}
              <span className="text-emerald-400">C</span>: {meal.totalMacros.c}g{' '}
              <span className="text-rose-400">G</span>: {meal.totalMacros.f}g
            </StatLabel>
          </div>

          {/* Value & Chevron */}
          <div className="flex items-center gap-3 shrink-0">
            <StatLabel className="!text-xl font-black tabular-nums">{meal.totalKcal} <span className="text-xs text-zinc-500 font-normal">kcal</span></StatLabel>
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

            <div className="flex flex-col divide-y divide-white/5 mt-3">
              {meal.ingredients.map((ing) => {
                const isStd = ['g', 'ml', 'l', 'kg'].includes(ing.unit.toLowerCase());
                return (
                  <div key={ing.id} className="grid grid-cols-[7rem_1fr_4rem_7rem_2rem] items-center gap-x-3 py-2">
                    <StatLabel className="text-xs tabular-nums">
                      {ing.amount}{isStd ? ing.unit : ing.unit}
                    </StatLabel>
                    <StatLabel className="text-sm text-zinc-300 font-normal truncate">
                      {ing.name}
                    </StatLabel>
                    <StatLabel className="text-xs tabular-nums text-right">{ing.kcal}</StatLabel>
                    <StatLabel className="text-xs tabular-nums text-right whitespace-nowrap">
                      <span className="text-violet-400">P</span>:{ing.macros.p}g{' '}
                      <span className="text-emerald-400">C</span>:{ing.macros.c}g{' '}
                      <span className="text-rose-400">G</span>:{ing.macros.f}g
                    </StatLabel>
                    <div className="flex items-center justify-end gap-0.5">
                      <button
                        onClick={(e) => { e.stopPropagation(); console.log('Edit', ing.id); }}
                        className="text-zinc-500 hover:text-emerald-400 cursor-pointer p-1 rounded transition-colors"
                      >
                        <Pencil size={12} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); console.log('Delete', ing.id); }}
                        className="text-zinc-500 hover:text-rose-400 cursor-pointer p-1 rounded transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </SquishyCard>
    </div>
  );
};
