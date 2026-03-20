import React, { useState, useMemo, useContext } from 'react';
import { LoggedMeal } from '../../types';
import { AppContext } from '../../contexts';
import Button from '../../components/Button';
import { ChevronRightIcon, PlusIcon } from '../../components/icons';
import { vibrate } from '../../utils/helpers';
import ConfirmationDialog from '../../components/dialogs/ConfirmationDialog';
import MealEditorModal from '../../components/dialogs/MealEditorModal';
import * as actions from '../../actions';

import { NutritionSummary } from '../../components/nutricion/NutritionSummary';
import { MealLog } from '../../components/nutricion/MealLog';
import { WeeklySummaryChart } from '../../components/nutricion/WeeklySummaryChart';

// --- HELPER FUNC ---
const areOnSameDay = (date1: Date, date2: Date) =>
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();

interface NutritionMainViewProps {
    onGoToAddFood: () => void;
}

export const NutritionMainView: React.FC<NutritionMainViewProps> = ({ onGoToAddFood }) => {
    const { state, dispatch } = useContext(AppContext)!;
    const { nutrition, profile } = state;
    const [expandedMealId, setExpandedMealId] = useState<string | null>(null);
    const [displayedDate, setDisplayedDate] = useState(new Date());
    const [mealToDelete, setMealToDelete] = useState<LoggedMeal | null>(null);
    const [mealToEdit, setMealToEdit] = useState<LoggedMeal | null>(null);

    const dailyGoals = profile.dailyGoals;

    const isToday = (someDate: Date) => {
        const today = new Date();
        return someDate.getDate() === today.getDate() &&
               someDate.getMonth() === today.getMonth() &&
               someDate.getFullYear() === today.getFullYear();
    };

    const handlePreviousDay = () => {
        const prevDay = new Date(displayedDate);
        prevDay.setDate(prevDay.getDate() - 1);
        setDisplayedDate(prevDay);
    };

    const handleNextDay = () => {
        if (!isToday(displayedDate)) {
            const nextDay = new Date(displayedDate);
            nextDay.setDate(nextDay.getDate() + 1);
            setDisplayedDate(nextDay);
        }
    };

    const formatDateHeader = (date: Date): string => {
        if (isToday(date)) return "HOY";
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (areOnSameDay(date, yesterday)) return "AYER";
        return date.toLocaleString('es-ES', { day: 'numeric', month: 'long' }).toUpperCase();
    };

    const { mealsForDay, macrosForDay } = useMemo(() => {
        const meals = nutrition.loggedMeals.filter(m => areOnSameDay(new Date(m.timestamp), displayedDate)) ?? [];
        const macros = meals.reduce((acc, meal) => {
            acc.kcal += meal.macros.kcal;
            acc.protein += meal.macros.protein;
            acc.carbs += meal.macros.carbs;
            acc.fat += meal.macros.fat;
            return acc;
        }, { kcal: 0, protein: 0, carbs: 0, fat: 0 });
        return { mealsForDay: meals.sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()), macrosForDay: macros };
    }, [nutrition.loggedMeals, displayedDate]);

    const handleToggleExpand = (mealId: string) => {
        setExpandedMealId(prevId => (prevId === mealId ? null : mealId));
    };

    const handleDeleteClick = (meal: LoggedMeal) => {
        setMealToDelete(meal);
    };

    const handleEditClick = (meal: LoggedMeal) => {
        setMealToEdit(meal);
    };

    const confirmDelete = () => {
        if (mealToDelete) {
            dispatch(actions.deleteLoggedMeal(mealToDelete.id));
            setMealToDelete(null);
        }
    };

    const handleUpdateMeal = (updatedMeal: LoggedMeal) => {
        // If the updated meal has no foods, we treat it as a delete
        if (updatedMeal.foods.length === 0) {
            dispatch(actions.deleteLoggedMeal(updatedMeal.id));
        } else {
            dispatch(actions.updateLoggedMeal(updatedMeal));
        }
        setMealToEdit(null);
    };

    return (
        <div>
            {mealToEdit && (
                <MealEditorModal 
                    meal={mealToEdit} 
                    onSave={handleUpdateMeal} 
                    onClose={() => setMealToEdit(null)} 
                />
            )}
            
            {mealToDelete && (
                <ConfirmationDialog
                    title="Eliminar Comida"
                    message="¿Estás seguro de que quieres eliminar este registro de comida?"
                    onConfirm={confirmDelete}
                    onCancel={() => setMealToDelete(null)}
                    confirmText="Eliminar"
                />
            )}

            <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 space-y-6 pb-32">
                <header className="animate-fade-in-up flex gap-3 pt-6">
                    <div className="flex-1 flex justify-between items-center bg-surface-bg p-1 rounded-xl border border-surface-border shadow-sm">
                        <Button variant="tertiary" onClick={() => { vibrate(5); handlePreviousDay(); }} icon={ChevronRightIcon} aria-label="Ver día anterior" className="!p-2.5 hover:bg-surface-hover rounded-lg [&_svg]:rotate-180 text-text-secondary hover:text-text-primary transition-colors" />
                        <h1 className="text-[11px] font-bold text-text-primary uppercase tracking-[0.2em]">{formatDateHeader(displayedDate)}</h1>
                        <Button variant="tertiary" onClick={() => { vibrate(5); handleNextDay(); }} disabled={isToday(displayedDate)} icon={ChevronRightIcon} aria-label="Ver día siguiente" className={`!p-2.5 rounded-lg transition-colors ${isToday(displayedDate) ? 'text-surface-border cursor-not-allowed' : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'}`} />
                    </div>
                    
                    {isToday(displayedDate) && (
                        <button
                            type="button"
                            onClick={() => { vibrate(5); onGoToAddFood(); }}
                            aria-label="Agregar comida"
                            className="bg-brand-accent text-white rounded-xl w-14 flex-shrink-0 flex items-center justify-center shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all border border-brand-accent"
                        >
                            <PlusIcon className="w-6 h-6" />
                        </button>
                    )}
                </header>

                {/* MAIN SUMMARY (New Advanced Version) */}
                <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                    <NutritionSummary consumed={macrosForDay} goals={dailyGoals} />
                </div>
                
                <MealLog 
                    mealsForDay={mealsForDay} 
                    expandedMealId={expandedMealId} 
                    onToggleExpand={handleToggleExpand} 
                    onEditClick={handleEditClick} 
                    onDeleteClick={handleDeleteClick} 
                />
                
                <section className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                    <WeeklySummaryChart loggedMeals={nutrition.loggedMeals} dailyGoals={dailyGoals} />
                </section>
            </div>
        </div>
    );
}

export default NutritionMainView;
