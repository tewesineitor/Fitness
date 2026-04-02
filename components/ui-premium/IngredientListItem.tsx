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
  const footerParts: string[] = [standardPortion];
  if (weightRaw) footerParts.push(`CRUDO: ${weightRaw}`);
  if (weightCooked) footerParts.push(`COCIDO: ${weightCooked}`);

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
        <EyebrowText className="!text-zinc-100 !text-[11px] !normal-case !tracking-normal truncate">
          {name}
        </EyebrowText>

        {/* Brand + edit pencil */}
        <div className="flex items-center gap-1.5">
          {brand && (
            <MutedText className="!text-[10px] uppercase tracking-wider truncate">
              {brand}
            </MutedText>
          )}
          <button
            type="button"
            onClick={onEdit}
            className="text-zinc-600 hover:text-zinc-400 transition-colors duration-150 flex items-center shrink-0"
            aria-label="Editar ingrediente"
          >
            <PencilIcon />
          </button>
        </div>

        {/* Macro pills */}
        <div className="flex gap-1 flex-wrap">
          <MacroPill label="P" value={macros.protein} colorClass="bg-violet-500/20 text-violet-400" />
          <MacroPill label="C" value={macros.carbs}   colorClass="bg-emerald-500/20 text-emerald-400" />
          <MacroPill label="G" value={macros.fat}     colorClass="bg-rose-500/20 text-rose-400" />
        </div>

        {/* Footer equivalences */}
        <MutedText className="!text-[10px]">
          {footerParts.join(' • ')}
        </MutedText>
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
