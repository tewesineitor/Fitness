import React from 'react';
import Modal from '../Modal';
import Button from '../Button';
import InlineAlert from '../feedback/InlineAlert';
import { FoodItem } from '../../types';
import { SparklesIcon } from '../icons';

interface DataCorrectionModalProps {
  foodItem: FoodItem;
  onConfirm: () => void;
  onCancel: () => void;
}

const DataCorrectionModal: React.FC<DataCorrectionModalProps> = ({ foodItem, onConfirm, onCancel }) => {
  const { macrosPerPortion: macros } = foodItem;

  return (
    <Modal onClose={onCancel} className="max-w-lg">
      <div className="space-y-6 p-6 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-warning/10 text-warning">
          <SparklesIcon className="h-10 w-10" />
        </div>

        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-text-muted">
            Verificacion sugerida
          </p>
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-text-primary">
            Datos sospechosos detectados
          </h2>
          <p className="text-sm leading-6 text-text-secondary">
            La informacion encontrada para <span className="font-semibold text-text-primary">{foodItem.name}</span> parece inconsistente.
            Revisa los valores antes de confirmar el ingrediente.
          </p>
        </div>

        <InlineAlert tone="warning" title="Recomendacion">
          Compara esta propuesta con la etiqueta física del producto antes de guardarla.
        </InlineAlert>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="ui-surface p-3">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-text-muted">Kcal</p>
            <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-text-primary">{macros.kcal.toFixed(0)}</p>
          </div>
          <div className="ui-surface p-3">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-text-muted">Prot</p>
            <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-brand-protein">{macros.protein.toFixed(1)}g</p>
          </div>
          <div className="ui-surface p-3">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-text-muted">Carb</p>
            <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-brand-carbs">{macros.carbs.toFixed(1)}g</p>
          </div>
          <div className="ui-surface p-3">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-text-muted">Grasa</p>
            <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-brand-fat">{macros.fat.toFixed(1)}g</p>
          </div>
        </div>

        <p className="text-sm text-text-secondary">
          Por porcion: <span className="font-semibold text-text-primary">{foodItem.standardPortion}</span>
        </p>

        <div className="flex flex-col gap-3">
          <Button onClick={onConfirm} className="w-full" size="large">
            Verificar y editar
          </Button>
          <Button variant="secondary" onClick={onCancel} className="w-full">
            Cancelar
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DataCorrectionModal;
