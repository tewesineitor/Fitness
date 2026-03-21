import { useMemo } from 'react';
import type { FoodItem } from '../../../types';
import type { FoodCategory, MainCategory } from './addFoodTypes';
import { categoryFilterMap } from './addFoodCatalog';

type FoodsToShow = FoodItem[] | Record<string, FoodItem[]>;

interface Params {
  allFoodData: FoodItem[];
  searchTerm: string;
  activeFilterCategory: MainCategory;
  activeSubFilter: FoodCategory | 'TODOS';
}

export const useFoodCatalog = ({
  allFoodData,
  searchTerm,
  activeFilterCategory,
  activeSubFilter,
}: Params): FoodsToShow => {
  return useMemo(() => {
    let items = allFoodData;

    if (searchTerm) {
      return items.filter(food => food.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (activeFilterCategory !== 'Todos') {
      const subCategories = categoryFilterMap[activeFilterCategory];
      items = items.filter(food => subCategories.includes(food.category));
    }

    if (activeSubFilter !== 'TODOS') {
      items = items.filter(food => food.category === activeSubFilter);
    }

    return items.reduce((acc: Record<string, FoodItem[]>, food) => {
      const subCategory = food.category;
      if (!acc[subCategory]) acc[subCategory] = [];
      acc[subCategory].push(food);
      return acc;
    }, {} as Record<string, FoodItem[]>);
  }, [allFoodData, searchTerm, activeFilterCategory, activeSubFilter]);
};

