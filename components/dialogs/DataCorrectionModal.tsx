import React from 'react';
import Modal from '../Modal';
import Button from '../Button';
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
    <Modal onClose={onCancel} className="max-w-md">
      <div className="p-6 text-center max-h-[90vh] overflow-y-auto">
        <div className="mx-auto bg-yellow-400/10 rounded-full w-20 h-20 flex items-center justify-center animate-pop-in mb-4">
            <SparklesIcon className="w-12 h-12 text-yellow-400" />
        </div>
        <h2 className="text-xl font-bold text-text-primary">Datos Sospechosos Detectados</h2>
        <p className="text-text-secondary my-4">
          ¡Atención! La información de la base de datos para <span className="font-bold text-text-primary">{foodItem.name}</span> parecía inconsistente.
          La IA ha propuesto los siguientes valores, pero podrían ser incorrectos. 
          <strong className="block mt-2 text-text-primary">Por favor, verifica los datos con la etiqueta física del producto.</strong>
        </p>
        
        <div className="bg-surface-bg p-4 rounded-lg my-6 border border-surface-border shadow-sm">
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div><div className="font-bold text-lg text-text-primary">{macros.kcal.toFixed(0)}</div><div className="text-text-secondary">Kcal</div></div>
                <div><div className="font-bold text-lg text-brand-protein">{macros.protein.toFixed(1)}g</div><div className="text-text-secondary">Prot</div></div>
                <div><div className="font-bold text-lg text-brand-carbs">{macros.carbs.toFixed(1)}g</div><div className="text-text-secondary">Carbs</div></div>
                <div><div className="font-bold text-lg text-brand-fat">{macros.fat.toFixed(1)}g</div><div className="text-text-secondary">Grasa</div></div>
            </div>
            <p className="text-xs text-text-secondary mt-3">Por: <span className="font-semibold">{foodItem.standardPortion}</span></p>
        </div>

        <div className="flex flex-col gap-3">
          <Button onClick={onConfirm} className="w-full">Verificar y Editar</Button>
          <Button variant="secondary" onClick={onCancel} className="w-full">Cancelar</Button>
        </div>
      </div>
    </Modal>
  );
};

export default DataCorrectionModal;
