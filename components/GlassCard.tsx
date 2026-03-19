import React, { ReactNode, HTMLAttributes } from 'react';

/**
 * A reusable card component that applies the standard "Clean Utility" surface style.
 * Formerly "GlassCard", now updated for a solid, clean look.
 * @param {ReactNode} children - The content to be displayed inside the card.
 * @param {string} [className] - Optional additional CSS classes to apply.
 */
interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'flat' | 'outlined';
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', variant = 'default', ...rest }) => {
  // New standard card styles
  const baseClasses = "bg-surface-bg border border-surface-border shadow-sm";
  
  return (
    <div className={`${baseClasses} ${className}`} {...rest}>
      {children}
    </div>
  );
};

export default GlassCard;
