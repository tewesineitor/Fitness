
import React, { useMemo } from 'react';
import { ProgressState, WorkoutState, DayOfWeek } from '../../types';
import { CalendarIcon, ArrowDownIcon, ArrowUpIcon, CheckIcon, MoonIcon } from '../icons';

interface DayNodeProps {
    index: number;
    label: string;
    todayIndex: number;
    isCompleted: boolean;
}

const DayNode: React.FC<DayNodeProps> = ({ index, label, todayIndex, isCompleted }) => {
    const isCurrentDay = index === todayIndex;
    const isSunday = index === 6;
    const isPast = index < todayIndex;
    
    // Determine State
    let stateClass = "";
    let icon = null;

    if (isCurrentDay) {
        stateClass = "bg-brand-accent text-black shadow-sm scale-110 border-2 border-surface-bg";
        icon = <span className="text-[10px] font-bold">{label}</span>;
    } else if (isCompleted) {
        stateClass = "bg-surface-bg text-text-primary border border-surface-border";
        icon = <CheckIcon className="w-3 h-3 text-text-secondary" />;
    } else if (isSunday) {
        stateClass = "bg-surface-bg border border-dashed border-surface-border text-text-secondary/50";
        icon = <MoonIcon className="w-3 h-3" />;
    } else if (isPast) {
        stateClass = "bg-surface-hover border border-surface-border text-text-secondary opacity-60";
        icon = <span className="text-[10px] font-bold">{label}</span>;
    } else {
        stateClass = "bg-surface-bg border border-surface-border text-text-secondary";
        icon = <span className="text-[10px] font-bold">{label}</span>;
    }

    return (
        <div className="relative flex flex-col items-center z-10">
            <div className={`
                w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                ${stateClass}
            `}>
                {icon}
            </div>
            
            {/* Today Indicator Label */}
            {isCurrentDay && (
                <div className="absolute -bottom-5 text-[9px] font-bold text-brand-accent uppercase tracking-widest">Hoy</div>
            )}
        </div>
    );
};

export const WeeklyGlanceWidget: React.FC<{ progress: ProgressState, weeklySchedule: WorkoutState['weeklySchedule'] }> = ({ progress, weeklySchedule }) => {
    const { completedDaysCount, totalTrainingDays, currentWeekProgress } = useMemo(() => {
         if (!progress?.progressTracker?.journeyProgress) return { completedDaysCount: 0, totalTrainingDays: 6, currentWeekProgress: Array(6).fill(false) };
         
         const weekProgress = progress.progressTracker.journeyProgress.slice(0, 6);
         return { 
             completedDaysCount: weekProgress.filter(Boolean).length, 
             totalTrainingDays: 6, 
             currentWeekProgress: weekProgress 
         };
    }, [progress]);

    const dayLabels = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
    const todayIndex = (new Date().getDay() + 6) % 7;

    return (
        <div className="bg-surface-bg rounded-xl border border-surface-border shadow-sm p-5 sm:p-6">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <div className="flex items-center gap-2 mb-1.5">
                        <CalendarIcon className="w-3.5 h-3.5 text-brand-accent" />
                        <h3 className="text-[10px] font-bold text-text-secondary tracking-widest uppercase">Progreso Semanal</h3>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-heading font-bold text-text-primary leading-none">{completedDaysCount}</span>
                        <span className="text-xs text-text-secondary font-medium uppercase tracking-wider opacity-70">/ {totalTrainingDays} Sesiones</span>
                    </div>
                </div>
            </div>

            {/* Progress Bar / Nodes */}
            <div className="relative flex justify-between items-center px-2">
                {/* Connector Line Background */}
                <div className="absolute top-1/2 left-4 right-4 h-px bg-surface-border -z-0 -translate-y-1/2"></div>
                
                {/* Active Connector Line */}
                <div 
                    className="absolute top-1/2 left-4 h-px bg-brand-accent -z-0 -translate-y-1/2 transition-all duration-500"
                    style={{ width: `${(Math.min(todayIndex, 6) / 6) * 100}%` }}
                ></div>

                {dayLabels.map((label, index) => (
                    <DayNode 
                        key={index} 
                        index={index} 
                        label={label} 
                        todayIndex={todayIndex} 
                        isCompleted={index < 6 && currentWeekProgress[index]}
                    />
                ))}
            </div>
        </div>
    );
};

export default WeeklyGlanceWidget;
