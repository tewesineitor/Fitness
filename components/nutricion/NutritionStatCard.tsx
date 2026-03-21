import React from 'react';
import Card from '../Card';
import Tag from '../Tag';
import type { IconComponent } from '../../types';

interface NutritionStatCardProps {
  eyebrow: string;
  value: React.ReactNode;
  detail: React.ReactNode;
  icon?: IconComponent;
  tone?: 'neutral' | 'accent' | 'protein' | 'carbs' | 'success' | 'danger';
  badge?: React.ReactNode;
  className?: string;
}

const toneClassMap: Record<NonNullable<NutritionStatCardProps['tone']>, string> = {
  neutral: 'text-text-primary',
  accent: 'text-brand-accent',
  protein: 'text-brand-protein',
  carbs: 'text-brand-carbs',
  success: 'text-success',
  danger: 'text-danger',
};

const NutritionStatCard: React.FC<NutritionStatCardProps> = ({
  eyebrow,
  value,
  detail,
  icon: Icon,
  tone = 'neutral',
  badge,
  className = '',
}) => {
  return (
    <Card variant="inset" className={['p-4 sm:p-4.5', className].filter(Boolean).join(' ')}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1.5">
          <div className="flex items-center gap-2">
            {Icon ? <Icon className={`h-4 w-4 ${toneClassMap[tone]}`} /> : null}
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-text-secondary">{eyebrow}</p>
          </div>
          <div className={`text-2xl font-black tracking-[-0.04em] ${toneClassMap[tone]}`}>{value}</div>
          <p className="text-xs leading-5 text-text-secondary">{detail}</p>
        </div>

        {badge !== undefined ? (
          <Tag variant="status" tone={tone === 'neutral' ? 'accent' : tone} size="sm">
            {badge}
          </Tag>
        ) : null}
      </div>
    </Card>
  );
};

export default NutritionStatCard;
