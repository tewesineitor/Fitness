
import React from 'react';
import Modal from '../Modal';
import Button from '../Button';
import { XIcon } from '../icons';

interface SetSelectorModalProps {
  onSelect: (sets: number) => void;
  onClose: () => void;
}

const SetSelectorModal: React.FC<SetSelectorModalProps> = ({ onSelect, onClose }) => {
  const setOptions = [1, 2, 3, 4];

  return (
    <Modal onClose={onClose} className="max-w-sm !p-0 overflow-hidden flex flex-col max-h-[90vh]">
      <div className="flex flex-col h-full overflow-hidden">
        {/* Fixed Header */}
        <div className="p-6 pb-4 border-b border-surface-border flex-shrink-0 flex justify-between items-center">
            <h2 className="text-sm font-bold text-text-primary uppercase tracking-[0.2em]">Series del Bloque</h2>
            <Button 
                variant="tertiary" 
                size="small" 
                onClick={onClose} 
                className="!p-0 text-text-secondary hover:text-white"
                icon={XIcon}
            />
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-grow hide-scrollbar">
            <p className="text-xs text-text-secondary font-medium leading-relaxed mb-6 text-center opacity-70">
                Selecciona el volumen de trabajo para este ejercicio.
            </p>

            <div className="grid grid-cols-2 gap-4">
            {setOptions.map(num => (
                <button
                    key={num}
                    onClick={() => onSelect(num)}
                    className="aspect-square rounded-2xl bg-surface-bg border border-surface-border hover:border-brand-accent hover:bg-brand-accent hover:text-white transition-all duration-200 flex flex-col items-center justify-center group active:scale-[0.98] shadow-sm"
                >
                    <span className="text-4xl font-black text-white group-hover:text-white transition-colors">{num}</span>
                    <span className="text-[10px] font-bold text-text-secondary group-hover:text-white/80 uppercase tracking-widest mt-1">Series</span>
                </button>
            ))}
            </div>
        </div>
        
        {/* Fixed Footer */}
        <div className="p-6 pt-4 border-t border-surface-border flex-shrink-0">
            <Button variant="tertiary" onClick={onClose} className="w-full text-xs uppercase tracking-widest opacity-60 hover:opacity-100">
            Cancelar
            </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SetSelectorModal;
