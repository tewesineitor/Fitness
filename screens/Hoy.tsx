
import React, { useContext, useEffect, useState, useMemo } from 'react';
import { AppContext } from '../contexts';
import { RoutineTask, TimeOfDay, DesgloseCardioLibre, RoutineTaskType, DayOfWeek } from '../types';
import * as actions from '../actions';
import * as thunks from '../thunks';
import { 
    CalendarIcon, 
    CardioIcon, 
    MountainIcon, 
    StrengthIcon, 
    YogaIcon, 
    MeditationIcon,
    PostureIcon,
    ChevronRightIcon,
    UserCircleIcon
} from '../components/icons';
import { 
    selectUserName, 
    selectDailyGoals,
    selectCustomMantra
} from '../selectors/profileSelectors';
import { 
    selectUserRoutines, 
    selectWeeklySchedule, 
    selectCardioWeek 
} from '../selectors/workoutSelectors';
import { selectConsumedMacros } from '../selectors/nutritionSelectors';
import { selectSessionState } from '../selectors/sessionSelectors';
import { selectProgressState } from '../selectors/progressSelectors';
import { ProgressRings } from '../components/ProgressRings';
import WeeklyGlanceWidget from '../components/hoy/WeeklyGlanceWidget';
import DailyNonNegotiablesWidget from '../components/hoy/DailyNonNegotiablesWidget';
import RuckingSession from './rutina-activa/RuckingSession';
import CardioLibreLogModal from '../components/dialogs/CardioLibreLogModal';
import Button from '../components/Button';
import { vibrate } from '../utils/helpers';
import { FireIcon } from '../components/icons';

const TaskIcon: React.FC<{ type: RoutineTaskType; className?: string }> = ({ type, className }) => {
    switch (type) {
        case 'strength': return <StrengthIcon className={className} />;
        case 'yoga': return <YogaIcon className={className} />;
        case 'meditation': return <MeditationIcon className={className} />;
        case 'cardio': return <CardioIcon className={className} />;
        case 'posture': return <PostureIcon className={className} />;
        default: return <StrengthIcon className={className} />;
    }
}

const getTaskDetails = (task: RoutineTask, cardioWeek: number): string => {
    if (task.type === 'strength') return `${task.flow.length} Ejercicios`;
    if (task.type === 'cardio') return `Semana ${cardioWeek} - CACO`;
    return `${task.flow.length} Pasos`;
};

// Updated Header to support Actions - Clean Utility
const SectionHeader: React.FC<{ title: string; colorClass?: string; action?: { label: string, onClick: () => void } }> = ({ title, colorClass = "bg-brand-accent", action }) => (
    <div className="flex items-center justify-between mb-4 pl-1 pr-1">
        <h2 className="text-sm font-bold text-text-secondary uppercase tracking-widest flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${colorClass}`}></div>
            {title}
        </h2>
        {action && (
            <Button 
                variant="tertiary"
                size="small"
                onClick={action.onClick}
                className="!text-[10px] !px-3 !py-1.5 !rounded-lg !bg-surface-hover/50 hover:!bg-surface-hover border border-transparent hover:!border-surface-border"
                icon={CalendarIcon}
            >
                {action.label}
            </Button>
        )}
    </div>
);

const HoyScreen: React.FC = () => {
  const { state, dispatch } = useContext(AppContext)!;
  
  const userName = selectUserName(state);
  const userRoutines = selectUserRoutines(state);
  const weeklySchedule = selectWeeklySchedule(state);
  const dailyGoals = selectDailyGoals(state);
  const consumed = selectConsumedMacros(state);
  const session = selectSessionState(state);
  const cardioWeek = selectCardioWeek(state);
  const customMantra = selectCustomMantra(state);
  const progress = selectProgressState(state);

  const [isLoggingActivity, setIsLoggingActivity] = useState<'run' | 'hike' | 'rucking' | null>(null);
  const [isRuckingActive, setIsRuckingActive] = useState(false);
  
  const onSelectRoutine = (routine: RoutineTask) => { 
      const uniqueTaskId = `${routine.id}-${routine.timeOfDay}`;
      if (session.activeRoutineInfo?.id === uniqueTaskId && session.activeRoutineProgress?.isStarted) {
          // Resume existing routine
          vibrate(10);
          dispatch(actions.setActiveScreen('RutinaActiva'));
      } else {
          // Start new routine
          vibrate(10); 
          dispatch(actions.startRoutine(routine)); 
      }
  };

  const handleSaveRun = (log: DesgloseCardioLibre) => {
    dispatch(thunks.saveCardioLibreLogThunk(log));
    setIsLoggingActivity(null);
  };

  const handleSaveHike = (log: DesgloseCardioLibre) => {
    dispatch(thunks.saveSenderismoLogThunk(log));
    setIsLoggingActivity(null);
  };

  const handleSaveRucking = (log: DesgloseCardioLibre) => {
    dispatch(thunks.saveRuckingLogThunk(log));
    setIsLoggingActivity(null);
  };

  const todaysDate = new Date();
  const dateString = todaysDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  const capitalizedDate = dateString.charAt(0).toUpperCase() + dateString.slice(1);

  const allRoutines = useMemo(() => [...userRoutines], [userRoutines]); 

  // ... existing tasksToDisplay calculation ...
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

    return scheduledTasks.sort((a,b) => {
        const order: Record<TimeOfDay, number> = { 'Mañana': 1, 'Mediodía': 2, 'Noche': 3 };
        return order[a.timeOfDay] - order[b.timeOfDay];
    });
  }, [weeklySchedule, allRoutines]);

  if (isRuckingActive) {
      return (
          <RuckingSession 
              onFinish={(data) => {
                  dispatch(actions.updateDailyHabit({ ruckingSessionMet: true }));
                  setIsRuckingActive(false);
              }} 
              onCancel={() => setIsRuckingActive(false)} 
          />
      );
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
      {isLoggingActivity && (
        <CardioLibreLogModal 
            activityType={isLoggingActivity}
            onSave={isLoggingActivity === 'run' ? handleSaveRun : isLoggingActivity === 'hike' ? handleSaveHike : handleSaveRucking} 
            onClose={() => setIsLoggingActivity(null)} 
        />
      )}

      {/* --- HEADER: Clean & Bold --- */}
      <header className="flex justify-between items-end animate-fade-in-up pt-6">
          <div className="text-left">
              <h1 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight uppercase leading-none mb-1">
                  {capitalizedDate}
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-text-secondary flex items-center gap-2 mt-1">
                  <span className="w-1.5 h-1.5 bg-brand-accent rounded-full"></span>
                  {customMantra ? customMantra : `Hola, ${userName}`}
              </p>
          </div>
          <div className="flex items-center gap-3">
              <button onClick={() => dispatch(actions.openProfile())} className="relative group active:scale-95 transition-transform">
                  <div className="bg-surface-bg border border-surface-border p-2.5 rounded-full group-hover:bg-surface-hover transition-colors shadow-sm">
                    <UserCircleIcon className="w-6 h-6 text-text-secondary group-hover:text-text-primary" />
                  </div>
              </button>
          </div>
      </header>
      
      {/* --- WEEKLY WIDGET --- */}
      <div className="animate-fade-in-up">
          <WeeklyGlanceWidget progress={progress} weeklySchedule={weeklySchedule} />
      </div>
      
      {/* --- DAILY NON-NEGOTIABLES --- */}
      <div className="animate-fade-in-up">
          <DailyNonNegotiablesWidget />
      </div>

      {/* --- BENTO GRID 2.0 --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-up">
          
          {/* Main Block: TODAY'S MISSION */}
          <section className="col-span-1 md:col-span-2 bg-surface-bg p-5 rounded-2xl border border-surface-border shadow-sm flex flex-col gap-4">
              <SectionHeader 
                title="Hoy" 
                colorClass="bg-brand-accent"
                action={{
                    label: 'Gestionar',
                    onClick: () => {
                        dispatch(actions.setNavigationTarget('library-planner'));
                        dispatch(actions.setActiveScreen('Biblioteca'));
                    }
                }}
              />
              
              {tasksToDisplay.length > 0 ? (
                    <div className="flex flex-col gap-3">
                        {tasksToDisplay.map((task) => {
                            const uniqueTaskId = `${task.id}-${task.timeOfDay}`; 
                            const isCompleted = session.dailyProgress.completedTasks.includes(uniqueTaskId);
                            const progress = (session.activeRoutineInfo?.id === uniqueTaskId) ? session.activeRoutineInfo.progress : (isCompleted ? 1 : 0);
                            const details = getTaskDetails(task, cardioWeek);
                            
                            return (
                                <button 
                                    key={uniqueTaskId} 
                                    onClick={() => onSelectRoutine(task)} 
                                    disabled={isCompleted} 
                                    className={`relative w-full text-left overflow-hidden transition-all duration-200 group rounded-xl border active:scale-[0.98] ${
                                        isCompleted 
                                            ? 'bg-surface-bg/50 border-surface-border opacity-60 grayscale' 
                                            : 'bg-surface-bg border-surface-border hover:border-brand-accent/50 shadow-sm hover:shadow-md'
                                    }`}
                                >
                                    <div className="p-4 flex items-center gap-4 relative z-10">
                                        {/* Icon Box */}
                                        <div className={`w-10 h-10 flex items-center justify-center flex-shrink-0 rounded-xl transition-all ${
                                            isCompleted 
                                                ? 'bg-surface-hover text-text-secondary grayscale' 
                                                : 'bg-surface-hover text-text-secondary group-hover:bg-brand-accent group-hover:text-bg-base'
                                        }`}>
                                            <TaskIcon type={task.type} className="w-5 h-5" />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-grow min-w-0">
                                            <div className="flex flex-col">
                                                <h3 className={`font-bold text-sm text-text-primary uppercase tracking-wide truncate ${isCompleted ? 'line-through text-text-secondary opacity-70' : ''}`}>
                                                    {task.name}
                                                </h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="px-2 py-0.5 rounded-md bg-surface-hover text-[9px] font-bold text-text-secondary uppercase tracking-wider">{task.timeOfDay}</span>
                                                    <span className="text-[10px] text-text-secondary font-medium">
                                                        {details}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Arrow */}
                                        <div className="flex-shrink-0">
                                            {!isCompleted && (
                                                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-surface-hover text-text-secondary group-hover:text-brand-accent transition-all duration-200">
                                                    <ChevronRightIcon className="w-4 h-4" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Clean Progress Bar */}
                                    {!isCompleted && progress > 0 && (
                                        <div className="absolute bottom-0 left-0 h-[2px] bg-brand-accent" style={{ width: `${progress * 100}%` }}></div>
                                    )}
                                </button>
                            )
                        })}
                    </div>
                ) : (
                    <div className="bg-surface-hover/50 p-6 border border-dashed border-surface-border text-center flex flex-col items-center rounded-xl">
                        <p className="text-text-primary font-bold uppercase tracking-widest text-xs">Descanso Programado</p>
                        <p className="text-[10px] text-text-secondary mt-1 max-w-[200px]">La recuperación es parte esencial del crecimiento.</p>
                    </div>
                )}
          </section>

          {/* Block 2: NUTRITION */}
          <section className="bg-surface-bg p-5 rounded-2xl border border-surface-border shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold text-text-secondary uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-fat"></div>
                      Nutrición
                  </h2>
                  <Button 
                      variant="tertiary" 
                      size="small" 
                      onClick={() => dispatch(actions.setActiveScreen('Nutrición'))} 
                      className="!text-[10px] !px-2 !py-1 !rounded-lg !bg-surface-hover/50 hover:!bg-surface-hover flex items-center gap-1.5"
                  >
                      Ver <ChevronRightIcon className="w-3 h-3" />
                  </Button>
              </div>
              <div className="flex justify-center w-full flex-grow items-center">
                  <ProgressRings consumed={consumed} goals={dailyGoals} />
              </div>
          </section>

          {/* Block 3: FREE ACTIVITY */}
          <section className="bg-surface-bg p-5 rounded-2xl border border-surface-border shadow-sm flex flex-col gap-4">
              <h2 className="text-xs font-bold text-text-secondary uppercase tracking-widest flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-carbs"></div>
                  Explorar
              </h2>
              
              <div className="grid grid-cols-3 gap-3 flex-grow">
                  <button 
                      onClick={() => { vibrate(5); setIsLoggingActivity('run'); }} 
                      className="bg-surface-hover/50 p-4 flex flex-col items-center justify-center gap-2 hover:bg-surface-hover transition-all rounded-xl group border border-surface-border hover:border-brand-accent/50 shadow-sm active:scale-95"
                  >
                      <div className="p-2 bg-surface-hover rounded-full text-text-secondary group-hover:text-brand-accent transition-colors">
                          <CardioIcon className="w-5 h-5" />
                      </div>
                      <span className="block font-bold text-text-primary uppercase tracking-wide text-[10px] group-hover:text-brand-accent transition-colors">Carrera</span>
                  </button>

                  <button 
                      onClick={() => { vibrate(5); setIsLoggingActivity('hike'); }} 
                      className="bg-surface-hover/50 p-4 flex flex-col items-center justify-center gap-2 hover:bg-surface-hover transition-all rounded-xl group border border-surface-border hover:border-brand-fat/50 shadow-sm active:scale-95"
                  >
                      <div className="p-2 bg-surface-hover rounded-full text-text-secondary group-hover:text-brand-fat transition-colors">
                          <MountainIcon className="w-5 h-5" />
                      </div>
                      <span className="block font-bold text-text-primary uppercase tracking-wide text-[10px] group-hover:text-brand-fat transition-colors">Senderismo</span>
                  </button>

                  <button 
                      onClick={() => { vibrate(5); setIsLoggingActivity('rucking'); }} 
                      className="bg-surface-hover/50 p-4 flex flex-col items-center justify-center gap-2 hover:bg-surface-hover transition-all rounded-xl group border border-surface-border hover:border-brand-protein/50 shadow-sm active:scale-95"
                  >
                      <div className="p-2 bg-surface-hover rounded-full text-text-secondary group-hover:text-brand-protein transition-colors">
                          <FireIcon className="w-5 h-5" />
                      </div>
                      <span className="block font-bold text-text-primary uppercase tracking-wide text-[10px] group-hover:text-brand-protein transition-colors">Rucking</span>
                  </button>
              </div>
          </section>
      </div>

    </div>
  );
}

export default HoyScreen;
