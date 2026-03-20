
import React, { useMemo } from 'react';
import { ProgressState, WorkoutState } from '../../types';
import { CheckIcon, MoonIcon } from '../icons';

interface DayNodeProps {
    index: number;
    label: string;
    todayIndex: number;
    isCompleted: boolean;
}

const DayNode: React.FC<DayNodeProps> = ({ index, label, todayIndex, isCompleted }) => {
    const isToday = index === todayIndex;
    const isSunday = index === 6;
    const isPast = index < todayIndex;

    if (isToday) {
        return (
            <div className="relative flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-brand-accent flex items-center justify-center shadow-sm shadow-brand-accent/30 ring-2 ring-brand-accent/20">
                    <span className="text-[9px] font-black text-white">{label}</span>
                </div>
                <div className="absolute -bottom-4 text-[7px] font-black text-brand-accent uppercase tracking-widest">HOY</div>
            </div>
        );
    }
    if (isCompleted) {
        return (
            <div className="w-7 h-7 rounded-full bg-success/15 border border-success/30 flex items-center justify-center">
                <CheckIcon className="w-3 h-3 text-success" />
            </div>
        );
    }
    if (isSunday) {
        return (
            <div className="w-7 h-7 rounded-full border border-dashed border-surface-border flex items-center justify-center opacity-50">
                <MoonIcon className="w-3 h-3 text-text-muted" />
            </div>
        );
    }
    return (
        <div className={`w-7 h-7 rounded-full border border-surface-border flex items-center justify-center ${isPast ? 'opacity-40' : ''}`}>
            <span className="text-[9px] font-bold text-text-secondary">{label}</span>
        </div>
    );
};

/**
 * WeeklyGlanceWidget — Compact strip variant (Obsidian v2.0)
 *
 * Reduced from a full card (p-5 + large number + day-nodes with connectors)
 * to an inline strip that fits in a bento half-cell.
 * Shows: counter chip + 7 day dots + active progress line.
 */
export const WeeklyGlanceWidget: React.FC<{
    progress: ProgressState;
    weeklySchedule: WorkoutState['weeklySchedule'];
}> = ({ progress }) => {
    const { completedDaysCount, totalTrainingDays, currentWeekProgress } = useMemo(() => {
        if (!progress?.progressTracker?.journeyProgress) {
            return { completedDaysCount: 0, totalTrainingDays: 6, currentWeekProgress: Array(6).fill(false) };
        }
        const weekProgress = progress.progressTracker.journeyProgress.slice(0, 6);
        return {
            completedDaysCount: weekProgress.filter(Boolean).length,
            totalTrainingDays: 6,
            currentWeekProgress: weekProgress,
        };
    }, [progress]);

    const dayLabels = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
    const todayIndex = (new Date().getDay() + 6) % 7;
    const pct = Math.round((completedDaysCount / totalTrainingDays) * 100);

    return (
        <div className="bg-surface-bg rounded-2xl border border-surface-border shadow-sm p-4 h-full flex flex-col gap-3">
            {/* Header */}
            <div className="flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-text-secondary">Semana</span>
                <div className="flex items-baseline gap-1">
                    <span className="text-xl font-heading font-black text-text-primary leading-none">{completedDaysCount}</span>
                    <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider">/ {totalTrainingDays}</span>
                </div>
            </div>

            {/* Day dots strip */}
            <div className="relative flex justify-between items-center pb-5">
                {/* Background line */}
                <div className="absolute top-3.5 left-3 right-3 h-px bg-surface-border" />
                {/* Progress line */}
                <div
                    className="absolute top-3.5 left-3 h-px bg-brand-accent transition-all duration-500"
                    style={{ width: `${(Math.min(todayIndex, 5) / 6) * (100 - 8)}%` }}
                />
                {dayLabels.map((label, index) => (
                    <div key={index} className="relative z-10">
                        <DayNode
                            index={index}
                            label={label}
                            todayIndex={todayIndex}
                            isCompleted={index < 6 && currentWeekProgress[index]}
                        />
                    </div>
                ))}
            </div>

            {/* Progress bar */}
            <div className="h-1 w-full bg-surface-hover rounded-full overflow-hidden mt-auto">
                <div
                    className="h-full bg-brand-accent rounded-full transition-all duration-700"
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
};

export default WeeklyGlanceWidget;
