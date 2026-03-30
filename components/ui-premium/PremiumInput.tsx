import React from 'react';
import { EyebrowText, MutedText } from './Typography';

interface PremiumInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  className?: string;
  inputClassName?: string;
}

const PremiumInput = React.forwardRef<HTMLInputElement, PremiumInputProps>(({
  label,
  hint,
  className = '',
  inputClassName = '',
  ...inputProps
}, ref) => {
  return (
    <div className={['flex flex-col gap-2', className].filter(Boolean).join(' ')}>
      {label ? <EyebrowText>{label}</EyebrowText> : null}
      <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/50 rounded-[1.5rem] px-5 py-4 transition-all duration-200 ease-out focus-within:border-emerald-400/50 focus-within:ring-1 focus-within:ring-emerald-400/30">
        <input
          ref={ref}
          {...inputProps}
          className={[
            'w-full bg-transparent text-base font-medium text-white outline-none',
            'placeholder:text-zinc-500',
            inputClassName,
          ]
            .filter(Boolean)
            .join(' ')}
        />
      </div>
      {hint ? <MutedText>{hint}</MutedText> : null}
    </div>
  );
});

PremiumInput.displayName = 'PremiumInput';

export default PremiumInput;
