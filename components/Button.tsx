
import React, { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  /**
   * primary     — Violet fill, white text. CTA principal.
   * secondary   — Surface fill, border. Acción secundaria.
   * ghost       — Transparente, texto muted. Acción terciaria / links.
   * outline     — Border de accent, sin fill.
   * destructive — Red semantic. Eliminar / acciones irreversibles.
   * icon-only   — Cuadrado sin padding de texto. Requiere sólo `icon` prop.
   * high-contrast — Fill de text-primary (blanco/negro según tema).
   */
  variant?: 'primary' | 'secondary' | 'ghost' | 'tertiary' | 'outline' | 'destructive' | 'solid' | 'high-contrast' | 'icon-only';
  size?: 'small' | 'medium' | 'large';
  icon?: React.FC<{ className?: string }>;
  iconPosition?: 'left' | 'right';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  icon: Icon,
  iconPosition = 'left',
  className = '',
  ...props
}) => {
  // Base — squishy physics baked in via CSS variable from index.html
  const base = [
    'inline-flex items-center justify-center font-semibold select-none',
    'transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base',
    'disabled:opacity-40 disabled:pointer-events-none',
    'active:scale-[0.96]',
  ].join(' ');

  const variants: Record<string, string> = {
    // ── Filled ────────────────────────────────────────────────────────
    primary: [
      'bg-brand-accent text-white border border-transparent',
      'shadow-md shadow-brand-accent/20',
      'hover:brightness-110 hover:shadow-lg hover:shadow-brand-accent/25',
    ].join(' '),

    solid: [
      'bg-brand-accent text-white border border-transparent',
      'shadow-md hover:opacity-90',
    ].join(' '),

    'high-contrast': [
      'bg-text-primary text-bg-base font-black uppercase tracking-widest border border-transparent',
      'shadow-md hover:scale-[1.01]',
    ].join(' '),

    // ── Surface ───────────────────────────────────────────────────────
    secondary: [
      'bg-surface-bg text-text-primary border border-surface-border',
      'shadow-sm hover:bg-surface-hover hover:border-surface-border',
    ].join(' '),

    // ── Ghost / Transparent ───────────────────────────────────────────
    ghost: [
      'bg-transparent text-text-secondary border border-transparent',
      'hover:bg-surface-hover hover:text-text-primary',
    ].join(' '),

    // kept for backwards compat — maps to ghost
    tertiary: [
      'bg-transparent text-text-secondary border border-transparent',
      'hover:bg-surface-hover hover:text-text-primary',
    ].join(' '),

    // ── Outline ───────────────────────────────────────────────────────
    outline: [
      'bg-transparent text-brand-accent border border-brand-accent/30',
      'hover:bg-brand-accent/8 hover:border-brand-accent/60',
    ].join(' '),

    // ── Semantic ──────────────────────────────────────────────────────
    destructive: [
      'bg-danger/10 text-danger border border-danger/20',
      'hover:bg-danger/20 hover:border-danger/30',
    ].join(' '),

    // ── Icon-only square ──────────────────────────────────────────────
    'icon-only': [
      'bg-surface-hover text-text-secondary border border-surface-border',
      'hover:bg-surface-hover hover:text-text-primary hover:border-brand-accent/30',
    ].join(' '),
  };

  const sizes: Record<string, string> = {
    small:  'h-8  px-3  text-[11px] tracking-wider rounded-lg  gap-1.5',
    medium: 'h-10 px-4  text-[13px] tracking-wide  rounded-xl  gap-2',
    large:  'h-12 px-6  text-sm     tracking-wide  rounded-xl  gap-2.5',
  };

  const iconOnlySizes: Record<string, string> = {
    small:  'h-8  w-8  rounded-lg',
    medium: 'h-10 w-10 rounded-xl',
    large:  'h-12 w-12 rounded-xl',
  };

  const iconSizes: Record<string, string> = {
    small:  'w-3.5 h-3.5',
    medium: 'w-4   h-4',
    large:  'w-5   h-5',
  };

  const isIconOnly = variant === 'icon-only' || (!children && Icon);

  const sizeClass = isIconOnly ? (iconOnlySizes[size] ?? iconOnlySizes.medium) : (sizes[size] ?? sizes.medium);
  const variantClass = variants[variant] ?? variants.primary;

  const iconEl = Icon ? (
    <Icon className={`flex-shrink-0 ${iconSizes[size] ?? iconSizes.medium}`} />
  ) : null;

  return (
    <button
      className={`${base} ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {iconPosition === 'left' && iconEl}
      {children && <span>{children}</span>}
      {iconPosition === 'right' && iconEl}
    </button>
  );
};

export default Button;
