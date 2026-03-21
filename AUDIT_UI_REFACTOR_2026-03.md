# Auditoria UI y Mantenibilidad

Fecha: 2026-03-20

## Estado real

La migracion visual de `rutina-activa` y `nutricion` mejoro de forma importante, y esta pasada cerro el frente de `AddFoodView` y `BarcodeScannerView` con una extraccion real de subcomponentes.
Despues de esta pasada:

- `nutricion` ahora separa el flujo de agregar comida en [AddFoodView.tsx](/D:/07.%20Apps/Fitness/screens/nutricion/AddFoodView.tsx), [add-food/AddFoodHeader.tsx](/D:/07.%20Apps/Fitness/screens/nutricion/add-food/AddFoodHeader.tsx), [add-food/FoodCatalogView.tsx](/D:/07.%20Apps/Fitness/screens/nutricion/add-food/FoodCatalogView.tsx), [add-food/FoodItemCard.tsx](/D:/07.%20Apps/Fitness/screens/nutricion/add-food/FoodItemCard.tsx), [add-food/AddFoodImageSourceModal.tsx](/D:/07.%20Apps/Fitness/screens/nutricion/add-food/AddFoodImageSourceModal.tsx), [add-food/AddFoodProcessingOverlay.tsx](/D:/07.%20Apps/Fitness/screens/nutricion/add-food/AddFoodProcessingOverlay.tsx) y [add-food/useFoodCatalog.ts](/D:/07.%20Apps/Fitness/screens/nutricion/add-food/useFoodCatalog.tsx).
- `BarcodeScannerView` ya usa `DialogSectionCard`, `Tag` e `IconButton` para salir del bloque negro de UI local.
- `NutritionSummary` fue restaurado para dejar de romper el import de `NutritionMainView`.
- `npm.cmd run lint` y `npm.cmd run build` pasan.

## Deuda visual que sigue viva

### P1

- `components/nutricion/PlateSummary.tsx`
  - Sigue siendo el ultimo bloque grande de nutricion con cards y controles muy propios, aunque ya usa primitives mas consistentes.

### P2

- `screens/nutricion/BarcodeScannerView.tsx`
  - La UI base ya esta mejor alineada, pero el overlay fullscreen sigue siendo una excepcion visual intencional.

## Deuda de mantenibilidad

### P1

- `screens/nutricion/AddFoodView.tsx`
  - El contenedor ya quedo mucho mas chico, pero la siguiente capa a extraer deberia ser el flujo de entrada de imagen/barcode para dejarlo todavia mas declarativo.
- `screens/nutricion/add-food/*`
  - Ahora concentra la composicion del flujo; conviene mantener este folder como frontera del dominio de catalogo/nutricion.
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

1. Consolidar `PlateSummary` y los dialogs del flujo activo con los nuevos primitives.
2. Seguir reduciendo `RutinaActivaScreen` y `RoutineViews` con hooks y renderizadores puros.
3. Purificar reducers moviendo IDs, fechas y logica derivada a action creators o factories.
4. Dividir `types.ts` y `aiService.ts` por dominio.

## Conclusion

`AddFoodView` y `BarcodeScannerView` ya quedaron refactorizados de forma real, con primitives compartidos y subcomponentes/hook locales.
La deuda visual mas fuerte del frente de catalogo quedo bastante reducida; lo que sigue es ya refinamiento incremental, no una reescritura urgente.
