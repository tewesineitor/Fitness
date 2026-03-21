import React, { forwardRef, SelectHTMLAttributes } from 'react';
import { ChevronRightIcon } from './icons';

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  containerClassName?: string;
  focusClassName?: string;
}

const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  (
    {
      className = '',
      label,
      error,
      hint,
      containerClassName = '',
      focusClassName,
      children,
      ...props
    },
    ref
  ) => {
    const wrapperClasses = [
      'relative flex items-center h-11 rounded-xl border border-surface-border bg-surface-hover/40 transition-all duration-200',
      focusClassName ?? 'focus-within:border-brand-accent/50 focus-within:ring-2 focus-within:ring-brand-accent/20',
      error ? 'border-danger/50 focus-within:border-danger focus-within:ring-danger/20' : '',
      props.disabled ? 'opacity-40 cursor-not-allowed' : '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
        {label && (
          <label className="pl-0.5 text-[9px] font-bold uppercase tracking-[0.15em] text-text-secondary select-none">
            {label}
          </label>
        )}

        <div className={wrapperClasses}>
          <select
            ref={ref}
            className={[
              'h-full w-full appearance-none bg-transparent px-3 pr-10 outline-none',
              'text-[13px] font-medium text-text-primary',
              className,
            ]
              .filter(Boolean)
              .join(' ')}
            {...props}
          >
            {children}
          </select>
          <ChevronRightIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-text-secondary/60" />
        </div>

        {error && (
          <p className="pl-0.5 text-[10px] font-bold uppercase tracking-wider text-danger">
            {error}
          </p>
        )}

        {hint && !error && <p className="pl-0.5 text-[10px] text-text-muted">{hint}</p>}
      </div>
    );
  }
);

SelectField.displayName = 'SelectField';

export default SelectField;
