import React from 'react';
import { motion, type Variants } from 'framer-motion';
import type { RoutineTask, RoutineTaskType } from '../types';

// ── Headless Controllers ─────────────────────────────────────────────────────
import { useTodayDashboardController } from '../hooks/useTodayDashboardController';
import { useHabitTrackerController } from '../hooks/useHabitTrackerController';
import { useFreeActivityController } from '../hooks/useFreeActivityController';
import { useFlexibleMacros } from '../components/ui-premium/useFlexibleMacros';

// ── UI Kit Premium (SSOT) ────────────────────────────────────────────────────
import {
    SquishyCard,
    NonNegotiableCard,
    PremiumButton,
    EyebrowText,
    StatLabel,
    BodyText,
    MutedText,
} from '../components/ui-premium';

// ── Icons ────────────────────────────────────────────────────────────────────
import {
    CardioIcon,
    MountainIcon,
    StrengthIcon,
    YogaIcon,
    MeditationIcon,
    PostureIcon,
    ChevronRightIcon,
    CheckCircleIcon,
    FireIcon,
} from '../components/icons';

// ── Existing overlays ────────────────────────────────────────────────────────
import RuckingSession from './rutina-activa/RuckingSession';
import CardioLibreLogModal from '../components/dialogs/CardioLibreLogModal';

// ═══════════════════════════════════════════════════════════════════════════════
//  FRAMER MOTION — Stagger Cascade + Squishy
// ═══════════════════════════════════════════════════════════════════════════════

const containerVariants: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.08, // Staggered entry pour for Bento blocks
            delayChildren: 0.05,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: 'spring',
            stiffness: 280,
            damping: 26,
            mass: 0.8,
        },
    },
};

const squishyTap = { scale: 0.98 };

// ═══════════════════════════════════════════════════════════════════════════════
//  HELPERS & SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

const TaskIcon: React.FC<{ type: RoutineTaskType; className?: string }> = ({ type, className }) => {
    switch (type) {
        case 'strength':   return <StrengthIcon className={className} />;
        case 'yoga':       return <YogaIcon className={className} />;
        case 'meditation': return <MeditationIcon className={className} />;
        case 'cardio':     return <CardioIcon className={className} />;
        case 'posture':    return <PostureIcon className={className} />;
        default:           return <StrengthIcon className={className} />;
    }
};

const getTaskDetails = (task: RoutineTask, cardioWeek: number): string => {
    if (task.type === 'strength') return `${task.flow.length} ejercicios`;
    if (task.type === 'cardio') return `CACO · Semana ${cardioWeek}`;
    return `${task.flow.length} pasos`;
};

const ACTIVITY_OPTIONS = [
    { icon: CardioIcon,   label: 'Carrera',    type: 'run'     as const },
    { icon: MountainIcon, label: 'Senderismo', type: 'hike'    as const },
    { icon: FireIcon,     label: 'Rucking',    type: 'rucking' as const },
] as const;

// Internal Menu component as requested
const MenuDeActividades: React.FC<{
    onOpen: (type: 'run' | 'hike' | 'rucking') => void
}> = ({ onOpen }) => (
    <SquishyCard padding="sm">
        <EyebrowText className="block mb-4">Actividad Libre</EyebrowText>
        <div className="grid grid-cols-3 gap-4 md:gap-6">
            {ACTIVITY_OPTIONS.map(({ icon: Icon, label, type }) => (
                <motion.button
                    key={type}
                    whileTap={squishyTap}
                    onClick={() => onOpen(type)}
                    className="flex flex-col items-center gap-3 px-3 py-6 rounded-2xl border border-zinc-800/50 bg-zinc-800/30 hover:border-emerald-400/30 hover:bg-zinc-800/40 transition-all duration-200 cursor-pointer select-none group"
                >
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-zinc-800 group-hover:bg-emerald-400/10 transition-colors">
                        <Icon className="w-6 h-6 text-zinc-400 group-hover:text-emerald-400 transition-colors" />
                    </div>
                    <StatLabel className="group-hover:!text-zinc-100 transition-colors uppercase tracking-widest text-xs">
                        {label}
                    </StatLabel>
                </motion.button>
            ))}
        </div>
    </SquishyCard>
);

// ═══════════════════════════════════════════════════════════════════════════════
//  DASHBOARD SCREEN (Deep Redesign)
// ═══════════════════════════════════════════════════════════════════════════════

const DashboardScreen: React.FC = () => {
    const dashboard = useTodayDashboardController();
    const habits = useHabitTrackerController();
    const activity = useFreeActivityController();
    
    // Nutrition computations
    const macros = useFlexibleMacros(dashboard.nutritionTarget, dashboard.nutritionConsumed);

    const macroBars = [
        { label: 'PRO', progress: macros.proteinProgress, colorClass: 'bg-emerald-400' },
        { label: 'CH',  progress: macros.carbProgress,    colorClass: 'bg-amber-400' },
        { label: 'GRA', progress: macros.fatProgress,     colorClass: 'bg-rose-400' }
    ];

    // Overlay handle
    if (activity.isRuckingActive) {
        return (
            <RuckingSession
                onFinish={activity.finishRucking}
                onCancel={() => activity.setIsRuckingActive(false)}
            />
        );
    }

    // ── BLANK CANVAS REDESIGN ──────────────────────────────────────────────────
    return (
        <main className="min-h-screen bg-zinc-950 p-4 md:p-6 max-w-7xl mx-auto flex flex-col gap-6">
            
            {activity.isLoggingActivity && (
                <CardioLibreLogModal
                    activityType={activity.isLoggingActivity}
                    onSave={
                        activity.isLoggingActivity === 'run'  ? activity.handleSaveRun :
                        activity.isLoggingActivity === 'hike' ? activity.handleSaveHike :
                        activity.handleSaveRucking
                    }
                    onClose={activity.closeActivityLog}
                />
            )}

            {/* Bento Grid */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6"
            >
                {/* ── ENTRENAMIENTO (Span 8) ── */}
                <div className="md:col-span-8 flex flex-col">
                    <motion.div variants={itemVariants} className="h-full">
                        <SquishyCard className="h-full flex flex-col relative overflow-hidden group">
                            {/* Ambient Light */}
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent opacity-50 pointer-events-none" />
                            
                            <div className="relative z-10 flex items-center justify-between mb-8">
                                <EyebrowText>Misión de Hoy</EyebrowText>
                                <button
                                    onClick={dashboard.openPlanner}
                                    className="text-zinc-500 hover:text-emerald-400 transition-colors uppercase font-bold tracking-widest text-[10px]"
                                >
                                    GESTIONAR →
                                </button>
                            </div>

                            <div className="relative z-10 flex-grow flex flex-col justify-center">
                                {dashboard.primaryTask ? (
                                    <>
                                        {/* Task Badge */}
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="bg-zinc-800/80 backdrop-blur-md border border-zinc-700/50 rounded-full px-3 py-1 font-bold text-[10px] text-zinc-300 uppercase tracking-widest">
                                                {dashboard.primaryTask.timeOfDay}
                                            </span>
                                            {dashboard.isTaskDone(dashboard.primaryTask) ? (
                                                <CheckCircleIcon className="w-5 h-5 text-emerald-400" />
                                            ) : (
                                                <TaskIcon type={dashboard.primaryTask.type} className="w-5 h-5 text-emerald-400" />
                                            )}
                                        </div>

                                        {/* Task Title */}
                                        <h1 className={[
                                            "font-heading font-black text-5xl md:text-6xl tracking-tight leading-none mb-3",
                                            dashboard.isTaskDone(dashboard.primaryTask) 
                                                ? "text-zinc-600 line-through" 
                                                : "text-white"
                                        ].join(" ")}>
                                            {dashboard.primaryTask.name}
                                        </h1>
                                        
                                        <BodyText className="!text-zinc-400 mb-8">
                                            {getTaskDetails(dashboard.primaryTask, dashboard.cardioWeek)}
                                        </BodyText>

                                        {/* CTA */}
                                        <div className="mt-auto">
                                            <motion.div whileTap={!dashboard.isTaskDone(dashboard.primaryTask) ? squishyTap : undefined}>
                                                <PremiumButton
                                                    onClick={() => dashboard.onSelectRoutine(dashboard.primaryTask!)}
                                                    variant={dashboard.isTaskDone(dashboard.primaryTask) ? "ghost" : "primary"}
                                                    disabled={dashboard.isTaskDone(dashboard.primaryTask)}
                                                    className="w-full md:w-auto"
                                                >
                                                    {dashboard.isTaskDone(dashboard.primaryTask) ? 'Completado' : 'EMPEZAR RUTINA'}
                                                </PremiumButton>
                                            </motion.div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-10 opacity-70">
                                        <BodyText>No hay rutinas agendadas para hoy.</BodyText>
                                    </div>
                                )}
                            </div>
                        </SquishyCard>
                    </motion.div>
                </div>

                {/* ── NUTRICIÓN E INNEGOCIABLES (Span 4) ── */}
                <div className="md:col-span-4 flex flex-col gap-4 md:gap-6">
                    
                    {/* Mini Resumen Nutricional */}
                    <motion.div variants={itemVariants} whileTap={squishyTap}>
                        <SquishyCard interactive onClick={dashboard.openNutrition} className="flex flex-col gap-4 cursor-pointer relative overflow-hidden group">
                            
                            <div className="flex items-center justify-between">
                                <EyebrowText>NUTRICIÓN</EyebrowText>
                                <ChevronRightIcon className="w-4 h-4 text-zinc-600 group-hover:text-zinc-300 transition-colors" />
                            </div>

                            <div className="py-2">
                                <StatLabel className="!text-3xl !font-black !text-white flex items-baseline gap-1">
                                    {Math.round(macros.kcalRemaining)} 
                                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Kcal Rest.</span>
                                </StatLabel>
                            </div>

                            <div className="flex flex-col gap-3 mt-2">
                                {macroBars.map((macro) => (
                                    <div key={macro.label} className="flex items-center gap-3">
                                        <span className="text-[10px] font-black uppercase text-zinc-500 w-8">{macro.label}</span>
                                        <div className="h-1.5 flex-1 bg-zinc-800 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full ${macro.colorClass} transition-all duration-700 ease-out`}
                                                style={{ width: `${Math.min(macro.progress * 100, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </SquishyCard>
                    </motion.div>

                    {/* Innegociables */}
                    <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 md:gap-6">
                        {habits.nonNegotiables.slice(0,2).map(metric => (
                            <motion.div key={metric.id} whileTap={squishyTap}>
                                <NonNegotiableCard
                                    metric={metric}
                                    onValueChange={habits.onValueChange}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                    <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 md:gap-6">
                        {habits.nonNegotiables.slice(2,4).map(metric => (
                            <motion.div key={metric.id} whileTap={squishyTap}>
                                <NonNegotiableCard
                                    metric={metric}
                                    onValueChange={habits.onValueChange}
                                />
                            </motion.div>
                        ))}
                    </motion.div>

                </div>

                {/* ── ACTIVIDAD LIBRE (Span 12) ── */}
                <div className="md:col-span-12 mt-2 md:mt-4">
                    <motion.div variants={itemVariants}>
                        <MenuDeActividades onOpen={activity.openActivityLog} />
                    </motion.div>
                </div>

            </motion.div>
        </main>
    );
};

export default DashboardScreen;
