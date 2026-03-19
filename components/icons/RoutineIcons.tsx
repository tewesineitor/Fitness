import React from 'react';

// Common props for icons
interface IconProps {
  className?: string;
}

export const StrengthIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 18.5a2.5 2.5 0 0 1-2.5-2.5V8.5a2.5 2.5 0 0 1 5 0v7.5a2.5 2.5 0 0 1-2.5 2.5z" />
    <path d="M6 18.5a2.5 2.5 0 0 1-2.5-2.5V8.5a2.5 2.5 0 0 1 5 0v7.5a2.5 2.5 0 0 1-2.5 2.5z" />
    <line x1="15.5" y1="12" x2="8.5" y2="12" />
  </svg>
);

export const YogaIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22v-6"/>
    <path d="M12 16a6 6 0 0 1 6-6v-2h-2"/>
    <path d="M12 16a6 6 0 0 0-6-6v-2h2"/>
    <circle cx="12" cy="4" r="2"/>
    <path d="m14 10-2-2-2 2"/>
  </svg>
);

export const PostureIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="1"/>
    <path d="M12 6v14"/>
    <path d="M10 20h4"/>
    <path d="M10 9h4"/>
  </svg>
);

export const CardioIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    {/* Tech Running Shoe Design */}
    <path d="M17 19.5a3.5 3.5 0 0 0-3.5-3.5H9l-2-4H4" />
    <path d="M19 16l-3.5-5L13 14" />
    <path d="M4 20h14.5a2.5 2.5 0 0 0 2.5-2.5V16" />
    <path d="M4 16h2l2 4" />
    <path d="M2 16h2" />
    <path d="M13 11l-2-4-3 1" />
    {/* Speed lines */}
    <path d="M20 9h2" />
    <path d="M21 6h1" />
  </svg>
);

export const MeditationIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="6" r="2"/>
    <path d="M12 8v4"/>
    <path d="M21 16c0-3.5-2-5-5-5h-8c-3 0-5 1.5-5 5"/>
    <path d="M18 20c-1.5-2-3-2-6 0s-4.5 2-6 0"/>
  </svg>
);

export const MountainIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 18.25L9.75 6l3 7.5 3-4.5 3.75 9.25" />
    </svg>
);

export const ClockIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const FireIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.362-3.797z" />
  </svg>
);