
import React, { useState, useMemo } from 'react';
import { AddedFood, MacroNutrients, FoodItem } from '../../types';
import Modal from '../Modal';
import Button from '../Button';
import { vibrate } from '../../utils/helpers';

interface UnitOption { key: string; label: string; toPortions: (value: number) => number; fromPortions: (portions: number) => number; step: number; }

const parseStandardPortion = (portionString: string): { baseQuantity: number, unitName: string | null } => {
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
        case 'Calle (Antojitos)':
        case 'Calle (Caldos)':
        default:
            return ['protein', 'carbs', 'fat'];
    }
};


const PortionEditorModal: React.FC<{ food: AddedFood; onSave: (newPortions: number) => void; onClose: () => void; }> = ({ food, onSave, onClose }) => {
    const { foodItem, portions: initialPortions } = food;
    
    const unitOptions = useMemo<UnitOption[]>(() => {
        // 1. Standard Units (Portion, Pieces, Grams)
        const options: UnitOption[] = [{ key: 'portion', label: 'Porción', toPortions: v => v, fromPortions: p => p, step: 0.1 }];
        
        const { baseQuantity, unitName } = parseStandardPortion(foodItem.standardPortion);
        if (unitName && baseQuantity !== 1) {
            options.push({ key: 'piece', label: unitName.charAt(0).toUpperCase() + unitName.slice(1), toPortions: v => v / baseQuantity, fromPortions: p => p * baseQuantity, step: 1 });
        }
        if (foodItem.rawWeightG) options.push({ key: 'raw_g', label: 'g (crudo)', toPortions: v => v / foodItem.rawWeightG!, fromPortions: p => p * foodItem.rawWeightG!, step: 5 });
        if (foodItem.cookedWeightG) options.push({ key: 'cooked_g', label: 'g (cocido)', toPortions: v => v / foodItem.cookedWeightG!, fromPortions: p => p * foodItem.cookedWeightG!, step: 5 });

        // 2. Macro Targeting Options
        const macros = foodItem.macrosPerPortion;
        const priorityOrder = getPriorityMacros(foodItem.category);

        priorityOrder.forEach(macroKey => {
            const value = macros[macroKey as keyof MacroNutrients];
            if (value && value > 0) {
                let label = '';
                switch(macroKey) {
                    case 'protein': label = 'g Proteína'; break;
                    case 'carbs': label = 'g Carbs'; break;
                    case 'fat': label = 'g Grasa'; break;
                }
                
                options.push({
                    key: `target_${macroKey}`,
                    label: `🎯 ${label}`, // Icon indicates a target goal
                    toPortions: (targetVal) => targetVal / value,
                    fromPortions: (portions) => portions * value,
                    step: 1
                });
            }
        });

        // Always add calorie targeting at the end if kcal > 0
        if (macros.kcal > 0) {
             options.push({
                key: 'target_kcal',
                label: '🎯 Kcal',
                toPortions: (targetVal) => targetVal / macros.kcal,
                fromPortions: (portions) => portions * macros.kcal,
                step: 10
            });
        }

        return options;
    }, [foodItem]);
    
    const [portions, setPortions] = useState(initialPortions);
    const [activeUnitKey, setActiveUnitKey] = useState(unitOptions[0].key);
    
    const activeUnit = useMemo(() => unitOptions.find(u => u.key === activeUnitKey)!, [unitOptions, activeUnitKey]);
    
    const inputValue = useMemo(() => {
        const value = activeUnit.fromPortions(portions);
        if (value === 0) return '0';
        
        // Format differently based on whether it's a macro target or a physical unit
        if (activeUnitKey.startsWith('target_')) {
             return Math.round(value).toString(); // Integer for macros usually looks cleaner
        }

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
        <Modal onClose={onClose} className="max-w-md">
            <div className="p-6">
                <h3 className="text-xl font-bold text-center mb-1">{foodItem.name}</h3>
                <p className="text-sm text-center text-text-secondary mb-6">Elige la unidad o el objetivo</p>
                
                {/* Scrollable container for unit chips with flex-wrap for better layout */}
                <div className="flex flex-wrap gap-2 p-1 max-h-32 overflow-y-auto mb-6 justify-center">
                    {unitOptions.map(unit => (
                        <button 
                            key={unit.key} 
                            onClick={() => { vibrate(5); setActiveUnitKey(unit.key); }} 
                            className={`px-3 py-1.5 rounded-full font-semibold text-xs transition-colors border ${
                                activeUnitKey === unit.key 
                                    ? 'bg-brand-accent text-accent-text border-brand-accent' 
                                    : unit.key.startsWith('target_') 
                                        ? 'bg-brand-accent/5 text-text-secondary border-brand-accent/20 hover:bg-brand-accent/10'
                                        : 'bg-surface-bg text-text-secondary border-surface-border hover:bg-surface-hover'
                            }`}
                        >
                            {unit.label}
                        </button>
                    ))}
                </div>

                <div className="relative">
                    <input 
                        type="number" 
                        step={activeUnit.step} 
                        value={inputValue} 
                        onChange={handleInputChange} 
                        className="w-full text-center text-4xl sm:text-5xl font-bold bg-surface-bg border border-surface-border rounded-2xl focus:border-brand-accent outline-none p-6 text-white font-mono tracking-tighter shadow-inner transition-all"
                    />
                    <span className="block text-center text-sm text-text-secondary mt-2 font-medium">
                        {activeUnit.label}
                    </span>
                </div>

                <div className="bg-surface-bg p-3 rounded-lg !mt-6 text-center border border-surface-border shadow-sm">
                    <p className="text-sm text-text-secondary mb-2">Resultado Final</p>
                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                        <div><div className="font-bold text-lg text-text-primary">{calculatedMacros.kcal.toFixed(0)}</div><div className="text-text-secondary">Kcal</div></div>
                        <div><div className="font-bold text-lg text-brand-protein">{calculatedMacros.protein.toFixed(0)}g</div><div className="text-text-secondary">Prot</div></div>
                        <div><div className="font-bold text-lg text-brand-carbs">{calculatedMacros.carbs.toFixed(0)}g</div><div className="text-text-secondary">Carbs</div></div>
                        <div><div className="font-bold text-lg text-brand-fat">{calculatedMacros.fat.toFixed(0)}g</div><div className="text-text-secondary">Grasa</div></div>
                    </div>
                </div>
                <div className="flex flex-col space-y-2 pt-6">
                    <Button onClick={() => { vibrate(10); onSave(portions); }} className="w-full">Guardar Cantidad</Button>
                    <Button variant="secondary" onClick={() => { vibrate(5); onClose(); }} className="w-full">Cancelar</Button>
                </div>
            </div>
        </Modal>
    );
};

export default PortionEditorModal;
