
import React from 'react';
import type { RoutineTask, RoutineTaskType } from '../types';
import { useHoyLogic } from '../hooks/useHoyLogic';
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
import WeeklyGlanceWidget from '../components/hoy/WeeklyGlanceWidget';
import DailyNonNegotiablesWidget from '../components/hoy/DailyNonNegotiablesWidget';
import RuckingSession from './rutina-activa/RuckingSession';
import CardioLibreLogModal from '../components/dialogs/CardioLibreLogModal';
import SectionHeader from '../components/SectionHeader';
import MacroArcGauge from '../components/MacroArcGauge';
import Button from '../components/Button';
import IconButton from '../components/IconButton';
import { PageHeader } from '../components/layout';

// ── Inline helpers ────────────────────────────────────────────────────────────

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

const MiniMacroBar: React.FC<{ label: string; current: number; goal: number; barClass: string }> = ({
    label, current, goal, barClass,
}) => {
    const pct = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
    return (
        <div className="flex flex-col gap-0.5">
            <div className="flex justify-between items-center">
                <span className="text-[8px] font-black uppercase tracking-widest text-text-muted">{label}</span>
                <span className="text-[8px] font-mono font-bold text-text-secondary">
                    {Math.round(current)}<span className="opacity-40">/{Math.round(goal)}</span>
                </span>
            </div>
            <div className="h-1 w-full rounded-pill bg-surface-hover overflow-hidden">
                <div className={`h-full rounded-pill transition-all duration-700 ${barClass}`} style={{ width: `${pct}%` }} />
            </div>
        </div>
    );
};

const MoonIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
    </svg>
);

// ── Dumb screen — consumes useHoyLogic, renders Command Center Bento ──────────

const HoyScreen: React.FC = () => {
    const hoy = useHoyLogic();

    // Focus mode: active rucking session
    if (hoy.isRuckingActive) {
        return (
            <RuckingSession
                onFinish={hoy.finishRucking}
                onCancel={() => hoy.setIsRuckingActive(false)}
            />
        );
    }

    return (
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 pb-section">

            {/* ── Modals ────────────────────────────────────────────────── */}
            {hoy.isLoggingActivity && (
                <CardioLibreLogModal
                    activityType={hoy.isLoggingActivity}
                    onSave={
                        hoy.isLoggingActivity === 'run'     ? hoy.handleSaveRun  :
                        hoy.isLoggingActivity === 'hike'    ? hoy.handleSaveHike :
                        hoy.handleSaveRucking
                    }
                    onClose={hoy.closeActivityLog}
                />
            )}

            {/* ── HEADER ────────────────────────────────────────────────── */}
            <PageHeader
                size="compact"
                className="animate-fade-in-up pb-bento-pad"
                eyebrow="Panel diario"
                title={hoy.capitalizedDate}
                subtitle={hoy.customMantra || `Hola, ${hoy.userName}`}
                actions={(
                    <IconButton
                        onClick={hoy.openProfile}
                        icon={UserCircleIcon}
                        label="Abrir perfil"
                        variant="secondary"
                        size="large"
                    />
                )}
            />

            {/* ── ROW 1 · Semana + Innegociables ────────────────────────── */}
            <div
                className="grid grid-cols-2 gap-bento mb-bento animate-fade-in-up"
                style={{ animationDelay: '60ms' }}
            >
                <WeeklyGlanceWidget
                    progress={hoy.progress}
                    weeklySchedule={hoy.weeklySchedule}
                />
                <DailyNonNegotiablesWidget
                    habitStatuses={hoy.habitStatuses}
                    onToggleSleep={hoy.onToggleSleep}
                    onToggleSteps={hoy.onToggleSteps}
                />
            </div>

            {/* ── ROW 2 · Misión del Día ─────────────────────────────────── */}
            <section
                className="ui-surface p-bento-pad mb-bento animate-fade-in-up"
                style={{ animationDelay: '120ms' }}
            >
                <SectionHeader
                    title="Misión de Hoy"
                    action={{ label: 'Gestionar', onClick: hoy.openPlanner }}
                />

                {hoy.tasksToDisplay.length > 0 ? (
                    <div className="flex flex-col gap-2.5 mt-3">
                        {hoy.tasksToDisplay.map((task) => {
                            const uid         = `${task.id}-${task.timeOfDay}`;
                            const isCompleted = hoy.session.dailyProgress.completedTasks.includes(uid);
                            const taskPct     = hoy.session.activeRoutineInfo?.id === uid
                                ? hoy.session.activeRoutineInfo.progress
                                : isCompleted ? 1 : 0;
                            const details = getTaskDetails(task, hoy.cardioWeek);

                            return (
                                <button
                                    key={uid}
                                    onClick={() => hoy.onSelectRoutine(task)}
                                    disabled={isCompleted}
                                    className={[
                                        'relative w-full text-left overflow-hidden rounded-card border',
                                        'transition-all duration-300 active:scale-[0.98]',
                                        isCompleted
                                            ? 'bg-surface-hover/30 border-surface-border opacity-50 cursor-default'
                                            : 'bg-surface-bg border-surface-border hover:border-brand-accent/40 hover:shadow-glow group',
                                    ].join(' ')}
                                >
                                    <div className="flex items-center gap-3 px-4 py-3">
                                        {/* Task icon */}
                                        <div className={[
                                            'w-9 h-9 flex items-center justify-center flex-shrink-0 rounded-input transition-all duration-200',
                                            isCompleted
                                                ? 'bg-surface-hover text-text-muted'
                                                : 'bg-surface-hover text-text-secondary group-hover:bg-brand-accent/10 group-hover:text-brand-accent',
                                        ].join(' ')}>
                                            {isCompleted
                                                ? <CheckCircleIcon className="w-4 h-4" />
                                                : <TaskIcon type={task.type} className="w-4 h-4" />
                                            }
                                        </div>

                                        {/* Name + badges */}
                                        <div className="flex-grow min-w-0">
                                            <h3 className={[
                                                'font-bold text-[13px] tracking-tight truncate',
                                                isCompleted ? 'line-through text-text-muted' : 'text-text-primary',
                                            ].join(' ')}>
                                                {task.name}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest bg-surface-hover px-2 py-0.5 rounded-pill border border-surface-border">
                                                    {task.timeOfDay}
                                                </span>
                                                <span className="text-[10px] text-text-secondary font-medium">{details}</span>
                                            </div>
                                        </div>

                                        {!isCompleted && (
                                            <ChevronRightIcon className="w-4 h-4 text-text-muted flex-shrink-0 group-hover:text-brand-accent transition-colors" />
                                        )}
                                    </div>

                                    {/* Live progress bar — green electric */}
                                    {!isCompleted && taskPct > 0 && (
                                        <div
                                            className="absolute bottom-0 left-0 h-[2px] bg-brand-accent rounded-r-pill transition-all duration-500"
                                            style={{ width: `${taskPct * 100}%` }}
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    /* Rest day */
                    <div className="mt-3 ui-surface--inset px-5 py-6 flex flex-col items-center gap-2">
                        <div className="w-10 h-10 rounded-pill bg-surface-hover flex items-center justify-center">
                            <MoonIcon className="w-5 h-5 text-text-muted" />
                        </div>
                        <p className="text-[11px] font-black text-text-primary uppercase tracking-widest text-center">
                            Descanso Programado
                        </p>
                        <p className="text-[10px] text-text-secondary text-center leading-relaxed max-w-[200px]">
                            La recuperación es parte esencial del proceso.
                        </p>
                        <div className="mt-2 w-full max-w-[220px]">
                            <Button
                                onClick={() => hoy.openActivityLog('run')}
                                variant="secondary"
                                size="small"
                                className="w-full"
                            >
                                Registrar actividad libre
                            </Button>
                        </div>
                    </div>
                )}
            </section>

            {/* ── ROW 3 · Nutrición + Explorar ──────────────────────────── */}
            <div
                className="grid grid-cols-2 gap-bento animate-fade-in-up"
                style={{ animationDelay: '180ms' }}
            >
                {/* Nutrition — glassmorphism card */}
                <section className="ui-surface--glass shadow-glow-lg p-bento-pad flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black uppercase tracking-widest text-text-secondary flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
                            Nutrición
                        </span>
                        <button
                            onClick={hoy.openNutrition}
                            className="text-[9px] font-bold text-brand-accent hover:underline transition-colors"
                        >
                            Ver →
                        </button>
                    </div>

                    {/* Calorie arc gauge */}
                    <div className="flex items-center gap-2">
                        <MacroArcGauge
                            pct={hoy.kcalPct}
                            value={Math.round(hoy.consumed.kcal)}
                            unit="kcal"
                            isOver={hoy.isKcalOver}
                            strokeClass="stroke-brand-accent"
                            textClass="text-text-primary"
                            size={72}
                            strokeWidth={5}
                        />
                        <div className="flex-grow min-w-0">
                            <p className={`text-[11px] font-heading font-black leading-none ${hoy.isKcalOver ? 'text-danger' : 'text-text-primary'}`}>
                                {hoy.isKcalOver ? 'Excedido' : `${Math.round(hoy.kcalRemaining)} rest.`}
                            </p>
                            <p className="text-[8px] font-bold text-text-muted uppercase tracking-widest">
                                / {hoy.dailyGoals.kcal} kcal
                            </p>
                        </div>
                    </div>

                    {/* Macro bars — protein uses brand-accent (innegociable) */}
                    <div className="flex flex-col gap-1.5 mt-auto">
                        <MiniMacroBar label="P" current={hoy.consumed.protein} goal={hoy.dailyGoals.protein} barClass="bg-brand-accent"  />
                        <MiniMacroBar label="C" current={hoy.consumed.carbs}   goal={hoy.dailyGoals.carbs}   barClass="bg-brand-carbs"   />
                        <MiniMacroBar label="G" current={hoy.consumed.fat}     goal={hoy.dailyGoals.fat}     barClass="bg-brand-fat"     />
                    </div>
                </section>

                {/* Explore */}
                <section className="ui-surface p-bento-pad flex flex-col gap-3">
                    <span className="text-[9px] font-black uppercase tracking-widest text-text-secondary flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-carbs" />
                        Explorar
                    </span>

                    <div className="flex flex-col gap-2 flex-grow">
                        {([
                            { icon: CardioIcon,   label: 'Carrera',    type: 'run'     as const },
                            { icon: MountainIcon, label: 'Senderismo', type: 'hike'    as const },
                            { icon: FireIcon,     label: 'Rucking',    type: 'rucking' as const },
                        ] as const).map(({ icon: Icon, label, type }) => (
                            <button
                                key={type}
                                onClick={() => hoy.openActivityLog(type)}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-card border border-surface-border bg-surface-hover/30 hover:bg-surface-hover hover:border-brand-accent/30 transition-all duration-200 active:scale-[0.95] group"
                            >
                                <div className="w-7 h-7 flex items-center justify-center rounded-input bg-surface-hover group-hover:bg-brand-accent/10 transition-colors flex-shrink-0">
                                    <Icon className="w-3.5 h-3.5 text-text-secondary group-hover:text-brand-accent transition-colors" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary group-hover:text-text-primary transition-colors">
                                    {label}
                                </span>
                                <ChevronRightIcon className="w-3.5 h-3.5 text-text-muted ml-auto opacity-0 group-hover:opacity-100 group-hover:text-brand-accent transition-all" />
                            </button>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default HoyScreen;
