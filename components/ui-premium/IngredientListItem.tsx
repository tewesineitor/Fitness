import React from 'react';
import SquishyCard from './SquishyCard';
import IconButton from './IconButton';
import { CardTitle, EyebrowText, MonoValue, MutedText, StatLabel, StatValue } from './Typography';

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
}> = ({ label, value, colorClass }) => {
  return (
    <span
      className={[
        'text-[10px] font-black tabular-nums px-1.5 py-0.5 rounded',
        colorClass,
      ].join(' ')}
    >
      {label} {value}
    </span>
  );
};

export interface IngredientMacros {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface IngredientEditableData {
  name: string;
  brand?: string;
  standardPortion: string;
  rawWeightG?: number;
  cookedWeightG?: number;
  macros: IngredientMacros;
}

export interface IngredientItemProps extends IngredientEditableData {
  imageUrl?: string;
  isAddedToPlate: boolean;
  quantityMultiplier: number;
  onAdd: () => void;
  onUpdateQuantity: (delta: number) => void;
  onEdit: (data: IngredientEditableData) => void;
}

const IngredientListItem: React.FC<IngredientItemProps> = ({
  name,
  brand,
  imageUrl,
  macros,
  standardPortion,
  rawWeightG,
  cookedWeightG,
  isAddedToPlate,
  quantityMultiplier,
  onAdd,
  onUpdateQuantity,
  onEdit,
}) => {
  const hasEquiv = (rawWeightG != null && rawWeightG > 0) || (cookedWeightG != null && cookedWeightG > 0);

  const fmtQty = (n: number) => n % 1 === 0 ? String(n) : n.toFixed(2);

  const scaledMacros = {
    protein: Math.round(macros.protein * quantityMultiplier),
    carbs:   Math.round(macros.carbs   * quantityMultiplier),
    fat:     Math.round(macros.fat     * quantityMultiplier),
  };

  return (
    <SquishyCard padding="sm" active={isAddedToPlate} className="flex gap-4 items-center">

      {/* ── LEFT: Image ─────────────────────────────────── */}
      <div className="shrink-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="size-14 rounded-xl object-cover border border-surface-border"
          />
        ) : (
          <div className="size-14 rounded-xl bg-surface-raised border border-surface-border flex items-center justify-center">
            <span className="text-text-muted text-xl font-black select-none">
              {name[0].toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* ── CENTER: Identity + Macros + HUD ─────────────── */}
      <div className="flex flex-col flex-1 min-w-0 gap-1">

        {/* Name */}
        <CardTitle className="leading-tight truncate">
          {name}
        </CardTitle>

        {/* Brand */}
        <div className="pb-1 border-b border-surface-border/50">
          <MutedText className="uppercase tracking-widest truncate">
            {brand ?? '—'}
          </MutedText>
        </div>

        {/* Macro pills — scaled */}
        <div className="flex gap-1 flex-wrap">
          <MacroPill label="P" value={scaledMacros.protein} colorClass="bg-brand-protein/20 text-brand-protein" />
          <MacroPill label="C" value={scaledMacros.carbs}   colorClass="bg-brand-accent/20 text-brand-accent" />
          <MacroPill label="G" value={scaledMacros.fat}     colorClass="bg-brand-fat/20 text-brand-fat" />
        </div>

        {/* ── HUD Micro-Viz ───────────────────────────────── */}
        <div className="w-full flex items-center justify-between gap-3 pt-1 border-t border-surface-border/50">
          {/* Left: portion multiplier */}
          <div className="flex items-center gap-1.5 text-text-secondary">
            <ScaleIcon className="text-text-muted shrink-0" />
            <MonoValue className="text-text-muted">
              {fmtQty(quantityMultiplier)}{' '}
              <span className="text-surface-border">×</span>{' '}
              {standardPortion}
            </MonoValue>
          </div>

          {/* Right: equivalencias crudo/cocido (conditional) */}
          {hasEquiv && (
            <div className="flex gap-2 items-center shrink-0">
              {rawWeightG != null && rawWeightG > 0 && (
                <MonoValue className="text-text-muted">
                  <StatLabel className="mr-1">Crudo</StatLabel>
                  {Math.round(rawWeightG * quantityMultiplier)}g
                </MonoValue>
              )}
              {rawWeightG != null && rawWeightG > 0 && cookedWeightG != null && cookedWeightG > 0 && (
                <span className="text-surface-border">|</span>
              )}
              {cookedWeightG != null && cookedWeightG > 0 && (
                <MonoValue className="text-brand-accent">
                  <StatLabel className="mr-1">Cocido</StatLabel>
                  {Math.round(cookedWeightG * quantityMultiplier)}g
                </MonoValue>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── RIGHT: KCAL + [edit | action] ─────────────── */}
      <div className="flex flex-col items-end gap-2 shrink-0 self-stretch justify-between">
        {/* Calories */}
        <div className="flex flex-col items-end gap-1">
          <StatValue className="!text-brand-accent">
            {Math.round(macros.kcal * quantityMultiplier)}
          </StatValue>
          <StatLabel>KCAL</StatLabel>
        </div>

        {/* Bottom row: edit + add/stepper */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onEdit({ name, brand, standardPortion, rawWeightG, cookedWeightG, macros })}
            className="w-6 h-6 flex items-center justify-center rounded-full bg-surface-raised/50 hover:bg-surface-raised text-text-muted hover:text-text-secondary transition-colors duration-150 shrink-0"
            aria-label="Editar ingrediente"
          >
            <PencilIcon size={11} />
          </button>

          {!isAddedToPlate ? (
            <IconButton
              variant="solid"
              icon={<PlusIcon />}
              size="sm"
              onClick={onAdd}
              aria-label={`Añadir ${name}`}
            />
          ) : (
            <div className="bg-surface-bg border border-surface-border/60 rounded-lg flex items-center p-0.5 gap-0.5">
              <button
                type="button"
                onClick={() => onUpdateQuantity(-0.25)}
                className="w-5 h-5 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors duration-150 rounded text-xs font-bold"
                aria-label="Reducir 0.25"
              >
                −
              </button>
              <MonoValue className="text-brand-accent w-8 text-center !font-bold">
                {fmtQty(quantityMultiplier)}
              </MonoValue>
              <button
                type="button"
                onClick={() => onUpdateQuantity(0.25)}
                className="w-5 h-5 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors duration-150 rounded text-xs font-bold"
                aria-label="Aumentar 0.25"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>

    </SquishyCard>
  );
};

export default IngredientListItem;
