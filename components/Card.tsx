import React, { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /**
   * default    — Surface card. Standard informational block.
   * elevated   — Interactive card with hover shadow lift.
   * inset      — Subtle recessed well. For empty states / secondary areas.
   * accent     — Highlighted card with brand accent border and tint.
   * glass      — Frosted glass effect with backdrop-blur.
   */
  variant?: 'default' | 'elevated' | 'inset' | 'accent' | 'glass';
  as?: React.ElementType;
  className?: string;
}

/**
 * Card — Obsidian Protocol v2.0
 *
 * Single source of truth for all card surfaces.
 * Replaces the old GlassCard which had a dead `variant` prop.
 *
 * Rules:
 *  - Padding: always p-4 or p-5 (applied externally by consumer)
 *  - Border-radius: always rounded-2xl (20px)
 *  - Never use rounded-3xl or larger on cards
 */
const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  as: Tag = 'div',
  className = '',
  ...rest
}) => {
  const base = 'rounded-2xl transition-all duration-200';

  const variants: Record<string, string> = {
    // ── Solid surface ──────────────────────────────────────────────────
    default: [
      'bg-surface-bg',
      'border border-surface-border',
      'shadow-sm',
    ].join(' '),

    // ── Interactive — lifts on hover ───────────────────────────────────
    elevated: [
      'bg-surface-bg',
      'border border-surface-border',
      'shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-surface-border/80',
      'cursor-pointer',
    ].join(' '),

    // ── Recessed well — for empty states, secondary content ───────────
    inset: [
      'bg-surface-hover/40',
      'border border-dashed border-surface-border',
    ].join(' '),

    // ── Accent highlight — for featured / active content ──────────────
    accent: [
      'bg-brand-accent/5',
      'border border-brand-accent/20',
      'shadow-sm',
    ].join(' '),

    // ── Frosted glass — for overlays / floating panels ────────────────
    glass: [
      'bg-surface-bg/80 backdrop-blur-xl',
      'border border-surface-border/60',
      'shadow-lg',
    ].join(' '),
  };

  return (
    // @ts-ignore — dynamic tag typing
    <Tag
      className={`${base} ${variants[variant] ?? variants.default} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
};

// Named export for legacy GlassCard compat
export const GlassCard = Card;

export default Card;
