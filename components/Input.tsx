import React, { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  containerClassName?: string;
  icon?: React.FC<{ className?: string }>;
  suffix?: string;
  focusClassName?: string;
}

/**
 * Input — Obsidian Protocol v2.0
 *
 * h-11 (44px) for touch-target compliance.
 * font-medium inside the field (bold feels like placeholder, not content).
 * label uses Micro typography — all-caps, tracked, 9px.
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = '',
      label,
      error,
      hint,
      containerClassName = '',
      type,
      icon: Icon,
      suffix,
      focusClassName,
      ...props
    },
    ref
  ) => {
    const isNumber = type === 'number';

    const defaultFocusClasses =
      'focus-within:border-brand-accent/50 focus-within:ring-2 focus-within:ring-brand-accent/20';

    const wrapperClasses = [
      'flex items-center h-11',
      'bg-surface-hover/40 border border-surface-border rounded-xl',
      'transition-all duration-200',
      focusClassName ?? defaultFocusClasses,
      error ? 'border-danger/50 focus-within:border-danger focus-within:ring-danger/20' : '',
      props.readOnly ? 'bg-surface-hover border-transparent cursor-default' : '',
      props.disabled ? 'opacity-40 cursor-not-allowed' : '',
    ]
      .filter(Boolean)
      .join(' ');

    const inputClasses = [
      'flex-1 h-full px-3 bg-transparent outline-none',
      'text-[13px] text-text-primary placeholder:text-text-muted/50',
      'font-medium',                         // ← changed from font-bold
      isNumber ? 'font-mono tabular-nums' : '',
      Icon ? 'pl-0' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
        {label && (
          <label className="flex items-center gap-1.5 text-[9px] font-bold text-text-secondary uppercase tracking-[0.15em] pl-0.5 select-none">
            {Icon && <Icon className="w-3 h-3" />}
            {label}
          </label>
        )}

        <div className={wrapperClasses}>
          {Icon && (
            <div className="pl-3 flex items-center flex-shrink-0 text-text-muted">
              <Icon className="w-4 h-4" />
            </div>
          )}

          <input
            ref={ref}
            type={type}
            className={inputClasses}
            {...props}
          />

          {suffix && (
            <span className="pr-3 flex-shrink-0 text-[10px] font-bold text-text-secondary/60 uppercase tracking-wider">
              {suffix}
            </span>
          )}
        </div>

        {error && (
          <p className="text-[10px] font-bold text-danger uppercase tracking-wider pl-0.5">
            {error}
          </p>
        )}

        {hint && !error && (
          <p className="text-[10px] text-text-muted pl-0.5">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
