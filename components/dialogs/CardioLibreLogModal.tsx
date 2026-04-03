import React, { useMemo, useRef, useState } from 'react';
import * as aiService from '../../services/aiService';
import type { DesgloseCardioLibre } from '../../types';
import { vibrate } from '../../utils/helpers';

// ── UI Premium ──────────────────────────────────────────────────────────────
import PremiumModal from '../ui-premium/PremiumModal';
import PremiumInput from '../ui-premium/PremiumInput';
import PremiumButton from '../ui-premium/PremiumButton';
import SquishyCard from '../ui-premium/SquishyCard';
import { EyebrowText, GiantValue } from '../ui-premium/Typography';
import { SparklesIcon } from '../icons';

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

    // ── Presentational text map based on target activity ────────────────────
    const eyebrowText =
        activityType === 'run' ? 'Actividad de Velocidad' :
        activityType === 'hike' ? 'Actividad de Montaña' :
        'Actividad de Carga';

    const modalTitle =
        activityType === 'run' ? 'Registrar Carrera' :
        activityType === 'hike' ? 'Registrar Senderismo' :
        'Registrar Rucking';

    const primaryLabel =
        activityType === 'run' ? 'GUARDAR CARRERA' :
        activityType === 'hike' ? 'GUARDAR SENDERISMO' :
        'GUARDAR RUCKING';

    // ── Pace calculation ──────────────────────────────────────────────────
    const paceParts = useMemo(() => {
        const dist = parseFloat(distance);
        const dur = parseInt(duration);
        if (dist > 0 && dur > 0) {
            const paceDecimal = dur / dist;
            const paceMinutes = Math.floor(paceDecimal);
            const paceSeconds = Math.round((paceDecimal - paceMinutes) * 60);
            return { min: paceMinutes, sec: paceSeconds.toString().padStart(2, '0') };
        }
        return { min: 0, sec: '00' };
    }, [distance, duration]);

    // ── Handlers ────────────────────────────────────────────────────────────
    const handleSave = () => {
        vibrate(10);
        onSave({
            distance: parseFloat(distance) || 0,
            duration: parseInt(duration) || 0,
            pace: `${paceParts.min}'${paceParts.sec}"`,
            calories: parseInt(calories) || 0,
            heartRate: parseInt(heartRate) || 0,
            elevation: parseInt(elevation) || 0,
            weightCarried: activityType === 'rucking' ? parseFloat(weightCarried) || 0 : undefined,
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
                    if (!base64ImageString) throw new Error('Could not read image file.');

                    const result =
                        activityType === 'run' ? await aiService.extractRunDataFromImage(base64ImageString, file.type) :
                        activityType === 'hike' ? await aiService.extractHikeDataFromImage(base64ImageString, file.type) :
                        await aiService.extractRuckingDataFromImage(base64ImageString, file.type);

                    if (result.success === false) {
                        setError(result.error);
                    } else {
                        const { data } = result;
                        if (data.distance_km !== null) setDistance(data.distance_km.toString());
                        if (data.duration_min !== null) setDuration(Math.round(data.duration_min).toString());
                        if (data.calories_kcal !== null) setCalories(data.calories_kcal.toString());
                        if (data.avg_heart_rate_ppm !== null) setHeartRate(data.avg_heart_rate_ppm.toString());
                        if (data.elevation_gain_m !== null) setElevation(data.elevation_gain_m.toString());
                        if (data.weight_carried_kg !== null && data.weight_carried_kg !== undefined) {
                            setWeightCarried(data.weight_carried_kg.toString());
                        }
                    }
                } catch {
                    setError('Ocurrió un error al procesar la imagen.');
                } finally {
                    setIsProcessing(false);
                }
            };
            reader.onerror = () => {
                setError('Error al leer el archivo de imagen.');
                setIsProcessing(false);
            };
            reader.readAsDataURL(file);
        } catch {
            setError('Ocurrió un error inesperado.');
            setIsProcessing(false);
        } finally {
            if (event.target) event.target.value = '';
        }
    };

    return (
        <PremiumModal
            onClose={onClose}
            onPrimary={handleSave}
            eyebrow={eyebrowText}
            title={modalTitle}
            primaryLabel={isProcessing ? 'PROCESANDO...' : primaryLabel}
        >
            <input type="file" ref={imageInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />

            {/* Error Message */}
            {error && (
                <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-400">
                    {error}
                </div>
            )}

            {/* AI Summary CTA */}
            <PremiumButton
                variant="ghost"
                size="sm"
                leftIcon={<SparklesIcon className="w-4 h-4" />}
                className="w-full border border-cyan-400/20 text-cyan-400"
                onPress={handleImageInputClick}
                disabled={isProcessing}
            >
                {isProcessing ? 'Analizando imagen con IA...' : 'Leer resumen con IA'}
            </PremiumButton>

            {/* Core Metrics */}
            <div className="grid grid-cols-2 gap-4">
                <PremiumInput
                    label="Distancia"
                    type="number"
                    placeholder="0.0"
                    rightElement="km"
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    disabled={isProcessing}
                />
                <PremiumInput
                    label="Duración"
                    type="number"
                    placeholder="0"
                    rightElement="min"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    disabled={isProcessing}
                />
            </div>

            {/* Pace HUD Widget */}
            <SquishyCard padding="md" className="flex flex-col items-center justify-center text-center gap-2 bg-zinc-800/30">
                <EyebrowText>RITMO PROMEDIO</EyebrowText>
                <GiantValue>
                    {paceParts.min}&apos;{paceParts.sec}&quot;<span className="text-xl text-zinc-500">/km</span>
                </GiantValue>
            </SquishyCard>

            {/* Secondary Metrics */}
            <div className={`grid gap-4 ${activityType === 'rucking' ? 'grid-cols-2' : 'grid-cols-3'}`}>
                <PremiumInput
                    label="Kcal"
                    type="number"
                    placeholder="0"
                    rightElement="kcal"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    disabled={isProcessing}
                />
                <PremiumInput
                    label="PPM máx."
                    type="number"
                    placeholder="0"
                    rightElement="ppm"
                    value={heartRate}
                    onChange={(e) => setHeartRate(e.target.value)}
                    disabled={isProcessing}
                />
                {activityType !== 'rucking' && (
                    <PremiumInput
                        label="Elevación"
                        type="number"
                        placeholder="0"
                        rightElement="m"
                        value={elevation}
                        onChange={(e) => setElevation(e.target.value)}
                        disabled={isProcessing}
                    />
                )}
            </div>

            {/* Rucking specific fields */}
            {activityType === 'rucking' && (
                <div className="grid grid-cols-2 gap-4">
                    <PremiumInput
                        label="Elevación"
                        type="number"
                        placeholder="0"
                        rightElement="m"
                        value={elevation}
                        onChange={(e) => setElevation(e.target.value)}
                        disabled={isProcessing}
                    />
                    <PremiumInput
                        label="Peso carga"
                        type="number"
                        placeholder="0.0"
                        rightElement="kg"
                        value={weightCarried}
                        onChange={(e) => setWeightCarried(e.target.value)}
                        disabled={isProcessing}
                    />
                </div>
            )}

            {/* Notes */}
            <PremiumInput
                label="Notas"
                multiline
                rows={3}
                placeholder="Sensaciones, clima, ruta..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={isProcessing}
            />
        </PremiumModal>
    );
};

export default CardioLibreLogModal;
