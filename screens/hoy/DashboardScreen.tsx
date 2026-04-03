import React, { useMemo } from 'react';
import { motion, type Variants } from 'framer-motion';
import type { RoutineTask, RoutineTaskType } from '../../types';

// ── Headless Controllers ─────────────────────────────────────────────────────
import { useTodayDashboardController } from './hooks/useTodayDashboardController';
import { useHabitTrackerController }   from './hooks/useHabitTrackerController';
import { useFreeActivityController }   from './hooks/useFreeActivityController';
import { useFlexibleMacros }           from '../../components/ui-premium/useFlexibleMacros';

// ── UI Kit Premium — SSOT (UI_MANIFEST.md) ──────────────────────────────────
import {
    SquishyCard,
    WeeklyStreakTracker,
    NonNegotiableCard,
    PremiumButton,
    EyebrowText,
    StatLabel,
    BodyText,
    MutedText,
    ActivityBentoMenu,
    NutritionMacroBar,
} from '../../components/ui-premium';

// ── Icons ─────────────────────────────────────────────────────────────────────
import {
    StrengthIcon,
    YogaIcon,
    MeditationIcon,
    CardioIcon,
    PostureIcon,
    ChevronRightIcon,
    CheckCircleIcon,
} from '../../components/icons';

// ── Overlays (preservados) ────────────────────────────────────────────────────
import RuckingSession      from '../rutina-activa/RuckingSession';
import CardioLibreLogModal from '../../components/dialogs/CardioLibreLogModal';

// ═══════════════════════════════════════════════════════════════════════════════
//  FRAMER MOTION — Stagger cascade · Spring Squishy
// ═══════════════════════════════════════════════════════════════════════════════

const containerVariants: Variants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.07, delayChildren: 0.04 },
    },
};

const itemVariants: Variants = {
    hidden:   { opacity: 0, y: 20 },
    visible:  {
        opacity: 1, y: 0,
        transition: { type: 'spring', stiffness: 300, damping: 28, mass: 0.75 },
    },
};

const TAP = { scale: 0.98 };

// ═══════════════════════════════════════════════════════════════════════════════
//  PURE VISUAL HELPERS (sin lógica de negocio)
// ═══════════════════════════════════════════════════════════════════════════════

const TaskIcon: React.FC<{ type: RoutineTaskType; className?: string }> = ({ type, className }) => {
    switch (type) {
        case 'strength':   return <StrengthIcon   className={className} />;
        case 'yoga':       return <YogaIcon        className={className} />;
        case 'meditation': return <MeditationIcon  className={className} />;
        case 'cardio':     return <CardioIcon      className={className} />;
        case 'posture':    return <PostureIcon     className={className} />;
        default:           return <StrengthIcon   className={className} />;
    }
};

const taskSubline = (task: RoutineTask, cardioWeek: number): string => {
    if (task.type === 'strength') return `${task.flow.length} ejercicios`;
    if (task.type === 'cardio')   return `CACO · Semana ${cardioWeek}`;
    return `${task.flow.length} pasos`;
};

// ═══════════════════════════════════════════════════════════════════════════════
//  DASHBOARD SCREEN — Bento Grid 12 columnas
//  Contenedor raíz: TRANSPARENTE — el fondo premium lo gobierna AppShell.tsx
// ═══════════════════════════════════════════════════════════════════════════════

const DashboardScreen: React.FC = () => {
    // ── Controladores Headless ────────────────────────────────────────────────
    const dashboard = useTodayDashboardController();
    const habits    = useHabitTrackerController();
    const activity  = useFreeActivityController();

    // ── Cálculo nutricional (LOGIC_MANIFEST §useFlexibleMacros) ──────────────
    const macros = useFlexibleMacros(
        dashboard.nutritionTarget,
        dashboard.nutritionConsumed,
    );

    // ── Overlay full-screen: Rucking activo ───────────────────────────────────
    if (activity.isRuckingActive) {
        return (
            <RuckingSession
                onFinish={activity.finishRucking}
                onCancel={() => activity.setIsRuckingActive(false)}
            />
        );
    }

    // ── Header — fecha de hoy + saludo ──────────────────────────────────────
    const today = useMemo(() => {
        const d = new Date();
        return d.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });
    }, []);

    return (
        // ⚠️ SIN bg-* opaco — AppShell.tsx es el único dueño del fondo
        <main className="min-h-screen p-4 md:p-6 flex flex-col gap-6 max-w-5xl mx-auto">

            {/* ── Modal Actividad Libre ────────────────────────────────────── */}
            {activity.isLoggingActivity && (
                <CardioLibreLogModal
                    activityType={activity.isLoggingActivity}
                    onSave={
                        activity.isLoggingActivity === 'run'  ? activity.handleSaveRun  :
                        activity.isLoggingActivity === 'hike' ? activity.handleSaveHike :
                        activity.handleSaveRucking
                    }
                    onClose={activity.closeActivityLog}
                />
            )}

            {/* ── HEADER — respiro superior: fecha + saludo ────────────────── */}
            <header className="flex flex-col gap-1 mb-2">
                <span className="font-mono text-[11px] uppercase tracking-widest text-zinc-500 select-none">
                    {today}
                </span>
                <h2 className="text-2xl font-semibold text-zinc-100 leading-tight">
                    Hola, Fer 👋
                </h2>
            </header>

            {/* ── CALENDARIO SEMANAL — full width, antes del grid ─────────── */}
            <WeeklyStreakTracker
                days={habits.weeklyDays}
                className="w-full"
            />

            {/* ── BENTO GRID ASIMÉTRICO ────────────────────────────────────── */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
            >

                {/* ── COLUMNA IZQUIERDA (Span 7) ─────────────────────────── */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                    <motion.div variants={itemVariants} className="h-auto">
                        <SquishyCard className="h-auto flex flex-col relative overflow-hidden">

                            {/* Ambient glow — token emerald, sin color hardcodeado */}
                            <div
                                aria-hidden
                                className="absolute inset-0 pointer-events-none"
                                style={{
                                    background: 'radial-gradient(ellipse 120% 80% at 8% 10%, rgba(52,211,153,0.06) 0%, transparent 60%)',
                                }}
                            />

                            {/* Header */}
                            <div className="relative z-10 flex items-center justify-between mb-8">
                                <EyebrowText>Misión de Hoy</EyebrowText>
                                <button
                                    onClick={dashboard.openPlanner}
                                    className="text-zinc-500 hover:text-emerald-400 transition-colors font-black uppercase tracking-widest text-[10px]"
                                >
                                    GESTIONAR →
                                </button>
                            </div>

                            {/* Content — datos del controlador, cero hardcoding */}
                            <div className="relative z-10 flex-grow flex flex-col justify-center">
                                {dashboard.primaryTask ? (
                                    <TrainingBlock
                                        task={dashboard.primaryTask}
                                        isDone={dashboard.isTaskDone(dashboard.primaryTask)}
                                        progress={dashboard.getTaskProgress(dashboard.primaryTask)}
                                        cardioWeek={dashboard.cardioWeek}
                                        secondaryTasks={dashboard.secondaryTasks}
                                        onStart={() => dashboard.onSelectRoutine(dashboard.primaryTask!)}
                                        onSelectSecondary={dashboard.onSelectRoutine}
                                        isTaskDone={dashboard.isTaskDone}
                                        getTaskUniqueId={dashboard.getTaskUniqueId}
                                    />
                                ) : (
                                    <RestDay onActivityLog={activity.openActivityLog} />
                                )}
                            </div>
                        </SquishyCard>
                    </motion.div>

                    {/* ── ACTIVITY BENTO MENU ──────────────────────────────── */}
                    <motion.div variants={itemVariants}>
                        <ActivityBentoMenu onOpen={activity.openActivityLog} />
                    </motion.div>
                </div>

                {/* ── COLUMNA DERECHA: Nutrición + Innegociables (Span 5) ── */}
                <div className="lg:col-span-5 flex flex-col gap-6">

                    {/* Mini Widget Nutricional */}
                    <motion.div variants={itemVariants} whileTap={TAP}>
                        <SquishyCard
                            interactive
                            onClick={dashboard.openNutrition}
                            className="flex flex-col gap-4 cursor-pointer group"
                            padding="sm"
                        >
                            <div className="flex items-center justify-between">
                                <EyebrowText>NUTRICIÓN</EyebrowText>
                                <ChevronRightIcon className="w-4 h-4 text-zinc-600 group-hover:text-zinc-300 transition-colors" />
                            </div>

                            {/* Kcal restantes — del hook, no hardcodeado */}
                            <div className="flex items-baseline gap-1.5">
                                <span className={[
                                    'font-heading font-black text-3xl tabular-nums leading-none',
                                    macros.isKcalOver ? 'text-rose-400' : 'text-white',
                                ].join(' ')}>
                                    {Math.round(macros.kcalRemaining)}
                                </span>
                                <StatLabel>Kcal Rest.</StatLabel>
                            </div>

                            {/* Macro bars — componente SSOT con dialecto canónico */}
                            <NutritionMacroBar
                                proteinProgress={macros.proteinProgress}
                                carbProgress={macros.carbProgress}
                                fatProgress={macros.fatProgress}
                                isCarbOverMax={macros.isCarbOverMax}
                                isFatOverMax={macros.isFatOverMax}
                                consumed={dashboard.nutritionConsumed}
                                target={dashboard.nutritionTarget}
                            />
                        </SquishyCard>
                    </motion.div>

                    {/* Innegociables — 2×2 grid — desde useHabitTrackerController */}
                    <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 md:gap-4">
                        {habits.nonNegotiables.map(metric => (
                            <motion.div key={metric.id} whileTap={TAP}>
                                <NonNegotiableCard
                                    metric={metric}
                                    onValueChange={habits.onValueChange}
                                />
                            </motion.div>
                        ))}
                    </motion.div>

                </div>

            </motion.div>
        </main>
    );
};

// ═══════════════════════════════════════════════════════════════════════════════
//  SUB-COMPONENTS — JSX principal declarativo y limpio
// ═══════════════════════════════════════════════════════════════════════════════

interface TrainingBlockProps {
    task: RoutineTask;
    isDone: boolean;
    progress: number;
    cardioWeek: number;
    secondaryTasks: RoutineTask[];
    onStart: () => void;
    onSelectSecondary: (t: RoutineTask) => void;
    isTaskDone: (t: RoutineTask) => boolean;
    getTaskUniqueId: (t: RoutineTask) => string;
}

const TrainingBlock: React.FC<TrainingBlockProps> = ({
    task, isDone, progress, cardioWeek,
    secondaryTasks, onStart, onSelectSecondary,
    isTaskDone, getTaskUniqueId,
}) => (
    <div className="flex flex-col gap-5">
        {/* Time-of-day badge + type icon */}
        <div className="flex items-center gap-2">
            <span className="bg-zinc-800/80 backdrop-blur-md border border-zinc-700/50 rounded-full px-3 py-1 font-black uppercase tracking-widest text-[10px] text-zinc-300">
                {task.timeOfDay}
            </span>
            {isDone
                ? <CheckCircleIcon className="w-5 h-5 text-emerald-400" />
                : <TaskIcon type={task.type} className="w-5 h-5 text-emerald-400" />
            }
        </div>

        {/* Task name — tipografía heading, sin clase ad-hoc */}
        <h1 className={[
            'font-heading font-black tracking-tight leading-none',
            'text-3xl md:text-4xl lg:text-5xl',
            isDone ? 'text-zinc-600 line-through' : 'text-white',
        ].join(' ')}>
            {task.name}
        </h1>

        <BodyText className="!text-zinc-400">
            {taskSubline(task, cardioWeek)}
        </BodyText>

        {/* Progress micro-line (visible solo si hay progreso parcial) */}
        {!isDone && progress > 0 && (
            <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div
                    className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${progress * 100}%` }}
                />
            </div>
        )}

        {/* CTA principal */}
        <motion.div whileTap={isDone ? undefined : TAP}>
            <PremiumButton
                onClick={onStart}
                variant={isDone ? 'ghost' : 'primary'}
                size="sm"
                disabled={isDone}
            >
                {isDone ? 'Completado' : 'EMPEZAR RUTINA'}
            </PremiumButton>
        </motion.div>

        {/* Tareas secundarias */}
        {secondaryTasks.length > 0 && (
            <div className="flex flex-col gap-2 pt-4 border-t border-zinc-800/50">
                {secondaryTasks.map(sec => {
                    const uid   = getTaskUniqueId(sec);
                    const sDone = isTaskDone(sec);
                    return (
                        <motion.button
                            key={uid}
                            whileTap={sDone ? undefined : TAP}
                            onClick={() => onSelectSecondary(sec)}
                            disabled={sDone}
                            className={[
                                'flex items-center gap-3 text-left rounded-2xl px-4 py-3',
                                'border border-zinc-800/50 transition-all duration-200',
                                sDone
                                    ? 'opacity-40 cursor-default bg-zinc-900/30'
                                    : 'bg-zinc-800/30 hover:border-emerald-400/30 cursor-pointer group',
                            ].join(' ')}
                        >
                            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-800 shrink-0">
                                {sDone
                                    ? <CheckCircleIcon className="w-4 h-4 text-emerald-400" />
                                    : <TaskIcon type={sec.type} className="w-4 h-4 text-zinc-400 group-hover:text-emerald-400 transition-colors" />
                                }
                            </div>
                            <div className="min-w-0 flex-grow">
                                <p className={`text-sm font-bold truncate ${sDone ? 'line-through text-zinc-600' : 'text-zinc-100'}`}>
                                    {sec.name}
                                </p>
                                <MutedText>{sec.timeOfDay}</MutedText>
                            </div>
                            {!sDone && (
                                <ChevronRightIcon className="w-4 h-4 text-zinc-500 shrink-0 group-hover:text-emerald-400 transition-colors" />
                            )}
                        </motion.button>
                    );
                })}
            </div>
        )}
    </div>
);

const RestDay: React.FC<{ onActivityLog: (t: 'run' | 'hike' | 'rucking') => void }> = ({ onActivityLog }) => (
    <div className="flex flex-col items-center gap-4 py-10 opacity-80">
        <svg className="w-10 h-10 text-zinc-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
        </svg>
        <BodyText className="text-center">Hoy toca descanso activo.</BodyText>
        <motion.div whileTap={TAP}>
            <PremiumButton onClick={() => onActivityLog('run')} variant="ghost" size="sm">
                Registrar actividad libre
            </PremiumButton>
        </motion.div>
    </div>
);

export default DashboardScreen;

