# APP_TOPOLOGY.md
> Diagnóstico holístico de la capa de presentación · Generado: 2026-03-23

---

## 1. Modelo de Enrutamiento

La app **no usa React Router**. Implementa un router de estado propio:

```
App.tsx
  ├── profile.userName === '' → <OnboardingScreen />          [z-0, fullscreen]
  ├── isFocusMode === true    → <FocusModeLayer />             [z-220, fullscreen overlay]
  │     (activeRoutine | workoutSummaryData | cardioLogData | isProfileOpen)
  └── Normal                 → <AppShell> + <BottomNav>
        ├── 'Hoy'            → <HoyScreen />          (default)
        ├── 'Nutrición'      → <NutricionScreen />
        ├── 'Biblioteca'     → <BibliotecaScreen />
        └── 'Progreso'       → <ProgresoScreen />
```

**Navegación:** `dispatch(actions.setActiveScreen(screen: Screen))`  
**Lazy loading:** todos los tabs principales se cargan con `React.lazy` + `Suspense`.

---

## 2. Flujos de Usuario

### Flujo A — First Run (Onboarding)
```
App detecta userName === '' → OnboardingScreen (3 pasos wizard)
  └─► Paso 1: Nombre de usuario
  └─► Paso 2: Medidas iniciales (peso, cintura, caderas) [opcional]
  └─► Paso 3: Metas diarias (kcal, proteína, carbs, grasas)
  └─► Finalizar → dispatch(updateProfile) → App redirige a 'Hoy'
```

### Flujo B — Autenticación
```
AuthGate (component/layout/AuthGate.tsx)
  └─► Sin sesión Supabase → LoginView (screens/auth/LoginView.tsx)
        ├─► Login: email + contraseña
        ├─► Registro: email + contraseña
        └─► Reenviar confirmación de email
```

### Flujo C — Sesión de Entrenamiento Activa
```
Hoy.tsx / Biblioteca.tsx → dispatch(setActiveRoutine)
  └─► FocusModeLayer (z-220)
        └─► RutinaActivaScreen
              ├─► RoutineLaunchScreen    (pre-start: preview de la rutina)
              └─► [isStarted = true]
                    └─► RoutineStepRenderer (dispatcher de pasos)
                          ├─► FuerzaScreen        (tipo: 'exercise')
                          ├─► CardioScreen         (tipo: 'cardio' — método CACO)
                          ├─► PoseScreen           (tipo: 'pose' | 'meditation')
                          ├─► InfoStepScreen       (tipo: 'warmup' | 'cooldown')
                          ├─► RestoScreen          (descanso entre series)
                          └─► PostRoutineScreen    (fin del bloque principal)
              └─► [finish] → WorkoutSummaryScreen (en FocusModeLayer)
```

### Flujo D — Actividad Libre (Cardio / Senderismo / Rucking desde Hoy)
```
Hoy.tsx → "Explorar" → openActivityLog(type)
  ├─► type: 'run' | 'hike' → CardioLibreLogModal (dialog inline en Hoy)
  │       └─► Guardar → dispatch(saveCardioLogThunk)
  │               └─► FocusModeLayer → ProgressiveCardioLogModal (log post-sesión)
  │                       └─► WorkoutSummaryScreen
  └─► type: 'rucking' → RuckingSession (inline en Hoy, reemplaza la vista)
          ├─► setup:   peso de mochila + tiempo objetivo
          ├─► active:  timer en vivo + kcal estimadas
          └─► summary: resumen → dispatch(finishRucking)
```

### Flujo E — Perfil
```
Hoy.tsx → IconButton(UserCircle) → dispatch(openProfile)
  └─► FocusModeLayer → PerfilScreen
        ├─► Identidad: nombre, mantra personal
        ├─► MacroSettings: kcal, proteína, carbs, grasas (con distribución automática)
        ├─► AccountSection: reiniciar onboarding, cerrar sesión (Supabase)
        └─► Guardar → dispatch(updateProfile) → onClose
```

---

## 3. Inventario de Pantallas Principales

### 3.1 `screens/OnboardingScreen.tsx`
| Atributo | Detalle |
|---|---|
| Tipo | Pantalla fullscreen (fixed inset-0, z-200) |
| Acceso | Automático si `profile.userName === ''` |
| Lógica | Wizard de 3 pasos; valida nombre; despacha `updateProfile` + `addMetricEntry` |
| Estado local | `step`, `name`, `weight`, `waist`, `hips`, `goals` |
| Salida | App auto-redirige a `Hoy` al completar |

---

### 3.2 `screens/auth/LoginView.tsx`
| Atributo | Detalle |
|---|---|
| Tipo | Vista de autenticación (gestionada por `AuthGate`) |
| Lógica | Toggle login/registro; `supabase.auth.signInWithPassword` / `signUp`; reenvío de confirmación |
| Estado local | `email`, `password`, `isLogin`, `loading`, `error`, `showResend` |

---

### 3.3 `screens/Hoy.tsx` — **Panel Diario**
| Atributo | Detalle |
|---|---|
| Tipo | Tab principal (bottom nav) |
| Hook principal | `useHoyLogic` |
| Secciones UI | Cabecera (fecha + perfil), Innegociables chips (proteína / kcal / sueño / pasos), Misión del Día, Explorar, Widget Nutrición |
| Lógica | Calcula `tasksToDisplay` para el día actual; muestra tarea primaria + secundarias; progreso por tarea; hábitos con status semáforo |
| Modales inline | `CardioLibreLogModal` (run / hike / rucking) |
| Sub-vista inline | `RuckingSession` (reemplaza el árbol completo cuando `isRuckingActive`) |
| Navegación OUT | → Perfil (FocusModeLayer), → Nutrición, → Biblioteca/Planner, → RutinaActiva |

#### Subsección: `RuckingSession` (inline)
- **Setup:** stepper de peso (kg) + stepper de tiempo objetivo
- **Active:** cronómetro en vivo, kcal estimadas en tiempo real, pause/resume
- **Summary:** resumen con duración, peso, kcal → `onFinish`

---

### 3.4 `screens/Nutricion.tsx` — **Router de Nutrición**
| Vista | Archivo | Descripción |
|---|---|---|
| `'main'` | `NutritionMainView.tsx` | Dashboard nutricional |
| `'add'` | `AddFoodView.tsx` | Constructor de plato |

#### 3.4.1 `screens/nutricion/NutritionMainView.tsx`
| Atributo | Detalle |
|---|---|
| Hook | `useNutritionLogic` |
| UI | Date navigator, MacroArcGauge (kcal), barras P/C/G, MealLog (lista de comidas) |
| Lógica | Navega entre fechas; edita/elimina comidas; muestra resumen nutricional |
| Modales | `MealEditorModal`, `ConfirmationDialog` (eliminar) |
| Componentes clave | `NutritionDayNavigator`, `MacroBarSystem`, `MealLog`, `NutritionSummary`, `WeeklySummaryChart` |

#### 3.4.2 `screens/nutricion/AddFoodView.tsx` — **Constructor de Plato**
| Atributo | Detalle |
|---|---|
| Lógica | Búsqueda con filtros (MainCategory + FoodCategory); gestión del plato (AddedFood[]); escaneo de código de barras; análisis de foto por IA; registro de comida con tipo de comida y timing |
| Sub-vistas internas | `BarcodeScannerView`, `FoodItemEditor` (crear/editar alimento), `FoodCatalogView` |
| Modales | `PortionEditorModal`, `DataCorrectionModal`, `AddFoodImageSourceModal`, `RawDataDebugModal`, `ConfirmationDialog` |
| Overlays | `AddFoodProcessingOverlay` (spinner IA) |
| Componente clave | `PlateSummary` (dock colapsable con macros totales del plato) |

#### 3.4.3 `screens/nutricion/BarcodeScannerView.tsx`
- Activa cámara; decodifica EAN/UPC; llama a Open Food Facts API; retorna `FoodItem` para confirmación.

#### 3.4.4 `screens/nutricion/FoodItemEditor.tsx`
- Formulario completo: nombre, marca, porción, macros (kcal/P/C/G); modo crear / editar / verificar-scan.

#### 3.4.5 `screens/nutricion/CustomFoodListView.tsx`
- Lista CRUD de alimentos personalizados del usuario; abre `FoodItemEditor` para editar; `ConfirmationDialog` para eliminar.

---

### 3.5 `screens/Biblioteca.tsx` — **Router de Biblioteca**
| Atributo | Detalle |
|---|---|
| Tabs | Rutinas · Recetas · Ejercicios |
| Estado router | `currentFlow: FlowState` — `'none'` / `'recipe'` / `'routine'` / `'exercise'` |
| Deep linking | Escucha `state.ui.navigationTarget === 'library-planner'` para saltar al planner |

#### Dashboard (`currentFlow.type === 'none'`)

**Tab Recetas:**
- Scroll horizontal de `RecipePreviewCard` (favoritas o sugeridas)
- CTA "Crear Receta" → lanza flow recipe/new

**Tab Rutinas:**
- Mini-calendario semanal con indicadores de días activos
- Lista de rutinas agrupadas por tipo (Fuerza / Cardio / Mental & Movilidad)
- `RoutineCard` por rutina; CTA crear; `ConfirmationDialog` para eliminar

**Tab Ejercicios:**
- SearchBar + grid de categorías (Fuerza, Calentamiento, Movilidad, Estiramientos, Postura)
- Resultados de búsqueda en tiempo real

#### 3.5.1 Flow Recipe → `screens/biblioteca/RecipeViews.tsx`
| Sub-vista | Lógica |
|---|---|
| Lista de recetas | Grid de tarjetas; favoritas primero; filtro por tipo |
| `RecipeDetailView` | Detalle completo: ingredientes, macros, instrucciones; quick-log; editar; ir a Nutrición |
| `RecipeEditorView` | Editor CRUD: nombre, ingredientes (con buscador), porciones, imagen |
| `RecipeGeneratorModal` | Input de texto → `generateRecipeThunk` (IA) → preview → guardar |

#### 3.5.2 Flow Routine → `screens/biblioteca/RoutineViews.tsx` → `RoutinesManagementFlow.tsx`
| Sub-vista | Lógica |
|---|---|
| `RoutinesListView` | Lista de todas las rutinas del usuario; seleccionar para editar |
| `RoutineEditor` | Editor completo: nombre, tipo, pasos (warmup/exercise/cooldown/pose/meditation), sets/reps/RIR/descanso |
| `RoutineSelectorModal` | Modal para seleccionar rutina existente (ej. al asignar al planner) |
| `WeeklyPlannerView` | Calendario semanal; asignar rutina a día/franja horaria (mañana/tarde/noche) |
| `AddExerciseModal` (biblioteca) | Búsqueda de ejercicio para añadir a rutina en editor |

#### 3.5.3 Flow Exercise → `screens/biblioteca/ExerciseViews.tsx`
| Sub-vista | Lógica |
|---|---|
| Grid de categorías | 5 categorías (Fuerza, Calentamiento, Movilidad, Estiramientos, Postura) |
| Lista por categoría | Items con imagen GIF + nombre + músculos; filtros de grupo muscular |
| Detalle de ejercicio | Descripción en Markdown, GIF animado, músculos trabajados, historial de rendimiento (sesiones previas), recomendaciones |

---

### 3.6 `screens/Progreso.tsx` — **Panel de Progreso**
| Sub-pantalla | Tipo | Lógica |
|---|---|---|
| `'main'` | Vista principal | StatChips (peso/cintura/sesiones); PillTabs de gráficas; AnatomicalEvolutionCard; widgets Gallery e History |
| `'gallery'` | `ProgressGallery.tsx` | Grid de fotos de progreso; modo comparación (slider before/after); filtros temporales (1M/3M/6M/1A/TODO); lightbox |
| `'history'` | `SessionHistoryList.tsx` | Lista de sesiones agrupadas por mes; icono por tipo de rutina; tap → session-detail |
| `'session-detail'` | `WorkoutSummaryScreen` (modo histórico) | Mismo componente que el post-workout, con flag `isHistoricalView=true` |

**Gráficas disponibles (con rango 1M / 3M / MAX):**
- `ProgressChart` — Evolución corporal (peso, cintura)
- `StrengthChart` — Evolución de fuerza (volumen, 1RM estimado)
- `CarreraChart` — Cardio (distancia, ritmo, tiempo)

---

## 4. FocusModeLayer — Capa de Focus Mode

> `components/layout/FocusModeLayer.tsx` · z-index 220 · toma el 100% del viewport

Activa cuando cualquiera de estas condiciones es `truthy`:

| Condición | Componente renderizado |
|---|---|
| `state.session.activeRoutine` | `RutinaActivaScreen` |
| `state.session.workoutSummaryData` | `WorkoutSummaryScreen` |
| `state.session.cardioLogData` | `ProgressiveCardioLogModal` |
| `state.ui.isProfileOpen` | `PerfilScreen` |

---

### 4.1 `screens/rutina-activa/RutinaActivaScreen.tsx` — **Sesión Activa**

**Estado pre-inicio:**
- `RoutineLaunchScreen` — preview de pasos, stats (ejercicios, duración estimada, tipo), CTA "Iniciar"

**Durante la sesión (`isStarted = true`):**
- `RoutineSessionHeader` — cronómetro global, botón saltar, botón salir
- `RoutineStepRenderer` — dispatcher de paso actual:

| Tipo de paso | Componente | Lógica |
|---|---|---|
| `'exercise'` | `FuerzaScreen` | Sets logueados, peso/reps/RIR, datos de sesión anterior, PlateCalculatorModal, NextUpIndicator |
| `'cardio'` | `CardioScreen` | Método CACO; intervalos run/walk con countdown; progreso de repeticiones |
| `'pose'` / `'meditation'` | `PoseScreen` | Countdown timer de pose; descripción del ejercicio; botón completar |
| `'warmup'` / `'cooldown'` | `InfoStepScreen` | Lista de items del bloque; avance ítem por ítem; botón "Saltar todo" |
| descanso (cross-step) | `RestoScreen` | `CircularTimer` countdown; NextUpIndicator; botón "Saltar" |
| fin bloque principal | `PostRoutineScreen` | Stats (volumen, ejercicios); opción "Añadir ejercicio" o ir al cooldown/resumen |

**Modales dentro de RutinaActivaScreen:**
- `RoutineExitDialog` — Confirmar salida: guardar sesión / descartar
- `ConfirmationDialog` — Confirmar saltar paso
- `AddExerciseModal` — Añadir ejercicio extra al flujo en tiempo real
- `SetSelectorModal` — Elegir nº de sets para el ejercicio añadido
- `ExerciseDetailSheet` — Hoja informativa de un ejercicio (descripción, GIF)

---

### 4.2 `screens/WorkoutSummary.tsx` — **Resumen de Sesión**

Renderiza dos variantes según `entry.tipo_rutina`:

**Variante Fuerza/Yoga/Postura:**
- Métricas hero: duración, volumen total (k kg), ejercicios, PRs detectados
- `StrengthExerciseResultCard` por ejercicio: mejor serie, volumen, badge PR
- `TimedBlockCard` para bloques por tiempo

**Variante Cardio (cardioLibre / senderismo / rucking / cardio):**
- Héroe de distancia (km en tipografía grande)
- Grid de métricas: tiempo, ritmo, energía (kcal), pulso, elevación, carga
- Notas de sesión (si existen)

Accesible en dos contextos: post-workout (desde FocusModeLayer) e histórico (desde `Progreso → session-detail`).

---

### 4.3 `screens/PerfilScreen.tsx` — **Perfil de Usuario**

| Sección | Lógica |
|---|---|
| Identidad | Editar nombre de usuario y mantra personal |
| `MacroSettings` | Ajustar objetivos: kcal, proteína, carbs, grasas; distribución porcentual automática |
| `AccountSection` | Ver onboarding nuevamente (resetea userName); cerrar sesión (Supabase) |

---

## 5. Componentes de Layout

> `components/layout/`

| Componente | Rol |
|---|---|
| `AppShell.tsx` | Shell raíz; aplica `data-theme`; contiene `BottomNav` + `GlobalOverlays` |
| `AppLoadingScreen.tsx` | Pantalla de carga inicial (bootstrap) |
| `AuthGate.tsx` | Guarda de autenticación; renderiza `LoginView` si no hay sesión Supabase |
| `BottomNav.tsx` | Navegación inferior 4 tabs: Hoy · Nutrición · Biblioteca · Progreso |
| `FocusModeLayer.tsx` | Overlay z-220 para sesiones activas y perfil |
| `GlobalOverlays.tsx` | Toast global + `PhaseChangeModal` |
| `ImmersiveFocusShell.tsx` | Shell visual para pantallas de ejercicio (FuerzaScreen, CardioScreen, etc.) |
| `PageContainer.tsx` | Wrapper de ancho máximo con padding |
| `PageHeader.tsx` | Header reutilizable (eyebrow, title, subtitle, actions) |
| `PageSection.tsx` | Sección con eyebrow + título + subtítulo |
| `BentoGrid.tsx` | Grid helper para layouts tipo bento |
| `SegmentedControl.tsx` | Control de segmentos (alternativa a PillTabs) |
| `ThemeSync.tsx` | Sincroniza CSS custom properties con el tema del perfil |

---

## 6. Componentes de Dominio

### 6.1 Nutrición (`components/nutricion/`)
| Componente | Rol |
|---|---|
| `MacroBarSystem.tsx` | Sistema de barras de progreso P/C/G con colores semáforo |
| `MealLog.tsx` | Lista de comidas del día con acciones editar/eliminar |
| `NutritionDayNavigator.tsx` | Navegador de fecha ← día → |
| `NutritionStatCard.tsx` | Tarjeta de estadística nutricional puntual |
| `NutritionSummary.tsx` | Resumen completo del día (macros + kcal restantes) |
| `PlateSummary.tsx` | Dock colapsable del plato en construcción (MacroBlocks, PlateIngredientCard) |
| `WeeklySummaryChart.tsx` | Gráfica de barras semanal de kcal |

### 6.2 Progreso (`components/progreso/`)
| Componente | Rol |
|---|---|
| `AnatomicalEvolutionCard.tsx` | Silueta anatómica SVG con evolución de medidas corporales |

### 6.3 Perfil (`components/perfil/`)
| Componente | Rol |
|---|---|
| `MacroSettings.tsx` | Editor de metas macro con slider de distribución |
| `AccountSection.tsx` | Acciones de cuenta (onboarding, sign-out) |
| `ThemeSelector.tsx` | Grid de temas visuales disponibles |

### 6.4 Hoy (`components/hoy/`)
| Componente | Rol |
|---|---|
| `DailyNonNegotiablesWidget.tsx` | Widget de hábitos innegociables (versión legacy) |
| `DailyNonNegotiablesWidgetNew.tsx` | Widget de hábitos innegociables (versión refactorizada) |
| `WeeklyGlanceWidget.tsx` | Vista rápida de la semana (estado de días) |

### 6.5 Gráficas (`components/charts/`)
| Componente | Datos |
|---|---|
| `ProgressChart.tsx` | Peso (kg), cintura (cm) — eje temporal |
| `StrengthChart.tsx` | Volumen por sesión, 1RM estimado — eje temporal |
| `CarreraChart.tsx` | Distancia (km), ritmo, tiempo — eje temporal |

### 6.6 Tarjetas (`components/cards/`)
| Componente | Uso |
|---|---|
| `RecipePreviewCard.tsx` | Tarjeta de receta en Biblioteca (imagen, macros, quick-add) |
| `RoutineCard.tsx` | Tarjeta de rutina en Biblioteca (tipo, pasos, acciones) |

---

## 7. Modales Globales (`components/dialogs/`)

| Modal | Trigger | Lógica |
|---|---|---|
| `CardioLibreLogModal.tsx` | Hoy → "Explorar" (run/hike) | Registra distancia, tiempo, ritmo, kcal, pulso, notas para carrera / senderismo / rucking |
| `ConfirmationDialog.tsx` | Múltiples | Diálogo genérico de confirmación destructiva |
| `DataCorrectionModal.tsx` | AddFoodView | Edita macros de item escaneado (Open Food Facts) |
| `MealEditorModal.tsx` | NutritionMainView | Edita nombre y alimentos de una comida ya registrada |
| `MeasurementModal.tsx` | Progreso | Registra medidas corporales: peso, cintura, caderas, % grasa, foto |
| `PlateCalculatorModal.tsx` | FuerzaScreen | Calcula discos para barra (peso objetivo → combinación de discos) |
| `PortionEditorModal.tsx` | AddFoodView | Ajusta porción de un alimento en el plato (unidad + cantidad) |
| `ProgressiveCardioLogModal.tsx` | FocusModeLayer (post-cardio) | Registra distancia y notas de sesión cardio progresivo (CACO) |
| `RawDataDebugModal.tsx` | AddFoodView (dev) | Muestra JSON crudo de Open Food Facts para depuración |
| `SetSelectorModal.tsx` | RutinaActivaScreen | Selector del nº de series al añadir ejercicio en vivo |

---

## 8. Componentes Primitivos Reutilizables

| Componente | Descripción |
|---|---|
| `Button.tsx` | Botón polimórfico (primary / secondary / ghost / high-contrast / tertiary) |
| `Card.tsx` | Tarjeta con variantes (default / glass / accent / inset / overlay) |
| `ChipButton.tsx` | Botón chip compacto (toggle) |
| `CircularTimer.tsx` | Timer circular SVG animado con countdown |
| `DialogSectionCard.tsx` | Contenedor de sección dentro de modales |
| `ExerciseImage.tsx` | Imagen de ejercicio con fallback SVG |
| `FloatingDock.tsx` | Dock flotante (acción rápida) |
| `FlowHeader.tsx` | Header compacto para flujos (con botón atrás) |
| `FullScreenFlow.tsx` | Wrapper para flujos de pantalla completa |
| `IconButton.tsx` | Botón icono circular |
| `ImmersiveBackground.tsx` | Fondo inmersivo con GIF del ejercicio actual |
| `Input.tsx` | Input estilizado (con label, icon, error) |
| `MacroArcGauge.tsx` | Gauge semicircular SVG para macros |
| `Modal.tsx` | Wrapper de modal con backdrop + portal |
| `NextUpIndicator.tsx` | Indicador "Siguiente:" durante descanso |
| `OptionTile.tsx` | Tile de opción (selección visual) |
| `PillTabs.tsx` | Tabs estilo pill (con iconos opcionales) |
| `ProgressWidgetsGrid.tsx` | Widgets compuestos: `GalleryWidget`, `HistoryWidget` |
| `ScreenHeader.tsx` | Header simple de pantalla |
| `SectionHeader.tsx` | Cabecera de sección con acción opcional |
| `SelectField.tsx` | Campo select estilizado |
| `StatChip.tsx` | Chip de estadística con valor + tendencia (↑ ↓) |
| `StepperControl.tsx` | Control +/− para valores numéricos |
| `Tag.tsx` | Etiqueta/badge polimórfica (status / overlay / default) |
| `Textarea.tsx` | Textarea estilizado |

---

## 9. Sistema de Iconos (`components/icons/`)

| Archivo | Contenido |
|---|---|
| `ActionIcons.tsx` | PlusIcon, TrashIcon, PencilIcon, CheckIcon, XIcon, etc. |
| `FoodIcons.tsx` | PlateIcon, BowlIcon, FireIcon (calorías), etc. |
| `HealthIcons.tsx` | HeartIcon, ScaleIcon, ClockIcon, SparklesIcon, etc. |
| `NavigationIcons.tsx` | ChevronRightIcon, ChevronLeftIcon, HomeIcon, etc. |
| `RoutineIcons.tsx` | StrengthIcon, CardioIcon, YogaIcon, MeditationIcon, PostureIcon, MountainIcon |
| `UIIcons.tsx` | SearchIcon, FilterIcon, StarIcon, BookOpenIcon, UserCircleIcon, etc. |

---

## 10. Resumen de Archivos por Directorio

```
screens/
├── OnboardingScreen.tsx          Wizard 3 pasos (nombre, medidas, metas)
├── Hoy.tsx                       Dashboard diario, innegociables, misión, nutrición
├── Nutricion.tsx                 Router: main ↔ add
├── Biblioteca.tsx                Router: none ↔ recipe ↔ routine ↔ exercise
├── Progreso.tsx                  Router: main ↔ gallery ↔ history ↔ session-detail
├── PerfilScreen.tsx              Identidad, macros, cuenta (FocusModeLayer)
├── WorkoutSummary.tsx            Resumen post-workout y vista histórica
├── auth/
│   └── LoginView.tsx             Login / Registro (Supabase)
├── biblioteca/
│   ├── ExerciseViews.tsx         Catálogo de ejercicios por categoría + detalle + historial
│   ├── RecipeViews.tsx           Lista + detalle + editor + generador IA de recetas
│   ├── RoutineViews.tsx          Entry point del flow de rutinas
│   └── recipes/
│       ├── RecipeDetailView.tsx  Detalle completo de receta
│       └── RecipeEditorView.tsx  Editor CRUD de receta
│   └── routine-views/
│       ├── RoutinesManagementFlow.tsx  Router: routines ↔ planner
│       ├── RoutinesListView.tsx        Lista de rutinas del usuario
│       ├── RoutineEditor.tsx           Editor de pasos/sets/tiempos de rutina
│       ├── RoutineSelectorModal.tsx    Modal selector de rutina
│       ├── WeeklyPlannerView.tsx       Planner semanal (día × franja)
│       └── AddExerciseModal.tsx        Búsqueda para añadir a editor de rutina
├── nutricion/
│   ├── NutritionMainView.tsx     Dashboard: macros, meal log, navegación de días
│   ├── AddFoodView.tsx           Constructor de plato (búsqueda, plato, log)
│   ├── BarcodeScannerView.tsx    Escáner de código de barras (Open Food Facts)
│   ├── FoodItemEditor.tsx        Formulario crear/editar alimento personalizado
│   ├── CustomFoodListView.tsx    CRUD de alimentos personalizados
│   └── add-food/
│       ├── AddFoodHeader.tsx     Header con búsqueda + barcode + cámara IA
│       ├── AddFoodImageSourceModal.tsx  Modal selector fuente de imagen (cámara/galería)
│       ├── AddFoodProcessingOverlay.tsx Overlay de procesamiento IA
│       └── FoodCatalogView.tsx   Grid/lista de alimentos con filtros
├── progreso/
│   ├── ProgressGallery.tsx       Galería de fotos: grid + comparación slider + lightbox
│   └── SessionHistoryList.tsx    Lista de sesiones agrupadas por mes
└── rutina-activa/
    ├── RutinaActivaScreen.tsx    Orquestador principal de sesión activa
    ├── CardioScreen.tsx          Paso cardio CACO (intervalos run/walk)
    ├── FuerzaScreen.tsx          Paso fuerza (sets, reps, RIR, histórico, calculadora)
    ├── InfoStepScreen.tsx        Paso warmup/cooldown (lista de items)
    ├── PoseScreen.tsx            Paso pose/meditación (countdown timer)
    ├── PostRoutineScreen.tsx     Pantalla fin de bloque principal (stats, añadir ejercicio)
    ├── RestoScreen.tsx           Pantalla de descanso (circular timer, next-up)
    ├── RuckingSession.tsx        Sesión de rucking inline (setup → active → summary)
    ├── AddExerciseModal.tsx      Añadir ejercicio en tiempo real durante sesión
    ├── ExerciseDetailSheet.tsx   Hoja inferior de detalle de ejercicio
    └── flow/
        ├── RoutineLaunchScreen.tsx   Pre-start: preview de pasos y stats
        ├── RoutineExitDialog.tsx     Confirmar salida: guardar / descartar
        ├── RoutineSessionHeader.tsx  Header de sesión (cronómetro, skip, exit)
        ├── RoutineStepRenderer.tsx   Dispatcher de tipo de paso actual
        ├── RoutinePreStartView.tsx   Vista previa antes de iniciar (alternativa)
        └── InfoStepScreenView.tsx    Vista de item individual en warmup/cooldown
```

---

*Documento generado por análisis estático exhaustivo de `screens/`, `components/` y `App.tsx`.*
