import React, { ReactNode, HTMLAttributes } from 'react';

interface BentoGridProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /**
   * cols: number of columns on the base (mobile) breakpoint.
   * Default: 2. On md+ it will be controlled by children span classes.
   */
  cols?: 1 | 2 | 3;
  /** Gap size. Default: 3 (12px) per the design system spec. */
  gap?: 3 | 4 | 5 | 6;
  className?: string;
}

/**
 * BentoGrid — Obsidian Protocol v2.0
 *
 * Standardized grid wrapper for bento-style layouts.
 *
 * Rules (from MASTER_REDESIGN_PLAN):
 *  - Gap: always gap-3 (12px)
 *  - Max columns on mobile: 2
 *  - Max columns on desktop: 3 (never more)
 *  - Children use bento-full / bento-half / bento-third span helpers
 *
 * Usage:
 *  <BentoGrid>
 *    <div className="bento-full"> ...full-width hero </div>
 *    <div className="bento-half"> ...half           </div>
 *    <div className="bento-half"> ...half           </div>
 *  </BentoGrid>
 */
const colMap: Record<1 | 2 | 3, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
};

const gapMap: Record<number, string> = {
  3: 'gap-3',
  4: 'gap-4',
  5: 'gap-5',
  6: 'gap-6',
};

const BentoGrid: React.FC<BentoGridProps> = ({
  children,
  cols = 2,
  gap = 3,
  className = '',
  ...rest
}) => (
  <div
    className={`grid ${colMap[cols]} ${gapMap[gap] ?? 'gap-3'} ${className}`}
    {...rest}
  >
    {children}
  </div>
);

export default BentoGrid;

// ── Span helpers (use these on BentoGrid children) ──────────────────────────

/** Spans all columns — full-width hero block. */
export const BentoFull: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`col-span-full ${className}`}>{children}</div>
);

/** Default half-width block. */
export const BentoHalf: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`col-span-1 ${className}`}>{children}</div>
);
