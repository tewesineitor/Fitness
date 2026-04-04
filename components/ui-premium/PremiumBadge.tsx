import React from 'react';
import { BodyText } from './Typography';

interface PremiumBadgeProps {
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const PremiumBadge: React.FC<PremiumBadgeProps> = ({ icon, children, className = '' }) => (
  <div
    className={[
      'bg-brand-accent/10 border border-brand-accent/20 text-brand-accent',
      'px-4 py-3 rounded-xl flex items-center gap-3',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
  >
    {icon && <span className="flex-shrink-0">{icon}</span>}
    <BodyText className="italic font-semibold text-brand-accent">{children}</BodyText>
  </div>
);

export default PremiumBadge;
