import React, { useState, useContext } from 'react';
import { AppContext } from '../../contexts';
import * as actions from '../../actions';
import Modal from '../Modal';
import Button from '../Button';
import { XIcon, RulerHorizontalIcon, ScaleIcon, CameraIcon } from '../icons';

interface MeasurementModalProps {
    onClose: () => void;
}

const MeasurementInput: React.FC<{ 
    label: string; 
    value: string; 
    onChange: (val: string) => void; 
    unit?: string;
    step?: string;
}> = ({ label, value, onChange, unit = 'cm', step = "0.1" }) => (
    <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">{label}</label>
        <div className="flex items-center gap-2 bg-surface-bg border border-surface-border rounded-lg px-3 py-2 focus-within:border-brand-accent transition-colors">
            <input 
                type="number" 
                step={step}
                value={value} 
                onChange={e => onChange(e.target.value)} 
                placeholder="0" 
                className="w-full bg-transparent outline-none text-lg font-bold text-text-primary placeholder:text-text-secondary/60"
            />
            <span className="text-xs font-bold text-text-secondary">{unit}</span>
        </div>
    </div>
);

const MeasurementModal: React.FC<MeasurementModalProps> = ({ onClose }) => {
    const { dispatch, showToast } = useContext(AppContext)!;
    const todayStr = new Date().toISOString().split('T')[0];

    const [weight, setWeight] = useState('');
    const [waist, setWaist] = useState('');
    const [hips, setHips] = useState('');
    const [neck, setNeck] = useState('');
    const [shoulders, setShoulders] = useState('');
    const [chest, setChest] = useState('');
    const [thigh, setThigh] = useState('');
    const [biceps, setBiceps] = useState('');
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        const payload: Parameters<typeof actions.addMetricEntry>[0] = { date: todayStr };
        if (weight) payload.weight = parseFloat(weight);
        if (waist) payload.waist = parseFloat(waist);
        if (hips) payload.hips = parseFloat(hips);
        if (neck) payload.neck = parseFloat(neck);
        if (shoulders) payload.shoulders = parseFloat(shoulders);
        if (chest) payload.chest = parseFloat(chest);
        if (thigh) payload.thigh = parseFloat(thigh);
        if (biceps) payload.biceps = parseFloat(biceps);
        if (photoUrl) payload.photoUrl = photoUrl;

        if (Object.keys(payload).length > 1) {
            dispatch(actions.addMetricEntry(payload));
            showToast('Medidas registradas correctamente');
            onClose();
        } else {
            onClose();
        }
    };

    return (
        <Modal onClose={onClose} className="max-w-md !p-0 overflow-hidden border border-surface-border rounded-[2rem]">
            <div className="p-6 max-h-[90vh] overflow-y-auto relative hide-scrollbar">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xs font-black text-text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-brand-accent"></div>
                        Registro Corporal
                    </h2>
                    <button onClick={() => { onClose(); }} className="p-2 bg-surface-hover hover:bg-surface-border rounded-xl transition-colors active:scale-95">
                        <XIcon className="w-5 h-5 text-text-secondary hover:text-text-primary" />
                    </button>
                </div>

                {/* Content */}
                <div className="space-y-8">
                    <div className="space-y-6">
                        {/* Weight Section */}
                        <div className="bg-surface-hover/20 p-5 rounded-2xl border border-surface-border shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-brand-accent/10 flex items-center justify-center">
                                    <ScaleIcon className="w-4 h-4 text-brand-accent" />
                                </div>
                                <h3 className="text-xs font-bold text-text-primary uppercase tracking-widest">Peso Corporal</h3>
                            </div>
                            <MeasurementInput label="Peso Actual" value={weight} onChange={setWeight} unit="kg" />
                        </div>

                        {/* Measurements Section */}
                        <div className="bg-surface-hover/20 p-5 rounded-2xl border border-surface-border shadow-sm">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-8 h-8 rounded-lg bg-brand-carbs/10 flex items-center justify-center">
                                    <RulerHorizontalIcon className="w-4 h-4 text-brand-carbs" />
                                </div>
                                <h3 className="text-xs font-bold text-text-primary uppercase tracking-widest">Medidas Clave</h3>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                                <MeasurementInput label="Cintura" value={waist} onChange={setWaist} />
                                <MeasurementInput label="Caderas" value={hips} onChange={setHips} />
                                <MeasurementInput label="Pecho" value={chest} onChange={setChest} />
                                <MeasurementInput label="Hombros" value={shoulders} onChange={setShoulders} />
                                <MeasurementInput label="Muslo" value={thigh} onChange={setThigh} />
                                <MeasurementInput label="Bíceps" value={biceps} onChange={setBiceps} />
                                <MeasurementInput label="Cuello" value={neck} onChange={setNeck} />
                            </div>
                        </div>

                        {/* Photo Section */}
                        <div className="bg-surface-hover/20 p-5 rounded-2xl border border-surface-border shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-brand-fat/10 flex items-center justify-center">
                                    <CameraIcon className="w-4 h-4 text-brand-fat" />
                                </div>
                                <h3 className="text-xs font-bold text-text-primary uppercase tracking-widest">Foto de Progreso</h3>
                            </div>
                            
                            <label className="relative w-full aspect-video rounded-xl overflow-hidden group border-2 border-dashed border-surface-border hover:border-brand-fat/50 transition-all active:scale-[0.98] flex flex-col items-center justify-center cursor-pointer bg-surface-bg">
                                {photoUrl ? (
                                    <>
                                        <img src={photoUrl} alt="Progreso" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <span className="text-xs font-bold text-text-primary uppercase tracking-widest">Cambiar Foto</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-10 h-10 rounded-xl bg-surface-hover border border-surface-border flex items-center justify-center mb-2 group-hover:bg-brand-fat/10 group-hover:border-brand-fat/30 transition-all shadow-sm">
                                            <CameraIcon className="w-5 h-5 text-brand-fat" />
                                        </div>
                                        <span className="text-[10px] font-bold text-text-secondary group-hover:text-text-primary uppercase tracking-widest transition-colors">Añadir Foto</span>
                                    </>
                                )}
                                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                            </label>
                        </div>
                    </div>

                    <div className="mt-10 mb-2">
                        <Button onClick={handleSave} className="w-full py-4 font-black tracking-[0.2em] text-[10px] rounded-2xl shadow-xl" variant="high-contrast">
                            Guardar Registro
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default MeasurementModal;
