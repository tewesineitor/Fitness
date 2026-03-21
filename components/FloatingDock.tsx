import React from 'react';

interface FloatingDockProps {
    children: React.ReactNode;
    className?: string;
}

const FloatingDock: React.FC<FloatingDockProps> = ({ children, className = '' }) => {
    return (
        <div className={[
          'fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-[60] w-[calc(100%-1rem)] max-w-[42rem] -translate-x-1/2',
          'rounded-[1.5rem] border border-surface-border bg-surface-bg/92 p-4 shadow-lg backdrop-blur-2xl',
          'animate-sheet-in',
          className,
        ].join(' ')}>
            {children}
        </div>
    );
};

export default FloatingDock;
