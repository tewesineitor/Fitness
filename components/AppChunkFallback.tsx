import React from 'react';
import AppLoadingScreen from './layout/AppLoadingScreen';

const AppChunkFallback: React.FC = () => {
  return (
    <AppLoadingScreen
      label="Cargando vista"
      description="Preparando contenido"
    />
  );
};

export default AppChunkFallback;
