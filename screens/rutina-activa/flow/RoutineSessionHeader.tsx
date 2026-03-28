import React from 'react';
import IconButton from '../../../components/IconButton';
import Tag from '../../../components/Tag';
import { ChevronRightIcon, XIcon } from '../../../components/icons';

interface RoutineSessionHeaderProps {
    globalTime: number;
    isResting: boolean;
    onSkip: () => void;
    onExit: () => void;
}

const formatClock = (seconds: number) => new Date(seconds * 1000).toISOString().substring(14, 19);

const RoutineSessionHeader: React.FC<RoutineSessionHeaderProps> = ({ globalTime, isResting, onSkip, onExit }) => {
    return (
        <header className="fixed top-0 left-0 right-0 z-[200] flex items-center justify-between px-6 pb-2 pt-6 max-w-4xl mx-auto pointer-events-auto">
            <Tag variant="status" tone={isResting ? 'accent' : 'success'} size="md" count={formatClock(globalTime)}>
                {isResting ? 'Descanso' : 'Activo'}
            </Tag>

            <div className="relative z-[200] flex items-center gap-3 pointer-events-auto">
                <IconButton
                    variant="secondary"
                    size="small"
                    onClick={() => { console.log('Header Button Clicked: Skip'); onSkip(); }}
                    icon={ChevronRightIcon}
                    label="Saltar paso actual"
                    className="bg-zinc-800/80 border border-zinc-700/50"
                />
                <IconButton
                    variant="destructive"
                    size="small"
                    onClick={() => { console.log('Header Button Clicked: Exit'); onExit(); }}
                    icon={XIcon}
                    label="Salir de la rutina"
                    className="bg-red-500/15 border border-red-500/20"
                />
            </div>
        </header>
    );
};

export default RoutineSessionHeader;
