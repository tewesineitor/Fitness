import React, { useState, useMemo, useRef } from 'react';
import Modal from '../Modal';
import Button from '../Button';
import { DesgloseCardioLibre } from '../../types';
import { CameraIcon, XIcon } from '../icons';
import * as aiService from '../../services/aiService';
import { vibrate } from '../../utils/helpers';

interface CardioLibreLogModalProps {
    activityType: 'run' | 'hike' | 'rucking';
    onSave: (log: DesgloseCardioLibre) => void;
    onClose: () => void;
}

const CardioLibreLogModal: React.FC<CardioLibreLogModalProps> = ({ activityType, onSave, onClose }) => {
    const [distance, setDistance] = useState('');
    const [duration, setDuration] = useState('');
    const [calories, setCalories] = useState('');
    const [heartRate, setHeartRate] = useState('');
    const [elevation, setElevation] = useState('');
    const [weightCarried, setWeightCarried] = useState('');
    const [notes, setNotes] = useState('');

    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const modalTitle = activityType === 'run' ? "REGISTRAR CARRERA" : activityType === 'hike' ? "REGISTRAR SENDERISMO" : "REGISTRAR RUCKING";
    const saveButtonText = activityType === 'run' ? "Guardar Carrera" : activityType === 'hike' ? "Guardar Senderismo" : "Guardar Rucking";

    const pace = useMemo(() => {
        const dist = parseFloat(distance);
        const dur = parseInt(duration);
        if (dist > 0 && dur > 0) {
            const paceDecimal = dur / dist;
            const paceMinutes = Math.floor(paceDecimal);
            const paceSeconds = Math.round((paceDecimal - paceMinutes) * 60);
            return `${paceMinutes}'${paceSeconds.toString().padStart(2, '0')}"`;
        }
        return "0'00\"";
    }, [distance, duration]);

    const handleSave = () => {
        vibrate(10);
        onSave({
            distance: parseFloat(distance) || 0,
            duration: parseInt(duration) || 0,
            pace,
            calories: parseInt(calories) || 0,
            heartRate: parseInt(heartRate) || 0,
            elevation: parseInt(elevation) || 0,
            weightCarried: activityType === 'rucking' ? (parseFloat(weightCarried) || 0) : undefined,
            notes,
        });
    };

    const handleImageInputClick = () => {
        setError(null);
        imageInputRef.current?.click();
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsProcessing(true);
        setError(null);

        try {
            const reader = new FileReader();
            reader.onloadend = async () => {
                try {
                    const base64ImageString = (reader.result as string)?.split(',')[1];
                    if (!base64ImageString) {
                        throw new Error("Could not read image file.");
                    }

                    const result = activityType === 'run' 
                        ? await aiService.extractRunDataFromImage(base64ImageString, file.type)
                        : activityType === 'hike' 
                            ? await aiService.extractHikeDataFromImage(base64ImageString, file.type)
                            : await aiService.extractRuckingDataFromImage(base64ImageString, file.type);
                    
                    if (result.success === false) {
                        setError(result.error);
                    } else {
                        const { data } = result;
                        if (data.distance_km !== null) setDistance(data.distance_km.toString());
                        if (data.duration_min !== null) setDuration(Math.round(data.duration_min).toString());
                        if (data.calories_kcal !== null) setCalories(data.calories_kcal.toString());
                        if (data.avg_heart_rate_ppm !== null) setHeartRate(data.avg_heart_rate_ppm.toString());
                        if (data.elevation_gain_m !== null) setElevation(data.elevation_gain_m.toString());
                        if (data.weight_carried_kg !== null && data.weight_carried_kg !== undefined) setWeightCarried(data.weight_carried_kg.toString());
                    }
                } catch (err) {
                     console.error(err);
                     setError("Ocurrió un error al procesar la imagen.");
                } finally {
                     setIsProcessing(false);
                }
            };
            reader.onerror = () => {
                setError("Error al leer el archivo de imagen.");
                setIsProcessing(false);
            }
            reader.readAsDataURL(file);
        } catch (err) {
            console.error(err);
            setError("Ocurrió un error inesperado.");
            setIsProcessing(false);
        } finally {
            if (event.target) {
                event.target.value = '';
            }
        }
    };
    
    // Giant Input Class - Clean Utility
    const giantInputClass = "w-full bg-transparent border-b-2 border-surface-border focus:border-brand-accent outline-none text-center text-5xl font-heading font-black text-text-primary placeholder:text-text-secondary/30 py-4 transition-all";
    const labelClass = "block text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] text-center mb-2";
    const secondaryInputClass = "w-full bg-surface-hover/50 border border-surface-border rounded-xl p-3.5 text-center font-bold text-text-primary focus:border-brand-accent focus:bg-surface-bg outline-none transition-all shadow-sm";

    return (
        <Modal onClose={onClose} className="max-w-md !p-0 overflow-hidden border border-surface-border rounded-[2rem]">
            <div className="p-6 max-h-[90vh] overflow-y-auto relative hide-scrollbar">
                 {isProcessing && (
                     <div className="absolute inset-0 bg-surface-bg/90 backdrop-blur-sm flex flex-col justify-center items-center rounded-xl z-20">
                         <div className="w-10 h-10 border-2 border-t-brand-accent border-surface-border rounded-full animate-spin"></div>
                         <p className="mt-4 font-bold text-brand-accent uppercase tracking-widest text-xs">Analizando Datos...</p>
                     </div>
                 )}
                 <div className={isProcessing ? 'opacity-20 pointer-events-none' : ''}>
                     <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xs font-black text-text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-brand-accent"></div>
                            {modalTitle}
                        </h2>
                        <button onClick={() => { vibrate(5); onClose(); }} className="p-2 bg-surface-hover hover:bg-surface-border rounded-xl transition-colors active:scale-95"><XIcon className="w-5 h-5 text-text-secondary hover:text-text-primary"/></button>
                     </div>
                     
                     <input type="file" ref={imageInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                     <div className="mb-8">
                         <Button variant="secondary" onClick={handleImageInputClick} icon={CameraIcon} className="w-full border-dashed border-surface-border bg-surface-hover/30 hover:bg-surface-hover text-text-secondary hover:text-text-primary py-4 rounded-xl">
                             Subir Resumen con IA
                         </Button>
                     </div>
                     
                     {error && <p className="text-destructive text-xs text-center mb-6 bg-destructive/10 p-3 rounded-xl border border-destructive/20">{error}</p>}

                     <div className="space-y-8">
                         {/* Primary Metrics - Giant Inputs */}
                         <div className="grid grid-cols-2 gap-6 bg-surface-bg p-6 rounded-3xl border border-surface-border shadow-sm">
                             <div>
                                 <label htmlFor="distance" className={labelClass}>Distancia (km)</label>
                                 <input id="distance" type="number" step="0.01" value={distance} onChange={(e) => setDistance(e.target.value)} placeholder="0.00" className={giantInputClass} />
                             </div>
                             <div>
                                 <label htmlFor="duration" className={labelClass}>Duración (min)</label>
                                 <input id="duration" type="number" step="1" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="0" className={giantInputClass} />
                             </div>
                         </div>
                         
                         {/* Calculated Pace */}
                         <div className="text-center py-4 bg-surface-hover/30 rounded-2xl border border-surface-border/50">
                             <p className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] mb-1">Ritmo Promedio</p>
                             <p className="text-3xl font-heading font-black text-brand-accent tracking-tighter">{pace} <span className="text-sm font-bold text-text-secondary tracking-normal">/km</span></p>
                         </div>

                         {/* Secondary Metrics */}
                         <div className={`grid ${activityType === 'rucking' ? 'grid-cols-2' : 'grid-cols-3'} gap-4`}>
                             <div>
                                 <label htmlFor="calories" className={labelClass}>Kcal</label>
                                 <input id="calories" type="number" value={calories} onChange={(e) => setCalories(e.target.value)} placeholder="0" className={secondaryInputClass} />
                             </div>
                             <div>
                                 <label htmlFor="heartRate" className={labelClass}>PPM</label>
                                 <input id="heartRate" type="number" value={heartRate} onChange={(e) => setHeartRate(e.target.value)} placeholder="0" className={secondaryInputClass} />
                             </div>
                             {activityType !== 'rucking' && (
                                 <div>
                                     <label htmlFor="elevation" className={labelClass}>Elev. (m)</label>
                                     <input id="elevation" type="number" value={elevation} onChange={(e) => setElevation(e.target.value)} placeholder="0" className={secondaryInputClass} />
                                 </div>
                             )}
                         </div>

                         {activityType === 'rucking' && (
                             <div className="grid grid-cols-2 gap-4">
                                 <div>
                                     <label htmlFor="elevation" className={labelClass}>Elevación (m)</label>
                                     <input id="elevation" type="number" value={elevation} onChange={(e) => setElevation(e.target.value)} placeholder="0" className={secondaryInputClass} />
                                 </div>
                                 <div>
                                     <label htmlFor="weightCarried" className={labelClass}>Peso (kg)</label>
                                     <input id="weightCarried" type="number" step="0.1" value={weightCarried} onChange={(e) => setWeightCarried(e.target.value)} placeholder="0.0" className={secondaryInputClass} />
                                 </div>
                             </div>
                         )}

                         {/* Notes */}
                         <div>
                             <label htmlFor="notes" className={labelClass}>Notas</label>
                             <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Sensaciones, clima, ruta..." rows={3} className="w-full p-4 bg-surface-hover/50 border border-surface-border rounded-2xl focus:border-brand-accent focus:bg-surface-bg outline-none text-sm font-medium text-text-primary placeholder:text-text-secondary/50 transition-all resize-none shadow-sm" />
                         </div>
                     </div>
                     <div className="mt-10 mb-2">
                         <Button onClick={handleSave} className="w-full py-4 font-black tracking-[0.2em] text-[10px] rounded-2xl shadow-xl" variant="high-contrast">{saveButtonText}</Button>
                     </div>
                 </div>
            </div>
        </Modal>
    );
};

export default CardioLibreLogModal;