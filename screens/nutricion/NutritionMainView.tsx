import React, { useContext, useMemo, useState } from 'react';
import { LoggedMeal } from '../../types';
import { AppContext } from '../../contexts';
import Button from '../../components/Button';
import Tag from '../../components/Tag';
import EmptyState from '../../components/feedback/EmptyState';
import PageHeader from '../../components/layout/PageHeader';
import PageSection from '../../components/layout/PageSection';
import SegmentedControl, { type SegmentedControlItem } from '../../components/layout/SegmentedControl';
import { CalendarIcon, ChartBarIcon, ChevronRightIcon, PlateIcon, PlusIcon, SparklesIcon } from '../../components/icons';
import { vibrate } from '../../utils/helpers';
import ConfirmationDialog from '../../components/dialogs/ConfirmationDialog';
import MealEditorModal from '../../components/dialogs/MealEditorModal';
import * as actions from '../../actions';

import NutritionDayNavigator from '../../components/nutricion/NutritionDayNavigator';
import { NutritionSummary } from '../../components/nutricion/NutritionSummary';
import { MealLog } from '../../components/nutricion/MealLog';
import { WeeklySummaryChart } from '../../components/nutricion/WeeklySummaryChart';

const areOnSameDay = (date1: Date, date2: Date) =>
  date1.getFullYear() === date2.getFullYear() &&
  date1.getMonth() === date2.getMonth() &&
  date1.getDate() === date2.getDate();

interface NutritionMainViewProps {
  onGoToAddFood: () => void;
}

type DashboardView = 'overview' | 'log' | 'week';

export const NutritionMainView: React.FC<NutritionMainViewProps> = ({ onGoToAddFood }) => {
  const { state, dispatch } = useContext(AppContext)!;
  const { nutrition, profile } = state;
  const [expandedMealId, setExpandedMealId] = useState<string | null>(null);
  const [displayedDate, setDisplayedDate] = useState(new Date());
  const [mealToDelete, setMealToDelete] = useState<LoggedMeal | null>(null);
  const [mealToEdit, setMealToEdit] = useState<LoggedMeal | null>(null);
  const [dashboardView, setDashboardView] = useState<DashboardView>('overview');

  const dailyGoals = profile.dailyGoals;

  const isToday = (someDate: Date) => {
    const today = new Date();
    return (
      someDate.getDate() === today.getDate() &&
      someDate.getMonth() === today.getMonth() &&
      someDate.getFullYear() === today.getFullYear()
    );
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
    if (isToday(date)) return 'HOY';
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (areOnSameDay(date, yesterday)) return 'AYER';
    return date.toLocaleString('es-ES', { day: 'numeric', month: 'long' }).toUpperCase();
  };

  const fullDateLabel = displayedDate.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const { mealsForDay, macrosForDay } = useMemo(() => {
    const meals =
      nutrition.loggedMeals.filter((meal) => areOnSameDay(new Date(meal.timestamp), displayedDate)) ?? [];

    const macros = meals.reduce(
      (acc, meal) => {
        acc.kcal += meal.macros.kcal;
        acc.protein += meal.macros.protein;
        acc.carbs += meal.macros.carbs;
        acc.fat += meal.macros.fat;
        return acc;
      },
      { kcal: 0, protein: 0, carbs: 0, fat: 0 }
    );

    return {
      mealsForDay: meals.sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      ),
      macrosForDay: macros,
    };
  }, [nutrition.loggedMeals, displayedDate]);

  const handleToggleExpand = (mealId: string) => {
    setExpandedMealId((prevId) => (prevId === mealId ? null : mealId));
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
    if (updatedMeal.foods.length === 0) {
      dispatch(actions.deleteLoggedMeal(updatedMeal.id));
    } else {
      dispatch(actions.updateLoggedMeal(updatedMeal));
    }
    setMealToEdit(null);
  };

  const tabs: SegmentedControlItem<DashboardView>[] = [
    { id: 'overview', label: 'Resumen', icon: SparklesIcon },
    { id: 'log', label: 'Bitácora', icon: PlateIcon, badge: mealsForDay.length },
    { id: 'week', label: 'Semana', icon: ChartBarIcon },
  ];

  const emptyAction = isToday(displayedDate) ? (
    <Button onClick={() => { vibrate(5); onGoToAddFood(); }} variant="high-contrast" size="large" icon={PlusIcon}>
      Registrar comida
    </Button>
  ) : (
    <Button onClick={() => setDisplayedDate(new Date())} variant="secondary" size="large">
      Volver a hoy
    </Button>
  );

  return (
    <div>
      {mealToEdit ? (
        <MealEditorModal meal={mealToEdit} onSave={handleUpdateMeal} onClose={() => setMealToEdit(null)} />
      ) : null}

      {mealToDelete ? (
        <ConfirmationDialog
          title="Eliminar Comida"
          message="¿Estás seguro de que quieres eliminar este registro de comida?"
          onConfirm={confirmDelete}
          onCancel={() => setMealToDelete(null)}
          confirmText="Eliminar"
        />
      ) : null}

      <div className="w-full pb-32">
        <PageHeader
          size="wide"
          eyebrow={
            <Tag variant="overlay" tone="accent" size="sm" icon={SparklesIcon}>
              Nutrition desk
            </Tag>
          }
          title="Nutrición"
          subtitle={
            isToday(displayedDate)
              ? 'Panel editorial del día para controlar energía, bloques de comida y ritmo semanal.'
              : `Archivo nutricional de ${fullDateLabel}.`
          }
          actions={
            <div className="flex items-center gap-2">
              {!isToday(displayedDate) ? (
                <Button variant="secondary" size="small" onClick={() => setDisplayedDate(new Date())}>
                  Hoy
                </Button>
              ) : null}
              {isToday(displayedDate) ? (
                <Button
                  variant="high-contrast"
                  size="small"
                  onClick={() => { vibrate(5); onGoToAddFood(); }}
                  icon={PlusIcon}
                >
                  Añadir comida
                </Button>
              ) : null}
            </div>
          }
        />

        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 sm:px-6">
          <NutritionDayNavigator
            label={formatDateHeader(displayedDate)}
            helperText={fullDateLabel}
            canGoForward={!isToday(displayedDate)}
            mealsCount={mealsForDay.length}
            isToday={isToday(displayedDate)}
            onPrevious={() => { vibrate(5); handlePreviousDay(); }}
            onNext={() => { vibrate(5); handleNextDay(); }}
            onGoToday={() => setDisplayedDate(new Date())}
          />

          <PageSection surface="glass" bodyClassName="p-2.5">
            <SegmentedControl
              items={tabs}
              value={dashboardView}
              onChange={(nextView) => setDashboardView(nextView as DashboardView)}
            />
          </PageSection>

          {dashboardView === 'overview' ? (
            <>
              <PageSection
                eyebrow="Resumen diario"
                title="Fuel ledger"
                subtitle="Lectura rápida del presupuesto energético, cobertura de proteína y distribución del día."
              >
                <NutritionSummary
                  consumed={macrosForDay}
                  goals={dailyGoals}
                  mealsCount={mealsForDay.length}
                  dateLabel={formatDateHeader(displayedDate)}
                />
              </PageSection>

              <PageSection
                eyebrow="Bitácora"
                title="Timeline del día"
                subtitle="Los bloques de comida más recientes, con detalle de ingredientes y macros por registro."
                actions={
                  <Button variant="tertiary" size="small" onClick={() => setDashboardView('log')}>
                    Ver completa
                  </Button>
                }
              >
                <MealLog
                  mealsForDay={mealsForDay}
                  expandedMealId={expandedMealId}
                  onToggleExpand={handleToggleExpand}
                  onEditClick={handleEditClick}
                  onDeleteClick={handleDeleteClick}
                  emptyAction={emptyAction}
                  previewCount={2}
                />
              </PageSection>

              <PageSection
                eyebrow="Ritmo semanal"
                title="Cadencia de la semana"
                subtitle="Promedio y consistencia para entender si el día actual sigue el patrón correcto."
                actions={
                  <Button variant="tertiary" size="small" onClick={() => setDashboardView('week')}>
                    Abrir semana
                  </Button>
                }
              >
                <WeeklySummaryChart loggedMeals={nutrition.loggedMeals} dailyGoals={dailyGoals} compact={true} />
              </PageSection>
            </>
          ) : null}

          {dashboardView === 'log' ? (
            <PageSection
              eyebrow="Bitácora"
              title="Comidas registradas"
              subtitle="Timeline completo del día con detalle editable de cada bloque de comida."
            >
              <MealLog
                mealsForDay={mealsForDay}
                expandedMealId={expandedMealId}
                onToggleExpand={handleToggleExpand}
                onEditClick={handleEditClick}
                onDeleteClick={handleDeleteClick}
                emptyAction={emptyAction}
              />
            </PageSection>
          ) : null}

          {dashboardView === 'week' ? (
            <PageSection
              eyebrow="Panorama semanal"
              title="Ritmo nutricional"
              subtitle="Comparativo de siete días para leer consistencia, cobertura de proteína y volumen energético."
            >
              <WeeklySummaryChart loggedMeals={nutrition.loggedMeals} dailyGoals={dailyGoals} />
            </PageSection>
          ) : null}

          {dashboardView === 'week' && mealsForDay.length === 0 && !isToday(displayedDate) ? (
            <PageSection
              eyebrow="Dato"
              title="Sin registros en este día"
              subtitle="La semana sí puede seguir siendo útil aunque este día esté vacío."
            >
              <EmptyState
                icon={<CalendarIcon className="h-7 w-7" />}
                title="No hay comidas archivadas para esta fecha"
                description="Puedes volver al día actual o mantenerte en la lectura semanal para revisar consistencia y promedio."
                action={emptyAction}
              />
            </PageSection>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default NutritionMainView;
