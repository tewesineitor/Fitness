import React from 'react';

type IconButtonVariant = 'ghost' | 'danger' | 'primary';
type IconButtonSize = 'sm' | 'md' | 'lg';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
}

const variantClasses: Record<IconButtonVariant, string> = {
  ghost:   'text-zinc-400 hover:text-zinc-100   hover:bg-zinc-800/50',
  danger:  'text-zinc-400 hover:text-rose-400   hover:bg-rose-500/10',
  primary: 'text-zinc-400 hover:text-emerald-400 hover:bg-emerald-500/10',
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
