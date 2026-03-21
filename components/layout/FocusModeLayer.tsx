import React, { Suspense, lazy } from 'react';
import type { AppState } from '../../types';
import AppChunkFallback from '../AppChunkFallback';

const ProgressiveCardioLogModal = lazy(() => import('../dialogs/ProgressiveCardioLogModal'));
const WorkoutSummaryScreen = lazy(() =>
  import('../../screens/WorkoutSummary').then((mod) => ({ default: mod.WorkoutSummaryScreen }))
);
const RutinaActivaScreen = lazy(() => import('../../screens/rutina-activa/RutinaActivaScreen'));
const PerfilScreen = lazy(() => import('../../screens/PerfilScreen'));

interface FocusModeLayerProps {
  activeRoutine: AppState['session']['activeRoutine'];
  workoutSummaryData: AppState['session']['workoutSummaryData'];
  cardioLogData: AppState['session']['cardioLogData'];
  isProfileOpen: boolean;
  onExitSummary: () => void;
  onCloseProfile: () => void;
  onSaveCardioLog: (distance: number, notes: string) => void;
  onSkipCardioLog: () => void;
}

const FocusModeLayer: React.FC<FocusModeLayerProps> = ({
  activeRoutine,
  workoutSummaryData,
  cardioLogData,
  isProfileOpen,
  onExitSummary,
  onCloseProfile,
  onSaveCardioLog,
  onSkipCardioLog,
}) => {
  return (
    <div className="fixed inset-0 z-[220] bg-bg-base">
      <Suspense fallback={<AppChunkFallback />}>
        <div className="relative h-full w-full">
          {activeRoutine && <RutinaActivaScreen activeRoutine={activeRoutine} />}
          {workoutSummaryData && (
            <WorkoutSummaryScreen
              historicalEntry={workoutSummaryData.historicalEntry}
              onExit={onExitSummary}
            />
          )}
          {cardioLogData && (
            <ProgressiveCardioLogModal
              onSave={onSaveCardioLog}
              onClose={onSkipCardioLog}
            />
          )}
          {isProfileOpen && <PerfilScreen onClose={onCloseProfile} />}
        </div>
      </Suspense>
    </div>
  );
};

export default FocusModeLayer;
