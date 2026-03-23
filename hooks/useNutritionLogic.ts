
import { useCallback, useContext, useMemo, useState } from 'react';
import { AppContext } from '../contexts';
import * as actions from '../actions';
import type { LoggedMeal } from '../types';

const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth()    === d2.getMonth()    &&
    d1.getDate()     === d2.getDate();

export const useNutritionLogic = (onGoToAddFood: () => void) => {
    const { state, dispatch } = useContext(AppContext)!;
    const { nutrition, profile } = state;
    const dailyGoals = profile.dailyGoals;

    const [displayedDate, setDisplayedDate] = useState<Date>(() => new Date());
    const [expandedMealId, setExpandedMealId] = useState<string | null>(null);
    const [mealToDelete,   setMealToDelete]   = useState<LoggedMeal | null>(null);
    const [mealToEdit,     setMealToEdit]     = useState<LoggedMeal | null>(null);

    const isToday = useMemo(() => isSameDay(displayedDate, new Date()), [displayedDate]);

    const dateLabel = useMemo(() => {
        if (isToday) return 'HOY';
        const ayer = new Date();
        ayer.setDate(ayer.getDate() - 1);
        if (isSameDay(displayedDate, ayer)) return 'AYER';
        return displayedDate
            .toLocaleString('es-ES', { day: 'numeric', month: 'long' })
            .toUpperCase();
    }, [displayedDate, isToday]);

    const fullDateLabel = useMemo(
        () => displayedDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }),
        [displayedDate],
    );

    const { mealsForDay, macrosForDay } = useMemo(() => {
        const meals = nutrition.loggedMeals
            .filter((m) => isSameDay(new Date(m.timestamp), displayedDate))
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

        const macros = meals.reduce(
            (acc, m) => ({
                kcal:    acc.kcal    + (m.macros.kcal    ?? 0),
                protein: acc.protein + (m.macros.protein ?? 0),
                carbs:   acc.carbs   + (m.macros.carbs   ?? 0),
                fat:     acc.fat     + (m.macros.fat     ?? 0),
            }),
            { kcal: 0, protein: 0, carbs: 0, fat: 0 },
        );
        return { mealsForDay: meals, macrosForDay: macros };
    }, [nutrition.loggedMeals, displayedDate]);

    // Macro percentages (clamped to 100)
    const kcalPct    = dailyGoals.kcal    > 0 ? Math.min((macrosForDay.kcal    / dailyGoals.kcal)    * 100, 100) : 0;
    const proteinPct = dailyGoals.protein > 0 ? Math.min((macrosForDay.protein / dailyGoals.protein) * 100, 100) : 0;
    const carbsPct   = dailyGoals.carbs   > 0 ? Math.min((macrosForDay.carbs   / dailyGoals.carbs)   * 100, 100) : 0;
    const fatPct     = dailyGoals.fat     > 0 ? Math.min((macrosForDay.fat     / dailyGoals.fat)     * 100, 100) : 0;
    const isKcalOver    = macrosForDay.kcal > dailyGoals.kcal;
    const kcalRemaining = Math.max(0, dailyGoals.kcal - macrosForDay.kcal);

    // ── Bolsa Compartida (dynamic C+G shared budget after protein) ──────────
    const carbFatBudgetKcal    = Math.max(0, dailyGoals.kcal - dailyGoals.protein * 4);
    const carbFatSpentKcal     = Math.round(macrosForDay.carbs * 4 + macrosForDay.fat * 9);
    const carbFatRemainingKcal = Math.max(0, carbFatBudgetKcal - carbFatSpentKcal);
    const carbFatBudgetPct     = carbFatBudgetKcal > 0
        ? Math.min((carbFatSpentKcal / carbFatBudgetKcal) * 100, 100)
        : 0;
    const carbFloorG = Math.round(carbFatRemainingKcal / 4);
    const fatFloorG  = Math.round(carbFatRemainingKcal / 9);

    // ── Handlers ────────────────────────────────────────────────────────────
    const onPreviousDay = useCallback(
        () => setDisplayedDate((d) => { const n = new Date(d); n.setDate(n.getDate() - 1); return n; }),
        [],
    );
    const onNextDay = useCallback(() => {
        if (!isToday) setDisplayedDate((d) => { const n = new Date(d); n.setDate(n.getDate() + 1); return n; });
    }, [isToday]);

    const onGoToday      = useCallback(() => setDisplayedDate(new Date()), []);
    const onToggleExpand = useCallback(
        (id: string) => setExpandedMealId((p) => (p === id ? null : id)),
        [],
    );

    const onRequestDelete = useCallback((meal: LoggedMeal) => setMealToDelete(meal), []);
    const onCancelDelete  = useCallback(() => setMealToDelete(null), []);
    const onConfirmDelete = useCallback(() => {
        if (mealToDelete) { dispatch(actions.deleteLoggedMeal(mealToDelete.id)); setMealToDelete(null); }
    }, [mealToDelete, dispatch]);

    const onRequestEdit = useCallback((meal: LoggedMeal) => setMealToEdit(meal), []);
    const onCancelEdit  = useCallback(() => setMealToEdit(null), []);
    const onSaveEdit    = useCallback((updated: LoggedMeal) => {
        if (updated.foods.length === 0) dispatch(actions.deleteLoggedMeal(updated.id));
        else dispatch(actions.updateLoggedMeal(updated));
        setMealToEdit(null);
    }, [dispatch]);

    return {
        // Date
        displayedDate, isToday, dateLabel, fullDateLabel,
        onPreviousDay, onNextDay, onGoToday,
        // Meals
        mealsForDay, expandedMealId, onToggleExpand,
        // CRUD
        mealToDelete, onRequestDelete, onConfirmDelete, onCancelDelete,
        mealToEdit,   onRequestEdit,   onSaveEdit,     onCancelEdit,
        // Macros
        macrosForDay, dailyGoals,
        kcalPct, proteinPct, carbsPct, fatPct,
        isKcalOver, kcalRemaining,
        // Bolsa Compartida
        carbFatBudgetKcal, carbFatSpentKcal, carbFatRemainingKcal,
        carbFatBudgetPct, carbFloorG, fatFloorG,
        // Actions
        onGoToAddFood,
    };
};
