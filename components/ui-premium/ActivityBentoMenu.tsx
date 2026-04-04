import React from 'react';
import { motion } from 'framer-motion';
import { SquishyCard, EyebrowText, CardTitle, MutedText } from './index';

// ── Types ─────────────────────────────────────────────────────────────────────

export type ActivityType = 'run' | 'hike' | 'rucking';

export interface ActivityBentoMenuProps {
    /** Called when the user taps one of the activity tiles. */
    onOpen: (type: ActivityType) => void;
    className?: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * ActivityBentoMenu — UI_MANIFEST §ActivityBentoMenu
 *
 * Compact 3-column dock layout (single row):
 *   [Carrera] [Senderismo] [Rucking]
 *
 * All tiles are uniform 1-column spans with icon-above-text layout.
 */
const ActivityBentoMenu: React.FC<ActivityBentoMenuProps> = ({ onOpen, className }) => (
    <SquishyCard padding="sm" className={className}>
        <EyebrowText className="block mb-3">Actividad Libre</EyebrowText>
        <div className="grid grid-cols-3 gap-3">
            
            {/* Carrera */}
            <SquishyCard 
                interactive 
                padding="sm" 
                className="flex flex-col items-center gap-1.5 bg-surface-raised/30"
                onClick={() => onOpen('run')}
            >
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-brand-accent/10">
                    <svg className="w-4 h-4 text-brand-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <circle cx="12" cy="5" r="1.5" />
                        <path d="M8 17l1.5-5 2.5 2 2.5-4L16 17" />
                        <path d="M7 12l1-3 4 1 3-3" />
                    </svg>
                </div>
                <CardTitle className="text-[12px]">Carrera</CardTitle>
                <MutedText className="text-center text-[10px]">Ritmo y km</MutedText>
            </SquishyCard>

            {/* Senderismo */}
            <SquishyCard 
                interactive 
                padding="sm" 
                className="flex flex-col items-center gap-1.5 bg-surface-raised/30"
                onClick={() => onOpen('hike')}
            >
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-brand-carbs/10">
                    <svg className="w-4 h-4 text-brand-carbs" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M3 20l4-8 4 4 4-10 4 14" />
                        <path d="M3 20h18" />
                    </svg>
                </div>
                <CardTitle className="text-[12px]">Senderismo</CardTitle>
                <MutedText className="text-center text-[10px]">Elevación</MutedText>
            </SquishyCard>

            {/* Rucking */}
            <SquishyCard
                interactive
                padding="sm"
                className="flex flex-col items-center gap-1.5 bg-surface-raised/30"
                onClick={() => onOpen('rucking')}
            >
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-warning/10">
                    <svg className="w-4 h-4 text-warning" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
                        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                        <path d="M12 11v6M9 14h6" />
                    </svg>
                </div>
                <CardTitle className="text-[12px]">Rucking</CardTitle>
                <MutedText className="text-center text-[10px]">Carga</MutedText>
            </SquishyCard>

        </div>
    </SquishyCard>
);

export default ActivityBentoMenu;
