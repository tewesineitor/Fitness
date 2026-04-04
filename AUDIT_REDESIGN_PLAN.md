# AUDITORÍA COMPLETA + PLAN DE REDISEÑO VISUAL
> Fecha: 2026-04-03
> Alcance: Todo el codebase de Fit Architect
> Objetivo: Estandarizar UI Kit → luego construir pantallas con nueva SSOT

---

## PARTE 1 — DIAGNÓSTICO

### 1.1 Problemas Críticos Encontrados

#### 🔴 BUG: Swatches de color aparecen negros en UIKit
**Causa raíz:** Las variables CSS usan valores separados por comas (`110, 231, 183`) pero el template de Tailwind usa sintaxis slash (`rgb(var(...) / <alpha-value>)`). Esta combinación genera CSS inválido: `rgb(110, 231, 183 / 1)`. Los colores funcionan en algunos contextos (`text-*`) pero fallan en otros (`bg-*` en los swatches).
**Fix:** Cambiar TODOS los valores de variables RGB a formato sin comas: `110 231 183` (espacio-separados). Esto es el estándar para Tailwind v3+.
**Archivos:** `styles/tailwind.css` (todas las variables `*-rgb`)

#### 🔴 BUG: Labels del UIKit en inglés
**Archivos afectados:** `screens/DesignSystemDevScreen.tsx`
- "UI Premium Audit Surface" → "Superficie de Auditoría UI Premium"
- "bg-base", "surface-raised", "brand-accent" → etiquetas descriptivas en español
- "Typography" → "Tipografía"
- Secciones "Botones", "Colores Semánticos" ya están en español ✅

#### 🔴 BUG: Aura/glow excesivo en botones y elementos
**Causa raíz:** `--shadow-glow: 0 0 28px var(--color-brand-accent-glow)` con `--color-brand-accent-glow: rgba(110, 231, 183, 0.18)` — radio de 28px y opacidad 18% es demasiado visible.
**Afecta a:**
- `PremiumButton.tsx` variante `primary` → usa `shadow-glow` directamente
- `StreakCalendar.tsx` → `shadow-[0_0_15px_rgba(52,211,153,0.5)]` (¡hardcodeado Y 50% opacidad!)
- `PremiumFilterTab.tsx` → `shadow-[0_0_10px_rgba(52,211,153,0.5)]`
- `SmartRestTimer.tsx` → `filter: 'drop-shadow(0 0 12px rgba(52,211,153,0.4))'`
- `LogEntryCard.tsx` → `drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]` en PR crown
- `ProgressThumbnail.tsx` → `shadow-[0_0_10px_rgba(52,211,153,0.5)]`
- `WeeklyStreakTracker.tsx` → `shadow-glow` en día completado
**Fix:** Reducir `--shadow-glow` a `0 0 12px` con opacidad 8%. Eliminar todos los `shadow-[...]` hardcodeados con rgba.

#### 🔴 Hardcoded `index.html` usa `bg-zinc-950`
```html
<html lang="es" class="dark bg-zinc-950 text-zinc-50">
```
Debería usar `bg-bg-base text-text-primary`.

---

### 1.2 Migración de Tokens — Estado por Componente

#### ✅ Ya migrados a tokens semánticos (7 archivos):
| Componente | Estado |
|---|---|
| `Typography.tsx` | ✅ Completo |
| `SquishyCard.tsx` | ✅ Completo |
| `PremiumButton.tsx` | ✅ Completo (falta reducir glow) |
| `NonNegotiableCard.tsx` | ✅ Completo |
| `WeeklyStreakTracker.tsx` | ✅ Completo (falta limpiar glow) |
| `NutritionMacroBar.tsx` | ✅ Completo |
| `ActivityBentoMenu.tsx` | ✅ Completo |

#### 🔴 Requieren migración completa (26 archivos ui-premium):
| Componente | Hardcodes encontrados | Prioridad |
|---|---|---|
| `PremiumModal.tsx` | 7: `bg-zinc-950/90`, `bg-zinc-900/80`, `border-zinc-800/50`, `bg-zinc-800/80`, `border-zinc-700/50`, `text-zinc-400`, `bg-zinc-950/80` | ALTA |
| `PremiumInput.tsx` | 6: `text-zinc-100`, `text-zinc-500` placeholder, `bg-zinc-900/80`, `border-zinc-800/50`, `focus:border-emerald-400/50`, `text-zinc-400` | ALTA |
| `PremiumStepper.tsx` | 2: `bg-zinc-800/80`, `border-zinc-700/50`, `text-zinc-300`, `active:bg-zinc-700` | ALTA |
| `PremiumFilterTab.tsx` | 7: `bg-zinc-900/60`, `border-zinc-700/80`, `text-emerald-400`, `bg-emerald-400/10`, `bg-zinc-800/60`, `text-zinc-500/600`, `shadow rgba hardcodeado` | ALTA |
| `PremiumChip.tsx` | 2: `bg-zinc-800 text-zinc-400`, `bg-emerald-400/10 text-emerald-300` | ALTA |
| `PremiumBadge.tsx` | 2: `bg-emerald-400/10`, `border-emerald-400/20`, `text-emerald-300` | ALTA |
| `SegmentedTabs.tsx` | 2: `bg-emerald-400 text-zinc-950`, `bg-zinc-800 text-zinc-400` | ALTA |
| `SearchBar.tsx` | 6: `bg-zinc-800`, `focus:ring-emerald-500/40`, `text-emerald-400`, `text-zinc-500`, `text-zinc-100`, `text-zinc-300` | ALTA |
| `IconButton.tsx` | 4: `text-zinc-400`, `hover:text-emerald-400`, `bg-emerald-400 text-zinc-950`, `hover:bg-emerald-300` | ALTA |
| `ImageUploadArea.tsx` | 5: `border-zinc-700/50`, `bg-zinc-900/20`, `text-zinc-500`, `text-zinc-400`, `hover:bg-zinc-800/50` | MEDIA |
| `BentoQuadrant.tsx` | 1: default `colorToken = 'text-emerald-400'` | MEDIA |
| `StreakCalendar.tsx` | 4: `bg-emerald-400`, `shadow rgba hardcodeado`, `text-zinc-950`, `bg-zinc-800/50` | MEDIA |
| `RoutineCard.tsx` | 11: múltiples `text-emerald-400`, `bg-zinc-900/800/950`, `text-white`, `text-zinc-200/300/400/600` | MEDIA |
| `RoutineCardPremium.tsx` | 4: `border-zinc-800/50`, `bg-zinc-900/80`, `bg-zinc-800/900/950` | MEDIA |
| `RecipeCard.tsx` | 14: `text-emerald-400`, `text-violet-400`, `text-rose-400`, `bg-zinc-900`, `text-zinc-300/400/500` | MEDIA |
| `RecipeCardPremium.tsx` | 8: `bg-violet-500/15`, `text-violet-400`, `bg-cyan-400/15`, `bg-orange-500/15`, `bg-emerald-400/10`, `bg-zinc-800` | MEDIA |
| `LogEntryCard.tsx` | 19: `bg-zinc-800/50`, `text-zinc-300/100/500/600/700`, `bg-emerald-500/10`, `text-emerald-400`, `bg-violet-500/10`, `text-amber-400`, `text-violet-400` | MEDIA |
| `ProgressThumbnail.tsx` | 7: `text-emerald-400`, `bg-emerald-400`, `border-emerald-500`, `shadow rgba hardcodeado`, `bg-zinc-950/700/900` | MEDIA |
| `TrendChartCard.tsx` | 8: `text-emerald-400/500`, `text-rose-400`, `text-zinc-500/800`, `stopColor hardcodeado rgb(16,185,129)` | MEDIA |
| `SmartRestTimer.tsx` | 10: `text-cyan-400`, `text-emerald-400`, `text-amber-400`, `drop-shadow rgba hardcodeado`, `text-zinc-800/50` | MEDIA |
| `SmartFlexibleMacros.tsx` | 22: `text-violet-500`, `bg-violet-500`, `text-cyan-400`, `bg-cyan-400`, `text-orange-500`, `bg-orange-500`, `text-amber-400`, `bg-rose-500/400`, `bg-zinc-800/50`, `text-zinc-400/500` | MEDIA |
| `NutritionSummaryMini.tsx` | 7: `text-emerald-400`, `text-rose-500`, `bg-violet-500`, `bg-cyan-400`, `bg-orange-500`, `text-zinc-800/50` | MEDIA |
| `MasterNutritionDashboard.tsx` | 32: masivo — `stroke-emerald-400`, `stroke-rose-500`, `stroke-amber-400`, múltiples `bg-zinc-*`, `text-white`, `bg-emerald-400/20`, `bg-rose-500/20` etc. | BAJA (pantalla Nutrición) |
| `IngredientListItem.tsx` | 25: `bg-violet-500/20`, `text-violet-400`, `bg-emerald-500/20`, `text-emerald-400`, `bg-rose-500/20`, `text-rose-400`, `text-zinc-100/300/400/500/600/700` | BAJA (pantalla Nutrición) |
| `InteractiveProgressWidget.tsx` | 19: `bg-zinc-900/800`, `border-zinc-800`, `text-emerald-400/500`, `text-white`, `text-zinc-300/500` | BAJA (pantalla Progreso) |
| `IngredientEditModal.tsx` | 6: `text-violet-400`, `text-emerald-400`, `text-rose-400`, `bg-zinc-950/60`, `border-zinc-800/50`, `text-zinc-500` | BAJA (pantalla Nutrición) |

#### 🟡 Componentes legacy (marcados @deprecated pero aún usados):
- `Button.tsx` → ✅ Ya usa tokens (bien migrado)
- `Card.tsx` → ✅ Ya usa tokens
- `Modal.tsx` → ✅ Ya usa tokens
- `Input.tsx` → ✅ Ya usa tokens
- Estos componentes legacy están bien tokenizados pero NO deben usarse en nuevas vistas.

#### 🟡 Componentes layout:
- `AppShell.tsx` → ✅ Usa tokens
- `BottomNav.tsx` → ✅ Usa tokens
- `GlobalOverlays.tsx` → 🔴 1 hardcode: `bg-amber-400` y `bg-red-500` en SyncIndicator
- `SegmentedControl.tsx` → 🔴 1 hardcode: `bg-white/12` en badge
- `ImmersiveFocusShell.tsx` → ✅ Usa tokens
- Resto → ✅ Limpios

---

### 1.3 Problema de Shadow/Glow — Inventario completo

| Archivo | Tipo de glow | Hardcodeado? |
|---|---|---|
| `PremiumButton.tsx` | `shadow-glow` | Token ✅ pero valor muy fuerte |
| `StreakCalendar.tsx` | `shadow-[0_0_15px_rgba(52,211,153,0.5)]` | 🔴 Hardcode |
| `PremiumFilterTab.tsx` | `shadow-[0_0_10px_rgba(52,211,153,0.5)]` | 🔴 Hardcode |
| `SmartRestTimer.tsx` | `drop-shadow(0 0 12px rgba(52,211,153,0.4))` | 🔴 Hardcode inline |
| `LogEntryCard.tsx` | `drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]` | 🔴 Hardcode |
| `ProgressThumbnail.tsx` | `shadow-[0_0_10px_rgba(52,211,153,0.5)]` | 🔴 Hardcode |
| `WeeklyStreakTracker.tsx` | `shadow-glow` | Token ✅ |
| `NonNegotiableCard.tsx` | `shadow-glow` | Token ✅ |
| `TrendChartCard.tsx` | SVG filter glow | Inline, no token |

**Decisión necesaria:** ¿Eliminar TODOS los glows, o reducirlos a algo casi imperceptible (3-5% opacidad)?

---

### 1.4 Responsividad — Problemas de Gigantismo

#### Valores arbitrarios fijos encontrados:
- **422 instancias** de valores arbitrarios (`w-[Npx]`, `text-[Npx]`, etc.) en 103 archivos
- Los peores ofensores:
  - `NutritionMainView.tsx` — 73 hardcodes de color + 19 valores fijos
  - `RoutineLaunchScreen.tsx` — 21 hardcodes + 10 valores fijos
  - `InfoStepScreenView.tsx` — 19 hardcodes + 5 valores fijos
  - `RecipeEditorView.tsx` — 14 valores fijos
  - `ProgressGallery.tsx` — 14 valores fijos

#### Problemas de escalado identificados:
1. **`GiantValue`** usa `text-5xl md:text-6xl lg:text-7xl` — en 2K esto es enorme. Necesita `clamp()`.
2. **`MediumValue`** usa `text-4xl md:text-5xl` — misma situación.
3. **`SquishyCard`** padding `lg` = `p-5 md:p-8` — en 2K el padding es excesivo.
4. **`SmartRestTimer`** usa `SVG_SIZE = 320` hardcoded en px — no escala.
5. **`MasterNutritionDashboard`** usa `RING_SIZE = 240`, `STROKE_W = 24` hardcoded — no escala.
6. **`PremiumStepper`** botones `w-20 h-20` (5rem) — demasiado grandes en 2K.
7. **`BentoGrid`** no tiene `max-w-*` para desktop grande.
8. **`max-w-[340px]`** en `RoutineCard` y `RecipeCard` — hardcoded pero razonable para cards.

#### Breakpoints actuales:
- Solo se usan `md:` y `lg:` esporádicamente.
- No hay breakpoint `xl:` ni `2xl:` en casi ningún componente.
- No se usa `clamp()` para tipografía fluida.
- El layout principal (`DashboardScreen`) usa `max-w-5xl` — correcto.

---

### 1.5 Arquitectura — Cumplimiento Headless

#### ✅ Hooks controladores bien separados:
- `useTodayDashboardController` — ✅
- `useHabitTrackerController` — ✅
- `useFreeActivityController` — ✅
- `useFlexibleMacros` — ✅
- `useRestTimer` — ✅

#### 🔴 Componentes con estado interno (violación headless):
- `SearchBar.tsx` — `useState(focused)` — aceptable (estado UI local)
- `InteractiveProgressWidget.tsx` — múltiples `useState` para tabs, dropdown, animaciones — debería extraerse a hook
- `LogEntryCard.tsx` — `useState(isExpanded)` — aceptable (accordion local)
- `IngredientEditModal.tsx` — múltiples `useState` para form fields — debería usar un `useIngredientEditor` hook

#### ✅ Componentes sin lógica (puro JSX):
La mayoría de ui-premium son correctamente declarativos.

---

## PARTE 2 — PLAN DE REDISEÑO

### Fase 0: Correcciones críticas del sistema de tokens
**Prioridad:** BLOQUEANTE — sin esto nada funciona bien
1. Fix formato RGB en `tailwind.css` (comas → espacios)
2. Reducir `--shadow-glow` a `0 0 12px rgba(..., 0.06)` 
3. Fix `index.html` — quitar `bg-zinc-950 text-zinc-50`
4. Agregar al `safelist` de `tailwind.config.cjs` los colores usados dinámicamente
5. Traducir labels del UIKit a español

### Fase 1: Migrar componentes "primitivos" del UI Kit
**Son los bloques base que usan TODOS los demás:**
1. `PremiumModal.tsx` — reemplazar todos zinc/emerald → tokens
2. `PremiumInput.tsx` — reemplazar zinc/emerald → tokens
3. `PremiumStepper.tsx` — reemplazar zinc → tokens
4. `PremiumChip.tsx` — reemplazar zinc/emerald → tokens
5. `PremiumBadge.tsx` — reemplazar emerald → tokens
6. `PremiumFilterTab.tsx` — reemplazar zinc/emerald + eliminar glow hardcodeado
7. `SegmentedTabs.tsx` — reemplazar emerald/zinc → tokens
8. `SearchBar.tsx` — reemplazar zinc/emerald → tokens
9. `IconButton.tsx` — reemplazar zinc/emerald → tokens
10. `ImageUploadArea.tsx` — reemplazar zinc → tokens

### Fase 2: Migrar componentes "compuestos" del UI Kit
**Dependen de los primitivos de Fase 1:**
1. `BentoQuadrant.tsx` — cambiar default prop emerald → brand-accent
2. `StreakCalendar.tsx` — reemplazar emerald + eliminar glow rgba
3. `RoutineCard.tsx` — reemplazar 11 hardcodes
4. `RoutineCardPremium.tsx` — reemplazar 4 hardcodes
5. `RecipeCard.tsx` — reemplazar 14 hardcodes (colores macro)
6. `RecipeCardPremium.tsx` — reemplazar macroToneClasses a tokens
7. `LogEntryCard.tsx` — reemplazar typeConfig colors + glow
8. `ProgressThumbnail.tsx` — reemplazar emerald + glow rgba
9. `SmartRestTimer.tsx` — reemplazar phaseConfig colors + glow inline
10. `TrendChartCard.tsx` — reemplazar emerald en SVG + stopColor hardcodeado

### Fase 3: Migrar componentes de nutrición del UI Kit
**Solo se tocan en preparación para la pantalla Nutrición:**
1. `SmartFlexibleMacros.tsx` — 22 hardcodes → tokens macro
2. `NutritionSummaryMini.tsx` — 7 hardcodes → tokens macro
3. `MasterNutritionDashboard.tsx` — 32 hardcodes → tokens macro
4. `IngredientListItem.tsx` — 25 hardcodes → tokens macro
5. `IngredientEditModal.tsx` — 6 hardcodes → tokens

### Fase 4: Responsividad y tipografía fluida
1. Implementar `clamp()` en tokens tipográficos (`tailwind.css`)
2. Agregar breakpoints `xl:` y `2xl:` al layout principal
3. Revisar y cap all SVG ring/timer sizes con `max()` o `min()`
4. Verificar en viewport 1080p y móvil 375px

### Fase 5: Actualizar UIKit (DesignSystemDevScreen)
1. Verificar que TODOS los componentes migrados se ven correctos
2. Actualizar documentación inline
3. Actualizar `UI_MANIFEST.md` con nuevos estándares

### Fase 6: Construir pantallas (post-UIKit)
**Orden:**
1. **Hoy** (DashboardScreen) — ya 90% migrado, solo pulir
2. **Nutrición** — la más compleja, depende de Fase 3
3. **Biblioteca** — rutinas y recetas
4. **Progreso** — gráficas y galería

---

## PARTE 3 — DECISIONES DE DISEÑO PENDIENTES

### Decisión 1: Intensidad del glow
**Opciones:**
- A) Eliminar completamente → look ultra-limpio Apple
- B) Reducir a 4-6% opacidad, radio 8-12px → casi imperceptible, solo en hover/active
- C) Solo en CTA primario, eliminado en todo lo demás

### Decisión 2: Colores de macronutrientes
Los colores actuales del "dialecto canónico" son:
- Proteína = violet-500 (`#8B5CF6`)
- Carbohidratos = cyan-400 (`#22D3EE`) 
- Grasas = orange-400 (`#FB923C`)
¿Se mantienen estos colores o se quieren cambiar?

### Decisión 3: Tipografía fluida
¿Usar `clamp()` para que la tipografía escale automáticamente entre móvil y desktop? Ejemplo:
- `GiantValue`: `clamp(2.5rem, 4vw, 4.5rem)` en vez de `text-5xl md:text-6xl lg:text-7xl`
- Esto evita el gigantismo en 2K y la miniatura en móvil.

### Decisión 4: ¿Mantener componentes legacy?
Los archivos `Button.tsx`, `Card.tsx`, `Modal.tsx`, `Input.tsx` están marcados `@deprecated` pero aún los usan:
- `GlobalOverlays.tsx` usa `Button.tsx`
- `PageHeader.tsx` usa `Button.tsx`
- `PageSection.tsx` usa `Card.tsx`
¿Los eliminamos y reemplazamos por equivalentes premium, o los mantenemos como wrappers?

---

## PARTE 4 — MÉTRICAS DE LA AUDITORÍA

| Métrica | Valor |
|---|---|
| Total archivos en `components/ui-premium/` | 36 |
| Archivos ya migrados a tokens | 7 (19%) |
| Archivos pendientes de migración | 26 (72%) |
| Archivos sin hardcodes (hooks/types) | 3 (8%) |
| Hardcodes de color en `components/` | 275 instancias en 37 archivos |
| Hardcodes de color en `screens/` | 165 instancias en 15 archivos |
| Glows/sombras hardcodeados | 18 instancias en 16 archivos |
| Valores arbitrarios (px/rem fijos) | 422 instancias en 103 archivos |
| Componentes legacy aún en uso | 4 (@deprecated) |
