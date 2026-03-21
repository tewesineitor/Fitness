import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../contexts';
import { Exercise, RoutineStep, RoutineTask, RoutineTaskType, StrengthStep, TimeOfDay, YogaStep } from '../../../types';
import Button from '../../../components/Button';
import DialogSectionCard from '../../../components/DialogSectionCard';
import FloatingDock from '../../../components/FloatingDock';
import OptionTile from '../../../components/OptionTile';
import SelectField from '../../../components/SelectField';
import StepperControl from '../../../components/StepperControl';
import { defaultRoutines } from '../../../data';
import * as actions from '../../../actions';
import { CheckIcon, PlusIcon, TrashIcon, ChevronRightIcon } from '../../../components/icons';
import { routineTypes } from './routineTypes';
import AddExerciseModal from './AddExerciseModal';

const MetricInput: React.FC<{
    label: string;
    value: string | number;
    onChange: (val: string) => void;
    type?: string;
    unit?: string;
}> = ({ label, value, onChange, type = 'text', unit }) => (
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

const RoutineEditor: React.FC<{ onBack: () => void; existingRoutine?: RoutineTask }> = ({ onBack, existingRoutine }) => {
    const { dispatch } = useContext(AppContext)!;
    const [name, setName] = useState(existingRoutine?.name || '');
    const [type, setType] = useState<RoutineTaskType>(existingRoutine?.type || 'strength');
    const [flow, setFlow] = useState<RoutineStep[]>(existingRoutine?.flow || []);
    const [showAddExercise, setShowAddExercise] = useState(false);

    useEffect(() => {
        if (existingRoutine) {
            setFlow(existingRoutine.flow);
            return;
        }

        if (type === 'strength') {
            const warmupFlow = defaultRoutines.find(r => r.id === 'default-warmup')?.flow || [];
            const cooldownFlow = defaultRoutines.find(r => r.id === 'default-cooldown')?.flow || [];
            setFlow([...warmupFlow, ...cooldownFlow]);
        } else {
            setFlow([]);
        }
    }, [type, existingRoutine]);

    const handleSave = () => {
        if (!name.trim()) {
            alert('Por favor, dale un nombre a la rutina.');
            return;
        }

        const routineData = { name, type, flow, timeOfDay: 'MaÃ±ana' as TimeOfDay };
        if (existingRoutine && existingRoutine.id.includes('user-routine')) {
            dispatch(actions.updateUserRoutine({ ...existingRoutine, ...routineData }));
        } else {
            dispatch(actions.addUserRoutine(routineData));
        }
        onBack();
    };

    const addExerciseStep = (exercise: Exercise) => {
        const newStep: RoutineStep = exercise.category === 'fuerza'
            ? { type: 'exercise', exerciseId: exercise.id, title: exercise.name, sets: 3, reps: '8-12', rir: '2', rest: 90 }
            : { type: 'pose', exerciseId: exercise.id, title: exercise.name, duration: 60 };

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

    return (
        <div className="animate-fade-in-up relative flex flex-col">
            {showAddExercise && <AddExerciseModal onSelect={addExerciseStep} onClose={() => setShowAddExercise(false)} />}

            <div className="p-4 sm:p-6 space-y-6 hide-scrollbar">
                <div className="animate-fade-in-up pt-4">
                    <div className="flex items-center justify-between mb-6">
                        <Button variant="tertiary" onClick={onBack} icon={ChevronRightIcon} className="!p-0 text-text-secondary hover:text-text-primary [&_svg]:rotate-180">
                            Volver
                        </Button>
                    </div>

                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-2 opacity-70">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-accent shadow-[0_0_8px_currentColor]"></div>
                            <span className="text-[10px] font-bold text-brand-accent uppercase tracking-[0.2em]">Configuracion de Rutina</span>
                        </div>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="NOMBRE DE LA RUTINA..."
                            className="w-full bg-transparent p-0 text-3xl sm:text-4xl font-black text-text-primary placeholder:text-surface-border/30 outline-none transition-all uppercase tracking-tight border-none focus:ring-0"
                        />
                    </div>

                    <div className="bg-surface-hover p-1 rounded-xl border border-surface-border flex w-full mb-8 overflow-hidden">
                        {routineTypes.map(rt => {
                            const isSelected = type === rt.value;
                            const Icon = rt.icon;
                            return (
                                <button
                                    key={rt.value}
                                    onClick={() => setType(rt.value)}
                                    className={`flex-1 flex flex-row items-center justify-center gap-1.5 py-2.5 rounded-lg transition-all duration-200 ${isSelected ? 'bg-white text-black shadow-sm font-bold' : 'text-text-secondary hover:text-text-primary hover:bg-white/5 font-medium'}`}
                                >
                                    <Icon className="w-4 h-4 flex-shrink-0" />
                                    <span className="text-[10px] sm:text-xs uppercase tracking-wider truncate">{rt.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

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
                                <div key={index} className="bg-surface-bg rounded-2xl overflow-hidden border border-surface-border group animate-fade-in-up hover:border-brand-accent/30 transition-all hover:shadow-lg shadow-sm" style={{ animationDelay: `${index * 50}ms` }}>
                                    <div className="flex items-center gap-4 p-4 bg-gradient-to-b from-white/5 to-transparent">
                                        <div className="w-8 h-8 rounded-lg bg-surface-bg text-brand-accent flex items-center justify-center text-xs font-bold border border-surface-border font-mono shadow-inner">
                                            {index + 1}
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <h4 className="font-black text-text-primary text-sm truncate uppercase tracking-tight group-hover:text-brand-accent transition-colors">{s.title}</h4>
                                        </div>
                                        <Button variant="destructive" size="small" onClick={() => removeStep(index)} className="!p-2 rounded-lg" icon={TrashIcon} />
                                    </div>

                                    <div className="grid grid-cols-4 gap-2 p-4 pt-0">
                                        <MetricInput label="Sets" value={s.sets} onChange={v => updateStep(index, { ...s, sets: +v })} type="number" />
                                        <MetricInput label="Reps" value={s.reps} onChange={v => updateStep(index, { ...s, reps: v })} />
                                        <MetricInput label="RIR" value={s.rir} onChange={v => updateStep(index, { ...s, rir: v })} />
                                        <MetricInput label="Rest" value={s.rest} onChange={v => updateStep(index, { ...s, rest: +v })} type="number" unit="s" />
                                    </div>
                                </div>
                            );
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
                                            <MetricInput label="Tiempo" value={s.duration} onChange={v => updateStep(index, { ...s, duration: +v })} type="number" unit="s" />
                                        </div>
                                        <Button variant="destructive" size="small" onClick={() => removeStep(index)} className="!p-2 rounded-lg" icon={TrashIcon} />
                                    </div>
                                </div>
                            );
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
                                    <Button variant="destructive" size="small" onClick={() => removeStep(index)} className="!p-2 rounded-lg" icon={TrashIcon} />
                                </div>
                            );
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
                        <span className="text-xs font-bold text-text-secondary group-hover:text-text-primary uppercase tracking-[0.2em] transition-colors">AÃ±adir Ejercicio</span>
                    </button>
                </div>
            </div>

            <FloatingDock>
                <Button onClick={() => handleSave()} variant="high-contrast" className="w-full shadow-[0_0_30px_rgba(34,211,238,0.2)]" size="large" icon={CheckIcon}>
                    {existingRoutine ? 'GUARDAR CAMBIOS' : 'CREAR RUTINA'}
                </Button>
            </FloatingDock>
        </div>
    );
};

export default RoutineEditor;
