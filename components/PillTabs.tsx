import React, { ReactNode } from 'react';

interface Tab<T extends string> {
  id: T;
  label: string;
  icon?: React.FC<{ className?: string }>;
  badge?: number | string;
}

interface PillTabsProps<T extends string> {
  tabs: Tab<T>[];
  activeTab: T;
  onChange: (id: T) => void;
  className?: string;
}

/**
 * PillTabs — Obsidian Protocol v2.0
 *
 * Compact inline pill-style tabs. Replace card-style ModernTab in Biblioteca.
 *
 * Visual spec:
 *  - Height: 36px total (h-9)
 *  - Active: bg-brand-accent text-white pill, animated slide
 *  - Inactive: ghost text-secondary, hover lightens
 *  - Container: bg-surface-hover/40 bordered pill, p-1
 *
 * Usage:
 *  <PillTabs
 *    tabs={[
 *      { id: 'routines', label: 'Rutinas', icon: CalendarIcon },
 *      { id: 'recipes',  label: 'Recetas', icon: PlateIcon },
 *    ]}
 *    activeTab={activeTab}
 *    onChange={setActiveTab}
 *  />
 */
function PillTabs<T extends string>({
  tabs,
  activeTab,
  onChange,
  className = '',
}: PillTabsProps<T>) {
  return (
    <div
      className={`flex items-center gap-1 p-1 rounded-xl bg-surface-hover/40 border border-surface-border/60 w-full ${className}`}
      role="tablist"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={[
              'relative flex-1 flex items-center justify-center gap-1.5 h-8 px-2',
              'text-[11px] font-bold uppercase tracking-wider rounded-lg',
              'transition-all duration-200 select-none',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/50',
              'active:scale-[0.96]',
              isActive
                ? 'bg-brand-accent text-white shadow-sm shadow-brand-accent/20'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover',
            ].join(' ')}
          >
            {Icon && (
              <Icon
                className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-white' : 'text-text-muted'}`}
              />
            )}
            <span className="truncate">{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={[
                  'flex-shrink-0 min-w-[18px] h-[18px] px-1 rounded-full text-[9px] font-black flex items-center justify-center',
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-surface-border text-text-secondary',
                ].join(' ')}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default PillTabs;
