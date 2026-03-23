import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
  className?: string;
}

const getPortalRoot = () => document.getElementById('modal-root') ?? document.body;

const Modal: React.FC<ModalProps> = ({ children, onClose, className = '' }) => {
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
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-neutral-950/65 px-4 py-6 backdrop-blur-md animate-fade-in"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
        className={[
          'w-full max-w-lg rounded-sheet border border-surface-border bg-surface-bg shadow-lg animate-sheet-in',
          className,
        ].join(' ')}
      >
        {children}
      </div>
    </div>,
    getPortalRoot()
  );
};

export default Modal;
