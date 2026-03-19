import React from 'react';
import { AppState, Action, ThunkAction, ThunkDispatch } from './types';

export type AppContextType = {
  state: AppState;
  dispatch: ThunkDispatch;
  showToast: (message: string) => void;
  unlockAchievement: (achievementId: string) => void;
};

export const AppContext = React.createContext<AppContextType | null>(null);