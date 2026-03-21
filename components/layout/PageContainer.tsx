import React, { ElementType, HTMLAttributes } from 'react';

interface PageContainerProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  padded?: boolean;
  size?: 'compact' | 'default' | 'wide' | 'full';
}

const PageContainer: React.FC<PageContainerProps> = ({
  as: Tag = 'div',
  padded = true,
  size = 'default',
  className = '',
  ...rest
}) => {
  const Component = Tag as React.ElementType;
  const sizeClasses = {
    compact: 'max-w-3xl',
    default: 'max-w-6xl',
    wide: 'max-w-7xl',
    full: 'max-w-none',
  }[size];

  return (
    <Component
      data-layout="page-container"
      className={[
        padded ? `ui-page-container ${sizeClasses}` : `mx-auto w-full ${sizeClasses}`,
        className,
      ].filter(Boolean).join(' ')}
      {...rest}
    />
  );
};

export default PageContainer;
