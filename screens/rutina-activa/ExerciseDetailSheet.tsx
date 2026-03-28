import React from 'react';
import type { Exercise } from '../../types';
import { PremiumModal } from '../../components/ui-premium';

interface ExerciseDetailSheetProps {
  exercise: Exercise;
  onClose: () => void;
}

const FormattedDescription: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex flex-col">
    {text.split(/(\*\*.*?\*\*)/g).map((part, index) =>
      part.startsWith('**') ? (
        <p
          key={index}
          className="text-2xl font-black text-emerald-400 uppercase mt-6 mb-2"
        >
          {part.slice(2, -2)}
        </p>
      ) : part.trim() ? (
        <p key={index} className="text-lg text-zinc-300 mb-4 leading-relaxed">
          {part.trim()}
        </p>
      ) : null
    )}
  </div>
);

const headerMediaPlaceholder = (
  <div className="w-full h-full bg-zinc-950 flex items-center justify-center text-zinc-600 font-black tracking-widest uppercase">
    Espacio para imagen/video
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
