import React from 'react';
import Modal from '../Modal';
import Button from '../Button';
import InlineAlert from '../feedback/InlineAlert';

interface RawDataDebugModalProps {
  data: unknown;
  onConfirm: () => void;
  onCancel: () => void;
}

const RawDataDebugModal: React.FC<RawDataDebugModalProps> = ({ data, onConfirm, onCancel }) => {
  return (
    <Modal onClose={onCancel} className="max-w-3xl">
      <div className="flex max-h-[90vh] flex-col gap-5 overflow-hidden p-6">
        <div className="space-y-2 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-text-muted">
            Open Food Facts
          </p>
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-text-primary">
            Datos crudos del producto
          </h2>
          <p className="text-sm text-text-secondary">
            Revisa la respuesta original antes de enviarla al análisis de IA.
          </p>
        </div>

        <InlineAlert tone="accent">
          Este paso es útil para depurar escaneos ambiguos o productos con metadatos incompletos.
        </InlineAlert>

        <div className="min-h-0 flex-1 overflow-auto rounded-[1.5rem] border border-surface-border bg-slate-950 p-4">
          <pre className="whitespace-pre-wrap break-all text-xs leading-6 text-slate-100">
            <code>{JSON.stringify(data, null, 2)}</code>
          </pre>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button variant="secondary" onClick={onCancel} className="w-full">
            Cancelar
          </Button>
          <Button onClick={onConfirm} className="w-full">
            Analizar con IA
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RawDataDebugModal;
