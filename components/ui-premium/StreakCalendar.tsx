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
              ? 'bg-brand-accent scale-110 border-none'
              : 'bg-surface-raised/50 border border-white/5',
          ].join(' ')}
        >
          {day.completed
            ? <StatLabel className="text-brand-accent-foreground font-black">{day.label}</StatLabel>
            : <StatLabel className="text-text-muted">{day.label}</StatLabel>}
        </div>
      </div>
    ))}
  </div>
);

export default StreakCalendar;
