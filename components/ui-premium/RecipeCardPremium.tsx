import React from 'react';
import SquishyCard from './SquishyCard';
import PremiumChip from './PremiumChip';
import { BodyText, CardTitle, EyebrowText, MutedText } from './Typography';

interface RecipeMacro {
  label: string;
  value: string;
}

interface RecipeCardPremiumProps {
  title: string;
  calories: string;
  description: string;
  macros: RecipeMacro[];
  servings?: string;
  media?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const RecipeCardPremium: React.FC<RecipeCardPremiumProps> = ({
  title,
  calories,
  description,
  macros,
  servings,
  media,
  className = '',
  onClick,
}) => {
  return (
    <SquishyCard
      padding="md"
      interactive={Boolean(onClick)}
      onClick={onClick}
      className={['flex flex-col gap-4', className].filter(Boolean).join(' ')}
    >
      <div className="overflow-hidden rounded-3xl border border-zinc-800/60 bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-950">
        <div className="aspect-video w-full">
          {media ?? (
            <div className="flex h-full w-full items-end justify-between p-5">
              <div className="flex flex-col gap-2">
                <EyebrowText>Recipe Cover</EyebrowText>
                <MutedText>Biblioteca premium</MutedText>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <EyebrowText>{calories}</EyebrowText>
          <CardTitle>{title}</CardTitle>
        </div>
        {servings ? <MutedText>{servings}</MutedText> : null}
      </div>

      <BodyText>{description}</BodyText>

      <div className="flex flex-wrap gap-2">
        {macros.map((macro) => (
          <PremiumChip key={`${macro.label}-${macro.value}`}>
            {macro.label}: {macro.value}
          </PremiumChip>
        ))}
      </div>
    </SquishyCard>
  );
};

export default RecipeCardPremium;
