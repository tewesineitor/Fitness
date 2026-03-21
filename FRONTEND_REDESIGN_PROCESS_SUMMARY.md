# Resumen del Proceso de Rediseño

## Objetivo

Preparar la app para un rediseño total del frontend sin romper la logica de negocio.
La estrategia elegida fue:

- cerrar primero foundation y shell
- despues reconstruir la app por verticales completos
- evitar parches cosmeticos aislados sobre UI legacy

## Metodo de Trabajo

Para cada frente se sigue este ciclo:

1. auditar visualmente el vertical
2. separar ownership por area cuando conviene paralelizar
3. reconstruir sobre primitives compartidas
4. evitar remezclar estilos locales arbitrarios
5. validar siempre con `npm.cmd run lint` y `npm.cmd run build`
6. dejar trazabilidad en la documentacion del roadmap

## Lo que ya se implemento

### Sprint 1

- foundation premium
- shell global
- primitives compartidas de layout y feedback
- contratos iniciales por vertical

### Vertical 1: Nutricion

- dashboard editorial
- flujo `AddFood`
- scanner y editor de alimento
- `plate builder`
- dialogs y piezas compartidas del vertical

### Vertical 2: Rutina Activa

Estado actual de esta pasada:

- `WorkoutSummary` ya fue migrado al sistema nuevo.
- La salida de `RutinaActiva` dejó de usar botones custom y ahora usa primitives compartidas.
- **¡Completado!** Se implementó un `ImmersiveFocusShell` compartido para todas las pantallas inmersivas (`FuerzaScreen`, `CardioScreen`, `PoseScreen`, `RestoScreen`, `RuckingSession`).
- **¡Completado!** Se refactorizó `ExerciseDetailSheet` para utilizar el utilitario oficial `<BottomSheet>`. El resto de los dialogs y sheets inmersivos quedan 100% estandarizados.

## Decisiones Clave

- no tocar reducers ni thunks salvo algo minimo para integracion
- mover primero las capas mas visibles y mas inconsistentes
- usar `PageHeader`, `PageSection`, `Card`, `Tag`, `Button`, `Modal` y `BottomSheet` como base obligatoria
- tratar contrastes, hover y jerarquia como parte del contrato visual, no como detalle final

## Riesgos Aprendidos

- muchos problemas visuales no venian de una sola pantalla, sino de no tener un contrato compartido para fullscreen flows y dialogs
- habia copy y textos con codificacion fragil en varios puntos; conviene revisar esto vertical por vertical
- si se rediseña sin documentar el estado del vertical, es muy facil volver a introducir UI local

## Siguiente Paso Recomendado

Seguir con `Biblioteca`. La refactorización visual inmersiva de `Rutina Activa` está finalizada.
