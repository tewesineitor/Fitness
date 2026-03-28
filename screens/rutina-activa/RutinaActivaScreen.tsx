import React from 'react';
import type { RoutineTask } from '../../types';
import { useActiveRoutineState } from './hooks/useActiveRoutineState';

import Modal from '../../components/Modal';
import ConfirmationDialog from '../../components/dialogs/ConfirmationDialog';
import AddExerciseModal from './AddExerciseModal';
import ExerciseDetailSheet from './ExerciseDetailSheet';
import SetSelectorModal from '../../components/dialogs/SetSelectorModal';
import RoutineExitDialog from './flow/RoutineExitDialog';
import RoutineLaunchScreen from './flow/RoutineLaunchScreen';
import RoutineSessionHeader from './flow/RoutineSessionHeader';
import RoutineStepRenderer from './flow/RoutineStepRenderer';

interface RutinaActivaScreenProps {
  activeRoutine: RoutineTask;
}

const RutinaActivaScreen: React.FC<RutinaActivaScreenProps> = ({ activeRoutine }) => {
  const s = useActiveRoutineState(activeRoutine);

  return (
    <div className="fixed inset-0 z-50 flex h-[100dvh] flex-col overflow-y-auto bg-zinc-950 font-sans text-text-primary">

      {/* ── Overlays / modals ──────────────────────────────────────────────── */}
      {s.showConfirmExit ? (
        <Modal onClose={() => s.setShowConfirmExit(false)}>
          <RoutineExitDialog
            completedExercises={s.workoutStats.exercisesCompleted}
            elapsedSeconds={s.globalTime}
            onConfirmFinish={s.onFinishWorkout}
            onDiscard={s.onBack}
            onCancel={() => s.setShowConfirmExit(false)}
          />
        </Modal>
      ) : null}

      {s.showConfirmSkip ? (
        <ConfirmationDialog
          title="Saltar paso"
          message="No se guardara el progreso de este ejercicio."
          onConfirm={s.onSkipStep}
          onCancel={() => s.setShowConfirmSkip(false)}
          confirmText="Saltar"
        />
      ) : null}

      {s.showAddExerciseModal ? (
        <AddExerciseModal
          onSelect={s.onSelectExerciseToAdd}
          onClose={() => s.setShowAddExerciseModal(false)}
        />
      ) : null}

      {s.exerciseToAdd ? (
        <SetSelectorModal
          onSelect={s.onSetSelection}
          onClose={() => s.setExerciseToAdd(null)}
        />
      ) : null}

      {s.exerciseToShowDetails ? (
        <ExerciseDetailSheet
          exercise={s.exerciseToShowDetails}
          onClose={() => s.setExerciseToShowDetails(null)}
        />
      ) : null}

      {/* ── Session header (visible only during active workout) ────────────── */}
      {s.isStarted && !s.isMainWorkoutFinished ? (
        <RoutineSessionHeader
          globalTime={s.globalTime}
          isResting={s.isResting}
          onSkip={s.onRequestSkip}
          onClose={s.onRequestExit}
        />
      ) : null}

      {/* ── Main content area ──────────────────────────────────────────────── */}
      <main className="relative z-20 w-full flex-grow flex-col">

        {!s.isStarted ? (
          <RoutineLaunchScreen
            activeRoutine={activeRoutine}
            allExercises={s.allExercises}
            onStart={s.onStart}
            onBack={s.onBack}
          />
        ) : (
          <div className="relative z-10 flex flex-col">
            <RoutineStepRenderer
              activeRoutine={activeRoutine}
              allExercises={s.allExercises}
              cardioWeek={s.cardioWeek}
              currentFlow={s.currentFlow}
              currentStep={s.currentStep}
              currentStepIndex={s.currentStepIndex}
              isMainWorkoutFinished={s.isMainWorkoutFinished}
              isResting={s.isResting}
              advanceAfterRest={s.advanceAfterRest}
              nextStep={s.nextStep}
              restDuration={s.restDuration}
              maxRestDuration={s.maxRestDuration}
              loggedSetsForCurrentStep={s.loggedSetsForCurrentStep}
              workoutStats={s.workoutStats}
              onAddExercise={() => s.setShowAddExerciseModal(true)}
              onFinishWorkout={s.onFinishWorkout}
              onHandleRestComplete={s.onRestComplete}
              onHandleSetComplete={s.onSetComplete}
              onHandleSkipStep={s.onSkipStep}
              onHandleStepComplete={s.onAdvanceStep}
              onHandleProceedToCooldown={s.onProceedToCooldown}
              onShowExerciseDetails={s.onShowExerciseDetails}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default RutinaActivaScreen;
