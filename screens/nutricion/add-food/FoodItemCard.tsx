import React, { useMemo } from 'react';
import Button from '../../../components/Button';
import IconButton from '../../../components/IconButton';
import { PencilIcon, TrashIcon, PlusIcon, MinusIcon } from '../../../components/icons';
import { foodImageMap, defaultRecipeImage, vibrate } from '../../../utils/helpers';
import type { FoodItem } from '../../../types';

interface FoodItemCardProps {
  food: FoodItem;
  quantity: number;
  onQuantityChange: (delta: number) => void;
  onEditPortion: () => void;
  onEditFood: () => void;
  onDeleteFood?: () => void;
}

const FoodItemCard: React.FC<FoodItemCardProps> = React.memo(({
  food,
  quantity,
  onQuantityChange,
  onEditPortion,
  onEditFood,
  onDeleteFood,
}) => {
  const calculatedMacros = useMemo(() => {
    const baseMacros = food?.macrosPerPortion;
    if (!baseMacros) return { kcal: 0, protein: 0, carbs: 0, fat: 0 };

    const displayQuantity = quantity > 0 ? quantity : 1;
    return {
      kcal: (baseMacros.kcal || 0) * displayQuantity,
      protein: (baseMacros.protein || 0) * displayQuantity,
      carbs: (baseMacros.carbs || 0) * displayQuantity,
      fat: (baseMacros.fat || 0) * displayQuantity,
    };
  }, [food?.macrosPerPortion, quantity]);

  const isSelected = quantity > 0;
  const basePortionLabel = food.standardPortion ? food.standardPortion.split('(')[0].trim() : '';

  return (
    <div
      className={`group relative p-3 rounded-2xl transition-all duration-200 border ${
        isSelected
          ? 'bg-surface-hover border-brand-accent/40 shadow-sm'
          : 'bg-surface-bg border-surface-border/50 hover:border-surface-border'
      }`}
    >
      <div className="flex gap-4">
        <div className="relative flex-shrink-0">
          <img
            src={foodImageMap[food.id] || defaultRecipeImage}
            alt={food.name}
            className={`w-16 h-16 object-cover rounded-xl transition-all duration-300 ${isSelected ? 'scale-105' : 'opacity-80 group-hover:opacity-100'}`}
          />
          {isSelected && (
            <div className="absolute -top-2 -right-2 bg-text-primary text-bg-base w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black border-2 border-surface-bg shadow-lg z-10">
              {quantity % 1 === 0 ? quantity : quantity.toFixed(1)}
            </div>
          )}
        </div>

        <div className="flex-grow min-w-0 flex flex-col justify-between py-0.5">
          <div className="pr-16">
            <p className={`font-bold text-[13px] uppercase tracking-tight line-clamp-1 ${isSelected ? 'text-brand-accent' : 'text-text-primary'}`}>
              {food.name}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              {food.brand && (
                <span className="text-[8px] font-bold uppercase tracking-widest text-text-secondary/60 truncate max-w-[100px]">
                  {food.brand}
                </span>
              )}
              <span className="text-[8px] font-bold uppercase tracking-widest text-text-secondary/40">•</span>
              <span className="text-[8px] font-bold uppercase tracking-widest text-text-secondary/60">{basePortionLabel}</span>
            </div>
          </div>

          <div className="flex justify-between items-end mt-2">
            <div className="flex gap-2.5 text-[9px] font-bold font-mono">
              <div className="flex flex-col">
                <span className="text-brand-protein uppercase opacity-40 text-[7px] leading-none mb-0.5">Prot</span>
                <span className="text-brand-protein">{calculatedMacros.protein.toFixed(1)}g</span>
              </div>
              <div className="flex flex-col">
                <span className="text-brand-carbs uppercase opacity-40 text-[7px] leading-none mb-0.5">Carb</span>
                <span className="text-brand-carbs">{calculatedMacros.carbs.toFixed(1)}g</span>
              </div>
              <div className="flex flex-col">
                <span className="text-brand-fat uppercase opacity-40 text-[7px] leading-none mb-0.5">Gras</span>
                <span className="text-brand-fat">{calculatedMacros.fat.toFixed(1)}g</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              {isSelected ? (
                <div className="flex items-center bg-surface-bg rounded-xl border border-surface-border shadow-sm overflow-hidden">
                  <IconButton onClick={() => { vibrate(5); onQuantityChange(-0.5); }} variant="ghost" size="small" icon={MinusIcon} label="Menos" className="!rounded-none border-r border-surface-border" />
                  <Button
                    onClick={onEditPortion}
                    variant="ghost"
                    size="small"
                    className="px-3 !h-8 !rounded-none text-center font-bold text-[11px] text-text-primary hover:text-brand-accent transition-colors font-mono"
                  >
                    {quantity % 1 === 0 ? quantity : quantity.toFixed(1)}
                  </Button>
                  <IconButton onClick={() => { vibrate(5); onQuantityChange(0.5); }} variant="ghost" size="small" icon={PlusIcon} label="Mas" className="!rounded-none border-l border-surface-border" />
                </div>
              ) : (
                <IconButton
                  onClick={() => { vibrate(5); onQuantityChange(1); }}
                  variant="outline"
                  icon={PlusIcon}
                  label="Agregar"
                  className="!rounded-xl"
                />
              )}

              <div className="flex gap-1.5 ml-0.5">
                <IconButton
                  onClick={(e) => { e.stopPropagation(); onEditFood(); }}
                  variant="icon-only"
                  icon={PencilIcon}
                  label="Editar"
                  className="!rounded-xl"
                />
                {onDeleteFood && (
                  <IconButton
                    onClick={(e) => { e.stopPropagation(); onDeleteFood(); }}
                    variant="destructive"
                    size="medium"
                    icon={TrashIcon}
                    label="Eliminar"
                    className="!rounded-xl"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-3.5 right-4 text-right">
        <div className={`flex flex-col items-end leading-none ${isSelected ? 'text-brand-accent' : 'text-text-primary'}`}>
          <span className="font-black text-sm font-mono tracking-tighter">
            {calculatedMacros.kcal.toFixed(0)}
          </span>
          <span className="text-[7px] font-bold uppercase tracking-[0.2em] opacity-40">kcal</span>
        </div>
      </div>
    </div>
  );
});

FoodItemCard.displayName = 'FoodItemCard';

export default FoodItemCard;

