import React from 'react';
import Modal from '../Modal';
import Button from '../Button';

interface RawDataDebugModalProps {
  data: unknown;
  onConfirm: () => void;
  onCancel: () => void;
}

const RawDataDebugModal: React.FC<RawDataDebugModalProps> = ({ data, onConfirm, onCancel }) => {
  return (
    <Modal onClose={onCancel} className="max-w-2xl h-[90vh] !p-0 flex flex-col">
      <div className="p-6 flex flex-col h-full">
        <h2 className="text-xl font-bold text-text-primary mb-4 text-center flex-shrink-0">
          Datos Crudos de Open Food Facts
        </h2>
        <p className="text-sm text-text-secondary mb-4 text-center flex-shrink-0">
          Estos son los datos exactos recibidos. Inspecciónalos para depurar el análisis de la IA.
        </p>
        <div className="flex-grow min-h-0 bg-black/30 rounded-lg p-4 overflow-auto">
          <pre className="text-xs text-white whitespace-pre-wrap break-all">
            <code>{JSON.stringify(data, null, 2)}</code>
          </pre>
        </div>
        <div className="flex gap-3 mt-4 flex-shrink-0">
          <Button variant="secondary" onClick={onCancel} className="w-full">Cancelar</Button>
          <Button onClick={onConfirm} className="w-full">Analizar con IA</Button>
        </div>
      </div>
    </Modal>
  );
};

export default RawDataDebugModal;
