import React from 'react';
import type { RoutineTaskType, IconComponent } from '../../../types';
import { StrengthIcon, YogaIcon, PostureIcon, CardioIcon, MeditationIcon, MountainIcon } from '../../../components/icons';

export const getRoutineTypeLabel = (type: string) => {
    const map: Record<string, string> = {
        strength: 'Fuerza',
        yoga: 'Yoga',
        posture: 'Postura',
        cardio: 'Cardio',
        meditation: 'Mental',
        cardioLibre: 'Cardio',
        senderismo: 'Senderismo',
    };
    return map[type] || type;
};

export const RoutineTypeIcon: React.FC<{ type: RoutineTaskType; className?: string }> = ({ type, className }) => {
    switch (type) {
        case 'strength':
            return <StrengthIcon className={className} />;
        case 'yoga':
            return <YogaIcon className={className} />;
        case 'posture':
            return <PostureIcon className={className} />;
        case 'cardio':
        case 'cardioLibre':
            return <CardioIcon className={className} />;
        case 'senderismo':
            return <MountainIcon className={className} />;
        case 'meditation':
            return <MeditationIcon className={className} />;
        default:
            return <StrengthIcon className={className} />;
    }
};

export const routineTypes: { value: RoutineTaskType; label: string; icon: IconComponent }[] = [
    { value: 'strength', label: 'Fuerza', icon: StrengthIcon },
    { value: 'cardio', label: 'Cardio', icon: CardioIcon },
    { value: 'yoga', label: 'Yoga', icon: YogaIcon },
    { value: 'meditation', label: 'Mental', icon: MeditationIcon },
];
