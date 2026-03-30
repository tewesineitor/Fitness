import React from 'react';
import { vibrate } from '../../utils/helpers';

type PremiumButtonVariant = 'primary' | 'ghost';
type PremiumButtonSize = 'sm' | 'md' | 'lg';

interface PremiumButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  onClick?: () => void;
  variant?: PremiumButtonVariant;
  size?: PremiumButtonSize;
  className?: string;
  disabled?: boolean;
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
};

const PremiumButton: React.FC<PremiumButtonProps> = ({
  children,
  onPress,
  onClick,
  variant = 'primary',
  size = 'lg',
  className = '',
  disabled = false,
  type = 'button',
  vibrateMs = 10,
}) => {
  const handlePointerDown = () => {
    if (disabled) return;
    vibrate(vibrateMs);
    onPress?.();
  };

  const handleClick = () => {
    if (disabled) return;
    onClick?.();
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      style={{ letterSpacing: 'var(--letter-spacing-caps)' }}
      className={[
        'w-full rounded-full font-black uppercase select-none transition-all duration-200 ease-out',
        sizeClasses[size],
        variantClasses[variant],
        disabled ? 'opacity-40 pointer-events-none' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </button>
  );
};

export default PremiumButton;
