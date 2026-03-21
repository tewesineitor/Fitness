import React from 'react';
import type { FoodItem } from '../../../types';
import { BookOpenIcon } from '../../../components/icons';
import FoodItemCard from './FoodItemCard';
import { getCategoryPriority } from './addFoodCatalog';
import type { FoodCategory } from './addFoodTypes';

type FoodsToShow = FoodItem[] | Record<string, FoodItem[]>;

interface FoodCatalogViewProps {
  foodsToShow: FoodsToShow;
  plateMap: Map<string, number>;
  onItemQuantityChange: (food: FoodItem, delta: number) => void;
  onEditItemPortion: (food: FoodItem) => void;
  onOpenEditor: (category: FoodCategory, food: FoodItem) => void;
  onDeleteFood: (food: FoodItem) => void;
}

const FoodCatalogView: React.FC<FoodCatalogViewProps> = ({
  foodsToShow,
  plateMap,
  onItemQuantityChange,
  onEditItemPortion,
  onOpenEditor,
  onDeleteFood,
}) => {
  const isFlatList = Array.isArray(foodsToShow);
  const isEmpty = isFlatList
    ? foodsToShow.length === 0
    : Object.keys(foodsToShow).length === 0;

  if (isEmpty) {
    return (
      <div className="text-center py-20 text-text-secondary">
        <div className="w-16 h-16 bg-surface-hover rounded-full flex items-center justify-center mx-auto mb-4 border border-surface-border opacity-50">
          <BookOpenIcon className="w-8 h-8" />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] opacity-40">No se encontraron resultados</p>
      </div>
    );
  }

  if (isFlatList) {
    return (
      <div className="space-y-3">
        {foodsToShow.map(food => (
          <FoodItemCard
            key={food.id}
            food={food}
            quantity={plateMap.get(food.id) || 0}
            onQuantityChange={(delta) => onItemQuantityChange(food, delta)}
            onEditPortion={() => onEditItemPortion(food)}
            onEditFood={() => onOpenEditor(food.category, food)}
            onDeleteFood={food.isUserCreated ? () => onDeleteFood(food) : undefined}
          />
        ))}
      </div>
    );
  }

  return (
    <div>
      {Object.entries(foodsToShow)
        .sort(([catA], [catB]) => {
          const priorityA = getCategoryPriority(catA);
          const priorityB = getCategoryPriority(catB);
          if (priorityA !== priorityB) return priorityA - priorityB;
          return catA.localeCompare(catB);
        })
        .map(([category, foods]) => (
          <div key={category} className="mb-8 last:mb-0">
            <h3 className="text-[10px] font-black text-text-secondary uppercase tracking-[0.25em] mb-4 pl-1 sticky top-0 bg-bg-base py-4 z-10 border-b border-surface-border">
              {category}
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {foods.map(food => (
                <FoodItemCard
                  key={food.id}
                  food={food}
                  quantity={plateMap.get(food.id) || 0}
                  onQuantityChange={(delta) => onItemQuantityChange(food, delta)}
                  onEditPortion={() => onEditItemPortion(food)}
                  onEditFood={() => onOpenEditor(food.category, food)}
                  onDeleteFood={food.isUserCreated ? () => onDeleteFood(food) : undefined}
                />
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default FoodCatalogView;
