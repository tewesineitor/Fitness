
import React, { useState, useMemo, useContext } from 'react';
import { AppContext } from '../../contexts';
import { selectAllExercises } from '../../selectors/workoutSelectors';
import { Exercise } from '../../types';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import ExerciseImage from '../../components/ExerciseImage';
import { SearchIcon, XIcon, ChevronRightIcon } from '../../components/icons';

const AddExerciseModal: React.FC<{
    onSelect: (ex: Exercise) => void;
    onClose: () => void;
}> = ({ onSelect, onClose }) => {
    const { state } = useContext(AppContext)!;
    const [searchTerm, setSearchTerm] = useState('');
    const allExercises = useMemo(() => Object.values(selectAllExercises(state)), [state]);
    
    const filteredExercises = useMemo(() => {
        return allExercises.filter(ex => 
            ex.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [allExercises, searchTerm]);

    return (
        <Modal onClose={onClose} className="max-w-2xl h-[85vh] !p-0 flex flex-col bg-bg-base border border-surface-border rounded-[2rem] overflow-hidden shadow-sm">
            {/* Header */}
            <div className="p-5 border-b border-surface-border bg-surface-bg/90 backdrop-blur-md flex justify-between items-center z-10 flex-shrink-0">
                <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Añadir Ejercicio</h3>
                <Button 
                    variant="tertiary" 
                    size="small" 
                    onClick={onClose} 
                    className="!p-2 rounded-full text-text-secondary hover:text-white"
                    icon={XIcon}
                />
            </div>
            
            {/* Search Bar (Fixed below header) */}
            <div className="p-5 bg-bg-base flex-shrink-0">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <SearchIcon className="h-4 w-4 text-text-secondary group-focus-within:text-brand-accent transition-colors" />
                    </div>
                    <input
                        type="search"
                        placeholder="BUSCAR EN ARSENAL..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-4 bg-surface-hover border border-surface-border rounded-2xl focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none text-sm font-bold text-white placeholder:text-text-secondary/30 transition-all uppercase tracking-wide"
                        autoFocus
                    />
                </div>
            </div>

            {/* List (Scrollable) */}
            <div className="flex-grow min-h-0 overflow-y-auto px-5 pb-5 space-y-3 bg-bg-base hide-scrollbar">
                {filteredExercises.length > 0 ? (
                    filteredExercises.map(ex => (
                    <button
                        key={ex.id}
                        onClick={() => onSelect(ex)}
                        className="w-full text-left p-3 bg-surface-bg border border-surface-border rounded-2xl flex items-center gap-4 hover:border-brand-accent/30 hover:bg-surface-hover transition-all group active:scale-[0.98] shadow-sm"
                    >
                        <div className="w-12 h-12 bg-black rounded-xl overflow-hidden flex-shrink-0 border border-surface-border group-hover:border-brand-accent/30 transition-colors">
                            <ExerciseImage exercise={ex} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="flex-grow min-w-0">
                            <p className="font-bold text-sm text-text-primary uppercase tracking-tight truncate group-hover:text-white transition-colors">{ex.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[9px] font-bold text-text-secondary uppercase bg-surface-hover px-2 py-0.5 rounded border border-surface-border">{ex.category}</span>
                            </div>
                        </div>
                        <ChevronRightIcon className="w-4 h-4 text-text-secondary group-hover:text-brand-accent group-hover:translate-x-1 transition-transform" />
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
