import React from 'react';
import Button, { type ButtonProps, type ButtonSize, type ButtonVariant } from './Button';
import type { IconComponent } from '../types';

type IconButtonVariant = Extract<ButtonVariant, 'icon-only' | 'secondary' | 'ghost' | 'outline' | 'destructive' | 'primary' | 'solid' | 'high-contrast'>;

export interface IconButtonProps extends Omit<ButtonProps, 'children' | 'icon' | 'iconPosition' | 'variant'> {
  icon: IconComponent;
  label: string;
  variant?: IconButtonVariant;
  size?: ButtonSize;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  label,
  variant = 'icon-only',
  size = 'medium',
  title,
  type = 'button',
  className = '',
  ...props
}) => {
  return (
    <Button
      {...props}
      type={type}
      variant={variant}
      size={size}
      icon={icon}
      aria-label={label}
      title={title ?? label}
      className={className}
    />
  );
};

export default IconButton;
