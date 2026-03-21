import React from 'react';
import Modal from '../../../components/Modal';
import IconButton from '../../../components/IconButton';
import OptionTile from '../../../components/OptionTile';
import { CameraIcon, PhotoIcon, XIcon } from '../../../components/icons';

interface AddFoodImageSourceModalProps {
  open: boolean;
  onClose: () => void;
  onSelectSource: (source: 'camera' | 'gallery') => void;
}

const AddFoodImageSourceModal: React.FC<AddFoodImageSourceModalProps> = ({ open, onClose, onSelectSource }) => {
  if (!open) return null;

  return (
    <Modal onClose={onClose} className="max-w-sm">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm font-black text-brand-accent uppercase tracking-[0.2em]">Fuente de Imagen</h3>
          <IconButton onClick={onClose} icon={XIcon} label="Cerrar" variant="ghost" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <OptionTile icon={CameraIcon} title="Camara" description="Tomar una foto" tone="accent" onClick={() => onSelectSource('camera')} />
          <OptionTile icon={PhotoIcon} title="Galeria" description="Elegir una imagen" tone="carbs" onClick={() => onSelectSource('gallery')} />
        </div>
      </div>
    </Modal>
  );
};

export default AddFoodImageSourceModal;
