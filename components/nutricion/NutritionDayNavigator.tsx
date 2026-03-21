import React from 'react';
import Card from '../Card';
import Button from '../Button';
import IconButton from '../IconButton';
import Tag from '../Tag';
import { CalendarIcon, ChevronRightIcon } from '../icons';

interface NutritionDayNavigatorProps {
  label: string;
  helperText: string;
  canGoForward: boolean;
  mealsCount: number;
  isToday: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onGoToday?: () => void;
}

const NutritionDayNavigator: React.FC<NutritionDayNavigatorProps> = ({
  label,
  helperText,
  canGoForward,
  mealsCount,
  isToday,
  onPrevious,
  onNext,
  onGoToday,
}) => {
  return (
    <Card variant="glass" className="p-4 sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <IconButton
            onClick={onPrevious}
            icon={ChevronRightIcon}
            label="Ver día anterior"
            variant="secondary"
            size="medium"
            className="[&_svg]:rotate-180"
          />

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-brand-accent" />
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-text-secondary">{helperText}</p>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-black uppercase tracking-[-0.03em] text-text-primary sm:text-2xl">{label}</h2>
              <Tag variant="status" tone={isToday ? 'accent' : 'neutral'} size="sm">
                {isToday ? 'En curso' : 'Archivo'}
              </Tag>
              <Tag variant="status" tone="neutral" size="sm">
                {mealsCount} {mealsCount === 1 ? 'comida' : 'comidas'}
              </Tag>
            </div>
          </div>

          <IconButton
            onClick={onNext}
            icon={ChevronRightIcon}
            label="Ver día siguiente"
            variant="secondary"
            size="medium"
            disabled={!canGoForward}
          />
        </div>

        {!isToday && onGoToday ? (
          <Button variant="secondary" size="small" onClick={onGoToday}>
            Volver a hoy
          </Button>
        ) : null}
      </div>
    </Card>
  );
};

export default NutritionDayNavigator;
