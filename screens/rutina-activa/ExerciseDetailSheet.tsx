import React from 'react';
import type { Exercise } from '../../types';
import { PremiumModal } from '../../components/ui-premium';

interface ExerciseDetailSheetProps {
  exercise: Exercise;
  onClose: () => void;
}

const renderTextBlock = (block: string, key: number) => {
  const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
  const isNumbered = lines.every((l) => /^\d+\./.test(l));
  const isBulleted = lines.every((l) => /^[-•*]/.test(l));

  if (isNumbered || isBulleted) {
    return (
      <ol key={key} className="flex flex-col gap-4 mt-2">
        {lines.map((line, i) => {
          const marker = isNumbered
            ? line.match(/^(\d+)\./)?.[1] ?? String(i + 1)
            : '·';
          const content = isNumbered
            ? line.replace(/^\d+\.\s*/, '')
            : line.replace(/^[-•*]\s*/, '');
          return (
            <li key={i} className="flex items-start gap-3">
              <span className="text-emerald-400 font-black text-xl leading-snug w-6 flex-shrink-0 text-right">
                {marker}
              </span>
              <span className="text-lg text-zinc-300 leading-relaxed">{content}</span>
            </li>
          );
        })}
      </ol>
    );
  }

  return (
    <p key={key} className="text-lg text-zinc-300 mb-4 leading-relaxed whitespace-pre-wrap">
      {block.trim()}
    </p>
  );
};

const FormattedDescription: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex flex-col">
    {text.split(/(\*\*.*?\*\*)/g).map((part, index) =>
      part.startsWith('**') ? (
        <p key={index} className="text-2xl font-black text-emerald-400 uppercase mt-6 mb-2">
          {part.slice(2, -2)}
        </p>
      ) : part.trim() ? (
        renderTextBlock(part, index)
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
