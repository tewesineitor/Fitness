import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import type { IconComponent } from '../types';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'tertiary'
  | 'outline'
  | 'destructive'
  | 'solid'
  | 'high-contrast'
  | 'icon-only';

export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconComponent;
  iconPosition?: 'left' | 'right';
  className?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: [
    'bg-brand-accent text-brand-accent-foreground border border-brand-accent/20',
    'shadow-md shadow-brand-accent/15',
    'hover:-translate-y-px hover:brightness-[1.02] hover:shadow-lg hover:shadow-brand-accent/20',
  ].join(' '),
  solid: [
    'bg-text-primary text-bg-base border border-transparent',
    'shadow-md shadow-black/10 dark:shadow-black/30',
    'hover:-translate-y-px hover:shadow-lg',
  ].join(' '),
  'high-contrast': [
    'bg-text-primary text-bg-base border border-transparent',
    'font-black uppercase tracking-[0.18em]',
    'shadow-md hover:-translate-y-px hover:shadow-lg',
  ].join(' '),
  secondary: [
    'bg-surface-bg text-text-primary border border-surface-border',
    'shadow-sm',
    'hover:-translate-y-px hover:border-brand-accent/25 hover:bg-surface-hover hover:shadow-md',
  ].join(' '),
  ghost: [
    'bg-transparent text-text-secondary border border-transparent',
    'hover:bg-surface-hover hover:text-text-primary',
  ].join(' '),
  tertiary: [
    'bg-transparent text-text-secondary border border-transparent',
    'hover:bg-surface-hover hover:text-text-primary',
  ].join(' '),
  outline: [
    'bg-transparent text-brand-accent border border-brand-accent/30',
    'hover:-translate-y-px hover:bg-brand-accent/10 hover:border-brand-accent/50',
  ].join(' '),
  destructive: [
    'bg-danger/10 text-danger border border-danger/20',
    'hover:-translate-y-px hover:bg-danger/15 hover:border-danger/35',
  ].join(' '),
  'icon-only': [
    'bg-surface-bg text-text-secondary border border-surface-border',
    'shadow-sm',
    'hover:-translate-y-px hover:border-brand-accent/25 hover:bg-surface-hover hover:text-text-primary hover:shadow-md',
  ].join(' '),
};

const sizeStyles: Record<ButtonSize, string> = {
  small: 'h-8 px-3 text-[11px] tracking-[0.14em] rounded-tag gap-1.5',
  medium: 'h-11 px-4 text-[12px] tracking-[0.14em] rounded-input gap-2',
  large: 'h-12 px-6 text-sm tracking-[0.16em] rounded-input gap-2.5',
};

const iconButtonSizeStyles: Record<ButtonSize, string> = {
  small: 'h-8 w-8 rounded-tag',
  medium: 'h-11 w-11 rounded-input',
  large: 'h-12 w-12 rounded-input',
};

const iconSizeStyles: Record<ButtonSize, string> = {
  small: 'h-3.5 w-3.5',
  medium: 'h-4 w-4',
  large: 'h-5 w-5',
};

/** @deprecated STOP. No usar en nuevas vistas. Usar equivalentes en components/ui-premium/ */
const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  icon: Icon,
  iconPosition = 'left',
  className = '',
  type = 'button',
  ...props
}) => {
  const isIconOnly = variant === 'icon-only' || (!children && Icon);
  const sizeClass = isIconOnly ? (iconButtonSizeStyles[size] ?? iconButtonSizeStyles.medium) : (sizeStyles[size] ?? sizeStyles.medium);
  const variantClass = variantStyles[variant] ?? variantStyles.primary;
  const iconEl = Icon ? <Icon className={`flex-shrink-0 ${iconSizeStyles[size] ?? iconSizeStyles.medium}`} /> : null;

  return (
    <button
      type={type}
      className={[
        'inline-flex items-center justify-center select-none',
        'font-semibold leading-none',
        'transition-all duration-200 ease-[var(--ease-smooth)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base',
        'disabled:pointer-events-none disabled:opacity-40',
        'active:scale-[0.97]',
        variantClass,
        sizeClass,
        className,
      ].filter(Boolean).join(' ')}
      {...props}
    >
      {iconPosition === 'left' && iconEl}
      {children && <span>{children}</span>}
      {iconPosition === 'right' && iconEl}
    </button>
  );
};

export default Button;
