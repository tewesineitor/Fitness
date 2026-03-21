import React from 'react';
import type { Exercise } from '../../types';
import Button from '../../components/Button';
import DialogSectionCard from '../../components/DialogSectionCard';
import IconButton from '../../components/IconButton';
import Tag from '../../components/Tag';
import ExerciseImage from '../../components/ExerciseImage';
import { XIcon } from '../../components/icons';

interface ExerciseDetailSheetProps {
  exercise: Exercise;
  onClose: () => void;
}

const FormattedDescription: React.FC<{ text: string }> = ({ text }) => (
  <div className="whitespace-pre-wrap text-sm font-medium leading-relaxed text-text-secondary">
    {text.split(/(\*\*.*?\*\*)/g).map((part, index) =>
      part.startsWith('**') ? (
        <strong key={index} className="mb-2 mt-6 block text-[10px] font-black uppercase tracking-[0.22em] text-text-primary">
          {part.slice(2, -2)}
        </strong>
      ) : (
        <span key={index}>{part}</span>
      )
    )}
  </div>
);

const ExerciseDetailSheet: React.FC<ExerciseDetailSheetProps> = ({ exercise, onClose }) => (
  <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/70 backdrop-blur-md animate-fade-in" onClick={onClose}>
    <div
      className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[2rem] border border-surface-border bg-bg-base shadow-2xl sm:rounded-[2rem]"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="relative overflow-hidden border-b border-surface-border p-5">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-r from-brand-accent/10 via-transparent to-brand-protein/10" />

        <div className="relative z-10 flex items-start justify-between gap-4">
          <div>
            <Tag variant="status" tone="accent" size="sm">
              Exercise Detail
            </Tag>
            <h2 className="mt-3 text-2xl font-black uppercase tracking-[-0.04em] text-text-primary">{exercise.name}</h2>
          </div>

          <IconButton onClick={onClose} icon={XIcon} label="Cerrar detalle" variant="secondary" size="small" />
        </div>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto p-5 hide-scrollbar">
        <div className="aspect-video overflow-hidden rounded-[1.75rem] border border-surface-border bg-surface-bg shadow-sm">
          <ExerciseImage exercise={exercise} className="h-full w-full object-cover" />
        </div>

        <DialogSectionCard className="space-y-4 p-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-text-secondary">Tecnica</p>
            <h3 className="mt-2 text-lg font-black uppercase tracking-[-0.04em] text-text-primary">Guia de ejecucion</h3>
          </div>
          <FormattedDescription text={exercise.description} />
        </DialogSectionCard>
      </div>

      <div className="border-t border-surface-border p-5">
        <Button onClick={onClose} variant="high-contrast" className="w-full" size="large">
          Volver al entrenamiento
        </Button>
      </div>
    </div>
  </div>
);

export default ExerciseDetailSheet;
