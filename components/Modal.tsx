import React, { useEffect } from 'react';
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
  // Prevent body scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-[200] p-4 transition-opacity duration-300" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
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