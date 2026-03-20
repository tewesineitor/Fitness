import React from 'react';

interface FloatingDockProps {
    children: React.ReactNode;
    className?: string;
}

const FloatingDock: React.FC<FloatingDockProps> = ({ children, className = '' }) => {
    return (
        <div className={`fixed bottom-24 left-4 right-4 sm:left-6 sm:right-6 z-[60] bg-surface-bg/90 backdrop-blur-xl border border-surface-border rounded-2xl shadow-2xl p-4 animate-slide-up-fade-in ${className}`}>
            {children}
        </div>
    );
};

export default FloatingDock;
