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
- `npm.cmd run lint` y `npm.cmd run build` pasan.

## Deuda Visual

### P1

- `components/nutricion/PlateSummary.tsx`
  - Sigue siendo el ultimo bloque grande de nutricion con cards y controles muy propios, aunque ya usa primitives mas consistentes.

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
- `services/aiService.ts`
  - Sigue siendo un servicio demasiado amplio para casos de uso muy distintos.

### P2

- `types.ts`
  - Sigue funcionando como hub monolitico del dominio.
- `App.tsx` y `AppProvider.tsx`
  - Aun concentran shell, bootstrap, sync y coordinacion global con demasiado conocimiento del estado completo.

## Plan Recomendado

1. Consolidar `PlateSummary` y los dialogs del flujo activo con los nuevos primitives.
2. Seguir reduciendo `RutinaActivaScreen` y `RoutineViews` con hooks y renderizadores puros.
3. Purificar reducers moviendo IDs, fechas y logica derivada a action creators o factories.
4. Dividir `types.ts` y `aiService.ts` por dominio.

## Conclusion

`rutina-activa` ya quedo refactorizado de forma real con hooks y vistas puras.
La deuda visual mas fuerte de este frente quedo bastante reducida; lo que sigue es refinamiento incremental, no una reescritura urgente.
