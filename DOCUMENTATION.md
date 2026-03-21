# Fit Architect - Documentacion del Proyecto

## 1. Resumen
Fit Architect es una SPA de fitness y nutricion para registrar entrenamiento, comidas, progreso corporal y sesiones completas. La app esta hecha con React 18, TypeScript y Vite, y usa un estado global propio basado en `useReducer` + `createContext`.

El proyecto no usa una carpeta `src/`. La raiz del repositorio contiene la app, los reducers, los thunks, los selectors, los componentes y las vistas.

## 2. Stack y servicios
- `Frontend`: React 18 + TypeScript.
- `Build`: Vite.
- `Estilos`: Tailwind local via `tailwind.config.cjs` + `postcss.config.cjs`, con tokens CSS en `styles/tailwind.css`.
- `Auth y sync`: Supabase.
- `Persistencia local`: `localStorage` por usuario.
- `IA`: `@google/genai` para flujos de alimentos, recetas, imagenes y analisis de datos.
- `OCR/barcode`: `@zxing/browser`.
- `Graficas`: `recharts`.

## 3. Estructura real
- `App.tsx`: shell principal, navegacion, focus mode, lazy loading de pantallas y modales.
- `AppProvider.tsx`: compone el estado global y conecta los hooks de arranque/sync.
- `appAuth.ts`: sesion de Supabase y escucha de cambios de auth.
- `appBootstrap.ts`: hidratacion inicial, merge de datos estaticos y recuperacion local/remota.
- `appSync.ts`: autosave local + remoto con debounce y control de `syncStatus`.
- `appDailyReset.ts`: reset diario de progreso y habitos.
- `statePersistence.ts`: helpers puros para snapshot, firma, hidratacion y merge de estado.
- `services/supabaseService.ts`: seed, fetch y save del estado y de datos estaticos.
- `reducers/`: mutaciones por dominio.
- `actions/`, `thunks/`, `selectors/`: capa de flujo y consultas derivadas.
- `components/`: primitives y bloques reutilizables.
- `screens/`: vistas de alto nivel.
- `data-*.ts`: catalogos y datos base.

## 4. Arquitectura de estado
El `AppState` se divide en seis ramas:
- `profile`: identidad, metas y tema.
- `session`: estado efimero del flujo activo, resumenes y tareas diarias.
- `nutrition`: comidas, recetas, alimentos personalizados y macros consumidos.
- `workout`: rutinas, ejercicios, historial y agenda semanal.
- `progress`: metricas corporales, fotos y tracker de progreso.
- `ui`: pantalla activa, modales, toast, navegacion auxiliar y estado de sync.

La responsabilidad del arranque ya no vive toda en un solo archivo: `AppProvider.tsx` orquesta hooks separados para auth, bootstrap, sync y reset diario. El ultimo cambio gana entre estado local y remoto usando `lastUpdated`.

## 5. Flujo de usuario
1. El usuario entra y la app intenta leer la sesion de Supabase.
2. Si no hay `userName`, se muestra `OnboardingScreen`.
3. La navegacion principal muestra `Hoy`, `Nutricion`, `Biblioteca` y `Progreso`.
4. Si hay rutina activa, resumen de entrenamiento o modal de cardio, la app entra en focus mode y oculta la barra inferior.
5. Desde `Perfil` se ajustan tema, metas diarias y datos personales.

## 6. Persistencia y sincronizacion
- `localStorage` usa una clave por usuario: `fitArchitectState_<userId>`.
- Supabase guarda el snapshot completo en `user_state.state_json`.
- `statePersistence.ts` hidrata fechas, sets, metas y theme, y genera una firma serializada para evitar saves redundantes.
- El theme se guarda aparte en `fitArchitectTheme`.
- El `syncStatus` se normaliza al guardar para evitar bucles de autosave.
- Los datos estaticos se fusionan con el estado del usuario para no perder rutinas, ejercicios o alimentos nuevos.

## 7. Performance
- Las pantallas principales se cargan con `React.lazy`.
- `Progreso` y `Nutricion` siguen dividiendo carga interna en componentes y chunks separados.
- `vite.config.ts` separa vendors pesados como `react`, `recharts`, `@google/genai` y `@zxing/browser`.

## 8. Guia de desarrollo
- Para agregar una pantalla nueva, crea el componente en `screens/`, actualiza el tipo `Screen` en `types.ts` y agrega el import lazy en `App.tsx`.
- Para agregar estado global, define el tipo en `types.ts`, la accion en `actions/actionTypes.ts`, el creador en `actions/` y la logica en el reducer correspondiente.
- Para UI nueva, reutiliza `Button`, `Input`, `Modal`, `SectionHeader`, `PillTabs` y los tokens CSS existentes.
- Para vistas intensivas, usa `focus mode` si necesitan bloquear la navegacion y priorizar la experiencia de una sola tarea.

## 9. Variables y scripts
Variables de entorno:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `GEMINI_API_KEY` para funciones de IA al compilar o ejecutar con ese entorno disponible

Scripts:
- `npm install`
- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run lint`

## 10. Estado para Rediseño Total

La app ya no está en fase de "parches visuales".
La siguiente etapa recomendada es prepararla para un rediseño total del frontend.

Eso implica:

- redefinir por completo el lenguaje visual
- reconstruir el shell global
- rehacer los verticales principales sobre un sistema base común
- evitar cambios cosméticos aislados sobre la UI vieja

### Qué ya está listo

- la lógica principal ya es funcional
- `AddFoodView`, `RutinaActivaScreen` y `RoutineViews` ya fueron parcialmente divididos
- `types.ts` y `services/aiService.ts` ya son fachadas/barrels, así que el dominio está menos acoplado
- ya existe una base inicial de primitives reutilizables

### Qué sigue faltando antes de rediseñar pantallas en serio

- consolidar un design system premium obligatorio
- extraer un `AppShell` real desde `App.tsx`
- separar overlays, bottom nav y focus mode
- definir contratos visuales por feature
- reconstruir verticales sobre esa base

### Documento de ejecución

El plan operativo completo para esta siguiente fase vive en:

- [FRONTEND_REDESIGN_MASTER_PLAN.md](/D:/07.%20Apps/Fitness/FRONTEND_REDESIGN_MASTER_PLAN.md)

Ese documento divide el trabajo por fases, por vertical y por ownership paralelo para subagentes.
