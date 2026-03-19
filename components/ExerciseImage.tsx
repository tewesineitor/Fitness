import React, { useState, useEffect } from 'react';
import { Exercise } from '../types';
import { StrengthIcon } from './icons';

interface ExerciseImageProps {
  exercise: Exercise | null | undefined;
  className?: string;
  placeholderIcon?: React.FC<{ className?: string }>;
}

const ExerciseImage: React.FC<ExerciseImageProps> = ({ exercise, className, placeholderIcon: PlaceholderIcon = StrengthIcon }) => {
    const [hasError, setHasError] = useState(false);

    // Reset the error state if the image URL changes.
    useEffect(() => {
        setHasError(false);
    }, [exercise?.gifUrl]);

    const placeholder = (
        <div className={`w-full h-full bg-surface-bg flex items-center justify-center ${className}`}>
            <PlaceholderIcon className="w-1/2 h-1/2 text-text-secondary/20" />
        </div>
    );

    if (!exercise?.gifUrl || hasError) {
        return placeholder;
    }

    return (
        <img
            src={exercise.gifUrl}
            alt={exercise.name}
            className={className}
            onError={() => setHasError(true)}
            key={exercise.gifUrl} // Force re-render if the URL changes
        />
    );
};

export default ExerciseImage;