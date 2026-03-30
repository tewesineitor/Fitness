import React from 'react';
import PremiumButton from './PremiumButton';
import PremiumChip from './PremiumChip';
import { BodyText, EyebrowText, ModalTitle } from './Typography';

interface RoutineCardPremiumProps {
  title: string;
  eyebrow: string;
  description: string;
  ctaLabel: string;
  src?: string;
  meta?: string;
  chips?: string[];
  className?: string;
  onCtaClick?: () => void;
}

const RoutineCardPremium: React.FC<RoutineCardPremiumProps> = ({
  title,
  eyebrow,
  description,
  ctaLabel,
  src,
  meta,
  chips = [],
  className = '',
  onCtaClick,
}) => {
  return (
    <div
      className={[
        'w-full max-w-[380px] mx-auto relative overflow-hidden rounded-[2rem] border border-zinc-800/50',
        'bg-zinc-900/80 backdrop-blur-xl shadow-2xl',
        className,
      ].filter(Boolean).join(' ')}
    >
      <div className="relative w-full aspect-video">
        {src ? (
          <img src={src} alt={title} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-950" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent" />

        <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 gap-4">
          <div className="flex flex-col gap-2">
            <EyebrowText>{eyebrow}{meta ? ` · ${meta}` : ''}</EyebrowText>
            <ModalTitle className="text-2xl">{title}</ModalTitle>
          </div>

          {chips.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {chips.map((chip) => (
                <PremiumChip key={chip} tone="accent">
                  {chip}
                </PremiumChip>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-3 p-6 pt-4">
        <BodyText>{description}</BodyText>
        <PremiumButton variant="primary" size="md" className="w-full mt-4" onClick={onCtaClick}>
          {ctaLabel}
        </PremiumButton>
      </div>
    </div>
  );
};

export default RoutineCardPremium;
