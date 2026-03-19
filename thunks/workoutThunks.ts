import { ThunkAction, Exercise } from '../types';
import { generateExerciseImage as generateExerciseImageService } from '../services/aiService';
import * as actions from '../actions';
import * as thunks from '../thunks';
import { selectExerciseImages } from '../selectors/workoutSelectors';

export const generateExerciseImageThunk = (exercise: Exercise): ThunkAction<Promise<void>> => async (dispatch, getState) => {
    const state = getState();
    const exerciseImages = selectExerciseImages(state);

    if (exerciseImages[exercise.id] && exerciseImages[exercise.id] !== 'failed') {
        return;
    }
    
    dispatch(actions.generateExerciseImageStart(exercise.id));
    const result = await generateExerciseImageService(exercise);

    // FIX: Correctly narrow the discriminated union type by checking `!result.success`.
    // This allows safe access to `result.error` in the failure case and `result.data` in the success case.
    // FIX: Changed to an explicit check to resolve type narrowing issue.
    if (result.success === false) {
        // Show the specific error to the user and mark the generation as failed
        dispatch(thunks.showToastThunk(result.error));
        dispatch(actions.generateExerciseImageFailure(exercise.id));
    } else {
        dispatch(actions.generateExerciseImageSuccess({ exerciseId: exercise.id, imageUrl: result.data }));
    }
};
