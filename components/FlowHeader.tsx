import React from 'react';
import Button from './Button';
import { ChevronRightIcon } from './icons';

interface FlowHeaderProps {
  title: string;
  onBack: () => void;
  className?: string;
}

const FlowHeader: React.FC<FlowHeaderProps> = ({ title, onBack, className = '' }) => {
  return (
    <header className={`flex flex-col flex-shrink-0 p-4 sm:p-6 ${className}`}>
        <Button 
            variant="tertiary" 
            onClick={onBack} 
            icon={ChevronRightIcon} 
            className="!p-0 [&_svg]:rotate-180 self-start mb-4"
        >
            Volver
        </Button>
        <h1 className="text-3xl font-bold text-text-primary">{title}</h1>
    </header>
  );
};

export default FlowHeader;