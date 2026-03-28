import React, { Suspense, lazy, useContext } from 'react';
import { Screen } from './types';
import { AppContext } from './contexts';
import { AppProvider } from './AppProvider';
import * as actions from './actions';
import * as thunks from './thunks';
import AppChunkFallback from './components/AppChunkFallback';
import AppShell from './components/layout/AppShell';
import FocusModeLayer from './components/layout/FocusModeLayer';

import {
    selectActiveScreen,
    selectIsBottomNavVisible,
    selectIsProfileOpen,
    selectToastMessage,
    selectShowPhaseChangeModal,
    selectSyncStatus,
} from './selectors/uiSelectors';
import {
    selectActiveRoutine,
    selectWorkoutSummaryData,
    selectCardioLogData,
} from './selectors/sessionSelectors';

const HoyScreen = lazy(() => import('./screens/Hoy'));
const BibliotecaScreen = lazy(() => import('./screens/Biblioteca'));
const NutricionScreen = lazy(() => import('./screens/Nutricion'));
const ProgresoScreen = lazy(() => import('./screens/Progreso'));
const OnboardingScreen = lazy(() => import('./screens/OnboardingScreen'));
const DesignSystemDevScreen = lazy(() => import('./screens/DesignSystemDevScreen'));

const renderScreenById = (screen: Screen) => {
  switch (screen) {
    case 'Nutrición':
      return <NutricionScreen />;
    case 'Biblioteca':
      return <BibliotecaScreen />;
    case 'Progreso':
      return <ProgresoScreen />;
    case 'Playground':
      return <DesignSystemDevScreen />;
    case 'Hoy':
    default:
      return <HoyScreen />;
  }
};

const App: React.FC = () => {
  const { state, dispatch } = useContext(AppContext)!;

  const activeScreen = selectActiveScreen(state);
  const isBottomNavVisible = selectIsBottomNavVisible(state);
  const isProfileOpen = selectIsProfileOpen(state);
  const toastMessage = selectToastMessage(state);
  const showPhaseChangeModal = selectShowPhaseChangeModal(state);
  const activeRoutine = selectActiveRoutine(state);
  const workoutSummaryData = selectWorkoutSummaryData(state);
  const cardioLogData = selectCardioLogData(state);
  const syncStatus = selectSyncStatus(state);

  const isFocusMode = Boolean(activeRoutine || workoutSummaryData || isProfileOpen || cardioLogData);

  const handleNavigate = (screen: Screen) => {
    dispatch(actions.setActiveScreen(screen));
  };

  const handleExitSummary = () => {
    dispatch(actions.closeSummary());
    dispatch(actions.setActiveScreen('Hoy'));
  };

  const mainContent = state.profile.userName === '' ? (
    <Suspense fallback={<AppChunkFallback />}>
      <OnboardingScreen />
    </Suspense>
  ) : isFocusMode ? (
    <FocusModeLayer
      activeRoutine={activeRoutine}
      workoutSummaryData={workoutSummaryData}
      cardioLogData={cardioLogData}
      isProfileOpen={isProfileOpen}
      onExitSummary={handleExitSummary}
      onCloseProfile={() => dispatch(actions.closeProfile())}
      onSaveCardioLog={(distance, notes) => dispatch(thunks.saveCardioLogThunk(distance, notes))}
      onSkipCardioLog={() => dispatch(thunks.skipCardioLogThunk())}
    />
  ) : (
    <Suspense fallback={<AppChunkFallback />}>
      {renderScreenById(activeScreen)}
    </Suspense>
  );

  return (
    <AppShell
      theme={state.profile.theme}
      activeScreen={activeScreen}
      isBottomNavVisible={state.profile.userName !== '' && isBottomNavVisible && !isFocusMode}
      syncStatus={syncStatus}
      toastMessage={toastMessage}
      showPhaseChangeModal={showPhaseChangeModal}
      onNavigate={handleNavigate}
      onDismissPhaseChangeModal={() => dispatch(actions.dismissPhaseChangeModal())}
    >
      {mainContent}
    </AppShell>
  );
};

const AppWithProvider: React.FC = () => (
  <AppProvider>
    <App />
  </AppProvider>
);

export default AppWithProvider;
