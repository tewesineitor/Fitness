# LOGIC_MANIFEST.md
> SSOT logico del producto.
> Audience: LLMs and developers maintaining state, hooks and feature controllers.
> Last updated: 2026-04-02

---

## 1. Headless Contract

### Objetivo

Extraer toda la logica de estado, derivacion y asincronia fuera del componente visual hacia un Custom Hook headless y aislado.

### Que debe salir del archivo visual

- `useState`
- `useEffect`
- `useMemo`
- `useCallback`
- parsing/formateo ligado al flujo
- seleccion de datos de contexto
- `dispatch`
- thunks
- side effects async
- apertura/cierre de modales
- control de timers
- view models derivados

### Resultado esperado

Cada pantalla debe terminar con un hook del tipo:

- `use<ScreenName>Controller`
- `use<FeatureName>Screen`
- `use<FeatureName>Flow`

El nombre exacto puede variar, pero el contrato no:

- el hook orquesta
- la pantalla declara

### Criterio de aceptacion del Golpe 1

- la pantalla puede renderizarse leyendo un solo objeto de estado/control

---

## 2. Status Legend

- `APPROVED`: cumple el contrato headless actual y puede considerarse referencia viva.
- `REFACTOR_REQUIRED`: aporta valor, pero mezcla concerns o tiene deuda de reactividad/ownership.
- `DEPRECATED`: no debe usarse para nueva logica y debe eliminarse o sustituirse.
- `INTERNAL`: helper aceptado, pero no es parte del contrato publico del UI kit.
- `PLANNED`: hook o controller faltante que debe crearse.

---

## 3. App Infra Hooks

### Approved

- `useSupabaseAuthSession` - `appAuth.ts`
- `useAppBootstrap` - `appBootstrap.ts`
- `useAppStateSync` - `appSync.ts`
- `useDailyProgressReset` - `appDailyReset.ts`
- `useWakeLock` - `hooks/useWakeLock.ts`

---

## 4. Nutrition Hooks

### Approved

- `useFlexibleMacros` - `components/ui-premium/useFlexibleMacros.ts`
- `useFoodCatalog` - `screens/nutricion/add-food/useFoodCatalog.ts`

### Refactor Required

- `useNutritionLogic` - `hooks/useNutritionLogic.ts`

### Planned

- `useAddFoodController`
- `useBarcodeScannerController`
- `useMealLogController`

---

## 5. Workout Hooks

### Approved

- `useActiveRoutineState` - `screens/rutina-activa/hooks/useActiveRoutineState.ts`
- `useRestTimer` - `components/ui-premium/useRestTimer.ts`

### Internal

- `useRoutineTimers` - `screens/rutina-activa/hooks/useRoutineTimers.ts`

### Refactor Required

- `useFuerzaScreenController` - `screens/rutina-activa/hooks/useFuerzaScreenController.ts`
- `useInfoStepFlow` - `screens/rutina-activa/hooks/useInfoStepFlow.ts`

### Deprecated

- `screens/rutina-activa/hooks/useRestTimer.ts` - removed legacy timer

### Planned

- `useWorkoutSummaryController`
- `usePostRoutineController`
- `useCardioScreenController`
- `usePoseStepController`

---

## 6. Progress / Body Hooks

### Approved

- `useProgressController` - `screens/progreso/hooks/useProgressController.ts`
- `useBodyMetricsController` - `screens/progreso/hooks/useBodyMetricsController.ts`

### Planned

- `useProgressGalleryController`
- `useSessionHistoryController`

---

## 7. Home / Daily Hooks

### Refactor Required

- `useHoyLogic` - `hooks/useHoyLogic.ts`

### Planned

- `useTodayDashboardController`
- `useHabitTrackerController`
- `useFreeActivityController`

---

## 8. Shared UI Utilities

### Approved

- `useAnimatedValue` - `hooks/useAnimatedValue.ts`

### Refactor Required

- `useCarousel` - `hooks/useCarousel.ts`

---

## 9. Exclusions / False Positives

- `services/userStateService.ts` is not a hook and must stay out of this manifest.
- Inline local helpers named with `use*` inside feature files must not be treated as shared SSOT unless promoted intentionally.

---

## 10. Migration Notes

- `UI_MANIFEST.md` governs visual composition.
- `LOGIC_MANIFEST.md` governs state logic, hooks and controllers.
- New feature work should add or update the relevant controller before redesigning JSX.
- Deprecated hooks should be removed once all consumers are rerouted.
- If a screen still owns significant state in the component file, it is not logically migrated.
