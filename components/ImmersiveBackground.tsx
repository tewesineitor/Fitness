import React from 'react';
import { Exercise } from '../types';

interface ImmersiveBackgroundProps {
  exercise?: Exercise;
}

const ImmersiveBackground: React.FC<ImmersiveBackgroundProps> = ({ exercise }) => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
      {exercise && exercise.gifUrl ? (
        <img
          src={exercise.gifUrl}
          alt=""
          className="w-full h-full object-cover scale-150 blur-3xl opacity-30 transition-opacity duration-1000"
          key={exercise.id} // Force re-render on exercise change
        />
      ) : (
        <div className="w-full h-full bg-black opacity-20"></div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-start)] via-[var(--color-bg-start)]/80 to-transparent"></div>
    </div>
  );
};

export default ImmersiveBackground;
