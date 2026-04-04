import React from 'react';
import SquishyCard from './SquishyCard';
import { BodyText, CardTitle, EyebrowText, MutedText, StatLabel } from './Typography';

type MacroTone = 'violet' | 'cyan' | 'orange' | 'neutral' | 'accent';

interface RecipeMacro {
  label: string;
  value: string;
  tone?: MacroTone;
}

interface RecipeCardPremiumProps {
  title: string;
  calories: string;
  description: string;
  macros: RecipeMacro[];
  servings?: string;
  badge?: string;
  media?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const macroToneClasses: Record<MacroTone, string> = {
  violet: 'bg-brand-protein/15 text-brand-protein',
  cyan: 'bg-brand-carbs/15 text-brand-carbs',
  orange: 'bg-brand-fat/15 text-brand-fat',
  neutral: 'bg-surface-raised text-text-muted',
  accent: 'bg-brand-accent/15 text-brand-accent',
};

const RecipeCardPremium: React.FC<RecipeCardPremiumProps> = ({
  title,
  calories,
  description,
  macros,
  servings,
  badge,
  media,
  className = '',
  onClick,
}) => {
  return (
    <SquishyCard
      padding="md"
      interactive={Boolean(onClick)}
      onClick={onClick}
      className={['w-full max-w-[380px] mx-auto flex flex-col gap-4', className].filter(Boolean).join(' ')}
    >
      <div className="w-full aspect-video rounded-[2rem] overflow-hidden relative border border-surface-border/50 bg-surface-bg">
        {media ?? (
          <>
            <img
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=60"
              alt="Receta"
              className="w-full h-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-base/80 to-transparent" />
          </>
        )}
        {badge ? (
          <div className="absolute top-4 left-4 z-20 bg-bg-base/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
            <EyebrowText>{badge}</EyebrowText>
          </div>
        ) : null}
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
          <span
            key={`${macro.label}-${macro.value}`}
            className={[
              'inline-flex items-center rounded-full px-3 py-1',
              macroToneClasses[macro.tone ?? 'neutral'],
            ].join(' ')}
          >
            <StatLabel>{macro.label}: {macro.value}</StatLabel>
          </span>
        ))}
      </div>
    </SquishyCard>
  );
};

export default RecipeCardPremium;
