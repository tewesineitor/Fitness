# FRONTEND_REDESIGN_MASTER_PLAN.md

> Estado del documento: Definitivo  
> Fecha: 2026-03-27  
> Rol emisor: Arquitectura Frontend / Tech Lead  
> Base de auditoria: `docs/active/PROJECT_OVERVIEW.md`, `docs/archive/APP_TOPOLOGY_2026-03-23.md`, `.windsurf/rules/frontend-anti-patterns.md` y revision estatica del arbol real del proyecto

---

## 1. Propósito

Este documento define el plan maestro del rediseño total del frontend de la SPA de fitness tras el cierre de la Fase 1. Su objetivo es convertir el trabajo ya realizado en un estándar operativo estricto, reducir deuda estructural y establecer el orden exacto de ejecución para el resto del rediseño.

La tesis de trabajo es simple:

1. La base visual ya existe.
2. La extracción de lógica ya comenzó en varios verticales.
3. El proyecto todavía está en un estado híbrido entre UI legacy, layout nuevo y adopción mínima de `components/ui-premium/`.
4. A partir de este punto, no se permiten rediseños “a medias”.

---

## 2. Diagnóstico Ejecutivo

### 2.1 Lo que ya quedó resuelto en Fase 1

- Existe una base de design system premium en `components/ui-premium/` con `PremiumButton`, `SquishyCard` y `PremiumModal`.
- El shell global fue separado de `App.tsx` y ya opera con `AppShell`, `BottomNav`, `FocusModeLayer`, `GlobalOverlays`, `ThemeSync`, `PageContainer` y `PageHeader`.
- Ya existen primeras extracciones headless por vertical: `useHoyLogic`, `useNutritionLogic`, `screens/rutina-activa/hooks/useActiveRoutineState.ts`, `screens/rutina-activa/hooks/useFuerzaStep.ts`, `screens/rutina-activa/hooks/useInfoStepFlow.ts`, `screens/rutina-activa/hooks/useRestTimer.ts` y `screens/rutina-activa/hooks/useRoutineTimers.ts`.
- La pantalla `Hoy` ya fue intervenida.
- La pantalla principal de `Nutrición` ya fue intervenida parcialmente.
- La vista de `Calentamiento` dentro de `Rutina Activa` ya tiene una base más estable por separación de flujo.

### 2.2 Lo que todavía no está resuelto

- `ui-premium` existe, pero su adopción real sigue siendo mínima. En la auditoría actual, el uso directo visible está concentrado prácticamente en `ExerciseDetailSheet` mediante `PremiumModal`.
- Siguen conviviendo tres capas visuales: UI legacy (`Button`, `Card`, `Modal`, `SectionHeader`, `PillTabs`, etc.), layout nuevo (`PageContainer`, `PageHeader`, `AppShell`, etc.) y kit premium (`PremiumButton`, `SquishyCard`, `PremiumModal`).
- Varias pantallas conservan lógica de estado, side effects y composición visual en el mismo archivo.
- Persisten violaciones al estándar de layout documentado en `frontend-anti-patterns.md`, en especial wrappers raíz con `max-w-2xl` o `max-w-3xl`.
- El sistema de modales sigue fragmentado entre `components/dialogs/` y modales locales por feature.

### 2.3 Conclusión de arquitectura

El proyecto ya no necesita más “retoques visuales”. Necesita una migración controlada a un patrón único:

**headless por feature + reconstrucción premium por pantalla + limpieza topológica progresiva**.

---

## 3. Auditoría de Topología

### 3.1 Mapa de estado por módulo

| Módulo / Pantalla | Estado | Diagnóstico |
|---|---|---|
| `components/ui-premium/` | Base lista | El kit premium ya existe, pero todavía no es la capa dominante de renderizado. |
| Shell global (`AppShell`, `BottomNav`, `FocusModeLayer`, `GlobalOverlays`) | Intervenido | Infraestructura nueva ya separada y operativa. |
| `screens/Hoy.tsx` | Intervenida parcial | Ya consume `useHoyLogic`, pero el JSX sigue siendo bespoke y no está reconstruido sobre `ui-premium`. |
| `screens/Nutricion.tsx` | Parcial | Funciona como router local, pero sigue cargando subflujos con lógica acoplada en la vista. |
| `screens/nutricion/NutritionMainView.tsx` | Intervenida parcial | Ya consume `useNutritionLogic`, pero aún depende de modales legacy y composición manual. |
| `screens/nutricion/AddFoodView.tsx` | Pendiente crítica | Alta concentración de `useState`, side effects, procesamiento async y modales en una sola vista. |
| `screens/rutina-activa/RutinaActivaScreen.tsx` | Parcial avanzada | La orquestación ya usa hooks dedicados, pero el ecosistema visual sigue híbrido. |
| `screens/rutina-activa/InfoStepScreen.tsx` | Estable / parcial | Es la subvista más alineada con el trabajo de estabilización del flujo de calentamiento. |
| `screens/rutina-activa/FuerzaScreen.tsx` | Pendiente prioritaria | Ya existe `useFuerzaStep`, pero la pantalla aún mezcla lógica derivada, parsing, interacción y JSX bespoke. |
| `screens/rutina-activa/CardioScreen.tsx` | Pendiente | Debe migrarse al mismo estándar de paso headless + visual premium. |
| `screens/rutina-activa/PoseScreen.tsx` | Pendiente | Todavía fuera del estándar premium definitivo. |
| `screens/rutina-activa/RestoScreen.tsx` | Pendiente | Falta unificar layout, contrato visual y timer headless. |
| `screens/rutina-activa/PostRoutineScreen.tsx` | Pendiente | Cierra el flujo core y debe compartir sistema visual con los demás pasos activos. |
| `screens/WorkoutSummary.tsx` | Parcial | Alineada con foundation nueva, pero no consolidada bajo `ui-premium`. |
| `screens/PerfilScreen.tsx` | Pendiente | Mantiene estado local y persistencia en el mismo archivo visual. |
| `screens/OnboardingScreen.tsx` | Pendiente | Wizard completo aún monolítico y con primitives legacy. |
| `screens/auth/LoginView.tsx` | Intervenida de foundation | Ya adoptó layout nuevo, pero no el estándar premium estricto ni extracción headless. |
| `screens/Biblioteca.tsx` | Intervenida de foundation | Adoptó parte del nuevo lenguaje, pero sigue siendo un router grande con mucha composición manual. |
| Flujos de Biblioteca (`RecipeViews`, `RoutineViews`, `ExerciseViews`, `RoutineEditor`, `WeeklyPlannerView`) | Pendientes | Siguen fuera del nuevo estándar integral. |
| `screens/Progreso.tsx` | Intervenida de foundation | Ya usa `PageHeader`, pero aún no entra en el contrato premium ni en el wrapper de layout oficial. |
| `screens/progreso/ProgressGallery.tsx` | Pendiente | Subflujo no consolidado. |
| `screens/progreso/SessionHistoryList.tsx` | Pendiente | Subflujo aún fuera del patrón definitivo. |

### 3.2 Pantallas ya intervenidas

### Intervenidas con base real de Fase 1

- `Hoy`
- `Nutrición` principal
- infraestructura de shell global
- `Rutina Activa` a nivel orquestación
- `Calentamiento` como subflujo más estabilizado
- `LoginView`, `Biblioteca` y `Progreso` en nivel foundation/layout, no todavía en nivel premium final

### Intervenidas solo de forma parcial

- `Hoy`
- `NutritionMainView`
- `RutinaActivaScreen`
- `WorkoutSummary`
- `Biblioteca`
- `Progreso`

### 3.3 Deuda pendiente explícita

### Deuda de pantallas core

- `screens/rutina-activa/FuerzaScreen.tsx`
- `screens/rutina-activa/CardioScreen.tsx`
- `screens/rutina-activa/PoseScreen.tsx`
- `screens/rutina-activa/RestoScreen.tsx`
- `screens/rutina-activa/PostRoutineScreen.tsx`
- `screens/WorkoutSummary.tsx`
- `screens/PerfilScreen.tsx`

### Deuda de pantallas de soporte

- `screens/OnboardingScreen.tsx`
- `screens/auth/LoginView.tsx`
- `screens/Progreso.tsx`
- `screens/progreso/ProgressGallery.tsx`
- `screens/progreso/SessionHistoryList.tsx`

### Deuda de vertical Nutrición

- `screens/nutricion/AddFoodView.tsx`
- `screens/nutricion/BarcodeScannerView.tsx`
- `screens/nutricion/FoodItemEditor.tsx`
- `screens/nutricion/CustomFoodListView.tsx`
- overlays y modales asociados al flujo de plato

### Deuda de vertical Biblioteca

- `screens/Biblioteca.tsx` como router de alto nivel
- `screens/biblioteca/RecipeViews.tsx`
- `screens/biblioteca/ExerciseViews.tsx`
- `screens/biblioteca/RoutineViews.tsx`
- `screens/biblioteca/routine-views/RoutineEditor.tsx`
- `screens/biblioteca/routine-views/WeeklyPlannerView.tsx`
- submodales de edición/selección

### Deuda de modales secundarios

- `CardioLibreLogModal`
- `ProgressiveCardioLogModal`
- `MealEditorModal`
- `PortionEditorModal`
- `DataCorrectionModal`
- `RawDataDebugModal`
- `PlateCalculatorModal`
- `SetSelectorModal`
- `RoutineExitDialog`
- modales de `AddExercise` en Biblioteca y Rutina Activa

---

## 4. Hallazgos Estructurales que Deben Guiar el Rediseño

### 4.1 La lógica headless está empezando, pero no es estándar todavía

Hoy existe una mezcla de estados: pantallas con hook principal claro (`Hoy`, `NutritionMainView`), pantallas con hook parcial (`FuerzaScreen`) y pantallas todavía monolíticas (`AddFoodView`, `PerfilScreen`, `OnboardingScreen`).

Esto es positivo como punto de partida, pero peligroso si no se formaliza ahora.

### 4.2 El kit premium ya existe, pero no gobierna el sistema

La auditoría muestra que el UI Kit premium todavía no es el contrato dominante de las nuevas pantallas. El riesgo inmediato es seguir construyendo “pantallas nuevas” sobre primitives anteriores y terminar con una tercera capa visual permanente.

**Decisión de arquitectura:** desde este documento, `components/ui-premium/` deja de ser experimental y pasa a ser obligatorio para toda reconstrucción visual nueva.

### 4.3 Hay deuda topológica de layout

El documento de anti-patrones prohíbe explícitamente usar wrappers raíz con `max-w-2xl` o `max-w-3xl` en pantallas principales. La auditoría real detecta esa deuda en varios archivos, incluyendo:

- `screens/rutina-activa/FuerzaScreen.tsx`
- `screens/Progreso.tsx`
- `screens/Biblioteca.tsx`
- `screens/biblioteca/ExerciseViews.tsx`
- `screens/nutricion/AddFoodView.tsx`
- `screens/progreso/SessionHistoryList.tsx`

Esto no es un detalle visual menor. Es deuda de layout y debe eliminarse durante la migración de cada pantalla.

### 4.4 El sistema de modales sigue fragmentado

Hoy conviven modales globales en `components/dialogs/`, modales locales en `screens/rutina-activa/`, modales locales en `screens/biblioteca/routine-views/` y overlays incrustados en verticales de nutrición.

Esto complica ownership, naming y consistencia visual. El plan maestro debe absorber esta fragmentación durante la migración por feature.

---

## 5. El Estándar Obligatorio a Partir de Ahora

### 5.1 Regla maestra

**Toda pantalla nueva o rediseñada se ejecuta en dos golpes estrictos y secuenciales.**

No hay excepciones para “solo retocar JSX”, “solo mejorar estilos” o “solo mover un modal”.

### 5.2 Golpe 1: Lógica

### Objetivo

Extraer toda la lógica de estado, derivación y asincronía fuera del componente visual hacia un Custom Hook headless y aislado.

### Qué debe salir del archivo visual

- `useState`
- `useEffect`
- `useMemo`
- `useCallback`
- parsing/formateo ligado al flujo
- selección de datos de contexto
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

### Criterio de aceptación del Golpe 1

- la pantalla puede renderizarse leyendo un solo objeto de estado/control
- no hay llamadas async directas en el JSX
- no hay acceso directo al contexto global dentro del componente visual, salvo casos excepcionales ya encapsulados
- la lógica de navegación interna y modales está centralizada en el hook

### 5.3 Golpe 2: Visual

### Objetivo

Reconstruir la pantalla consumiendo exclusivamente:

- el hook headless creado en el Golpe 1
- `components/ui-premium/`
- primitives de layout compartidas aprobadas (`PageContainer`, `PageHeader`, `PageSection`, `AppShell`), cuando correspondan

### Regla visual obligatoria

Toda reconstrucción debe evitar seguir ampliando el set legacy de primitives.

### Queda prohibido para nuevas migraciones

- introducir nuevo JSX usando `Button`, `Card` y `Modal` como primera opción
- mezclar la capa premium con bloques legacy sin un motivo de transición explícito
- dejar estilos hardcoded por pantalla si el patrón ya debería vivir en `ui-premium`
- reconstruir una vista sin resolver al mismo tiempo el wrapper raíz documentado en anti-patrones

### Criterio de aceptación del Golpe 2

- la pantalla usa `ui-premium` como contrato principal
- los wrappers raíz respetan el estándar de layout
- el componente visual es declarativo y corto
- los modales de la pantalla comparten el mismo lenguaje premium

### 5.4 Definición de terminado por pantalla

Una pantalla solo se considera migrada cuando cumple todo lo siguiente:

1. Tiene hook headless dedicado.
2. Su JSX no contiene lógica de flujo relevante.
3. Usa `ui-premium` como capa de renderizado principal.
4. Sus modales/overlays secundarios respetan el mismo estándar.
5. No viola `frontend-anti-patterns.md`.
6. Deja una topología más simple que la encontrada.

---

## 6. Roadmap Priorizado

### 6.1 Siguiente objetivo inmediato

### Prioridad 1: `screens/rutina-activa/FuerzaScreen.tsx`

Esta debe ser la siguiente pantalla a atacar de inmediato.

### Razones

- Es el corazón del flujo principal de la app.
- Es la pantalla con mayor impacto en percepción de producto.
- Ya tiene una base parcial (`useFuerzaStep`) que reduce el costo de terminación.
- Hoy sigue arrastrando deuda crítica: wrapper `max-w-2xl`, lógica derivada dentro del componente visual, UI bespoke fuera de `ui-premium` y dependencia de modales legacy.

### Objetivo exacto del siguiente sprint

1. Completar la extracción headless de `FuerzaScreen`.
2. Rehacer el JSX bajo `ui-premium`.
3. Establecer el patrón reusable de “step screen” para el resto de subpantallas de `Rutina Activa`.

### 6.2 Secuencia recomendada de ejecución

### Fase 2A: Core de Rutina Activa

1. `FuerzaScreen.tsx`
2. `CardioScreen.tsx`
3. `RestoScreen.tsx`
4. `PoseScreen.tsx`
5. `PostRoutineScreen.tsx`
6. `RutinaActivaScreen.tsx` como shell orquestador premium unificado

### Resultado esperado

- un lenguaje visual único para toda la sesión activa
- un contrato reusable para pasos tipo workout
- unificación de modales y sheets del flujo core

### 6.3 Fase 2B: Cierre del ecosistema Focus Mode

1. `WorkoutSummary.tsx`
2. `PerfilScreen.tsx`
3. `ExerciseDetailSheet.tsx`
4. `RoutineExitDialog`
5. `SetSelectorModal`
6. `PlateCalculatorModal`

### Resultado esperado

- todo `FocusModeLayer` queda coherente de punta a punta
- el usuario deja de percibir quiebres visuales entre sesión, resumen y perfil

### 6.4 Fase 2C: Nutrición profunda

1. `AddFoodView.tsx`
2. `FoodItemEditor.tsx`
3. `BarcodeScannerView.tsx`
4. `CustomFoodListView.tsx`
5. modales y overlays del flujo de plato

### Motivo

`NutritionMainView` ya tiene base parcial, pero el verdadero cuello de botella técnico y UX está en `AddFoodView`, que concentra demasiada lógica y demasiados estados en una sola superficie.

### 6.5 Fase 2D: Biblioteca

1. `RoutineViews.tsx`
2. `RoutineEditor.tsx`
3. `WeeklyPlannerView.tsx`
4. `ExerciseViews.tsx`
5. `RecipeViews.tsx`
6. `Biblioteca.tsx` como router premium consolidado

### Motivo

Biblioteca es un vertical grande, pero no debe preceder a `Rutina Activa` ni a la profundidad de `Nutrición`, porque su impacto diario en el core del producto es menor.

### 6.6 Fase 2E: Progreso

1. `Progreso.tsx`
2. `ProgressGallery.tsx`
3. `SessionHistoryList.tsx`
4. integración visual final con `WorkoutSummary`

### 6.7 Fase 2F: Bordes de acceso y entrada

1. `OnboardingScreen.tsx`
2. `LoginView.tsx`

### Motivo

Son importantes, pero no deben desplazar al core transaccional de entrenamiento y nutrición.

---

## 7. Plan de Ataque Inmediato

### 7.1 Sprint siguiente recomendado

### Sprint objetivo: “Rutina Activa / Fuerza Premium”

#### Entregables

1. Hook headless definitivo para `FuerzaScreen`.
2. Nueva composición premium de la pantalla.
3. Normalización del wrapper raíz según anti-patrones.
4. Definición de un mini patrón reusable para header de paso, tarjeta principal de input, CTA de completar serie, bloque contextual de “next up” y modal o sheet auxiliar del paso.

#### Valor estratégico

Este sprint no solo resuelve una pantalla. Define el molde para todo `Rutina Activa`.

### 7.2 Regla de dependencia

No se debe empezar `CardioScreen`, `PoseScreen` ni `RestoScreen` antes de cerrar `FuerzaScreen`, porque `Fuerza` es el patrón más rico y va a fijar el contrato de step screen, el sistema de CTA, la jerarquía de feedback y el tratamiento de overlays en focus mode.

---

## 8. Limpieza de Archivos y Deuda Muerta

### 8.1 Candidatos claros a eliminación o consolidación

| Archivo / grupo | Hallazgo | Acción recomendada |
|---|---|---|
| `screens/rutina-activa/flow/RoutinePreStartView.tsx` | No se encontraron referencias de uso en la auditoría actual. | Marcar como candidato directo a eliminación tras validación final. |
| `components/hoy/DailyNonNegotiablesWidget.tsx` | Existe junto a una versión `New`, pero no se detectaron imports activos desde la vista actual de `Hoy`. | Auditar y eliminar si la pantalla `Hoy` ya resolvió esa sección inline. |
| `components/hoy/DailyNonNegotiablesWidgetNew.tsx` | Misma situación que la versión legacy. | Auditar y eliminar o consolidar en un solo bloque reutilizable, pero no conservar ambas. |
| `screens/rutina-activa/AddExerciseModal.tsx` y `screens/biblioteca/routine-views/AddExerciseModal.tsx` | Colisión semántica de naming para dos modales distintos. | Renombrar por contexto y ownership, aunque ambos sigan existiendo. |
| `components/dialogs/*` + modales locales por feature | Topología fragmentada. | Reorganizar por vertical durante la migración: `feature/modals/` o `feature/sheets/`. |

### 8.2 Candidatos a congelación inmediata

### Primitives legacy

- `Button`
- `Card`
- `Modal`

### Regla

No se eliminan todavía, pero desde este documento quedan en **modo congelado**:

- no se crean usos nuevos en pantallas migradas
- solo se mantienen como soporte temporal para vistas aún no intervenidas

### 8.3 Limpieza de topología visual

Durante la migración de cada pantalla deben corregirse en el mismo PR:

- wrappers raíz incompatibles con el estándar de layout
- modales sueltos sin ownership claro
- duplicidad de nombres por feature
- primitives intermedias que ya no agregan valor frente a `ui-premium`

---

## 9. Reglas de Ejecución para el Equipo

### 9.1 Lo que sí se permite

- migrar por vertical completo
- introducir hooks headless dedicados
- promover patrones exitosos de una pantalla al resto del feature
- mover modales al ownership correcto durante la migración

### 9.2 Lo que deja de permitirse

- rediseñar una pantalla sin extraer antes su lógica
- tocar solo el estilo dejando el componente monolítico
- seguir agregando UI nueva sobre primitives legacy por costumbre
- abrir nuevos flujos visuales fuera de `ui-premium`
- dejar archivos huérfanos “por si acaso”

### 9.3 Regla de cierre por feature

Un vertical se considera cerrado solo cuando:

- su pantalla principal está migrada
- sus subpantallas críticas también están migradas
- sus modales secundarios están alineados
- los archivos duplicados o huérfanos quedaron eliminados o renombrados

---

## 10. Decisión Final

La siguiente intervención debe ser **`FuerzaScreen.tsx`**.

No por conveniencia, sino por arquitectura:

- es el centro del producto
- concentra la mejor oportunidad de fijar patrón
- ya tiene una base headless parcial
- desbloquea la migración ordenada del resto de `Rutina Activa`

Después de `FuerzaScreen`, el plan correcto es cerrar todo el vertical de `Rutina Activa`, luego `FocusMode`, después la profundidad de `Nutrición`, y solo entonces avanzar a `Biblioteca`, `Progreso` y bordes de entrada.

Ese es el orden que maximiza impacto, consistencia y velocidad de ejecución sin seguir acumulando deuda híbrida.

