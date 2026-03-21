import React from 'react';
import Card from '../Card';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <Card variant="inset" className={['ui-empty-state', className].filter(Boolean).join(' ')}>
      {icon ? <div className="flex items-center justify-center text-text-muted">{icon}</div> : null}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold tracking-[-0.02em] text-text-primary">{title}</h3>
        {description ? <p className="text-sm leading-6 text-text-secondary">{description}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </Card>
  );
};

export default EmptyState;
