import React, { useMemo } from 'react';
import { LoggedMeal, MacroNutrients } from '../../types';
import { vibrate } from '../../utils/helpers';
import { ChartBarIcon, SparklesIcon } from '../icons';

export const WeeklySummaryChart: React.FC<{ loggedMeals: LoggedMeal[], dailyGoals: MacroNutrients }> = ({ loggedMeals, dailyGoals }) => {
    const averageMacros = useMemo(() => {
        const today = new Date();
        const macrosByDay: Record<string, MacroNutrients> = {};

        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(today.getDate() - i);
            const dateString = date.toISOString().split('T')[0];
            macrosByDay[dateString] = { kcal: 0, protein: 0, carbs: 0, fat: 0 };
        }

        loggedMeals.forEach(meal => {
            const mealDate = new Date(meal.timestamp);
            const dateString = mealDate.toISOString().split('T')[0];
            if (macrosByDay[dateString]) {
                macrosByDay[dateString].kcal += meal.macros.kcal;
                macrosByDay[dateString].protein += meal.macros.protein;
                macrosByDay[dateString].carbs += meal.macros.carbs;
                macrosByDay[dateString].fat += meal.macros.fat;
            }
        });

        const totalMacros = Object.values(macrosByDay).reduce((acc, dayMacros) => {
            acc.kcal += dayMacros.kcal;
            acc.protein += dayMacros.protein;
            acc.carbs += dayMacros.carbs;
            acc.fat += dayMacros.fat;
            return acc;
        }, { kcal: 0, protein: 0, carbs: 0, fat: 0 });
        
        const numDays = 7;

        return {
            kcal: numDays > 0 ? totalMacros.kcal / numDays : 0,
            protein: numDays > 0 ? totalMacros.protein / numDays : 0,
            carbs: numDays > 0 ? totalMacros.carbs / numDays : 0,
            fat: numDays > 0 ? totalMacros.fat / numDays : 0,
        };
    }, [loggedMeals]);

    const chartItems = [
        { key: 'kcal', label: 'Kcal', colorClass: 'bg-brand-accent', value: averageMacros.kcal, goal: dailyGoals.kcal, unit: '' },
        { key: 'protein', label: 'Prot.', colorClass: 'bg-brand-protein', value: averageMacros.protein, goal: dailyGoals.protein, unit: 'g' },
        { key: 'carbs', label: 'Carbs', colorClass: 'bg-brand-carbs', value: averageMacros.carbs, goal: dailyGoals.carbs, unit: 'g' },
        { key: 'fat', label: 'Grasa', colorClass: 'bg-brand-fat', value: averageMacros.fat, goal: dailyGoals.fat, unit: 'g' },
    ];

    return (
        <section className="bg-surface-bg p-6 rounded-xl relative overflow-hidden border border-surface-border shadow-sm group hover:border-surface-border/80 hover:shadow-md transition-all duration-500">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

            <div className="mb-8 flex items-start justify-between relative z-10">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <ChartBarIcon className="w-4 h-4 text-brand-accent group-hover:scale-110 transition-transform duration-300" />
                        <h2 className="text-xs font-bold text-text-primary uppercase tracking-widest">Promedio Semanal</h2>
                    </div>
                    <p className="text-[9px] text-text-secondary font-bold mt-1 opacity-50 uppercase tracking-widest pl-6">ÚLTIMOS 7 DÍAS</p>
                </div>
            </div>
            
            <div className="relative pt-6 pb-2">
                <div className="absolute left-0 right-0 top-[calc(50%+0.5rem)] border-t border-dashed border-surface-border z-0">
                    <span className="absolute -top-2.5 right-0 text-[8px] font-bold text-text-secondary/60 bg-surface-bg px-2 py-0.5 rounded shadow-sm border border-surface-border uppercase tracking-widest">META</span>
                </div>
                
                <div className="grid grid-cols-4 gap-4 h-36 items-end relative z-10">
                    {chartItems.map(item => {
                        const percentage = item.goal > 0 ? Math.min((item.value / item.goal) * 100, 150) : 0; 
                        const barHeight = Math.min(percentage, 100);
                        const overflowHeight = Math.max(0, percentage - 100);

                        return (
                            <div 
                                key={item.key} 
                                className="flex flex-col h-full items-center justify-end group/bar cursor-pointer"
                                onClick={() => vibrate(5)}
                            >
                                {/* Animated Tooltip with actual values */}
                                <div className="absolute top-0 flex flex-col items-center justify-center opacity-0 group-hover/bar:opacity-100 group-hover/bar:-translate-y-3 group-active/bar:scale-95 transition-all duration-300 pointer-events-none z-20">
                                    <span className="bg-surface-hover border border-surface-border/80 text-[10px] font-bold text-text-primary px-2.5 py-1 rounded-lg shadow-xl shadow-black/50 font-mono flex items-baseline gap-1">
                                       {item.value.toFixed(0)} <span className="opacity-50 text-[8px]">{item.unit || 'kcal'}</span>
                                    </span>
                                </div>
                                
                                <div className="w-full max-w-[24px] h-full relative flex items-end">
                                    {/* Track */}
                                    <div className="absolute inset-0 bg-surface-hover rounded-t-lg group-hover/bar:bg-surface-border transition-colors duration-300"></div>
                                    
                                    {/* Main Bar with spring physics equivalent transitions */}
                                    <div 
                                        className={`w-full rounded-t-lg transition-all duration-[1200ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] ${item.colorClass} group-hover/bar:brightness-110 group-active/bar:scale-y-[0.97] origin-bottom shadow-[inset_0_2px_4px_rgba(255,255,255,0.2)] hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]`} 
                                        style={{ height: `${barHeight}%` }}
                                    ></div>
                                    
                                    {/* Overflow Bar if exceeds goal */}
                                    {overflowHeight > 0 && (
                                        <div 
                                            className={`absolute bottom-[100%] left-0 right-0 bg-danger/90 rounded-t-lg transition-all duration-[1200ms] delay-100 ease-[cubic-bezier(0.34,1.56,0.64,1)] shadow-[0_-2px_6px_rgba(239,68,68,0.4)] group-hover/bar:brightness-110 group-active/bar:scale-y-[0.97] origin-bottom`} 
                                            style={{ height: `${overflowHeight}%` }}
                                        ></div>
                                    )}
                                </div>
                                <p className="text-[9px] font-bold text-text-secondary mt-3 uppercase tracking-widest group-hover/bar:text-text-primary transition-colors duration-300">{item.label}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-surface-border flex items-start gap-2.5">
                <SparklesIcon className="w-3.5 h-3.5 text-brand-accent opacity-60 flex-shrink-0 mt-0.5" />
                <p className="text-[9px] font-medium text-text-secondary leading-relaxed opacity-70">
                    Las barras muestran tu <strong className="text-text-primary">promedio diario real</strong> basado en todo lo registrado en los últimos 7 días. Toca las barras para ver los valores exactos.
                </p>
            </div>
        </section>
    );
};
