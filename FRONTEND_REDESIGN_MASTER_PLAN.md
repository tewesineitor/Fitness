# Frontend Redesign Master Plan

Fecha: 2026-03-20

## Objetivo

Preparar la app para un rediseño total del frontend sin reescribir la lógica de negocio salvo integraciones puntuales.

La meta no es "mejorar" la UI actual pantalla por pantalla.
La meta es dejar una base estable para reconstruir la experiencia visual con:

- un design system premium
- un shell global coherente
- pantallas reconstruidas sobre contratos visuales comunes
- mínima fricción con la lógica existente

## Principios

1. No tocar lógica de dominio si no es necesario para la integración visual.
2. No hacer maquillaje incremental sobre pantallas viejas.
3. Reconstruir por capas: foundation -> shell -> vertical slices.
4. Toda UI nueva debe salir de primitives/shared layouts.
5. Ningún subagente debe "inventar" estilos locales fuera del sistema base.

## Estado actual

La app ya está parcialmente preparada:

- `types.ts` y `services/aiService.ts` ya son fachadas/barrels.
- `AddFoodView`, `RutinaActivaScreen` y `RoutineViews` ya fueron reducidos y divididos.
- ya existen primitives útiles: `Button`, `Input`, `SelectField`, `Textarea`, `StepperControl`, `OptionTile`, `DialogSectionCard`, `Tag`, `Modal`
- `lint` y `build` pasan

Todavía hay deuda real:

- el shell global sigue concentrado en `App.tsx`
- `AppProvider.tsx` sigue muy acoplado a coordinación global
- `PlateSummary` sigue siendo el bloque más custom
- aún no existe un layout contract único para páginas
- todavía no existe un design language premium obligatorio para toda la app

## Fase 0 - Freeze y Baseline

Objetivo:
dejar una línea base antes del rediseño.

Tareas:

- congelar cambios de UI cosméticos fuera del plan
- documentar screenshots de referencia de las pantallas actuales
- definir qué lógica no debe tocarse
- listar flows críticos que no pueden romperse

Entregables:

- inventario visual por pantalla
- checklist de flows críticos
- lista de no-regresión

Definition of done:

- sabemos exactamente qué debe seguir funcionando aunque cambie toda la UI

## Fase 1 - Design System Foundation

Objetivo:
crear la base visual premium obligatoria.

Alcance:

- `styles/tailwind.css`
- `tailwind.config.cjs`
- `components/`

Tareas:

- redefinir tokens de color, contraste, spacing, radius, shadow, motion y typography
- decidir dirección visual premium
- crear primitives obligatorios
- eliminar ambigüedad entre variantes visuales

Primitives mínimas:

- `Button`
- `IconButton`
- `Input`
- `SelectField`
- `Textarea`
- `Tag`
- `DialogSectionCard`
- `OptionTile`
- `StepperControl`
- `PageHeader`
- `PageSection`
- `EmptyState`
- `StatCard`
- `BottomSheet`
- `Toast`
- `InlineAlert`

Entregables:

- tokens y reglas de uso
- catálogo base de componentes
- reglas de contraste y estados hover/focus/active

Definition of done:

- cualquier pantalla nueva puede construirse sin clases ad hoc
- no existen decisiones visuales críticas "por componente"

## Fase 2 - App Shell y Global Layers

Objetivo:
separar la estructura global que todas las pantallas usarán.

Alcance:

- `App.tsx`
- `AppProvider.tsx`
- navegación
- overlays
- focus mode

Tareas:

- extraer `AppShell`
- extraer `BottomNav`
- extraer `GlobalOverlays`
- extraer `FocusModeLayer`
- extraer `PageContainer`
- normalizar safe areas, padding, width constraints, page transitions

Entregables:

- shell nuevo sin lógica visual dispersa
- contrato único para layouts de pantalla

Definition of done:

- ninguna pantalla decide por su cuenta estructura global, container principal o navegación

## Fase 3 - Contracts por Feature

Objetivo:
dejar cada vertical lista para reconstrucción visual sin pelear con la lógica interna.

Frentes:

- Nutrición
- Rutina Activa
- Biblioteca
- Hoy
- Progreso
- Perfil/Auth

Tareas:

- definir entrypoints por feature
- aislar componentes contenedor vs presentacionales
- identificar qué modales/dialogs pertenecen a cada vertical
- dejar APIs internas claras para reconstruir vista sin tocar reducers/thunks

Definition of done:

- cada feature tiene fronteras claras y se puede rediseñar casi en aislamiento

## Fase 4 - Rediseño Vertical por Slices

Objetivo:
reconstruir pantallas completas sobre el foundation y shell nuevos.

Orden recomendado:

1. Nutrición
2. Rutina Activa
3. Biblioteca
4. Hoy
5. Progreso
6. Perfil/Auth

Regla:

- reconstruir cada vertical completa
- evitar mezclar UI vieja y nueva dentro de la misma experiencia más de lo necesario

Definition of done:

- el vertical ya usa solo el nuevo sistema visual
- no depende de hacks o estilos legacy

## Fase 5 - Polish, Accesibilidad y Performance

Objetivo:
subir la calidad final después de reconstruir la UX.

Tareas:

- revisar contraste real en todas las variantes
- revisar focus states
- revisar navegación por teclado
- revisar motion y reduced motion
- revisar density en móvil
- revisar consistencia de iconografía y copy
- revisar performance por chunk y por pantalla

Definition of done:

- el rediseño no solo "se ve mejor"; también es robusto y consistente

## Reparto Para Subagentes

### Subagente 1 - Foundation

Ownership:

- `styles/tailwind.css`
- `tailwind.config.cjs`
- `components/` base

Meta:

- construir el nuevo design system y las primitives premium

### Subagente 2 - Shell

Ownership:

- `App.tsx`
- `AppProvider.tsx`
- navegación y overlays globales

Meta:

- implementar `AppShell`, `BottomNav`, `GlobalOverlays`, `FocusModeLayer`, `PageContainer`

### Subagente 3 - Nutrición

Ownership:

- `screens/Nutricion.tsx`
- `screens/nutricion/`
- `components/nutricion/`

Meta:

- reconstruir el vertical de nutrición sobre el nuevo sistema

### Subagente 4 - Rutina Activa

Ownership:

- `screens/rutina-activa/`
- `screens/WorkoutSummary.tsx`
- dialogs/cardio ligados al flow inmersivo

Meta:

- reconstruir la experiencia fullscreen y sus subflujos

### Subagente 5 - Biblioteca

Ownership:

- `screens/Biblioteca.tsx`
- `screens/biblioteca/`
- `components/cards/` que pertenezcan al vertical

Meta:

- reconstruir planner, rutinas, recipes y library browsing

### Subagente 6 - Hoy / Progreso / Perfil

Ownership:

- `screens/Hoy.tsx`
- `screens/Progreso.tsx`
- `screens/PerfilScreen.tsx`
- charts/widgets relacionados

Meta:

- rehacer dashboard, progreso y perfil con la nueva jerarquía visual

## Qué Puede Hacerse en Paralelo

Paralelo seguro:

- Subagente 1 con Subagente 2
- después Subagentes 3, 4 y 5
- luego Subagente 6

Paralelo no recomendado:

- rehacer verticales antes de cerrar foundation y shell
- tocar varias features sin contrato visual/base ya decidido

## Definition of Done Global

Podremos decir que la app está lista para el rediseño total cuando:

- exista un design system premium obligatorio
- exista un shell global único
- cada vertical tenga fronteras claras
- las pantallas nuevas puedan reconstruirse sin tocar negocio
- no sigan apareciendo estilos locales arbitrarios

## Primer Sprint Recomendado

Si mañana arrancamos, el primer sprint debe ser solo:

1. Foundation visual
2. Shell global
3. contrato por vertical

No intentaría rediseñar `Hoy`, `Nutrición` o `Rutina Activa` antes de cerrar eso.

## Sprint 1 Ejecutable

Objetivo:
dejar lista la plataforma para empezar el rediseño total sin volver a caer en estilos locales inconsistentes.

### Subagente 1 - Foundation Premium

Ownership exacto:

- `styles/tailwind.css`
- `tailwind.config.cjs`
- `components/Button.tsx`
- `components/IconButton.tsx`
- `components/ChipButton.tsx`
- `components/Tag.tsx`
- `components/Card.tsx`
- `components/DialogSectionCard.tsx`
- `components/Input.tsx`
- `components/SelectField.tsx`
- `components/Textarea.tsx`
- `components/OptionTile.tsx`
- `components/StepperControl.tsx`
- archivos nuevos en `components/layout/` o `components/feedback/`

Debe entregar:

- nuevos tokens premium
- contraste y estados interactivos consistentes
- primitives obligatorias para formularios, estados, superficies y feedback
- motion base unificada

No debe tocar:

- lógica de negocio
- reducers
- thunks
- pantallas completas

### Subagente 2 - Shell Global

Ownership exacto:

- `App.tsx`
- `AppProvider.tsx`
- `components/FloatingDock.tsx`
- `components/FullScreenFlow.tsx`
- `components/AppChunkFallback.tsx`
- archivos nuevos en `components/layout/`

Debe entregar:

- `AppShell`
- `BottomNav`
- `GlobalOverlays`
- `FocusModeLayer`
- `PageContainer`
- contrato único de safe areas, anchos y spacing global

No debe tocar:

- verticales completos
- reducers y thunks

### Subagente 3 - Contracts de Nutrición

Ownership exacto:

- `screens/Nutricion.tsx`
- `screens/nutricion/`
- `components/nutricion/`

Debe entregar:

- fronteras claras entre contenedores y vistas
- inventario de dialogs y subflujos
- puntos de entrada listos para rediseño visual

No debe todavía:

- hacer el rediseño final del vertical

### Subagente 4 - Contracts de Rutina Activa

Ownership exacto:

- `screens/rutina-activa/`
- `screens/WorkoutSummary.tsx`
- dialogs relacionados al flow inmersivo

Debe entregar:

- frontera clara entre shell inmersivo, steps, summary y dialogs
- contratos visuales para reconstrucción del flow fullscreen

### Subagente 5 - Contracts de Biblioteca

Ownership exacto:

- `screens/Biblioteca.tsx`
- `screens/biblioteca/`
- `components/cards/` usados por biblioteca

Debe entregar:

- separación clara entre planner, editor, listados y browsing
- puntos de rediseño por subflujo

### Subagente 6 - Contracts de Hoy / Progreso / Perfil

Ownership exacto:

- `screens/Hoy.tsx`
- `screens/Progreso.tsx`
- `screens/PerfilScreen.tsx`
- widgets y charts asociados

Debe entregar:

- contratos listos para dashboard, progreso y perfil premium

## Criterios de Salida del Sprint 1

El sprint 1 se considera completo cuando:

- exista una base visual premium reutilizable
- `App.tsx` ya no sea el shell visual monolítico
- exista un contrato único de página
- cada vertical tenga límites claros
- el equipo pueda arrancar el rediseño de una feature sin redefinir tokens, nav, overlays o spacing global

## Qué NO hacer en Sprint 1

- no rediseñar todas las pantallas a la vez
- no pulir botones sueltos de la UI vieja
- no mezclar cambios de negocio con cambios visuales
- no permitir nuevas excepciones visuales fuera del foundation

## Estado de Sprint 1

Ya implementado:

- foundation premium en `styles/tailwind.css` y `tailwind.config.cjs`
- shell global con `AppShell`, `BottomNav`, `GlobalOverlays`, `FocusModeLayer`, `ThemeSync`, `PageContainer`, `AuthGate` y `AppLoadingScreen`
- primitives nuevas de layout y feedback
- adopcion inicial del contrato nuevo en `Hoy`, `Biblioteca`, `Progreso`, `LoginView` y `PillTabs`
- primera pasada del vertical `Nutricion` con dashboard editorial, `AddFood`, scanner, plate builder y dialogs migrados al sistema nuevo
- arranque del vertical `Rutina Activa` con `WorkoutSummary` ya migrado y confirmacion de salida alineada con primitives compartidas
- consolidación del vertical `Rutina Activa` con un `<ImmersiveFocusShell>` compartido para todas las pantallas de flujo interactivo y refactorización completa de `ExerciseDetailSheet`, `FuerzaScreen`, `CardioScreen`, `PoseScreen` y `RuckingSession`.

Siguiente paso:

1. Rematar detalles residuales de `Nutricion` solo si aparecen hallazgos funcionales o de contraste en QA.
2. (COMPLETADO) Rediseñar `Rutina Activa` y `WorkoutSummary` incorporando su propio global shell inmersivo.
3. Continuar con `Biblioteca`, luego `Hoy`, `Progreso` y `Perfil/Auth`.
