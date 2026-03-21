import React from 'react';
import { CheckCircleIcon, InformationCircleIcon, NoSymbolIcon, SparklesIcon } from '../icons';

type InlineAlertTone = 'info' | 'success' | 'warning' | 'danger' | 'accent';

interface InlineAlertProps {
  tone?: InlineAlertTone;
  title?: React.ReactNode;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

const toneClasses: Record<InlineAlertTone, string> = {
  info: 'border-brand-accent/20 bg-brand-accent/5 text-text-primary',
  success: 'border-success/20 bg-success/5 text-text-primary',
  warning: 'border-warning/25 bg-warning/10 text-text-primary',
  danger: 'border-danger/25 bg-danger/10 text-text-primary',
  accent: 'border-brand-accent/20 bg-brand-accent/10 text-text-primary',
};

const toneIcons: Record<InlineAlertTone, React.FC<{ className?: string }>> = {
  info: InformationCircleIcon,
  success: CheckCircleIcon,
  warning: SparklesIcon,
  danger: NoSymbolIcon,
  accent: SparklesIcon,
};

const InlineAlert: React.FC<InlineAlertProps> = ({
  tone = 'info',
  title,
  children,
  action,
  className = '',
}) => {
  const Icon = toneIcons[tone];

  return (
    <div className={['ui-inline-alert', toneClasses[tone], className].filter(Boolean).join(' ')}>
      <Icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-current" />
      <div className="min-w-0 flex-1 space-y-1">
        {title ? <p className="text-sm font-semibold tracking-[-0.02em]">{title}</p> : null}
        <div className="text-sm leading-6 text-current/80">{children}</div>
      </div>
      {action ? <div className="flex-shrink-0">{action}</div> : null}
    </div>
  );
};

export default InlineAlert;
