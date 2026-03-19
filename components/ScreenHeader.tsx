import React, { ReactNode, CSSProperties } from 'react';

interface ScreenHeaderProps {
  title: ReactNode;
  subtitle: string;
  actions?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({ title, subtitle, actions, className = '', style }) => {
  return (
    <header className={`animate-fade-in-up ${className}`} style={style}>
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">{title}</h1>
          <p className="text-lg text-text-secondary">{subtitle}</p>
        </div>
        {actions && <div className="flex-shrink-0">{actions}</div>}
      </div>
    </header>
  );
};

export default ScreenHeader;
