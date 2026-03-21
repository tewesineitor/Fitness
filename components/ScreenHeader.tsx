import React, { CSSProperties, ReactNode } from 'react';
import PageHeader from './layout/PageHeader';

interface ScreenHeaderProps {
  title: ReactNode;
  subtitle: string;
  actions?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({ title, subtitle, actions, className = '', style }) => {
  return (
    <PageHeader
      title={title}
      subtitle={subtitle}
      actions={actions}
      className={className}
      style={style}
    />
  );
};

export default ScreenHeader;
