import React from 'react';
import { EyebrowText, MutedText } from './Typography';

export interface DailyStreak {
  date: string;
  dayInitial: string;
  dayNumber?: number;
  isToday: boolean;
  status: 'completed' | 'failed' | 'pending';
}

interface WeeklyStreakTrackerProps {
  days: DailyStreak[];
  className?: string;
}

const CheckIcon: React.FC = () => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const WeeklyStreakTracker: React.FC<WeeklyStreakTrackerProps> = ({
  days,
  className = '',
}) => (
  <div
    className={[
      'bg-surface-bg/60 backdrop-blur-md rounded-2xl p-4 flex justify-between items-center',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
  >
    {days.map((day) => (
      <div key={day.date} className="flex flex-col items-center">
        {/* Day node */}
        <div
          className={[
            'w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200',
            day.isToday
              ? 'ring-2 ring-brand-accent/40 ring-offset-2 ring-offset-bg-base'
              : '',
            day.status === 'completed'
              ? 'bg-brand-accent text-brand-accent-foreground'
              : day.status === 'failed'
              ? 'bg-surface-raised'
              : 'bg-surface-raised/50 border border-surface-border/30',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {day.status === 'completed' && (
            <span className="text-brand-accent-foreground">
              <CheckIcon />
            </span>
          )}
          {day.status === 'failed' && (
            <span className="w-1.5 h-1.5 rounded-full bg-danger/50 block" />
          )}
        </div>

        {/* Day initial */}
        <EyebrowText className="!normal-case block text-center mt-2">
          {day.dayInitial}
        </EyebrowText>
        {/* Day number */}
        {day.dayNumber !== undefined && (
          <MutedText className="block text-center -mt-1 opacity-80 scale-90">
            {day.dayNumber}
          </MutedText>
        )}
      </div>
    ))}
  </div>
);

export default WeeklyStreakTracker;
