
import * as React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AppContext } from '../../contexts';
import { DesgloseFuerza } from '../../types';
import { ChevronRightIcon } from '../icons';
import Tag from '../Tag';

type TimeRange = '1M' | '3M' | '6M' | 'ALL';
type ChartPoint = {
    date: string;
    fullDate: number;
    value: number;
};

type TooltipPayloadItem = {
    value: number;
};

type ChartTooltipProps = {
    active?: boolean;
    payload?: TooltipPayloadItem[];
    label?: string;
};

const getCutoffDate = (range: TimeRange): Date => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    switch (range) {
        case '1M': date.setMonth(date.getMonth() - 1); break;
        case '3M': date.setMonth(date.getMonth() - 3); break;
        case '6M': date.setMonth(date.getMonth() - 6); break;
        case 'ALL': return new Date(0);
    }
    return date;
};

const calculateE1RM = (weight: number, reps: number) => {
    if (reps === 1) return weight;
    return weight * (1 + reps / 30);
};

const CustomTooltip = ({ active, payload, label }: ChartTooltipProps) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-surface-bg/90 border border-surface-border px-3 py-2 rounded-lg shadow-sm backdrop-blur-md ring-1 ring-white/5">
                <p className="text-[9px] text-text-secondary uppercase tracking-wider mb-0.5">{label}</p>
                <p className="text-sm font-black font-heading text-text-primary">
                    {payload[0].value.toFixed(1)} <span className="text-[10px] text-brand-protein font-sans">kg</span>
                </p>
            </div>
        );
    }
    return null;
};

const StrengthChart: React.FC<{ timeRange: TimeRange }> = ({ timeRange }) => {
    const { state } = React.useContext(AppContext)!;
    const { historialDeSesiones, allExercises } = state.workout;
    const [selectedExerciseId, setSelectedExerciseId] = React.useState<string | null>(null);

    const performedExercises = React.useMemo(() => {
        const ids = new Set<string>();
        historialDeSesiones.forEach(s => {
            if (s.tipo_rutina === 'strength') {
                s.desglose_ejercicios.forEach(ex => { if ('exerciseId' in ex) ids.add(ex.exerciseId); });
            }
        });
        return Array.from(ids).map(id => allExercises[id]).filter(Boolean);
    }, [historialDeSesiones, allExercises]);

    React.useEffect(() => {
        if (!selectedExerciseId && performedExercises.length > 0) {
            setSelectedExerciseId(performedExercises[0].id);
        }
    }, [performedExercises, selectedExerciseId]);

    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const { chartData, stats, minVal, maxVal } = React.useMemo(() => {
        if (!selectedExerciseId) return { chartData: [], stats: null, minVal: 0, maxVal: 100 };
        
        const cutoffDate = getCutoffDate(timeRange);
        const data: ChartPoint[] = [];
        
        for (const session of historialDeSesiones) {
            const date = new Date(session.fecha_completado);
            if (session.tipo_rutina === 'strength' && date >= cutoffDate) {
                const exData = session.desglose_ejercicios.find(e => 'exerciseId' in e && e.exerciseId === selectedExerciseId) as DesgloseFuerza | undefined;
                if (exData && exData.sets) {
                    let bestE1RM = 0;
                    exData.sets.forEach(s => {
                        if (s.reps > 0) bestE1RM = Math.max(bestE1RM, calculateE1RM(s.weight, s.reps));
                    });
                    if (bestE1RM > 0) {
                        data.push({
                            date: date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
                            fullDate: date.getTime(),
                            value: bestE1RM
                        });
                    }
                }
            }
        }

        const sortedData = data.sort((a, b) => a.fullDate - b.fullDate);
        if (sortedData.length === 0) return { chartData: [], stats: null, minVal: 0, maxVal: 100 };

        const values = sortedData.map(d => d.value);
        const min = Math.min(...values);
        const max = Math.max(...values);
        const padding = (max - min) * 0.05; // 5% padding

        const pr = max;
        const first = values[0];
        const last = values[values.length - 1];
        const improvement = last - first;

        return {
            chartData: sortedData,
            stats: { pr, improvement, current: last },
            minVal: Math.max(0, min - padding),
            maxVal: max + padding
        };

    }, [selectedExerciseId, timeRange, historialDeSesiones]);

    return (
        <div className="w-full h-full flex flex-col">
            {/* 1. Exercise Selector (Custom Dropdown) */}
            <div className="relative mb-3" ref={dropdownRef}>
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full bg-surface-bg border border-surface-border text-text-primary text-xs font-semibold uppercase tracking-[0.16em] rounded-xl py-3 pl-4 pr-10 flex items-center justify-between outline-none focus:border-brand-accent/50 transition-all shadow-sm hover:border-brand-accent/20 hover:bg-surface-hover cursor-pointer"
                >
                    <span className="truncate">
                        {selectedExerciseId 
                            ? performedExercises.find(ex => ex.id === selectedExerciseId)?.name || 'Selecciona un ejercicio'
                            : 'Sin datos'
                        }
                    </span>
                    <ChevronRightIcon className={`w-4 h-4 text-text-secondary transition-transform duration-200 ${isDropdownOpen ? '-rotate-90' : 'rotate-90'}`} />
                </button>
                
                {isDropdownOpen && performedExercises.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-bg-base border border-surface-border rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto hide-scrollbar backdrop-blur-xl">
                        {performedExercises.map(ex => (
                            <button
                                key={ex.id}
                                onClick={() => {
                                    setSelectedExerciseId(ex.id);
                                    setIsDropdownOpen(false);
                                }}
                                className={`w-full text-left px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] transition-colors
                                    ${selectedExerciseId === ex.id 
                                        ? 'bg-brand-accent/10 text-brand-accent' 
                                        : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                                    }
                                `}
                            >
                                {ex.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* 2. Stats Header */}
            {stats && (
                <div className="mb-2 pl-1">
                    <p className="text-[9px] font-bold text-text-secondary uppercase tracking-[0.2em] mb-1">Récord</p>
                    <div className="flex items-center gap-3">
                        <span className="text-3xl font-black font-heading text-text-primary tracking-tight leading-none">
                            {stats.pr.toFixed(1)}<span className="text-xs ml-1 text-text-secondary font-sans">kg</span>
                        </span>
                        <Tag
                            variant="status"
                            tone={stats.improvement === 0 ? 'neutral' : stats.improvement >= 0 ? 'success' : 'danger'}
                            size="md"
                        >
                            {stats.improvement > 0 ? '+' : ''}{stats.improvement.toFixed(1)} kg
                        </Tag>
                    </div>
                </div>
            )}

            {/* 3. The Chart */}
            <div className="flex-grow w-full relative min-h-0 -ml-2">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                    <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="strengthGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis 
                            dataKey="date" 
                            tick={{ fontSize: 9, fill: '#A3A3A3', fontWeight: 600 }} 
                            axisLine={false} 
                            tickLine={false} 
                            dy={10}
                            minTickGap={30}
                            xAxisId={0}
                        />
                        <YAxis 
                            domain={[minVal, maxVal]} 
                            tick={{ fontSize: 9, fill: '#A3A3A3', fontWeight: 600 }} 
                            axisLine={false} 
                            tickLine={false}
                            width={40}
                            tickFormatter={(val) => val.toFixed(0)}
                            yAxisId={0}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
                        <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#3b82f6" 
                            strokeWidth={3} 
                            fillOpacity={1} 
                            fill="url(#strengthGradient)" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default StrengthChart;
