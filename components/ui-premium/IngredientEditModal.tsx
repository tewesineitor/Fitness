import React, { useMemo, useState } from 'react';
import PremiumModal from './PremiumModal';
import PremiumInput from './PremiumInput';
import { EyebrowText, MutedText, StatLabel } from './Typography';
import type { IngredientEditableData, IngredientMacros } from './IngredientListItem';

export interface IngredientEditModalProps {
  item: IngredientEditableData;
  onSave: (updated: IngredientEditableData) => void;
  onClose: () => void;
}

const IngredientEditModal: React.FC<IngredientEditModalProps> = ({ item, onSave, onClose }) => {
  const [name, setName]                   = useState(item.name);
  const [brand, setBrand]                 = useState(item.brand ?? '');
  const [standardPortion, setPortion]     = useState(item.standardPortion);
  const [rawWeightG, setRawWeightG]       = useState(item.rawWeightG != null ? String(item.rawWeightG) : '');
  const [cookedWeightG, setCookedWeightG] = useState(item.cookedWeightG != null ? String(item.cookedWeightG) : '');
  const [protein, setProtein]             = useState(String(item.macros.protein));
  const [carbs, setCarbs]                 = useState(String(item.macros.carbs));
  const [fat, setFat]                     = useState(String(item.macros.fat));

  const liveKcal = useMemo(() => {
    const p = parseFloat(protein) || 0;
    const c = parseFloat(carbs)   || 0;
    const f = parseFloat(fat)     || 0;
    return Math.round(p * 4 + c * 4 + f * 9);
  }, [protein, carbs, fat]);

  const handleSave = () => {
    if (!name.trim() || !standardPortion.trim()) return;
    const updatedMacros: IngredientMacros = {
      kcal:    liveKcal,
      protein: parseFloat(protein) || 0,
      carbs:   parseFloat(carbs)   || 0,
      fat:     parseFloat(fat)     || 0,
    };
    onSave({
      name:          name.trim(),
      brand:         brand.trim() || undefined,
      standardPortion: standardPortion.trim(),
      rawWeightG:    rawWeightG.trim()    ? parseFloat(rawWeightG)    : undefined,
      cookedWeightG: cookedWeightG.trim() ? parseFloat(cookedWeightG) : undefined,
      macros:        updatedMacros,
    });
  };

  return (
    <PremiumModal
      onClose={onClose}
      eyebrow="Ingrediente"
      title={item.name}
      primaryLabel="Guardar Cambios"
      onPrimary={handleSave}
      maxWidth="max-w-lg"
    >
      {/* ── Identidad ───────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        <PremiumInput
          label="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre del ingrediente"
          autoFocus
        />
        <div className="grid grid-cols-2 gap-3">
          <PremiumInput
            label="Marca (opcional)"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="—"
          />
          <PremiumInput
            label="Porción estándar"
            value={standardPortion}
            onChange={(e) => setPortion(e.target.value)}
            placeholder="ej: 100g Crudo"
          />
        </div>
      </div>

      {/* ── Equivalencias de peso ───────────────────────── */}
      <div className="flex flex-col gap-2">
        <EyebrowText>Equivalencias de peso</EyebrowText>
        <div className="grid grid-cols-2 gap-3">
          <PremiumInput
            label="Crudo"
            type="number"
            min="0"
            value={rawWeightG}
            onChange={(e) => setRawWeightG(e.target.value)}
            placeholder="—"
            rightElement="g"
          />
          <PremiumInput
            label="Cocido"
            type="number"
            min="0"
            value={cookedWeightG}
            onChange={(e) => setCookedWeightG(e.target.value)}
            placeholder="—"
            rightElement="g"
          />
        </div>
        <MutedText>Ambos campos son opcionales. Se usan para calcular las equivalencias de cocción en la tarjeta.</MutedText>
      </div>

      {/* ── Macros por porción ──────────────────────────── */}
      <div className="flex flex-col gap-2">
        <EyebrowText>Macros por porción</EyebrowText>
        <div className="grid grid-cols-3 gap-3">
          <PremiumInput
            label="Proteína"
            type="number"
            min="0"
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
            placeholder="0"
            rightElement="g"
            inputClassName="!text-violet-400"
          />
          <PremiumInput
            label="Carbohidratos"
            type="number"
            min="0"
            value={carbs}
            onChange={(e) => setCarbs(e.target.value)}
            placeholder="0"
            rightElement="g"
            inputClassName="!text-emerald-400"
          />
          <PremiumInput
            label="Grasas"
            type="number"
            min="0"
            value={fat}
            onChange={(e) => setFat(e.target.value)}
            placeholder="0"
            rightElement="g"
            inputClassName="!text-rose-400"
          />
        </div>
      </div>

      {/* ── KCAL live preview ───────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-3 bg-zinc-950/60 rounded-2xl border border-zinc-800/50">
        <MutedText className="!text-zinc-500">Calorías calculadas</MutedText>
        <div className="flex items-baseline gap-1.5">
          <StatLabel className="!text-2xl !font-black !text-emerald-400 !tabular-nums leading-none">
            {liveKcal}
          </StatLabel>
          <MutedText>KCAL</MutedText>
        </div>
      </div>
    </PremiumModal>
  );
};

export default IngredientEditModal;
