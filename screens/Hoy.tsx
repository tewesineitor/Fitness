
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

    // ── Innegociable arc chips ────────────────────────────────────────────────
    const sleepPct = Math.min((hoy.session.dailyHabits.sleepHours / 7) * 100, 100);
    const stepsPct = (hoy.session.dailyHabits.stepsGoalMet || hoy.session.dailyHabits.ruckingSessionMet) ? 100 : 0;

    const arcChips: Array<{
        key: string; label: string; pct: number;
        value: number | string; unit: string;
        stroke: string; isOver: boolean; onClick?: () => void;
    }> = [
        { key: 'protein', label: 'PROT',  pct: pPct,        value: Math.round(hoy.consumed.protein),        unit: 'g', stroke: 'stroke-brand-accent', isOver: false },
        { key: 'kcal',    label: 'KCAL',  pct: hoy.kcalPct, value: Math.round(hoy.consumed.kcal),           unit: 'k', stroke: 'stroke-brand-accent', isOver: hoy.isKcalOver },
        { key: 'sleep',   label: 'SUEÑO', pct: sleepPct,    value: hoy.session.dailyHabits.sleepHours || 0, unit: 'h', stroke: 'stroke-brand-carbs',  isOver: false, onClick: hoy.onToggleSleep },
        { key: 'steps',   label: 'PASOS', pct: stepsPct,    value: stepsPct > 0 ? '✓' : '—',               unit: '',  stroke: 'stroke-brand-fat',    isOver: false, onClick: hoy.onToggleSteps },
    ];

    // ── Weekly habit tracker ──────────────────────────────────────────────────
    const toLocalDateStr = (d: Date) =>
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    const trackerToday = new Date();
    const trackerStart = new Date(trackerToday);
    trackerStart.setDate(trackerToday.getDate() - ((trackerToday.getDay() + 6) % 7));
    const weekDays   = Array.from({ length: 7 }, (_, i) => { const d = new Date(trackerStart); d.setDate(trackerStart.getDate() + i); return d; });
    const DAY_LABELS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    const todayStr   = toLocalDateStr(trackerToday);

    const metToday = [
        hoy.habitStatuses.protein  === 'success',
        hoy.habitStatuses.calories !== 'danger',
        hoy.habitStatuses.sleep    === 'success',
        hoy.habitStatuses.steps    === 'success',
    ].filter(Boolean).length;

    const activityDatesRaw = hoy.progress.progressTracker.activityDates;
    const activitySet = new Set(
        activityDatesRaw instanceof Set ? [...activityDatesRaw] : (activityDatesRaw as string[])
    );

    const getDayPillClass = (d: Date): string => {
        const ds = toLocalDateStr(d);
        if (ds > todayStr)    return 'bg-zinc-800/60';
        if (ds === todayStr) {
            if (metToday >= 4) return 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]';
            if (metToday === 3) return 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.4)]';
            return 'bg-zinc-700';
        }
        return activitySet.has(ds) ? 'bg-cyan-400/50' : 'bg-zinc-800';
    };

    return (
        <div className="flex flex-col gap-4 px-4 pb-36 mx-auto max-w-2xl w-full">

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

            {/* ── HEADER ──────────────────────────────────────────────── */}
            <header className="flex items-start justify-between pt-6 pb-1 animate-fade-in-up">
                <div className="flex flex-col gap-1">
                    <span
                        className="text-[10px] font-black uppercase text-zinc-500"
                        style={{ letterSpacing: 'var(--letter-spacing-caps)' }}
                    >
                        Panel diario
                    </span>
                    <h1 className="font-heading text-3xl font-black text-white leading-tight tracking-tight">
                        {hoy.capitalizedDate}
                    </h1>
                    <p className="text-sm text-zinc-400">
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

            {/* ── WEEKLY HABIT TRACKER ─────────────────────────────────── */}
            <div
                className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-[2rem] px-5 py-4 animate-fade-in-up"
                style={{ animationDelay: '30ms' }}
            >
                <div className="flex items-center justify-between mb-3">
                    <span
                        className="text-[9px] font-black uppercase text-zinc-500"
                        style={{ letterSpacing: 'var(--letter-spacing-caps)' }}
                    >
                        Esta semana
                    </span>
                    <span className="text-[9px] font-bold text-zinc-400">
                        {metToday}/4 hoy
                    </span>
                </div>
                <div className="grid grid-cols-7 gap-2">
                    {weekDays.map((d, i) => {
                        const isToday = toLocalDateStr(d) === todayStr;
                        return (
                            <div key={i} className="flex flex-col items-center gap-1.5">
                                <span
                                    className={`text-[8px] font-black uppercase ${isToday ? 'text-white' : 'text-zinc-600'}`}
                                    style={{ letterSpacing: 'var(--letter-spacing-caps)' }}
                                >
                                    {DAY_LABELS[i]}
                                </span>
                                <div className={`w-full h-2 rounded-full transition-all duration-300 ${getDayPillClass(d)}`} />
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ── MISIÓN DEL DÍA ───────────────────────────────────────── */}
            <section
                className="relative overflow-hidden bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-[2rem] p-5 flex flex-col gap-4 animate-fade-in-up"
                style={{ animationDelay: '60ms' }}
            >
                {/* Atmospheric texture layer */}
                <div
                    className="absolute inset-0 rounded-[2rem] pointer-events-none"
                    style={{
                        background: [
                            'radial-gradient(ellipse 130% 90% at 10% 15%, rgba(52,211,153,0.07) 0%, transparent 55%)',
                            'radial-gradient(ellipse 90% 110% at 90% 85%, rgba(56,189,248,0.05) 0%, transparent 50%)',
                            'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(39,39,42,0.3) 0%, transparent 100%)',
                        ].join(', '),
                    }}
                />

                <div className="relative z-10 flex items-center justify-between">
                    <span
                        className="text-[9px] font-black uppercase text-zinc-500"
                        style={{ letterSpacing: 'var(--letter-spacing-caps)' }}
                    >
                        Misión de Hoy
                    </span>
                    <button
                        onClick={hoy.openPlanner}
                        className="text-[9px] font-bold text-zinc-400 hover:text-emerald-400 transition-colors"
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
                            <button
                                onClick={() => hoy.onSelectRoutine(primaryTask)}
                                disabled={isDone}
                                className={[
                                    'relative z-10 w-full text-left group',
                                    isDone ? 'opacity-40 cursor-default' : '',
                                ].join(' ')}
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <span
                                        className="text-[9px] font-black uppercase text-zinc-400 bg-zinc-800/60 border border-zinc-700/50 rounded-full px-3 py-1"
                                        style={{ letterSpacing: 'var(--letter-spacing-caps)' }}
                                    >
                                        {primaryTask.timeOfDay}
                                    </span>
                                    {!isDone && (
                                        <TaskIcon type={primaryTask.type} className="w-4 h-4 text-emerald-400" />
                                    )}
                                </div>

                                <h2 className={[
                                    'font-heading font-black leading-none tracking-tight mb-2 text-4xl sm:text-5xl',
                                    isDone
                                        ? 'line-through text-zinc-600'
                                        : 'text-white group-hover:text-emerald-400 transition-colors duration-200',
                                ].join(' ')}>
                                    {primaryTask.name}
                                </h2>

                                <p className="text-sm text-zinc-400 font-medium">
                                    {getTaskDetails(primaryTask, hoy.cardioWeek)}
                                </p>

                                {!isDone && pct > 0 && (
                                    <div className="mt-3 h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                                            style={{ width: `${pct * 100}%` }}
                                        />
                                    </div>
                                )}
                            </button>

                            {!isDone && (
                                <button
                                    onClick={() => hoy.onSelectRoutine(primaryTask)}
                                    className="relative z-10 w-full bg-emerald-400 text-zinc-950 font-black text-sm rounded-full py-3.5 shadow-[0_0_30px_rgba(52,211,153,0.25)] active:scale-[0.97] transition-all duration-150 select-none"
                                >
                                    Empezar Rutina
                                </button>
                            )}

                            {secondaryTasks.length > 0 && (
                                <div className="relative z-10 flex flex-col gap-2 pt-2 border-t border-zinc-800/50">
                                    {secondaryTasks.map(task => {
                                        const sid   = `${task.id}-${task.timeOfDay}`;
                                        const sDone = hoy.session.dailyProgress.completedTasks.includes(sid);
                                        return (
                                            <button
                                                key={sid}
                                                onClick={() => hoy.onSelectRoutine(task)}
                                                disabled={sDone}
                                                className={[
                                                    'flex items-center gap-3 text-left rounded-[1.5rem] px-4 py-3',
                                                    'border border-zinc-800/50 transition-all duration-200',
                                                    sDone
                                                        ? 'opacity-40 cursor-default bg-zinc-900/30'
                                                        : 'bg-zinc-800/30 hover:border-emerald-400/30 active:bg-zinc-800/40 cursor-pointer select-none group',
                                                ].join(' ')}
                                            >
                                                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-800 flex-shrink-0">
                                                    {sDone
                                                        ? <CheckCircleIcon className="w-4 h-4 text-emerald-400" />
                                                        : <TaskIcon type={task.type} className="w-4 h-4 text-zinc-400 group-hover:text-emerald-400 transition-colors" />
                                                    }
                                                </div>
                                                <div className="min-w-0 flex-grow">
                                                    <p className={`text-sm font-bold truncate ${sDone ? 'line-through text-zinc-600' : 'text-zinc-100'}`}>
                                                        {task.name}
                                                    </p>
                                                    <p
                                                        className="text-[9px] text-zinc-500 font-black uppercase"
                                                        style={{ letterSpacing: 'var(--letter-spacing-caps)' }}
                                                    >
                                                        {task.timeOfDay}
                                                    </p>
                                                </div>
                                                {!sDone && (
                                                    <ChevronRightIcon className="w-4 h-4 text-zinc-500 flex-shrink-0 group-hover:text-emerald-400 transition-colors" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    );
                })() : (
                    /* ── REST DAY with atmospheric texture ── */
                    <div className="relative z-10 flex flex-col items-center gap-4 py-6">
                        <div className="w-14 h-14 rounded-full bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center shadow-[0_0_24px_rgba(56,189,248,0.12)]">
                            <MoonIcon className="w-6 h-6 text-zinc-300" />
                        </div>
                        <div className="text-center">
                            <p className="font-heading text-xl font-black text-white uppercase tracking-wide mb-1.5">
                                Hoy toca descanso
                            </p>
                            <p className="text-sm text-zinc-400 leading-relaxed max-w-[220px] mx-auto">
                                La recuperación es parte esencial del proceso.
                            </p>
                        </div>
                        <button
                            onClick={() => hoy.openActivityLog('run')}
                            className="bg-emerald-400 text-zinc-950 font-black text-sm rounded-full px-8 py-3.5 shadow-[0_0_30px_rgba(52,211,153,0.25)] active:scale-[0.97] transition-all duration-150 select-none"
                        >
                            Registrar actividad libre
                        </button>
                    </div>
                )}
            </section>

            {/* ── INNEGOCIABLES ────────────────────────────────────────── */}
            <div
                className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-[2rem] p-5 animate-fade-in-up"
                style={{ animationDelay: '90ms' }}
            >
                <span
                    className="text-[9px] font-black uppercase text-zinc-500 mb-4 block"
                    style={{ letterSpacing: 'var(--letter-spacing-caps)' }}
                >
                    Innegociables
                </span>
                <div className="grid grid-cols-4 gap-2">
                    {arcChips.map(({ key, label, pct, value, unit, stroke, isOver, onClick }) => {
                        const Tag = onClick ? 'button' : ('div' as React.ElementType);
                        return (
                            <Tag
                                key={key}
                                onClick={onClick}
                                className={[
                                    'flex flex-col items-center gap-1 min-w-0',
                                    onClick ? 'cursor-pointer active:opacity-60 transition-opacity duration-150 select-none' : '',
                                ].join(' ')}
                            >
                                <MacroArcGauge
                                    pct={pct}
                                    value={value}
                                    unit={unit}
                                    isOver={isOver}
                                    strokeClass={stroke}
                                    textClass="text-zinc-100"
                                    size={58}
                                    strokeWidth={4}
                                />
                                <span
                                    className="text-[8px] font-black uppercase text-zinc-400 leading-none"
                                    style={{ letterSpacing: 'var(--letter-spacing-caps)' }}
                                >
                                    {label}
                                </span>
                            </Tag>
                        );
                    })}
                </div>
            </div>

            {/* ── EXPLORAR + NUTRICIÓN ─────────────────────────────────── */}
            <div
                className="grid grid-cols-2 gap-4 animate-fade-in-up"
                style={{ animationDelay: '120ms' }}
            >
                {/* Explorar */}
                <section className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-[2rem] p-4 flex flex-col gap-2">
                    <span
                        className="text-[9px] font-black uppercase text-zinc-500 mb-1 block"
                        style={{ letterSpacing: 'var(--letter-spacing-caps)' }}
                    >
                        Explorar
                    </span>
                    {([
                        { icon: CardioIcon,   label: 'Carrera',    type: 'run'     as const },
                        { icon: MountainIcon, label: 'Senderismo', type: 'hike'    as const },
                        { icon: FireIcon,     label: 'Rucking',    type: 'rucking' as const },
                    ] as const).map(({ icon: Icon, label, type }) => (
                        <button
                            key={type}
                            onClick={() => hoy.openActivityLog(type)}
                            className="flex items-center gap-2 px-3 py-2.5 rounded-[1.5rem] border border-zinc-800/50 bg-zinc-800/30 active:bg-zinc-800/40 cursor-pointer select-none group transition-all duration-200"
                        >
                            <div className="w-7 h-7 flex items-center justify-center rounded-full bg-zinc-800 flex-shrink-0 group-hover:bg-emerald-400/10 transition-colors">
                                <Icon className="w-3.5 h-3.5 text-zinc-400 group-hover:text-emerald-400 transition-colors" />
                            </div>
                            <span
                                className="text-[9px] font-black uppercase text-zinc-400 group-hover:text-zinc-100 transition-colors flex-grow"
                                style={{ letterSpacing: 'var(--letter-spacing-caps)' }}
                            >
                                {label}
                            </span>
                        </button>
                    ))}
                </section>

                {/* Nutrición */}
                <section className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-[2rem] p-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <span
                            className="text-[9px] font-black uppercase text-zinc-500"
                            style={{ letterSpacing: 'var(--letter-spacing-caps)' }}
                        >
                            Nutrición
                        </span>
                        <button
                            onClick={hoy.openNutrition}
                            className="text-[9px] font-bold text-zinc-400 hover:text-emerald-400 transition-colors"
                        >
                            Ver →
                        </button>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                        <MacroArcGauge
                            pct={hoy.kcalPct}
                            value={Math.round(hoy.consumed.kcal)}
                            unit="kcal"
                            isOver={hoy.isKcalOver}
                            strokeClass="stroke-brand-accent"
                            textClass="text-zinc-100"
                            size={72}
                            strokeWidth={5}
                        />
                        <p className={`text-xs font-black leading-tight ${hoy.isKcalOver ? 'text-danger' : 'text-zinc-100'}`}>
                            {hoy.isKcalOver ? 'Excedido' : `${Math.round(hoy.kcalRemaining)} rest.`}
                        </p>
                        <p
                            className="text-[8px] font-mono font-bold text-zinc-500 uppercase"
                            style={{ letterSpacing: 'var(--letter-spacing-caps)' }}
                        >
                            / {hoy.dailyGoals.kcal} kcal
                        </p>
                    </div>

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
                                    textClass="text-zinc-100"
                                    size={44}
                                    strokeWidth={3}
                                />
                                <span
                                    className="text-[7px] font-black uppercase text-zinc-500"
                                    style={{ letterSpacing: 'var(--letter-spacing-caps)' }}
                                >
                                    {label}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

        </div>
    );
};

export default HoyScreen;
