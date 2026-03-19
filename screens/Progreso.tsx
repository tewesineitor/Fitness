
import React, { useState, useContext } from 'react';
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

type SubScreen = 'main' | 'gallery' | 'history' | 'session-detail';
type TimeRange = '1M' | '3M' | '6M' | 'ALL';
type ChartType = 'body' | 'strength' | 'cardio';

const Progreso: React.FC = () => {
    const { state, dispatch } = useContext(AppContext)!;
    const [subScreen, setSubScreen] = useState<SubScreen>('main');
    const [selectedSession, setSelectedSession] = useState<HistorialDeSesionesEntry | null>(null);
    const [chartTimeRange, setChartTimeRange] = useState<TimeRange>('1M');
    const [activeChart, setActiveChart] = useState<ChartType>('body');

    // Navigation Handlers
    const goMain = () => { setSubScreen('main'); setSelectedSession(null); dispatch({ type: 'SET_BOTTOM_NAV_VISIBLE', payload: true }); };
    const goSub = (screen: SubScreen) => { setSubScreen(screen); dispatch({ type: 'SET_BOTTOM_NAV_VISIBLE', payload: false }); };
    
    // Safety cleanup: Ensure nav is visible when leaving this screen
    React.useEffect(() => {
        return () => {
            dispatch({ type: 'SET_BOTTOM_NAV_VISIBLE', payload: true });
        };
    }, [dispatch]);

    const handleViewSession = (session: HistorialDeSesionesEntry) => {
        setSelectedSession(session);
        goSub('session-detail');
    };

    // --- SUB-SCREENS RENDER ---
    if (subScreen === 'gallery') return <ProgressGallery photos={state.progress.metricHistory} onClose={goMain} />;
    if (subScreen === 'history') return <SessionHistoryList history={state.workout.historialDeSesiones} onBack={goMain} onViewSession={handleViewSession} />;
    if (subScreen === 'session-detail' && selectedSession) return <WorkoutSummaryScreen historicalEntry={selectedSession} onExit={goMain} isHistoricalView={true} />;

    // --- MAIN DASHBOARD ---
    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <header className="pt-8 pb-2 animate-fade-in-up">
                <h1 className="text-4xl sm:text-5xl font-black text-text-primary tracking-tighter uppercase leading-none mb-2 drop-shadow-sm">
                    Mis <span className="text-brand-accent">Métricas</span>
                </h1>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-text-secondary flex items-center gap-2">
                    <span className="w-2 h-2 bg-brand-accent rounded-full shadow-[0_0_8px_rgba(var(--color-brand-accent-rgb),0.6)]"></span>
                    Análisis de rendimiento
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Column: Metrics Chart & History */}
                <div className="lg:col-span-8 space-y-6 flex flex-col">
                    {/* Main Chart Card */}
                    <section className="animate-fade-in-up flex-grow" style={{ animationDelay: '50ms' }}>
                        <div className="bg-surface-bg border border-surface-border rounded-3xl overflow-hidden shadow-lg relative flex flex-col h-full min-h-[500px]">
                            {/* Header & Controls */}
                            <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-surface-border/50 bg-white/[0.02] flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-20">
                                <div className="flex bg-surface-hover/50 p-1 rounded-xl border border-surface-border/50 backdrop-blur-md">
                                    {[
                                        { id: 'body', label: 'Corporal' },
                                        { id: 'strength', label: 'Fuerza' },
                                        { id: 'cardio', label: 'Cardio' }
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveChart(tab.id as ChartType)}
                                            className={`
                                                px-4 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest rounded-lg transition-all
                                                ${activeChart === tab.id 
                                                    ? 'bg-white text-black shadow-sm' 
                                                    : 'text-text-secondary hover:text-white hover:bg-white/5'
                                                }
                                            `}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex bg-surface-hover/50 border border-surface-border/50 rounded-lg p-1 shadow-sm backdrop-blur-md">
                                    {[{v:'1M', l:'1M'}, {v:'3M', l:'3M'}, {v:'ALL', l:'MAX'}].map((opt) => (
                                        <button
                                            key={opt.v}
                                            onClick={() => setChartTimeRange(opt.v as TimeRange)}
                                            className={`
                                                px-2.5 py-1 text-[10px] font-bold rounded-md transition-all uppercase tracking-wider
                                                ${chartTimeRange === opt.v 
                                                    ? 'bg-white text-black shadow-sm' 
                                                    : 'text-text-secondary hover:text-white'
                                                }
                                            `}
                                        >
                                            {opt.l}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Chart Container */}
                            <div className="p-4 sm:p-6 flex-grow w-full relative z-10 flex flex-col min-h-[400px]">
                                {activeChart === 'body' && <ProgressChart timeRange={chartTimeRange} />}
                                {activeChart === 'strength' && <StrengthChart timeRange={chartTimeRange} />}
                                {activeChart === 'cardio' && <CarreraChart timeRange={chartTimeRange} />}
                            </div>
                            
                            {/* Subtle Back Glow */}
                            <div className={`
                                absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[120px] pointer-events-none opacity-10 transition-colors duration-700
                                ${activeChart === 'body' ? 'bg-brand-accent' : activeChart === 'strength' ? 'bg-blue-500' : 'bg-green-500'}
                            `}></div>
                        </div>
                    </section>

                    {/* History Widget */}
                    <section className="animate-fade-in-up" style={{ animationDelay: '150ms' }}>
                        <HistoryWidget onShowHistoryList={() => goSub('history')} onViewHistoricalSession={handleViewSession} />
                    </section>
                </div>

                {/* Right Column: Anatomical Evolution & Gallery */}
                <div className="lg:col-span-4 space-y-6 flex flex-col">
                    {/* Anatomical Evolution */}
                    <section className="animate-fade-in-up flex-grow" style={{ animationDelay: '100ms' }}>
                        <AnatomicalEvolutionCard />
                    </section>

                    {/* Gallery Widget */}
                    <section className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                        <GalleryWidget onShowGallery={() => goSub('gallery')} />
                    </section>
                </div>

            </div>
        </div>
    );
};

export default Progreso;
