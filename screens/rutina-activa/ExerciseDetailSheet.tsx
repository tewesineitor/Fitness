import React from 'react';
import type { Exercise } from '../../types';
import { PremiumModal } from '../../components/ui-premium';

interface ExerciseDetailSheetProps {
  exercise: Exercise;
  onClose: () => void;
}

const FormattedDescription: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex flex-col gap-6">
    {text.split(/(\*\*.*?\*\*)/g).map((part, index) =>
      part.startsWith('**') ? (
        <p
          key={index}
          className="text-[10px] font-black uppercase tracking-widest text-emerald-400"
        >
          {part.slice(2, -2)}
        </p>
      ) : part.trim() ? (
        <p key={index} className="text-lg font-medium leading-relaxed text-zinc-300">
          {part.trim()}
        </p>
      ) : null
    )}
  </div>
);

const headerMediaPlaceholder = (
  <div className="w-full h-full bg-zinc-950 flex items-center justify-center text-zinc-600 font-bold tracking-widest uppercase">
    Imagen del ejercicio
  </div>
);

const ExerciseDetailSheet: React.FC<ExerciseDetailSheetProps> = ({ exercise, onClose }) => (
  <PremiumModal
    onClose={onClose}
    eyebrow="Técnica"
    title={exercise.name}
    headerMedia={headerMediaPlaceholder}
    primaryLabel="Volver al entrenamiento"
    onPrimary={onClose}
  >
    <FormattedDescription text={exercise.description} />
  </PremiumModal>
);

export default ExerciseDetailSheet;
