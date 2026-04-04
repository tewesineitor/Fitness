import React, { useState, useEffect, useRef } from 'react';
import TrendChartCard from './TrendChartCard';
import { MutedText } from './Typography';

type MainTab = 'corporal' | 'fuerza' | 'cardio';
type TimeRange = '1M' | '3M' | '6M' | 'MAX';

const subTabsMap: Record<MainTab, string[]> = {
  corporal: ['PESO', '% GRASA'],
  fuerza: ['SENTADILLA', 'PRESS BANCA', 'PESO MUERTO'],
  cardio: ['CARRERA', 'SENDERISMO', 'RUCKING'],
};

// Generador de mock data extendido y escalado para distintos time ranges
const getMockData = (mainTab: MainTab, subTab: string, timeRange: TimeRange) => {
  const is3m = timeRange === '3M';
  const is6mOrMax = timeRange === '6M' || timeRange === 'MAX';

  if (mainTab === 'corporal') {
    if (subTab === 'PESO') {
      const data = [
        { dateLabel: 'Feb 25', primaryValue: 84.5 },
        { dateLabel: 'Jun 25', primaryValue: 82.0 },
        { dateLabel: 'Oct 25', primaryValue: 80.5 },
        { dateLabel: 'Ene 26', primaryValue: 79.0 },
        { dateLabel: 'Feb 26', primaryValue: 77.5 },
        { dateLabel: 'Mar 26', primaryValue: 76.5 },
        { dateLabel: 'Abr 26', primaryValue: 75.2 },
      ];
      return {
        title: 'Evolución de Peso Corporal',
        primaryMetric: { label: 'Peso Actual', currentValue: '75.2 kg', trend: 'down' as const },
        chartType: 'single-line' as const,
        chartData: is6mOrMax ? data : is3m ? data.slice(-4) : [
          { dateLabel: '05 Mar', primaryValue: 76.8 },
          { dateLabel: '12 Mar', primaryValue: 76.4 },
          { dateLabel: '19 Mar', primaryValue: 75.9 },
          { dateLabel: '26 Mar', primaryValue: 75.5 },
          { dateLabel: '02 Abr', primaryValue: 75.2 },
        ],
      };
    } else {
      const data = [
        { dateLabel: 'Oct 25', primaryValue: 18.0 },
        { dateLabel: 'Ene 26', primaryValue: 16.5 },
        { dateLabel: 'Feb', primaryValue: 15.8 },
        { dateLabel: 'Mar', primaryValue: 15.2 },
        { dateLabel: 'Abr', primaryValue: 14.8 },
      ];
      return {
        title: 'Porcentaje de Grasa Corporal',
        primaryMetric: { label: 'Última Med.', currentValue: '14.8 %', trend: 'down' as const },
        chartType: 'single-line' as const,
        chartData: is6mOrMax ? data : is3m ? data.slice(-3) : [
          { dateLabel: '01 Mar', primaryValue: 15.4 },
          { dateLabel: '15 Mar', primaryValue: 15.0 },
          { dateLabel: '30 Mar', primaryValue: 14.8 },
        ],
      };
    }
  }

  if (mainTab === 'fuerza') {
    const prs: Record<string, number> = { 'SENTADILLA': 120, 'PRESS BANCA': 90, 'PESO MUERTO': 140 };
    const maxWeight = prs[subTab] || 100;
    
    const dataMax = [
      { dateLabel: '01 Oct', primaryValue: maxWeight * 0.65 },
      { dateLabel: '01 Ene', primaryValue: maxWeight * 0.75 },
      { dateLabel: '01 Feb', primaryValue: maxWeight * 0.82 },
      { dateLabel: '01 Mar', primaryValue: maxWeight * 0.90 },
      { dateLabel: '01 Abr', primaryValue: maxWeight },
    ];
    return {
      title: `Progresión 1RM: ${subTab}`,
      primaryMetric: { label: 'Último PR', currentValue: `${maxWeight} kg`, trend: 'up' as const },
      chartType: 'single-line' as const,
      chartData: is6mOrMax ? dataMax : is3m ? dataMax.slice(-3) : [
        { dateLabel: '01 Mar', primaryValue: maxWeight * 0.93 },
        { dateLabel: '15 Mar', primaryValue: maxWeight * 0.96 },
        { dateLabel: '30 Mar', primaryValue: maxWeight },
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

// SVG Icons
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

const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const subTabDisplayNames: Record<string, string> = {
  'SENTADILLA': 'Sentadilla Libre',
  'PRESS BANCA': 'Press de Banca',
  'PESO MUERTO': 'Peso Muerto Rumano',
  'PESO': 'Peso Corporal',
  '% GRASA': 'Porcentaje de Grasa',
};

const InteractiveProgressWidget: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MainTab>('fuerza');
  const [activeSubTab, setActiveSubTab] = useState<string>('SENTADILLA');
  // Se añade 6M por convención de fitness tech
  const [timeRange, setTimeRange] = useState<TimeRange>('3M');
  const [chartVisible, setChartVisible] = useState(true);
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Estado para el dropdown escalable
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Reinicia sub-tab al cambiar tab principal
  useEffect(() => {
    setActiveSubTab(subTabsMap[activeTab][0]);
    setIsDropdownOpen(false);
  }, [activeTab]);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
  const selectorLabel = activeTab === 'fuerza' ? 'Ejercicio' : 'Métrica';
  const activeSubTabDisplay = subTabDisplayNames[activeSubTab] || activeSubTab;

  return (
    // Corregido width: w-full mx-auto sin límite forzado (antes max-w-2xl) para no encajonar
    <div className="bg-surface-bg/30 backdrop-blur-xl border border-surface-border/50 rounded-3xl p-6 flex flex-col w-full mx-auto">

      {/* HEADER: Main Tabs + Time Range */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-4 sm:gap-2">

        {/* Main Tabs (Cristal) */}
        <div className="flex bg-surface-bg/60 border border-surface-border/60 p-1 rounded-2xl backdrop-blur-md">
          {(['corporal', 'fuerza', 'cardio'] as MainTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 sm:px-4 py-1.5 rounded-xl text-[10px] sm:text-[11px] font-black tracking-widest transition-all uppercase ${
                activeTab === tab
                  ? 'bg-brand-accent text-brand-accent-foreground shadow-sm'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Time Range Selector */}
        <div className="bg-surface-bg/60 border border-surface-border/60 rounded-full p-1 flex gap-1">
          {(['1M', '3M', '6M', 'MAX'] as TimeRange[]).map((tr) => (
            <button
              key={tr}
              onClick={() => triggerChartTransition(() => setTimeRange(tr))}
              className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all duration-200 uppercase tracking-wide ${
                timeRange === tr
                  ? 'bg-brand-accent/15 border border-brand-accent/30 text-brand-accent'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              {tr}
            </button>
          ))}
        </div>

      </div>

      {/* SUB-NAVEGACIÓN CONTEXTUAL */}
      <div className="mt-6 flex-1 min-h-[48px]">
          {isScalableTab ? (
          // PATRÓN ESCALABLE (FUNCIONAL): Dropdown
          <div className="border-b border-surface-border/50 pb-4 relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`flex items-center gap-2 bg-surface-raised/50 hover:bg-surface-raised border rounded-xl px-4 py-2 transition-colors ${
                isDropdownOpen ? 'border-brand-accent/50' : 'border-surface-border/50 hover:border-brand-accent/30'
              }`}
            >
              <MutedText className="text-xs uppercase">{selectorLabel}:</MutedText>
              <span className="text-sm font-semibold text-text-primary">{activeSubTabDisplay}</span>
              <ChevronDownIcon className={`text-text-muted flex-shrink-0 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Menú Flotante */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-surface-raised border border-surface-border rounded-xl max-h-60 overflow-y-auto z-50 shadow-2xl overflow-hidden p-1">
                {subTabsMap[activeTab].map((subTab) => {
                  const display = subTabDisplayNames[subTab] || subTab;
                  const isSelected = activeSubTab === subTab;
                  return (
                    <button
                      key={subTab}
                      onClick={() => {
                        triggerChartTransition(() => setActiveSubTab(subTab));
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left flex items-center justify-between px-4 py-3 rounded-lg text-sm transition-colors ${
                        isSelected 
                          ? 'bg-brand-accent/10 text-brand-accent font-semibold' 
                          : 'text-text-secondary hover:bg-surface-raised hover:text-text-primary'
                      }`}
                    >
                      {display}
                      {isSelected && <CheckIcon className="text-brand-accent" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          ) : null}

          {!isScalableTab ? (
          // PATRÓN FINITO: Tabs horizontales (solo Cardio — 3 opciones máx)
          <div className="flex gap-6 border-b border-surface-border/50">
            {subTabsMap[activeTab].map((subTab) => {
              const isActive = activeSubTab === subTab;
              return (
                <button
                  key={subTab}
                  onClick={() => triggerChartTransition(() => setActiveSubTab(subTab))}
                  className={`pb-3 text-xs font-bold tracking-wider relative transition-colors ${
                    isActive ? 'text-text-primary' : 'text-text-muted hover:text-text-secondary'
                  }`}
                >
                  {subTab}
                  {isActive && (
                    <div className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-brand-accent rounded-t-full shadow-sm" />
                  )}
                </button>
              );
            })}
          </div>
          ) : null}
      </div>

      {/* ENGINE DE GRÁFICA — con transición de opacidad */}
      <div
        className="mt-4 flex-1 transition-opacity duration-150 relative z-0"
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
