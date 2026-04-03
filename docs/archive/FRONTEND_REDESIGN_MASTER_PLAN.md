> [!WARNING]
> ARCHIVADO. NO USAR COMO REFERENCIA. VER UI_MANIFEST.md y LOGIC_MANIFEST.md.

# FRONTEND_REDESIGN_MASTER_PLAN.md

> Estado del documento: Definitivo  
> Fecha: 2026-03-27  
> Rol emisor: Arquitectura Frontend / Tech Lead  
> Base de auditoria: `docs/active/PROJECT_OVERVIEW.md`, `docs/archive/APP_TOPOLOGY_2026-03-23.md`, `.windsurf/rules/frontend-anti-patterns.md` y revision estatica del arbol real del proyecto

---

## 1. PropÃ³sito

Este documento define el plan maestro del rediseÃ±o total del frontend de la SPA de fitness tras el cierre de la Fase 1. Su objetivo es convertir el trabajo ya realizado en un estÃ¡ndar operativo estricto, reducir deuda estructural y establecer el orden exacto de ejecuciÃ³n para el resto del rediseÃ±o.

La tesis de trabajo es simple:

1. La base visual ya existe.
2. La extracciÃ³n de lÃ³gica ya comenzÃ³ en varios verticales.
3. El proyecto todavÃ­a estÃ¡ en un estado hÃ­brido entre UI legacy, layout nuevo y adopciÃ³n mÃ­nima de `components/ui-premium/`.
4. A partir de este punto, no se permiten rediseÃ±os â€œa mediasâ€.

---

## 2. DiagnÃ³stico Ejecutivo

### 2.1 Lo que ya quedÃ³ resuelto en Fase 1

- Existe una base de design system premium en `components/ui-premium/` con `PremiumButton`, `SquishyCard` y `PremiumModal`.
- El shell global fue separado de `App.tsx` y ya opera con `AppShell`, `BottomNav`, `FocusModeLayer`, `GlobalOverlays`, `ThemeSync`, `PageContainer` y `PageHeader`.
- Ya existen primeras extracciones headless por vertical: `useHoyLogic`, `useNutritionLogic`, `screens/rutina-activa/hooks/useActiveRoutineState.ts`, `screens/rutina-activa/hooks/useFuerzaStep.ts`, `screens/rutina-activa/hooks/useInfoStepFlow.ts`, `screens/rutina-activa/hooks/useRestTimer.ts` y `screens/rutina-activa/hooks/useRoutineTimers.ts`.
- La pantalla `Hoy` ya fue intervenida.
- La pantalla principal de `NutriciÃ³n` ya fue intervenida parcialmente.
- La vista de `Calentamiento` dentro de `Rutina Activa` ya tiene una base mÃ¡s estable por separaciÃ³n de flujo.

### 2.2 Lo que todavÃ­a no estÃ¡ resuelto

- `ui-premium` existe, pero su adopciÃ³n real sigue siendo mÃ­nima. En la auditorÃ­a actual, el uso directo visible estÃ¡ concentrado prÃ¡cticamente en `ExerciseDetailSheet` mediante `PremiumModal`.
- Siguen conviviendo tres capas visuales: UI legacy (`Button`, `Card`, `Modal`, `SectionHeader`, `PillTabs`, etc.), layout nuevo (`PageContainer`, `PageHeader`, `AppShell`, etc.) y kit premium (`PremiumButton`, `SquishyCard`, `PremiumModal`).
- Varias pantallas conservan lÃ³gica de estado, side effects y composiciÃ³n visual en el mismo archivo.
- Persisten violaciones al estÃ¡ndar de layout documentado en `frontend-anti-patterns.md`, en especial wrappers raÃ­z con `max-w-2xl` o `max-w-3xl`.
- El sistema de modales sigue fragmentado entre `components/dialogs/` y modales locales por feature.

### 2.3 ConclusiÃ³n de arquitectura

El proyecto ya no necesita mÃ¡s â€œretoques visualesâ€. Necesita una migraciÃ³n controlada a un patrÃ³n Ãºnico:

**headless por feature + reconstrucciÃ³n premium por pantalla + limpieza topolÃ³gica progresiva**.

---

## 3. AuditorÃ­a de TopologÃ­a

### 3.1 Mapa de estado por mÃ³dulo

| MÃ³dulo / Pantalla | Estado | DiagnÃ³stico |
|---|---|---|
| `components/ui-premium/` | Base lista | El kit premium ya existe, pero todavÃ­a no es la capa dominante de renderizado. |
| Shell global (`AppShell`, `BottomNav`, `FocusModeLayer`, `GlobalOverlays`) | Intervenido | Infraestructura nueva ya separada y operativa. |
| `screens/Hoy.tsx` | Intervenida parcial | Ya consume `useHoyLogic`, pero el JSX sigue siendo bespoke y no estÃ¡ reconstruido sobre `ui-premium`. |
| `screens/Nutricion.tsx` | Parcial | Funciona como router local, pero sigue cargando subflujos con lÃ³gica acoplada en la vista. |
| `screens/nutricion/NutritionMainView.tsx` | Intervenida parcial | Ya consume `useNutritionLogic`, pero aÃºn depende de modales legacy y composiciÃ³n manual. |
| `screens/nutricion/AddFoodView.tsx` | Pendiente crÃ­tica | Alta concentraciÃ³n de `useState`, side effects, procesamiento async y modales en una sola vista. |
| `screens/rutina-activa/RutinaActivaScreen.tsx` | Parcial avanzada | La orquestaciÃ³n ya usa hooks dedicados, pero el ecosistema visual sigue hÃ­brido. |
| `screens/rutina-activa/InfoStepScreen.tsx` | Estable / parcial | Es la subvista mÃ¡s alineada con el trabajo de estabilizaciÃ³n del flujo de calentamiento. |
| `screens/rutina-activa/FuerzaScreen.tsx` | Pendiente prioritaria | Ya existe `useFuerzaStep`, pero la pantalla aÃºn mezcla lÃ³gica derivada, parsing, interacciÃ³n y JSX bespoke. |
| `screens/rutina-activa/CardioScreen.tsx` | Pendiente | Debe migrarse al mismo estÃ¡ndar de paso headless + visual premium. |
| `screens/rutina-activa/PoseScreen.tsx` | Pendiente | TodavÃ­a fuera del estÃ¡ndar premium definitivo. |
| `screens/rutina-activa/RestoScreen.tsx` | Pendiente | Falta unificar layout, contrato visual y timer headless. |
| `screens/rutina-activa/PostRoutineScreen.tsx` | Pendiente | Cierra el flujo core y debe compartir sistema visual con los demÃ¡s pasos activos. |
| `screens/WorkoutSummary.tsx` | Parcial | Alineada con foundation nueva, pero no consolidada bajo `ui-premium`. |
| `screens/PerfilScreen.tsx` | Pendiente | Mantiene estado local y persistencia en el mismo archivo visual. |
| `screens/OnboardingScreen.tsx` | Pendiente | Wizard completo aÃºn monolÃ­tico y con primitives legacy. |
| `screens/auth/LoginView.tsx` | Intervenida de foundation | Ya adoptÃ³ layout nuevo, pero no el estÃ¡ndar premium estricto ni extracciÃ³n headless. |
| `screens/Biblioteca.tsx` | Intervenida de foundation | AdoptÃ³ parte del nuevo lenguaje, pero sigue siendo un router grande con mucha composiciÃ³n manual. |
| Flujos de Biblioteca (`RecipeViews`, `RoutineViews`, `ExerciseViews`, `RoutineEditor`, `WeeklyPlannerView`) | Pendientes | Siguen fuera del nuevo estÃ¡ndar integral. |
| `screens/Progreso.tsx` | Intervenida de foundation | Ya usa `PageHeader`, pero aÃºn no entra en el contrato premium ni en el wrapper de layout oficial. |
| `screens/progreso/ProgressGallery.tsx` | Pendiente | Subflujo no consolidado. |
| `screens/progreso/SessionHistoryList.tsx` | Pendiente | Subflujo aÃºn fuera del patrÃ³n definitivo. |

### 3.2 Pantallas ya intervenidas

### Intervenidas con base real de Fase 1

- `Hoy`
- `NutriciÃ³n` principal
- infraestructura de shell global
- `Rutina Activa` a nivel orquestaciÃ³n
- `Calentamiento` como subflujo mÃ¡s estabilizado
- `LoginView`, `Biblioteca` y `Progreso` en nivel foundation/layout, no todavÃ­a en nivel premium final

### Intervenidas solo de forma parcial

- `Hoy`
- `NutritionMainView`
- `RutinaActivaScreen`
- `WorkoutSummary`
- `Biblioteca`
- `Progreso`

### 3.3 Deuda pendiente explÃ­cita

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

### Deuda de vertical NutriciÃ³n

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
- submodales de ediciÃ³n/selecciÃ³n

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

## 4. Hallazgos Estructurales que Deben Guiar el RediseÃ±o

### 4.1 La lÃ³gica headless estÃ¡ empezando, pero no es estÃ¡ndar todavÃ­a

Hoy existe una mezcla de estados: pantallas con hook principal claro (`Hoy`, `NutritionMainView`), pantallas con hook parcial (`FuerzaScreen`) y pantallas todavÃ­a monolÃ­ticas (`AddFoodView`, `PerfilScreen`, `OnboardingScreen`).

Esto es positivo como punto de partida, pero peligroso si no se formaliza ahora.

### 4.2 El kit premium ya existe, pero no gobierna el sistema

La auditorÃ­a muestra que el UI Kit premium todavÃ­a no es el contrato dominante de las nuevas pantallas. El riesgo inmediato es seguir construyendo â€œpantallas nuevasâ€ sobre primitives anteriores y terminar con una tercera capa visual permanente.

**DecisiÃ³n de arquitectura:** desde este documento, `components/ui-premium/` deja de ser experimental y pasa a ser obligatorio para toda reconstrucciÃ³n visual nueva.

### 4.3 Hay deuda topolÃ³gica de layout

El documento de anti-patrones prohÃ­be explÃ­citamente usar wrappers raÃ­z con `max-w-2xl` o `max-w-3xl` en pantallas principales. La auditorÃ­a real detecta esa deuda en varios archivos, incluyendo:

- `screens/rutina-activa/FuerzaScreen.tsx`
- `screens/Progreso.tsx`
- `screens/Biblioteca.tsx`
- `screens/biblioteca/ExerciseViews.tsx`
- `screens/nutricion/AddFoodView.tsx`
- `screens/progreso/SessionHistoryList.tsx`

Esto no es un detalle visual menor. Es deuda de layout y debe eliminarse durante la migraciÃ³n de cada pantalla.

### 4.4 El sistema de modales sigue fragmentado

Hoy conviven modales globales en `components/dialogs/`, modales locales en `screens/rutina-activa/`, modales locales en `screens/biblioteca/routine-views/` y overlays incrustados en verticales de nutriciÃ³n.

Esto complica ownership, naming y consistencia visual. El plan maestro debe absorber esta fragmentaciÃ³n durante la migraciÃ³n por feature.

---

## 5. El EstÃ¡ndar Obligatorio a Partir de Ahora

### 5.1 Regla maestra

**Toda pantalla nueva o rediseÃ±ada se ejecuta en dos golpes estrictos y secuenciales.**

No hay excepciones para â€œsolo retocar JSXâ€, â€œsolo mejorar estilosâ€ o â€œsolo mover un modalâ€.

### 5.2 Golpe 1: LÃ³gica

### Objetivo

Extraer toda la lÃ³gica de estado, derivaciÃ³n y asincronÃ­a fuera del componente visual hacia un Custom Hook headless y aislado.

### QuÃ© debe salir del archivo visual

- `useState`
- `useEffect`
- `useMemo`
- `useCallback`
- parsing/formateo ligado al flujo
- selecciÃ³n de datos de contexto
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

### Criterio de aceptaciÃ³n del Golpe 1

- la pantalla puede renderizarse leyendo un solo objeto de estado/control
- no hay llamadas async directas en el JSX
- no hay acceso directo al contexto global dentro del componente visual, salvo casos excepcionales ya encapsulados
- la lÃ³gica de navegaciÃ³n interna y modales estÃ¡ centralizada en el hook

### 5.3 Golpe 2: Visual

### Objetivo

Reconstruir la pantalla consumiendo exclusivamente:

- el hook headless creado en el Golpe 1
- `components/ui-premium/`
- primitives de layout compartidas aprobadas (`PageContainer`, `PageHeader`, `PageSection`, `AppShell`), cuando correspondan

### Regla visual obligatoria

Toda reconstrucciÃ³n debe evitar seguir ampliando el set legacy de primitives.

### Queda prohibido para nuevas migraciones

- introducir nuevo JSX usando `Button`, `Card` y `Modal` como primera opciÃ³n
- mezclar la capa premium con bloques legacy sin un motivo de transiciÃ³n explÃ­cito
- dejar estilos hardcoded por pantalla si el patrÃ³n ya deberÃ­a vivir en `ui-premium`
- reconstruir una vista sin resolver al mismo tiempo el wrapper raÃ­z documentado en anti-patrones

### Criterio de aceptaciÃ³n del Golpe 2

- la pantalla usa `ui-premium` como contrato principal
- los wrappers raÃ­z respetan el estÃ¡ndar de layout
- el componente visual es declarativo y corto
- los modales de la pantalla comparten el mismo lenguaje premium

### 5.4 DefiniciÃ³n de terminado por pantalla

Una pantalla solo se considera migrada cuando cumple todo lo siguiente:

1. Tiene hook headless dedicado.
2. Su JSX no contiene lÃ³gica de flujo relevante.
3. Usa `ui-premium` como capa de renderizado principal.
4. Sus modales/overlays secundarios respetan el mismo estÃ¡ndar.
5. No viola `frontend-anti-patterns.md`.
6. Deja una topologÃ­a mÃ¡s simple que la encontrada.

---

## 6. Roadmap Priorizado

### 6.1 Siguiente objetivo inmediato

### Prioridad 1: `screens/rutina-activa/FuerzaScreen.tsx`

Esta debe ser la siguiente pantalla a atacar de inmediato.

### Razones

- Es el corazÃ³n del flujo principal de la app.
- Es la pantalla con mayor impacto en percepciÃ³n de producto.
- Ya tiene una base parcial (`useFuerzaStep`) que reduce el costo de terminaciÃ³n.
- Hoy sigue arrastrando deuda crÃ­tica: wrapper `max-w-2xl`, lÃ³gica derivada dentro del componente visual, UI bespoke fuera de `ui-premium` y dependencia de modales legacy.

### Objetivo exacto del siguiente sprint

1. Completar la extracciÃ³n headless de `FuerzaScreen`.
2. Rehacer el JSX bajo `ui-premium`.
3. Establecer el patrÃ³n reusable de â€œstep screenâ€ para el resto de subpantallas de `Rutina Activa`.

### 6.2 Secuencia recomendada de ejecuciÃ³n

### Fase 2A: Core de Rutina Activa

1. `FuerzaScreen.tsx`
2. `CardioScreen.tsx`
3. `RestoScreen.tsx`
4. `PoseScreen.tsx`
5. `PostRoutineScreen.tsx`
6. `RutinaActivaScreen.tsx` como shell orquestador premium unificado

### Resultado esperado

- un lenguaje visual Ãºnico para toda la sesiÃ³n activa
- un contrato reusable para pasos tipo workout
- unificaciÃ³n de modales y sheets del flujo core

### 6.3 Fase 2B: Cierre del ecosistema Focus Mode

1. `WorkoutSummary.tsx`
2. `PerfilScreen.tsx`
3. `ExerciseDetailSheet.tsx`
4. `RoutineExitDialog`
5. `SetSelectorModal`
6. `PlateCalculatorModal`

### Resultado esperado

- todo `FocusModeLayer` queda coherente de punta a punta
- el usuario deja de percibir quiebres visuales entre sesiÃ³n, resumen y perfil

### 6.4 Fase 2C: NutriciÃ³n profunda

1. `AddFoodView.tsx`
2. `FoodItemEditor.tsx`
3. `BarcodeScannerView.tsx`
4. `CustomFoodListView.tsx`
5. modales y overlays del flujo de plato

### Motivo

`NutritionMainView` ya tiene base parcial, pero el verdadero cuello de botella tÃ©cnico y UX estÃ¡ en `AddFoodView`, que concentra demasiada lÃ³gica y demasiados estados en una sola superficie.

### 6.5 Fase 2D: Biblioteca

1. `RoutineViews.tsx`
2. `RoutineEditor.tsx`
3. `WeeklyPlannerView.tsx`
4. `ExerciseViews.tsx`
5. `RecipeViews.tsx`
6. `Biblioteca.tsx` como router premium consolidado

### Motivo

Biblioteca es un vertical grande, pero no debe preceder a `Rutina Activa` ni a la profundidad de `NutriciÃ³n`, porque su impacto diario en el core del producto es menor.

### 6.6 Fase 2E: Progreso

1. `Progreso.tsx`
2. `ProgressGallery.tsx`
3. `SessionHistoryList.tsx`
4. integraciÃ³n visual final con `WorkoutSummary`

### 6.7 Fase 2F: Bordes de acceso y entrada

1. `OnboardingScreen.tsx`
2. `LoginView.tsx`

### Motivo

Son importantes, pero no deben desplazar al core transaccional de entrenamiento y nutriciÃ³n.

---

## 7. Plan de Ataque Inmediato

### 7.1 Sprint siguiente recomendado

### Sprint objetivo: â€œRutina Activa / Fuerza Premiumâ€

#### Entregables

1. Hook headless definitivo para `FuerzaScreen`.
2. Nueva composiciÃ³n premium de la pantalla.
3. NormalizaciÃ³n del wrapper raÃ­z segÃºn anti-patrones.
4. DefiniciÃ³n de un mini patrÃ³n reusable para header de paso, tarjeta principal de input, CTA de completar serie, bloque contextual de â€œnext upâ€ y modal o sheet auxiliar del paso.

#### Valor estratÃ©gico

Este sprint no solo resuelve una pantalla. Define el molde para todo `Rutina Activa`.

### 7.2 Regla de dependencia

No se debe empezar `CardioScreen`, `PoseScreen` ni `RestoScreen` antes de cerrar `FuerzaScreen`, porque `Fuerza` es el patrÃ³n mÃ¡s rico y va a fijar el contrato de step screen, el sistema de CTA, la jerarquÃ­a de feedback y el tratamiento de overlays en focus mode.

---

## 8. Limpieza de Archivos y Deuda Muerta

### 8.1 Candidatos claros a eliminaciÃ³n o consolidaciÃ³n

| Archivo / grupo | Hallazgo | AcciÃ³n recomendada |
|---|---|---|
| `screens/rutina-activa/flow/RoutinePreStartView.tsx` | No se encontraron referencias de uso en la auditorÃ­a actual. | Marcar como candidato directo a eliminaciÃ³n tras validaciÃ³n final. |
| `components/hoy/DailyNonNegotiablesWidget.tsx` | Existe junto a una versiÃ³n `New`, pero no se detectaron imports activos desde la vista actual de `Hoy`. | Auditar y eliminar si la pantalla `Hoy` ya resolviÃ³ esa secciÃ³n inline. |
| `components/hoy/DailyNonNegotiablesWidgetNew.tsx` | Misma situaciÃ³n que la versiÃ³n legacy. | Auditar y eliminar o consolidar en un solo bloque reutilizable, pero no conservar ambas. |
| `screens/rutina-activa/AddExerciseModal.tsx` y `screens/biblioteca/routine-views/AddExerciseModal.tsx` | ColisiÃ³n semÃ¡ntica de naming para dos modales distintos. | Renombrar por contexto y ownership, aunque ambos sigan existiendo. |
| `components/dialogs/*` + modales locales por feature | TopologÃ­a fragmentada. | Reorganizar por vertical durante la migraciÃ³n: `feature/modals/` o `feature/sheets/`. |

### 8.2 Candidatos a congelaciÃ³n inmediata

### Primitives legacy

- `Button`
- `Card`
- `Modal`

### Regla

No se eliminan todavÃ­a, pero desde este documento quedan en **modo congelado**:

- no se crean usos nuevos en pantallas migradas
- solo se mantienen como soporte temporal para vistas aÃºn no intervenidas

### 8.3 Limpieza de topologÃ­a visual

Durante la migraciÃ³n de cada pantalla deben corregirse en el mismo PR:

- wrappers raÃ­z incompatibles con el estÃ¡ndar de layout
- modales sueltos sin ownership claro
- duplicidad de nombres por feature
- primitives intermedias que ya no agregan valor frente a `ui-premium`

---

## 9. Reglas de EjecuciÃ³n para el Equipo

### 9.1 Lo que sÃ­ se permite

- migrar por vertical completo
- introducir hooks headless dedicados
- promover patrones exitosos de una pantalla al resto del feature
- mover modales al ownership correcto durante la migraciÃ³n

### 9.2 Lo que deja de permitirse

- rediseÃ±ar una pantalla sin extraer antes su lÃ³gica
- tocar solo el estilo dejando el componente monolÃ­tico
- seguir agregando UI nueva sobre primitives legacy por costumbre
- abrir nuevos flujos visuales fuera de `ui-premium`
- dejar archivos huÃ©rfanos â€œpor si acasoâ€

### 9.3 Regla de cierre por feature

Un vertical se considera cerrado solo cuando:

- su pantalla principal estÃ¡ migrada
- sus subpantallas crÃ­ticas tambiÃ©n estÃ¡n migradas
- sus modales secundarios estÃ¡n alineados
- los archivos duplicados o huÃ©rfanos quedaron eliminados o renombrados

---

## 10. DecisiÃ³n Final

La siguiente intervenciÃ³n debe ser **`FuerzaScreen.tsx`**.

No por conveniencia, sino por arquitectura:

- es el centro del producto
- concentra la mejor oportunidad de fijar patrÃ³n
- ya tiene una base headless parcial
- desbloquea la migraciÃ³n ordenada del resto de `Rutina Activa`

DespuÃ©s de `FuerzaScreen`, el plan correcto es cerrar todo el vertical de `Rutina Activa`, luego `FocusMode`, despuÃ©s la profundidad de `NutriciÃ³n`, y solo entonces avanzar a `Biblioteca`, `Progreso` y bordes de entrada.

Ese es el orden que maximiza impacto, consistencia y velocidad de ejecuciÃ³n sin seguir acumulando deuda hÃ­brida.


