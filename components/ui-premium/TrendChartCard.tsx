import React from 'react';
import SquishyCard from './SquishyCard';
import { EyebrowText, GiantValue, MutedText } from './Typography';

export interface TrendChartCardProps {
  title: string;
  primaryMetric: {
    label: string;
    currentValue: string;
    trend: 'up' | 'down' | 'neutral';
  };
  chartData: {
    dateLabel: string;
    primaryValue: number;
    secondaryValue?: number;
  }[];
  chartType: 'single-line' | 'dual-axis';
}

const ArrowUpIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m5 12 7-7 7 7"/>
    <path d="M12 19V5"/>
  </svg>
);

const ArrowDownIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14"/>
    <path d="m19 12-7 7-7-7"/>
  </svg>
);

const MinusIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/>
  </svg>
);

const GRID_LINES = [20, 40, 60, 80]; // % del viewBox para las guías horizontales

export const TrendChartCard: React.FC<TrendChartCardProps> = ({
  title,
  primaryMetric,
  chartData,
  chartType
}) => {
  const trendIconClass =
    primaryMetric.trend === 'up' ? 'text-emerald-400' :
    primaryMetric.trend === 'down' ? 'text-rose-400' : 'text-zinc-500';

  const TrendIcon =
    primaryMetric.trend === 'up' ? ArrowUpIcon :
    primaryMetric.trend === 'down' ? ArrowDownIcon : MinusIcon;

  // Fallback seguro para array vacío
  const hasData = chartData.length > 0;
  const primaryValues = hasData ? chartData.map(d => d.primaryValue) : [0];
  const secondaryValues = chartData.map(d => d.secondaryValue || 0);

  const minPrimary = Math.min(...primaryValues);
  const maxPrimary = Math.max(...primaryValues);
  const primaryRange = maxPrimary - minPrimary || 1;
  const midPrimary = minPrimary + (primaryRange / 2);

  // Formatter para no tener muchos decimales en el eje Y
  const formatY = (val: number) => {
    if (val >= 1000) return (val / 1000).toFixed(1) + 'k';
    return Number.isInteger(val) ? val.toString() : val.toFixed(1);
  };

  // Padding Y: 8 arriba, 5 abajo — más espacio superior para dejar «respirar» la línea
  const paddingTop = 8;
  const paddingBottom = 5;
  const innerHeight = 100 - paddingTop - paddingBottom;

  const getPrimaryY = (val: number) => {
    const normalized = (val - minPrimary) / primaryRange;
    return (100 - paddingBottom) - normalized * innerHeight;
  };

  const maxSecondary = Math.max(...secondaryValues, 1);
  // Barras con 3px de padding inferior para no tocar el borde
  const getSecondaryHeight = (val: number) => {
    return (val / maxSecondary) * (100 - paddingBottom - 3);
  };

  const numPoints = chartData.length;
  const stepX = numPoints > 1 ? 100 / (numPoints - 1) : 100;

  const points = chartData.map((d, i) => ({
    x: i * stepX,
    y: getPrimaryY(d.primaryValue),
  }));

  const polylinePoints = points.map(p => `${p.x},${p.y}`).join(' ');
  const polygonPoints = `0,${100 - paddingBottom} ${polylinePoints} 100,${100 - paddingBottom}`;

  // Último punto para el dot marker
  const lastPoint = points[points.length - 1];

  const gradId = `grad-${title.replace(/\s+/g, '-')}`;
  const glowId = `glow-${title.replace(/\s+/g, '-')}`;

  return (
    <SquishyCard interactive padding="none" className="p-5 flex flex-col gap-3">
      {/* Título de eyebrow — ligeramente más legible */}
      <EyebrowText className="tracking-[0.12em] text-[11px]">{title}</EyebrowText>

      {/* Métrica principal — jerarquía mejorada */}
      <div className="flex items-end gap-2">
        <GiantValue className="!text-3xl leading-none">{primaryMetric.currentValue}</GiantValue>
        <div className="flex items-center gap-1 mb-0.5">
          <TrendIcon className={`w-4 h-4 flex-shrink-0 ${trendIconClass}`} />
          <MutedText className="!text-[10px] uppercase tracking-widest">{primaryMetric.label}</MutedText>
        </div>
      </div>

      {/* Área de gráfica — ampliada a h-40 */}
      <div className="w-full h-40 relative">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.22" />
              <stop offset="85%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
            <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Grid lines horizontales de lectura */}
          {GRID_LINES.map(y => (
            <line
              key={`grid-${y}`}
              x1="0" y1={y}
              x2="100" y2={y}
              stroke="currentColor"
              className="text-zinc-800/60"
              strokeWidth="0.4"
              vectorEffect="non-scaling-stroke"
            />
          ))}

          {/* Y-Axis Labels (Absolute so they sit nicely on left) */}
          <text x="0" y={getPrimaryY(maxPrimary) - 3} fill="currentColor" className="text-[6px] text-zinc-600 font-mono tracking-wider font-semibold">{formatY(maxPrimary)}</text>
          <text x="0" y={getPrimaryY(midPrimary) - 3} fill="currentColor" className="text-[6px] text-zinc-600 font-mono tracking-wider font-semibold">{formatY(midPrimary)}</text>
          <text x="0" y={getPrimaryY(minPrimary) - 3} fill="currentColor" className="text-[6px] text-zinc-600 font-mono tracking-wider font-semibold">{formatY(minPrimary)}</text>

          {/* DUAL-AXIS: Barras con padding inferior */}
          {chartType === 'dual-axis' && chartData.map((d, i) => {
            const h = getSecondaryHeight(d.secondaryValue || 0);
            // Centrar las barras en su punto X
            const cx = points[i].x;
            const barW = 8;
            const bx = Math.max(0, Math.min(100 - barW, cx - barW / 2));
            return (
              <rect
                key={`bar-${i}`}
                x={bx}
                y={100 - paddingBottom - 3 - h}
                width={barW}
                height={h}
                rx="2"
                fill="currentColor"
                className="text-zinc-700/70"
              />
            );
          })}

          {/* SINGLE-LINE: Gradiente de área bajo la curva */}
          {chartType === 'single-line' && hasData && (
            <polygon
              points={polygonPoints}
              fill={`url(#${gradId})`}
            />
          )}

          {/* Línea principal con glow */}
          {hasData && (
            <polyline
              points={polylinePoints}
              stroke="currentColor"
              className="text-emerald-400"
              strokeWidth="2.5"
              fill="none"
              filter={`url(#${glowId})`}
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Dot marker en el último punto (valor actual) */}
          {hasData && lastPoint && (
            <>
              {/* Halo difuso */}
              <circle
                cx={lastPoint.x}
                cy={lastPoint.y}
                r="4"
                fill="#10b981"
                opacity="0.2"
                vectorEffect="non-scaling-stroke"
              />
              {/* Dot sólido */}
              <circle
                cx={lastPoint.x}
                cy={lastPoint.y}
                r="2.5"
                fill="#10b981"
                stroke="#000"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            </>
          )}
        </svg>
      </div>

      {/* Eje X — etiquetas de fecha */}
      <div className="w-full flex justify-between items-center">
        {chartData.map((d, i) => (
          <MutedText key={`label-${i}`} className="!text-[10px]">{d.dateLabel}</MutedText>
        ))}
      </div>
    </SquishyCard>
  );
};

export default TrendChartCard;
