import React from 'react';
import { StatLabel } from './Typography';

interface ImageUploadAreaProps {
  onPress?: () => void;
  className?: string;
}

const CameraIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

const ImageUploadArea: React.FC<ImageUploadAreaProps> = ({
  onPress,
  className = '',
}) => {
  return (
    <div
      onClick={onPress}
      className={[
        'border-2 border-dashed border-zinc-700/50 rounded-[2rem]',
        'bg-zinc-900/20 flex flex-col items-center justify-center p-8',
        'cursor-pointer hover:bg-zinc-800/50 hover:border-zinc-600',
        'transition-all duration-200 active:scale-[0.98] select-none',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <CameraIcon className="w-8 h-8 text-zinc-500 mb-3" />
      <StatLabel className="text-zinc-400">AÑADIR FOTO</StatLabel>
    </div>
  );
};

export default ImageUploadArea;
