import React from 'react';
import { EyebrowText } from './Typography';

export interface DailyStreak {
  date: string;
  dayInitial: string;
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
      'bg-zinc-900/40 backdrop-blur-md rounded-2xl p-4 flex justify-between items-center',
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
              ? 'ring-2 ring-emerald-500/50 ring-offset-2 ring-offset-zinc-950'
              : '',
            day.status === 'completed'
              ? 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.35)] text-zinc-950'
              : day.status === 'failed'
              ? 'bg-zinc-800'
              : 'bg-zinc-800/50 border border-white/5',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {day.status === 'completed' && (
            <span className="text-zinc-950">
              <CheckIcon />
            </span>
          )}
          {day.status === 'failed' && (
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500/60 block" />
          )}
        </div>

        {/* Day initial */}
        <EyebrowText className="!text-[10px] !normal-case block text-center mt-2">
          {day.dayInitial}
        </EyebrowText>
      </div>
    ))}
  </div>
);

export default WeeklyStreakTracker;
