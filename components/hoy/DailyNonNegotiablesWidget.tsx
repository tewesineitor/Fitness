import React, { useContext, useMemo } from 'react';
import { AppContext } from '../../contexts';
import * as actions from '../../actions';
import { selectConsumedMacros } from '../../selectors/nutritionSelectors';
import { selectDailyGoals } from '../../selectors/profileSelectors';
import { selectSessionState } from '../../selectors/sessionSelectors';
import { ProteinShakeIcon, FireIcon, SleepSideIcon, CardioIcon, CheckCircleIcon } from '../icons';
import { vibrate } from '../../utils/helpers';

interface HabitCardProps {
    icon: React.FC<any>;
    label: string;
    value: string | number;
    subLabel?: string;
    status: 'success' | 'warning' | 'neutral' | 'danger';
    onClick?: () => void;
    isActive?: boolean;
}

const HabitCard: React.FC<HabitCardProps> = ({ icon: Icon, label, value, subLabel, status, onClick, isActive = false }) => {
    let bgClass = "bg-surface-bg border-surface-border";
    let iconClass = "text-text-secondary bg-surface-hover";
    let textClass = "text-text-primary";

    if (status === 'success') {
        bgClass = "bg-brand-accent/10 border-brand-accent/30";
        iconClass = "text-brand-accent bg-brand-accent/20";
        textClass = "text-brand-accent";
    } else if (status === 'warning') {
        bgClass = "bg-yellow-500/10 border-yellow-500/30";
        iconClass = "text-yellow-500 bg-yellow-500/20";
        textClass = "text-yellow-500";
    } else if (status === 'danger') {
        bgClass = "bg-red-500/10 border-red-500/30";
        iconClass = "text-red-500 bg-red-500/20";
        textClass = "text-red-500";
    }

    return (
        <button 
            onClick={onClick}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 w-full ${bgClass} ${onClick ? 'active:scale-95' : 'cursor-default'}`}
        >
            <div className={`p-2 rounded-full mb-2 ${iconClass}`}>
                <Icon className="w-5 h-5" />
            </div>
            <div className="text-center">
                <span className={`block text-xs font-bold ${textClass}`}>{value}</span>
                <span className="block text-[9px] font-bold text-text-secondary uppercase tracking-wider mt-0.5">{label}</span>
                {subLabel && <span className="block text-[8px] text-text-secondary opacity-70 mt-0.5">{subLabel}</span>}
            </div>
        </button>
    );
};

const DailyNonNegotiablesWidget: React.FC = () => {
    const { state, dispatch } = useContext(AppContext)!;
    
    const consumed = selectConsumedMacros(state);
    const goals = selectDailyGoals(state);
    const session = selectSessionState(state);
    const habits = session.dailyHabits || { sleepHours: 0, stepsGoalMet: false, ruckingSessionMet: false };

    // 1. Protein Logic
    const proteinGoal = 150; // Hardcoded from guide or use goals.protein
    const proteinStatus = consumed.protein >= proteinGoal ? 'success' : 'neutral';

    // 2. Calories Logic
    const calorieLimit = 2000;
    const caloriesStatus = consumed.kcal > calorieLimit ? 'danger' : (consumed.kcal >= calorieLimit - 200 ? 'warning' : 'success');
    // If very low, maybe neutral? Let's stick to simple: Green if under limit, Red if over.
    // Actually, guide says "2000 kcal". So staying under or close is good.
    
    // 3. Sleep Logic
    const sleepGoal = 7;
    const sleepStatus = habits.sleepHours >= sleepGoal ? 'success' : 'neutral';

    // 4. Steps/Rucking Logic
    const stepsStatus = (habits.stepsGoalMet || habits.ruckingSessionMet) ? 'success' : 'neutral';

    const allMet = proteinStatus === 'success' && caloriesStatus !== 'danger' && sleepStatus === 'success' && stepsStatus === 'success';

    const toggleSleep = () => {
        vibrate(10);
        const newHours = habits.sleepHours >= 7 ? 0 : 8;
        dispatch(actions.updateDailyHabit({ sleepHours: newHours }));
    };

    const toggleSteps = () => {
        vibrate(10);
        // Toggle between None -> Steps -> Rucking -> None? Or just Steps met.
        // Guide says "10k steps OR Rucking".
        // Let's simple toggle: Not Met -> Met.
        // Maybe a modal to choose? For now simple toggle for "Activity".
        // If Rucking is logged via workout, it should auto-update? 
        // For now manual toggle for "10k Steps".
        dispatch(actions.updateDailyHabit({ stepsGoalMet: !habits.stepsGoalMet }));
    };

    return (
        <div className={`relative p-4 rounded-2xl border transition-all duration-500 ${allMet ? 'bg-surface-bg border-brand-accent shadow-[0_0_20px_rgba(var(--color-brand-accent-rgb),0.15)]' : 'bg-surface-bg border-surface-border shadow-sm'}`}>
            
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xs font-bold text-text-secondary uppercase tracking-widest flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${allMet ? 'bg-brand-accent animate-pulse' : 'bg-text-secondary'}`}></div>
                    Innegociables Diarios
                </h2>
                {allMet && (
                    <span className="text-[10px] font-bold text-brand-accent uppercase tracking-widest animate-pulse">
                        ¡Día Perfecto!
                    </span>
                )}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-4 gap-2">
                {/* Protein */}
                <HabitCard 
                    icon={ProteinShakeIcon}
                    label="Proteína"
                    value={`${Math.round(consumed.protein)}g`}
                    subLabel="/ 150g"
                    status={proteinStatus}
                />

                {/* Calories */}
                <HabitCard 
                    icon={FireIcon}
                    label="Calorías"
                    value={Math.round(consumed.kcal)}
                    subLabel={`< ${calorieLimit}`}
                    status={caloriesStatus}
                />

                {/* Sleep */}
                <HabitCard 
                    icon={SleepSideIcon}
                    label="Sueño"
                    value={habits.sleepHours >= 7 ? "7-8h" : "< 7h"}
                    status={sleepStatus}
                    onClick={toggleSleep}
                />

                {/* Steps */}
                <HabitCard 
                    icon={CardioIcon}
                    label="Actividad"
                    value={stepsStatus === 'success' ? "Listo" : "10k / Ruck"}
                    status={stepsStatus}
                    onClick={toggleSteps}
                />
            </div>
        </div>
    );
};

export default DailyNonNegotiablesWidget;
