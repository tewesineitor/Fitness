import React from 'react';
import Modal from '../Modal';
import Button from '../Button';
import { XIcon, RulerHorizontalIcon, ScaleIcon, CameraIcon } from '../icons';
import type { BodyMetricsController } from '../../screens/progreso/hooks/useBodyMetricsController';

interface MeasurementModalProps {
    controller: BodyMetricsController;
}

const MeasurementInput: React.FC<{ 
    label: string; 
    value: string; 
    onChange: (val: string) => void; 
    unit?: string;
    step?: string;
}> = ({ label, value, onChange, unit = 'cm', step = '0.1' }) => (
    <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">{label}</label>
        <div className="flex items-center gap-2 bg-surface-bg border border-surface-border rounded-input px-3 py-2 focus-within:border-brand-accent transition-colors">
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

const MeasurementModal: React.FC<MeasurementModalProps> = ({ controller }) => {
    const { state, actions } = controller;

    return (
        <Modal onClose={actions.closeModal} className="max-w-md !p-0 overflow-hidden border border-surface-border rounded-[2rem]">
            <div className="p-6 max-h-[90vh] overflow-y-auto relative hide-scrollbar">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xs font-black text-text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-brand-accent"></div>
                        Registro Corporal
                    </h2>
                    <button onClick={actions.closeModal} className="p-2 bg-surface-hover hover:bg-surface-border rounded-xl transition-colors active:scale-95">
                        <XIcon className="w-5 h-5 text-text-secondary hover:text-text-primary" />
                    </button>
                </div>

                <div className="space-y-8">
                    <div className="space-y-6">
                        <div className="bg-surface-hover/20 p-5 rounded-2xl border border-surface-border shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-brand-accent/10 flex items-center justify-center">
                                    <ScaleIcon className="w-4 h-4 text-brand-accent" />
                                </div>
                                <h3 className="text-xs font-bold text-text-primary uppercase tracking-widest">Peso Corporal</h3>
                            </div>
                            <MeasurementInput label="Peso Actual" value={state.form.weight} onChange={(value) => actions.updateField('weight', value)} unit="kg" />
                        </div>

                        <div className="bg-surface-hover/20 p-5 rounded-2xl border border-surface-border shadow-sm">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-8 h-8 rounded-lg bg-brand-carbs/10 flex items-center justify-center">
                                    <RulerHorizontalIcon className="w-4 h-4 text-brand-carbs" />
                                </div>
                                <h3 className="text-xs font-bold text-text-primary uppercase tracking-widest">Medidas Clave</h3>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                                <MeasurementInput label="Cintura" value={state.form.waist} onChange={(value) => actions.updateField('waist', value)} />
                                <MeasurementInput label="Caderas" value={state.form.hips} onChange={(value) => actions.updateField('hips', value)} />
                                <MeasurementInput label="Pecho" value={state.form.chest} onChange={(value) => actions.updateField('chest', value)} />
                                <MeasurementInput label="Hombros" value={state.form.shoulders} onChange={(value) => actions.updateField('shoulders', value)} />
                                <MeasurementInput label="Muslo" value={state.form.thigh} onChange={(value) => actions.updateField('thigh', value)} />
                                <MeasurementInput label="Biceps" value={state.form.biceps} onChange={(value) => actions.updateField('biceps', value)} />
                                <MeasurementInput label="Cuello" value={state.form.neck} onChange={(value) => actions.updateField('neck', value)} />
                            </div>
                        </div>

                        <div className="bg-surface-hover/20 p-5 rounded-2xl border border-surface-border shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-brand-fat/10 flex items-center justify-center">
                                    <CameraIcon className="w-4 h-4 text-brand-fat" />
                                </div>
                                <h3 className="text-xs font-bold text-text-primary uppercase tracking-widest">Foto de Progreso</h3>
                            </div>
                            
                            <label className="relative w-full aspect-video rounded-xl overflow-hidden group border-2 border-dashed border-surface-border hover:border-brand-fat/50 transition-all active:scale-[0.98] flex flex-col items-center justify-center cursor-pointer bg-surface-bg">
                                {state.photoUrl ? (
                                    <>
                                        <img src={state.photoUrl} alt="Progreso" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <span className="text-xs font-bold text-text-primary uppercase tracking-widest">Cambiar Foto</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-10 h-10 rounded-xl bg-surface-hover border border-surface-border flex items-center justify-center mb-2 group-hover:bg-brand-fat/10 group-hover:border-brand-fat/30 transition-all shadow-sm">
                                            <CameraIcon className="w-5 h-5 text-brand-fat" />
                                        </div>
                                        <span className="text-[10px] font-bold text-text-secondary group-hover:text-text-primary uppercase tracking-widest transition-colors">Anadir Foto</span>
                                    </>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(event) => actions.uploadPhoto(event.target.files?.[0] ?? null)}
                                />
                            </label>
                        </div>
                    </div>

                    <div className="mt-10 mb-2">
                        <Button onClick={actions.saveEntry} className="w-full py-4 font-black tracking-[0.2em] text-[10px] rounded-2xl shadow-xl" variant="high-contrast">
                            Guardar Registro
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default MeasurementModal;
