import React from 'react';

interface ImmersiveFocusShellProps {
  children: React.ReactNode;
  bottomBar?: React.ReactNode;
  /** Permite esconder el gradiente superior si alguna pantalla no lo necesita */
  hideTopGradient?: boolean;
  /** Clases adicionales para el div de contenido scrolleable principal */
  contentClassName?: string;
}

const ImmersiveFocusShell: React.FC<ImmersiveFocusShellProps> = ({
  children,
  bottomBar,
  hideTopGradient = false,
  contentClassName = 'pb-36 pt-8',
}) => {
  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-bg-base">
      {!hideTopGradient ? (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-brand-accent/10 to-transparent" />
      ) : null}

      <div className={`flex-1 overflow-y-auto px-6 hide-scrollbar ${contentClassName}`}>
        {children}
      </div>

      {bottomBar ? (
        <div className="absolute bottom-0 left-0 right-0 border-t border-surface-border bg-bg-base px-6 pb-safe pt-5 shadow-[0_-8px_24px_-8px_rgba(0,0,0,0.08)]">
          {bottomBar}
        </div>
      ) : null}
    </div>
  );
};

export default ImmersiveFocusShell;
