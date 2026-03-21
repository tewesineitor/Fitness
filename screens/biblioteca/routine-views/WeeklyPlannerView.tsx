import React, { useContext, useState } from 'react';
import { DayOfWeek, TimeOfDay } from '../../../types';
import { AppContext } from '../../../contexts';
import Button from '../../../components/Button';
import { ChevronRightIcon, PlusIcon, CalendarIcon, XIcon } from '../../../components/icons';
import { selectUserRoutines, selectWeeklySchedule } from '../../../selectors/workoutSelectors';
import * as actions from '../../../actions';
import RoutineSelectorModal from './RoutineSelectorModal';
import { RoutineTypeIcon, getRoutineTypeLabel } from './routineTypes';

const WeeklyPlannerView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { state, dispatch } = useContext(AppContext)!;
    const weeklySchedule = selectWeeklySchedule(state);
    const userRoutines = selectUserRoutines(state);
    const [targetSlot, setTargetSlot] = useState<{ day: DayOfWeek; time: TimeOfDay } | null>(null);

    const days: DayOfWeek[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const timeSlots: TimeOfDay[] = ['Mañana', 'Mediodía', 'Noche'];

    const handleAssignRoutine = (routineId: string) => {
        if (!targetSlot) return;
        dispatch(actions.assignRoutineToDay({ day: targetSlot.day, time: targetSlot.time, routineId }));
        setTargetSlot(null);
    };

    const handleUnassignRoutine = (day: DayOfWeek, time: TimeOfDay) => {
        dispatch(actions.assignRoutineToDay({ day, time, routineId: null }));
    };

    return (
        <div className="animate-fade-in-up">
            {targetSlot && (
                <RoutineSelectorModal
                    routines={userRoutines}
                    onSelect={handleAssignRoutine}
                    onClose={() => setTargetSlot(null)}
                    slotLabel={`${targetSlot.day} - ${targetSlot.time}`}
                />
            )}

            <header className="p-4 sm:p-6 pb-2 pt-6">
                <Button variant="tertiary" onClick={onBack} icon={ChevronRightIcon} className="mb-6 !p-0 [&_svg]:rotate-180 text-text-secondary hover:text-text-primary self-start">
                    Volver
                </Button>
                <h1 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight uppercase mb-2">
                    Plan Semanal
                </h1>
                <p className="text-xs sm:text-sm text-text-secondary max-w-md">
                    Diseña tu semana. Puedes asignar hasta 3 rutinas por día.
                </p>
            </header>

            <div className="p-6 space-y-6 pb-32">
                {days.map((day) => (
                    <div key={day} className="bg-surface-bg p-5 rounded-2xl border border-surface-border shadow-sm">
                        <h3 className="text-sm font-black text-text-primary uppercase tracking-wide mb-4 border-b border-surface-border pb-2 flex items-center justify-between">
                            {day}
                            <CalendarIcon className="w-4 h-4 text-text-secondary" />
                        </h3>

                        <div className="space-y-3">
                            {timeSlots.map((time) => {
                                const routineId = weeklySchedule[day]?.[time];
                                const routine = userRoutines.find(r => r.id === routineId);

                                return (
                                    <div key={time} className="flex items-center gap-3">
                                        <div className="w-20 flex-shrink-0 text-right">
                                            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">{time}</span>
                                        </div>

                                        <div className="flex-grow min-w-0">
                                            {routine ? (
                                                <div className="flex items-center justify-between bg-surface-hover p-2 pr-3 rounded-xl border border-white/10 group hover:border-brand-accent/30 transition-all hover:shadow-sm">
                                                    <div className="flex items-center gap-3 overflow-hidden min-w-0">
                                                        <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center bg-surface-bg border border-white/5 transition-colors group-hover:border-brand-accent/30 ${routine.type === 'strength' ? 'text-brand-protein' : 'text-brand-accent'}`}>
                                                            <RoutineTypeIcon type={routine.type} className="w-4 h-4" />
                                                        </div>
                                                        <div className="min-w-0 flex-grow">
                                                            <p className="text-xs font-bold text-text-primary truncate">{routine.name}</p>
                                                            <p className="text-[8px] text-text-secondary font-mono uppercase tracking-wider truncate">{getRoutineTypeLabel(routine.type)}</p>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="destructive"
                                                        size="small"
                                                        onClick={() => handleUnassignRoutine(day, time)}
                                                        className="!p-1.5 rounded-lg flex-shrink-0 ml-2 hover:bg-red-500/20 active:scale-90 transition-all"
                                                        icon={XIcon}
                                                        title="Desasignar"
                                                    />
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setTargetSlot({ day, time })}
                                                    className="w-full py-2.5 rounded-xl border border-dashed border-surface-border hover:border-brand-accent/50 bg-surface-hover/20 hover:bg-surface-hover text-[10px] font-bold text-text-secondary hover:text-text-primary uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 group shadow-sm hover:shadow-brand-accent/10"
                                                >
                                                    <PlusIcon className="w-3 h-3 group-hover:text-brand-accent transition-colors" /> Asignar
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WeeklyPlannerView;
