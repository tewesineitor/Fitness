import React from 'react';

/**
 * Typography — UI Kit Premium
 *
 * Tokens tipográficos canónicos del Design System.
 * Importar desde aquí. NUNCA inventar clases de texto ad-hoc en pantallas.
 *
 * Jerarquía:
 *   EyebrowText  → etiqueta de categoría / sección (encima del título)
 *   ModalTitle   → h2 de modales y sheets premium
 *   SectionTitle → h3 para cabeceras de sección dentro de pantallas
 *   CardTitle    → título de tarjeta bento o card compacta
 *   BodyText     → párrafo de cuerpo estándar
 *   MutedText    → texto de soporte, hints, metadatos
 *   StatLabel    → etiqueta de métrica (micro-caps)
 *   StatValue    → valor numérico grande de KPI (3xl → 4xl fluid)
 *   MonoValue    → número tabulado (tabular-nums, mono)
 *   MediumValue  → número intermedio (text-4xl → 5xl fluid) para widgets secundarios
 *   GiantValue   → número masivo para centros de steppers y KPIs (text-5xl → 7xl fluid)
 *   TabLabel     → texto táctil de alta legibilidad para botones y pestañas (text-base)
 */

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
}

export const EyebrowText: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <span
    className={[
      'text-brand-accent font-black uppercase tracking-widest text-[10px] select-none',
      className,
    ].join(' ')}
  >
    {children}
  </span>
);

export const ModalTitle: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <h2
    className={[
      'font-heading text-[length:var(--font-size-modal-title)] font-black text-text-primary leading-tight tracking-tight',
      className,
    ].join(' ')}
  >
    {children}
  </h2>
);

export const SectionTitle: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <h3
    className={[
      'font-heading text-xl font-black text-text-primary leading-tight tracking-tight',
      className,
    ].join(' ')}
  >
    {children}
  </h3>
);

export const CardTitle: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <h4
    className={[
      'font-heading text-base font-bold text-text-primary leading-snug tracking-tight',
      className,
    ].join(' ')}
  >
    {children}
  </h4>
);

export const BodyText: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <p
    className={[
      'text-sm text-text-secondary leading-relaxed',
      className,
    ].join(' ')}
  >
    {children}
  </p>
);

export const MutedText: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <span
    className={[
      'text-xs text-text-muted leading-relaxed',
      className,
    ].join(' ')}
  >
    {children}
  </span>
);

export const StatLabel: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <span
    className={[
      'text-[9px] font-black uppercase tracking-[0.18em] text-text-muted select-none',
      className,
    ].join(' ')}
  >
    {children}
  </span>
);

export const StatValue: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <span
    className={[
      'font-mono text-[length:var(--font-size-stat-value)] font-bold text-text-primary leading-none tabular-nums tracking-tight',
      className,
    ].join(' ')}
  >
    {children}
  </span>
);

export const MonoValue: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <span
    className={[
      'font-mono text-sm font-semibold text-text-secondary tabular-nums',
      className,
    ].join(' ')}
  >
    {children}
  </span>
);

export const MediumValue: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <span
    className={[
      'font-heading text-[length:var(--font-size-medium-value)] font-bold tracking-tight text-text-primary leading-none tabular-nums',
      className,
    ].join(' ')}
  >
    {children}
  </span>
);

export const GiantValue: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <span
    className={[
      'font-heading text-[length:var(--font-size-giant)] font-black tracking-tight text-text-primary leading-none tabular-nums',
      className,
    ].join(' ')}
  >
    {children}
  </span>
);

export const TabLabel: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <span
    className={[
      'text-base font-black tracking-wide',
      className,
    ].join(' ')}
  >
    {children}
  </span>
);
