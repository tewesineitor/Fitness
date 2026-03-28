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
 *   StatValue    → valor numérico grande de KPI
 *   MonoValue    → número tabulado (tabular-nums, mono)
 */

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
}

export const EyebrowText: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <span
    className={[
      'text-emerald-400 font-black uppercase tracking-widest text-[10px] select-none',
      className,
    ].join(' ')}
  >
    {children}
  </span>
);

export const ModalTitle: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <h2
    className={[
      'font-heading text-3xl font-black text-white leading-tight tracking-tight',
      className,
    ].join(' ')}
  >
    {children}
  </h2>
);

export const SectionTitle: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <h3
    className={[
      'font-heading text-xl font-black text-white leading-tight tracking-tight',
      className,
    ].join(' ')}
  >
    {children}
  </h3>
);

export const CardTitle: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <h4
    className={[
      'font-heading text-base font-bold text-white leading-snug tracking-tight',
      className,
    ].join(' ')}
  >
    {children}
  </h4>
);

export const BodyText: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <p
    className={[
      'text-sm text-zinc-400 leading-relaxed',
      className,
    ].join(' ')}
  >
    {children}
  </p>
);

export const MutedText: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <span
    className={[
      'text-xs text-zinc-500 leading-relaxed',
      className,
    ].join(' ')}
  >
    {children}
  </span>
);

export const StatLabel: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <span
    className={[
      'text-[9px] font-black uppercase tracking-[0.18em] text-zinc-500 select-none',
      className,
    ].join(' ')}
  >
    {children}
  </span>
);

export const StatValue: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <span
    className={[
      'font-heading text-4xl font-black text-white leading-none tabular-nums',
      className,
    ].join(' ')}
  >
    {children}
  </span>
);

export const MonoValue: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <span
    className={[
      'font-mono text-sm font-semibold text-zinc-300 tabular-nums',
      className,
    ].join(' ')}
  >
    {children}
  </span>
);
