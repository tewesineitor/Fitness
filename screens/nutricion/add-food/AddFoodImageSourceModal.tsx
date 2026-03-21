import React from 'react';
import Modal from '../../../components/Modal';
import Button from '../../../components/Button';
import IconButton from '../../../components/IconButton';
import { CameraIcon, PhotoIcon, XIcon } from '../../../components/icons';

interface AddFoodImageSourceModalProps {
  open: boolean;
  onClose: () => void;
  onSelectSource: (source: 'camera' | 'gallery') => void;
}

const SourceCard: React.FC<{
  icon: React.FC<{ className?: string }>;
  label: string;
  toneClass: string;
  onClick: () => void;
}> = ({ icon: Icon, label, toneClass, onClick }) => (
  <Button
    onClick={onClick}
    variant="secondary"
    size="large"
    className="w-full !h-40 !px-0 !py-0 flex-col items-center justify-center rounded-2xl bg-surface-bg border border-surface-border hover:bg-surface-hover hover:border-brand-accent/30 transition-all group active:scale-95"
  >
    <div className="p-4 rounded-full bg-surface-hover border border-surface-border mb-3 group-hover:scale-110 transition-transform">
      <Icon className={`w-8 h-8 ${toneClass}`} />
    </div>
    <span className="text-xs font-bold text-text-primary uppercase tracking-wider">{label}</span>
  </Button>
);

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
          <SourceCard icon={CameraIcon} label="Camara" toneClass="text-brand-accent" onClick={() => onSelectSource('camera')} />
          <SourceCard icon={PhotoIcon} label="Galeria" toneClass="text-brand-carbs" onClick={() => onSelectSource('gallery')} />
        </div>
      </div>
    </Modal>
  );
};

export default AddFoodImageSourceModal;

