import React from 'react';
import PremiumButton from './PremiumButton';
import PremiumChip from './PremiumChip';
import SquishyCard from './SquishyCard';
import { BodyText, EyebrowText, ModalTitle, MutedText } from './Typography';

interface RoutineCardPremiumProps {
  title: string;
  eyebrow: string;
  description: string;
  ctaLabel: string;
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
  meta,
  chips = [],
  className = '',
  onCtaClick,
}) => {
  return (
    <SquishyCard padding="lg" className={['flex flex-col gap-5', className].filter(Boolean).join(' ')}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-3">
          <EyebrowText>{eyebrow}</EyebrowText>
          <ModalTitle className="text-2xl">{title}</ModalTitle>
        </div>
        {meta ? <MutedText>{meta}</MutedText> : null}
      </div>

      <BodyText>{description}</BodyText>

      {chips.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <PremiumChip key={chip} tone="accent">
              {chip}
            </PremiumChip>
          ))}
        </div>
      ) : null}

      <div className="w-full sm:w-48">
        <PremiumButton variant="ghost" size="md" onClick={onCtaClick}>
          {ctaLabel}
        </PremiumButton>
      </div>
    </SquishyCard>
  );
};

export default RoutineCardPremium;
