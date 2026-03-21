# Auditoria UI y Mantenibilidad

Fecha: 2026-03-20

## Estado Real

La migracion visual de `rutina-activa` y `nutricion` mejoro de forma importante.
En esta fase:

- `rutina-activa` quedo separada en [hooks/useInfoStepFlow.ts](/D:/07.%20Apps/Fitness/screens/rutina-activa/hooks/useInfoStepFlow.ts), [hooks/useRoutineTimers.ts](/D:/07.%20Apps/Fitness/screens/rutina-activa/hooks/useRoutineTimers.ts), [flow/InfoStepScreenView.tsx](/D:/07.%20Apps/Fitness/screens/rutina-activa/flow/InfoStepScreenView.tsx), [flow/RoutinePreStartView.tsx](/D:/07.%20Apps/Fitness/screens/rutina-activa/flow/RoutinePreStartView.tsx), [flow/RoutineSessionHeader.tsx](/D:/07.%20Apps/Fitness/screens/rutina-activa/flow/RoutineSessionHeader.tsx) y [flow/RoutineStepRenderer.tsx](/D:/07.%20Apps/Fitness/screens/rutina-activa/flow/RoutineStepRenderer.tsx), dejando [RutinaActivaScreen.tsx](/D:/07.%20Apps/Fitness/screens/rutina-activa/RutinaActivaScreen.tsx) como coordinador.
- `InfoStepScreen` ya no mezcla temporizador, avance y UI de potenciacion en un solo archivo.
- `rutina-activa` usa ahora `Tag`, `Button`, `IconButton` y `DialogSectionCard` compartidos para estados, header y confirmacion.
- `nutricion` ya habia separado el flujo de agregar comida en [AddFoodView.tsx](/D:/07.%20Apps/Fitness/screens/nutricion/AddFoodView.tsx), [add-food/AddFoodHeader.tsx](/D:/07.%20Apps/Fitness/screens/nutricion/add-food/AddFoodHeader.tsx), [add-food/FoodCatalogView.tsx](/D:/07.%20Apps/Fitness/screens/nutricion/add-food/FoodCatalogView.tsx), [add-food/FoodItemCard.tsx](/D:/07.%20Apps/Fitness/screens/nutricion/add-food/FoodItemCard.tsx), [add-food/AddFoodImageSourceModal.tsx](/D:/07.%20Apps/Fitness/screens/nutricion/add-food/AddFoodImageSourceModal.tsx), [add-food/AddFoodProcessingOverlay.tsx](/D:/07.%20Apps/Fitness/screens/nutricion/add-food/AddFoodProcessingOverlay.tsx) y [add-food/useFoodCatalog.ts](/D:/07.%20Apps/Fitness/screens/nutricion/add-food/useFoodCatalog.ts).
- `BarcodeScannerView` ya usa `DialogSectionCard`, `Tag` e `IconButton` para salir del bloque negro de UI local.
- `RoutineViews` quedo convertido en un shell ligero sobre [routine-views/RoutinesManagementFlow.tsx](/D:/07.%20Apps/Fitness/screens/biblioteca/routine-views/RoutinesManagementFlow.tsx), [routine-views/RoutineEditor.tsx](/D:/07.%20Apps/Fitness/screens/biblioteca/routine-views/RoutineEditor.tsx), [routine-views/RoutinesListView.tsx](/D:/07.%20Apps/Fitness/screens/biblioteca/routine-views/RoutinesListView.tsx) y [routine-views/WeeklyPlannerView.tsx](/D:/07.%20Apps/Fitness/screens/biblioteca/routine-views/WeeklyPlannerView.tsx).
- `types.ts` ya no concentra el dominio: ahora es un barrel de compatibilidad sobre [types/app.ts](/D:/07.%20Apps/Fitness/types/app.ts), [types/nutrition.ts](/D:/07.%20Apps/Fitness/types/nutrition.ts), [types/workout.ts](/D:/07.%20Apps/Fitness/types/workout.ts), [types/session.ts](/D:/07.%20Apps/Fitness/types/session.ts), [types/profile.ts](/D:/07.%20Apps/Fitness/types/profile.ts), [types/progress.ts](/D:/07.%20Apps/Fitness/types/progress.ts), [types/ui.ts](/D:/07.%20Apps/Fitness/types/ui.ts), [types/library.ts](/D:/07.%20Apps/Fitness/types/library.ts) y [types/common.ts](/D:/07.%20Apps/Fitness/types/common.ts).
- `services/aiService.ts` ya funciona como fachada delgada y la implementacion se separo en [services/ai/nutritionAiService.ts](/D:/07.%20Apps/Fitness/services/ai/nutritionAiService.ts), [services/ai/activityAiService.ts](/D:/07.%20Apps/Fitness/services/ai/activityAiService.ts), [services/ai/exerciseAiService.ts](/D:/07.%20Apps/Fitness/services/ai/exerciseAiService.ts), [services/ai/aiClient.ts](/D:/07.%20Apps/Fitness/services/ai/aiClient.ts), [services/ai/aiErrors.ts](/D:/07.%20Apps/Fitness/services/ai/aiErrors.ts) y [services/ai/aiTypes.ts](/D:/07.%20Apps/Fitness/services/ai/aiTypes.ts).
- Se agregaron primitives compartidos para cortar UI local repetida: [StepperControl.tsx](/D:/07.%20Apps/Fitness/components/StepperControl.tsx), [OptionTile.tsx](/D:/07.%20Apps/Fitness/components/OptionTile.tsx), [SelectField.tsx](/D:/07.%20Apps/Fitness/components/SelectField.tsx), [Textarea.tsx](/D:/07.%20Apps/Fitness/components/Textarea.tsx) y [DialogSectionCard.tsx](/D:/07.%20Apps/Fitness/components/DialogSectionCard.tsx).
- `npm.cmd run lint` y `npm.cmd run build` pasan.

## Deuda Visual

### P1

- `components/nutricion/PlateSummary.tsx`
  - Sigue siendo el ultimo bloque grande de nutricion con una identidad visual mas premium y personalizada que el resto.
  - La deuda ya no es de inconsistencia grave, sino de decidir si ese shell compacto debe permanecer como excepcion de producto o migrarse aun mas al sistema base.

### P2

- `screens/nutricion/BarcodeScannerView.tsx`
  - La UI base ya esta mejor alineada, pero el overlay fullscreen sigue siendo una excepcion visual intencional.
- `screens/rutina-activa/flow/RoutineStepRenderer.tsx`
  - Ya centraliza el branching y permite evolucionar cada tipo de paso con menor friccion, pero sigue siendo un nodo de coordinacion.

## Deuda de Mantenibilidad

### P1

- `screens/rutina-activa/RutinaActivaScreen.tsx`
  - Ya quedo mucho mas chica, pero sigue siendo el punto donde vive la mutacion de flujo y la insercion de pasos.
  - Si queremos una segunda fase, el siguiente recorte natural es extraer `useRoutineSessionState` y `useRoutineFlowMutations`.
- `reducers/nutritionReducer.ts`, `reducers/workoutReducer.ts`, `reducers/sessionReducer.ts`
  - Mantienen logica temporal y generacion de datos que deberia vivir fuera del reducer.

### P2

- `App.tsx` y `AppProvider.tsx`
  - Aun concentran shell, bootstrap, sync y coordinacion global con demasiado conocimiento del estado completo.
 - `types.ts` y `services/aiService.ts`
  - Ya quedaron como barrels/fachadas de compatibilidad.
  - La deuda restante aqui es menor: migrar imports por dominio de forma gradual para que el repo dependa menos de esos puntos de entrada.

## Plan Recomendado

1. Consolidar `PlateSummary` y los dialogs del flujo activo con los nuevos primitives.
2. Seguir reduciendo `RutinaActivaScreen` con hooks y mutaciones de flujo mas pequeñas.
3. Purificar reducers moviendo IDs, fechas y logica derivada a action creators o factories.
4. Migrar imports gradualmente desde `types.ts` y `services/aiService.ts` hacia modulos por dominio.

## Conclusion

`rutina-activa`, `nutricion`, `RoutineViews`, `types` y `aiService` ya quedaron refactorizados de forma real, no solo maquillados.
La deuda que sigue viva es incremental y estructural en algunas zonas, pero ya no hay un cuello de botella equivalente al estado original de estos archivos.
