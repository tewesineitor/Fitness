
import React, { useState, useContext, useMemo } from 'react';
import { HistorialDeSesionesEntry } from '../types';
import { AppContext } from '../contexts';
import { GalleryWidget, HistoryWidget } from '../components/ProgressWidgetsGrid';
import { WorkoutSummaryScreen } from './WorkoutSummary';
import ProgressGallery from './progreso/ProgressGallery';
import SessionHistoryList from './progreso/SessionHistoryList';
import ProgressChart from '../components/charts/ProgressChart';
import StrengthChart from '../components/charts/StrengthChart';
import CarreraChart from '../components/charts/CarreraChart';
import AnatomicalEvolutionCard from '../components/progreso/AnatomicalEvolutionCard';
import StatChip from '../components/StatChip';
import PillTabs from '../components/PillTabs';
import { selectProgressState } from '../selectors/progressSelectors';
import { ScaleIcon, StrengthIcon, CardioIcon } from '../components/icons';

type SubScreen = 'main' | 'gallery' | 'history' | 'session-detail';
type TimeRange = '1M' | '3M' | 'ALL';
type ChartType = 'body' | 'strength' | 'cardio';

// ── Glow accent per chart type — using design system tokens ─────────────────
const chartGlow: Record<ChartType, string> = {
    body:     'bg-brand-accent',
    strength: 'bg-brand-protein',
    cardio:   'bg-success',
};

const Progreso: React.FC = () => {
    const { state, dispatch } = useContext(AppContext)!;
    const progress = selectProgressState(state);

    const [subScreen, setSubScreen] = useState<SubScreen>('main');
    const [selectedSession, setSelectedSession] = useState<HistorialDeSesionesEntry | null>(null);
    const [chartTimeRange, setChartTimeRange] = useState<TimeRange>('1M');
    const [activeChart, setActiveChart] = useState<ChartType>('body');

    // Navigation
    const goMain = () => {
        setSubScreen('main');
        setSelectedSession(null);
        dispatch({ type: 'SET_BOTTOM_NAV_VISIBLE', payload: true });
    };
    const goSub = (screen: SubScreen) => {
        setSubScreen(screen);
        dispatch({ type: 'SET_BOTTOM_NAV_VISIBLE', payload: false });
    };

    React.useEffect(() => {
        return () => { dispatch({ type: 'SET_BOTTOM_NAV_VISIBLE', payload: true }); };
    }, [dispatch]);

    const handleViewSession = (session: HistorialDeSesionesEntry) => {
        setSelectedSession(session);
        goSub('session-detail');
    };

    // ── Derive latest stat values ──────────────────────────────────────────
    const latestMetrics = useMemo(() => {
        const sorted = [...(progress?.metricHistory ?? [])].sort(
            (a, b) => new Date(b.fecha_registro).getTime() - new Date(a.fecha_registro).getTime()
        );
        const latest = sorted[0];
        const prev   = sorted[1];
        return {
            weight:       latest?.peso_kg  ?? null,
            prevWeight:   prev?.peso_kg    ?? null,
            waist:        latest?.cintura_cm ?? null,
            sessions:     state.workout.historialDeSesiones.length,
        };
    }, [progress, state.workout.historialDeSesiones]);

    const weightTrend = latestMetrics.weight !== null && latestMetrics.prevWeight !== null
        ? (latestMetrics.weight < latestMetrics.prevWeight ? 'down' : latestMetrics.weight > latestMetrics.prevWeight ? 'up' : 'neutral')
        : undefined;

    // ── Sub-screens ────────────────────────────────────────────────────────
    if (subScreen === 'gallery') return <ProgressGallery photos={progress.metricHistory} onClose={goMain} />;
    if (subScreen === 'history') return <SessionHistoryList history={state.workout.historialDeSesiones} onBack={goMain} onViewSession={handleViewSession} />;
    if (subScreen === 'session-detail' && selectedSession) return <WorkoutSummaryScreen historicalEntry={selectedSession} onExit={goMain} isHistoricalView={true} />;

    // ── Main dashboard ─────────────────────────────────────────────────────
    return (
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 pb-32">
            {/* ── HEADER ─────────────────────────────────────────────── */}
            <header className="pt-6 pb-4 animate-fade-in-up">
                <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight leading-none">
                    Mis <span className="text-brand-accent">Métricas</span>
                </h1>
                <p className="text-[10px] uppercase tracking-[0.2em] text-text-secondary flex items-center gap-2 mt-2">
                    <span className="w-1.5 h-1.5 bg-brand-accent rounded-full" />
                    Análisis de rendimiento
                </p>
            </header>

            {/* ── STAT CHIP ROW — bento 2-col ───────────────────────── */}
            <div
                className="grid grid-cols-3 gap-3 mb-3 animate-fade-in-up"
                style={{ animationDelay: '60ms' }}
            >
                <StatChip
                    value={latestMetrics.weight !== null ? latestMetrics.weight.toFixed(1) : '—'}
                    unit="kg"
                    label="Peso"
                    trend={weightTrend as any}
                    colorClass="text-brand-accent"
                />
                <StatChip
                    value={latestMetrics.waist !== null ? latestMetrics.waist.toFixed(0) : '—'}
                    unit="cm"
                    label="Cintura"
                    colorClass="text-brand-carbs"
                />
                <StatChip
                    value={latestMetrics.sessions}
                    unit="ses."
                    label="Sesiones"
                    colorClass="text-brand-protein"
                />
            </div>

            {/* ── CHART PANEL ──────────────────────────────────────────── */}
            <section
                className="bg-surface-bg rounded-2xl border border-surface-border shadow-sm overflow-hidden mb-3 animate-fade-in-up"
                style={{ animationDelay: '120ms' }}
            >
                {/* Controls bar */}
                <div className="px-4 pt-4 pb-3 border-b border-surface-border/50 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {/* Chart type: PillTabs */}
                    <PillTabs
                        tabs={[
                            { id: 'body',     label: 'Corporal', icon: ScaleIcon    },
                            { id: 'strength', label: 'Fuerza',   icon: StrengthIcon  },
                            { id: 'cardio',   label: 'Cardio',   icon: CardioIcon    },
                        ]}
                        activeTab={activeChart}
                        onChange={(id) => setActiveChart(id as ChartType)}
                        className="sm:max-w-[280px]"
                    />

                    {/* Time range pills */}
                    <div className="flex gap-1 bg-surface-hover/40 border border-surface-border rounded-xl p-1 self-start sm:self-auto">
                        {(['1M', '3M', 'ALL'] as TimeRange[]).map((opt) => (
                            <button
                                key={opt}
                                onClick={() => setChartTimeRange(opt)}
                                className={[
                                    'px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all duration-200 active:scale-95',
                                    chartTimeRange === opt
                                        ? 'bg-brand-accent text-white shadow-sm'
                                        : 'text-text-secondary hover:text-text-primary',
                                ].join(' ')}
                            >
                                {opt === 'ALL' ? 'MAX' : opt}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chart area — responsive height */}
                <div className="p-4 relative min-h-[280px] sm:min-h-[360px] flex flex-col">
                    {/* Semantic glow — no hardcoded colors */}
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-[100px] pointer-events-none opacity-5 transition-colors duration-700 ${chartGlow[activeChart]}`} />

                    <div className="flex-grow w-full relative z-10">
                        {activeChart === 'body'     && <ProgressChart  timeRange={chartTimeRange} />}
                        {activeChart === 'strength' && <StrengthChart  timeRange={chartTimeRange} />}
                        {activeChart === 'cardio'   && <CarreraChart   timeRange={chartTimeRange} />}
                    </div>
                </div>
            </section>

            {/* ── BENTO ROW: EVOLUTION + GALLERY ───────────────────────── */}
            <div
                className="grid grid-cols-2 gap-3 mb-3 animate-fade-in-up"
                style={{ animationDelay: '180ms' }}
            >
                <div className="col-span-2 sm:col-span-1">
                    <AnatomicalEvolutionCard />
                </div>
                <div className="col-span-2 sm:col-span-1">
                    <GalleryWidget onShowGallery={() => goSub('gallery')} />
                </div>
            </div>

            {/* ── SESSION HISTORY ───────────────────────────────────────── */}
            <section
                className="animate-fade-in-up"
                style={{ animationDelay: '240ms' }}
            >
                <HistoryWidget
                    onShowHistoryList={() => goSub('history')}
                    onViewHistoricalSession={handleViewSession}
                />
            </section>
        </div>
    );
};

export default Progreso;
