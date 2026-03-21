import React from 'react';

interface DialogSectionCardProps {
  children: React.ReactNode;
  className?: string;
}

const DialogSectionCard: React.FC<DialogSectionCardProps> = ({ children, className = '' }) => (
  <div className={['rounded-2xl border border-surface-border bg-surface-bg p-4 shadow-sm', className].join(' ')}>
    {children}
  </div>
);

export default DialogSectionCard;
