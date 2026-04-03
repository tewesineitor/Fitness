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
 * Full-width (Span 12) Bento menu. 2-column grid:
 *   Row 1: [Carrera] [Senderismo]
 *   Row 2: [Rucking ——— col-span-2 ———]
 *
 * Usa los SVG oficiales del UI Kit de DesignSystemDevScreen.
 */
const ActivityBentoMenu: React.FC<ActivityBentoMenuProps> = ({ onOpen, className }) => (
    <SquishyCard padding="sm" className={className}>
        <EyebrowText className="block mb-4">Actividad Libre</EyebrowText>
        <div className="grid grid-cols-2 gap-4">
            
            {/* Carrera */}
            <SquishyCard 
                interactive 
                padding="md" 
                className="flex flex-col items-center gap-3 bg-zinc-800/20"
                onClick={() => onOpen('run')}
            >
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-emerald-400/10 mb-1">
                    <svg className="w-7 h-7 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <circle cx="12" cy="5" r="1.5" />
                        <path d="M8 17l1.5-5 2.5 2 2.5-4L16 17" />
                        <path d="M7 12l1-3 4 1 3-3" />
                    </svg>
                </div>
                <CardTitle className="text-[14px]">Carrera</CardTitle>
                <MutedText className="text-center text-[11px]">Ritmo y km</MutedText>
            </SquishyCard>

            {/* Senderismo */}
            <SquishyCard 
                interactive 
                padding="md" 
                className="flex flex-col items-center gap-3 bg-zinc-800/20"
                onClick={() => onOpen('hike')}
            >
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-cyan-400/10 mb-1">
                    <svg className="w-7 h-7 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M3 20l4-8 4 4 4-10 4 14" />
                        <path d="M3 20h18" />
                    </svg>
                </div>
                <CardTitle className="text-[14px]">Senderismo</CardTitle>
                <MutedText className="text-center text-[11px]">Ruta y elevación</MutedText>
            </SquishyCard>

            {/* Rucking (col-span-2) */}
            <SquishyCard
                interactive
                padding="md"
                className="flex flex-col items-center gap-3 col-span-2 bg-zinc-800/20"
                onClick={() => onOpen('rucking')}
            >
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-amber-400/10 mb-1">
                    <svg className="w-7 h-7 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
                        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                        <path d="M12 11v6M9 14h6" />
                    </svg>
                </div>
                <CardTitle className="text-[14px]">Rucking</CardTitle>
                <MutedText className="text-center text-[11px]">Carga, ritmo y elevación</MutedText>
            </SquishyCard>

        </div>
    </SquishyCard>
);

export default ActivityBentoMenu;
