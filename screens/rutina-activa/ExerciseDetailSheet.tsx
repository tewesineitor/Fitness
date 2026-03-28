import React from 'react';
import type { Exercise } from '../../types';
import ExerciseImage from '../../components/ExerciseImage';
import { XIcon } from '../../components/icons';
import { vibrate } from '../../utils/helpers';

interface ExerciseDetailSheetProps {
  exercise: Exercise;
  onClose: () => void;
}

const FormattedDescription: React.FC<{ text: string }> = ({ text }) => (
  <div className="whitespace-pre-wrap text-sm font-medium leading-relaxed text-zinc-300">
    {text.split(/(\*\*.*?\*\*)/g).map((part, index) =>
      part.startsWith('**') ? (
        <strong key={index} className="mb-2 mt-6 block text-[10px] font-black uppercase tracking-[0.22em] text-white">
          {part.slice(2, -2)}
        </strong>
      ) : (
        <span key={index}>{part}</span>
      )
    )}
  </div>
);

const ExerciseDetailSheet: React.FC<ExerciseDetailSheetProps> = ({ exercise, onClose }) => (
  <div className="fixed inset-0 z-[200] bg-zinc-950/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6 animate-fade-in">

    {/* Inner card */}
    <div className="w-full max-w-2xl bg-zinc-900/80 border border-zinc-800/50 rounded-[2.5rem] p-8 flex flex-col gap-6 shadow-2xl max-h-[90dvh] overflow-y-auto hide-scrollbar animate-slide-in-up">

      {/* Header row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span
            className="text-[9px] font-black uppercase text-emerald-400"
            style={{ letterSpacing: 'var(--letter-spacing-caps)' }}
          >
            Técnica
          </span>
          <h2 className="font-heading text-2xl font-black text-white leading-tight tracking-tight">
            {exercise.name}
          </h2>
        </div>

        {/* Close button */}
        <button
          onClick={() => { vibrate(5); onClose(); }}
          className="w-10 h-10 rounded-full bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center flex-shrink-0 active:scale-90 transition-all duration-100 select-none"
        >
          <XIcon className="w-4 h-4 text-zinc-400" />
        </button>
      </div>

      {/* Image placeholder / ExerciseImage */}
      <div className="w-full aspect-video bg-zinc-950 rounded-3xl border border-zinc-800/50 overflow-hidden flex items-center justify-center">
        <ExerciseImage exercise={exercise} className="h-full w-full object-cover" />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-3">
        <span
          className="text-[9px] font-black uppercase text-zinc-400"
          style={{ letterSpacing: 'var(--letter-spacing-caps)' }}
        >
          Guía de ejecución
        </span>
        <FormattedDescription text={exercise.description} />
      </div>

      {/* Close FAB */}
      <button
        onClick={() => { vibrate(10); onClose(); }}
        className="bg-emerald-400 text-zinc-950 font-black text-sm uppercase rounded-full py-5 w-full shadow-glow active:scale-[0.97] transition-all duration-150 select-none mt-2"
        style={{ letterSpacing: 'var(--letter-spacing-caps)' }}
      >
        Volver al entrenamiento
      </button>

    </div>
  </div>
);

export default ExerciseDetailSheet;
