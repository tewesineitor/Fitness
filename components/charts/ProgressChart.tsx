
import * as React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AppContext } from '../../contexts';

type TimeRange = '1M' | '3M' | '6M' | 'ALL';
type MetricKey = 'peso_kg' | 'cintura_cm' | 'caderas_cm' | 'cuello_cm' | 'hombros_cm' | 'pecho_cm' | 'muslo_cm' | 'biceps_cm';
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
    unit: string;
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

const CustomTooltip = ({ active, payload, label, unit }: ChartTooltipProps) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-surface-bg/90 border border-surface-border px-3 py-2 rounded-lg shadow-sm backdrop-blur-md ring-1 ring-white/5">
                <p className="text-[9px] text-text-secondary uppercase tracking-wider mb-0.5">{label}</p>
                <p className="text-sm font-black font-heading text-white">
                    {payload[0].value.toFixed(1)} <span className="text-[10px] text-brand-accent font-sans">{unit}</span>
                </p>
            </div>
        );
    }
    return null;
};

const ProgressChart: React.FC<{ timeRange: TimeRange }> = ({ timeRange }) => {
    const { state } = React.useContext(AppContext)!;
    const { metricHistory } = state.progress;
    const [activeMetric, setActiveMetric] = React.useState<MetricKey>('peso_kg');

    const config: Record<MetricKey, { label: string; unit: string; color: string }> = {
        peso_kg: { label: 'Peso', unit: 'kg', color: '#FF4E00' },
        cintura_cm: { label: 'Cintura', unit: 'cm', color: '#00E5FF' },
        caderas_cm: { label: 'Caderas', unit: 'cm', color: '#FF006A' },
        pecho_cm: { label: 'Pecho', unit: 'cm', color: '#00FF00' },
        hombros_cm: { label: 'Hombros', unit: 'cm', color: '#FFFF00' },
        muslo_cm: { label: 'Muslo', unit: 'cm', color: '#FF00FF' },
        biceps_cm: { label: 'Bíceps', unit: 'cm', color: '#00FFFF' },
        cuello_cm: { label: 'Cuello', unit: 'cm', color: '#FFA500' },
    };

    const { chartData, stats, minVal, maxVal } = React.useMemo(() => {
        if (!metricHistory || metricHistory.length === 0) return { chartData: [], stats: null, minVal: 0, maxVal: 100 };
        
        const cutoffDate = getCutoffDate(timeRange);

        const data: ChartPoint[] = metricHistory
            .filter(entry => entry[activeMetric] !== undefined && entry[activeMetric] !== null && new Date(entry.fecha_registro) >= cutoffDate)
            .map(entry => ({
                date: new Date(entry.fecha_registro).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
                fullDate: new Date(entry.fecha_registro).getTime(),
                value: entry[activeMetric]!,
            }))
            .sort((a, b) => a.fullDate - b.fullDate);

        if (data.length === 0) return { chartData: [], stats: null, minVal: 0, maxVal: 100 };

        const values = data.map(d => d.value);
        const min = Math.min(...values);
        const max = Math.max(...values);
        const padding = (max - min) * 0.05; // 5% padding to maximize chart usage

        const first = values[0];
        const last = values[values.length - 1];
        const change = last - first;

        return { 
            chartData: data, 
            stats: { change, current: last },
            minVal: Math.max(0, min - padding),
            maxVal: max + padding
        };
    }, [metricHistory, activeMetric, timeRange]);
    
    const activeConfig = config[activeMetric];

    return (
        <div className="w-full h-full flex flex-col">
            {/* 1. Metric Selector Pills */}
            <div className="flex gap-2 mb-3 overflow-x-auto hide-scrollbar pb-1">
                {(Object.entries(config) as [MetricKey, (typeof config)[MetricKey]][]).map(([key, conf]) => (
                    <button
                        key={key}
                        onClick={() => setActiveMetric(key)}
                        className={`
                            whitespace-nowrap px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest border transition-all
                            ${activeMetric === key 
                                ? 'bg-white text-black border-white shadow-sm' 
                                : 'bg-transparent text-text-secondary border-surface-border hover:border-white/30 hover:text-white'
                            }
                        `}
                    >
                        {conf.label}
                    </button>
                ))}
            </div>

            {/* 2. Big Stats Display */}
            {stats && (
                <div className="mb-2 pl-1">
                    <p className="text-[9px] font-bold text-text-secondary uppercase tracking-[0.2em] mb-1">Actual</p>
                    <div className="flex items-center gap-3">
                        <span className="text-3xl font-black font-heading text-text-primary tracking-tight leading-none">
                            {stats.current.toFixed(1)}<span className="text-xs ml-1 text-text-secondary font-sans">{activeConfig.unit}</span>
                        </span>
                        <div className={`flex items-center justify-center min-w-[60px] text-[10px] font-bold px-2 py-1 rounded-md ${stats.change <= 0 ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                            {stats.change > 0 ? '+' : ''}{stats.change.toFixed(1)} {activeConfig.unit}
                        </div>
                    </div>
                </div>
            )}

            {/* 3. The Chart */}
            <div className="flex-grow w-full relative min-h-0 -ml-2">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                    <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="bodyGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={activeConfig.color} stopOpacity={0.3}/>
                                <stop offset="95%" stopColor={activeConfig.color} stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
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
                        <Tooltip content={<CustomTooltip unit={activeConfig.unit} />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
                        <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke={activeConfig.color} 
                            strokeWidth={3} 
                            fillOpacity={1} 
                            fill="url(#bodyGradient)" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ProgressChart;
