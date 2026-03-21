import React, { HTMLAttributes, ReactNode } from 'react';

interface PageContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const PageContainer: React.FC<PageContainerProps> = ({ children, className = '', ...props }) => {
  return (
    <div
      className={['mx-auto w-full max-w-3xl', className].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </div>
  );
};

export default PageContainer;
