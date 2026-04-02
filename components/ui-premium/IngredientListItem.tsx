import React from 'react';
import SquishyCard from './SquishyCard';
import IconButton from './IconButton';
import { EyebrowText, MutedText, StatLabel } from './Typography';

const PlusIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const PencilIcon: React.FC = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
  </svg>
);

const ScaleIcon: React.FC = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
  const parseBaseWeight = (val?: string) => {
    if (!val) return 0;
    const match = val.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  };
  
  const basePeso = parseBaseWeight(weightRaw) || parseBaseWeight(standardPortion) || parseBaseWeight(weightCooked);
  const pesoCalculado = basePeso * quantityMultiplier;
  
  const baseCocido = parseBaseWeight(weightCooked);
  const pesoCocidoCalculado = baseCocido ? baseCocido * quantityMultiplier : null;

  return (
    <SquishyCard padding="sm" className="flex flex-row gap-3 items-center">
      {/* Left — image */}
      <div className="shrink-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="size-14 rounded-xl object-cover"
          />
        ) : (
          <div className="size-14 rounded-xl bg-zinc-800 flex items-center justify-center">
            <span className="text-zinc-600 text-xl font-black select-none">
              {name[0].toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Center — name, brand, macros, footer */}
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        {/* Name */}
        <EyebrowText className="!text-lg !text-zinc-100 !normal-case !tracking-normal truncate leading-tight">
          {name}
        </EyebrowText>

        {/* Brand + edit pencil */}
        <div className="flex items-center gap-1.5 -mt-1">
          {brand && (
            <MutedText className="!text-[10px] uppercase block truncate">
              {brand}
            </MutedText>
          )}
          <IconButton 
            variant="ghost" 
            size="sm" 
            icon={<PencilIcon />} 
            onClick={onEdit} 
            aria-label="Editar ingrediente" 
            className="w-5 h-5 !min-w-0 !min-h-0 !p-1"
          />
        </div>

        {/* Macro pills */}
        <div className="flex gap-1 flex-wrap mt-0.5">
          <MacroPill label="P" value={macros.protein} colorClass="bg-violet-500/20 text-violet-400" />
          <MacroPill label="C" value={macros.carbs}   colorClass="bg-emerald-500/20 text-emerald-400" />
          <MacroPill label="G" value={macros.fat}     colorClass="bg-rose-500/20 text-rose-400" />
        </div>

        {/* HUD Layout Footer */}
        <div className="w-full flex items-center gap-3 mt-1.5 pt-1.5 border-t border-zinc-900/50">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-zinc-600"><ScaleIcon /></span>
            <span className="text-xs text-zinc-300">{standardPortion}</span>
          </div>
          
          <div className="flex-1 h-px bg-zinc-800 relative" />
          
          <div className="flex items-center gap-1.5 shrink-0">
            {pesoCocidoCalculado && (
              <span className="bg-emerald-500/10 text-emerald-300 px-1.5 rounded text-[10px]">
                → {pesoCocidoCalculado}g
              </span>
            )}
            <span className="font-mono text-[11px] text-zinc-100 tabular-nums">
              {pesoCalculado}<span className="text-zinc-500">g</span>
            </span>
          </div>
        </div>
      </div>

      {/* Right — calories + action */}
      <div className="flex flex-col items-end gap-2 shrink-0">
        {/* Calories — !important to override StatLabel base tokens */}
        <StatLabel className="!text-base !font-black !text-emerald-400 !tabular-nums leading-none">
          {calories}{' '}
          <span className="text-[10px] text-zinc-500 font-normal">KCAL</span>
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
          <div className="bg-zinc-900 rounded-lg flex items-center p-1 gap-0.5">
            <button
              type="button"
              onClick={() => onUpdateQuantity(-1)}
              className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-zinc-100 transition-colors duration-150 rounded text-sm font-bold"
              aria-label="Reducir cantidad"
            >
              −
            </button>
            <span className="font-mono text-zinc-100 text-sm w-8 text-center tabular-nums">
              ×{quantityMultiplier}
            </span>
            <button
              type="button"
              onClick={() => onUpdateQuantity(1)}
              className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-zinc-100 transition-colors duration-150 rounded text-sm font-bold"
              aria-label="Aumentar cantidad"
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
