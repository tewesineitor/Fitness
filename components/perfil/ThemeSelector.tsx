import React from 'react';
import { Theme } from '../../types';
import { SunIcon, MoonIcon, MonitorIcon } from '../icons';
import SectionHeader from '../SectionHeader';

export const ThemeTile: React.FC<{
    theme: Theme;
    currentTheme: Theme;
    onSelect: (t: Theme) => void;
    icon: React.FC<{ className?: string }>;
    label: string;
}> = ({ theme, currentTheme, onSelect, icon: Icon, label }) => {
    const isActive = currentTheme === theme;
    return (
        <button
            onClick={() => onSelect(theme)}
            className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl border transition-all duration-300 relative overflow-hidden group ${
                isActive 
                    ? 'bg-brand-accent/10 border-brand-accent/50 text-brand-accent shadow-[0_0_15px_rgba(var(--color-brand-accent-rgb),0.15)]' 
                    : 'bg-surface-bg border-surface-border text-text-secondary hover:bg-surface-hover hover:text-text-primary'
            }`}
        >
            <Icon className={`w-5 h-5 mb-1.5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
            <span className="text-[9px] font-bold uppercase tracking-widest">{label}</span>
            {isActive && <div className="absolute top-1.5 right-1.5 w-1 h-1 bg-brand-accent rounded-full shadow-[0_0_5px_currentColor]"></div>}
        </button>
    );
};

export const ThemeSelector: React.FC<{ theme: Theme; updateTheme: (t: Theme) => void }> = ({ theme, updateTheme }) => {
    return (
        <section>
            <SectionHeader title="Interfaz Visual" dotClass="bg-text-primary" />
            <div className="bg-surface-bg p-4 rounded-2xl border border-surface-border shadow-sm">
                <div className="grid grid-cols-3 gap-3">
                    <ThemeTile theme="light" currentTheme={theme} onSelect={updateTheme} icon={SunIcon} label="Claro" />
                    <ThemeTile theme="dark" currentTheme={theme} onSelect={updateTheme} icon={MoonIcon} label="Oscuro" />
                    <ThemeTile theme="system" currentTheme={theme} onSelect={updateTheme} icon={MonitorIcon} label="Auto" />
                </div>
            </div>
        </section>
    );
};
