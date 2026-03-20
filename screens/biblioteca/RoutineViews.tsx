
import React, { useState, useContext, useMemo, useEffect } from 'react';
import { RoutineTask, TimeOfDay, RoutineTaskType, Exercise, RoutineStep, StrengthStep, YogaStep, DayOfWeek } from '../../types';
import { ChevronRightIcon, PlusIcon, TrashIcon, CheckIcon, MountainIcon, StrengthIcon, YogaIcon, PostureIcon, CardioIcon, MeditationIcon, ClockIcon, SearchIcon, XIcon, CalendarIcon, ArrowDownIcon } from '../../components/icons';
import { AppContext } from '../../contexts';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import ConfirmationDialog from '../../components/dialogs/ConfirmationDialog';
import { selectUserRoutines, selectAllExercises, selectWeeklySchedule } from '../../selectors/workoutSelectors';
import * as actions from '../../actions';
import { defaultRoutines } from '../../data';
import ExerciseImage from '../../components/ExerciseImage';
import FloatingDock from '../../components/FloatingDock';
import { vibrate } from '../../utils/helpers';

// --- SHARED COMPONENTS ---

const getRoutineTypeLabel = (type: string) => {
    const map: Record<string, string> = {
        strength: 'Fuerza',
        yoga: 'Yoga',
        posture: 'Postura',
        cardio: 'Cardio',
        meditation: 'Mental',
        cardioLibre: 'Cardio',
        senderismo: 'Senderismo',
    };
    return map[type] || type;
};

export const RoutineTypeIcon: React.FC<{ type: RoutineTaskType, className?: string }> = ({ type, className }) => {
    switch (type) {
        case 'strength': return <StrengthIcon className={className} />;
        case 'yoga': return <YogaIcon className={className} />;
        case 'posture': return <PostureIcon className={className} />;
        case 'cardio':
        case 'cardioLibre':
             return <CardioIcon className={className} />;
        case 'senderismo':
             return <MountainIcon className={className} />;
        case 'meditation': return <MeditationIcon className={className} />;
        default: return <StrengthIcon className={className} />;
    }
};

// --- PLANNER COMPONENTS ---

const RoutineSelectorModal: React.FC<{ 
    onSelect: (routineId: string) => void; 
    onClose: () => void; 
    routines: RoutineTask[];
    slotLabel: string;
}> = ({ onSelect, onClose, routines, slotLabel }) => {
    return (
        <Modal onClose={onClose} className="max-w-md h-[70vh] flex flex-col">
            <div className="p-5 border-b border-white/10 bg-surface-bg">
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Asignar a {slotLabel}</h3>
            </div>
            <div className="flex-grow overflow-y-auto p-4 space-y-2 bg-surface-bg hide-scrollbar">
                {routines.length > 0 ? (
                    routines.map(routine => (
                        <button 
                            key={routine.id} 
                            onClick={() => onSelect(routine.id)}
                            className="w-full text-left p-3 bg-surface-bg rounded-xl flex items-center gap-3 hover:bg-surface-hover transition-all border border-surface-border group active:scale-[0.98] shadow-sm"
                        >
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-surface-hover border border-surface-border ${routine.type === 'strength' ? 'text-brand-protein' : 'text-brand-accent'}`}>
                                <RoutineTypeIcon type={routine.type} className="w-5 h-5" />
                            </div>
                            <div className="flex-grow">
                                <p className="text-sm font-bold text-white group-hover:text-brand-accent transition-colors">{routine.name}</p>
                                <p className="text-[10px] text-text-secondary font-mono uppercase tracking-wider">{getRoutineTypeLabel(routine.type)} • {routine.flow.length} Ejercicios</p>
                            </div>
                            <PlusIcon className="w-4 h-4 text-text-secondary group-hover:text-white" />
                        </button>
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
                <Button variant="secondary" onClick={onClose} className="w-full">Cancelar</Button>
            </div>
        </Modal>
    );
};

const WeeklyPlannerView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { state, dispatch } = useContext(AppContext)!;
    const weeklySchedule = selectWeeklySchedule(state);
    const userRoutines = selectUserRoutines(state);
    
    const [targetSlot, setTargetSlot] = useState<{ day: DayOfWeek, time: TimeOfDay } | null>(null);

    const days: DayOfWeek[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const timeSlots: TimeOfDay[] = ['Mañana', 'Mediodía', 'Noche'];

    const handleAssignRoutine = (routineId: string) => {
        if (targetSlot) {
            dispatch(actions.assignRoutineToDay({ 
                day: targetSlot.day, 
                time: targetSlot.time, 
                routineId 
            }));
            setTargetSlot(null);
        }
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
                <Button variant="tertiary" onClick={onBack} icon={ChevronRightIcon} className="mb-6 !p-0 [&_svg]:rotate-180 text-text-secondary hover:text-white self-start">
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
                {days.map((day) => {
                    return (
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
                                            {/* Time Label */}
                                            <div className="w-20 flex-shrink-0 text-right">
                                                <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">{time}</span>
                                            </div>

                                            {/* Slot Content */}
                                            <div className="flex-grow min-w-0">
                                                {routine ? (
                                                    <div className="flex items-center justify-between bg-surface-hover p-2 pr-3 rounded-xl border border-white/10 group hover:border-brand-accent/30 transition-all hover:shadow-sm">
                                                        <div className="flex items-center gap-3 overflow-hidden min-w-0">
                                                            <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center bg-surface-bg border border-white/5 transition-colors group-hover:border-brand-accent/30 ${routine.type === 'strength' ? 'text-brand-protein' : 'text-brand-accent'}`}>
                                                                <RoutineTypeIcon type={routine.type} className="w-4 h-4" />
                                                            </div>
                                                            <div className="min-w-0 flex-grow">
                                                                <p className="text-xs font-bold text-white truncate">{routine.name}</p>
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
                                                        className="w-full py-2.5 rounded-xl border border-dashed border-surface-border hover:border-brand-accent/50 bg-surface-hover/20 hover:bg-surface-hover text-[10px] font-bold text-text-secondary hover:text-white uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 group shadow-sm hover:shadow-brand-accent/10"
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
                    );
                })}
            </div>
        </div>
    );
}

// --- ROUTINE EDITOR ---

const AddExerciseModal: React.FC<{ onSelect: (ex: Exercise) => void, onClose: () => void }> = ({ onSelect, onClose }) => {
    const { state } = useContext(AppContext)!;
    const [searchTerm, setSearchTerm] = useState('');
    const allExercises = useMemo(() => Object.values(selectAllExercises(state)), [state]);
    const filteredExercises = useMemo(() => allExercises.filter(ex => ex.name.toLowerCase().includes(searchTerm.toLowerCase())), [allExercises, searchTerm]);

    return (
        <Modal onClose={onClose} className="max-w-2xl h-[85vh] !p-0 flex flex-col bg-surface-bg border border-surface-border rounded-3xl overflow-hidden">
            <div className="p-5 border-b border-surface-border flex justify-between items-center bg-surface-hover/80 backdrop-blur-md">
                <h3 className="text-sm font-black text-text-primary uppercase tracking-widest">Seleccionar Ejercicio</h3>
                <Button variant="tertiary" size="small" onClick={onClose} className="!p-2 rounded-full" icon={XIcon} />
            </div>
            
            <div className="p-5 bg-[var(--color-bg-base)]">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <SearchIcon className="h-4 w-4 text-text-secondary group-focus-within:text-brand-accent transition-colors" />
                    </div>
                        <input 
                            type="search" 
                            placeholder="Buscar ejercicio..." 
                            value={searchTerm} 
                            onChange={e => setSearchTerm(e.target.value)} 
                            className="w-full pl-10 pr-4 py-4 bg-surface-hover border border-surface-border rounded-2xl focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none text-sm font-bold text-white placeholder:text-text-secondary/30 transition-all tracking-wide" 
                            autoFocus
                        />
                </div>
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

const MetricInput: React.FC<{
    label: string;
    value: string | number;
    onChange: (val: string) => void;
    type?: string;
    unit?: string;
}> = ({ label, value, onChange, type = "text", unit }) => (
    <div className="flex flex-col p-2.5 bg-surface-bg border border-surface-border rounded-xl focus-within:border-brand-accent focus-within:ring-1 focus-within:ring-brand-accent/50 transition-all relative overflow-hidden group shadow-sm">
        <label className="text-[9px] font-bold text-text-secondary uppercase tracking-widest mb-1 group-focus-within:text-brand-accent transition-colors">{label}</label>
        <div className="flex items-baseline gap-1">
            <input 
                type={type} 
                value={value} 
                onChange={e => onChange(e.target.value)} 
                className="w-full bg-transparent p-0 text-xs font-bold text-text-primary focus:text-brand-accent outline-none font-mono placeholder:text-text-secondary/20" 
            />
            {unit && <span className="text-[10px] text-text-secondary font-medium">{unit}</span>}
        </div>
    </div>
);

const RoutineEditor: React.FC<{ onBack: () => void, existingRoutine?: RoutineTask }> = ({ onBack, existingRoutine }) => {
    const { state, dispatch } = useContext(AppContext)!;
    const [name, setName] = useState(existingRoutine?.name || '');
    const [type, setType] = useState<RoutineTaskType>(existingRoutine?.type || 'strength');
    
    const getInitialFlow = () => {
        if (existingRoutine) return existingRoutine.flow;
        if (type === 'strength') {
            const warmupFlow = defaultRoutines.find(r => r.id === 'default-warmup')?.flow || [];
            const cooldownFlow = defaultRoutines.find(r => r.id === 'default-cooldown')?.flow || [];
            return [...warmupFlow, ...cooldownFlow];
        }
        return [];
    };

    const [flow, setFlow] = useState<RoutineStep[]>(getInitialFlow());
    const [showAddExercise, setShowAddExercise] = useState(false);

    useEffect(() => {
        if (!existingRoutine) {
            if (type === 'strength') {
                const warmupFlow = defaultRoutines.find(r => r.id === 'default-warmup')?.flow || [];
                const cooldownFlow = defaultRoutines.find(r => r.id === 'default-cooldown')?.flow || [];
                setFlow([...warmupFlow, ...cooldownFlow]);
            } else {
                setFlow([]);
            }
        }
    }, [type, existingRoutine]);

    const handleSave = () => {
        if (!name.trim()) { alert("Por favor, dale un nombre a la rutina."); return; }
        const routineData = { name, type, flow, timeOfDay: 'Mañana' as TimeOfDay };
        if (existingRoutine && existingRoutine.id.includes('user-routine')) {
            dispatch(actions.updateUserRoutine({ ...existingRoutine, ...routineData }));
        } else {
            dispatch(actions.addUserRoutine(routineData));
        }
        onBack();
    };

    const addExerciseStep = (exercise: Exercise) => {
        let newStep: RoutineStep;
        if (exercise.category === 'fuerza') {
            newStep = { type: 'exercise', exerciseId: exercise.id, title: exercise.name, sets: 3, reps: '8-12', rir: '2', rest: 90 };
        } else {
            newStep = { type: 'pose', exerciseId: exercise.id, title: exercise.name, duration: 60 };
        }
        const cooldownIndex = flow.findIndex(s => s.type === 'cooldown');
        if (cooldownIndex !== -1) {
            const newFlow = [...flow];
            newFlow.splice(cooldownIndex, 0, newStep);
            setFlow(newFlow);
        } else {
            setFlow([...flow, newStep]);
        }
        setShowAddExercise(false);
    };

    const updateStep = (index: number, updatedStep: RoutineStep) => {
        const newFlow = [...flow];
        newFlow[index] = updatedStep;
        setFlow(newFlow);
    };
    
    const removeStep = (index: number) => setFlow(flow.filter((_, i) => i !== index));

    const routineTypes: { value: RoutineTaskType, label: string, icon: any }[] = [
        { value: 'strength', label: 'Fuerza', icon: StrengthIcon },
        { value: 'cardio', label: 'Cardio', icon: CardioIcon },
        { value: 'yoga', label: 'Yoga', icon: YogaIcon },
        { value: 'meditation', label: 'Mental', icon: MeditationIcon },
    ];

    // Removed the bg-[var(--color-bg-base)] class here to fix the floating navbar issue
    return (
        <div className="animate-fade-in-up relative flex flex-col">
            {showAddExercise && <AddExerciseModal onSelect={addExerciseStep} onClose={() => setShowAddExercise(false)} />}
            
            <div className="p-4 sm:p-6 space-y-6 hide-scrollbar">
                {/* Header */}
                <div className="animate-fade-in-up pt-4">
                        <div className="flex items-center justify-between mb-6">
                            <Button variant="tertiary" onClick={onBack} icon={ChevronRightIcon} className="!p-0 text-text-secondary hover:text-white [&_svg]:rotate-180">
                                Volver
                            </Button>
                        </div>
                        
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-2 opacity-70">
                                <div className="w-1.5 h-1.5 rounded-full bg-brand-accent shadow-[0_0_8px_currentColor]"></div>
                                <span className="text-[10px] font-bold text-brand-accent uppercase tracking-[0.2em]">Configuración de Rutina</span>
                            </div>
                            <input 
                                type="text" 
                                value={name} 
                                onChange={e => setName(e.target.value)} 
                                placeholder="NOMBRE DE LA RUTINA..." 
                                className="w-full bg-transparent p-0 text-3xl sm:text-4xl font-black text-text-primary placeholder:text-surface-border/30 outline-none transition-all uppercase tracking-tight border-none focus:ring-0" 
                            />
                        </div>

                        {/* Type Selector - Single Line, Mobile First */}
                        <div className="bg-surface-hover p-1 rounded-xl border border-surface-border flex w-full mb-8 overflow-hidden">
                            {routineTypes.map(rt => {
                                const isSelected = type === rt.value;
                                const Icon = rt.icon;
                                return (
                                    <button
                                        key={rt.value}
                                        onClick={() => setType(rt.value)}
                                        className={`
                                            flex-1 flex flex-row items-center justify-center gap-1.5 py-2.5 rounded-lg transition-all duration-200
                                            ${isSelected 
                                                ? 'bg-white text-black shadow-sm font-bold' 
                                                : 'text-text-secondary hover:text-white hover:bg-white/5 font-medium'
                                            }
                                        `}
                                    >
                                        <Icon className="w-4 h-4 flex-shrink-0" />
                                        <span className="text-[10px] sm:text-xs uppercase tracking-wider truncate">{rt.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Exercises List */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <h3 className="text-xs font-black text-text-secondary uppercase tracking-[0.2em]">Ejercicios</h3>
                            <span className="text-[10px] font-bold text-brand-accent bg-brand-accent/10 px-2.5 py-1 rounded-md border border-brand-accent/20 tracking-wider">
                                {flow.filter(s => s.type === 'exercise').length} ACTIVOS
                            </span>
                        </div>

                        {flow.map((step, index) => {
                            if (step.type === 'exercise') {
                                const s = step as StrengthStep;
                                return (
                                    <div key={index} className="bg-surface-bg rounded-2xl overflow-hidden border border-surface-border group animate-fade-in-up hover:border-brand-accent/30 transition-all hover:shadow-lg shadow-sm" style={{animationDelay: `${index * 50}ms`}}>
                                        <div className="flex items-center gap-4 p-4 bg-gradient-to-b from-white/5 to-transparent">
                                            <div className="w-8 h-8 rounded-lg bg-surface-bg text-brand-accent flex items-center justify-center text-xs font-bold border border-surface-border font-mono shadow-inner">
                                                {index + 1}
                                            </div>
                                            <div className="flex-grow min-w-0">
                                                <h4 className="font-black text-text-primary text-sm truncate uppercase tracking-tight group-hover:text-brand-accent transition-colors">{s.title}</h4>
                                            </div>
                                            <Button 
                                                variant="destructive"
                                                size="small"
                                                onClick={() => removeStep(index)} 
                                                className="!p-2 rounded-lg"
                                                icon={TrashIcon}
                                            />
                                        </div>
                                        
                                        <div className="grid grid-cols-4 gap-2 p-4 pt-0">
                                            <MetricInput label="Sets" value={s.sets} onChange={v => updateStep(index, {...s, sets: +v})} type="number" />
                                            <MetricInput label="Reps" value={s.reps} onChange={v => updateStep(index, {...s, reps: v})} />
                                            <MetricInput label="RIR" value={s.rir} onChange={v => updateStep(index, {...s, rir: v})} />
                                            <MetricInput label="Rest" value={s.rest} onChange={v => updateStep(index, {...s, rest: +v})} type="number" unit="s" />
                                        </div>
                                    </div>
                                )
                            }
                            if (step.type === 'pose') {
                                const s = step as YogaStep;
                                return (
                                    <div key={index} className="bg-surface-bg rounded-2xl border border-surface-border p-4 flex items-center justify-between animate-fade-in-up hover:border-purple-400/30 transition-colors shadow-sm">
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center text-xs font-bold border border-purple-500/20 font-mono">{index + 1}</div>
                                            <div>
                                                <h4 className="font-bold text-text-primary text-sm uppercase">{s.title}</h4>
                                                <span className="text-[9px] text-purple-400 uppercase tracking-widest font-bold">Movilidad</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-24">
                                                <MetricInput label="Tiempo" value={s.duration} onChange={v => updateStep(index, {...s, duration: +v})} type="number" unit="s" />
                                            </div>
                                            <Button 
                                                variant="destructive"
                                                size="small"
                                                onClick={() => removeStep(index)} 
                                                className="!p-2 rounded-lg"
                                                icon={TrashIcon}
                                            />
                                        </div>
                                    </div>
                                )
                            }
                            if (step.type === 'warmup' || step.type === 'cooldown') {
                                const isWarmup = step.type === 'warmup';
                                return (
                                    <div key={index} className={`p-4 rounded-2xl flex justify-between items-center border border-dashed transition-all ${isWarmup ? 'border-orange-500/20 bg-orange-500/5 hover:border-orange-500/40' : 'border-brand-accent/20 bg-brand-accent/5 hover:border-brand-accent/40'} animate-fade-in-up`}>
                                        <div className="flex items-center gap-4">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold border font-mono ${isWarmup ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-brand-accent/10 text-brand-accent border-brand-accent/20'}`}>{index + 1}</div>
                                            <div>
                                                <h4 className={`font-black text-sm uppercase tracking-tight ${isWarmup ? 'text-orange-400' : 'text-brand-accent'}`}>
                                                    {step.title}
                                                </h4>
                                                <p className="text-[10px] text-text-secondary mt-0.5 uppercase tracking-wide font-bold opacity-60">{step.items.length} MOVIMIENTOS</p>
                                            </div>
                                        </div>
                                        <Button 
                                            variant="destructive"
                                            size="small"
                                            onClick={() => removeStep(index)} 
                                            className="!p-2 rounded-lg"
                                            icon={TrashIcon}
                                        />
                                    </div>
                                )
                            }
                            return null;
                        })}
                        
                        <button 
                            onClick={() => setShowAddExercise(true)} 
                            className="w-full py-6 mt-6 mb-48 rounded-2xl border-2 border-dashed border-surface-border hover:border-brand-accent/50 bg-surface-bg/30 hover:bg-surface-bg transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer active:scale-[0.98]"
                        >
                            <div className="p-3 bg-surface-hover rounded-full border border-surface-border group-hover:border-brand-accent group-hover:scale-110 transition-all shadow-lg">
                                <PlusIcon className="w-6 h-6 text-text-secondary group-hover:text-brand-accent" />
                            </div>
                            <span className="text-xs font-bold text-text-secondary group-hover:text-text-primary uppercase tracking-[0.2em] transition-colors">Añadir Ejercicio</span>
                        </button>
                    </div>
                </div>

                {/* Floating Footer Action */}
                <FloatingDock>
                    <Button onClick={() => { vibrate(10); handleSave(); }} variant="high-contrast" className="w-full shadow-[0_0_30px_rgba(34,211,238,0.2)]" size="large" icon={CheckIcon}>
                        {existingRoutine ? 'GUARDAR CAMBIOS' : 'CREAR RUTINA'}
                    </Button>
                </FloatingDock>
        </div>
    );
};

// --- ROUTINES LIST VIEW ---

const RoutinesListView: React.FC<{ onSelectRoutine: (routine: RoutineTask | null) => void }> = ({ onSelectRoutine }) => {
    const { state, dispatch } = useContext(AppContext)!;
    const userRoutines = selectUserRoutines(state);
    const [routineToDelete, setRoutineToDelete] = useState<RoutineTask | null>(null);

    const handleDelete = () => {
        if(routineToDelete) {
            dispatch(actions.deleteUserRoutine(routineToDelete.id));
            setRoutineToDelete(null);
        }
    };

    return (
        <div className="animate-fade-in-up">
            {routineToDelete && <ConfirmationDialog title="Eliminar Rutina" message={`¿Seguro que quieres eliminar "${routineToDelete.name}"?`} onConfirm={handleDelete} onCancel={() => setRoutineToDelete(null)} />}
            <div className="p-4 sm:p-6">
                {userRoutines.length > 0 ? (
                    <div className="space-y-4">
                        {userRoutines.map((r, i) => (
                             <div key={r.id} className="relative group bg-surface-bg p-5 rounded-3xl border border-surface-border hover:border-brand-accent/30 hover:bg-surface-hover transition-all animate-fade-in-up cursor-pointer overflow-hidden shadow-sm active:scale-95 hover:shadow-lg" onClick={() => onSelectRoutine(r)} style={{animationDelay: `${i * 50}ms`}}>
                                 {/* Background Glow */}
                                 <div className="absolute -right-10 -top-10 w-32 h-32 bg-brand-accent/5 rounded-full blur-2xl group-hover:bg-brand-accent/10 transition-colors pointer-events-none"></div>

                                  <div className="flex w-full items-center gap-5 text-left relative z-10">
                                     <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 bg-surface-bg border border-surface-border shadow-inner transition-colors ${r.type === 'strength' ? 'text-brand-protein group-hover:border-brand-protein/30' : r.type === 'cardio' ? 'text-brand-fat group-hover:border-brand-fat/30' : 'text-brand-accent group-hover:border-brand-accent/30'}`}>
                                         <RoutineTypeIcon type={r.type} className="w-7 h-7" />
                                     </div>
                                     <div className="flex-grow min-w-0">
                                         <h3 className="font-black text-text-primary text-base truncate uppercase tracking-tight group-hover:text-white transition-colors">{r.name}</h3>
                                         <div className="flex items-center gap-2 mt-2">
                                            <span className="text-[9px] font-bold text-text-secondary bg-surface-hover px-2 py-1 rounded-md border border-surface-border uppercase tracking-wider">{r.flow.length} Ejercicios</span>
                                            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border border-surface-border bg-surface-hover ${r.type === 'strength' ? 'text-brand-protein' : 'text-brand-accent'}`}>{getRoutineTypeLabel(r.type)}</span>
                                         </div>
                                     </div>
                                     <div className="bg-surface-bg p-2.5 rounded-full text-text-secondary group-hover:text-white group-hover:bg-white/10 transition-all border border-surface-border">
                                        <ChevronRightIcon className="w-5 h-5" />
                                     </div>
                                 </div>
                                 
                                 {r.isUserCreated && (
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); setRoutineToDelete(r); }} 
                                        className="absolute top-3 right-3 p-2 bg-red-500/10 text-red-400 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white scale-90 group-hover:scale-100 hover:shadow-lg"
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
}

// --- ROUTINE MANAGEMENT FLOW ---

const RoutinesManagementFlow: React.FC<{ 
    onBack: () => void, 
    mode: 'routines' | 'planner', 
    initialRoutine?: RoutineTask | 'new' 
}> = ({ onBack, mode, initialRoutine }) => {
    const getInitialState = () => {
        if (initialRoutine === 'new') return null;
        if (initialRoutine) return initialRoutine;
        return undefined;
    };

    const [editingRoutine, setEditingRoutine] = useState<RoutineTask | null | undefined>(getInitialState());

    const handleBackFromEditor = () => {
        if (initialRoutine !== undefined) {
            onBack();
        } else {
            setEditingRoutine(undefined);
        }
    };

    if (editingRoutine !== undefined) {
        return <RoutineEditor onBack={handleBackFromEditor} existingRoutine={editingRoutine || undefined} />;
    }
    
    if (mode === 'planner') {
        return <WeeklyPlannerView onBack={onBack} />;
    }
    
    // Removed the bg-[var(--color-bg-base)] class here as well
    return (
        <div className="animate-fade-in-up">
             <header className="p-4 sm:p-6 pb-2 pt-6">
                <Button variant="tertiary" onClick={onBack} icon={ChevronRightIcon} className="mb-4 !p-0 [&_svg]:rotate-180 text-text-secondary hover:text-white self-start">
                    Volver
                </Button>
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight uppercase">
                            Mis Rutinas
                        </h1>
                    </div>
                    <Button onClick={() => setEditingRoutine(null)} variant="high-contrast" icon={PlusIcon} size="small" className="!py-2.5 !px-5 text-xs shadow-lg shadow-brand-accent/20">
                        Crear
                    </Button>
                </div>
            </header>
            
            <RoutinesListView onSelectRoutine={setEditingRoutine} />
        </div>
    )
};

export default RoutinesManagementFlow;
