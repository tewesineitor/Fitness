import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import Button from '../Button';
import { XIcon } from '../icons';

interface BottomSheetProps {
  children: React.ReactNode;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  panelClassName?: string;
  showCloseButton?: boolean;
}

const getPortalRoot = () => document.getElementById('modal-root') ?? document.body;

const BottomSheet: React.FC<BottomSheetProps> = ({
  children,
  onClose,
  title,
  description,
  footer,
  className = '',
  panelClassName = '',
  showCloseButton = true,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previousActiveElement = document.activeElement as HTMLElement | null;
    const bodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    const animationFrame = window.requestAnimationFrame(() => {
      const panel = panelRef.current;
      if (!panel) return;
      const focusable = panel.querySelector<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
      );
      (focusable ?? panel).focus();
    });

    return () => {
      document.body.style.overflow = bodyOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      window.cancelAnimationFrame(animationFrame);
      previousActiveElement?.focus?.();
    };
  }, [onClose]);

  return ReactDOM.createPortal(
    <div className={['ui-sheet-backdrop', className].filter(Boolean).join(' ')} role="presentation" onClick={onClose}>
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
        className={['ui-sheet-panel animate-sheet-in', panelClassName].filter(Boolean).join(' ')}
      >
        <div className="space-y-5 p-4 sm:p-5">
          <div className="space-y-3">
            <div className="ui-sheet-handle" />
            {(title || description || showCloseButton) ? (
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 space-y-1">
                  {title ? <h2 className="text-lg font-semibold tracking-[-0.03em] text-text-primary">{title}</h2> : null}
                  {description ? <p className="text-sm leading-6 text-text-secondary">{description}</p> : null}
                </div>
                {showCloseButton ? (
                  <Button variant="ghost" size="small" icon={XIcon} iconPosition="left" onClick={onClose} aria-label="Cerrar" className="!px-2" />
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="min-w-0">{children}</div>

          {footer ? <div className="pt-1">{footer}</div> : null}
        </div>
      </div>
    </div>,
    getPortalRoot()
  );
};

export default BottomSheet;
