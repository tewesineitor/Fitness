import React from 'react';
import Modal from '../../../components/Modal';
import Button from '../../../components/Button';
import { CalendarIcon, PlusIcon } from '../../../components/icons';
import { RoutineTask } from '../../../types';
import { RoutineTypeIcon, getRoutineTypeLabel } from './routineTypes';

interface RoutineSelectorModalProps {
    onSelect: (routineId: string) => void;
    onClose: () => void;
    routines: RoutineTask[];
    slotLabel: string;
}

const RoutineSelectorModal: React.FC<RoutineSelectorModalProps> = ({ onSelect, onClose, routines, slotLabel }) => {
    return (
        <Modal onClose={onClose} className="max-w-md h-[70vh] flex flex-col">
            <div className="p-5 border-b border-white/10 bg-surface-bg">
                <h3 className="text-sm font-black text-text-primary uppercase tracking-widest">Asignar a {slotLabel}</h3>
            </div>
            <div className="flex-grow overflow-y-auto p-4 space-y-2 bg-surface-bg hide-scrollbar">
                {routines.length > 0 ? (
                    routines.map(routine => (
                        <Button
                            key={routine.id}
                            onClick={() => onSelect(routine.id)}
                            variant="secondary"
                            className="group w-full justify-start items-center gap-3 px-3 py-3 h-auto rounded-xl text-left border border-surface-border hover:border-brand-accent/30"
                        >
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-surface-hover border border-surface-border ${routine.type === 'strength' ? 'text-brand-protein' : 'text-brand-accent'}`}>
                                <RoutineTypeIcon type={routine.type} className="w-5 h-5" />
                            </div>
                            <div className="flex-grow min-w-0">
                                <p className="text-sm font-bold text-text-primary group-hover:text-brand-accent transition-colors truncate">{routine.name}</p>
                                <p className="text-[10px] text-text-secondary font-mono uppercase tracking-wider truncate">{getRoutineTypeLabel(routine.type)} • {routine.flow.length} Ejercicios</p>
                            </div>
                            <PlusIcon className="w-4 h-4 text-text-secondary flex-shrink-0" />
                        </Button>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-full py-12 opacity-50">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                            <CalendarIcon className="w-8 h-8 text-text-secondary" />
                        </div>
                        <p className="text-sm font-bold text-text-secondary uppercase tracking-widest">Sin Rutinas</p>
                        <p className="text-[10px] text-text-secondary/60 mt-1">Crea una rutina primero</p>
                    </div>
                )}
            </div>
            <div className="p-4 border-t border-white/10 bg-surface-bg">
                <Button variant="secondary" onClick={onClose} className="w-full">
                    Cancelar
                </Button>
            </div>
        </Modal>
    );
};

export default RoutineSelectorModal;
