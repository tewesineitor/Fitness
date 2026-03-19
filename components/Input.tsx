import React, { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
  icon?: React.FC<{ className?: string }>;
  suffix?: string;
  focusClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, containerClassName = '', type, icon: Icon, suffix, focusClassName, ...props }, ref) => {
    const isNumber = type === 'number';
    
    const containerClasses = `flex flex-col ${containerClassName}`;
    
    const defaultFocusClasses = 'focus-within:border-brand-accent focus-within:ring-1 focus-within:ring-brand-accent/50';
    
    const inputWrapperClasses = `
      flex items-center bg-surface-bg border border-surface-border rounded-xl 
      transition-all duration-300
      ${focusClassName || defaultFocusClasses}
      ${error ? 'border-red-500 focus-within:border-red-500 focus-within:ring-red-500/50' : ''}
      ${props.readOnly ? 'border-transparent bg-surface-hover' : ''}
    `;

    const inputClasses = `
      w-full bg-transparent px-4 py-3 text-text-primary placeholder:text-text-secondary/30 
      focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed
      font-bold ${isNumber ? 'font-mono' : 'font-sans'}
      ${className}
    `;

    return (
      <div className={containerClasses}>
        {label && (
          <label className="text-[9px] font-bold text-text-secondary uppercase tracking-widest mb-1.5 ml-1 flex items-center gap-1.5">
            {Icon && <Icon className="w-3 h-3" />}
            {label}
          </label>
        )}
        <div className={inputWrapperClasses}>
          <input
            ref={ref}
            type={type}
            className={inputClasses}
            {...props}
          />
          {suffix && (
            <span className="pr-4 text-[10px] font-bold text-text-secondary uppercase tracking-wider">
              {suffix}
            </span>
          )}
        </div>
        {error && (
          <span className="text-[10px] font-bold text-red-500 mt-1 ml-1 uppercase tracking-wider">{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
