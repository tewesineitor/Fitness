
import React, { useState, useContext, useMemo, useEffect } from 'react';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import IconButton from '../../components/IconButton';
import Input from '../../components/Input';
import { FoodItem } from '../../types';
import { AppContext } from '../../contexts';
import * as actions from '../../actions';
import { CheckIcon, XIcon } from '../../components/icons';

type FoodCategory = FoodItem['category'];

const parsePortion = (portionString?: string): { qty: string; unit: string } => {
    if (!portionString) return { qty: '', unit: '' };
    // Regex to capture a quantity (numbers, dots, slashes) and the rest as the unit.
    const match = portionString.match(/^([\d./]+)\s*(.*)$/);
    if (match && match[1] && match[2]) {
        return { qty: match[1], unit: match[2].trim() };
    }
    // Fallback for strings without a leading number
    return { qty: '1', unit: portionString };
};


export const FoodItemEditor: React.FC<{ category?: FoodCategory; onClose: () => void; existingFood?: FoodItem }> = ({ category: initialCategory, onClose, existingFood }) => {
    const isEditing = !!existingFood;
    const { dispatch, showToast } = useContext(AppContext)!;
    
    const cameFromScan = !!existingFood?.id.startsWith('off-');
    const scanHadData = cameFromScan && (existingFood?.macrosPerPortion?.kcal ?? 0) > 0;
    
    const editorTitle = cameFromScan ? 'Verificar Ingrediente' : isEditing ? 'Editar Ingrediente' : 'Nuevo Ingrediente';

    const initialPortion = useMemo(() => parsePortion(existingFood?.standardPortion), [existingFood]);

    const [name, setName] = useState(existingFood?.name || '');
    const [brand, setBrand] = useState(existingFood?.brand || '');
    const [category, setCategory] = useState<FoodCategory>(existingFood?.category || initialCategory || 'Carnicería (Pollo)');
    
    const [portionQuantity, setPortionQuantity] = useState(initialPortion.qty);
    const [portionUnit, setPortionUnit] = useState(initialPortion.unit);

    const [rawWeightG, setRawWeightG] = useState(existingFood?.rawWeightG?.toString() || '');
    const [cookedWeightG, setCookedWeightG] = useState(existingFood?.cookedWeightG?.toString() || '');
    const [protein, setProtein] = useState(existingFood?.macrosPerPortion?.protein?.toString() || '');
    const [carbs, setCarbs] = useState(existingFood?.macrosPerPortion?.carbs?.toString() || '');
    const [fat, setFat] = useState(existingFood?.macrosPerPortion?.fat?.toString() || '');
    const [isKcalAnimating, setIsKcalAnimating] = useState(false);

    // CORRECT: useMemo is now a pure function for calculation only.
    const finalKcal = useMemo(() => {
        const p = parseFloat(protein) || 0;
        const c = parseFloat(carbs) || 0;
        const f = parseFloat(fat) || 0;
        return p * 4 + c * 4 + f * 9;
    }, [protein, carbs, fat]);

    // CORRECT: Side effects (like animations) are handled in useEffect.
    useEffect(() => {
        // Trigger animation whenever the calorie value changes, but not on initial load if it's 0
        if (finalKcal > 0 || protein || carbs || fat) { // Animate even if result is 0 but there is input
            setIsKcalAnimating(true);
            const timer = setTimeout(() => setIsKcalAnimating(false), 400);
            return () => clearTimeout(timer); // Proper cleanup
        }
    }, [finalKcal, protein, carbs, fat]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // --- VALIDACIONES ---
        if (!name.trim()) {
            showToast("El nombre del ingrediente es obligatorio.");
            return;
        }

        // Validación de Porción
        const qtyNum = parseFloat(portionQuantity);
        if (!portionQuantity.trim() || isNaN(qtyNum) || qtyNum <= 0) {
            showToast("La cantidad de la porción debe ser un número mayor a 0.");
            return;
        }
        if (!portionUnit.trim()) {
            showToast("La unidad de la porción es obligatoria (ej. g, pza, taza).");
            return;
        }

        // Validación de Macros
        const validateMacro = (val: string) => {
            if (val.trim() === '') return 0; // Campos vacíos se toman como 0
            const num = parseFloat(val);
            return (isNaN(num) || num < 0) ? null : num;
        };

        const p = validateMacro(protein);
        const c = validateMacro(carbs);
        const f = validateMacro(fat);

        if (p === null) { showToast("Proteína inválida: Ingresa un número positivo."); return; }
        if (c === null) { showToast("Carbohidratos inválidos: Ingresa un número positivo."); return; }
        if (f === null) { showToast("Grasas inválidas: Ingresa un número positivo."); return; }

        // --- PREPARACIÓN DE DATOS ---
        const standardPortion = `${portionQuantity.trim()} ${portionUnit.trim()}`.trim();

        const foodDetails = {
            name,
            brand,
            category,
            standardPortion,
            rawWeightG: parseFloat(rawWeightG) || undefined,
            cookedWeightG: parseFloat(cookedWeightG) || undefined,
            macrosPerPortion: { protein: p, carbs: c, fat: f, kcal: finalKcal },
            isUserCreated: existingFood?.isUserCreated || false,
        };

        if ((isEditing && !existingFood.isUserCreated) || (isEditing && existingFood.needsReview)) {
            // If we are "editing" a default/scanned item, or a reviewed item, it becomes a new custom item.
            dispatch(actions.addCustomFood({ ...foodDetails, isUserCreated: true }));
        } else if (isEditing && existingFood) {
            // If we are editing a food that is ALREADY a user-created one.
            dispatch(actions.saveUserModifiedFood({ ...existingFood, ...foodDetails }));
        } else {
            // If we are creating a brand new food from scratch.
            dispatch(actions.addCustomFood({ ...foodDetails, isUserCreated: true }));
        }
        
        onClose();
    };

    const handleReset = () => {
        if (existingFood && !existingFood.isUserCreated) {
            dispatch(actions.resetEditedDefaultFood(existingFood.id));
            onClose();
        }
    };

    const isEditableDefault = isEditing && !existingFood.isUserCreated;
    const selectClasses = "w-full h-11 px-3 bg-surface-hover/40 border border-surface-border rounded-xl text-[13px] font-medium text-text-primary focus:border-brand-accent outline-none transition-all shadow-sm appearance-none pr-10";
    const fieldLabelClass = "text-[9px] font-bold text-text-secondary uppercase tracking-[0.2em] mb-2 block pl-1";

    const categories: FoodCategory[] = [
        'Grasas y Aceites',
        'Carnicería (Pollo)',
        'Carnicería (Res)',
        'Carnicería (Cerdo)',
        'Pescadería',
        'Huevo y Lácteos',
        'Embutidos',
        'Tortillas y Maíz',
        'Panadería',
        'Cereales y Tubérculos',
        'Legumbres',
        'Frutas',
        'Verduras',
        'Semillas y Frutos Secos',
        'Condimentos y Salsas',
        'Enlatados',
        'Calle (Antojitos)',
        'Calle (Caldos)',
        'Suplementos',
        'Untables / Extras'
    ];

    return (
        <Modal onClose={onClose} className="max-w-md !p-0 overflow-hidden flex flex-col max-h-[90vh]">
            <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
                {/* Fixed Header */}
                <div className="p-6 pb-4 border-b border-surface-border flex-shrink-0">
                    <div className="flex justify-between items-center">
                        <h3 className="text-sm font-bold text-text-primary uppercase tracking-[0.2em]">{editorTitle}</h3>
                        <IconButton type="button" onClick={onClose} icon={XIcon} label="Cerrar" variant="ghost" />
                    </div>
                </div>
                
                {/* Scrollable Content */}
                <div className="p-6 overflow-y-auto flex-grow space-y-6 hide-scrollbar">
                    {cameFromScan && !scanHadData && (
                        <div className="bg-brand-accent/5 border border-brand-accent/20 text-brand-accent p-4 rounded-xl text-[11px] mb-6 font-medium">
                            <p className="font-bold mb-1 uppercase tracking-wider">¡Atención!</p>
                            <p className="opacity-80">No se encontraron datos automáticos. Por favor, ingresa la información nutricional manualmente desde el empaque del producto.</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        <Input
                            id="food-name"
                            type="text"
                            label="Nombre del Alimento"
                            placeholder="Ej. Pechuga de Pollo"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                        <Input
                            id="food-brand"
                            type="text"
                            label="Marca (Opcional)"
                            placeholder="Ej. San Rafael"
                            value={brand}
                            onChange={e => setBrand(e.target.value)}
                        />
                        
                        <div>
                            <label htmlFor="food-category" className={fieldLabelClass}>Categoría</label>
                            <div className="relative">
                                <select id="food-category" value={category} onChange={e => setCategory(e.target.value as FoodCategory)} className={selectClasses}>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary/50">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <Input
                                id="food-portion-qty"
                                type="text"
                                label="Cantidad"
                                placeholder="100"
                                value={portionQuantity}
                                onChange={e => setPortionQuantity(e.target.value)}
                                className="text-center font-mono"
                                containerClassName="col-span-1"
                            />
                            <Input
                                id="food-portion-unit"
                                type="text"
                                label="Unidad"
                                placeholder="g, pza, taza"
                                value={portionUnit}
                                onChange={e => setPortionUnit(e.target.value)}
                                containerClassName="col-span-2"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                id="food-raw-weight"
                                type="number"
                                label="Peso Crudo (g)"
                                placeholder="Opcional"
                                value={rawWeightG}
                                onChange={e => setRawWeightG(e.target.value)}
                                className="font-mono"
                            />
                            <Input
                                id="food-cooked-weight"
                                type="number"
                                label="Peso Cocido (g)"
                                placeholder="Opcional"
                                value={cookedWeightG}
                                onChange={e => setCookedWeightG(e.target.value)}
                                className="font-mono"
                            />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-surface-border">
                        <label className={fieldLabelClass}>Macronutrientes por Porción</label>
                        <div className="grid grid-cols-3 gap-3">
                            <Input
                                id="food-protein"
                                type="number"
                                step="0.1"
                                label="Proteína"
                                placeholder="0"
                                value={protein}
                                onChange={e => setProtein(e.target.value)}
                                className="text-center text-base font-mono"
                                containerClassName="space-y-1.5"
                                focusClassName="focus-within:border-brand-protein/50 focus-within:ring-2 focus-within:ring-brand-protein/15"
                            />
                            <Input
                                id="food-carbs"
                                type="number"
                                step="0.1"
                                label="Carbs"
                                placeholder="0"
                                value={carbs}
                                onChange={e => setCarbs(e.target.value)}
                                className="text-center text-base font-mono"
                                containerClassName="space-y-1.5"
                                focusClassName="focus-within:border-brand-carbs/50 focus-within:ring-2 focus-within:ring-brand-carbs/15"
                            />
                            <Input
                                id="food-fat"
                                type="number"
                                step="0.1"
                                label="Grasas"
                                placeholder="0"
                                value={fat}
                                onChange={e => setFat(e.target.value)}
                                className="text-center text-base font-mono"
                                containerClassName="space-y-1.5"
                                focusClassName="focus-within:border-brand-fat/50 focus-within:ring-2 focus-within:ring-brand-fat/15"
                            />
                        </div>
                    </div>

                    <div className="bg-surface-hover border border-surface-border p-6 rounded-2xl text-center">
                        <p className="text-[9px] text-text-secondary font-bold uppercase tracking-[0.25em] mb-2 opacity-60">Total Energético Estimado</p>
                        <div className={`flex items-baseline justify-center gap-1 transition-all duration-300 ${isKcalAnimating ? 'scale-110 text-brand-accent' : 'text-text-primary'}`}>
                            <span className="text-4xl font-bold font-mono tracking-tighter">{finalKcal.toFixed(0)}</span>
                            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">kcal</span>
                        </div>
                    </div>
                </div>

                {/* Fixed Footer */}
                <div className="p-6 pt-4 border-t border-surface-border flex-shrink-0">
                    <div className="flex flex-col gap-3">
                        <Button type="submit" className="w-full py-4 text-xs font-bold tracking-[0.2em]" icon={CheckIcon}>
                            {isEditing ? 'GUARDAR CAMBIOS' : 'CREAR INGREDIENTE'}
                        </Button>
                        
                        {isEditableDefault && (
                             <Button type="button" variant="secondary" onClick={handleReset} className="w-full py-3 text-[10px] font-bold tracking-widest opacity-60 hover:opacity-100">RESTAURAR ORIGINAL</Button>
                        )}
                    </div>
                </div>
            </form>
        </Modal>
    );
}
