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
      <div className="w-full aspect-video rounded-[2rem] overflow-hidden relative border border-zinc-800/60 bg-zinc-900">
        {media ?? (
          <>
            <img
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=60"
              alt="Receta"
              className="w-full h-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent" />
            <div className="absolute bottom-0 left-0 p-5 flex flex-col gap-1">
              <EyebrowText>Recipe Cover</EyebrowText>
              <MutedText>Biblioteca premium</MutedText>
            </div>
          </>
        )}
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
