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
  violet: 'bg-violet-500/15 text-violet-400',
  cyan: 'bg-cyan-400/15 text-cyan-400',
  orange: 'bg-orange-500/15 text-orange-400',
  neutral: 'bg-zinc-800 text-zinc-400',
  accent: 'bg-emerald-400/10 text-emerald-300',
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
      <div className="w-full aspect-video rounded-[2rem] overflow-hidden relative border border-zinc-800/60 bg-zinc-900">
        {media ?? (
          <>
            <img
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=60"
              alt="Receta"
              className="w-full h-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent" />
          </>
        )}
        {badge ? (
          <div className="absolute top-4 left-4 z-20 bg-zinc-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
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
