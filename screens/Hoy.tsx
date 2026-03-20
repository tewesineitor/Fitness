
import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../contexts';
import { RoutineTask, TimeOfDay, DesgloseCardioLibre, RoutineTaskType, DayOfWeek } from '../types';
import * as actions from '../actions';
import * as thunks from '../thunks';
import {
    CardioIcon,
    MountainIcon,
    StrengthIcon,
    YogaIcon,
    MeditationIcon,
    PostureIcon,
    ChevronRightIcon,
    UserCircleIcon,
    CheckCircleIcon,
    FireIcon,
} from '../components/icons';
import {
    selectUserName,
    selectDailyGoals,
    selectCustomMantra,
} from '../selectors/profileSelectors';
import {
    selectUserRoutines,
    selectWeeklySchedule,
    selectCardioWeek,
} from '../selectors/workoutSelectors';
import { selectConsumedMacros } from '../selectors/nutritionSelectors';
import { selectSessionState } from '../selectors/sessionSelectors';
import { selectProgressState } from '../selectors/progressSelectors';
import { ProgressRings } from '../components/ProgressRings';
import WeeklyGlanceWidget from '../components/hoy/WeeklyGlanceWidget';
import DailyNonNegotiablesWidget from '../components/hoy/DailyNonNegotiablesWidget';
import RuckingSession from './rutina-activa/RuckingSession';
import CardioLibreLogModal from '../components/dialogs/CardioLibreLogModal';
import SectionHeader from '../components/SectionHeader';
import MacroArcGauge from '../components/MacroArcGauge';
import { vibrate } from '../utils/helpers';

// ── Helpers ─────────────────────────────────────────────────────────────────

const TaskIcon: React.FC<{ type: RoutineTaskType; className?: string }> = ({ type, className }) => {
    switch (type) {
        case 'strength':   return <StrengthIcon   className={className} />;
        case 'yoga':       return <YogaIcon        className={className} />;
        case 'meditation': return <MeditationIcon  className={className} />;
        case 'cardio':     return <CardioIcon      className={className} />;
        case 'posture':    return <PostureIcon      className={className} />;
        default:           return <StrengthIcon    className={className} />;
    }
};

const getTaskDetails = (task: RoutineTask, cardioWeek: number): string => {
    if (task.type === 'strength') return `${task.flow.length} ejercicios`;
    if (task.type === 'cardio')   return `CACO · Semana ${cardioWeek}`;
    return `${task.flow.length} pasos`;
};

// ── Mini Macro Bar (inline in nutrition bento) ───────────────────────────────

const MiniMacroBar: React.FC<{ label: string; current: number; goal: number; colorClass: string }> = ({
    label, current, goal, colorClass,
}) => {
    const pct = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
    return (
        <div className="flex flex-col gap-0.5">
            <div className="flex justify-between items-center">
                <span className="text-[8px] font-black uppercase tracking-widest text-text-muted">{label}</span>
                <span className="text-[8px] font-mono font-bold text-text-secondary">{Math.round(current)}<span className="opacity-40">/{Math.round(goal)}</span></span>
            </div>
            <div className="h-1 w-full rounded-full bg-surface-hover overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-700 ${colorClass}`} style={{ width: `${pct}%` }} />
            </div>
        </div>
    );
};

// ── Explore Button (icon + label) ────────────────────────────────────────────

const ExploreBtn: React.FC<{
    icon: React.FC<{ className?: string }>;
    label: string;
    hoverColor: string;
    onClick: () => void;
}> = ({ icon: Icon, label, hoverColor, onClick }) => (
    <button
        onClick={onClick}
        className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl border border-surface-border bg-surface-hover/30 hover:bg-surface-hover transition-all duration-200 group active:scale-[0.94]`}
    >
        <div className={`p-2 rounded-full bg-surface-hover group-hover:${hoverColor} transition-colors`}>
            <Icon className={`w-4 h-4 text-text-secondary group-hover:text-inherit transition-colors`} />
        </div>
        <span className="text-[9px] font-black uppercase tracking-widest text-text-secondary group-hover:text-text-primary transition-colors">{label}</span>
    </button>
);

// ── Main Screen ────────────────────────────────────────────────────────────────

const HoyScreen: React.FC = () => {
    const { state, dispatch } = useContext(AppContext)!;

    const userName      = selectUserName(state);
    const userRoutines  = selectUserRoutines(state);
    const weeklySchedule = selectWeeklySchedule(state);
    const dailyGoals    = selectDailyGoals(state);
    const consumed      = selectConsumedMacros(state);
    const session       = selectSessionState(state);
    const cardioWeek    = selectCardioWeek(state);
    const customMantra  = selectCustomMantra(state);
    const progress      = selectProgressState(state);

    const [isLoggingActivity, setIsLoggingActivity] = useState<'run' | 'hike' | 'rucking' | null>(null);
    const [isRuckingActive, setIsRuckingActive]     = useState(false);

    const onSelectRoutine = (routine: RoutineTask) => {
        const uniqueTaskId = `${routine.id}-${routine.timeOfDay}`;
        vibrate(10);
        if (session.activeRoutineInfo?.id === uniqueTaskId && session.activeRoutineProgress?.isStarted) {
            dispatch(actions.setActiveScreen('RutinaActiva'));
        } else {
            dispatch(actions.startRoutine(routine));
        }
    };

    const handleSaveRun     = (log: DesgloseCardioLibre) => { dispatch(thunks.saveCardioLibreLogThunk(log));  setIsLoggingActivity(null); };
    const handleSaveHike    = (log: DesgloseCardioLibre) => { dispatch(thunks.saveSenderismoLogThunk(log));   setIsLoggingActivity(null); };
    const handleSaveRucking = (log: DesgloseCardioLibre) => { dispatch(thunks.saveRuckingLogThunk(log));      setIsLoggingActivity(null); };

    // Date
    const todaysDate = new Date();
    const dateString = todaysDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
    const capitalizedDate = dateString.charAt(0).toUpperCase() + dateString.slice(1);

    // Tasks
    const allRoutines = useMemo(() => [...userRoutines], [userRoutines]);
    const tasksToDisplay = useMemo(() => {
        const dayNames: DayOfWeek[] = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const dayOfWeek = dayNames[todaysDate.getDay()];
        const scheduledIds = weeklySchedule[dayOfWeek];
        const scheduledTasks: RoutineTask[] = [];
        if (scheduledIds) {
            const timeSlots: TimeOfDay[] = ['Mañana', 'Mediodía', 'Noche'];
            timeSlots.forEach(time => {
                const routineId = scheduledIds[time];
                if (routineId) {
                    const routine = allRoutines.find(r => r.id === routineId);
                    if (routine) scheduledTasks.push({ ...routine, timeOfDay: time });
                }
            });
        }
        return scheduledTasks.sort((a, b) => {
            const order: Record<TimeOfDay, number> = { 'Mañana': 1, 'Mediodía': 2, 'Noche': 3 };
            return order[a.timeOfDay] - order[b.timeOfDay];
        });
    }, [weeklySchedule, allRoutines]);

    // Nutrition quick stats
    const kcalPct = dailyGoals.kcal > 0 ? Math.min((consumed.kcal / dailyGoals.kcal) * 100, 100) : 0;
    const isKcalOver = consumed.kcal > dailyGoals.kcal;
    const kcalRemaining = Math.max(0, dailyGoals.kcal - consumed.kcal);

    // Focus mode: active rucking
    if (isRuckingActive) {
        return (
            <RuckingSession
                onFinish={() => { dispatch(actions.updateDailyHabit({ ruckingSessionMet: true })); setIsRuckingActive(false); }}
                onCancel={() => setIsRuckingActive(false)}
            />
        );
    }

    return (
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 pb-8">
            {/* Modals */}
            {isLoggingActivity && (
                <CardioLibreLogModal
                    activityType={isLoggingActivity}
                    onSave={isLoggingActivity === 'run' ? handleSaveRun : isLoggingActivity === 'hike' ? handleSaveHike : handleSaveRucking}
                    onClose={() => setIsLoggingActivity(null)}
                />
            )}

            {/* ── HEADER ─────────────────────────────────────────────── */}
            <header className="flex justify-between items-end animate-fade-in-up pt-6 pb-5">
                <div>
                    <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight leading-none">
                        {capitalizedDate}
                    </h1>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-text-secondary flex items-center gap-2 mt-2">
                        <span className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-pulse" />
                        {customMantra || `Hola, ${userName}`}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => dispatch(actions.openProfile())}
                    aria-label="Abrir perfil"
                    className="relative active:scale-90 transition-transform duration-150"
                >
                    <div className="bg-surface-bg border border-surface-border p-2.5 rounded-full hover:bg-surface-hover hover:border-brand-accent/30 transition-all shadow-sm">
                        <UserCircleIcon className="w-6 h-6 text-text-secondary" />
                    </div>
                </button>
            </header>

            {/* ── ROW 1: WEEK STRIP + INNEGOCIABLES (bento 2-col) ───── */}
            <div className="grid grid-cols-2 gap-3 animate-fade-in-up mb-3" style={{ animationDelay: '60ms' }}>
                {/* Weekly strip — left half */}
                <WeeklyGlanceWidget progress={progress} weeklySchedule={weeklySchedule} />

                {/* Daily Non-Negotiables — right half */}
                <DailyNonNegotiablesWidget />
            </div>

            {/* ── HERO: MISSION OF THE DAY ────────────────────────────── */}
            <section
                className="bg-surface-bg rounded-2xl border border-surface-border shadow-sm p-5 mb-3 animate-fade-in-up"
                style={{ animationDelay: '120ms' }}
            >
                <SectionHeader
                    title="Misión de Hoy"
                    action={{
                        label: 'Gestionar',
                        onClick: () => {
                            dispatch(actions.setNavigationTarget('library-planner'));
                            dispatch(actions.setActiveScreen('Biblioteca'));
                        },
                    }}
                />

                {tasksToDisplay.length > 0 ? (
                    <div className="flex flex-col gap-2.5">
                        {tasksToDisplay.map((task) => {
                            const uniqueTaskId = `${task.id}-${task.timeOfDay}`;
                            const isCompleted = session.dailyProgress.completedTasks.includes(uniqueTaskId);
                            const taskProgress = session.activeRoutineInfo?.id === uniqueTaskId
                                ? session.activeRoutineInfo.progress
                                : isCompleted ? 1 : 0;
                            const details = getTaskDetails(task, cardioWeek);

                            return (
                                <button
                                    key={uniqueTaskId}
                                    onClick={() => onSelectRoutine(task)}
                                    disabled={isCompleted}
                                    className={[
                                        'relative w-full text-left overflow-hidden rounded-xl border',
                                        'transition-all duration-200 active:scale-[0.98]',
                                        isCompleted
                                            ? 'bg-surface-hover/30 border-surface-border opacity-50 cursor-default'
                                            : 'bg-surface-bg border-surface-border hover:border-brand-accent/40 hover:shadow-sm group',
                                    ].join(' ')}
                                >
                                    <div className="flex items-center gap-3 px-4 py-3">
                                        {/* Icon */}
                                        <div className={[
                                            'w-9 h-9 flex items-center justify-center flex-shrink-0 rounded-xl transition-all duration-200',
                                            isCompleted
                                                ? 'bg-surface-hover text-text-muted'
                                                : 'bg-surface-hover text-text-secondary group-hover:bg-brand-accent/10 group-hover:text-brand-accent',
                                        ].join(' ')}>
                                            {isCompleted
                                                ? <CheckCircleIcon className="w-4.5 h-4.5" />
                                                : <TaskIcon type={task.type} className="w-4.5 h-4.5" />
                                            }
                                        </div>

                                        {/* Content */}
                                        <div className="flex-grow min-w-0">
                                            <h3 className={`font-bold text-[13px] text-text-primary tracking-tight truncate ${isCompleted ? 'line-through text-text-muted' : ''}`}>
                                                {task.name}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider bg-surface-hover px-1.5 py-0.5 rounded-md border border-surface-border">
                                                    {task.timeOfDay}
                                                </span>
                                                <span className="text-[10px] text-text-secondary font-medium">{details}</span>
                                            </div>
                                        </div>

                                        {/* Arrow */}
                                        {!isCompleted && (
                                            <ChevronRightIcon className="w-4 h-4 text-text-muted flex-shrink-0 group-hover:text-brand-accent transition-colors" />
                                        )}
                                    </div>

                                    {/* In-progress bar */}
                                    {!isCompleted && taskProgress > 0 && (
                                        <div
                                            className="absolute bottom-0 left-0 h-[2px] bg-brand-accent transition-all duration-500 rounded-r-full"
                                            style={{ width: `${taskProgress * 100}%` }}
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    /* ── Rest Day State ────────────────────────────────── */
                    <div className="rounded-xl border border-dashed border-surface-border bg-surface-hover/20 px-5 py-6 flex flex-col items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-surface-hover flex items-center justify-center">
                            <MoonIcon className="w-5 h-5 text-text-muted" />
                        </div>
                        <p className="text-[11px] font-black text-text-primary uppercase tracking-widest text-center">
                            Descanso Programado
                        </p>
                        <p className="text-[10px] text-text-secondary text-center max-w-[200px] leading-relaxed">
                            La recuperación es parte esencial del proceso. Descansa bien.
                        </p>
                        <div className="mt-2 flex flex-col gap-1.5 w-full max-w-[220px]">
                            <button
                                onClick={() => { vibrate(5); setIsLoggingActivity('run'); }}
                                className="text-[10px] font-bold text-text-secondary border border-surface-border rounded-lg py-2 hover:bg-surface-hover hover:text-text-primary transition-all active:scale-95"
                            >
                                + Registrar actividad libre
                            </button>
                        </div>
                    </div>
                )}
            </section>

            {/* ── ROW 2: NUTRITION + EXPLORA (bento 2-col) ──────────── */}
            <div className="grid grid-cols-2 gap-3 animate-fade-in-up" style={{ animationDelay: '180ms' }}>

                {/* ── Nutrition bento ──────────────────────────────── */}
                <section className="bg-surface-bg rounded-2xl border border-surface-border shadow-sm p-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black uppercase tracking-[0.18em] text-text-secondary flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-protein" />
                            Nutrición
                        </span>
                        <button
                            onClick={() => dispatch(actions.setActiveScreen('Nutrición'))}
                            className="text-[9px] font-bold text-brand-accent hover:underline transition-colors"
                        >
                            Ver →
                        </button>
                    </div>

                    {/* Calorie arc gauge + remaining */}
                    <div className="flex items-center justify-center gap-2">
                        <MacroArcGauge
                            pct={kcalPct}
                            value={Math.round(consumed.kcal)}
                            unit="kcal"
                            isOver={isKcalOver}
                            strokeClass="stroke-brand-accent"
                            textClass="text-text-primary"
                            size={72}
                            strokeWidth={5}
                        />
                        <div className="flex-grow min-w-0">
                            <p className={`text-[11px] font-heading font-black leading-none ${isKcalOver ? 'text-danger' : 'text-text-primary'}`}>
                                {isKcalOver ? 'Excedido' : `${Math.round(kcalRemaining)} restantes`}
                            </p>
                            <p className="text-[8px] font-bold text-text-muted uppercase tracking-wider">
                                / {dailyGoals.kcal} kcal
                            </p>
                        </div>
                    </div>

                    {/* Macro mini-bars */}
                    <div className="flex flex-col gap-1.5 mt-auto">
                        <MiniMacroBar label="P" current={consumed.protein} goal={dailyGoals.protein} colorClass="bg-brand-protein" />
                        <MiniMacroBar label="C" current={consumed.carbs}   goal={dailyGoals.carbs}   colorClass="bg-brand-carbs"   />
                        <MiniMacroBar label="G" current={consumed.fat}     goal={dailyGoals.fat}     colorClass="bg-brand-fat"     />
                    </div>
                </section>

                {/* ── Explore bento ────────────────────────────────── */}
                <section className="bg-surface-bg rounded-2xl border border-surface-border shadow-sm p-4 flex flex-col gap-3">
                    <span className="text-[9px] font-black uppercase tracking-[0.18em] text-text-secondary flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-carbs" />
                        Explorar
                    </span>

                    <div className="flex flex-col gap-2 flex-grow">
                        <ExploreBtn
                            icon={CardioIcon}
                            label="Carrera"
                            hoverColor="bg-brand-protein/10"
                            onClick={() => { vibrate(5); setIsLoggingActivity('run'); }}
                        />
                        <ExploreBtn
                            icon={MountainIcon}
                            label="Senderismo"
                            hoverColor="bg-brand-carbs/10"
                            onClick={() => { vibrate(5); setIsLoggingActivity('hike'); }}
                        />
                        <ExploreBtn
                            icon={FireIcon}
                            label="Rucking"
                            hoverColor="bg-brand-fat/10"
                            onClick={() => { vibrate(5); setIsLoggingActivity('rucking'); }}
                        />
                    </div>
                </section>
            </div>
        </div>
    );
};

// ── Internal icon re-used in rest state ─────────────────────────────────────
const MoonIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
    </svg>
);

export default HoyScreen;
