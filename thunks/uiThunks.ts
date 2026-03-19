import { ThunkAction } from '../types';
import * as actions from '../actions';

let toastTimer: number | null = null;

export const showToastThunk = (message: string): ThunkAction<void> => (dispatch) => {
    // If a toast is already scheduled to be cleared, clear that timer
    if (toastTimer) {
        clearTimeout(toastTimer);
    }

    // Show the new toast
    dispatch(actions.showToast(message));

    // Set a new timer to clear it
    toastTimer = window.setTimeout(() => {
        dispatch(actions.clearToast());
        toastTimer = null; // Reset timer ID
    }, 3000); // 3 seconds duration
};
