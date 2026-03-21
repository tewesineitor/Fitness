import React from 'react';
import Card from '../../../components/Card';
import Tag from '../../../components/Tag';
import { BarcodeIcon, CameraIcon, SparklesIcon } from '../../../components/icons';
import type { ProcessingState } from './addFoodTypes';

interface AddFoodProcessingOverlayProps {
  barcodeState: ProcessingState;
  imageProcessing: boolean;
  imagePreviewUrl: string | null;
}

const AddFoodProcessingOverlay: React.FC<AddFoodProcessingOverlayProps> = ({
  barcodeState,
  imageProcessing,
  imagePreviewUrl,
}) => {
  if (!barcodeState && !imageProcessing) return null;

  const isBarcodeFlow = Boolean(barcodeState);
  const title = isBarcodeFlow
    ? barcodeState === 'fetching'
      ? 'Buscando producto'
      : 'Interpretando empaque'
    : 'Analizando imagen';
  const caption = isBarcodeFlow
    ? barcodeState === 'fetching'
      ? 'Consultando la base de datos antes de abrir el editor.'
      : 'Procesando la informacion del producto para convertirla en alimento editable.'
    : 'La IA esta leyendo los datos del empaque para abrir el editor con una base funcional.';
  const statusTone = isBarcodeFlow ? 'accent' : 'protein';

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 px-6 py-8 backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.1),transparent_42%)]" />

      <Card variant="glass" className="relative w-full max-w-sm overflow-hidden p-6 text-center">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-brand-accent/15 via-brand-protein/10 to-transparent" />

        <div className="relative z-10">
          <Tag variant="overlay" tone={statusTone} size="sm" className="mx-auto">
            {isBarcodeFlow ? 'Barcode pipeline' : 'Image pipeline'}
          </Tag>

          <div className="relative mx-auto mt-5 flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/5">
            <div className="absolute inset-0 rounded-full border-4 border-surface-border/60 border-t-brand-accent animate-spin" />
            {isBarcodeFlow ? (
              <BarcodeIcon className="h-8 w-8 text-brand-accent" />
            ) : (
              <CameraIcon className="h-8 w-8 text-brand-protein" />
            )}
          </div>

          {imagePreviewUrl ? (
            <div className="relative mx-auto mt-6 h-44 w-44 overflow-hidden rounded-[1.75rem] border border-surface-border/80 bg-surface-bg shadow-xl">
              <img src={imagePreviewUrl} alt="Preview" className="h-full w-full object-cover opacity-60" />
              <div className="absolute inset-x-3 top-1/2 h-0.5 -translate-y-1/2 bg-brand-accent shadow-[0_0_20px_rgba(var(--color-brand-accent-rgb),0.9)] animate-scan" />
            </div>
          ) : null}

          <h3 className="mt-6 text-xl font-black uppercase tracking-[-0.05em] text-white">{title}</h3>
          <p className="mt-3 text-sm font-medium leading-relaxed text-white/75">{caption}</p>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-white/70">
            <SparklesIcon className="h-3.5 w-3.5" />
            Nutrition intake in progress
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AddFoodProcessingOverlay;
