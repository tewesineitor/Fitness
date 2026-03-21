import React, { useMemo, useRef, useState } from 'react';
import * as aiService from '../../services/aiService';
import type { DesgloseCardioLibre } from '../../types';
import Button from '../Button';
import DialogSectionCard from '../DialogSectionCard';
import IconButton from '../IconButton';
import Input from '../Input';
import Modal from '../Modal';
import Tag from '../Tag';
import Textarea from '../Textarea';
import { CameraIcon, SparklesIcon, XIcon } from '../icons';
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

  const modalTitle =
    activityType === 'run' ? 'Registrar carrera' : activityType === 'hike' ? 'Registrar senderismo' : 'Registrar rucking';
  const saveButtonText = activityType === 'run' ? 'Guardar carrera' : activityType === 'hike' ? 'Guardar senderismo' : 'Guardar rucking';

  const pace = useMemo(() => {
    const dist = parseFloat(distance);
    const dur = parseInt(duration);
    if (dist > 0 && dur > 0) {
      const paceDecimal = dur / dist;
      const paceMinutes = Math.floor(paceDecimal);
      const paceSeconds = Math.round((paceDecimal - paceMinutes) * 60);
      return `${paceMinutes}'${paceSeconds.toString().padStart(2, '0')}"`;
    }
    return `0'00"`;
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
          if (!base64ImageString) {
            throw new Error('Could not read image file.');
          }

          const result =
            activityType === 'run'
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
        } catch {
          setError('Ocurrio un error al procesar la imagen.');
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
      setError('Ocurrio un error inesperado.');
      setIsProcessing(false);
    } finally {
      if (event.target) event.target.value = '';
    }
  };

  return (
    <Modal onClose={onClose} className="max-w-2xl overflow-hidden !p-0">
      <div className="relative overflow-hidden p-6">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-r from-brand-accent/10 via-transparent to-brand-protein/10" />

        {isProcessing ? (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-surface-bg/90 backdrop-blur-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-brand-accent/20 bg-brand-accent/8 text-brand-accent">
              <SparklesIcon className="h-5 w-5 animate-pulse" />
            </div>
            <p className="mt-4 text-[10px] font-black uppercase tracking-[0.22em] text-brand-accent">Analizando datos</p>
          </div>
        ) : null}

        <div className={`relative z-10 ${isProcessing ? 'pointer-events-none opacity-20' : ''}`}>
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <Tag variant="status" tone="accent" size="sm">
                Cardio Log
              </Tag>
              <h2 className="mt-3 text-xl font-black uppercase tracking-[-0.04em] text-text-primary">{modalTitle}</h2>
            </div>
            <IconButton onClick={() => { vibrate(5); onClose(); }} icon={XIcon} label="Cerrar" variant="secondary" size="small" />
          </div>

          <input type="file" ref={imageInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />

          <div className="space-y-4">
            <DialogSectionCard className="space-y-4 p-5">
              <Button variant="secondary" size="large" onClick={handleImageInputClick} icon={CameraIcon} className="w-full">
                Leer resumen con IA
              </Button>

              {error ? (
                <div className="rounded-[1rem] border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
                  {error}
                </div>
              ) : null}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input id="free-cardio-distance" type="number" step="0.01" value={distance} onChange={(event) => setDistance(event.target.value)} label="Distancia (km)" placeholder="0.00" className="font-mono" />
                <Input id="free-cardio-duration" type="number" step="1" value={duration} onChange={(event) => setDuration(event.target.value)} label="Duracion (min)" placeholder="0" className="font-mono" />
              </div>

              <div className="rounded-[1.25rem] border border-brand-accent/20 bg-brand-accent/6 px-4 py-4 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-accent">Ritmo promedio</p>
                <p className="mt-2 text-3xl font-black tracking-[-0.05em] text-text-primary">{pace} <span className="text-sm text-text-secondary">/km</span></p>
              </div>
            </DialogSectionCard>

            <DialogSectionCard className="space-y-4 p-5">
              <div className={`grid gap-4 ${activityType === 'rucking' ? 'grid-cols-2' : 'grid-cols-3'}`}>
                <Input id="free-cardio-calories" type="number" value={calories} onChange={(event) => setCalories(event.target.value)} label="Kcal" placeholder="0" className="font-mono" />
                <Input id="free-cardio-heart-rate" type="number" value={heartRate} onChange={(event) => setHeartRate(event.target.value)} label="PPM" placeholder="0" className="font-mono" />
                {activityType !== 'rucking' ? (
                  <Input id="free-cardio-elevation" type="number" value={elevation} onChange={(event) => setElevation(event.target.value)} label="Elevacion (m)" placeholder="0" className="font-mono" />
                ) : null}
              </div>

              {activityType === 'rucking' ? (
                <div className="grid grid-cols-2 gap-4">
                  <Input id="free-cardio-elevation-ruck" type="number" value={elevation} onChange={(event) => setElevation(event.target.value)} label="Elevacion (m)" placeholder="0" className="font-mono" />
                  <Input id="free-cardio-weight" type="number" step="0.1" value={weightCarried} onChange={(event) => setWeightCarried(event.target.value)} label="Peso (kg)" placeholder="0.0" className="font-mono" />
                </div>
              ) : null}

              <Textarea id="free-cardio-notes" value={notes} onChange={(event) => setNotes(event.target.value)} label="Notas" placeholder="Sensaciones, clima, ruta..." rows={3} />
            </DialogSectionCard>

            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => { vibrate(5); onClose(); }} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleSave} className="flex-1" size="large" variant="high-contrast">
                {saveButtonText}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CardioLibreLogModal;
