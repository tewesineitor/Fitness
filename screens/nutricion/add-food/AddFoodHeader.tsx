import React from 'react';
import Card from '../../../components/Card';
import ChipButton from '../../../components/ChipButton';
import IconButton from '../../../components/IconButton';
import Input from '../../../components/Input';
import Tag from '../../../components/Tag';
import {
  AppleIcon,
  BarcodeIcon,
  BookOpenIcon,
  BowlIcon,
  ChevronRightIcon,
  MoleculeIcon,
  PencilIcon,
  PlateIcon,
  ProteinShakeIcon,
  SearchIcon,
  SparklesIcon,
} from '../../../components/icons';
import { categoryFilterMap, filterCategories, subCategoryLabels } from './addFoodCatalog';
import type { FoodCategory, MainCategory } from './addFoodTypes';
import { cleanNutritionText } from './displayText';

type VisualMainCategory = 'Todos' | 'Proteinas' | 'Carbohidratos' | 'Frutas y Verduras' | 'Grasas' | 'Preparados';

interface AddFoodHeaderProps {
  onBack: () => void;
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  onOpenManual: () => void;
  onOpenImageSource: () => void;
  onOpenScanner: () => void;
  activeFilterCategory: MainCategory;
  onSelectMainCategory: (category: MainCategory) => void;
  activeSubFilter: FoodCategory | 'TODOS';
  onSelectSubFilter: (category: FoodCategory | 'TODOS') => void;
  plateCount: number;
  totalKcal: number;
  resultsCount: number;
}

const getTone = (key: VisualMainCategory) => {
  if (key === 'Proteinas') return 'protein';
  if (key === 'Carbohidratos') return 'carbs';
  if (key === 'Grasas') return 'neutral';
  if (key === 'Frutas y Verduras') return 'success';
  if (key === 'Preparados') return 'accent';
  return 'neutral';
};

const getIcon = (key: VisualMainCategory) => {
  if (key === 'Todos') return BookOpenIcon;
  if (key === 'Proteinas') return ProteinShakeIcon;
  if (key === 'Carbohidratos') return BowlIcon;
  if (key === 'Frutas y Verduras') return AppleIcon;
  if (key === 'Grasas') return MoleculeIcon;
  return PlateIcon;
};

const quickActionTones = {
  accent: 'border-brand-accent/20 bg-brand-accent/6 text-brand-accent',
  protein: 'border-brand-protein/20 bg-brand-protein/6 text-brand-protein',
  carbs: 'border-brand-carbs/20 bg-brand-carbs/6 text-brand-carbs',
} as const;

const QuickAction: React.FC<{
  label: string;
  caption: string;
  icon: React.FC<{ className?: string }>;
  onClick: () => void;
  tone: keyof typeof quickActionTones;
}> = ({ label, caption, icon: Icon, onClick, tone }) => (
  <Card
    as="button"
    onClick={onClick}
    variant="glass"
    className="group relative flex min-h-[6.25rem] w-full flex-col items-start justify-between overflow-hidden p-4 text-left shadow-lg shadow-black/5"
  >
    <div className={`absolute inset-x-0 top-0 h-20 opacity-80 ${quickActionTones[tone]}`} />
    <div className="relative z-10 flex w-full items-start justify-between gap-3">
      <div className={`rounded-2xl border p-3 ${quickActionTones[tone]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <ChevronRightIcon className="h-4 w-4 text-text-secondary transition-transform duration-200 group-hover:translate-x-0.5" />
    </div>
    <div className="relative z-10 space-y-1">
      <p className="text-[11px] font-black uppercase tracking-[0.22em] text-text-primary">{label}</p>
      <p className="text-[11px] font-medium leading-relaxed text-text-secondary">{caption}</p>
    </div>
  </Card>
);

const AddFoodHeader: React.FC<AddFoodHeaderProps> = ({
  onBack,
  searchTerm,
  onSearchTermChange,
  onOpenManual,
  onOpenImageSource,
  onOpenScanner,
  activeFilterCategory,
  onSelectMainCategory,
  activeSubFilter,
  onSelectSubFilter,
  plateCount,
  totalKcal,
  resultsCount,
}) => {
  const activeSubFilterCount = activeFilterCategory === 'Todos' ? 0 : categoryFilterMap[activeFilterCategory]?.length ?? 0;
  const activeCategoryLabel = cleanNutritionText(activeFilterCategory) as VisualMainCategory;

  return (
    <header className="sticky top-0 z-40 border-b border-surface-border/50 bg-bg-base/90 backdrop-blur-xl">
      <div className="mx-auto w-full max-w-3xl px-4 pb-4 pt-3 sm:px-6 sm:pt-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <IconButton
            onClick={onBack}
            icon={ChevronRightIcon}
            label="Volver"
            variant="secondary"
            size="medium"
            className="rotate-180"
          />

          <div className="flex flex-wrap items-center justify-end gap-2">
            <Tag variant="overlay" tone="neutral" size="sm" count={resultsCount}>
              Catalogo
            </Tag>
            <Tag variant="overlay" tone="accent" size="sm" count={plateCount}>
              Plato
            </Tag>
            <Tag variant="overlay" tone="protein" size="sm">
              {totalKcal.toFixed(0)} kcal
            </Tag>
          </div>
        </div>

        <Card variant="glass" className="overflow-hidden rounded-[2rem] border-white/10 px-5 py-5 shadow-2xl">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-brand-accent/12 via-transparent to-brand-protein/10" />
          <div className="pointer-events-none absolute right-0 top-12 h-48 w-48 rounded-full bg-brand-carbs/10 blur-3xl" />

          <div className="relative z-10">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="mb-2 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.28em] text-brand-accent">
                  <SparklesIcon className="h-3.5 w-3.5" />
                  Nutrition Atelier
                </p>
                <h1 className="max-w-[12ch] text-3xl font-black uppercase leading-none tracking-[-0.06em] text-text-primary sm:text-[2.35rem]">
                  Add Food
                </h1>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-text-secondary">
                  Construye una comida con lenguaje editorial. Busca alimentos, captura productos desde empaque y ajusta porciones sin salir del flujo.
                </p>
              </div>

              <div className="hidden min-w-[10rem] rounded-[1.5rem] border border-brand-accent/15 bg-brand-accent/8 px-4 py-3 sm:block">
                <p className="text-[9px] font-black uppercase tracking-[0.22em] text-brand-accent">Current Plate</p>
                <p className="mt-2 font-mono text-3xl font-black leading-none tracking-[-0.08em] text-text-primary">
                  {totalKcal.toFixed(0)}
                </p>
                <p className="mt-1 text-[11px] font-semibold text-text-secondary">{plateCount} ingredientes seleccionados</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_16rem]">
              <Input
                type="search"
                value={searchTerm}
                onChange={(event) => onSearchTermChange(event.target.value)}
                placeholder="Buscar alimento, ingrediente o marca"
                icon={SearchIcon}
                className="text-[14px] font-semibold"
                containerClassName="w-full"
              />

              <div className="rounded-[1.35rem] border border-surface-border/70 bg-surface-bg/70 px-4 py-3">
                <p className="text-[9px] font-black uppercase tracking-[0.22em] text-text-secondary">Flow Focus</p>
                <p className="mt-2 text-sm font-semibold leading-relaxed text-text-primary">
                  Manual, foto IA y scanner bajo una sola jerarquia visual. Sin saltos de estilo.
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <QuickAction
                label="Manual"
                caption="Crear o editar ingredientes"
                icon={PencilIcon}
                onClick={onOpenManual}
                tone="accent"
              />
              <QuickAction
                label="Foto IA"
                caption="Leer macros desde una imagen"
                icon={SparklesIcon}
                onClick={onOpenImageSource}
                tone="protein"
              />
              <QuickAction
                label="Scanner"
                caption="Capturar codigo de barras"
                icon={BarcodeIcon}
                onClick={onOpenScanner}
                tone="carbs"
              />
            </div>
          </div>
        </Card>

        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between gap-3 px-1">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-text-secondary">
              Filtros del catalogo
            </p>
            <Tag variant="status" tone={activeFilterCategory === 'Todos' ? 'neutral' : 'accent'} size="sm">
              {activeFilterCategory === 'Todos' ? 'Vista completa' : `${activeCategoryLabel} · ${activeSubFilterCount} grupos`}
            </Tag>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
            {filterCategories.map(({ key, label }) => {
              const visualKey = cleanNutritionText(key) as VisualMainCategory;
              const isActive = activeFilterCategory === key;
              const tone = getTone(visualKey);
              const Icon = getIcon(visualKey);

              return (
                <ChipButton
                  key={key}
                  active={isActive}
                  tone={tone as 'neutral' | 'accent' | 'protein' | 'carbs' | 'success' | 'danger'}
                  size="medium"
                  icon={Icon}
                  onClick={() => onSelectMainCategory(key)}
                  className="min-w-max"
                >
                  {cleanNutritionText(label)}
                </ChipButton>
              );
            })}
          </div>

          {activeFilterCategory !== 'Todos' ? (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar animate-fade-in-up">
              <ChipButton active={activeSubFilter === 'TODOS'} onClick={() => onSelectSubFilter('TODOS')} size="small">
                Todos
              </ChipButton>
              {categoryFilterMap[activeFilterCategory]?.map((subCat) => (
                <ChipButton
                  key={subCat}
                  active={activeSubFilter === subCat}
                  onClick={() => onSelectSubFilter(subCat)}
                  size="small"
                >
                  {cleanNutritionText(subCategoryLabels[subCat] || subCat)}
                </ChipButton>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};

export default AddFoodHeader;
