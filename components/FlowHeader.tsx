import React from 'react';
import PageHeader from './layout/PageHeader';

interface FlowHeaderProps {
  title: string;
  onBack: () => void;
  className?: string;
}

const FlowHeader: React.FC<FlowHeaderProps> = ({ title, onBack, className = '' }) => {
  return (
    <PageHeader
      title={title}
      backLabel="Volver"
      onBack={onBack}
      className={className}
    />
  );
};

export default FlowHeader;
