import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
  className?: string; // Allows customizing the modal card, e.g., for width
}

const modalRoot = document.getElementById('modal-root');

if (!modalRoot) {
  throw new Error("The element with id 'modal-root' was not found in the DOM.");
}

const Modal: React.FC<ModalProps> = ({ children, onClose, className = '' }) => {
  const panelRef = useRef<HTMLDivElement>(null);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    const previousActiveElement = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    const focusableSelector = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])'
    ].join(',');

    const focusFirstElement = () => {
      const panel = panelRef.current;
      if (!panel) return;

      const focusable = panel.querySelector<HTMLElement>(focusableSelector);
      (focusable ?? panel).focus();
    };

    const animationFrame = window.requestAnimationFrame(focusFirstElement);

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleKeyDown);
      window.cancelAnimationFrame(animationFrame);

      if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
        previousActiveElement.focus();
      }
    };
  }, [onClose]);

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-[200] p-4 transition-opacity duration-300" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
        ref={panelRef}
        tabIndex={-1}
        className={`bg-surface-bg bg-opacity-100 rounded-xl w-full max-w-sm border border-surface-border shadow-sm animate-scale-in ${className}`} 
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );

  return ReactDOM.createPortal(
    modalContent,
    modalRoot
  );
};

export default Modal;
