
import React from 'react';
import type { RoutineTask, RoutineTaskType } from '../types';
import { useHoyLogic } from '../hooks/useHoyLogic';
import type { HabitStatus } from '../hooks/useHoyLogic';
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
import RuckingSession from './rutina-activa/RuckingSession';
import CardioLibreLogModal from '../components/dialogs/CardioLibreLogModal';
import MacroArcGauge from '../components/MacroArcGauge';
import Button from '../components/Button';
import IconButton from '../components/IconButton';

// ── Helpers ───────────────────────────────────────────────────────────────────

const STATUS_DOT: Record<HabitStatus, string> = {
    success: 'bg-success',
    warning: 'bg-warning',
    danger:  'bg-danger',
    neutral: 'bg-surface-border',
};

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

const MoonIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
    </svg>
);

// ── Screen ─────────────────────────────────────────────────────────────────────

const HoyScreen: React.FC = () => {
    const hoy = useHoyLogic();

    if (hoy.isRuckingActive) {
        return (
            <RuckingSession
                onFinish={hoy.finishRucking}
                onCancel={() => hoy.setIsRuckingActive(false)}
            />
        );
    }

    // Macro arcs percentages
    const pPct = hoy.dailyGoals.protein > 0 ? Math.min((hoy.consumed.protein / hoy.dailyGoals.protein) * 100, 100) : 0;
    const cPct = hoy.dailyGoals.carbs   > 0 ? Math.min((hoy.consumed.carbs   / hoy.dailyGoals.carbs)   * 100, 100) : 0;
    const fPct = hoy.dailyGoals.fat     > 0 ? Math.min((hoy.consumed.fat     / hoy.dailyGoals.fat)     * 100, 100) : 0;

    const primaryTask    = hoy.tasksToDisplay[0] ?? null;
    const secondaryTasks = hoy.tasksToDisplay.slice(1);

    // Console chip data for Innegociables
    const chips: Array<{
        key:     string;
        status:  HabitStatus;
        value:   string;
        goal:    string;
        label:   string;
        onClick?: () => void;
    }> = [
        { key: 'protein',  status: hoy.habitStatuses.protein,  value: `${Math.round(hoy.consumed.protein)}`, goal: `${hoy.dailyGoals.protein}g`, label: 'PROTEÍNA' },
        { key: 'kcal',     status: hoy.habitStatuses.calories, value: `${Math.round(hoy.consumed.kcal)}`,    goal: `${hoy.dailyGoals.kcal}`,     label: 'KCAL'     },
        { key: 'sleep',    status: hoy.habitStatuses.sleep,    value: '—',                                    goal: '7 h',                         label: 'SUEÑO',    onClick: hoy.onToggleSleep },
        { key: 'steps',    status: hoy.habitStatuses.steps,    value: '—',                                    goal: '10 k',                        label: 'PASOS',    onClick: hoy.onToggleSteps },
    ];

    return (
        <div className="grid grid-cols-12 gap-bento px-4 sm:px-6 pb-section mx-auto max-w-2xl w-full">

            {/* Modal */}
            {hoy.isLoggingActivity && (
                <CardioLibreLogModal
                    activityType={hoy.isLoggingActivity}
                    onSave={
                        hoy.isLoggingActivity === 'run'  ? hoy.handleSaveRun  :
                        hoy.isLoggingActivity === 'hike' ? hoy.handleSaveHike :
                        hoy.handleSaveRucking
                    }
                    onClose={hoy.closeActivityLog}
                />
            )}

            {/* ── ROW 1 · CABECERA ──────────────────────────────── col-12 */}
            <header className="col-span-12 flex items-start justify-between pt-4 pb-1 animate-fade-in-up">
                <div className="flex flex-col gap-0.5">
                    <span className="ui-page-eyebrow">Panel diario</span>
                    <h1 className="font-heading text-2xl font-black text-text-primary leading-tight tracking-tight">
                        {hoy.capitalizedDate}
                    </h1>
                    <p className="text-sm text-text-secondary">
                        {hoy.customMantra || `Hola, ${hoy.userName}`}
                    </p>
                </div>
                <IconButton
                    onClick={hoy.openProfile}
                    icon={UserCircleIcon}
                    label="Perfil"
                    variant="secondary"
                    size="large"
                />
            </header>

            {/* ── ROW 2 · INNEGOCIABLES chip-line ──────────────── col-12 */}
            <div
                className="col-span-12 ui-surface p-bento-pad animate-fade-in-up"
                style={{ animationDelay: '40ms' }}
            >
                <div className="flex divide-x divide-surface-border/50">
                    {chips.map(({ key, status, value, goal, label, onClick }) => {
                        const Tag = onClick ? 'button' : ('div' as React.ElementType);
                        return (
                            <Tag
                                key={key}
                                onClick={onClick}
                                className={[
                                    'flex-1 flex flex-col gap-1.5 px-3 first:pl-0 last:pr-0 text-left min-w-0',
                                    onClick ? 'cursor-pointer transition-opacity duration-150 active:opacity-60' : '',
                                ].join(' ')}
                            >
                                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${STATUS_DOT[status]}`} />
                                <div className="flex items-baseline gap-0.5 leading-none min-w-0">
                                    <span className="text-lg font-black font-mono text-text-primary leading-none tabular-nums truncate">
                                        {value}
                                    </span>
                                    <span className="text-[9px] font-mono text-text-muted leading-none flex-shrink-0">
                                        /{goal}
                                    </span>
                                </div>
                                <span
                                    className="text-[8px] font-black uppercase text-text-secondary leading-none truncate"
                                    style={{ letterSpacing: 'var(--letter-spacing-caps)' }}
                                >
                                    {label}
                                </span>
                            </Tag>
                        );
                    })}
                </div>
            </div>

            {/* ── ROW 3 · MISIÓN (8) + EXPLORAR (4) ───────────────────── */}

            {/* Mission */}
            <section
                className="col-span-12 sm:col-span-8 ui-surface p-bento-pad flex flex-col animate-fade-in-up"
                style={{ animationDelay: '80ms' }}
            >
                <div className="flex items-center justify-between mb-3">
                    <span className="ui-section__eyebrow">Misión de Hoy</span>
                    <button
                        onClick={hoy.openPlanner}
                        className="text-[9px] font-bold text-brand-accent hover:underline transition-colors"
                    >
                        Gestionar →
                    </button>
                </div>

                {primaryTask ? (() => {
                    const uid    = `${primaryTask.id}-${primaryTask.timeOfDay}`;
                    const isDone = hoy.session.dailyProgress.completedTasks.includes(uid);
                    const pct    = hoy.session.activeRoutineInfo?.id === uid
                        ? hoy.session.activeRoutineInfo.progress
                        : isDone ? 1 : 0;

                    return (
                        <>
                            {/* Hero task — typographic aggression */}
                            <button
                                onClick={() => hoy.onSelectRoutine(primaryTask)}
                                disabled={isDone}
                                className={[
                                    'w-full text-left group mb-3',
                                    isDone ? 'opacity-40 cursor-default' : '',
                                ].join(' ')}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-[9px] font-black uppercase text-text-muted bg-surface-hover border border-surface-border rounded-pill px-2 py-0.5" style={{ letterSpacing: 'var(--letter-spacing-caps)' }}>
                                        {primaryTask.timeOfDay}
                                    </span>
                                    {!isDone && (
                                        <TaskIcon type={primaryTask.type} className="w-3.5 h-3.5 text-brand-accent" />
                                    )}
                                </div>

                                <h2 className={[
                                    'font-heading font-black leading-none tracking-tight mb-1.5',
                                    'text-3xl sm:text-4xl',
                                    isDone
                                        ? 'line-through text-text-muted'
                                        : 'text-text-primary group-hover:text-brand-accent transition-colors duration-200',
                                ].join(' ')}>
                                    {primaryTask.name}
                                </h2>

                                <p className="text-[10px] text-text-secondary font-medium">
                                    {getTaskDetails(primaryTask, hoy.cardioWeek)}
                                </p>

                                {!isDone && pct > 0 && (
                                    <div className="mt-2.5 h-[2px] w-full bg-surface-hover rounded-pill overflow-hidden">
                                        <div
                                            className="h-full bg-brand-accent rounded-pill transition-all duration-500"
                                            style={{ width: `${pct * 100}%` }}
                                        />
                                    </div>
                                )}
                            </button>

                            {/* Secondary tasks */}
                            {secondaryTasks.length > 0 && (
                                <div className="flex flex-col gap-1.5 mt-auto pt-2 border-t border-surface-border/50">
                                    {secondaryTasks.map(task => {
                                        const sid   = `${task.id}-${task.timeOfDay}`;
                                        const sDone = hoy.session.dailyProgress.completedTasks.includes(sid);
                                        return (
                                            <button
                                                key={sid}
                                                onClick={() => hoy.onSelectRoutine(task)}
                                                disabled={sDone}
                                                className={[
                                                    'flex items-center gap-2.5 text-left rounded-input px-3 py-2',
                                                    'border border-surface-border/60 transition-all duration-200',
                                                    sDone
                                                        ? 'opacity-40 cursor-default bg-surface-hover/20'
                                                        : 'bg-surface-hover/20 hover:border-brand-accent/30 hover:bg-surface-hover group',
                                                ].join(' ')}
                                            >
                                                <div className="w-7 h-7 flex items-center justify-center rounded-input bg-surface-hover flex-shrink-0">
                                                    {sDone
                                                        ? <CheckCircleIcon className="w-3.5 h-3.5 text-success" />
                                                        : <TaskIcon type={task.type} className="w-3.5 h-3.5 text-text-secondary group-hover:text-brand-accent transition-colors" />
                                                    }
                                                </div>
                                                <div className="min-w-0 flex-grow">
                                                    <p className={`text-[11px] font-bold truncate ${sDone ? 'line-through text-text-muted' : 'text-text-primary'}`}>
                                                        {task.name}
                                                    </p>
                                                    <p className="text-[8px] text-text-muted font-black uppercase" style={{ letterSpacing: 'var(--letter-spacing-caps)' }}>
                                                        {task.timeOfDay}
                                                    </p>
                                                </div>
                                                {!sDone && (
                                                    <ChevronRightIcon className="w-3.5 h-3.5 text-text-muted flex-shrink-0 group-hover:text-brand-accent transition-colors" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    );
                })() : (
                    <div className="ui-surface--inset flex flex-col items-center gap-2 px-5 py-6">
                        <div className="w-9 h-9 rounded-pill bg-surface-hover flex items-center justify-center">
                            <MoonIcon className="w-4 h-4 text-text-muted" />
                        </div>
                        <p className="text-[11px] font-black text-text-primary uppercase tracking-widest text-center">
                            Descanso Programado
                        </p>
                        <p className="text-[10px] text-text-secondary text-center leading-relaxed">
                            La recuperación es parte esencial del proceso.
                        </p>
                        <Button
                            onClick={() => hoy.openActivityLog('run')}
                            variant="secondary"
                            size="small"
                            className="mt-1"
                        >
                            Registrar actividad libre
                        </Button>
                    </div>
                )}
            </section>

            {/* Explore */}
            <section
                className="col-span-12 sm:col-span-4 ui-surface p-bento-pad flex flex-col gap-bento animate-fade-in-up"
                style={{ animationDelay: '100ms' }}
            >
                <span className="ui-section__eyebrow">Explorar</span>
                <div className="flex flex-col gap-2 flex-grow justify-center">
                    {([
                        { icon: CardioIcon,   label: 'Carrera',    type: 'run'     as const },
                        { icon: MountainIcon, label: 'Senderismo', type: 'hike'    as const },
                        { icon: FireIcon,     label: 'Rucking',    type: 'rucking' as const },
                    ] as const).map(({ icon: Icon, label, type }) => (
                        <button
                            key={type}
                            onClick={() => hoy.openActivityLog(type)}
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-card border border-surface-border bg-surface-hover/20 hover:bg-surface-hover hover:border-brand-accent/30 transition-all duration-200 active:scale-[0.95] group"
                        >
                            <div className="w-7 h-7 flex items-center justify-center rounded-input bg-surface-hover group-hover:bg-brand-accent/10 transition-colors flex-shrink-0">
                                <Icon className="w-3.5 h-3.5 text-text-secondary group-hover:text-brand-accent transition-colors" />
                            </div>
                            <span className="text-[10px] font-black uppercase text-text-secondary group-hover:text-text-primary transition-colors flex-grow" style={{ letterSpacing: 'var(--letter-spacing-caps)' }}>
                                {label}
                            </span>
                            <ChevronRightIcon className="w-3.5 h-3.5 text-text-muted opacity-0 group-hover:opacity-100 group-hover:text-brand-accent transition-all" />
                        </button>
                    ))}
                </div>
            </section>

            {/* ── ROW 4 · NUTRICIÓN ─────────────────────────────── col-6 */}
            <section
                className="col-span-12 sm:col-span-6 ui-surface--glass shadow-glow-lg p-bento-pad flex flex-col gap-3 animate-fade-in-up"
                style={{ animationDelay: '130ms' }}
            >
                <div className="flex items-center justify-between">
                    <span className="ui-section__eyebrow">Nutrición</span>
                    <button
                        onClick={hoy.openNutrition}
                        className="text-[9px] font-bold text-brand-accent hover:underline transition-colors"
                    >
                        Ver →
                    </button>
                </div>

                {/* Kcal — main arc */}
                <div className="flex items-center gap-3">
                    <MacroArcGauge
                        pct={hoy.kcalPct}
                        value={Math.round(hoy.consumed.kcal)}
                        unit="kcal"
                        isOver={hoy.isKcalOver}
                        strokeClass="stroke-brand-accent"
                        textClass="text-text-primary"
                        size={80}
                        strokeWidth={6}
                    />
                    <div>
                        <p className={`text-sm font-black leading-tight ${hoy.isKcalOver ? 'text-danger' : 'text-text-primary'}`}>
                            {hoy.isKcalOver ? 'Excedido' : `${Math.round(hoy.kcalRemaining)} rest.`}
                        </p>
                        <p className="text-[9px] font-mono font-bold text-text-muted uppercase" style={{ letterSpacing: 'var(--letter-spacing-caps)' }}>
                            / {hoy.dailyGoals.kcal} kcal
                        </p>
                    </div>
                </div>

                {/* P · C · G — three semicircle arcs */}
                <div className="flex items-end justify-around mt-auto gap-1">
                    {([
                        { pct: pPct, val: Math.round(hoy.consumed.protein), unit: 'g', stroke: 'stroke-brand-accent', label: 'PROT' },
                        { pct: cPct, val: Math.round(hoy.consumed.carbs),   unit: 'g', stroke: 'stroke-brand-carbs',  label: 'CARB' },
                        { pct: fPct, val: Math.round(hoy.consumed.fat),     unit: 'g', stroke: 'stroke-brand-fat',    label: 'GRAS' },
                    ] as const).map(({ pct, val, unit, stroke, label }) => (
                        <div key={label} className="flex flex-col items-center gap-0.5">
                            <MacroArcGauge
                                pct={pct}
                                value={val}
                                unit={unit}
                                isOver={false}
                                strokeClass={stroke}
                                textClass="text-text-primary"
                                size={52}
                                strokeWidth={4}
                            />
                            <span
                                className="text-[7px] font-black uppercase text-text-muted"
                                style={{ letterSpacing: 'var(--letter-spacing-caps)' }}
                            >
                                {label}
                            </span>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    );
};

export default HoyScreen;
