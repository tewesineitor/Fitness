# Project Overview

## Resumen
Fit Architect es una SPA de fitness y nutricion construida con React, TypeScript y Vite. La app combina seguimiento diario, nutricion, biblioteca de rutinas y recetas, progreso corporal y sincronizacion con Supabase.

## Stack actual
- React 18 + TypeScript
- Vite
- Tailwind local con tokens compartidos
- Supabase para auth y sync
- localStorage por usuario como respaldo rapido
- `@google/genai` para flujos asistidos por IA
- `@zxing/browser` para barcode scanning
- `recharts` para visualizaciones

## Estructura real del repo
La app vive en la raiz del repositorio, no en `src/`.

Directorios clave:
- `components/`: primitives, layout y bloques reutilizables
- `components/ui-premium/`: design system premium y bloques visuales nuevos
- `screens/`: vistas de alto nivel y subflujos por vertical
- `actions/`, `reducers/`, `selectors/`, `thunks/`: flujo de estado global
- `services/`: integraciones externas y servicios
- `hooks/`: hooks compartidos y controladores de feature
- `styles/`: estilos base y tokens
- `docs/active/`: documentacion vigente
- `docs/archive/`: snapshots historicos y docs descontinuadas

## Estado global
El estado principal se organiza en ramas de dominio:
- `profile`
- `session`
- `nutrition`
- `workout`
- `progress`
- `ui`

La app arranca desde `AppProvider.tsx` y coordina auth, bootstrap, persistencia local y sincronizacion remota.

## Navegacion actual
La app usa un router de estado propio desde `App.tsx`.

Tabs principales activas:
- `Hoy`
- `Nutricion`
- `Biblioteca`
- `Progreso`
- `Playground` como superficie interna para auditar el design system

Cuando existe una rutina activa, resumen de sesion, flujo cardio o perfil abierto, la experiencia entra en `FocusModeLayer` y oculta la navegacion inferior.

## UI y layout
La infraestructura visual actual se apoya en:
- `components/layout/AppShell.tsx`
- `components/layout/BottomNav.tsx`
- `components/layout/FocusModeLayer.tsx`
- `components/layout/GlobalOverlays.tsx`

El trabajo visual nuevo debe apoyarse prioritariamente en `components/ui-premium/` para evitar seguir ampliando la capa legacy.

## Reglas practicas
- `README.md` es la puerta de entrada para setup y comandos.
- `docs/active/` es la fuente vigente de documentacion interna.
- `docs/archive/` contiene material historico y no debe usarse como fuente de verdad sin validar contra el arbol actual.
- Evita agregar nuevos Markdown sueltos en la raiz del repo.

## Documentos activos relacionados
- `docs/active/FRONTEND_REDESIGN_MASTER_PLAN.md`
- `.windsurf/rules/frontend-anti-patterns.md`
