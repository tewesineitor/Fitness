import React, { useState } from 'react';
import SquishyCard from '../ui-premium/SquishyCard';
import IconButton from '../ui-premium/IconButton';
import { EyebrowText, MutedText, StatLabel } from '../ui-premium/Typography';
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

const MacroPill: React.FC<{ label: string; value: number; colorClass: string }> = ({ label, value, colorClass }) => (
  <span className={['text-[10px] font-black tabular-nums px-1.5 py-0.5 rounded', colorClass].join(' ')}>
    {label} {value}g
  </span>
);

export interface MacroBreakdown {
  protein: number;
  carbs: number;
  fat: number;
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
    const { protein, carbs, fat } = meal.totalMacros;
    if (protein >= carbs && protein >= fat) return 'text-violet-400';
    if (carbs >= protein && carbs >= fat) return 'text-emerald-400';
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
            <div className="flex gap-1 mt-1 flex-wrap">
              <MacroPill label="P" value={meal.totalMacros.protein} colorClass="bg-violet-500/20 text-violet-400" />
              <MacroPill label="C" value={meal.totalMacros.carbs}   colorClass="bg-emerald-500/20 text-emerald-400" />
              <MacroPill label="G" value={meal.totalMacros.fat}     colorClass="bg-rose-500/20 text-rose-400" />
            </div>
          </div>

          {/* Value & Chevron */}
          <div className="flex items-center gap-3 shrink-0">
            <StatLabel className="!text-xl !font-black !tabular-nums !text-emerald-400">{meal.totalKcal} <span className="text-xs text-zinc-500 font-normal">KCAL</span></StatLabel>
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
                  <div key={ing.id} className="grid grid-cols-[6rem_1fr_3rem_9rem_4.5rem] items-center gap-x-2 py-2">
                    <StatLabel className="text-xs tabular-nums">
                      {ing.amount}{ing.unit}
                    </StatLabel>
                    <span className="text-sm font-medium text-zinc-200 truncate">
                      {ing.name}
                    </span>
                    <StatLabel className="text-xs tabular-nums text-right">{ing.kcal}</StatLabel>
                    <div className="flex gap-1 justify-end">
                      <MacroPill label="P" value={ing.macros.protein} colorClass="bg-violet-500/20 text-violet-400" />
                      <MacroPill label="C" value={ing.macros.carbs}   colorClass="bg-emerald-500/20 text-emerald-400" />
                      <MacroPill label="G" value={ing.macros.fat}     colorClass="bg-rose-500/20 text-rose-400" />
                    </div>
                    <div className="flex items-center justify-end gap-1">
                      <IconButton
                        icon={<Pencil size={14} />}
                        variant="ghost"
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); console.log('Edit', ing.id); }}
                      />
                      <IconButton
                        icon={<Trash2 size={14} />}
                        variant="danger"
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); console.log('Delete', ing.id); }}
                      />
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
