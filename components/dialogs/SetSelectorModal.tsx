import React from 'react';
import Modal from '../Modal';
import Card from '../Card';
import IconButton from '../IconButton';
import Tag from '../Tag';
import { XIcon } from '../icons';

interface SetSelectorModalProps {
  onSelect: (sets: number) => void;
  onClose: () => void;
}

const SetSelectorModal: React.FC<SetSelectorModalProps> = ({ onSelect, onClose }) => {
  const setOptions = [1, 2, 3, 4];

  return (
    <Modal onClose={onClose} className="max-w-sm overflow-hidden !p-0">
      <div className="relative overflow-hidden p-6">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-r from-brand-accent/10 via-transparent to-brand-protein/10" />

        <div className="relative z-10">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <Tag variant="status" tone="accent" size="sm">
                Block Volume
              </Tag>
              <h2 className="mt-3 text-xl font-black uppercase tracking-[-0.04em] text-text-primary">Series del bloque</h2>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                Elige el volumen de trabajo para este ejercicio.
              </p>
            </div>
            <IconButton onClick={onClose} icon={XIcon} label="Cerrar" variant="secondary" size="small" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {setOptions.map((num) => (
              <Card
                key={num}
                as="button"
                onClick={() => onSelect(num)}
                variant="elevated"
                className="flex aspect-square flex-col items-center justify-center gap-2 p-4 text-center"
              >
                <span className="font-mono text-5xl font-black leading-none tracking-[-0.08em] text-text-primary">{num}</span>
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-text-secondary">Series</span>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SetSelectorModal;
