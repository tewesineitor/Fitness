import React, { useMemo } from 'react';
import { LoggedMeal, MacroNutrients } from '../../types';
import Card from '../Card';
import Tag from '../Tag';
import { ChartBarIcon, FireIcon, SparklesIcon } from '../icons';
import NutritionStatCard from './NutritionStatCard';

interface WeeklySummaryChartProps {
  loggedMeals: LoggedMeal[];
  dailyGoals: MacroNutrients;
  compact?: boolean;
}

const getDayKey = (date: Date) => date.toISOString().split('T')[0];

const WeeklySummaryChart: React.FC<WeeklySummaryChartProps> = ({
  loggedMeals,
  dailyGoals,
  compact = false,
}) => {
  const weekData = useMemo(() => {
    const today = new Date();
    const days = Array.from({ length: 7 }).map((_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - index));
      return {
        date,
        key: getDayKey(date),
        label: date.toLocaleDateString('es-ES', { weekday: 'short' }).replace('.', '').toUpperCase(),
        dayNumber: date.getDate(),
        meals: 0,
        macros: { kcal: 0, protein: 0, carbs: 0, fat: 0 } as MacroNutrients,
      };
    });

    const dayMap = new Map(days.map((day) => [day.key, day]));

    loggedMeals.forEach((meal) => {
      const date = new Date(meal.timestamp);
      const key = getDayKey(date);
      const targetDay = dayMap.get(key);

      if (!targetDay) return;

      targetDay.meals += 1;
      targetDay.macros.kcal += meal.macros.kcal;
      targetDay.macros.protein += meal.macros.protein;
      targetDay.macros.carbs += meal.macros.carbs;
      targetDay.macros.fat += meal.macros.fat;
    });

    const totals = days.reduce(
      (acc, day) => {
        acc.kcal += day.macros.kcal;
        acc.protein += day.macros.protein;
        acc.carbs += day.macros.carbs;
        acc.fat += day.macros.fat;
        acc.meals += day.meals;
        return acc;
      },
      { kcal: 0, protein: 0, carbs: 0, fat: 0, meals: 0 }
    );

    const bestProteinDay = [...days].sort((a, b) => b.macros.protein - a.macros.protein)[0];
    const activeDays = days.filter((day) => day.meals > 0).length;

    return {
      days,
      averages: {
        kcal: totals.kcal / 7,
        protein: totals.protein / 7,
        carbs: totals.carbs / 7,
        fat: totals.fat / 7,
        meals: totals.meals / 7,
      },
      bestProteinDay,
      activeDays,
    };
  }, [loggedMeals]);

  const chartHeight = compact ? 8.5 : 11.5;

  return (
    <div className="space-y-4">
      <Card variant="glass" className="overflow-hidden p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ChartBarIcon className="h-4 w-4 text-brand-accent" />
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-text-secondary">Cadencia semanal</p>
            </div>
            <h3 className="text-xl font-black tracking-[-0.03em] text-text-primary">Últimos siete días</h3>
            <p className="text-sm leading-6 text-text-secondary">
              El panel compara la carga real diaria con el objetivo calórico y deja ver la consistencia del ritmo.
            </p>
          </div>

          <Tag variant="overlay" tone="accent" size="sm">
            {weekData.activeDays}/7 activos
          </Tag>
        </div>

        <div className="mt-6 grid grid-cols-7 gap-3 sm:gap-4">
          {weekData.days.map((day) => {
            const height = dailyGoals.kcal > 0 ? Math.min((day.macros.kcal / dailyGoals.kcal) * 100, 100) : 0;
            const isToday = getDayKey(day.date) === getDayKey(new Date());

            return (
              <div key={day.key} className="flex flex-col items-center gap-3">
                <div className="flex min-h-[2.75rem] items-end justify-center">
                  <div className="text-center">
                    <div className="text-sm font-black tracking-[-0.03em] text-text-primary">
                      {day.macros.kcal > 0 ? day.macros.kcal.toFixed(0) : '—'}
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-text-secondary">kcal</div>
                  </div>
                </div>

                <div
                  className="relative flex w-full max-w-[2.75rem] items-end overflow-hidden rounded-[1.4rem] border border-surface-border bg-surface-hover/70 p-1"
                  style={{ height: `${chartHeight}rem` }}
                >
                  <div className="absolute left-0 right-0 top-[18%] border-t border-dashed border-surface-border/80" />
                  <div
                    className={`w-full rounded-[1rem] transition-all duration-700 ${height >= 100 ? 'bg-danger' : 'bg-brand-accent'}`}
                    style={{ height: `${height}%` }}
                  />
                </div>

                <div className="text-center">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">{day.label}</div>
                  <div className="mt-1 flex justify-center">
                    <Tag variant="status" tone={isToday ? 'accent' : 'neutral'} size="sm">
                      {day.dayNumber}
                    </Tag>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {!compact ? (
          <div className="mt-6 flex items-start gap-3 border-t border-surface-border/80 pt-4">
            <SparklesIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-accent" />
            <p className="text-sm leading-6 text-text-secondary">
              Una barra al tope indica que ese día se acercó o superó el objetivo calórico. Los días bajos dejan ver huecos de registro o ingesta menor.
            </p>
          </div>
        ) : null}
      </Card>

      <div className={`grid gap-3 ${compact ? 'sm:grid-cols-2 xl:grid-cols-4' : 'sm:grid-cols-2 xl:grid-cols-4'}`}>
        <NutritionStatCard
          eyebrow="Promedio kcal"
          value={weekData.averages.kcal.toFixed(0)}
          detail={`Objetivo diario ${dailyGoals.kcal.toFixed(0)} kcal`}
          icon={FireIcon}
          tone="accent"
          badge="7 días"
        />
        <NutritionStatCard
          eyebrow="Promedio proteína"
          value={`${weekData.averages.protein.toFixed(0)}g`}
          detail={`Objetivo diario ${dailyGoals.protein.toFixed(0)}g`}
          tone="protein"
          badge={weekData.averages.protein >= dailyGoals.protein ? 'Meta' : 'Gap'}
        />
        <NutritionStatCard
          eyebrow="Promedio comidas"
          value={weekData.averages.meals.toFixed(1)}
          detail={`${weekData.activeDays} día${weekData.activeDays === 1 ? '' : 's'} con registros`}
          tone="neutral"
          badge="Cadencia"
        />
        <NutritionStatCard
          eyebrow="Pico proteína"
          value={weekData.bestProteinDay?.label || '—'}
          detail={weekData.bestProteinDay ? `${weekData.bestProteinDay.macros.protein.toFixed(0)}g de proteína` : 'Sin datos suficientes'}
          tone="success"
          badge="Mejor día"
        />
      </div>
    </div>
  );
};

export { WeeklySummaryChart };
export default WeeklySummaryChart;
