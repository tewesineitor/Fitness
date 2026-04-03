import React from 'react';
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
import { ScaleIcon, StrengthIcon, CardioIcon } from '../components/icons';
import { PageHeader } from '../components/layout';
import { useProgressController } from '@/screens/progreso/hooks/useProgressController';

type TimeRange = '1M' | '3M' | 'ALL';
type ChartType = 'body' | 'strength' | 'cardio';

const chartGlow: Record<ChartType, string> = {
  body: 'bg-brand-accent',
  strength: 'bg-brand-protein',
  cardio: 'bg-success',
};

const Progreso: React.FC = () => {
  const { state, actions } = useProgressController();

  if (state.subScreen === 'gallery') {
    return <ProgressGallery photos={state.progressPhotos} onClose={actions.goMain} />;
  }

  if (state.subScreen === 'history') {
    return (
      <SessionHistoryList
        history={state.sessionHistory}
        onBack={actions.goMain}
        onViewSession={actions.viewSession}
      />
    );
  }

  if (state.subScreen === 'session-detail' && state.selectedSession) {
    return (
      <WorkoutSummaryScreen
        historicalEntry={state.selectedSession}
        onExit={actions.goMain}
        isHistoricalView={true}
      />
    );
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
          value={state.latestMetrics.weight !== null ? state.latestMetrics.weight.toFixed(1) : '-'}
          unit="kg"
          label="Peso"
          trend={state.weightTrend}
          colorClass="text-brand-accent"
        />
        <StatChip
          value={state.latestMetrics.waist !== null ? state.latestMetrics.waist.toFixed(0) : '-'}
          unit="cm"
          label="Cintura"
          colorClass="text-brand-carbs"
        />
        <StatChip
          value={state.latestMetrics.sessions}
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
            activeTab={state.activeChart}
            onChange={(id) => actions.selectChart(id as ChartType)}
            className="sm:max-w-[280px]"
          />

          <div className="flex gap-1 bg-surface-hover/40 border border-surface-border rounded-input p-1 self-start sm:self-auto">
            {(['1M', '3M', 'ALL'] as TimeRange[]).map((opt) => (
              <button
                key={opt}
                onClick={() => actions.selectChartTimeRange(opt)}
                className={[
                  'px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-tag transition-all duration-200 active:scale-95',
                  state.chartTimeRange === opt
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
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-[100px] pointer-events-none opacity-5 transition-colors duration-700 ${chartGlow[state.activeChart]}`} />

          <div className="flex-grow w-full relative z-10">
            {state.activeChart === 'body' && <ProgressChart timeRange={state.chartTimeRange} />}
            {state.activeChart === 'strength' && <StrengthChart timeRange={state.chartTimeRange} />}
            {state.activeChart === 'cardio' && <CarreraChart timeRange={state.chartTimeRange} />}
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
          <GalleryWidget onShowGallery={actions.openGallery} />
        </div>
      </div>

      <section
        className="animate-fade-in-up"
        style={{ animationDelay: '240ms' }}
      >
        <HistoryWidget
          onShowHistoryList={actions.openHistory}
          onViewHistoricalSession={actions.viewSession}
        />
      </section>
    </div>
  );
};

export default Progreso;
