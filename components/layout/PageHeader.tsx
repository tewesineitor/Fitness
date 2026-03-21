import React, { CSSProperties } from 'react';
import Button from '../Button';
import { ChevronRightIcon } from '../icons';
import PageContainer from './PageContainer';

interface PageHeaderProps {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  backLabel?: string;
  onBack?: () => void;
  className?: string;
  style?: CSSProperties;
  size?: 'compact' | 'default' | 'wide' | 'full';
}

const PageHeader: React.FC<PageHeaderProps> = ({
  eyebrow,
  title,
  subtitle,
  actions,
  backLabel,
  onBack,
  className = '',
  style,
  size = 'default',
}) => {
  return (
    <PageContainer as="header" size={size} className={['ui-page-header', className].filter(Boolean).join(' ')} style={style}>
      <div className="flex flex-col gap-4">
        {backLabel && onBack ? (
          <Button
            variant="tertiary"
            size="small"
            onClick={onBack}
            icon={ChevronRightIcon}
            iconPosition="left"
            className="self-start !pl-0 [&_svg]:rotate-180"
          >
            {backLabel}
          </Button>
        ) : null}

        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0 space-y-2">
            {eyebrow ? <div className="ui-page-eyebrow">{eyebrow}</div> : null}
            <h1 className="ui-page-title">{title}</h1>
            {subtitle ? <p className="ui-page-subtitle">{subtitle}</p> : null}
          </div>

          {actions ? <div className="ui-page-actions lg:justify-end">{actions}</div> : null}
        </div>
      </div>
    </PageContainer>
  );
};

export default PageHeader;
