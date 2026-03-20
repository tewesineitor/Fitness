import React, { ReactNode } from 'react';
import Button from './Button';

interface SectionHeaderAction {
  label: string;
  icon?: React.FC<{ className?: string }>;
  onClick: () => void;
}

interface SectionHeaderProps {
  title: string;
  /** Color of the leading status dot. Defaults to brand-accent. */
  dotClass?: string;
  action?: SectionHeaderAction;
  className?: string;
}

/**
 * SectionHeader — Obsidian Protocol v2.0
 *
 * THE canonical section header. Single source of truth.
 * Replaces the two duplicate implementations in Hoy.tsx and Biblioteca.tsx.
 *
 * Anatomy:
 *   ◉ SECTION TITLE                   [Action Button?]
 *
 * Usage:
 *   <SectionHeader title="MISIÓN DE HOY" action={{ label: 'Gestionar', onClick: ... }} />
 */
const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  dotClass = 'bg-brand-accent',
  action,
  className = '',
}) => (
  <div className={`flex items-center justify-between mb-3 px-0.5 ${className}`}>
    <h2 className="flex items-center gap-2 text-[11px] font-bold text-text-secondary uppercase tracking-[0.15em]">
      <span
        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotClass}`}
        aria-hidden="true"
      />
      {title}
    </h2>

    {action && (
      <Button
        variant="ghost"
        size="small"
        onClick={action.onClick}
        icon={action.icon}
        iconPosition="left"
        className="!text-[10px] !h-7 !px-2.5 !tracking-wider"
      >
        {action.label}
      </Button>
    )}
  </div>
);

export default SectionHeader;
