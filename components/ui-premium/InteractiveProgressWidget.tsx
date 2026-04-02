import React, { useState, useEffect, useRef } from 'react';
import TrendChartCard from './TrendChartCard';
import { MutedText } from './Typography';

type MainTab = 'corporal' | 'fuerza' | 'cardio';
type TimeRange = '1M' | '3M' | 'MAX';

const subTabsMap: Record<MainTab, string[]> = {
  corporal: ['PESO', '% GRASA'],
  fuerza: ['SENTADILLA', 'PRESS BANCA', 'PESO MUERTO'],
  cardio: ['CARRERA', 'SENDERISMO', 'RUCKING'],
};

const getMockData = (mainTab: MainTab, subTab: string, timeRange: TimeRange) => {
  const is3mOrMax = timeRange === '3M' || timeRange === 'MAX';

  if (mainTab === 'corporal') {
    if (subTab === 'PESO') {
      return {
        title: 'Evolución de Peso Corporal',
        primaryMetric: { label: 'Peso Actual', currentValue: '75.2 kg', trend: 'down' as const },
        chartType: 'single-line' as const,
        chartData: is3mOrMax ? [
          { dateLabel: 'Ene', primaryValue: 82.0 },
          { dateLabel: 'Feb', primaryValue: 80.5 },
          { dateLabel: 'Mar', primaryValue: 78.0 },
          { dateLabel: 'Abr', primaryValue: 75.2 },
        ] : [
          { dateLabel: '05 Mar', primaryValue: 80.5 },
          { dateLabel: '12 Mar', primaryValue: 79.1 },
          { dateLabel: '19 Mar', primaryValue: 78.0 },
          { dateLabel: '26 Mar', primaryValue: 76.5 },
          { dateLabel: '02 Abr', primaryValue: 75.2 },
        ],
      };
    } else {
      return {
        title: 'Porcentaje de Grasa Corporal',
        primaryMetric: { label: 'Última Med.', currentValue: '14.8 %', trend: 'down' as const },
        chartType: 'single-line' as const,
        chartData: [
          { dateLabel: is3mOrMax ? 'Ene' : '01 Mar', primaryValue: 16.5 },
          { dateLabel: is3mOrMax ? 'Feb' : '10 Mar', primaryValue: 15.8 },
          { dateLabel: is3mOrMax ? 'Mar' : '20 Mar', primaryValue: 15.2 },
          { dateLabel: is3mOrMax ? 'Abr' : '30 Mar', primaryValue: 14.8 },
        ],
      };
    }
  }

  if (mainTab === 'fuerza') {
    const prs: Record<string, number> = { 'SENTADILLA': 120, 'PRESS BANCA': 90, 'PESO MUERTO': 140 };
    const maxWeight = prs[subTab] || 100;
    return {
      title: `Progresión 1RM: ${subTab}`,
      primaryMetric: { label: 'Último PR', currentValue: `${maxWeight} kg`, trend: 'up' as const },
      chartType: 'single-line' as const,
      chartData: [
        { dateLabel: is3mOrMax ? '01 Ene' : '01 Mar', primaryValue: maxWeight * 0.75 },
        { dateLabel: is3mOrMax ? '01 Feb' : '10 Mar', primaryValue: maxWeight * 0.8 },
        { dateLabel: is3mOrMax ? '01 Mar' : '20 Mar', primaryValue: maxWeight * 0.9 },
        { dateLabel: is3mOrMax ? '01 Abr' : '30 Mar', primaryValue: maxWeight },
      ],
    };
  }

  if (mainTab === 'cardio') {
    const isCarrera = subTab === 'CARRERA';
    const isRucking = subTab === 'RUCKING';
    return {
      title: isCarrera ? 'Ritmo vs Distancia' : isRucking ? 'Carga vs Distancia' : 'Elevación vs Distancia',
      primaryMetric: {
        label: isCarrera ? 'Mejor Ritmo' : isRucking ? 'Carga Media' : 'Elevación Máx',
        currentValue: isCarrera ? "4'50\"/km" : isRucking ? '15 kg' : '850 m',
        trend: 'up' as const,
      },
      chartType: 'dual-axis' as const,
      chartData: [
        { dateLabel: '05 Mar', primaryValue: isCarrera ? 350 : 500, secondaryValue: 5 },
        { dateLabel: '12 Mar', primaryValue: isCarrera ? 340 : 600, secondaryValue: 8 },
        { dateLabel: '19 Mar', primaryValue: isCarrera ? 330 : 650, secondaryValue: 10 },
        { dateLabel: '26 Mar', primaryValue: isCarrera ? 310 : 750, secondaryValue: 15 },
        { dateLabel: '02 Abr', primaryValue: isCarrera ? 290 : 850, secondaryValue: 21 },
      ],
    };
  }

  return {
    title: 'Información no disponible',
    primaryMetric: { label: '-', currentValue: '0', trend: 'neutral' as const },
    chartType: 'single-line' as const,
    chartData: [],
  };
};

// Icono ChevronDown nativo SVG (sin dependencias externas)
const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const InteractiveProgressWidget: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MainTab>('fuerza');
  const [activeSubTab, setActiveSubTab] = useState<string>('SENTADILLA');
  const [timeRange, setTimeRange] = useState<TimeRange>('3M');
  const [chartVisible, setChartVisible] = useState(true);
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reinicia sub-tab al cambiar tab principal
  useEffect(() => {
    setActiveSubTab(subTabsMap[activeTab][0]);
  }, [activeTab]);

  // Transición de opacidad al cambiar datos
  const triggerChartTransition = (fn: () => void) => {
    if (transitionTimer.current) clearTimeout(transitionTimer.current);
    setChartVisible(false);
    transitionTimer.current = setTimeout(() => {
      fn();
      setChartVisible(true);
    }, 150);
  };

  const currentData = getMockData(activeTab, activeSubTab, timeRange);
  const isScalableTab = activeTab === 'fuerza' || activeTab === 'corporal';

  // Label del botón selector escalable
  const selectorLabel = activeTab === 'fuerza' ? 'Ejercicio' : 'Métrica';
  // Convertir "SENTADILLA" → "Sentadilla Libre" (display friendly)
  const subTabDisplayNames: Record<string, string> = {
    'SENTADILLA': 'Sentadilla Libre',
    'PRESS BANCA': 'Press de Banca',
    'PESO MUERTO': 'Peso Muerto Rumano',
    'PESO': 'Peso Corporal',
    '% GRASA': 'Porcentaje de Grasa',
  };
  const activeSubTabDisplay = subTabDisplayNames[activeSubTab] || activeSubTab;

  return (
    // CORRECCIÓN: bg-zinc-950 → bg-zinc-900/30 backdrop-blur-xl border-zinc-800/50
    <div className="bg-zinc-900/30 backdrop-blur-xl border border-zinc-800/50 rounded-3xl p-6 flex flex-col w-full max-w-2xl mx-auto">

      {/* HEADER: Main Tabs + Time Range */}
      <div className="flex justify-between items-center w-full">

        {/* Main Tabs (Cristal) */}
        <div className="flex bg-zinc-900/60 border border-zinc-800/60 p-1 rounded-2xl backdrop-blur-md">
          {(['corporal', 'fuerza', 'cardio'] as MainTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-xl text-[11px] font-black tracking-widest transition-all uppercase ${
                activeTab === tab
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Time Range Selector */}
        <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-full p-1 flex gap-1">
          {(['1M', '3M', 'MAX'] as TimeRange[]).map((tr) => (
            <button
              key={tr}
              onClick={() => triggerChartTransition(() => setTimeRange(tr))}
              className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all duration-200 uppercase tracking-wide ${
                timeRange === tr
                  ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {tr}
            </button>
          ))}
        </div>

      </div>

      {/* SUB-NAVEGACIÓN CONTEXTUAL */}
      <div className="mt-6">
          {isScalableTab ? (
          // PATRÓN ESCALABLE: Dropdown trigger button para ejercicio/métrica
          <div className="border-b border-zinc-800/50 pb-4">
            <button className="flex items-center gap-2 bg-zinc-800/50 hover:bg-zinc-800 border border-emerald-500/30 rounded-xl px-4 py-2 transition-colors">
              <MutedText className="text-xs uppercase">{selectorLabel}:</MutedText>
              <span className="text-sm font-semibold text-white">{activeSubTabDisplay}</span>
              <ChevronDownIcon className="text-zinc-500 flex-shrink-0" />
            </button>
          </div>
          ) : null}
          {!isScalableTab ? (
          // PATRÓN FINITO: Tabs horizontales (solo Cardio — 3 opciones máx)
          <div className="flex gap-6 border-b border-zinc-800/50">
            {subTabsMap[activeTab].map((subTab) => {
              const isActive = activeSubTab === subTab;
              return (
                <button
                  key={subTab}
                  onClick={() => triggerChartTransition(() => setActiveSubTab(subTab))}
                  className={`pb-3 text-xs font-bold tracking-wider relative transition-colors ${
                    isActive ? 'text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {subTab}
                  {isActive && (
                    <div className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-emerald-400 rounded-t-full shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                  )}
                </button>
              );
            })}
          </div>
          ) : null}
      </div>

      {/* ENGINE DE GRÁFICA — con transición de opacidad */}
      <div
        className="mt-6 flex-1 transition-opacity duration-150"
        style={{ opacity: chartVisible ? 1 : 0 }}
      >
        <TrendChartCard
          title={currentData.title}
          chartType={currentData.chartType}
          primaryMetric={currentData.primaryMetric}
          chartData={currentData.chartData}
        />
      </div>

    </div>
  );
};

export default InteractiveProgressWidget;
