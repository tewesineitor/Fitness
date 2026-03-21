import React, { useContext, useMemo, useState } from 'react';
import { AppContext } from '../../contexts';
import { selectAllExercises } from '../../selectors/workoutSelectors';
import type { Exercise } from '../../types';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Modal from '../../components/Modal';
import IconButton from '../../components/IconButton';
import Tag from '../../components/Tag';
import ExerciseImage from '../../components/ExerciseImage';
import { SearchIcon, XIcon } from '../../components/icons';
import { vibrate } from '../../utils/helpers';

const AddExerciseModal: React.FC<{
  onSelect: (ex: Exercise) => void;
  onClose: () => void;
}> = ({ onSelect, onClose }) => {
  const { state } = useContext(AppContext)!;
  const [searchTerm, setSearchTerm] = useState('');
  const allExercises = useMemo(() => Object.values(selectAllExercises(state)), [state]);

  const filteredExercises = useMemo(
    () => allExercises.filter((exercise) => exercise.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [allExercises, searchTerm]
  );

  const handleSelect = (exercise: Exercise) => {
    vibrate(10);
    onSelect(exercise);
  };

  return (
    <Modal onClose={onClose} className="flex h-[88vh] max-w-2xl flex-col overflow-hidden !p-0">
      <div className="relative overflow-hidden border-b border-surface-border p-5">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-r from-brand-accent/10 via-transparent to-brand-protein/10" />

        <div className="relative z-10 flex items-start justify-between gap-4">
          <div>
            <Tag variant="status" tone="accent" size="sm">
              Exercise Library
            </Tag>
            <h3 className="mt-3 text-2xl font-black uppercase tracking-[-0.04em] text-text-primary">Anadir ejercicio</h3>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">
              Busca en el arsenal y agrega un extra sin romper la jerarquia visual del flujo.
            </p>
          </div>

          <IconButton onClick={() => { vibrate(5); onClose(); }} icon={XIcon} label="Cerrar" variant="secondary" size="small" />
        </div>
      </div>

      <div className="border-b border-surface-border px-5 py-4">
        <div className="flex items-end gap-3">
          <Input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Buscar ejercicio"
            label="Busqueda"
            icon={SearchIcon}
            containerClassName="flex-1"
          />
          <Tag variant="overlay" tone="neutral" size="sm" count={filteredExercises.length}>
            Resultados
          </Tag>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4 hide-scrollbar">
        {filteredExercises.length > 0 ? (
          filteredExercises.map((exercise) => (
            <button
              key={exercise.id}
              type="button"
              onClick={() => handleSelect(exercise)}
              className="w-full text-left transition-transform duration-200 active:scale-[0.99]"
            >
              <Card variant="elevated" className="flex items-center gap-4 p-4">
                <div className="h-14 w-14 overflow-hidden rounded-[1rem] border border-surface-border bg-surface-hover">
                  <ExerciseImage exercise={exercise} className="h-full w-full object-cover" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-black uppercase tracking-[0.02em] text-text-primary">{exercise.name}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Tag variant="status" tone="accent" size="sm">
                      {exercise.category}
                    </Tag>
                  </div>
                </div>
              </Card>
            </button>
          ))
        ) : (
          <Card variant="inset" className="px-6 py-12 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-surface-border bg-surface-bg text-text-secondary">
              <SearchIcon className="h-6 w-6" />
            </div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-text-primary">Sin resultados</p>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">Prueba con otro nombre o palabra clave.</p>
          </Card>
        )}
      </div>
    </Modal>
  );
};

export default AddExerciseModal;
