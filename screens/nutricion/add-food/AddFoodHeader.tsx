import React from 'react';
import Button from '../../../components/Button';
import ChipButton from '../../../components/ChipButton';
import IconButton from '../../../components/IconButton';
import Input from '../../../components/Input';
import { SearchIcon, ChevronRightIcon, PlusIcon, PencilIcon, BarcodeIcon, CameraIcon, BookOpenIcon, ProteinShakeIcon, BowlIcon, AppleIcon, MoleculeIcon, PlateIcon } from '../../../components/icons';
import type { FoodCategory, MainCategory } from './addFoodTypes';
import { filterCategories, categoryFilterMap, subCategoryLabels } from './addFoodCatalog';

interface AddFoodHeaderProps {
  onBack: () => void;
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  showAddOptions: boolean;
  onToggleAddOptions: () => void;
  onOpenManual: () => void;
  onOpenImageSource: () => void;
  onOpenScanner: () => void;
  activeFilterCategory: MainCategory;
  onSelectMainCategory: (category: MainCategory) => void;
  activeSubFilter: FoodCategory | 'TODOS';
  onSelectSubFilter: (category: FoodCategory | 'TODOS') => void;
}

const getTone = (key: MainCategory) => {
  if (key === 'Proteínas') return 'protein';
  if (key === 'Carbohidratos') return 'carbs';
  if (key === 'Grasas') return 'neutral';
  if (key === 'Frutas y Verduras') return 'success';
  if (key === 'Preparados') return 'accent';
  return 'neutral';
};

const getIcon = (key: MainCategory) => {
  if (key === 'Todos') return BookOpenIcon;
  if (key === 'Proteínas') return ProteinShakeIcon;
  if (key === 'Carbohidratos') return BowlIcon;
  if (key === 'Frutas y Verduras') return AppleIcon;
  if (key === 'Grasas') return MoleculeIcon;
  return PlateIcon;
};

const AddFoodHeader: React.FC<AddFoodHeaderProps> = ({
  onBack,
  searchTerm,
  onSearchTermChange,
  showAddOptions,
  onToggleAddOptions,
  onOpenManual,
  onOpenImageSource,
  onOpenScanner,
  activeFilterCategory,
  onSelectMainCategory,
  activeSubFilter,
  onSelectSubFilter,
}) => {
  return (
    <header className="flex-shrink-0 z-40">
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 pb-0 pt-2 sm:pt-4">
        <div className="flex items-center justify-between mb-2 relative">
          <div className="flex items-center gap-3">
            <IconButton onClick={onBack} icon={ChevronRightIcon} label="Volver" variant="secondary" size="small" className="rotate-180" />
            <h1 className="text-lg sm:text-xl font-black text-text-primary uppercase tracking-tight leading-none ml-[15px]">Anadir Comida</h1>
          </div>

          <div className="relative">
            <IconButton
              onClick={onToggleAddOptions}
              variant={showAddOptions ? 'primary' : 'secondary'}
              icon={PlusIcon}
              label="Opciones"
              className={`!rounded-xl transition-all duration-300 ${showAddOptions ? 'rotate-45' : ''}`}
            />

            {showAddOptions && (
              <div className="absolute right-0 top-12 w-52 bg-surface-bg border border-surface-border rounded-2xl shadow-2xl z-50 p-2 animate-in fade-in slide-in-from-top-2">
                <Button variant="ghost" size="medium" onClick={onOpenManual} icon={PencilIcon} className="w-full justify-start px-4 rounded-xl">
                  Manual
                </Button>
                <Button variant="ghost" size="medium" onClick={onOpenImageSource} icon={CameraIcon} className="w-full justify-start px-4 rounded-xl">
                  Foto IA
                </Button>
                <Button variant="ghost" size="medium" onClick={onOpenScanner} icon={BarcodeIcon} className="w-full justify-start px-4 rounded-xl">
                  Escaner
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="relative mb-1">
          <Input
            type="search"
            value={searchTerm}
            onChange={e => onSearchTermChange(e.target.value)}
            placeholder="BUSCAR ALIMENTO..."
            icon={SearchIcon}
            className="uppercase tracking-wide font-bold text-[14.5px]"
            containerClassName="mb-1"
          />
        </div>

        {!searchTerm && (
          <div className="flex flex-col gap-2 pt-[10px] pb-0">
            <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
              {filterCategories.map(({ key, label }) => {
                const isActive = activeFilterCategory === key;
                const tone = getTone(key);
                const Icon = getIcon(key);

                return (
                  <ChipButton
                    key={key}
                    active={isActive}
                    tone={tone as 'neutral' | 'accent' | 'protein' | 'carbs' | 'success' | 'danger'}
                    size="medium"
                    icon={Icon}
                    onClick={() => {
                      onSelectMainCategory(key);
                    }}
                    className="min-w-[4.5rem] flex-1"
                  >
                    {label}
                  </ChipButton>
                );
              })}
            </div>

            {activeFilterCategory !== 'Todos' && (
              <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar animate-fade-in-up py-2">
                <ChipButton active={activeSubFilter === 'TODOS'} onClick={() => onSelectSubFilter('TODOS')} size="small">
                  Todos
                </ChipButton>

                {categoryFilterMap[activeFilterCategory]?.map(subCat => (
                  <ChipButton
                    key={subCat}
                    active={activeSubFilter === subCat}
                    onClick={() => onSelectSubFilter(subCat)}
                    size="small"
                  >
                    {subCategoryLabels[subCat] || subCat}
                  </ChipButton>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default AddFoodHeader;

