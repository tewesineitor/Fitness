import React, { useContext, useMemo, useState } from 'react';
import { HistorialDeMetricasEntry, HistorialDeSesionesEntry } from '../types';
import { AppContext } from '../contexts';
import { GalleryWidget, HistoryWidget } from '../components/ProgressWidgetsGrid';
import { WorkoutSummaryScreen } from './WorkoutSummary';
import ProgressGallery from './progreso/ProgressGallery';
import SessionHistoryList from './progreso/SessionHistoryList';
import ProgressChart from '../components/charts/ProgressChart';
import StrengthChart from '../components/charts/StrengthChart';
import CarreraChart from '../components/charts/CarreraChart';
import AnatomicalEvolutionCard from '../components/progreso/AnatomicalEvolutionCard';
import Card from '../components/Card';
import StatChip from '../components/StatChip';
import PillTabs from '../components/PillTabs';
import { selectProgressState } from '../selectors/progressSelectors';
import { ScaleIcon, StrengthIcon, CardioIcon } from '../components/icons';
import type { StatTrend } from '../components/StatChip';
import { PageHeader } from '../components/layout';

type SubScreen = 'main' | 'gallery' | 'history' | 'session-detail';
type TimeRange = '1M' | '3M' | 'ALL';
type ChartType = 'body' | 'strength' | 'cardio';

const chartGlow: Record<ChartType, string> = {
  body: 'bg-brand-accent',
  strength: 'bg-brand-protein',
  cardio: 'bg-success',
};

const Progreso: React.FC = () => {
  const { state, dispatch } = useContext(AppContext)!;
  const progress = selectProgressState(state);

  const [subScreen, setSubScreen] = useState<SubScreen>('main');
  const [selectedSession, setSelectedSession] = useState<HistorialDeSesionesEntry | null>(null);
  const [chartTimeRange, setChartTimeRange] = useState<TimeRange>('1M');
  const [activeChart, setActiveChart] = useState<ChartType>('body');

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
    return () => {
      dispatch({ type: 'SET_BOTTOM_NAV_VISIBLE', payload: true });
    };
  }, [dispatch]);

  const handleViewSession = (session: HistorialDeSesionesEntry) => {
    setSelectedSession(session);
    goSub('session-detail');
  };

  const latestMetrics = useMemo(() => {
    const history = progress?.metricHistory ?? [];
    let latest: HistorialDeMetricasEntry | null = null;
    let prev: HistorialDeMetricasEntry | null = null;
    let latestTime = -Infinity;
    let prevTime = -Infinity;

    for (const entry of history) {
      const entryTime = new Date(entry.fecha_registro).getTime();
      if (entryTime > latestTime) {
        prev = latest;
        prevTime = latestTime;
        latest = entry;
        latestTime = entryTime;
        continue;
      }

      if (entryTime > prevTime) {
        prev = entry;
        prevTime = entryTime;
      }
    }

    return {
      weight: latest?.peso_kg ?? null,
      prevWeight: prev?.peso_kg ?? null,
      waist: latest?.cintura_cm ?? null,
      sessions: state.workout.historialDeSesiones.length,
    };
  }, [progress?.metricHistory, state.workout.historialDeSesiones.length]);

  const weightTrend: StatTrend | undefined = latestMetrics.weight !== null && latestMetrics.prevWeight !== null
    ? (latestMetrics.weight < latestMetrics.prevWeight ? 'down' : latestMetrics.weight > latestMetrics.prevWeight ? 'up' : 'neutral')
    : undefined;

  if (subScreen === 'gallery') {
    return <ProgressGallery photos={progress.metricHistory} onClose={goMain} />;
  }

  if (subScreen === 'history') {
    return <SessionHistoryList history={state.workout.historialDeSesiones} onBack={goMain} onViewSession={handleViewSession} />;
  }

  if (subScreen === 'session-detail' && selectedSession) {
    return <WorkoutSummaryScreen historicalEntry={selectedSession} onExit={goMain} isHistoricalView={true} />;
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 pb-32">
      <PageHeader
        size="compact"
        className="animate-fade-in-up pb-4"
        eyebrow="Panel de progreso"
        title={<>Mis <span className="text-brand-accent">Metricas</span></>}
        subtitle="Analisis de rendimiento"
      />

      <div
        className="grid grid-cols-3 gap-3 mb-3 animate-fade-in-up"
        style={{ animationDelay: '60ms' }}
      >
        <StatChip
          value={latestMetrics.weight !== null ? latestMetrics.weight.toFixed(1) : '-'}
          unit="kg"
          label="Peso"
          trend={weightTrend}
          colorClass="text-brand-accent"
        />
        <StatChip
          value={latestMetrics.waist !== null ? latestMetrics.waist.toFixed(0) : '-'}
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

      <Card
        as="section"
        variant="default"
        className="overflow-hidden mb-3 animate-fade-in-up"
        style={{ animationDelay: '120ms' }}
      >
        <div className="px-4 pt-4 pb-3 border-b border-surface-border/50 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <PillTabs
            tabs={[
              { id: 'body', label: 'Corporal', icon: ScaleIcon },
              { id: 'strength', label: 'Fuerza', icon: StrengthIcon },
              { id: 'cardio', label: 'Cardio', icon: CardioIcon },
            ]}
            activeTab={activeChart}
            onChange={(id) => setActiveChart(id as ChartType)}
            className="sm:max-w-[280px]"
          />

          <div className="flex gap-1 bg-surface-hover/40 border border-surface-border rounded-input p-1 self-start sm:self-auto">
            {(['1M', '3M', 'ALL'] as TimeRange[]).map((opt) => (
              <button
                key={opt}
                onClick={() => setChartTimeRange(opt)}
                className={[
                  'px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-tag transition-all duration-200 active:scale-95',
                  chartTimeRange === opt
                    ? 'bg-text-primary text-bg-base shadow-sm'
                    : 'text-text-secondary hover:text-text-primary',
                ].join(' ')}
              >
                {opt === 'ALL' ? 'MAX' : opt}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 relative min-h-[280px] sm:min-h-[360px] flex flex-col">
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-[100px] pointer-events-none opacity-5 transition-colors duration-700 ${chartGlow[activeChart]}`} />

          <div className="flex-grow w-full relative z-10">
            {activeChart === 'body' && <ProgressChart timeRange={chartTimeRange} />}
            {activeChart === 'strength' && <StrengthChart timeRange={chartTimeRange} />}
            {activeChart === 'cardio' && <CarreraChart timeRange={chartTimeRange} />}
          </div>
        </div>
      </Card>

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
