import React, { ReactNode } from 'react';
import type { Screen, SyncStatus } from '../../types';
import type { Theme } from '../../types/profile';
import BottomNav from './BottomNav';
import GlobalOverlays from './GlobalOverlays';
import PageContainer from './PageContainer';
import ThemeSync from './ThemeSync';

interface AppShellProps {
  children: ReactNode;
  theme: Theme;
  activeScreen: Screen;
  isBottomNavVisible: boolean;
  syncStatus: SyncStatus;
  toastMessage: string | null;
  showPhaseChangeModal: boolean;
  onNavigate: (screen: Screen) => void;
  onDismissPhaseChangeModal: () => void;
}

const AppShell: React.FC<AppShellProps> = ({
  children,
  theme,
  activeScreen,
  isBottomNavVisible,
  syncStatus,
  toastMessage,
  showPhaseChangeModal,
  onNavigate,
  onDismissPhaseChangeModal,
}) => {
  return (
    <>
      <ThemeSync theme={theme} />
      <div className="relative flex min-h-screen flex-col overflow-hidden bg-bg-base text-text-primary antialiased">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_42%)] opacity-80"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(var(--color-brand-accent-rgb),0.08),transparent_30%)] opacity-90"
        />

        <main className="relative flex-1 overflow-y-auto hide-scrollbar">
          <PageContainer
            className={[
              'relative min-h-full',
              isBottomNavVisible ? 'pb-32' : 'pb-8',
            ].join(' ')}
          >
            {children}
          </PageContainer>
        </main>

        <BottomNav
          activeScreen={activeScreen}
          visible={isBottomNavVisible}
          onNavigate={onNavigate}
        />

        <GlobalOverlays
          syncStatus={syncStatus}
          toastMessage={toastMessage}
          showPhaseChangeModal={showPhaseChangeModal}
          onDismissPhaseChangeModal={onDismissPhaseChangeModal}
        />
      </div>
    </>
  );
};

export default AppShell;
