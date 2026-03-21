# Auditoria UI y Mantenibilidad

Fecha: 2026-03-20

## Estado real

La migracion visual de `rutina-activa` y `nutricion` mejoro de forma importante, pero no estaba completamente cerrada.
Despues de esta pasada:

- `rutina-activa` ya usa mucho mas `Button`, `IconButton` y `ChipButton` en `FuerzaScreen`, `RestoScreen`, `RutinaActivaScreen`, `PoseScreen`, `ExerciseDetailSheet`, `PlateCalculatorModal`, `CardioLibreLogModal` y `SetSelectorModal`.
- `nutricion` ya alineo piezas visibles en `AddFoodView`, `FoodItemEditor`, `MealLog`, `NutritionSummary`, `NutritionMainView` y `PlateSummary`.
- `PlateSummary` quedo simplificado y movio la logica de macros a [MacroBlocks.tsx](/D:/07.%20Apps/Fitness/components/nutricion/plate-summary/MacroBlocks.tsx) y [macroStatus.ts](/D:/07.%20Apps/Fitness/components/nutricion/plate-summary/macroStatus.ts).
- `screens/biblioteca/RoutineViews.tsx` ya no concentra planner, editor, picker y lista en un unico archivo; ahora se compone desde `screens/biblioteca/routine-views/`.
- `npm.cmd run lint` y `npm.cmd run build` pasan.

## Deuda visual que sigue viva

### P1

- `screens/nutricion/AddFoodView.tsx`
  - Sigue concentrando demasiada UI local en un solo archivo.
  - Aun mezcla overlays de procesamiento, tiles visuales especiales y catalogo interactivo en el mismo componente.
- `components/nutricion/PlateSummary.tsx`
  - Ya no concentra la logica de macros; ahora compone helpers locales y primitives compartidos.
  - El trigger compacto sigue siendo una excepcion visual, pero el resto del bloque ya quedo mucho mas homogeneo.

### P2

- `screens/rutina-activa/InfoStepScreen.tsx`
  - El CTA de tecnica y la tira de progreso siguen siendo patrones locales.
- `components/dialogs/CardioLibreLogModal.tsx`
  - La jerarquia ya mejoro, pero los `input` hero y el `textarea` siguen usando una receta propia.
- `screens/nutricion/BarcodeScannerView.tsx`
  - Fullscreen camera overlay con estilo especial fuera del sistema base.

## Deuda de mantenibilidad

### P1

- `screens/nutricion/AddFoodView.tsx`
  - Sigue siendo un componente demasiado grande y con demasiadas responsabilidades.
  - Conviene partirlo en hooks y subcomponentes (`useFoodSearch`, `useFoodCapture`, `PlateComposer`, `FoodCatalogPane`).
- `screens/biblioteca/RoutineViews.tsx`
  - Ya quedo refactorizado como wrapper, pero la siguiente deuda de biblioteca esta mas en helpers de dominio y flows duplicados.
- `screens/rutina-activa/RutinaActivaScreen.tsx`
  - Sigue orquestando demasiada logica de flujo, timers, branching y modales.
- `reducers/nutritionReducer.ts`, `reducers/workoutReducer.ts`, `reducers/sessionReducer.ts`
  - Mantienen logica temporal y generacion de datos que deberia vivir fuera del reducer.
- `services/aiService.ts`
  - Sigue siendo un servicio demasiado amplio para casos de uso muy distintos.

### P2

- `types.ts`
  - Sigue funcionando como hub monolitico del dominio.
- `App.tsx` y `AppProvider.tsx`
  - Aun concentran shell, bootstrap, sync y coordinacion global con demasiado conocimiento del estado completo.

## Plan recomendado

1. Extraer primitives faltantes del sistema visual: `Textarea`, `SelectField`, `StepperControl`, `SelectionTile`, `DialogSectionCard`.
2. Partir `AddFoodView` por subflujos y dejar sus calculos de dominio fuera del render.
3. Extraer `useActiveRoutineFlow` y `useWorkoutTimers` desde `RutinaActivaScreen`.
4. Purificar reducers moviendo IDs, fechas y logica derivada a action creators o factories.
5. Dividir `types.ts` y `aiService.ts` por dominio.

## Conclusion

No estaba completamente listo al inicio de esta pasada, pero el frente `plate/nutricion shared` ya quedo resuelto.
La deuda estructural mas grande sigue en `AddFoodView`, `RutinaActivaScreen`, `RoutineViews`, `types.ts` y `aiService.ts`, que conviene atacar en una fase separada.
