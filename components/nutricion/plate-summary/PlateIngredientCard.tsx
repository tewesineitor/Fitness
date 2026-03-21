import React from 'react';
import Card from '../../Card';
import IconButton from '../../IconButton';
import StepperControl from '../../StepperControl';
import Tag from '../../Tag';
import { TrashIcon } from '../../icons';
import type { AddedFood } from '../../../types';

interface PlateIngredientCardProps {
  item: AddedFood;
  onUpdateItemPortion: (foodId: string, newPortions: number) => void;
  onEditItemPortion: (item: AddedFood) => void;
}

const PlateIngredientCard: React.FC<PlateIngredientCardProps> = ({
  item,
  onUpdateItemPortion,
  onEditItemPortion,
}) => {
  const displayQty = item.portions.toLocaleString(undefined, { maximumFractionDigits: 1 });
  const cleanPortion = item.foodItem.standardPortion.split('(')[0].trim();
  const totalRaw = item.foodItem.rawWeightG ? item.foodItem.rawWeightG * item.portions : null;
  const totalCooked = item.foodItem.cookedWeightG ? item.foodItem.cookedWeightG * item.portions : null;
  const itemProtein = (item.foodItem.macrosPerPortion?.protein || 0) * item.portions;
  const itemCarbs = (item.foodItem.macrosPerPortion?.carbs || 0) * item.portions;
  const itemFat = (item.foodItem.macrosPerPortion?.fat || 0) * item.portions;
  const itemKcal = (item.foodItem.macrosPerPortion?.kcal || 0) * item.portions;

  return (
    <Card variant="default" className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-black uppercase tracking-[0.02em] text-text-primary">{item.foodItem.name}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Tag variant="status" tone="neutral" size="sm">
              {cleanPortion || 'Porcion base'}
            </Tag>
            {totalRaw ? (
              <Tag variant="status" tone="neutral" size="sm">
                {totalRaw.toFixed(0)}g crudo
              </Tag>
            ) : null}
            {totalCooked ? (
              <Tag variant="status" tone="neutral" size="sm">
                {totalCooked.toFixed(0)}g cocido
              </Tag>
            ) : null}
          </div>
        </div>

        <IconButton
          onClick={() => onUpdateItemPortion(item.foodItem.id, 0)}
          icon={TrashIcon}
          label={`Eliminar ${item.foodItem.name}`}
          variant="ghost"
          size="small"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <Tag variant="status" tone="protein" size="sm">
            {itemProtein.toFixed(1)}g protein
          </Tag>
          <Tag variant="status" tone="carbs" size="sm">
            {itemCarbs.toFixed(1)}g carbs
          </Tag>
          <Tag variant="status" tone="neutral" size="sm">
            {itemFat.toFixed(1)}g grasas
          </Tag>
          <Tag variant="overlay" tone="accent" size="sm">
            {itemKcal.toFixed(0)} kcal
          </Tag>
        </div>

        <StepperControl
          value={displayQty}
          onValueClick={() => onEditItemPortion(item)}
          onDecrement={() => onUpdateItemPortion(item.foodItem.id, item.portions - 0.5)}
          onIncrement={() => onUpdateItemPortion(item.foodItem.id, item.portions + 0.5)}
          decrementLabel={`Reducir porcion de ${item.foodItem.name}`}
          incrementLabel={`Aumentar porcion de ${item.foodItem.name}`}
          className="bg-bg-base/60"
          valueClassName="text-xs"
          size="small"
        />
      </div>
    </Card>
  );
};

export default PlateIngredientCard;
