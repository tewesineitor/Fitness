
import React from 'react';
import { RoutineTask, RoutineTaskType } from '../../types';
import { 
    StrengthIcon, 
    CardioIcon, 
    YogaIcon, 
    MeditationIcon, 
    PostureIcon, 
    MountainIcon,
    TrashIcon 
} from '../icons';
import Tag from '../Tag';

interface RoutineCardProps {
    routine: RoutineTask;
    onClick: () => void;
    onDelete?: () => void;
}

const RoutineTypeIcon: React.FC<{ type: RoutineTaskType, className?: string }> = ({ type, className }) => {
    switch (type) {
        case 'strength': return <StrengthIcon className={className} />;
        case 'yoga': return <YogaIcon className={className} />;
        case 'posture': return <PostureIcon className={className} />;
        case 'cardio':
        case 'cardioLibre':
             return <CardioIcon className={className} />;
        case 'senderismo':
             return <MountainIcon className={className} />;
        case 'meditation': return <MeditationIcon className={className} />;
        default: return <StrengthIcon className={className} />;
    }
};

const RoutineCard: React.FC<RoutineCardProps> = ({ routine, onClick, onDelete }) => {
    const isStrength = routine.type === 'strength';
    const accentColor = isStrength ? 'text-brand-protein' : 'text-brand-accent';
    const borderColor = isStrength ? 'group-hover:border-brand-protein/30' : 'group-hover:border-brand-accent/30';

    return (
        <div 
            onClick={onClick}
            className={`
                relative group w-full p-4 rounded-2xl bg-surface-bg border border-surface-border 
                hover:bg-surface-hover ${borderColor} transition-all duration-300 cursor-pointer overflow-hidden shadow-sm hover:shadow-md active:scale-[0.98]
            `}
        >
            <div className="flex items-center gap-4 relative z-10">
                {/* Icon Box */}
                <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 
                    bg-surface-hover border border-surface-border shadow-inner transition-colors
                    ${accentColor}
                `}>
                    <RoutineTypeIcon type={routine.type} className="w-6 h-6" />
                </div>

                {/* Content */}
                <div className="flex-grow min-w-0">
                    <h3 className="font-black text-text-primary text-sm uppercase tracking-tight transition-colors truncate">
                        {routine.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5">
                        <Tag variant="status" tone={isStrength ? 'protein' : 'accent'} size="sm">
                            {routine.type === 'strength' ? 'FUERZA' : routine.type === 'cardio' ? 'CARDIO' : 'MOVILIDAD'}
                        </Tag>
                        <Tag variant="status" size="sm">
                            {routine.flow.length * 3} MIN
                        </Tag>
                    </div>
                </div>

                {/* Action */}
                <div className="flex-shrink-0 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-surface-bg flex items-center justify-center text-text-secondary group-hover:bg-surface-hover group-hover:text-text-primary transition-colors border border-surface-border">
                        <svg className="w-3.5 h-3.5 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                </div>
            </div>

            {/* Optional Delete Button */}
            {onDelete && (
                <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(); }} 
                    className="absolute top-3 right-3 p-2 bg-red-500/10 text-red-400 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-text-primary scale-90 group-hover:scale-100 hover:shadow-lg z-20"
                >
                    <TrashIcon className="w-3.5 h-3.5" />
                </button>
            )}

            {/* Hover Glow */}
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none ${isStrength ? 'bg-brand-protein' : 'bg-brand-accent'}`}></div>
        </div>
    );
};

export default RoutineCard;
