import React from 'react';
import SegmentedControl from './layout/SegmentedControl';

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
 *  - Active: bg-brand-accent text-brand-accent-foreground pill, animated slide
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
    <SegmentedControl items={tabs} value={activeTab} onChange={onChange} className={className} />
  );
}

export default PillTabs;
