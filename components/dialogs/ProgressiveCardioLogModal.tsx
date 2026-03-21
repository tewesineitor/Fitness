import React, { useState } from 'react';
import Modal from '../Modal';
import Button from '../Button';
import DialogSectionCard from '../DialogSectionCard';
import IconButton from '../IconButton';
import Input from '../Input';
import Tag from '../Tag';
import Textarea from '../Textarea';
import { XIcon } from '../icons';
import { vibrate } from '../../utils/helpers';

interface ProgressiveCardioLogModalProps {
  onSave: (distance: number, notes: string) => void;
  onClose: () => void;
}

const ProgressiveCardioLogModal: React.FC<ProgressiveCardioLogModalProps> = ({ onSave, onClose }) => {
  const [distance, setDistance] = useState('');
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    vibrate(10);
    onSave(parseFloat(distance) || 0, notes);
  };

  return (
    <Modal onClose={onClose} className="max-w-md overflow-hidden !p-0">
      <div className="relative overflow-hidden p-6">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-r from-brand-accent/10 via-transparent to-brand-protein/10" />

        <div className="relative z-10">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <Tag variant="status" tone="accent" size="sm">
                Progressive Cardio
              </Tag>
              <h2 className="mt-3 text-xl font-black uppercase tracking-[-0.04em] text-text-primary">Registrar sesion</h2>
            </div>
            <IconButton onClick={() => { vibrate(5); onClose(); }} icon={XIcon} label="Cerrar" variant="secondary" size="small" />
          </div>

          <div className="space-y-4">
            <DialogSectionCard className="space-y-4 p-5">
              <Input
                id="progressive-distance"
                type="number"
                step="0.1"
                value={distance}
                onChange={(event) => setDistance(event.target.value)}
                label="Distancia (km)"
                placeholder="Ej. 5.2"
                className="font-mono"
              />
              <Textarea
                id="progressive-notes"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                label="Notas"
                placeholder="Sensaciones, clima, tecnica, ruta..."
                rows={4}
              />
            </DialogSectionCard>

            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => { vibrate(5); onClose(); }} className="flex-1">
                Omitir
              </Button>
              <Button onClick={handleSave} className="flex-1" variant="high-contrast">
                Guardar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ProgressiveCardioLogModal;
