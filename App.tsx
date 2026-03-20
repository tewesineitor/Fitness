
import React, { useContext, useEffect, lazy, Suspense } from 'react';
import { Screen, SyncStatus } from './types';
import { HomeIcon, BookOpenIcon, PlateIcon, ChartBarIcon, CheckCircleIcon } from './components/icons';
import { AppContext } from './contexts';
import { AppProvider } from './AppProvider';
import * as actions from './actions';
import * as thunks from './thunks';
import Button from './components/Button';
import Modal from './components/Modal';
import AppChunkFallback from './components/AppChunkFallback';
import { vibrate } from './utils/helpers';

import {
    selectActiveScreen,
    selectIsBottomNavVisible,
    selectIsProfileOpen,
    selectToastMessage,
    selectShowPhaseChangeModal,
    selectSyncStatus
} from './selectors/uiSelectors';
import {
    selectActiveRoutine,
    selectWorkoutSummaryData,
    selectCardioLogData
} from './selectors/sessionSelectors';

const HoyScreen = lazy(() => import('./screens/Hoy'));
const BibliotecaScreen = lazy(() => import('./screens/Biblioteca'));
const NutricionScreen = lazy(() => import('./screens/Nutricion'));
const ProgresoScreen = lazy(() => import('./screens/Progreso'));
const PerfilScreen = lazy(() => import('./screens/PerfilScreen'));
const RutinaActivaScreen = lazy(() => import('./screens/rutina-activa/RutinaActivaScreen'));
const OnboardingScreen = lazy(() => import('./screens/OnboardingScreen'));
const ProgressiveCardioLogModal = lazy(() => import('./components/dialogs/ProgressiveCardioLogModal'));
const WorkoutSummaryScreen = lazy(() =>
    import('./screens/WorkoutSummary').then((mod) => ({ default: mod.WorkoutSummaryScreen }))
);

const SyncIndicator = ({ status }: { status: SyncStatus }) => {
    if (status === 'synced') return null;
    
    return (
        <div className="fixed bottom-4 left-6 z-[300] flex items-center gap-2 px-2 py-1 rounded-full bg-surface-bg/40 backdrop-blur-md border border-surface-border/30 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-700">
            {status === 'syncing' && (
                <>
                    <div className="w-1 h-1 rounded-full bg-brand-accent animate-pulse" />
                    <span className="text-[7px] font-black text-text-secondary uppercase tracking-[0.15em] opacity-60">Sincronizando</span>
                </>
            )}
            {status === 'error' && (
                <>
                    <div className="w-1 h-1 rounded-full bg-red-500" />
                    <span className="text-[7px] font-black text-red-500 uppercase tracking-[0.15em] opacity-60">Error de Red</span>
                </>
            )}
        </div>
    );
};

const PhaseChangeModal: React.FC<{ onDismiss: () => void }> = ({ onDismiss }) => (
    <Modal onClose={onDismiss} className="max-w-sm">
        <div className="p-8 text-center" role="document" aria-labelledby="phase-title">
            <h2 id="phase-title" className="text-2xl font-bold text-text-primary">¡Nueva Fase Desbloqueada: Intensificación!</h2>
            <p className="text-text-secondary my-4">Has completado las primeras 4 semanas de acumulación. ¡Excelente trabajo! A partir de hoy, tus rutinas de fuerza se ajustarán para enfocarse en la ganancia de fuerza, con menos repeticiones y más descanso. Prepárate para un nuevo desafío.</p>
            <Button onClick={onDismiss} className="mt-8 w-full" size="large">
                ¡Entendido, vamos por ello!
            </Button>
        </div>
    </Modal>
);

const Toast: React.FC<{ message: string }> = ({ message }) => (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up">
        <div className="bg-surface-bg border border-surface-border flex items-center gap-3 py-3 px-6 rounded-full shadow-md">
            <CheckCircleIcon className="w-5 h-5 text-brand-accent" />
            <span className="text-text-primary font-medium text-sm">{message}</span>
        </div>
    </div>
);


const App: React.FC = () => {
  const { state, dispatch } = useContext(AppContext)!;
  const { theme } = state.profile;

  useEffect(() => {
    const root = window.document.documentElement;
    const applyTheme = () => {
      const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      root.classList.toggle('dark', isDark);
      root.classList.toggle('light', !isDark);
    };

    applyTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme();
      }
    };

    if (theme === 'system') {
      mediaQuery.addEventListener('change', handleChange);
    }

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);
  
  const activeScreen = selectActiveScreen(state);
  const isBottomNavVisible = selectIsBottomNavVisible(state);
  const isProfileOpen = selectIsProfileOpen(state);
  const toastMessage = selectToastMessage(state);
  const showPhaseChangeModal = selectShowPhaseChangeModal(state);
  const activeRoutine = selectActiveRoutine(state);
  const workoutSummaryData = selectWorkoutSummaryData(state);
  const cardioLogData = selectCardioLogData(state);
  const syncStatus = selectSyncStatus(state);

  const isFocusMode = activeRoutine || workoutSummaryData || isProfileOpen || cardioLogData;

  const renderMainContent = () => {
    // Render Onboarding if user is new
    if (state.profile.userName === '') {
        return (
            <Suspense fallback={<AppChunkFallback />}>
                <OnboardingScreen />
            </Suspense>
        );
    }

    const screens: { id: Screen; component: React.ReactNode }[] = [
        { id: 'Hoy', component: <HoyScreen /> },
        { id: 'Nutrición', component: <NutricionScreen /> },
        { id: 'Biblioteca', component: <BibliotecaScreen /> },
        { id: 'Progreso', component: <ProgresoScreen /> },
    ];

    return (
        <Suspense fallback={<AppChunkFallback />}>
            <div className="text-text-primary min-h-screen font-sans flex flex-col h-screen relative bg-transparent overflow-hidden">
                <SyncIndicator status={syncStatus} />
                <main className="flex-grow relative w-full max-w-3xl mx-auto h-full overflow-y-auto hide-scrollbar">
                    <div className={isBottomNavVisible ? 'pb-28' : 'pb-8'}>
                        {screens.find(s => s.id === activeScreen)?.component}
                    </div>
                </main>
                
                {isBottomNavVisible && (
                  <BottomDock activeScreen={activeScreen} setActiveScreen={(screen) => dispatch(actions.setActiveScreen(screen))} />
                )}
            </div>
        </Suspense>
    );
  };
  
  const renderFocusContent = () => {
    return (
        <Suspense fallback={<AppChunkFallback />}>
            <div className="fixed inset-0 z-50 animate-fade-in-up bg-bg-base overflow-hidden">
                <div className="w-full max-w-3xl mx-auto h-full relative">
                    {activeRoutine && <RutinaActivaScreen activeRoutine={activeRoutine} />}
                    {workoutSummaryData && <WorkoutSummaryScreen 
                          historicalEntry={workoutSummaryData.historicalEntry}
                          onExit={() => {
                              dispatch(actions.closeSummary());
                              dispatch(actions.setActiveScreen('Hoy'));
                          }}
                      />}
                    {cardioLogData && (
                          <ProgressiveCardioLogModal
                              onSave={(distance, notes) => dispatch(thunks.saveCardioLogThunk(distance, notes))}
                              onClose={() => dispatch(thunks.skipCardioLogThunk())}
                          />
                    )}
                    {isProfileOpen && <PerfilScreen onClose={() => dispatch(actions.closeProfile())} />}
                </div>
            </div>
        </Suspense>
    );
  };


  return (
    <>
      {isFocusMode ? renderFocusContent() : renderMainContent()}
      
      {toastMessage && <Toast message={toastMessage} />}
      {showPhaseChangeModal && <PhaseChangeModal onDismiss={() => dispatch(actions.dismissPhaseChangeModal())} />}
    </>
  );
}

const AppWithProvider: React.FC = () => (
    <AppProvider>
        <App />
    </AppProvider>
);

interface BottomNavProps {
  activeScreen: Screen;
  setActiveScreen: (screen: Screen) => void;
}

// Redesigned "Floating Dock" Navigation - True Floating
const BottomDock: React.FC<BottomNavProps> = ({ activeScreen, setActiveScreen }) => {
  const navItems: { screen: Screen; icon: React.FC<{className?:string}> }[] = [
    { screen: 'Hoy', icon: HomeIcon },
    { screen: 'Nutrición', icon: PlateIcon },
    { screen: 'Biblioteca', icon: BookOpenIcon },
    { screen: 'Progreso', icon: ChartBarIcon },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-auto">
        <nav className="flex items-center gap-2 p-2 rounded-2xl bg-surface-bg/90 backdrop-blur-xl border border-surface-border shadow-2xl shadow-black/50 ring-1 ring-white/5">
            {navItems.map(({ screen, icon: Icon }) => {
                const isActive = activeScreen === screen;
                return (
                    <button
                        type="button"
                        key={screen}
                        onClick={() => { vibrate(10); setActiveScreen(screen); }}
                        aria-label={`Ir a ${screen}`}
                        aria-current={isActive ? 'page' : undefined}
                        className={`
                            relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group active:scale-90
                            ${isActive ? 'bg-surface-hover shadow-inner text-brand-accent' : 'hover:bg-surface-hover/50 text-text-secondary'}
                        `}
                    >
                        {/* Icon */}
                        <Icon className={`w-5 h-5 transition-all duration-300 ${
                            isActive 
                                ? 'scale-110 drop-shadow-[0_0_8px_rgba(var(--color-brand-accent-rgb),0.5)]' 
                                : 'group-hover:text-text-primary'
                        }`} />
                        
                        {/* Active Indicator Dot - Floating below */}
                        {isActive && (
                            <span className="absolute -bottom-1 w-1 h-1 bg-brand-accent rounded-full animate-fade-in-up shadow-[0_0_5px_currentColor]"></span>
                        )}
                        
                    </button>
                )
            })}
        </nav>
    </div>
  );
}

export default AppWithProvider;
