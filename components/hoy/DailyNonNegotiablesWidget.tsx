import React, { useContext, useMemo } from 'react';
import { AppContext } from '../../contexts';
import * as actions from '../../actions';
import { selectConsumedMacros } from '../../selectors/nutritionSelectors';
import { selectDailyGoals } from '../../selectors/profileSelectors';
import { selectSessionState } from '../../selectors/sessionSelectors';
import { ProteinShakeIcon, FireIcon, SleepSideIcon, CardioIcon, CheckCircleIcon } from '../icons';
import { vibrate } from '../../utils/helpers';

interface HabitDotProps {
    icon: React.FC<{ className?: string }>;
    label: string;
    status: 'success' | 'warning' | 'neutral' | 'danger';
    onClick?: () => void;
}

/**
 * Compact habit dot — fits in bento half-cell.
 * Tap target: 100% of column width, square.
 */
const HabitDot: React.FC<HabitDotProps> = ({ icon: Icon, label, status, onClick }) => {
    const colorMap: Record<string, { bg: string; icon: string; dot: string }> = {
        success: { bg: 'bg-success/10 border-success/25',  icon: 'text-success',  dot: 'bg-success' },
        warning: { bg: 'bg-warning/10 border-warning/25',  icon: 'text-warning',  dot: 'bg-warning' },
        danger:  { bg: 'bg-danger/10  border-danger/25',   icon: 'text-danger',   dot: 'bg-danger'  },
        neutral: { bg: 'bg-surface-hover border-surface-border', icon: 'text-text-muted', dot: 'bg-surface-border' },
    };
    const c = colorMap[status] ?? colorMap.neutral;

    return (
        <button
            onClick={onClick}
            disabled={!onClick}
            className={[
                'flex flex-col items-center gap-1.5 p-2.5 rounded-xl border',
                'transition-all duration-200',
                onClick ? 'active:scale-[0.92]' : 'cursor-default',
                c.bg,
            ].join(' ')}
        >
            <Icon className={`w-4 h-4 ${c.icon}`} />
            <span className={`text-[8px] font-black uppercase tracking-widest ${c.icon} leading-none text-center`}>
                {label}
            </span>
        </button>
    );
};

/**
 * DailyNonNegotiablesWidget — Compact bento variant (Obsidian v2.0)
 *
 * Changed from a wide 4-col grid with tall HabitCards to a
 * compact 2×2 grid of HabitDots that fits in a bento half-cell.
 */
const DailyNonNegotiablesWidget: React.FC = () => {
    const { state, dispatch } = useContext(AppContext)!;

    const consumed = selectConsumedMacros(state);
    const goals    = selectDailyGoals(state);
    const session  = selectSessionState(state);
    const habits   = session.dailyHabits || { sleepHours: 0, stepsGoalMet: false, ruckingSessionMet: false };

    // Goals from state
    const proteinGoal  = goals.protein || 150;
    const calorieLimit = goals.kcal    || 2000;

    const proteinStatus: HabitDotProps['status'] = consumed.protein >= proteinGoal ? 'success' : 'neutral';

    const caloriesOver       = consumed.kcal > calorieLimit;
    const caloriesNearLimit  = consumed.kcal >= calorieLimit - 200;
    const caloriesStatus: HabitDotProps['status'] = caloriesOver
        ? 'danger'
        : caloriesNearLimit ? 'warning' : 'success';

    const sleepStatus: HabitDotProps['status']  = habits.sleepHours >= 7 ? 'success' : 'neutral';
    const stepsStatus: HabitDotProps['status']  = (habits.stepsGoalMet || habits.ruckingSessionMet) ? 'success' : 'neutral';

    const allMet = proteinStatus === 'success' && !caloriesOver && sleepStatus === 'success' && stepsStatus === 'success';

    return (
        <div className={[
            'rounded-2xl border p-4 shadow-sm h-full flex flex-col gap-3 transition-all duration-500',
            allMet
                ? 'bg-surface-bg border-brand-accent/30 shadow-glow'
                : 'bg-surface-bg border-surface-border',
        ].join(' ')}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-text-secondary">Hábitos</span>
                {allMet && (
                    <span className="text-[8px] font-black text-brand-accent uppercase tracking-widest animate-pulse">
                        ✦ Perfecto
                    </span>
                )}
            </div>

            {/* 2×2 grid of dots */}
            <div className="grid grid-cols-2 gap-1.5 flex-grow">
                <HabitDot icon={ProteinShakeIcon} label="Proteína" status={proteinStatus} />
                <HabitDot icon={FireIcon}          label="Calorías" status={caloriesStatus} />
                <HabitDot
                    icon={SleepSideIcon}
                    label="Sueño"
                    status={sleepStatus}
                    onClick={() => {
                        vibrate(10);
                        dispatch(actions.updateDailyHabit({ sleepHours: habits.sleepHours >= 7 ? 0 : 8 }));
                    }}
                />
                <HabitDot
                    icon={CardioIcon}
                    label="Actividad"
                    status={stepsStatus}
                    onClick={() => {
                        vibrate(10);
                        dispatch(actions.updateDailyHabit({ stepsGoalMet: !habits.stepsGoalMet }));
                    }}
                />
            </div>
        </div>
    );
};

export default DailyNonNegotiablesWidget;
