import React, { useRef, useState } from 'react';
import SquishyCard from './SquishyCard';
import { EyebrowText, MediumValue, MutedText } from './Typography';

const PencilIcon: React.FC = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
  </svg>
);

export interface DailyMetric {
  id: string;
  label: string;
  icon?: React.ReactNode;
  currentValue: number;
  targetValue: number;
  unit: string;
  isAutomated: boolean;
  toleranceThreshold: number;
}

interface NonNegotiableCardProps {
  metric: DailyMetric;
  onValueChange?: (id: string, newValue: number) => void;
  className?: string;
}

const NonNegotiableCard: React.FC<NonNegotiableCardProps> = ({
  metric,
  onValueChange,
  className = '',
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draftValue, setDraftValue] = useState(String(metric.currentValue));
  const inputRef = useRef<HTMLInputElement>(null);

  const progress = Math.min(metric.currentValue / metric.targetValue, 1);
  const isMet = progress >= metric.toleranceThreshold;

  const handleCardClick = () => {
    if (metric.isAutomated || isEditing) return;
    setDraftValue(String(metric.currentValue));
    setIsEditing(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const commitEdit = () => {
    const parsed = parseFloat(draftValue);
    if (!isNaN(parsed) && parsed >= 0) {
      onValueChange?.(metric.id, parsed);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') commitEdit();
    if (e.key === 'Escape') setIsEditing(false);
  };

  return (
    <SquishyCard
      interactive={!metric.isAutomated}
      padding="sm"
      onClick={handleCardClick}
      className={[
        'flex flex-col gap-2 relative overflow-hidden select-none',
        className,
      ].filter(Boolean).join(' ')}
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        {metric.icon && (
          <span className="text-text-muted flex items-center">{metric.icon}</span>
        )}
        <EyebrowText>{metric.label}</EyebrowText>
        {!metric.isAutomated && (
          <span className="ml-auto text-text-muted">
            <PencilIcon />
          </span>
        )}
      </div>

      {/* Value flip area */}
      <div className="relative flex items-start justify-start min-h-[56px] pt-1">
        {/* Display mode */}
        <div
          className={[
            'flex items-end gap-1 transition-all duration-300',
            isEditing
              ? 'opacity-0 scale-95 pointer-events-none absolute'
              : 'opacity-100 scale-100',
          ].join(' ')}
        >
          <MediumValue
            className={[
              'transition-colors duration-500',
              isMet ? '!text-brand-accent' : '',
            ].filter(Boolean).join(' ')}
          >
            {metric.currentValue}
          </MediumValue>
          <MutedText className="!text-xs pb-1">{metric.unit}</MutedText>
        </div>

        {/* Input mode */}
        <div
          className={[
            'w-full transition-all duration-300',
            isEditing
              ? 'opacity-100 scale-100'
              : 'opacity-0 scale-95 pointer-events-none absolute',
          ].join(' ')}
        >
          <input
            ref={inputRef}
            type="number"
            value={draftValue}
            onChange={(e) => setDraftValue(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={handleKeyDown}
            className="bg-transparent border-none outline-none text-4xl font-black text-left w-full text-text-primary tabular-nums"
          />
        </div>
      </div>

      {/* Target label */}
      <MutedText className="!text-xs">
        Meta: {metric.targetValue}{metric.unit}
      </MutedText>

      {/* Progress bar — flush to card bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-surface-raised">
        <div
          className={[
            'h-full transition-all duration-500',
            isMet
              ? 'bg-brand-accent'
              : 'bg-surface-raised',
          ].join(' ')}
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </SquishyCard>
  );
};

export default NonNegotiableCard;
