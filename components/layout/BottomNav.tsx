import React from 'react';
import { HomeIcon, BookOpenIcon, PlateIcon, ChartBarIcon, PlaygroundIcon } from '../icons';
import { Screen } from '../../types';
import { vibrate } from '../../utils/helpers';

interface BottomNavProps {
  activeScreen: Screen;
  visible: boolean;
  onNavigate: (screen: Screen) => void;
}

const navItems: Array<{ screen: Screen; label: string; icon: React.FC<{ className?: string }> }> = [
  { screen: 'Hoy', label: 'Hoy', icon: HomeIcon },
  { screen: 'Nutrición', label: 'Nutrición', icon: PlateIcon },
  { screen: 'Biblioteca', label: 'Biblioteca', icon: BookOpenIcon },
  { screen: 'Progreso', label: 'Progreso', icon: ChartBarIcon },
  { screen: 'Playground', label: 'UI Kit', icon: PlaygroundIcon },
];

const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, visible, onNavigate }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[120] px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <nav className="mx-auto flex max-w-xl items-stretch gap-2 rounded-[1.5rem] border border-surface-border/80 bg-surface-bg/90 p-2 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-2xl">
        {navItems.map(({ screen, label, icon: Icon }) => {
          const isActive = activeScreen === screen;

          return (
            <button
              key={screen}
              type="button"
              onClick={() => {
                vibrate(8);
                onNavigate(screen);
              }}
              aria-label={`Ir a ${label}`}
              aria-current={isActive ? 'page' : undefined}
              className={[
                'group flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-3 py-2.5 text-center transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base',
                isActive
                  ? 'bg-brand-accent text-brand-accent-foreground shadow-md shadow-brand-accent/10'
                  : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary',
              ].join(' ')}
            >
              <Icon
                className={[
                  'h-5 w-5 transition-transform duration-200',
                  isActive ? 'scale-110' : 'group-hover:scale-105',
                ].join(' ')}
              />
              <span className="text-[8px] font-black uppercase tracking-[0.16em]">
                {label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default BottomNav;

