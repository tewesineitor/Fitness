import React, { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /**
   * default: Surface card. Standard informational block.
   * elevated: Interactive card with hover shadow lift.
   * inset: Subtle recessed well. For empty states or secondary areas.
   * accent: Highlighted card with brand accent border and tint.
   * glass: Frosted glass effect with backdrop blur.
   */
  variant?: 'default' | 'elevated' | 'inset' | 'accent' | 'glass';
  as?: React.ElementType;
  className?: string;
}

/**
 * Card is the single source of truth for card surfaces.
 *
 * Rules:
 * - Padding: use p-4 or p-5 from the consumer.
 * - Border radius: use rounded-2xl.
 * - Avoid rounded-3xl or larger on cards.
 */
const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  as: Tag = 'div',
  className = '',
  ...rest
}) => {
  const base = 'rounded-2xl transition-all duration-200';

  const variants: Record<NonNullable<CardProps['variant']>, string> = {
    default: [
      'bg-surface-bg',
      'border border-surface-border',
      'shadow-sm',
    ].join(' '),
    elevated: [
      'bg-surface-bg',
      'border border-surface-border',
      'shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-surface-border/80',
      'cursor-pointer',
    ].join(' '),
    inset: [
      'bg-surface-hover/40',
      'border border-dashed border-surface-border',
    ].join(' '),
    accent: [
      'bg-brand-accent/5',
      'border border-brand-accent/20',
      'shadow-sm',
    ].join(' '),
    glass: [
      'bg-surface-bg/80 backdrop-blur-xl',
      'border border-surface-border/60',
      'shadow-lg',
    ].join(' '),
  };

  return (
    // @ts-ignore Dynamic tag typing.
    <Tag
      className={`${base} ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default Card;
