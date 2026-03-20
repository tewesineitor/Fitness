
import React, { useState, useMemo, useContext } from 'react';
import { AppContext } from '../../contexts';
import { selectAllExercises } from '../../selectors/workoutSelectors';
import { Exercise } from '../../types';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import ExerciseImage from '../../components/ExerciseImage';
import { SearchIcon, XIcon, ChevronRightIcon } from '../../components/icons';
import { vibrate } from '../../utils/helpers';

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

    const handleSelect = (ex: Exercise) => {
        vibrate(10);
        onSelect(ex);
    };

    return (
        <Modal onClose={onClose} className="max-w-2xl h-[85vh] !p-0 flex flex-col bg-bg-base border border-surface-border rounded-[2rem] overflow-hidden shadow-2xl animate-fade-in-up">
            {/* Header */}
            <div className="p-5 border-b border-surface-border bg-surface-bg/90 backdrop-blur-md flex justify-between items-center z-10 flex-shrink-0">
                <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] drop-shadow-sm">Añadir Ejercicio</h3>
                <Button 
                    variant="tertiary" 
                    size="small" 
                    onClick={() => { vibrate(5); onClose(); }} 
                    className="!p-2 rounded-full text-text-secondary hover:text-white bg-surface-hover/50 hover:bg-surface-border transition-colors"
                    icon={XIcon}
                />
            </div>
            
            {/* Search Bar */}
            <div className="p-5 bg-bg-base/80 backdrop-blur-md flex-shrink-0 border-b border-surface-border/50 z-10">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <SearchIcon className="h-4 w-4 text-text-secondary group-focus-within:text-brand-accent transition-colors" />
                    </div>
                    <input
                        type="search"
                        placeholder="BUSCAR EN ARSENAL..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-4 bg-surface-hover/80 border border-surface-border rounded-2xl focus:border-brand-accent focus:ring-1 focus:ring-brand-accent focus:bg-surface-bg outline-none text-sm font-bold text-white placeholder:text-text-secondary/50 transition-all uppercase tracking-wide shadow-sm"
                        autoFocus
                    />
                </div>
            </div>

            {/* List (Scrollable) */}
            <div className="flex-grow min-h-0 overflow-y-auto px-5 py-4 space-y-3 bg-bg-base hide-scrollbar relative z-0">
                {filteredExercises.length > 0 ? (
                    filteredExercises.map((ex, idx) => (
                    <button
                        key={ex.id}
                        onClick={() => handleSelect(ex)}
                        className="w-full text-left p-3 bg-surface-bg/80 border border-surface-border rounded-2xl flex items-center gap-4 hover:border-brand-accent/50 hover:bg-surface-hover transition-all group active:scale-[0.98] shadow-sm animate-fade-in-up"
                        style={{ animationDelay: `${Math.min(idx * 50, 500)}ms`, animationFillMode: 'both' }}
                    >
                        <div className="w-12 h-12 bg-black rounded-[0.85rem] overflow-hidden flex-shrink-0 border border-surface-border group-hover:border-brand-accent/50 transition-colors shadow-sm">
                            <ExerciseImage exercise={ex} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="flex-grow min-w-0">
                            <p className="font-bold text-sm text-text-primary uppercase tracking-tight truncate group-hover:text-white transition-colors">{ex.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[9px] font-bold text-brand-accent uppercase bg-brand-accent/10 px-2 py-0.5 rounded border border-brand-accent/20">{ex.category}</span>
                            </div>
                        </div>
                        <ChevronRightIcon className="w-5 h-5 text-text-secondary group-hover:text-brand-accent group-hover:translate-x-1 transition-transform" />
                    </button>
                ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-full py-12 opacity-80 animate-fade-in-up">
                        <div className="w-16 h-16 bg-surface-hover rounded-full flex items-center justify-center mb-4 border border-surface-border">
                            <SearchIcon className="w-8 h-8 text-text-secondary" />
                        </div>
                        <p className="text-sm font-bold text-white uppercase tracking-widest">No encontrado</p>
                        <p className="text-[10px] text-text-secondary mt-1 uppercase tracking-widest">Intenta con otro término</p>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default AddExerciseModal;
