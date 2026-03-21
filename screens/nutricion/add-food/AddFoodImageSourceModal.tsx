import React from 'react';
import Modal from '../../../components/Modal';
import IconButton from '../../../components/IconButton';
import OptionTile from '../../../components/OptionTile';
import Tag from '../../../components/Tag';
import { CameraIcon, PhotoIcon, SparklesIcon, XIcon } from '../../../components/icons';

interface AddFoodImageSourceModalProps {
  open: boolean;
  onClose: () => void;
  onSelectSource: (source: 'camera' | 'gallery') => void;
}

const AddFoodImageSourceModal: React.FC<AddFoodImageSourceModalProps> = ({ open, onClose, onSelectSource }) => {
  if (!open) return null;

  return (
    <Modal onClose={onClose} className="max-w-md overflow-hidden !p-0">
      <div className="relative overflow-hidden p-6">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-brand-accent/10 via-brand-protein/10 to-transparent" />

        <div className="relative z-10">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <Tag variant="status" tone="accent" size="sm" className="mb-3">
                Image Intake
              </Tag>
              <h3 className="text-xl font-black uppercase tracking-[-0.04em] text-text-primary">Fuente de imagen</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                Elige el origen de la foto para extraer informacion nutricional sin salir del flujo.
              </p>
            </div>

            <IconButton onClick={onClose} icon={XIcon} label="Cerrar" variant="secondary" size="small" />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <OptionTile
              icon={CameraIcon}
              title="Camara"
              description="Captura el empaque en vivo"
              tone="accent"
              onClick={() => onSelectSource('camera')}
              className="min-h-[12rem]"
            />
            <OptionTile
              icon={PhotoIcon}
              title="Galeria"
              description="Analiza una foto existente"
              tone="protein"
              onClick={() => onSelectSource('gallery')}
              className="min-h-[12rem]"
            />
          </div>

          <div className="mt-4 flex items-start gap-3 rounded-[1.35rem] border border-surface-border bg-surface-bg/80 px-4 py-3">
            <div className="rounded-full border border-brand-accent/15 bg-brand-accent/8 p-2 text-brand-accent">
              <SparklesIcon className="h-4 w-4" />
            </div>
            <p className="text-sm font-medium leading-relaxed text-text-secondary">
              La foto se procesa solo para leer los datos del empaque y abrir el editor con los macros detectados.
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddFoodImageSourceModal;
