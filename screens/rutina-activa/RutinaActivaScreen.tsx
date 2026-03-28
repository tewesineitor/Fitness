import React from 'react';
import type { RoutineTask } from '../../types';
import { useActiveRoutineState } from './hooks/useActiveRoutineState';

import ImmersiveBackground from '../../components/ImmersiveBackground';
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
    <div className="fixed inset-0 z-50 flex h-[100dvh] flex-col overflow-hidden bg-bg-base font-sans text-text-primary">
      {/* ── Immersive background layer ─────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <ImmersiveBackground exercise={s.bgExercise} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(var(--color-brand-accent-rgb),0.16),transparent_42%),linear-gradient(180deg,rgba(8,10,16,0.18),rgba(8,10,16,0.72))]" />
        <div className="absolute inset-0 bg-bg-base/86 backdrop-blur-[12px]" />
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-40 bg-gradient-to-b from-black/35 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-48 bg-gradient-to-t from-bg-base via-bg-base/92 to-transparent" />

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
          onSkip={() => s.setShowConfirmSkip(true)}
          onExit={() => s.setShowConfirmExit(true)}
        />
      ) : null}

      {/* ── Main content area ──────────────────────────────────────────────── */}
      <main className="relative z-20 mx-auto flex h-full w-full max-w-4xl flex-grow flex-col overflow-hidden">

        {!s.isStarted ? (
          <RoutineLaunchScreen
            activeRoutine={activeRoutine}
            allExercises={s.allExercises}
            onStart={s.onStart}
            onBack={s.onBack}
          />
        ) : (
          <div className="relative z-10 flex h-full flex-col overflow-hidden">
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
