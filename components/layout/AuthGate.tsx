import React from 'react';
import LoginView from '../../screens/auth/LoginView';
import AppLoadingScreen from './AppLoadingScreen';

interface AuthGateProps {
  isReady: boolean;
  isAuthenticated: boolean;
}

const AuthGate: React.FC<AuthGateProps> = ({ isReady, isAuthenticated }) => {
  if (!isReady) {
    return (
      <AppLoadingScreen
        label="Conectando con Supabase"
        description="Sincronizando estado inicial"
      />
    );
  }

  if (!isAuthenticated) {
    return <LoginView />;
  }

  return null;
};

export default AuthGate;
