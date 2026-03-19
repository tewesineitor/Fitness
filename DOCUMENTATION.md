# Fit Architect - Documentación del Proyecto

## 1. Introducción
**Fit Architect** es una aplicación web progresiva (PWA/SPA) diseñada para la gestión integral del fitness, nutrición y progreso personal. Su objetivo es permitir a los usuarios llevar un control detallado de sus rutinas de entrenamiento, ingesta calórica y de macronutrientes, evolución antropométrica y hábitos diarios, todo en una interfaz moderna, rápida y de alto contraste.

## 2. Arquitectura Técnica y Stack
*   **Frontend:** React 18 (Functional Components, Hooks).
*   **Lenguaje:** TypeScript (Tipado estricto para modelos de datos y estado).
*   **Build Tool:** Vite.
*   **Estilos:** Tailwind CSS (Utility-first, diseño responsivo, soporte nativo para temas claro/oscuro/sistema).
*   **Backend / Base de Datos:** Supabase (Autenticación de usuarios y almacenamiento de datos en la nube).
*   **Almacenamiento Local:** `localStorage` para persistencia offline y carga rápida (Optimistic UI).

## 3. Estructura del Proyecto
El proyecto sigue una estructura modular basada en dominios:
*   `/src/actions/`: Creadores de acciones (Action Creators) y Thunks para la lógica asíncrona.
*   `/src/reducers/`: Reducers que manejan las mutaciones del estado global, divididos por dominio (`ui`, `profile`, `progress`, `workout`, `nutrition`, `session`).
*   `/src/contexts/`: Configuración del `AppContext` que provee el estado global y la función `dispatch` a toda la app.
*   `/src/components/`: Componentes UI reutilizables (Botones, Inputs, Iconos, Modales, Tarjetas).
*   `/src/screens/`: Vistas principales de la aplicación (Hoy, Nutrición, Entrenamiento, Progreso, Perfil, Onboarding).
*   `/src/services/`: Integración con servicios externos (ej. `supabaseClient.ts`).
*   `/src/types.ts`: Definiciones de interfaces y tipos de TypeScript (El "contrato" de los datos).
*   `/src/data.ts`: Datos estáticos iniciales (ej. base de datos de alimentos por defecto, rutinas predefinidas).

## 4. Gestión del Estado (State Management)
La aplicación utiliza un patrón similar a Redux pero implementado nativamente con `React.useReducer` y `React.createContext`.
El estado global (`AppState`) se divide en 6 ramas principales:

1.  **`profile`**: Datos del usuario (nombre, mantra, metas diarias de macros/calorías, preferencias de tema).
2.  **`session`**: Estado efímero de la sesión actual (rutina activa, progreso del entrenamiento en vivo, hábitos diarios completados, temporizadores).
3.  **`nutrition`**: Registro de comidas (`loggedMeals`), alimentos personalizados, recetas creadas por el usuario y macros consumidos en el día.
4.  **`workout`**: Historial de entrenamientos, rutinas personalizadas creadas por el usuario y biblioteca de ejercicios.
5.  **`progress`**: Historial de métricas corporales (peso, medidas antropométricas, fotos de progreso).
6.  **`ui`**: Estado de la interfaz (pantalla activa, modales abiertos, notificaciones/toasts, logros desbloqueados).

**Flujo de Sincronización:**
1. El usuario realiza una acción (ej. registrar peso).
2. Se dispara un `dispatch` que actualiza el estado local inmediatamente (UI rápida).
3. Un `useEffect` en `AppProvider` detecta el cambio, guarda en `localStorage` y hace un *debounce* de 2 segundos para sincronizar el estado completo con Supabase de forma transparente en segundo plano.

## 5. Flujo de Usuario (User Flow)
1.  **Autenticación:** El usuario inicia sesión vía Supabase Auth.
2.  **Onboarding:** Si el perfil no tiene un nombre registrado (`state.profile.userName === ''`), se muestra la pantalla de `OnboardingScreen`. Aquí el usuario ingresa su nombre, medidas iniciales y define sus metas de macronutrientes.
3.  **Navegación Principal (Bottom Nav):**
    *   **Hoy:** Dashboard diario. Muestra el resumen de macros, hábitos diarios (sueño, pasos) y permite iniciar la rutina programada para el día.
    *   **Nutrición:** Buscador de alimentos, escáner/registro de comidas, creación de recetas y visualización del progreso calórico del día.
    *   **Entrenamiento:** Biblioteca de rutinas, creador de rutinas personalizadas e historial de sesiones. Al iniciar una rutina, la app entra en un "Modo Enfoque" (Focus Mode) que oculta la navegación y guía paso a paso.
    *   **Progreso:** Tarjetas de evolución anatómica (peso, medidas), gráficos de progreso y registro de nuevas medidas.
4.  **Perfil (Ajustes):** Accesible desde la cabecera. Permite cambiar el tema visual, ajustar las metas de macros (con modos predefinidos: Estricto, Balanceado, Flexible), editar el mantra personal, reiniciar el onboarding o cerrar sesión.

## 6. Base de Datos (Supabase)
La aplicación utiliza Supabase como Backend-as-a-Service (BaaS).
*   **Auth:** Maneja la creación de cuentas y el inicio de sesión.
*   **Database:** La aplicación guarda el estado del usuario (`AppState`) asociado a su `user_id`. 
    *   *Lógica de inicialización:* Al cargar la app, `AppProvider` intenta recuperar el estado desde Supabase. Si falla o no hay conexión, hace un fallback a `localStorage`. 
    *   *Fusión de datos (Merge):* Las entidades estáticas (ejercicios base, alimentos base) se combinan con los datos generados por el usuario para asegurar que las actualizaciones de la app (nuevos ejercicios añadidos por los desarrolladores) no borren ni sobreescriban los datos personalizados del usuario.

## 7. Guía para Continuar el Desarrollo
*   **Agregar una nueva pantalla:**
    1. Crea el componente en `/src/screens/`.
    2. Añade el ID de la pantalla al tipo `Screen` en `types.ts`.
    3. Regístrala en el array `screens` dentro de `App.tsx`.
*   **Modificar el estado global:**
    1. Define la nueva propiedad en la interfaz correspondiente en `types.ts`.
    2. Crea el tipo de acción en `actions/actionTypes.ts`.
    3. Crea el Action Creator en `actions/`.
    4. Maneja la acción en el reducer correspondiente dentro de `/reducers/`.
*   **Estilos y UI:**
    *   Utiliza los componentes base existentes (`Button`, `Input`, `FloatingDock`) para mantener la consistencia.
    *   Los colores principales están definidos en la configuración de Tailwind (ej. `brand-accent`, `surface-bg`, `text-primary`). Usa estas variables CSS para soportar el modo oscuro/claro automáticamente.
*   **Modo Enfoque (Focus Mode):**
    *   Si creas una vista que requiere toda la atención del usuario (como un entrenamiento activo o un resumen post-entrenamiento), asegúrate de que la variable `isFocusMode` en `App.tsx` la evalúe como `true` para ocultar la navegación inferior y otros elementos distractores.
