import React from 'react';
import SquishyCard from './SquishyCard';
import { BodyText, MutedText } from './Typography';

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
    <SquishyCard padding="sm" className={['flex flex-col gap-2', className].filter(Boolean).join(' ')}>
      {label ? <BodyText className="text-zinc-300">{label}</BodyText> : null}
      <input
        ref={ref}
        {...inputProps}
        className={[
          'w-full bg-transparent text-sm text-white outline-none',
          'placeholder:text-zinc-500',
          inputClassName,
        ]
          .filter(Boolean)
          .join(' ')}
      />
      {hint ? <MutedText>{hint}</MutedText> : null}
    </SquishyCard>
  );
});

PremiumInput.displayName = 'PremiumInput';

export default PremiumInput;
