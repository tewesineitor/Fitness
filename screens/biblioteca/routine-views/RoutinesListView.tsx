import React, { useContext, useState } from 'react';
import { AppContext } from '../../../contexts';
import { RoutineTask } from '../../../types';
import Button from '../../../components/Button';
import ConfirmationDialog from '../../../components/dialogs/ConfirmationDialog';
import { selectUserRoutines } from '../../../selectors/workoutSelectors';
import * as actions from '../../../actions';
import { ChevronRightIcon, PlusIcon, TrashIcon } from '../../../components/icons';
import { RoutineTypeIcon, getRoutineTypeLabel } from './routineTypes';

const RoutinesListView: React.FC<{ onSelectRoutine: (routine: RoutineTask | null) => void }> = ({ onSelectRoutine }) => {
    const { state, dispatch } = useContext(AppContext)!;
    const userRoutines = selectUserRoutines(state);
    const [routineToDelete, setRoutineToDelete] = useState<RoutineTask | null>(null);

    const handleDelete = () => {
        if (routineToDelete) {
            dispatch(actions.deleteUserRoutine(routineToDelete.id));
            setRoutineToDelete(null);
        }
    };

    return (
        <div className="animate-fade-in-up">
            {routineToDelete && <ConfirmationDialog title="Eliminar Rutina" message={`Â¿Seguro que quieres eliminar "${routineToDelete.name}"?`} onConfirm={handleDelete} onCancel={() => setRoutineToDelete(null)} />}
            <div className="p-4 sm:p-6">
                {userRoutines.length > 0 ? (
                    <div className="space-y-4">
                        {userRoutines.map((r, i) => (
                            <div key={r.id} className="relative group bg-surface-bg p-5 rounded-3xl border border-surface-border hover:border-brand-accent/30 hover:bg-surface-hover transition-all animate-fade-in-up cursor-pointer overflow-hidden shadow-sm active:scale-95 hover:shadow-lg" onClick={() => onSelectRoutine(r)} style={{ animationDelay: `${i * 50}ms` }}>
                                <div className="absolute -right-10 -top-10 w-32 h-32 bg-brand-accent/5 rounded-full blur-2xl group-hover:bg-brand-accent/10 transition-colors pointer-events-none"></div>

                                <div className="flex w-full items-center gap-5 text-left relative z-10">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 bg-surface-bg border border-surface-border shadow-inner transition-colors ${r.type === 'strength' ? 'text-brand-protein group-hover:border-brand-protein/30' : r.type === 'cardio' ? 'text-brand-fat group-hover:border-brand-fat/30' : 'text-brand-accent group-hover:border-brand-accent/30'}`}>
                                        <RoutineTypeIcon type={r.type} className="w-7 h-7" />
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <h3 className="font-black text-text-primary text-base truncate uppercase tracking-tight group-hover:text-text-primary transition-colors">{r.name}</h3>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="text-[9px] font-bold text-text-secondary bg-surface-hover px-2 py-1 rounded-md border border-surface-border uppercase tracking-wider">{r.flow.length} Ejercicios</span>
                                            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border border-surface-border bg-surface-hover ${r.type === 'strength' ? 'text-brand-protein' : 'text-brand-accent'}`}>{getRoutineTypeLabel(r.type)}</span>
                                        </div>
                                    </div>
                                    <div className="bg-surface-bg p-2.5 rounded-full text-text-secondary group-hover:text-text-primary group-hover:bg-white/10 transition-all border border-surface-border">
                                        <ChevronRightIcon className="w-5 h-5" />
                                    </div>
                                </div>

                                {r.isUserCreated && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setRoutineToDelete(r); }}
                                        className="absolute top-3 right-3 p-2 bg-red-500/10 text-red-400 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-text-primary scale-90 group-hover:scale-100 hover:shadow-lg"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center h-full flex flex-col justify-center items-center py-12">
                        <div className="w-24 h-24 bg-surface-bg rounded-full flex items-center justify-center mb-6 animate-pulse">
                            <PlusIcon className="w-10 h-10 text-text-secondary/50" />
                        </div>
                        <h2 className="text-xl font-black text-text-primary uppercase tracking-tight">Sin Rutinas</h2>
                        <p className="text-sm text-text-secondary mt-2 max-w-xs mx-auto">Comienza creando tu primera rutina de entrenamiento personalizada.</p>
                        <Button onClick={() => onSelectRoutine(null)} variant="high-contrast" icon={PlusIcon} className="mt-8 shadow-lg shadow-brand-accent/20 active:scale-95 transition-all">Crear Rutina</Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RoutinesListView;
