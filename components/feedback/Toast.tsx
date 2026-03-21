import React from 'react';
import { CheckCircleIcon, InformationCircleIcon, NoSymbolIcon, SparklesIcon } from '../icons';

type ToastTone = 'info' | 'success' | 'warning' | 'danger' | 'accent';

interface ToastProps {
  tone?: ToastTone;
  title?: React.ReactNode;
  message: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

const toneIcons: Record<ToastTone, React.FC<{ className?: string }>> = {
  info: InformationCircleIcon,
  success: CheckCircleIcon,
  warning: SparklesIcon,
  danger: NoSymbolIcon,
  accent: SparklesIcon,
};

const toneText: Record<ToastTone, string> = {
  info: 'text-brand-accent',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
  accent: 'text-brand-accent',
};

const Toast: React.FC<ToastProps> = ({
  tone = 'info',
  title,
  message,
  action,
  className = '',
}) => {
  const Icon = toneIcons[tone];

  return (
    <div className={['ui-toast', className].filter(Boolean).join(' ')} role="status" aria-live="polite">
      <Icon className={['h-5 w-5 flex-shrink-0', toneText[tone]].join(' ')} />
      <div className="min-w-0 flex-1 space-y-0.5">
        {title ? <p className="text-sm font-semibold tracking-[-0.02em] text-text-primary">{title}</p> : null}
        <p className="text-sm leading-6 text-text-secondary">{message}</p>
      </div>
      {action ? <div className="flex-shrink-0">{action}</div> : null}
    </div>
  );
};

export default Toast;
