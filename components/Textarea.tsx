import React, { forwardRef, TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  containerClassName?: string;
  focusClassName?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className = '',
      label,
      error,
      hint,
      containerClassName = '',
      focusClassName,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const wrapperClasses = [
      'flex flex-col rounded-2xl border border-surface-border bg-surface-hover/40 transition-all duration-200',
      focusClassName ?? 'focus-within:border-brand-accent/50 focus-within:ring-2 focus-within:ring-brand-accent/20',
      error ? 'border-danger/50 focus-within:border-danger focus-within:ring-danger/20' : '',
      props.readOnly ? 'bg-surface-hover border-transparent cursor-default' : '',
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
          <textarea
            ref={ref}
            rows={rows}
            className={[
              'w-full resize-none bg-transparent px-4 py-3.5 outline-none',
              'text-[13px] font-medium text-text-primary placeholder:text-text-muted/50',
              className,
            ]
              .filter(Boolean)
              .join(' ')}
            {...props}
          />
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

Textarea.displayName = 'Textarea';

export default Textarea;
