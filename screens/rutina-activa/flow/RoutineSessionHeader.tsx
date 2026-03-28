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
        <header className="sticky top-0 z-[200] w-full bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800/50">
            <div className="max-w-4xl mx-auto w-full flex items-center justify-between px-4 sm:px-6 py-4">
                <Tag variant="status" tone={isResting ? 'accent' : 'success'} size="md" count={formatClock(globalTime)}>
                    {isResting ? 'Descanso' : 'Activo'}
                </Tag>

                <div className="flex items-center gap-3">
                    <IconButton
                        variant="secondary"
                        size="small"
                        onClick={onSkip}
                        icon={ChevronRightIcon}
                        label="Saltar paso actual"
                        className="bg-zinc-800/80 border border-zinc-700/50"
                    />
                    <IconButton
                        variant="destructive"
                        size="small"
                        onClick={onExit}
                        icon={XIcon}
                        label="Salir de la rutina"
                        className="bg-red-500/15 border border-red-500/20"
                    />
                </div>
            </div>
        </header>
    );
};

export default RoutineSessionHeader;
