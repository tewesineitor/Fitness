import React, { HTMLAttributes } from 'react';
import Card from '../Card';

interface PageSectionProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  surface?: 'none' | 'card' | 'inset' | 'glass';
  bodyClassName?: string;
}

const PageSection: React.FC<PageSectionProps> = ({
  eyebrow,
  title,
  subtitle,
  actions,
  surface = 'none',
  bodyClassName = '',
  className = '',
  children,
  ...rest
}) => {
  const body = surface === 'none' ? (
    children
  ) : (
    <Card
      as="div"
      variant={surface === 'inset' ? 'inset' : surface === 'glass' ? 'glass' : 'default'}
      className={['p-4 sm:p-5', bodyClassName].filter(Boolean).join(' ')}
    >
      {children}
    </Card>
  );

  return (
    <section className={['ui-section', className].filter(Boolean).join(' ')} {...rest}>
      {(eyebrow || title || subtitle || actions) ? (
        <div className="ui-section__header">
          <div className="min-w-0 space-y-1">
            {eyebrow ? <div className="ui-section__eyebrow">{eyebrow}</div> : null}
            {title ? <h2 className="ui-section__title">{title}</h2> : null}
            {subtitle ? <p className="ui-section__subtitle">{subtitle}</p> : null}
          </div>
          {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
        </div>
      ) : null}

      {body}
    </section>
  );
};

export default PageSection;
