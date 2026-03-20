
import * as React from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AppContext } from '../../contexts';
import { DesgloseCardioLibre } from '../../types';
import { CardioIcon, MountainIcon, FireIcon } from '../icons';

type TimeRange = '1M' | '3M' | '6M' | 'ALL';
type ActivityType = 'carrera' | 'senderismo' | 'rucking';
type ChartPoint = {
    date: string;
    fullDate: number;
    distancia: number;
    ritmo: number;
};

type TooltipPayloadItem = {
    payload: ChartPoint;
};

type ChartTooltipProps = {
    active?: boolean;
    payload?: TooltipPayloadItem[];
    label?: string;
    color: string;
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

const formatPace = (pace: number) => {
    const mins = Math.floor(pace);
    const secs = Math.round((pace - mins) * 60);
    return `${mins}'${secs.toString().padStart(2, '0')}"`;
};

const CustomTooltip = ({ active, payload, label, color }: ChartTooltipProps) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-surface-bg/90 border border-surface-border px-3 py-2 rounded-lg shadow-sm backdrop-blur-md ring-1 ring-white/5">
                <p className="text-[9px] text-text-secondary uppercase tracking-wider mb-1">{label}</p>
                <div className="space-y-0.5">
                    <p className="text-sm font-bold text-white flex justify-between gap-4">
                        <span>Distancia</span>
                        <span className="font-heading">{data.distancia.toFixed(2)} km</span>
                    </p>
                    <p className="text-xs font-bold flex justify-between gap-4" style={{ color: color }}>
                        <span>Ritmo</span>
                        <span className="font-heading">{formatPace(data.ritmo)} /km</span>
                    </p>
                </div>
            </div>
        );
    }
    return null;
};

const CarreraChart: React.FC<{ timeRange: TimeRange }> = ({ timeRange }) => {
    const { state } = React.useContext(AppContext)!;
    const { historialDeSesiones } = state.workout;
    const [activityType, setActivityType] = React.useState<ActivityType>('carrera');

    const config = React.useMemo(() => {
        if (activityType === 'carrera') {
            return { 
                icon: CardioIcon, 
                color: '#FF4E00', // Neon Orange
                fill: 'rgba(255, 78, 0, 0.4)', 
                label: 'Carrera' 
            };
        } else if (activityType === 'senderismo') {
            return { 
                icon: MountainIcon, 
                color: '#FF006A', // Neon Pink
                fill: 'rgba(255, 0, 106, 0.4)', 
                label: 'Senderismo' 
            };
        } else {
            return { 
                icon: FireIcon, 
                color: '#00FF00', // Neon Green
                fill: 'rgba(0, 255, 0, 0.4)', 
                label: 'Rucking' 
            };
        }
    }, [activityType]);

    const { chartData, stats } = React.useMemo(() => {
        const cutoffDate = getCutoffDate(timeRange);
        const routineType = activityType === 'carrera' ? 'cardioLibre' : activityType === 'senderismo' ? 'senderismo' : 'rucking';

        const data = historialDeSesiones
            .filter(s => s.tipo_rutina === routineType && new Date(s.fecha_completado) >= cutoffDate)
            .map(s => {
                const d = s.desglose_ejercicios[0] as DesgloseCardioLibre;
                if (!d || d.distance <= 0) return null;
                return {
                    date: new Date(s.fecha_completado).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
                    fullDate: new Date(s.fecha_completado).getTime(),
                    distancia: d.distance,
                    ritmo: d.duration / d.distance
                };
            })
            .filter((item): item is ChartPoint => item !== null)
            .sort((a, b) => a.fullDate - b.fullDate);

        if (data.length === 0) return { chartData: [], stats: null };

        const totalDist = data.reduce((acc, curr) => acc + curr.distancia, 0);
        const validPaces = data.map((d) => d.ritmo).filter((r) => r > 0 && r < 30);
        const bestPace = validPaces.length > 0 ? Math.min(...validPaces) : 0;

        return { chartData: data, stats: { totalDist, bestPace, count: data.length } };
    }, [historialDeSesiones, timeRange, activityType]);

    return (
        <div className="w-full h-full flex flex-col">
            {/* 1. Sub-Tabs */}
            <div className="flex justify-center mb-3">
                <div className="flex bg-surface-bg p-1 rounded-xl border border-surface-border shadow-sm overflow-x-auto hide-scrollbar">
                    <button 
                        onClick={() => setActivityType('carrera')} 
                        className={`
                            flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap
                            ${activityType === 'carrera' ? 'bg-brand-accent text-black shadow-sm' : 'text-text-secondary hover:text-white'}
                        `}
                    >
                        <CardioIcon className="w-3 h-3" /> Carrera
                    </button>
                    <button 
                        onClick={() => setActivityType('senderismo')} 
                        className={`
                            flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap
                            ${activityType === 'senderismo' ? 'bg-white text-black shadow-sm' : 'text-text-secondary hover:text-white'}
                        `}
                    >
                        <MountainIcon className="w-3 h-3" /> Senderismo
                    </button>
                    <button 
                        onClick={() => setActivityType('rucking')} 
                        className={`
                            flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap
                            ${activityType === 'rucking' ? 'bg-brand-protein text-black shadow-sm' : 'text-text-secondary hover:text-white'}
                        `}
                    >
                        <FireIcon className="w-3 h-3" /> Rucking
                    </button>
                </div>
            </div>

            {/* 2. Stats Grid */}
            {stats ? (
                <div className="grid grid-cols-2 gap-8 mb-2 pl-1">
                    <div>
                        <p className="text-[9px] font-bold text-text-secondary uppercase tracking-[0.2em] mb-1">Distancia Total</p>
                        <p className="text-3xl font-black font-heading text-white leading-none">
                            {stats.totalDist.toFixed(1)}<span className="text-xs ml-1 text-text-secondary font-sans">km</span>
                        </p>
                    </div>
                    <div>
                        <p className="text-[9px] font-bold text-text-secondary uppercase tracking-[0.2em] mb-1">Mejor Ritmo</p>
                        <p className="text-3xl font-black font-heading leading-none" style={{ color: config.color }}>
                            {formatPace(stats.bestPace)}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="mb-2 pl-1 h-[52px]">
                     <p className="text-[9px] font-bold text-text-secondary uppercase tracking-[0.2em]">Sin datos</p>
                </div>
            )}

            {/* 3. Chart */}
            <div className="flex-grow w-full relative min-h-0 -ml-2">
                {chartData.length < 1 ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-text-secondary border border-dashed border-surface-border rounded-2xl bg-surface-hover/50">
                        <config.icon className="w-8 h-8 opacity-20 mb-2" />
                        <p className="text-xs font-bold uppercase opacity-50">Sin actividad reciente</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                        <ComposedChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis 
                                dataKey="date" 
                                tick={{ fontSize: 9, fill: '#A3A3A3', fontWeight: 600 }} 
                                axisLine={false} 
                                tickLine={false} 
                                dy={10}
                                xAxisId={0}
                            />
                            <YAxis 
                                yAxisId="left"
                                tick={{ fontSize: 9, fill: '#A3A3A3', fontWeight: 600 }} 
                                axisLine={false} 
                                tickLine={false}
                                width={40}
                            />
                            <YAxis yAxisId="right" orientation="right" hide />
                            <Tooltip content={<CustomTooltip color={config.color} />} cursor={{ fill: 'rgba(255,255,255,0.03)', radius: 6 }} />
                            
                            <Bar 
                                yAxisId="left" 
                                dataKey="distancia" 
                                fill={config.fill} 
                                radius={[4, 4, 0, 0]} 
                                barSize={20} 
                            />
                            <Line 
                                yAxisId="right" 
                                type="monotone" 
                                dataKey="ritmo" 
                                stroke={config.color} 
                                strokeWidth={2} 
                                dot={{r:3, strokeWidth:0}} 
                                activeDot={{r:5, strokeWidth:0}} 
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};

export default CarreraChart;
