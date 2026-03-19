import React, { useState } from 'react';
import Modal from '../Modal';
import Button from '../Button';
import { PhotoIcon, CameraIcon, XIcon } from '../icons';
import * as aiService from '../../services/aiService';
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
        <Modal onClose={onClose} className="max-w-md !p-0 overflow-hidden border border-surface-border rounded-[2rem]">
            <div className="p-6 max-h-[90vh] overflow-y-auto relative hide-scrollbar">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xs font-black text-text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-brand-accent"></div>
                        Registrar Sesión
                    </h2>
                    <button onClick={() => { vibrate(5); onClose(); }} className="p-2 bg-surface-hover hover:bg-surface-border rounded-xl transition-colors active:scale-95">
                        <XIcon className="w-5 h-5 text-text-secondary hover:text-text-primary" />
                    </button>
                </div>

                {/* Content */}
                <div className="space-y-8">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="distance" className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.15em] block mb-1.5 pl-1 opacity-70">Distancia (km)</label>
                            <input
                                id="distance"
                                type="number"
                                step="0.1"
                                value={distance}
                                onChange={(e) => setDistance(e.target.value)}
                                placeholder="Ej. 5.2"
                                className="w-full p-4 bg-surface-bg border border-surface-border rounded-xl focus:border-brand-accent outline-none text-white font-mono text-lg placeholder:text-white/20 transition-colors shadow-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="notes" className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.15em] block mb-1.5 pl-1 opacity-70">Notas (Opcional)</label>
                            <textarea
                                id="notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="¿Cómo te sentiste? ¿Algún detalle importante?"
                                rows={4}
                                className="w-full p-4 bg-surface-bg border border-surface-border rounded-xl focus:border-brand-accent outline-none text-sm font-bold text-white placeholder:text-white/20 resize-none leading-relaxed transition-colors shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="mt-10 mb-2 flex gap-3">
                        <Button variant="secondary" onClick={() => { vibrate(5); onClose(); }} className="w-full py-4 text-[10px] font-bold tracking-widest opacity-60 hover:opacity-100 rounded-2xl">OMITIR</Button>
                        <Button onClick={handleSave} className="w-full py-4 font-black tracking-[0.2em] text-[10px] rounded-2xl shadow-xl" variant="high-contrast">GUARDAR</Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ProgressiveCardioLogModal;