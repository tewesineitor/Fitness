import React from 'react';

interface PremiumBadgeProps {
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const PremiumBadge: React.FC<PremiumBadgeProps> = ({ icon, children, className = '' }) => (
  <div
    className={[
      'bg-emerald-400/10 border border-emerald-400/20 text-emerald-300',
      'text-sm font-bold px-4 py-3 rounded-xl flex items-center gap-3 italic',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
  >
    {icon && <span className="not-italic flex-shrink-0">{icon}</span>}
    {children}
  </div>
);

export default PremiumBadge;
