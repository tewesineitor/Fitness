import React, { useContext, useMemo, useState } from 'react';
import Modal from '../../../components/Modal';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import ExerciseImage from '../../../components/ExerciseImage';
import { AppContext } from '../../../contexts';
import { selectAllExercises } from '../../../selectors/workoutSelectors';
import { Exercise } from '../../../types';
import { ChevronRightIcon, SearchIcon, XIcon } from '../../../components/icons';

const AddExerciseModal: React.FC<{ onSelect: (ex: Exercise) => void; onClose: () => void }> = ({ onSelect, onClose }) => {
    const { state } = useContext(AppContext)!;
    const [searchTerm, setSearchTerm] = useState('');
    const allExercises = useMemo(() => Object.values(selectAllExercises(state)), [state]);
    const filteredExercises = useMemo(
        () => allExercises.filter(ex => ex.name.toLowerCase().includes(searchTerm.toLowerCase())),
        [allExercises, searchTerm]
    );

    return (
        <Modal onClose={onClose} className="max-w-2xl h-[85vh] !p-0 flex flex-col bg-surface-bg border border-surface-border rounded-3xl overflow-hidden">
            <div className="p-5 border-b border-surface-border flex justify-between items-center bg-surface-hover/80 backdrop-blur-md">
                <h3 className="text-sm font-black text-text-primary uppercase tracking-widest">Seleccionar Ejercicio</h3>
                <Button variant="tertiary" size="small" onClick={onClose} className="!p-2 rounded-full" icon={XIcon} />
            </div>

            <div className="p-5 bg-[var(--color-bg-base)]">
                <Input
                    type="search"
                    placeholder="Buscar ejercicio..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    icon={SearchIcon}
                    autoFocus
                    className="text-sm font-bold tracking-wide"
                />
            </div>

            <div className="flex-grow min-h-0 overflow-y-auto p-5 space-y-3 bg-bg-base">
                {filteredExercises.length > 0 ? (
                    filteredExercises.map(ex => (
                        <button key={ex.id} onClick={() => onSelect(ex)} className="w-full text-left p-3 bg-surface-bg rounded-2xl flex items-center gap-4 hover:bg-surface-hover transition-all group border border-surface-border hover:border-brand-accent/40 active:scale-[0.98] shadow-sm">
                            <div className="w-12 h-12 bg-surface-hover rounded-xl flex-shrink-0 overflow-hidden border border-surface-border group-hover:border-brand-accent/30 transition-colors">
                                <ExerciseImage exercise={ex} className="w-full h-full object-cover opacity-80 group-hover:opacity-100" />
                            </div>
                            <div className="flex-grow">
                                <p className="font-black text-text-primary text-sm group-hover:text-brand-accent transition-colors uppercase tracking-tight">{ex.name}</p>
                                <span className="text-[9px] font-bold text-text-secondary uppercase bg-surface-hover border border-surface-border px-2 py-1 rounded-md mt-1.5 inline-block tracking-wider">{ex.category}</span>
                            </div>
                            <ChevronRightIcon className="w-4 h-4 text-surface-border group-hover:text-brand-accent group-hover:translate-x-1 transition-transform" />
                        </button>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-full py-12 opacity-50">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                            <SearchIcon className="w-8 h-8 text-text-secondary" />
                        </div>
                        <p className="text-sm font-bold text-text-secondary uppercase tracking-widest">No encontrado</p>
                        <p className="text-[10px] text-text-secondary/60 mt-1">Intenta con otro término</p>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default AddExerciseModal;
