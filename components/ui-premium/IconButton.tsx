import React from 'react';

type IconButtonVariant = 'ghost' | 'danger' | 'primary' | 'solid';
type IconButtonSize = 'sm' | 'md' | 'lg';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
}

const variantClasses: Record<IconButtonVariant, string> = {
  ghost:   'text-text-secondary hover:text-text-primary   hover:bg-surface-raised/50',
  danger:  'text-text-secondary hover:text-danger         hover:bg-danger/10',
  primary: 'text-text-secondary hover:text-brand-accent   hover:bg-brand-accent/10',
  solid:   'bg-brand-accent text-brand-accent-foreground hover:bg-brand-accent/90 rounded-xl shadow-lg',
};

const sizeClasses: Record<IconButtonSize, string> = {
  sm: 'p-1   rounded',
  md: 'p-1.5 rounded-md',
  lg: 'p-2   rounded-lg',
};

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  variant = 'ghost',
  size = 'md',
  className = '',
  ...props
}) => (
  <button
    type="button"
    className={[
      'inline-flex items-center justify-center',
      'cursor-pointer select-none',
      'transition-all duration-150 active:scale-95',
      variantClasses[variant],
      sizeClasses[size],
      className,
    ].filter(Boolean).join(' ')}
    {...props}
  >
    {icon}
  </button>
);

export default IconButton;
