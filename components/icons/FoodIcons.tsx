
import React from 'react';

// Common props for icons
interface IconProps {
  className?: string;
}

export const PlateIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="4" />
        <path d="M21.17 8H12" />
        <path d="M3.95 6.06L8.54 14" />
        <path d="M10.88 21.94L15.46 14" />
    </svg>
);

export const WaterGlassIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5.52 4h12.96L20 20H4L5.52 4z" />
    <path d="M10 12h4" />
  </svg>
);

export const BowlIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21a9 9 0 01-9-9c0-4.968 4.032-9 9-9s9 4.032 9 9-4.032 9-9 9z" />
        <path d="M5.636 12.364h12.728" />
    </svg>
);

export const ProteinShakeIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14" />
        <path d="M5 5h14" />
        <path d="M7 5v14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V5" />
        <path d="M12 15a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
    </svg>
);

export const MoleculeIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="12" r="3" />
        <circle cx="12" cy="6" r="3" />
        <circle cx="12" cy="18" r="3" />
        <line x1="8.5" y1="13.5" x2="10" y2="17" />
        <line x1="15.5" y1="13.5" x2="14" y2="17" />
        <line x1="10" y1="7" x2="8.5" y2="10.5" />
        <line x1="14" y1="7" x2="15.5" y2="10.5" />
    </svg>
);

export const CoffeeIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
        <path d="M2 8h14v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
        <line x1="6" y1="2" x2="6" y2="4" />
        <line x1="10" y1="2" x2="10" y2="4" />
        <line x1="14" y1="2" x2="14" y2="4" />
    </svg>
);

export const AppleIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 13.04a5.15 5.15 0 0 1-5.11 5.11 5.15 5.15 0 0 1-5.1-5.11c0-2.83 2.28-5.11 5.1-5.11a5.14 5.14 0 0 1 5.11 5.11z"/>
    <path d="M16.63 8.37c-1.11-2.09-3.52-3.18-5.61-2.07s-3.18 3.52-2.07 5.61"/>
  </svg>
);
