import React from 'react';
import { StatLabel, MutedText } from './Typography';

interface StreakDay {
  label: string;
  completed: boolean;
}

interface StreakCalendarProps {
  days?: StreakDay[];
  className?: string;
}

const defaultDays: StreakDay[] = [
  { label: 'L', completed: true },
  { label: 'M', completed: true },
  { label: 'M', completed: true },
  { label: 'J', completed: false },
  { label: 'V', completed: false },
  { label: 'S', completed: false },
  { label: 'D', completed: false },
];

const StreakCalendar: React.FC<StreakCalendarProps> = ({
  days = defaultDays,
  className = '',
}) => (
  <div className={['flex flex-row items-center justify-between w-full', className].filter(Boolean).join(' ')}>
    {days.map((day, index) => (
      <div key={index} className="flex flex-col items-center gap-1.5">
        <div
          className={[
            'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200',
            day.completed
              ? 'bg-emerald-400/20 border border-emerald-400/50'
              : 'bg-zinc-800/30 border border-zinc-700/30',
          ].join(' ')}
        >
          {day.completed
            ? <StatLabel className="text-emerald-400">{day.label}</StatLabel>
            : <MutedText>{day.label}</MutedText>}
        </div>
      </div>
    ))}
  </div>
);

export default StreakCalendar;
