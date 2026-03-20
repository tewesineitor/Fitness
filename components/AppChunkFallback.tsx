import React from 'react';

const AppChunkFallback: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center bg-bg-base/95 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-surface-border bg-surface-bg px-6 py-5 shadow-2xl">
        <div className="w-12 h-12 border-4 border-surface-border border-t-brand-accent rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">
          Cargando vista...
        </p>
      </div>
    </div>
  );
};

export default AppChunkFallback;
