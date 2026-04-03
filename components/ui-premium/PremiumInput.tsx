import React from 'react';
import { EyebrowText, MutedText } from './Typography';

interface PremiumInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  className?: string;
  inputClassName?: string;
  rightElement?: React.ReactNode;
  leftIcon?: React.ReactNode;
  multiline?: boolean;
  rows?: number;
}

const inputBaseClasses = [
  'w-full bg-transparent text-base font-medium text-zinc-100 outline-none resize-none',
  'placeholder:text-zinc-500',
].join(' ');

const wrapperClasses = [
  'flex items-center gap-3',
  'bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/50 rounded-[1.25rem] px-4 py-3',
  'transition-all duration-200 ease-out',
  'focus-within:border-emerald-400/50 focus-within:ring-1 focus-within:ring-emerald-400/50',
].join(' ');

const PremiumInput = React.forwardRef<HTMLInputElement, PremiumInputProps>((
  {
    label,
    hint,
    className = '',
    inputClassName = '',
    rightElement,
    leftIcon,
    multiline = false,
    rows = 3,
    ...inputProps
  },
  ref,
) => {
  return (
    <div className={['flex flex-col gap-2', className].filter(Boolean).join(' ')}>
      {label && <EyebrowText className="mb-2">{label}</EyebrowText>}
      <div className={wrapperClasses}>
        {leftIcon && <span className="flex-shrink-0 text-zinc-400">{leftIcon}</span>}
        {multiline ? (
          <textarea
            rows={rows}
            className={[inputBaseClasses, inputClassName].filter(Boolean).join(' ')}
            {...(inputProps as unknown as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            ref={ref}
            {...inputProps}
            className={[inputBaseClasses, inputClassName].filter(Boolean).join(' ')}
          />
        )}
        {rightElement && (
          <span className="flex-shrink-0 text-zinc-400">
            <MutedText>{rightElement}</MutedText>
          </span>
        )}
      </div>
      {hint && <MutedText>{hint}</MutedText>}
    </div>
  );
});

PremiumInput.displayName = 'PremiumInput';

export default PremiumInput;
