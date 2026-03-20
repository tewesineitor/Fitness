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
- `AppProvider.tsx`: bootstrap de auth, carga de estado, merge de datos estaticos, reset diario y sync.
- `statePersistence.ts`: helpers puros para hidratar, guardar y fusionar estado.
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

El provider mantiene una referencia al estado actual, serializa cambios para `localStorage` y hace debounce para guardar en Supabase. El ultimo cambio gana entre estado local y remoto usando `lastUpdated`.

## 5. Flujo de usuario
1. El usuario entra y la app intenta leer la sesion de Supabase.
2. Si no hay `userName`, se muestra `OnboardingScreen`.
3. La navegacion principal muestra `Hoy`, `Nutricion`, `Biblioteca` y `Progreso`.
4. Si hay rutina activa, resumen de entrenamiento o modal de cardio, la app entra en focus mode y oculta la barra inferior.
5. Desde `Perfil` se ajustan tema, metas diarias y datos personales.

## 6. Persistencia y sincronizacion
- `localStorage` usa una clave por usuario: `fitArchitectState_<userId>`.
- Supabase guarda el snapshot completo en `user_state.state_json`.
- `statePersistence.ts` hidrata fechas, sets, metas y theme.
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
