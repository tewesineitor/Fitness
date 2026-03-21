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

- `WorkoutSummary` ya fue migrado al sistema nuevo
- la salida de `RutinaActiva` dejo de usar botones custom y ahora usa primitives compartidas
- se documento la siguiente deuda real del vertical: shell fullscreen compartido, dialogs/sheets y superficies de captura en `FuerzaScreen`

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

Seguir con `Rutina Activa` sobre estos tres frentes:

1. `Focus shell` compartido para pantallas inmersivas
2. sistema unificado de dialogs y sheets del vertical
3. refactor visual de `FuerzaScreen`, `InfoStepScreenView`, `PostRoutineScreen` y `ProgressiveCardioLogModal`

Despues de eso, continuar con `Biblioteca`.
