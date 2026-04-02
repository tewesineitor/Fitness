import React from 'react';
import { vibrate } from '../../utils/helpers';

type PremiumButtonVariant = 'primary' | 'ghost' | 'danger';
type PremiumButtonSize = 'sm' | 'md' | 'lg';

interface PremiumButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  onClick?: () => void;
  variant?: PremiumButtonVariant;
  size?: PremiumButtonSize;
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  vibrateMs?: number;
}

const sizeClasses: Record<PremiumButtonSize, string> = {
  sm: 'py-2 text-sm',
  md: 'py-4 text-base',
  lg: 'py-5 text-lg',
};

const variantClasses: Record<PremiumButtonVariant, string> = {
  primary:
    'bg-emerald-400 text-zinc-950 shadow-[0_0_30px_rgba(52,211,153,0.3)] hover:brightness-110 hover:scale-[1.02] active:brightness-95 active:scale-[0.97]',
  ghost:
    'bg-zinc-800/60 border border-zinc-700/50 text-zinc-300 hover:bg-zinc-700/60 hover:text-zinc-100 active:scale-[0.98] active:bg-zinc-800',
  danger:
    'bg-rose-500 text-zinc-950 shadow-[0_0_24px_rgba(244,63,94,0.3)] hover:brightness-110 hover:scale-[1.02] active:brightness-95 active:scale-[0.97]',
};

const Spinner: React.FC = () => (
  <svg
    className="absolute inset-0 m-auto w-5 h-5 animate-spin text-current"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <circle
      className="opacity-25"
      cx="12" cy="12" r="10"
      stroke="currentColor"
      strokeWidth="3"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    />
  </svg>
);

const PremiumButton: React.FC<PremiumButtonProps> = ({
  children,
  onPress,
  onClick,
  variant = 'primary',
  size = 'lg',
  className = '',
  disabled = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  type = 'button',
  vibrateMs = 10,
}) => {
  const isDisabled = disabled || isLoading;

  const handlePointerDown = () => {
    if (isDisabled) return;
    vibrate(vibrateMs);
    onPress?.();
  };

  const handleClick = () => {
    if (isDisabled) return;
    onClick?.();
  };

  return (
    <button
      type={type}
      disabled={isDisabled}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      className={[
        'relative w-full rounded-full font-black uppercase tracking-widest select-none transition-all duration-200 ease-out',
        sizeClasses[size],
        variantClasses[variant],
        isDisabled ? 'opacity-40 pointer-events-none' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {isLoading && <Spinner />}
      <span
        className={[
          'inline-flex items-center justify-center gap-2',
          isLoading ? 'opacity-0' : 'opacity-100',
        ].join(' ')}
      >
        {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </span>
    </button>
  );
};

export default PremiumButton;
