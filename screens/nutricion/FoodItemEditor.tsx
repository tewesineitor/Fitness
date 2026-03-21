import React, { useContext, useEffect, useMemo, useState } from 'react';
import * as actions from '../../actions';
import DialogSectionCard from '../../components/DialogSectionCard';
import Button from '../../components/Button';
import IconButton from '../../components/IconButton';
import Input from '../../components/Input';
import Modal from '../../components/Modal';
import SelectField from '../../components/SelectField';
import Tag from '../../components/Tag';
import { CheckIcon, FireIcon, SparklesIcon, XIcon } from '../../components/icons';
import { AppContext } from '../../contexts';
import type { FoodItem } from '../../types';
import { cleanNutritionText } from './add-food/displayText';

type FoodCategory = FoodItem['category'];

const parsePortion = (portionString?: string): { qty: string; unit: string } => {
  if (!portionString) return { qty: '', unit: '' };
  const match = portionString.match(/^([\d./]+)\s*(.*)$/);
  if (match && match[1] && match[2]) {
    return { qty: match[1], unit: match[2].trim() };
  }
  return { qty: '1', unit: portionString };
};

export const FoodItemEditor: React.FC<{ category?: FoodCategory; onClose: () => void; existingFood?: FoodItem }> = ({
  category: initialCategory,
  onClose,
  existingFood,
}) => {
  const isEditing = !!existingFood;
  const { dispatch, showToast } = useContext(AppContext)!;

  const cameFromScan = !!existingFood?.id.startsWith('off-');
  const scanHadData = cameFromScan && (existingFood?.macrosPerPortion?.kcal ?? 0) > 0;
  const editorTitle = cameFromScan ? 'Verificar ingrediente' : isEditing ? 'Editar ingrediente' : 'Nuevo ingrediente';
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

  const finalKcal = useMemo(() => {
    const p = parseFloat(protein) || 0;
    const c = parseFloat(carbs) || 0;
    const f = parseFloat(fat) || 0;
    return p * 4 + c * 4 + f * 9;
  }, [protein, carbs, fat]);

  useEffect(() => {
    if (finalKcal > 0 || protein || carbs || fat) {
      setIsKcalAnimating(true);
      const timer = setTimeout(() => setIsKcalAnimating(false), 400);
      return () => clearTimeout(timer);
    }
  }, [finalKcal, protein, carbs, fat]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!name.trim()) {
      showToast('El nombre del ingrediente es obligatorio.');
      return;
    }

    const qtyNum = parseFloat(portionQuantity);
    if (!portionQuantity.trim() || Number.isNaN(qtyNum) || qtyNum <= 0) {
      showToast('La cantidad de la porcion debe ser un numero mayor a 0.');
      return;
    }
    if (!portionUnit.trim()) {
      showToast('La unidad de la porcion es obligatoria.');
      return;
    }

    const validateMacro = (value: string) => {
      if (value.trim() === '') return 0;
      const parsed = parseFloat(value);
      return Number.isNaN(parsed) || parsed < 0 ? null : parsed;
    };

    const p = validateMacro(protein);
    const c = validateMacro(carbs);
    const f = validateMacro(fat);

    if (p === null) {
      showToast('Proteina invalida: ingresa un numero positivo.');
      return;
    }
    if (c === null) {
      showToast('Carbohidratos invalidos: ingresa un numero positivo.');
      return;
    }
    if (f === null) {
      showToast('Grasas invalidas: ingresa un numero positivo.');
      return;
    }

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
      dispatch(actions.addCustomFood({ ...foodDetails, isUserCreated: true }));
    } else if (isEditing && existingFood) {
      dispatch(actions.saveUserModifiedFood({ ...existingFood, ...foodDetails }));
    } else {
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
    'Untables / Extras',
  ];

  return (
    <Modal onClose={onClose} className="max-w-2xl overflow-hidden !p-0">
      <form onSubmit={handleSubmit} className="flex max-h-[90vh] flex-col overflow-hidden">
        <div className="relative overflow-hidden border-b border-surface-border p-6">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-brand-accent/10 via-brand-protein/10 to-transparent" />

          <div className="relative z-10 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Tag variant="status" tone={cameFromScan ? 'accent' : 'neutral'} size="sm">
                  {cameFromScan ? 'Scan review' : isEditing ? 'Editor' : 'Manual creation'}
                </Tag>
                {existingFood?.needsReview ? (
                  <Tag variant="status" tone="accent" size="sm">
                    Needs review
                  </Tag>
                ) : null}
              </div>

              <h3 className="text-2xl font-black uppercase tracking-[-0.05em] text-text-primary">{editorTitle}</h3>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-text-secondary">
                Ajusta nombre, porcion y macros en una sola hoja. La logica de guardado se mantiene intacta.
              </p>
            </div>

            <IconButton type="button" onClick={onClose} icon={XIcon} label="Cerrar" variant="secondary" size="small" />
          </div>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-6 hide-scrollbar">
          {cameFromScan && !scanHadData ? (
            <DialogSectionCard className="border-brand-accent/20 bg-brand-accent/6">
              <div className="flex items-start gap-3">
                <div className="rounded-full border border-brand-accent/15 bg-brand-accent/10 p-2 text-brand-accent">
                  <SparklesIcon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-brand-accent">Manual review required</p>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                    No se detectaron datos automaticos. Ingresa la informacion nutricional manualmente desde el empaque.
                  </p>
                </div>
              </div>
            </DialogSectionCard>
          ) : null}

          <DialogSectionCard className="space-y-4 p-5">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-text-secondary">Identity</p>
              <h4 className="mt-2 text-lg font-black uppercase tracking-[-0.04em] text-text-primary">Datos base</h4>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                id="food-name"
                type="text"
                label="Nombre"
                placeholder="Ej. pechuga de pollo"
                value={name}
                onChange={(event) => setName(event.target.value)}
                containerClassName="sm:col-span-2"
              />
              <Input
                id="food-brand"
                type="text"
                label="Marca"
                placeholder="Opcional"
                value={brand}
                onChange={(event) => setBrand(event.target.value)}
              />
              <SelectField
                id="food-category"
                label="Categoria"
                value={category}
                onChange={(event) => setCategory(event.target.value as FoodCategory)}
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {cleanNutritionText(item)}
                  </option>
                ))}
              </SelectField>
            </div>
          </DialogSectionCard>

          <DialogSectionCard className="space-y-4 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-text-secondary">Portion setup</p>
                <h4 className="mt-2 text-lg font-black uppercase tracking-[-0.04em] text-text-primary">Porcion y rendimiento</h4>
              </div>
              <Tag variant="status" tone="neutral" size="sm">
                Base editable
              </Tag>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Input
                id="food-portion-qty"
                type="text"
                label="Cantidad"
                placeholder="100"
                value={portionQuantity}
                onChange={(event) => setPortionQuantity(event.target.value)}
                className="text-center font-mono"
                containerClassName="col-span-1"
              />
              <Input
                id="food-portion-unit"
                type="text"
                label="Unidad"
                placeholder="g, pza, taza"
                value={portionUnit}
                onChange={(event) => setPortionUnit(event.target.value)}
                containerClassName="col-span-2"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                id="food-raw-weight"
                type="number"
                label="Peso crudo (g)"
                placeholder="Opcional"
                value={rawWeightG}
                onChange={(event) => setRawWeightG(event.target.value)}
                className="font-mono"
              />
              <Input
                id="food-cooked-weight"
                type="number"
                label="Peso cocido (g)"
                placeholder="Opcional"
                value={cookedWeightG}
                onChange={(event) => setCookedWeightG(event.target.value)}
                className="font-mono"
              />
            </div>
          </DialogSectionCard>

          <DialogSectionCard className="space-y-4 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-text-secondary">Macros per serving</p>
                <h4 className="mt-2 text-lg font-black uppercase tracking-[-0.04em] text-text-primary">Macronutrientes</h4>
              </div>
              <Tag variant="status" tone="accent" size="sm">
                4P / 4C / 9G
              </Tag>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-[1.25rem] border border-brand-protein/15 bg-brand-protein/6 p-3">
                <Input
                  id="food-protein"
                  type="number"
                  step="0.1"
                  label="Proteina"
                  placeholder="0"
                  value={protein}
                  onChange={(event) => setProtein(event.target.value)}
                  className="text-center text-base font-mono"
                  containerClassName="space-y-1.5"
                  focusClassName="focus-within:border-brand-protein/50 focus-within:ring-2 focus-within:ring-brand-protein/15"
                />
              </div>

              <div className="rounded-[1.25rem] border border-brand-carbs/15 bg-brand-carbs/6 p-3">
                <Input
                  id="food-carbs"
                  type="number"
                  step="0.1"
                  label="Carbs"
                  placeholder="0"
                  value={carbs}
                  onChange={(event) => setCarbs(event.target.value)}
                  className="text-center text-base font-mono"
                  containerClassName="space-y-1.5"
                  focusClassName="focus-within:border-brand-carbs/50 focus-within:ring-2 focus-within:ring-brand-carbs/15"
                />
              </div>

              <div className="rounded-[1.25rem] border border-surface-border bg-surface-hover/60 p-3">
                <Input
                  id="food-fat"
                  type="number"
                  step="0.1"
                  label="Grasas"
                  placeholder="0"
                  value={fat}
                  onChange={(event) => setFat(event.target.value)}
                  className="text-center text-base font-mono"
                  containerClassName="space-y-1.5"
                  focusClassName="focus-within:border-text-primary/20 focus-within:ring-2 focus-within:ring-text-primary/10"
                />
              </div>
            </div>
          </DialogSectionCard>

          <DialogSectionCard className="overflow-hidden border-brand-accent/15 bg-brand-accent/6 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-brand-accent">Energia estimada</p>
                <div
                  className={`mt-3 flex items-end gap-2 transition-all duration-300 ${
                    isKcalAnimating ? 'scale-[1.03] text-brand-accent' : 'text-text-primary'
                  }`}
                >
                  <span className="font-mono text-5xl font-black leading-none tracking-[-0.08em]">{finalKcal.toFixed(0)}</span>
                  <span className="pb-1 text-[11px] font-black uppercase tracking-[0.22em] text-text-secondary">kcal</span>
                </div>
              </div>

              <div className="rounded-full border border-brand-accent/15 bg-white/40 p-3 text-brand-accent dark:bg-black/10">
                <FireIcon className="h-5 w-5" />
              </div>
            </div>
          </DialogSectionCard>
        </div>

        <div className="border-t border-surface-border p-6">
          <div className="flex flex-col gap-3">
            <Button type="submit" className="w-full py-4 text-xs font-black tracking-[0.2em]" icon={CheckIcon}>
              {isEditing ? 'GUARDAR CAMBIOS' : 'CREAR INGREDIENTE'}
            </Button>

            {isEditableDefault ? (
              <Button
                type="button"
                variant="secondary"
                onClick={handleReset}
                className="w-full py-3 text-[10px] font-bold tracking-[0.18em]"
              >
                RESTAURAR ORIGINAL
              </Button>
            ) : null}
          </div>
        </div>
      </form>
    </Modal>
  );
};
