import React from 'react';

interface AppLoadingScreenProps {
  label: string;
  description?: string;
}

const AppLoadingScreen: React.FC<AppLoadingScreenProps> = ({ label, description }) => {
  return (
    <div className="fixed inset-0 z-[260] flex items-center justify-center bg-bg-base">
      <div className="flex flex-col items-center gap-4 rounded-[1.75rem] border border-surface-border bg-surface-bg px-6 py-5 shadow-2xl">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-surface-border border-t-brand-accent" />
        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-text-secondary">
            {label}
          </p>
          {description && (
            <p className="mt-1 text-[11px] text-text-muted">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppLoadingScreen;
