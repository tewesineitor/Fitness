import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AppContext } from '../../../contexts';
import { HistorialDeMetricasEntry, HistorialDeSesionesEntry } from '../../../types';
import { selectProgressState } from '../../../selectors/progressSelectors';
import type { StatTrend } from '../../../components/StatChip';

export type ProgressSubScreen = 'main' | 'gallery' | 'history' | 'session-detail';
export type ProgressTimeRange = '1M' | '3M' | 'ALL';
export type ProgressChartType = 'body' | 'strength' | 'cardio';

interface LatestMetricsSnapshot {
  weight: number | null;
  prevWeight: number | null;
  waist: number | null;
  sessions: number;
}

interface ProgressControllerState {
  subScreen: ProgressSubScreen;
  activeChart: ProgressChartType;
  chartTimeRange: ProgressTimeRange;
  progressPhotos: HistorialDeMetricasEntry[];
  sessionHistory: HistorialDeSesionesEntry[];
  selectedSession: HistorialDeSesionesEntry | null;
  latestMetrics: LatestMetricsSnapshot;
  weightTrend: StatTrend | undefined;
}

interface ProgressControllerActions {
  goMain: () => void;
  openGallery: () => void;
  openHistory: () => void;
  selectChart: (chart: ProgressChartType) => void;
  selectChartTimeRange: (range: ProgressTimeRange) => void;
  viewSession: (session: HistorialDeSesionesEntry) => void;
}

export interface ProgressController {
  state: ProgressControllerState;
  actions: ProgressControllerActions;
}

const getLatestMetricPair = (
  history: HistorialDeMetricasEntry[],
): { latest: HistorialDeMetricasEntry | null; previous: HistorialDeMetricasEntry | null } => {
  let latest: HistorialDeMetricasEntry | null = null;
  let previous: HistorialDeMetricasEntry | null = null;
  let latestTime = -Infinity;
  let previousTime = -Infinity;

  for (const entry of history) {
    const entryTime = new Date(entry.fecha_registro).getTime();
    if (entryTime > latestTime) {
      previous = latest;
      previousTime = latestTime;
      latest = entry;
      latestTime = entryTime;
      continue;
    }

    if (entryTime > previousTime) {
      previous = entry;
      previousTime = entryTime;
    }
  }

  return { latest, previous };
};

export function useProgressController(): ProgressController {
  const { state, dispatch } = useContext(AppContext)!;
  const progress = selectProgressState(state);
  const metricHistory = progress.metricHistory ?? [];
  const sessionHistory = state.workout.historialDeSesiones;

  const [subScreen, setSubScreen] = useState<ProgressSubScreen>('main');
  const [selectedSession, setSelectedSession] = useState<HistorialDeSesionesEntry | null>(null);
  const [chartTimeRange, setChartTimeRange] = useState<ProgressTimeRange>('1M');
  const [activeChart, setActiveChart] = useState<ProgressChartType>('body');

  useEffect(() => {
    dispatch({ type: 'SET_BOTTOM_NAV_VISIBLE', payload: subScreen === 'main' });
    return () => {
      dispatch({ type: 'SET_BOTTOM_NAV_VISIBLE', payload: true });
    };
  }, [dispatch, subScreen]);

  const latestMetrics = useMemo<LatestMetricsSnapshot>(() => {
    const { latest, previous } = getLatestMetricPair(metricHistory);

    return {
      weight: latest?.peso_kg ?? null,
      prevWeight: previous?.peso_kg ?? null,
      waist: latest?.cintura_cm ?? null,
      sessions: sessionHistory.length,
    };
  }, [metricHistory, sessionHistory.length]);

  const weightTrend: StatTrend | undefined = latestMetrics.weight !== null && latestMetrics.prevWeight !== null
    ? latestMetrics.weight < latestMetrics.prevWeight
      ? 'down'
      : latestMetrics.weight > latestMetrics.prevWeight
        ? 'up'
        : 'neutral'
    : undefined;

  const goMain = useCallback(() => {
    setSubScreen('main');
    setSelectedSession(null);
  }, []);

  const openGallery = useCallback(() => {
    setSubScreen('gallery');
  }, []);

  const openHistory = useCallback(() => {
    setSubScreen('history');
  }, []);

  const viewSession = useCallback((session: HistorialDeSesionesEntry) => {
    setSelectedSession(session);
    setSubScreen('session-detail');
  }, []);

  return {
    state: {
      subScreen,
      activeChart,
      chartTimeRange,
      progressPhotos: metricHistory.filter((entry) => Boolean(entry.url_foto)),
      sessionHistory,
      selectedSession,
      latestMetrics,
      weightTrend,
    },
    actions: {
      goMain,
      openGallery,
      openHistory,
      selectChart: setActiveChart,
      selectChartTimeRange: setChartTimeRange,
      viewSession,
    },
  };
}
