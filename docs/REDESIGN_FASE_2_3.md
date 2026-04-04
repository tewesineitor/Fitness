# FIT ARCHITECT — REDISEÑO FASE 2 + FASE 3

> **Serie:** Doc 2 de 4 → (0-1) · **(2-3)** · (4-5) · (6)
> **Prerrequisito:** Haber completado `REDESIGN_FASE_0_1.md` (checklist aprobado)
> **Referencia:** Diccionario de Traducción completo en `REDESIGN_FASE_0_1.md` Sección B

---

# FASE 2 — MIGRAR COMPUESTOS UI KIT

> **Objetivo:** Migrar los 10 componentes compuestos de `components/ui-premium/`.
> Estos componen tarjetas, widgets y visualizaciones que usan los primitivos de Fase 1.
> **Método:** Diccionario de Traducción (Doc 1, Sección B) + notas específicas por archivo.
> **Tiempo estimado:** 3-4 horas

## Reglas de migración (idénticas a Fase 1)

1. Abrir cada archivo listado
2. Buscar TODA clase que coincida con el Diccionario de Traducción
3. Reemplazar con el token semántico correspondiente
4. Eliminar cualquier `shadow-glow`, `shadow-[0_0_`, `drop-shadow-[`, `animate-glow-pulse`
5. Reemplazar `style={{` con rgba/hex hardcodeados → CSS vars
6. NO cambiar lógica, props, estructura JSX, ni nombres de componentes
7. NO agregar ni quitar comentarios

---

## Archivo 1: `BentoQuadrant.tsx`

**Ruta:** `components/ui-premium/BentoQuadrant.tsx`

| Buscar | Reemplazar |
|---|---|
| `bg-zinc-800` o `bg-zinc-900` | `bg-surface-raised` o `bg-surface-bg` |
| `border-zinc-700` | `border-surface-border` |
| `text-white` | `text-text-primary` |
| `text-zinc-400` | `text-text-secondary` |
| `text-zinc-500` | `text-text-muted` |
| `text-emerald-400` (valor/icono default) | `text-brand-accent` |
| `emerald-400` en prop `colorToken` default | `brand-accent` |

**Nota especial:** Este componente tiene un prop `colorToken` con default `"emerald-400"`. Cambiar el default a `"brand-accent"`. Donde se consuma `colorToken` para construir clases como `text-${colorToken}`, asegurar que los consumidores pasen tokens semánticos (`brand-accent`, `brand-protein`, `brand-carbs`, `brand-fat`) en vez de colores Tailwind directos.

## Archivo 2: `StreakCalendar.tsx`

**Ruta:** `components/ui-premium/StreakCalendar.tsx`

| Buscar | Reemplazar |
|---|---|
| `bg-zinc-800` | `bg-surface-raised` |
| `bg-zinc-900` | `bg-surface-bg` |
| `border-zinc-700` | `border-surface-border` |
| `text-white` | `text-text-primary` |
| `text-zinc-400` | `text-text-secondary` |
| `text-zinc-500` | `text-text-muted` |
| `bg-emerald-400` (día completado) | `bg-brand-accent` |
| `text-emerald-400` | `text-brand-accent` |
| `shadow-[0_0_` + cualquier glow | Eliminar la clase |

## Archivo 3: `RoutineCard.tsx`

**Ruta:** `components/ui-premium/RoutineCard.tsx`

| Buscar | Reemplazar |
|---|---|
| `bg-zinc-900` | `bg-surface-bg` |
| `bg-zinc-800` | `bg-surface-raised` |
| `border-zinc-700` o `border-zinc-800` | `border-surface-border` |
| `text-white` | `text-text-primary` |
| `text-zinc-400` | `text-text-secondary` |
| `text-zinc-500` | `text-text-muted` |
| `text-emerald-400` | `text-brand-accent` |
| `bg-emerald-400` (botón "Iniciar") | `bg-brand-accent` |
| `text-zinc-950` (foreground botón) | `text-brand-accent-foreground` |
| `hover:bg-emerald-500` | `hover:bg-brand-accent/90` |

## Archivo 4: `RoutineCardPremium.tsx`

**Ruta:** `components/ui-premium/RoutineCardPremium.tsx`

| Buscar | Reemplazar |
|---|---|
| `bg-zinc-900` | `bg-surface-bg` |
| `bg-zinc-800` | `bg-surface-raised` |
| `border-zinc-700` o `border-zinc-800` | `border-surface-border` |
| `text-white` | `text-text-primary` |
| `text-zinc-400` | `text-text-secondary` |
| `text-zinc-500` | `text-text-muted` |
| `text-emerald-400` (chips, eyebrow) | `text-brand-accent` |
| `bg-emerald-400/10` (chip bg) | `bg-brand-accent/10` |
| `border-emerald-400/20` | `border-brand-accent/20` |
| `bg-emerald-400` (botón CTA) | `bg-brand-accent` |
| `text-zinc-950` o `text-black` (foreground botón) | `text-brand-accent-foreground` |

## Archivo 5: `LogEntryCard.tsx`

**Ruta:** `components/ui-premium/LogEntryCard.tsx`

**Nota especial:** Este componente tiene variantes por tipo (strength, cardio, anthropometry) con diferentes colores hardcodeados por variante.

| Buscar | Reemplazar | Contexto |
|---|---|---|
| `bg-zinc-900` | `bg-surface-bg` | Fondo tarjeta |
| `bg-zinc-800` | `bg-surface-raised` | Secciones internas |
| `border-zinc-700` o `border-zinc-800` | `border-surface-border` | Bordes |
| `text-white` | `text-text-primary` | Títulos |
| `text-zinc-400` | `text-text-secondary` | Subtítulos |
| `text-zinc-500` | `text-text-muted` | Timestamps, metadata |
| `text-emerald-400` o `bg-emerald-400/10` | `text-brand-accent` / `bg-brand-accent/10` | Variante strength |
| `text-amber-400` o `bg-amber-400/10` | `text-warning` / `bg-warning/10` | Variante cardio |
| `text-violet-400` o `bg-violet-400/10` | `text-brand-protein` / `bg-brand-protein/10` | Variante anthropometry |
| `text-rose-400` o `text-rose-500` | `text-danger` | Estado error/delete |
| Cualquier `shadow-glow` o glow arbitrario | Eliminar | — |

## Archivo 6: `ProgressThumbnail.tsx`

**Ruta:** `components/ui-premium/ProgressThumbnail.tsx`

| Buscar | Reemplazar |
|---|---|
| `bg-zinc-900` | `bg-surface-bg` |
| `bg-zinc-800` | `bg-surface-raised` |
| `border-zinc-700` | `border-surface-border` |
| `text-white` | `text-text-primary` |
| `text-zinc-400` | `text-text-secondary` |
| `text-zinc-500` | `text-text-muted` |
| `border-emerald-400` (selected state) | `border-brand-accent` |
| `ring-emerald-400` (selected ring) | `ring-brand-accent` |
| `bg-emerald-400` (indicator dot) | `bg-brand-accent` |
| `text-emerald-400` | `text-brand-accent` |

## Archivo 7: `TrendChartCard.tsx`

**Ruta:** `components/ui-premium/TrendChartCard.tsx`

**Nota especial:** Este componente tiene SVG con colores inline en `stroke`, `fill`, `stopColor`.

| Buscar | Reemplazar |
|---|---|
| `bg-zinc-900` | `bg-surface-bg` |
| `bg-zinc-800` | `bg-surface-raised` |
| `border-zinc-700` | `border-surface-border` |
| `text-white` | `text-text-primary` |
| `text-zinc-400` | `text-text-secondary` |
| `text-zinc-500` | `text-text-muted` |
| `text-emerald-400` | `text-brand-accent` |
| `stroke-emerald-400` o `stroke="#34d399"` (línea chart) | `className="stroke-brand-accent"` |
| `stroke="rgb(..."` emerald en SVG | `stroke="rgb(var(--color-brand-accent-rgb))"` |
| `stopColor="#34d399"` o similar en `<stop>` | `stopColor="rgb(var(--color-brand-accent-rgb))"` |
| `fill="rgba(52,211,153,..."` en áreas | `fill="rgba(var(--color-brand-accent-rgb), 0.1)"` |
| `stroke-zinc-800` (grid lines) | `stroke="rgb(var(--color-surface-border-rgb))"` |
| Cualquier `filter: drop-shadow(...)` con color | Eliminar el filter |

**Patrón para SVG inline:** Donde se usen atributos `stroke`, `fill`, o `stopColor` con hex/rgb hardcodeados referentes a emerald, reemplazar con la variable CSS:
- Para stroke/fill: `rgb(var(--color-brand-accent-rgb))`
- Para fill con opacidad: `rgba(var(--color-brand-accent-rgb), 0.1)`
- Para grid/ejes: `rgb(var(--color-surface-border-rgb))`

## Archivo 8: `SmartRestTimer.tsx`

**Ruta:** `components/ui-premium/SmartRestTimer.tsx`

**Nota especial:** Timer con fases (ready, resting, go) y anillo SVG. Cada fase usa un color distinto.

| Buscar | Reemplazar | Contexto |
|---|---|---|
| `bg-zinc-900` | `bg-surface-bg` | Fondo |
| `bg-zinc-800` | `bg-surface-raised` | Anillo track |
| `text-white` | `text-text-primary` | Countdown text |
| `text-zinc-400` | `text-text-secondary` | Labels |
| `text-zinc-500` | `text-text-muted` | Hints |
| `text-cyan-400` o `stroke-cyan-400` | `text-brand-carbs` / `stroke-brand-carbs` | Fase "resting" |
| `text-emerald-400` o `stroke-emerald-400` | `text-brand-accent` / `stroke-brand-accent` | Fase "go" |
| `text-amber-400` o `stroke-amber-400` | `text-warning` / `stroke-warning` | Fase "ready" |
| `stroke-zinc-800` (track background) | Usar `stroke="rgb(var(--color-surface-raised-rgb))"` | SVG ring |
| Cualquier glow/drop-shadow en ring | Eliminar | — |

**Para SVG ring inline:** Donde `stroke` se define como atributo inline del `<circle>`:
- Track: `stroke="rgb(var(--color-surface-raised-rgb))"`
- Progress ready: `stroke="rgb(var(--color-warning-rgb))"`
- Progress resting: `stroke="rgb(var(--color-brand-carbs-rgb))"`
- Progress go: `stroke="rgb(var(--color-brand-accent-rgb))"`

## Archivo 9: `InteractiveProgressWidget.tsx`

**Ruta:** `components/ui-premium/InteractiveProgressWidget.tsx`

| Buscar | Reemplazar |
|---|---|
| `bg-zinc-900` | `bg-surface-bg` |
| `bg-zinc-800` | `bg-surface-raised` |
| `bg-zinc-800/50` | `bg-surface-raised/50` |
| `border-zinc-700` | `border-surface-border` |
| `text-white` | `text-text-primary` |
| `text-zinc-400` | `text-text-secondary` |
| `text-zinc-500` | `text-text-muted` |
| `text-emerald-400` | `text-brand-accent` |
| `bg-emerald-400/10` (tab activa) | `bg-brand-accent/10` |
| `border-emerald-400` (tab activa) | `border-brand-accent` |
| `hover:bg-zinc-800` | `hover:bg-surface-raised` |
| `hover:text-white` | `hover:text-text-primary` |
| `divide-zinc-800` (si existe) | `divide-surface-border` |

**Nota:** Si hay un chart SVG embebido, aplicar las mismas reglas que TrendChartCard (Archivo 7).

## Archivo 10: `RecipeCard.tsx`

**Ruta:** `components/ui-premium/RecipeCard.tsx`

| Buscar | Reemplazar | Contexto |
|---|---|---|
| `bg-zinc-900` | `bg-surface-bg` | Fondo tarjeta |
| `bg-zinc-800` | `bg-surface-raised` | Secciones |
| `border-zinc-700` | `border-surface-border` | Bordes |
| `text-white` | `text-text-primary` | Título |
| `text-zinc-400` | `text-text-secondary` | Descripción |
| `text-zinc-500` | `text-text-muted` | Metadata |
| `text-violet-400` o `text-violet-500` | `text-brand-protein` | Macro proteína |
| `text-cyan-400` | `text-brand-carbs` | Macro carbos |
| `text-emerald-400` (accent/kcal) | `text-brand-accent` | Calorías |
| `text-orange-400` | `text-brand-fat` | Macro grasa |
| `text-rose-400` o `text-rose-500` | `text-danger` | Favorito/alert |
| `bg-emerald-400` (botón quick-add) | `bg-brand-accent` | Botón |
| `text-zinc-950` (foreground botón) | `text-brand-accent-foreground` | Botón |
| `bg-violet-500/10` | `bg-brand-protein/10` | Chip macro |
| `bg-cyan-400/10` | `bg-brand-carbs/10` | Chip macro |
| `bg-orange-400/10` | `bg-brand-fat/10` | Chip macro |

---

## ✅ CHECKLIST FASE 2

### Verificación por archivo
- [ ] `BentoQuadrant.tsx` — cero `emerald-*`, `zinc-*`, `text-white`; default `colorToken` = `"brand-accent"`
- [ ] `StreakCalendar.tsx` — cero hardcodes; glow eliminado
- [ ] `RoutineCard.tsx` — cero hardcodes
- [ ] `RoutineCardPremium.tsx` — cero hardcodes
- [ ] `LogEntryCard.tsx` — cero hardcodes; variantes usan tokens correctos
- [ ] `ProgressThumbnail.tsx` — cero hardcodes; ring/border usa token
- [ ] `TrendChartCard.tsx` — cero hardcodes; SVG stroke/fill usan CSS vars
- [ ] `SmartRestTimer.tsx` — cero hardcodes; SVG ring fases usan CSS vars
- [ ] `InteractiveProgressWidget.tsx` — cero hardcodes
- [ ] `RecipeCard.tsx` — cero hardcodes; macros usan tokens correctos

### Verificación global
- [ ] `grep -r "emerald" components/ui-premium/BentoQuadrant.tsx components/ui-premium/StreakCalendar.tsx components/ui-premium/RoutineCard*.tsx components/ui-premium/LogEntryCard.tsx components/ui-premium/ProgressThumbnail.tsx components/ui-premium/TrendChartCard.tsx components/ui-premium/SmartRestTimer.tsx components/ui-premium/InteractiveProgressWidget.tsx components/ui-premium/RecipeCard.tsx` → 0 resultados
- [ ] `grep -r "text-white" [mismos archivos]` → 0 resultados
- [ ] `grep -r "zinc-[0-9]" [mismos archivos]` → 0 resultados
- [ ] `grep -r "shadow-glow\|drop-shadow" [mismos archivos]` → 0 resultados
- [ ] `grep -r "shadow-\[0_0" [mismos archivos]` → 0 resultados
- [ ] Compilación sin errores: `npm run dev`
- [ ] **Visual:** Todas las tarjetas y widgets renderizan con colores teal (no emerald)
- [ ] **Visual:** Gráficos SVG (TrendChart, RestTimer) usan teal como color de acento

---

# FASE 3 — MIGRAR COMPONENTES DE NUTRICIÓN

> **Objetivo:** Migrar los 6 componentes especializados en nutrición y macros.
> Estos son los más complejos por la cantidad de colores funcionales (proteína, carbos, grasa).
> **Tiempo estimado:** 2-3 horas

---

## Archivo 1: `RecipeCardPremium.tsx`

**Ruta:** `components/ui-premium/RecipeCardPremium.tsx`

| Buscar | Reemplazar | Contexto |
|---|---|---|
| `bg-zinc-900` | `bg-surface-bg` | Fondo |
| `bg-zinc-800` | `bg-surface-raised` | Secciones |
| `border-zinc-700` o `border-zinc-800` | `border-surface-border` | Bordes |
| `text-white` | `text-text-primary` | Título |
| `text-zinc-400` | `text-text-secondary` | Descripción |
| `text-zinc-500` | `text-text-muted` | Metadata |
| `text-violet-400` o `text-violet-500` | `text-brand-protein` | Macro P |
| `bg-violet-500/10` o `bg-violet-400/10` | `bg-brand-protein/10` | Chip P |
| `text-cyan-400` | `text-brand-carbs` | Macro C |
| `bg-cyan-400/10` | `bg-brand-carbs/10` | Chip C |
| `text-orange-400` o `text-orange-500` | `text-brand-fat` | Macro G |
| `bg-orange-400/10` o `bg-orange-500/10` | `bg-brand-fat/10` | Chip G |
| `text-emerald-400` | `text-brand-accent` | Calorías/acento |
| `bg-emerald-400` (botón) | `bg-brand-accent` | CTA |
| `text-zinc-950` (foreground) | `text-brand-accent-foreground` | CTA |

## Archivo 2: `SmartFlexibleMacros.tsx`

**Ruta:** `components/ui-premium/SmartFlexibleMacros.tsx`

**Nota especial:** Este es el componente más complejo en colores. Tiene gauges circulares SVG para P/C/G con alertas de exceso.

| Buscar | Reemplazar | Contexto |
|---|---|---|
| `bg-zinc-900` | `bg-surface-bg` | Fondo |
| `bg-zinc-800` | `bg-surface-raised` | Secciones |
| `border-zinc-700` | `border-surface-border` | Bordes |
| `text-white` | `text-text-primary` | Valores |
| `text-zinc-400` | `text-text-secondary` | Labels |
| `text-zinc-500` | `text-text-muted` | Hints |
| `text-violet-400` o `text-violet-500` | `text-brand-protein` | Proteína label/valor |
| `text-cyan-400` | `text-brand-carbs` | Carbos label/valor |
| `text-amber-400` o `text-orange-400` | `text-brand-fat` | Grasa label/valor |
| `text-rose-400` o `text-rose-500` | `text-danger` | Alerta exceso |
| `bg-rose-400/10` o `bg-rose-500/10` | `bg-danger/10` | Fondo alerta |

**SVG Gauges inline:** Para los `<circle>` de los gauges:
| Buscar en atributo stroke | Reemplazar |
|---|---|
| `stroke="#8b5cf6"` o similar violet | `stroke="rgb(var(--color-brand-protein-rgb))"` |
| `stroke="#22d3ee"` o similar cyan | `stroke="rgb(var(--color-brand-carbs-rgb))"` |
| `stroke="#fb923c"` o similar orange | `stroke="rgb(var(--color-brand-fat-rgb))"` |
| `stroke="#f87171"` o similar rose (exceso) | `stroke="rgb(var(--color-danger-rgb))"` |
| `stroke-zinc-800` o `stroke="#1e1e21"` (track) | `stroke="rgb(var(--color-surface-raised-rgb))"` |

## Archivo 3: `MasterNutritionDashboard.tsx` (si existe en `screens/` o `components/`)

**Buscar el archivo.** Puede estar en `screens/nutricion/` o `components/ui-premium/`.

Aplicar las mismas reglas que SmartFlexibleMacros con estas adiciones:

| Buscar | Reemplazar | Contexto |
|---|---|---|
| Anillo central grande SVG con emerald | `stroke="rgb(var(--color-brand-accent-rgb))"` | Anillo kcal |
| Anillos concéntricos P/C/G | Mismas reglas SVG de SmartFlexibleMacros | — |
| `bg-emerald-400/10` (panel central) | `bg-brand-accent/10` | — |
| `text-emerald-400` (kcal label) | `text-brand-accent` | — |
| Cualquier `filter: drop-shadow(...)` | Eliminar | Apple clean |

## Archivo 4: `IngredientListItem.tsx` (buscar en `components/`)

| Buscar | Reemplazar |
|---|---|
| `bg-zinc-800` o `bg-zinc-900` | `bg-surface-raised` o `bg-surface-bg` |
| `border-zinc-700` | `border-surface-border` |
| `text-white` | `text-text-primary` |
| `text-zinc-400` | `text-text-secondary` |
| `text-zinc-500` | `text-text-muted` |
| `text-emerald-400` (cantidad/check) | `text-brand-accent` |
| `text-rose-400` (alergia/eliminar) | `text-danger` |
| `hover:bg-zinc-800` | `hover:bg-surface-raised` |

## Archivo 5: `NutritionMacroBar.tsx` (verificar migración previa)

**Ruta:** `components/ui-premium/NutritionMacroBar.tsx`

Este archivo fue parcialmente migrado en sesiones anteriores. **Verificar que NO quede ningún hardcode:**

| Verificar que NO exista | Debería ser |
|---|---|
| `bg-violet-500` | `bg-brand-protein` |
| `bg-cyan-400` | `bg-brand-carbs` |
| `bg-orange-400` | `bg-brand-fat` |
| `bg-rose-400` (over-state) | `bg-danger` |
| `bg-zinc-800` (track) | `bg-surface-raised` |
| `text-white` | `text-text-primary` |
| `text-zinc-*` | Token correspondiente |

## Archivo 6: `WeeklyStreakTracker.tsx` (verificar migración previa)

**Ruta:** `components/ui-premium/WeeklyStreakTracker.tsx`

Verificar que NO quede ningún hardcode:

| Verificar que NO exista | Debería ser |
|---|---|
| `bg-emerald-400` (dots) | `bg-brand-accent` |
| `bg-zinc-*` | Token correspondiente |
| `text-white` | `text-text-primary` |
| `text-rose-*` | `text-danger` |

---

## ✅ CHECKLIST FASE 3

### Verificación por archivo
- [ ] `RecipeCardPremium.tsx` — cero `violet-*`, `cyan-*`, `orange-*`, `emerald-*`, `zinc-*`, `text-white`
- [ ] `SmartFlexibleMacros.tsx` — cero hardcodes; SVG gauges usan CSS vars
- [ ] `MasterNutritionDashboard` — cero hardcodes; anillos SVG usan CSS vars
- [ ] `IngredientListItem.tsx` — cero hardcodes
- [ ] `NutritionMacroBar.tsx` — verificado, cero residuos
- [ ] `WeeklyStreakTracker.tsx` — verificado, cero residuos

### Verificación global
- [ ] `grep -rn "violet-[0-9]\|cyan-[0-9]\|orange-[0-9]\|emerald-[0-9]" components/ui-premium/RecipeCardPremium.tsx components/ui-premium/SmartFlexibleMacros.tsx` → 0 resultados
- [ ] `grep -rn "text-white\|zinc-[0-9]" [mismos archivos + IngredientListItem]` → 0 resultados
- [ ] `grep -rn "shadow-glow\|drop-shadow" [todos los archivos de Fase 3]` → 0 resultados
- [ ] `grep -rn "#8b5cf6\|#22d3ee\|#fb923c\|#34d399\|#6ee7b7" components/ui-premium/` → 0 resultados (SVG hex limpio)
- [ ] Compilación sin errores: `npm run dev`
- [ ] **Visual:** Gauges de macros muestran violet-400 / sky-400 / orange-400 (no los antiguos)
- [ ] **Visual:** Barra de progreso de macros usa colores correctos
- [ ] **Visual:** Alertas de exceso usan rose-400 (`#FB7185`)
- [ ] **Visual:** Ningún componente nutricional tiene glow

---

> **Siguiente documento:** `REDESIGN_FASE_4_5.md` — Responsividad, tipografía fluida y UIKit
