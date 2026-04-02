import React from 'react';
import SquishyCard from './SquishyCard';
import IconButton from './IconButton';
import { EyebrowText, MutedText, StatLabel } from './Typography';

const PlusIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const PencilIcon: React.FC<{ size?: number; className?: string }> = ({ size = 12, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
  </svg>
);

const ScaleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>
    <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>
    <path d="M7 21h10"/>
    <path d="M12 3v18"/>
    <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>
  </svg>
);

const MacroPill: React.FC<{
  label: string;
  value: number;
  colorClass: string;
}> = ({ label, value, colorClass }) => (
  <span
    className={[
      'text-[10px] font-black tabular-nums px-1.5 py-0.5 rounded',
      colorClass,
    ].join(' ')}
  >
    {label} {value}
  </span>
);

export interface IngredientMacros {
  protein: number;
  carbs: number;
  fat: number;
}

export interface IngredientItemProps {
  name: string;
  brand?: string;
  imageUrl?: string;
  macros: IngredientMacros;
  calories: number;
  standardPortion: string;
  weightRaw?: string;
  weightCooked?: string;
  isAddedToPlate: boolean;
  quantityMultiplier: number;
  onAdd: () => void;
  onUpdateQuantity: (delta: number) => void;
  onEdit: () => void;
}

const IngredientListItem: React.FC<IngredientItemProps> = ({
  name,
  brand,
  imageUrl,
  macros,
  calories,
  standardPortion,
  weightRaw,
  weightCooked,
  isAddedToPlate,
  quantityMultiplier,
  onAdd,
  onUpdateQuantity,
  onEdit,
}) => {
  const parseWeight = (val?: string): number => {
    if (!val) return 0;
    const match = val.match(/\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : 0;
  };

  const rawBase    = parseWeight(weightRaw);
  const cookedBase = parseWeight(weightCooked);
  const hasEquiv   = (weightRaw && rawBase > 0) || (weightCooked && cookedBase > 0);

  const scaledMacros = {
    protein: Math.round(macros.protein * quantityMultiplier),
    carbs:   Math.round(macros.carbs   * quantityMultiplier),
    fat:     Math.round(macros.fat     * quantityMultiplier),
  };

  return (
    <SquishyCard padding="sm" className="flex gap-4 items-center">

      {/* ── LEFT: Image ─────────────────────────────────── */}
      <div className="shrink-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="size-20 rounded-2xl object-cover border border-white/5"
          />
        ) : (
          <div className="size-20 rounded-2xl bg-zinc-800/80 border border-white/5 flex items-center justify-center">
            <span className="text-zinc-500 text-2xl font-black select-none">
              {name[0].toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* ── CENTER: Identity + Macros + HUD ─────────────── */}
      <div className="flex flex-col flex-1 min-w-0 gap-1.5">

        {/* Name */}
        <EyebrowText className="!text-[17px] !font-bold !text-zinc-100 !normal-case !tracking-normal !leading-tight truncate">
          {name}
        </EyebrowText>

        {/* Brand row + pencil */}
        <div className="flex items-center gap-2 -mt-0.5 pb-1.5 border-b border-zinc-800/50">
          <MutedText className="!text-[11px] !uppercase !tracking-wider !text-zinc-500 truncate flex-1">
            {brand ?? '—'}
          </MutedText>
          <IconButton
            icon={<PencilIcon size={12} />}
            variant="ghost"
            onClick={onEdit}
            aria-label="Editar ingrediente"
            className="!p-0 !size-4 !min-w-0 !rounded-sm text-zinc-600 hover:text-zinc-300 shrink-0"
          />
        </div>

        {/* Macro pills — scaled */}
        <div className="flex gap-1 flex-wrap">
          <MacroPill label="P" value={scaledMacros.protein} colorClass="bg-violet-500/20 text-violet-400" />
          <MacroPill label="C" value={scaledMacros.carbs}   colorClass="bg-emerald-500/20 text-emerald-400" />
          <MacroPill label="G" value={scaledMacros.fat}     colorClass="bg-rose-500/20 text-rose-400" />
        </div>

        {/* ── HUD Micro-Viz ───────────────────────────────── */}
        <div className="w-full flex items-center justify-between gap-3 mt-0.5 pt-1.5 border-t border-zinc-800/50">
          {/* Left: portion multiplier */}
          <div className="flex items-center gap-1.5 text-zinc-300">
            <ScaleIcon className="text-zinc-600 shrink-0" />
            <span className="text-[11px] font-mono tabular-nums text-zinc-400">
              {quantityMultiplier % 1 !== 0
                ? quantityMultiplier.toFixed(2)
                : quantityMultiplier}{' '}
              <span className="text-zinc-600">×</span>{' '}
              {standardPortion}
            </span>
          </div>

          {/* Right: equivalencias crudo/cocido (conditional) */}
          {hasEquiv && (
            <div className="flex gap-2 items-center text-[11px] font-mono tabular-nums shrink-0">
              {weightRaw && rawBase > 0 && (
                <span className="text-zinc-400">
                  <span className="text-zinc-600 font-sans text-[10px] uppercase tracking-wider mr-0.5">Crudo</span>
                  {Math.round(rawBase * quantityMultiplier)}g
                </span>
              )}
              {weightRaw && rawBase > 0 && weightCooked && cookedBase > 0 && (
                <span className="text-zinc-700">|</span>
              )}
              {weightCooked && cookedBase > 0 && (
                <span className="text-emerald-300">
                  <span className="text-zinc-600 font-sans text-[10px] uppercase tracking-wider mr-0.5">Cocido</span>
                  {Math.round(cookedBase * quantityMultiplier)}g
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── RIGHT: Hero KPI + Action ────────────────────── */}
      <div className="w-28 flex flex-col items-end gap-3 shrink-0 self-stretch justify-between">
        {/* Calories */}
        <StatLabel className="!text-2xl !font-black !text-emerald-400 !tabular-nums text-right leading-none">
          {Math.round(calories * quantityMultiplier)}{' '}
          <span className="text-xs text-zinc-500 font-normal">KCAL</span>
        </StatLabel>

        {/* Add or Stepper */}
        {!isAddedToPlate ? (
          <IconButton
            variant="solid"
            icon={<PlusIcon />}
            size="sm"
            onClick={onAdd}
            aria-label={`Añadir ${name}`}
          />
        ) : (
          <div className="bg-zinc-900 border border-zinc-800/60 rounded-lg flex items-center p-1 gap-0.5">
            <button
              type="button"
              onClick={() => onUpdateQuantity(-0.25)}
              className="w-6 h-6 flex items-center justify-center text-zinc-500 hover:text-zinc-100 transition-colors duration-150 rounded text-sm font-bold"
              aria-label="Reducir 0.25"
            >
              −
            </button>
            <span className="font-mono text-emerald-400 text-xs w-10 text-center tabular-nums font-bold">
              {quantityMultiplier % 1 !== 0
                ? quantityMultiplier.toFixed(2)
                : quantityMultiplier}
            </span>
            <button
              type="button"
              onClick={() => onUpdateQuantity(0.25)}
              className="w-6 h-6 flex items-center justify-center text-zinc-500 hover:text-zinc-100 transition-colors duration-150 rounded text-sm font-bold"
              aria-label="Aumentar 0.25"
            >
              +
            </button>
          </div>
        )}
      </div>

    </SquishyCard>
  );
};

export default IngredientListItem;
