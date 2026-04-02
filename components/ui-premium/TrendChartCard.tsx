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
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m5 12 7-7 7 7"/>
    <path d="M12 19V5"/>
  </svg>
);

const ArrowDownIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14"/>
    <path d="m19 12-7 7-7-7"/>
  </svg>
);

const MinusIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/>
  </svg>
);

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

  const primaryValues = chartData.map(d => d.primaryValue);
  const secondaryValues = chartData.map(d => d.secondaryValue || 0);
  
  const minPrimary = Math.min(...primaryValues);
  const maxPrimary = Math.max(...primaryValues);
  const primaryRange = maxPrimary - minPrimary || 1;
  const paddingY = 10;
  const innerHeight = 100 - (paddingY * 2);

  const getPrimaryY = (val: number) => {
    const normalized = (val - minPrimary) / primaryRange;
    return 100 - paddingY - (normalized * innerHeight);
  };

  const maxSecondary = Math.max(...secondaryValues, 1);
  const getSecondaryHeight = (val: number) => {
    return (val / maxSecondary) * (100 - paddingY);
  };

  const numPoints = chartData.length;
  // If numPoints === 1, stepX is 0, but polyline needs at least 2 points
  const stepX = numPoints > 1 ? 100 / (numPoints - 1) : 100;

  const polylinePoints = chartData.map((d, i) => {
    const x = i * stepX;
    const y = getPrimaryY(d.primaryValue);
    return `${x},${y}`;
  }).join(' ');

  const polygonPoints = `0,100 ${polylinePoints} 100,100`;

  return (
    <SquishyCard key={title} interactive padding="none" className="p-5 flex flex-col gap-4">
      <EyebrowText>{title}</EyebrowText>
      
      <div className="flex items-center">
        <GiantValue className="!text-3xl">{primaryMetric.currentValue}</GiantValue>
        <TrendIcon className={`w-5 h-5 ml-2 ${trendIconClass}`} />
        <MutedText className="text-xs uppercase ml-1">{primaryMetric.label}</MutedText>
      </div>

      <div className="w-full h-32 relative">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id={`glow-${title.replace(/\s+/g, '-')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
            <filter id={`blur-${title.replace(/\s+/g, '-')}`}>
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {chartType === 'dual-axis' && chartData.map((d, i) => {
            const h = getSecondaryHeight(d.secondaryValue || 0);
            let x = i * stepX - 5;
            if (i === 0) x = 0;
            if (i === numPoints - 1) x = 100 - 10;
            return (
              <rect
                key={`bar-${i}`}
                x={x}
                y={100 - h}
                width="10"
                height={h}
                rx="2"
                fill="currentColor"
                className="text-zinc-800"
              />
            );
          })}

          {chartType === 'single-line' && (
            <polygon
              points={polygonPoints}
              fill={`url(#glow-${title.replace(/\s+/g, '-')})`}
            />
          )}

          <polyline
            points={polylinePoints}
            stroke="currentColor"
            className="text-emerald-400"
            strokeWidth="3"
            fill="none"
            filter={`url(#blur-${title.replace(/\s+/g, '-')})`}
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      <div className="w-full flex justify-between items-center mt-2">
        {chartData.map((d, i) => (
          <MutedText key={`label-${i}`} className="!text-[10px]">{d.dateLabel}</MutedText>
        ))}
      </div>
    </SquishyCard>
  );
};

export default TrendChartCard;
