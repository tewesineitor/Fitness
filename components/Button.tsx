
import React, { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'destructive' | 'outline' | 'solid' | 'high-contrast';
  size?: 'small' | 'medium' | 'large';
  icon?: React.FC<{ className?: string }>;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  icon: Icon,
  className = '',
  ...props
}) => {
  // Clean Utility / Modern Athletic
  // Removed 'relative overflow-hidden group' as we don't need the shine effect container anymore
  const baseClasses = 'flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 tracking-wide';

  const variantClasses = {
    // Primary: Brand accent, solid, clean
    primary: 'bg-brand-accent text-white font-bold shadow-lg shadow-brand-accent/20 hover:bg-brand-accent/90 active:scale-[0.98] border border-transparent',
    
    // High Contrast: Theme-aware high contrast (White in dark mode, Black in light mode)
    'high-contrast': 'bg-text-primary text-bg-base font-black uppercase tracking-widest shadow-lg hover:scale-[1.02] active:scale-[0.98] border border-transparent',

    // Solid: High contrast (Theme-aware)
    solid: 'bg-brand-accent text-white font-bold shadow-md hover:opacity-90 active:scale-[0.98] border border-transparent',

    // Secondary: Surface color, subtle border
    secondary: 'bg-surface-bg text-text-primary border border-surface-border font-medium hover:bg-surface-hover active:scale-[0.98] shadow-sm',
    
    // Tertiary: Ghost/Text only
    tertiary: 'bg-transparent text-text-secondary hover:text-white hover:bg-white/5 active:scale-[0.98]',
    
    // Destructive: Subtle red
    destructive: 'bg-red-500/10 text-red-500 border border-red-500/20 font-bold hover:bg-red-500/20 active:scale-[0.98]',
    
    // Outline: Border only
    outline: 'bg-transparent text-brand-accent border border-brand-accent/30 font-bold hover:bg-brand-accent/10 active:scale-[0.98]',
  };

  const sizeClasses = {
    small: 'py-2 px-3 text-xs uppercase tracking-wider',
    medium: 'py-3 px-5 text-sm',
    large: 'py-4 px-8 text-base',
  };

  const iconSizeClasses = {
    small: 'w-3 h-3',
    medium: 'w-4 h-4',
    large: 'w-5 h-5',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon className={`${iconSizeClasses[size]} ${children ? 'mr-2' : ''}`} />}
      <span>{children}</span>
    </button>
  );
};

export default Button;
