import React from 'react';
import Button from '../Button';
import Toast from '../feedback/Toast';
import Modal from '../Modal';
import type { SyncStatus } from '../../types';

interface GlobalOverlaysProps {
  syncStatus: SyncStatus;
  toastMessage: string | null;
  showPhaseChangeModal: boolean;
  onDismissPhaseChangeModal: () => void;
}

const SyncIndicator: React.FC<{ status: SyncStatus }> = ({ status }) => {
  if (status === 'synced') return null;

  const message =
    status === 'syncing'
      ? 'Sincronizando'
      : status === 'offline'
        ? 'Sin conexion'
        : 'Error de red';

  const dotClass =
    status === 'syncing'
      ? 'bg-brand-accent animate-pulse'
      : status === 'offline'
        ? 'bg-amber-400'
        : 'bg-red-500';

  return (
    <div className="fixed bottom-[5.5rem] left-4 z-[250] flex items-center gap-2 rounded-full border border-surface-border/70 bg-surface-bg/90 px-3 py-1.5 shadow-lg backdrop-blur-xl">
      <span className={['h-1.5 w-1.5 rounded-full', dotClass].join(' ')} />
      <span className="text-[9px] font-black uppercase tracking-[0.18em] text-text-secondary">
        {message}
      </span>
    </div>
  );
};

const PhaseChangeModal: React.FC<{ onDismiss: () => void }> = ({ onDismiss }) => (
  <Modal onClose={onDismiss} className="max-w-sm">
    <div className="p-8 text-center" role="document" aria-labelledby="phase-title">
      <h2 id="phase-title" className="text-2xl font-bold text-text-primary">
        Nueva Fase Desbloqueada: Intensificacion
      </h2>
      <p className="my-4 text-text-secondary">
        Has completado las primeras 4 semanas de acumulacion. Excelente trabajo.
        A partir de hoy, tus rutinas de fuerza se ajustaran para enfocarse en la ganancia
        de fuerza, con menos repeticiones y mas descanso. Preparate para un nuevo desafio.
      </p>
      <Button onClick={onDismiss} className="mt-8 w-full" size="large">
        Entendido, vamos por ello
      </Button>
    </div>
  </Modal>
);

const GlobalOverlays: React.FC<GlobalOverlaysProps> = ({
  syncStatus,
  toastMessage,
  showPhaseChangeModal,
  onDismissPhaseChangeModal,
}) => {
  return (
    <>
      <SyncIndicator status={syncStatus} />
      {toastMessage ? (
        <div className="fixed left-1/2 top-5 z-[250] -translate-x-1/2 animate-toast-in">
          <Toast tone="success" message={toastMessage} />
        </div>
      ) : null}
      {showPhaseChangeModal ? <PhaseChangeModal onDismiss={onDismissPhaseChangeModal} /> : null}
    </>
  );
};

export default GlobalOverlays;
