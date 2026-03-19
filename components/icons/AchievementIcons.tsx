import React from 'react';

// Common props for icons
interface IconProps {
  className?: string;
}

export const TrophyIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.5a2.5 2.5 0 0 0-3-2.5H6v6h1.5a2.5 2.5 0 0 0 2.5-2.5V14" />
    <path d="M12 12v10" />
    <path d="M18 18.5a2.5 2.5 0 0 0-2.5-2.5H14v6h1.5a2.5 2.5 0 0 0 2.5-2.5z" />
    <path d="M12 2v10" />
    <path d="M12 2a4 4 0 0 1 4 4v4a4 4 0 0 1-4 4" />
    <path d="M12 2a4 4 0 0 0-4 4v4a4 4 0 0 0 4 4" />
  </svg>
);

export const ArchitectIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 17.5a1.5 1.5 0 0 0-3 0v2.5h3" />
    <path d="M4 17.5a1.5 1.5 0 0 1 3 0v2.5h-3" />
    <path d="M12 15a6 6 0 0 0-6 6h12a6 6 0 0 0-6-6z" />
    <path d="M12 3a6 6 0 0 0-6 6c0 1.4.5 2.8 1.4 3.8A4 4 0 0 0 12 15a4 4 0 0 0 4.6-2.2c.9-1 1.4-2.4 1.4-3.8a6 6 0 0 0-6-6z" />
  </svg>
);

export const IronWeekIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M3 10h18" />
    <path d="m9 16 2 2 4-4" />
  </svg>
);

export const ProteinChefIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 22h14" />
    <path d="M6 18H2.5a.5.5 0 0 1 0-1H6" />
    <path d="M18 17h3.5a.5.5 0 0 0 0-1H18" />
    <path d="M12 2a4 4 0 0 0-4 4v2c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V6a4 4 0 0 0-4-4z" />
    <path d="M12 10v8" />
  </svg>
);

export const RookieRunnerIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m14 16.5-5-3-2.5 2.5" />
    <path d="M10 13.5v-3l4-3" />
    <path d="M22 13.5a1.5 1.5 0 0 1-1.5 1.5H14" />
    <path d="M18 13.5a1.5 1.5 0 0 1-1.5-1.5V11a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1a1.5 1.5 0 0 1-1.5 1.5z" />
    <path d="M5.5 19H12a2 2 0 0 0 2-2V9.5a2.5 2.5 0 0 0-2.5-2.5h-5A2.5 2.5 0 0 0 4 9.5v8a1.5 1.5 0 0 0 1.5 1.5z" />
  </svg>
);

export const SereneMindIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3.5 16a2.5 2.5 0 0 1 .5-1.5 2.5 2.5 0 0 1 4.5 0 2.5 2.5 0 0 1 .5 1.5" />
    <path d="M15.5 16a2.5 2.5 0 0 1 .5-1.5 2.5 2.5 0 0 1 4.5 0 2.5 2.5 0 0 1 .5 1.5" />
    <path d="M12 21a9 9 0 0 0-9-9" />
    <path d="M12 21a9 9 0 0 1 9-9" />
    <path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
  </svg>
);

export const NutritionMasterIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v6" />
    <path d="M15 5H9" />
    <path d="M11 2a2 2 0 1 0 4 0" />
    <path d="M12 8a6 6 0 0 0-6 6c0 4.5 6 10 6 10s6-5.5 6-10a6 6 0 0 0-6-6z" />
    <path d="M12 11a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
  </svg>
);
