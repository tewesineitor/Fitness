import React from 'react';
import type { HabitStatus, HabitStatuses } from '../../screens/hoy/hooks/useHoyLogic';
import { ProteinShakeIcon, FireIcon, SleepSideIcon, CardioIcon } from '../icons';

// ── Pill component ────────────────────────────────────────────────────────────

const statusStyles: Record<HabitStatus, { pill: string; dot: string }> = {
    success: {
        pill: 'bg-success/10 border-success/30 text-success',
        dot:  'bg-success',
    },
    warning: {
        pill: 'bg-warning/10 border-warning/30 text-warning',
        dot:  'bg-warning',
    },
    danger: {
        pill: 'bg-danger/10 border-danger/30 text-danger',
        dot:  'bg-danger',
    },
    neutral: {
        pill: 'bg-surface-hover border-surface-border text-text-muted',
        dot:  'bg-surface-border',
    },
};

const HabitPill: React.FC<{
    icon:    React.FC<{ className?: string }>;
    label:   string;
    status:  HabitStatus;
    onClick?: () => void;
}> = ({ icon: Icon, label, status, onClick }) => {
    const s = statusStyles[status];
    const Tag = onClick ? 'button' : 'div';

    return (
        <Tag
            onClick={onClick}
            className={[
                'flex items-center gap-1.5 px-2.5 py-1.5 rounded-pill border transition-all duration-300',
                'text-[9px] font-black uppercase tracking-widest select-none',
                s.pill,
                onClick ? 'active:scale-95 cursor-pointer hover:opacity-80' : '',
            ].join(' ')}
        >
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.dot}`} />
            <Icon className="w-3 h-3 flex-shrink-0" />
            <span className="leading-none">{label}</span>
        </Tag>
    );
};

// ── Widget ────────────────────────────────────────────────────────────────────

export interface DailyNonNegotiablesWidgetProps {
    habitStatuses: HabitStatuses;
    onToggleSleep: () => void;
    onToggleSteps: () => void;
}

const DailyNonNegotiablesWidget: React.FC<DailyNonNegotiablesWidgetProps> = ({
    habitStatuses,
    onToggleSleep,
    onToggleSteps,
}) => {
    const { protein, calories, sleep, steps, allMet } = habitStatuses;

    return (
        <div className={[
            'rounded-card border p-bento-pad h-full flex flex-col gap-3 transition-all duration-500',
            allMet
                ? 'bg-surface-bg border-brand-accent/30 shadow-glow'
                : 'bg-surface-bg border-surface-border',
        ].join(' ')}>

            {/* Header */}
            <div className="flex items-center justify-between min-h-[18px]">
                <span className="text-[9px] font-black uppercase tracking-widest text-text-secondary">
                    Innegociables
                </span>
                {allMet && (
                    <span className="text-[8px] font-black text-brand-accent uppercase tracking-widest animate-pulse">
                        ✦ Todo
                    </span>
                )}
            </div>

            {/* Pills grid */}
            <div className="flex flex-col gap-1.5 flex-grow justify-center">
                <div className="flex gap-1.5 flex-wrap">
                    <HabitPill icon={ProteinShakeIcon} label="Proteína"  status={protein}  />
                    <HabitPill icon={FireIcon}          label="Calorías"  status={calories} />
                </div>
                <div className="flex gap-1.5 flex-wrap">
                    <HabitPill icon={SleepSideIcon} label="Sueño"     status={sleep} onClick={onToggleSleep} />
                    <HabitPill icon={CardioIcon}    label="Actividad" status={steps} onClick={onToggleSteps} />
                </div>
            </div>
        </div>
    );
};

export default DailyNonNegotiablesWidget;

