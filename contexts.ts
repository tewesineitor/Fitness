import React from 'react';
import { AppState, ThunkDispatch } from './types';
import type { AppAction } from './actions';

export type AppContextType = {
  state: AppState;
  dispatch: ThunkDispatch<AppAction>;
  showToast: (message: string) => void;
};

export const AppContext = React.createContext<AppContextType | null>(null);
