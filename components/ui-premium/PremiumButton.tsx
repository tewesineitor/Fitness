import React from 'react';
import { vibrate } from '../../utils/helpers';

type PremiumButtonVariant = 'primary' | 'ghost';
type PremiumButtonSize = 'md' | 'lg';

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
  md: 'py-4 text-base',
  lg: 'py-5 text-lg',
};

const variantClasses: Record<PremiumButtonVariant, string> = {
  primary:
    'bg-emerald-400 text-zinc-950 shadow-[0_0_30px_rgba(52,211,153,0.3)] hover:scale-105 active:bg-emerald-500 active:scale-[0.97]',
  ghost:
    'bg-transparent text-zinc-400 hover:text-zinc-200 active:text-zinc-300',
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
        'w-full rounded-full font-black uppercase select-none transition-all duration-150',
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
