import React from 'react';
import type { Exercise } from '../../types';
import Button from '../../components/Button';
import DialogSectionCard from '../../components/DialogSectionCard';
import Tag from '../../components/Tag';
import ExerciseImage from '../../components/ExerciseImage';
import BottomSheet from '../../components/feedback/BottomSheet';

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
  <BottomSheet
    onClose={onClose}
    title={
      <div className="space-y-2">
        <Tag variant="status" tone="accent" size="sm">
          Exercise Detail
        </Tag>
        <span className="block text-xl font-black uppercase tracking-[-0.04em] text-text-primary">
          {exercise.name}
        </span>
      </div>
    }
    footer={
      <Button onClick={onClose} variant="high-contrast" className="w-full" size="large">
        Volver al entrenamiento
      </Button>
    }
    panelClassName="max-w-2xl mx-auto h-auto sm:border sm:border-surface-border sm:rounded-t-[2rem]"
  >
    <div className="space-y-5">
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
  </BottomSheet>
);

export default ExerciseDetailSheet;
