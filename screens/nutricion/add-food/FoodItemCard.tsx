import React, { useMemo } from 'react';
import Button from '../../../components/Button';
import Card from '../../../components/Card';
import IconButton from '../../../components/IconButton';
import StepperControl from '../../../components/StepperControl';
import Tag from '../../../components/Tag';
import { PencilIcon, PlusIcon, TrashIcon } from '../../../components/icons';
import type { FoodItem } from '../../../types';
import { defaultRecipeImage, foodImageMap, vibrate } from '../../../utils/helpers';

interface FoodItemCardProps {
  food: FoodItem;
  quantity: number;
  onQuantityChange: (delta: number) => void;
  onEditPortion: () => void;
  onEditFood: () => void;
  onDeleteFood?: () => void;
}

const FoodItemCard: React.FC<FoodItemCardProps> = React.memo(
  ({ food, quantity, onQuantityChange, onEditPortion, onEditFood, onDeleteFood }) => {
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
    const displayQuantity = quantity % 1 === 0 ? quantity.toString() : quantity.toFixed(1);

    return (
      <Card
        variant={isSelected ? 'accent' : 'default'}
        className={`relative overflow-hidden p-4 transition-all duration-200 ${
          isSelected ? 'border-brand-accent/25 shadow-md shadow-brand-accent/10' : 'hover:-translate-y-0.5'
        }`}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-r from-brand-accent/8 via-transparent to-brand-protein/8" />

        <div className="relative z-10 flex gap-4">
          <div className="relative flex-shrink-0">
            <div className="h-20 w-20 overflow-hidden rounded-[1.4rem] border border-surface-border/80 bg-surface-hover">
              <img
                src={foodImageMap[food.id] || defaultRecipeImage}
                alt={food.name}
                className={`h-full w-full object-cover transition-all duration-300 ${isSelected ? 'scale-105' : 'opacity-90'}`}
              />
            </div>
            {isSelected && (
              <div className="absolute -right-2 -top-2 rounded-full border-2 border-surface-bg bg-text-primary px-2 py-1 text-[10px] font-black text-bg-base shadow-md">
                {displayQuantity}x
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-black uppercase tracking-[0.02em] text-text-primary">{food.name}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {food.brand ? (
                    <Tag variant="status" tone="neutral" size="sm">
                      {food.brand}
                    </Tag>
                  ) : null}
                  {food.isUserCreated ? (
                    <Tag variant="status" tone="accent" size="sm">
                      Custom
                    </Tag>
                  ) : null}
                  <Tag variant="status" tone="neutral" size="sm">
                    {basePortionLabel || 'Porcion base'}
                  </Tag>
                </div>
              </div>

              <div className="rounded-[1.2rem] border border-surface-border/70 bg-surface-bg/80 px-3 py-2 text-right">
                <p className="font-mono text-xl font-black leading-none tracking-[-0.06em] text-text-primary">
                  {calculatedMacros.kcal.toFixed(0)}
                </p>
                <p className="mt-1 text-[8px] font-black uppercase tracking-[0.2em] text-text-secondary">kcal</p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Tag variant="status" tone="protein" size="sm">
                {calculatedMacros.protein.toFixed(1)}g protein
              </Tag>
              <Tag variant="status" tone="carbs" size="sm">
                {calculatedMacros.carbs.toFixed(1)}g carbs
              </Tag>
              <Tag variant="status" tone="neutral" size="sm">
                {calculatedMacros.fat.toFixed(1)}g grasas
              </Tag>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              {isSelected ? (
                <StepperControl
                  value={displayQuantity}
                  onValueClick={onEditPortion}
                  onDecrement={() => {
                    vibrate(5);
                    onQuantityChange(-0.5);
                  }}
                  onIncrement={() => {
                    vibrate(5);
                    onQuantityChange(0.5);
                  }}
                  decrementLabel={`Reducir porcion de ${food.name}`}
                  incrementLabel={`Aumentar porcion de ${food.name}`}
                  className="bg-bg-base/60"
                  valueClassName="text-xs"
                  size="small"
                />
              ) : (
                <Button
                  onClick={() => {
                    vibrate(5);
                    onQuantityChange(1);
                  }}
                  variant="primary"
                  size="small"
                  icon={PlusIcon}
                  className="shadow-sm"
                >
                  Agregar
                </Button>
              )}

              <div className="flex items-center gap-2">
                <IconButton
                  onClick={(event) => {
                    event.stopPropagation();
                    onEditFood();
                  }}
                  variant="secondary"
                  size="small"
                  icon={PencilIcon}
                  label={`Editar ${food.name}`}
                />
                {onDeleteFood ? (
                  <IconButton
                    onClick={(event) => {
                      event.stopPropagation();
                      onDeleteFood();
                    }}
                    variant="destructive"
                    size="small"
                    icon={TrashIcon}
                    label={`Eliminar ${food.name}`}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }
);

FoodItemCard.displayName = 'FoodItemCard';

export default FoodItemCard;
