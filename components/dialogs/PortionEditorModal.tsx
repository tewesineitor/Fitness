import React, { useMemo, useState } from 'react';
import { AddedFood, FoodItem, MacroNutrients } from '../../types';
import Modal from '../Modal';
import Button from '../Button';
import ChipButton from '../ChipButton';
import { vibrate } from '../../utils/helpers';

interface UnitOption {
  key: string;
  label: string;
  toPortions: (value: number) => number;
  fromPortions: (portions: number) => number;
  step: number;
}

const parseStandardPortion = (portionString: string): { baseQuantity: number; unitName: string | null } => {
  const match = portionString.match(/^([\d./]+)\s*(\w+)/);
  if (match) {
    const quantityStr = match[1];
    let baseQuantity = 1;
    if (quantityStr.includes('/')) {
      const parts = quantityStr.split('/');
      baseQuantity = parseFloat(parts[0]) / parseFloat(parts[1]);
    } else {
      baseQuantity = parseFloat(quantityStr);
    }
    const unitName = match[2];
    if (['pieza', 'piezas', 'rebanada', 'rebanadas', 'taza', 'tazas', 'cucharada', 'cucharadas', 'scoop', 'scoops', 'filete', 'filetes'].includes(unitName.toLowerCase())) {
      return { baseQuantity, unitName };
    }
  }
  return { baseQuantity: 1, unitName: null };
};

const getPriorityMacros = (category: FoodItem['category']): string[] => {
  switch (category as string) {
    case 'Carnicería (Pollo)':
    case 'Carnicería (Res)':
    case 'Carnicería (Cerdo)':
    case 'Pescadería':
    case 'Huevo y Lácteos':
    case 'Embutidos':
    case 'Suplementos':
    case 'Enlatados':
      return ['protein', 'fat', 'carbs'];
    case 'Tortillas y Maíz':
    case 'Panadería':
    case 'Cereales y Tubérculos':
    case 'Legumbres':
    case 'Frutas':
    case 'Verduras':
      return ['carbs', 'protein', 'fat'];
    case 'Grasas y Aceites':
    case 'Semillas y Frutos Secos':
    case 'Condimentos y Salsas':
      return ['fat', 'protein', 'carbs'];
    default:
      return ['protein', 'carbs', 'fat'];
  }
};

const PortionEditorModal: React.FC<{ food: AddedFood; onSave: (newPortions: number) => void; onClose: () => void }> = ({ food, onSave, onClose }) => {
  const { foodItem, portions: initialPortions } = food;

  const unitOptions = useMemo<UnitOption[]>(() => {
    const options: UnitOption[] = [{ key: 'portion', label: 'Porcion', toPortions: (value) => value, fromPortions: (portions) => portions, step: 0.1 }];
    const { baseQuantity, unitName } = parseStandardPortion(foodItem.standardPortion);

    if (unitName && baseQuantity !== 1) {
      options.push({
        key: 'piece',
        label: unitName.charAt(0).toUpperCase() + unitName.slice(1),
        toPortions: (value) => value / baseQuantity,
        fromPortions: (portions) => portions * baseQuantity,
        step: 1,
      });
    }
    if (foodItem.rawWeightG) options.push({ key: 'raw_g', label: 'g crudo', toPortions: (value) => value / foodItem.rawWeightG!, fromPortions: (portions) => portions * foodItem.rawWeightG!, step: 5 });
    if (foodItem.cookedWeightG) options.push({ key: 'cooked_g', label: 'g cocido', toPortions: (value) => value / foodItem.cookedWeightG!, fromPortions: (portions) => portions * foodItem.cookedWeightG!, step: 5 });

    const macros = foodItem.macrosPerPortion;
    getPriorityMacros(foodItem.category).forEach((macroKey) => {
      const value = macros[macroKey as keyof MacroNutrients];
      if (value && value > 0) {
        const labelMap: Record<string, string> = {
          protein: 'Objetivo proteina',
          carbs: 'Objetivo carbs',
          fat: 'Objetivo grasa',
        };
        options.push({
          key: `target_${macroKey}`,
          label: labelMap[macroKey],
          toPortions: (targetVal) => targetVal / value,
          fromPortions: (portions) => portions * value,
          step: 1,
        });
      }
    });

    if (macros.kcal > 0) {
      options.push({
        key: 'target_kcal',
        label: 'Objetivo kcal',
        toPortions: (targetVal) => targetVal / macros.kcal,
        fromPortions: (portions) => portions * macros.kcal,
        step: 10,
      });
    }

    return options;
  }, [foodItem]);

  const [portions, setPortions] = useState(initialPortions);
  const [activeUnitKey, setActiveUnitKey] = useState(unitOptions[0].key);
  const activeUnit = useMemo(() => unitOptions.find((unit) => unit.key === activeUnitKey)!, [unitOptions, activeUnitKey]);

  const inputValue = useMemo(() => {
    const value = activeUnit.fromPortions(portions);
    if (value === 0) return '0';
    if (activeUnitKey.startsWith('target_')) return Math.round(value).toString();
    const formatted = value.toFixed(2);
    if (formatted.endsWith('.00')) return Math.round(value).toString();
    if (formatted.endsWith('0')) return parseFloat(formatted).toString();
    return formatted;
  }, [portions, activeUnit, activeUnitKey]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value) || 0;
    setPortions(activeUnit.toPortions(newValue));
  };

  const calculatedMacros = useMemo<MacroNutrients>(() => ({
    kcal: (foodItem.macrosPerPortion.kcal || 0) * portions,
    protein: (foodItem.macrosPerPortion.protein || 0) * portions,
    carbs: (foodItem.macrosPerPortion.carbs || 0) * portions,
    fat: (foodItem.macrosPerPortion.fat || 0) * portions,
  }), [portions, foodItem.macrosPerPortion]);

  return (
    <Modal onClose={onClose} className="max-w-lg">
      <div className="space-y-6 p-6">
        <div className="space-y-1 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-text-muted">
            Ajuste de porcion
          </p>
          <h3 className="text-2xl font-semibold tracking-[-0.03em] text-text-primary">{foodItem.name}</h3>
          <p className="text-sm text-text-secondary">Elige una unidad o apunta a un objetivo nutricional.</p>
        </div>

        <div className="flex max-h-32 flex-wrap justify-center gap-2 overflow-y-auto">
          {unitOptions.map((unit) => (
            <ChipButton
              key={unit.key}
              active={activeUnitKey === unit.key}
              tone={unit.key.startsWith('target_') ? 'accent' : 'neutral'}
              size="small"
              onClick={() => { vibrate(5); setActiveUnitKey(unit.key); }}
            >
              {unit.label}
            </ChipButton>
          ))}
        </div>

        <div className="ui-surface--raised p-5 text-center">
          <input
            type="number"
            step={activeUnit.step}
            value={inputValue}
            onChange={handleInputChange}
            className="w-full bg-transparent text-center font-mono text-5xl font-bold tracking-tighter text-text-primary outline-none"
          />
          <span className="mt-2 block text-sm font-medium text-text-secondary">{activeUnit.label}</span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="ui-surface p-3 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-text-muted">Kcal</p>
            <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-text-primary">{calculatedMacros.kcal.toFixed(0)}</p>
          </div>
          <div className="ui-surface p-3 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-text-muted">Prot</p>
            <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-brand-protein">{calculatedMacros.protein.toFixed(0)}g</p>
          </div>
          <div className="ui-surface p-3 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-text-muted">Carb</p>
            <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-brand-carbs">{calculatedMacros.carbs.toFixed(0)}g</p>
          </div>
          <div className="ui-surface p-3 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-text-muted">Grasa</p>
            <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-brand-fat">{calculatedMacros.fat.toFixed(0)}g</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button onClick={() => { vibrate(10); onSave(portions); }} className="w-full" size="large">
            Guardar cantidad
          </Button>
          <Button variant="secondary" onClick={() => { vibrate(5); onClose(); }} className="w-full">
            Cancelar
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PortionEditorModal;
