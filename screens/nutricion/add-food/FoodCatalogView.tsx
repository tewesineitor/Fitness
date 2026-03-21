import React from 'react';
import Card from '../../../components/Card';
import Tag from '../../../components/Tag';
import { BookOpenIcon } from '../../../components/icons';
import type { FoodItem } from '../../../types';
import { getCategoryPriority } from './addFoodCatalog';
import type { FoodCategory } from './addFoodTypes';
import { cleanNutritionText } from './displayText';
import FoodItemCard from './FoodItemCard';

type FoodsToShow = FoodItem[] | Record<string, FoodItem[]>;

interface FoodCatalogViewProps {
  foodsToShow: FoodsToShow;
  plateMap: Map<string, number>;
  onItemQuantityChange: (food: FoodItem, delta: number) => void;
  onEditItemPortion: (food: FoodItem) => void;
  onOpenEditor: (category: FoodCategory, food: FoodItem) => void;
  onDeleteFood: (food: FoodItem) => void;
}

const SectionIntro: React.FC<{ label: string; count: number; caption: string }> = ({ label, count, caption }) => (
  <div className="flex items-center justify-between gap-3 rounded-[1.35rem] border border-surface-border/70 bg-surface-bg/80 px-4 py-3 shadow-sm">
    <div className="min-w-0">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-text-secondary">{label}</p>
      <p className="mt-1 text-sm font-semibold text-text-primary">{caption}</p>
    </div>
    <Tag variant="overlay" tone="accent" size="sm" count={count}>
      Items
    </Tag>
  </div>
);

const FoodCatalogView: React.FC<FoodCatalogViewProps> = ({
  foodsToShow,
  plateMap,
  onItemQuantityChange,
  onEditItemPortion,
  onOpenEditor,
  onDeleteFood,
}) => {
  const isFlatList = Array.isArray(foodsToShow);
  const totalCount = isFlatList
    ? foodsToShow.length
    : Object.values(foodsToShow).reduce((total, foods) => total + foods.length, 0);
  const isEmpty = totalCount === 0;

  if (isEmpty) {
    return (
      <Card variant="inset" className="px-6 py-12 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-surface-border bg-surface-bg text-text-secondary">
          <BookOpenIcon className="h-7 w-7" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-text-secondary">Sin coincidencias</p>
        <p className="mx-auto mt-3 max-w-sm text-sm font-medium leading-relaxed text-text-secondary">
          Ajusta la busqueda o cambia de filtro. Si no existe el alimento, puedes crearlo desde el launcher superior.
        </p>
      </Card>
    );
  }

  if (isFlatList) {
    return (
      <div className="space-y-4">
        <SectionIntro
          label="Search Results"
          count={totalCount}
          caption="Resultados curados para construir tu plato sin salir del flujo."
        />

        <div className="space-y-3">
          {foodsToShow.map((food) => (
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
    );
  }

  return (
    <div className="space-y-6">
      <SectionIntro
        label="Catalog Library"
        count={totalCount}
        caption="Navega por familias nutricionales y agrega ingredientes con una sola jerarquia visual."
      />

      {Object.entries(foodsToShow)
        .sort(([catA], [catB]) => {
          const priorityA = getCategoryPriority(catA);
          const priorityB = getCategoryPriority(catB);
          if (priorityA !== priorityB) return priorityA - priorityB;
          return catA.localeCompare(catB);
        })
        .map(([category, foods]) => (
          <section key={category} className="space-y-3">
            <div className="sticky top-0 z-10 -mx-1 px-1 py-1.5 backdrop-blur-sm">
              <div className="flex items-center justify-between rounded-[1.1rem] border border-surface-border/70 bg-bg-base/85 px-4 py-2.5 shadow-sm">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-text-secondary">
                    {cleanNutritionText(category)}
                  </p>
                  <p className="mt-0.5 text-xs font-medium text-text-secondary">Seleccion editorial para este cluster.</p>
                </div>
                <Tag variant="overlay" tone="neutral" size="sm" count={foods.length}>
                  Disponibles
                </Tag>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {foods.map((food) => (
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
          </section>
        ))}
    </div>
  );
};

export default FoodCatalogView;
