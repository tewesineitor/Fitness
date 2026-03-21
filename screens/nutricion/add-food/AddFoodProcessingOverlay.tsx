import React from 'react';
import { SparklesIcon } from '../../../components/icons';
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

  if (barcodeState) {
    const message = barcodeState === 'fetching'
      ? 'Buscando en la base de datos...'
      : 'Analizando informacion con IA...';

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex flex-col justify-center items-center z-[200] animate-scale-in">
        <div className="relative mb-6">
          <div className="w-16 h-16 border-4 border-t-brand-accent border-surface-border rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <SparklesIcon className="w-6 h-6 text-brand-accent animate-pulse" />
          </div>
        </div>
        <p className="font-black text-white text-lg tracking-tight uppercase px-4 text-center">{message}</p>
        <p className="text-text-secondary text-[10px] uppercase tracking-widest mt-2">
          {barcodeState === 'fetching' ? 'Conectando...' : 'Procesando vision...'}
        </p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex flex-col justify-center items-center z-[100] animate-fade-in-up">
      {imagePreviewUrl ? (
        <div className="relative w-64 h-64 mb-6 rounded-2xl overflow-hidden border border-surface-border shadow-lg">
          <img src={imagePreviewUrl} alt="Processing" className="w-full h-full object-cover opacity-50" />
          <div className="absolute inset-0 border-2 border-brand-accent/30 rounded-2xl"></div>
          <div className="absolute left-0 right-0 h-0.5 bg-brand-accent shadow-[0_0_15px_rgba(var(--color-brand-accent-rgb),1)] animate-scan-vertical"></div>
        </div>
      ) : (
        <div className="relative mb-6">
          <div className="w-16 h-16 border-4 border-t-brand-accent border-surface-border rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <SparklesIcon className="w-6 h-6 text-brand-accent animate-pulse" />
          </div>
        </div>
      )}
      <p className="font-bold text-white text-lg tracking-tight uppercase">Analizando Imagen</p>
      <p className="text-white/60 text-xs mt-2 font-mono">La IA esta leyendo los datos nutricionales...</p>
    </div>
  );
};

export default AddFoodProcessingOverlay;

