import React from 'react';
import type { IconComponent } from '../types';

type TagVariant = 'filter' | 'status' | 'overlay';
type TagTone = 'neutral' | 'accent' | 'protein' | 'carbs' | 'success' | 'danger';
type TagSize = 'sm' | 'md' | 'lg';

interface TagProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: TagVariant;
  tone?: TagTone;
  size?: TagSize;
  active?: boolean;
  interactive?: boolean;
  disabled?: boolean;
  icon?: IconComponent;
  iconPosition?: 'left' | 'right';
  count?: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
}

const toneClasses: Record<TagTone, string> = {
  neutral: 'text-text-secondary',
  accent: 'text-brand-accent',
  protein: 'text-brand-protein',
  carbs: 'text-brand-carbs',
  success: 'text-success',
  danger: 'text-danger',
};

const variantClasses: Record<TagVariant, string> = {
  filter: 'ui-tag--filter',
  status: 'ui-tag--status',
  overlay: 'ui-tag--overlay',
};

const sizeClasses: Record<TagSize, string> = {
  sm: 'ui-tag--sm',
  md: 'ui-tag--md',
  lg: 'ui-tag--lg',
};

/** @deprecated STOP. No usar en nuevas vistas. Usar equivalentes en components/ui-premium/ */
const Tag: React.FC<TagProps> = ({
  children,
  variant = 'status',
  tone = 'neutral',
  size = 'sm',
  active = false,
  interactive = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  count,
  type = 'button',
  className = '',
  onClick,
  ...rest
}) => {
  const isInteractive = interactive || Boolean(onClick) || disabled;
  const Component = isInteractive ? 'button' : 'span';
  const interactiveProps = isInteractive
    ? {
        type,
        disabled,
        'aria-pressed': active,
        'data-interactive': 'true',
      }
    : {};

  return (
    <Component
      className={[
        'ui-tag',
        variantClasses[variant],
        sizeClasses[size],
        toneClasses[tone],
        disabled ? 'pointer-events-none opacity-50' : '',
        className,
      ].filter(Boolean).join(' ')}
      data-variant={variant}
      data-tone={tone}
      data-active={active ? 'true' : 'false'}
      onClick={onClick as React.MouseEventHandler<HTMLButtonElement> | undefined}
      {...interactiveProps}
      {...(rest as React.HTMLAttributes<HTMLSpanElement>)}
    >
      {Icon && iconPosition === 'left' ? <Icon className="ui-tag__icon" /> : null}
      <span className="truncate">{children}</span>
      {typeof count !== 'undefined' ? <span className="ui-tag__count">{count}</span> : null}
      {Icon && iconPosition === 'right' ? <Icon className="ui-tag__icon" /> : null}
    </Component>
  );
};

export default Tag;
