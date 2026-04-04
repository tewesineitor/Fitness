# FIT ARCHITECT — REDISEÑO FASE 6

> **Serie:** Doc 4 de 4 → (0-1) · (2-3) · (4-5) · **(6)**
> **Prerrequisito:** Haber completado `REDESIGN_FASE_0_1.md`, `REDESIGN_FASE_2_3.md` y `REDESIGN_FASE_4_5.md` (todos los checklists aprobados)
> **Referencia:** Diccionario de Traducción y Paleta en `REDESIGN_FASE_0_1.md`

---

# FASE 6 — MIGRAR PANTALLAS + VERIFICACIÓN FINAL

> **Objetivo:** Migrar todas las pantallas (`screens/`) que aún contengan colores hardcodeados,
> eliminar cualquier residuo de glow, y realizar una verificación global exhaustiva.
> **Archivos:** Todos los archivos en `screens/`, `components/layout/`, hooks con colores
> **Tiempo estimado:** 4-6 horas

---

## Paso 6.1 — Inventario de pantallas a migrar

### Pantallas principales (directorio `screens/`)

Buscar todas las pantallas con hardcodes ejecutando:
```bash
grep -rn "emerald\|zinc-[0-9]\|text-white\|violet-[0-9]\|cyan-[0-9]\|orange-[0-9]\|rose-[0-9]\|amber-[0-9]\|shadow-glow\|shadow-\[0_0" screens/ --include="*.tsx"
```

Las pantallas probables que necesitan migración:

| Pantalla | Ruta probable | Complejidad |
|---|---|---|
| Nutrición | `screens/nutricion/NutricionScreen.tsx` | Alta — macros, charts |
| Biblioteca | `screens/biblioteca/BibliotecaScreen.tsx` | Media — tarjetas, filtros |
| Progreso | `screens/progreso/ProgresoScreen.tsx` | Alta — charts SVG, thumbnails |
| Configuración | `screens/configuracion/ConfiguracionScreen.tsx` | Baja — formularios |
| Login/Auth | `screens/auth/LoginScreen.tsx` (si existe) | Baja — formulario simple |
| Perfil | `screens/perfil/PerfilScreen.tsx` (si existe) | Baja |
| Entrenamiento activo | `screens/entrenamiento/` | Media — timer, sets |

> **Nota:** `DashboardScreen.tsx` ya fue migrado en sesiones anteriores. Verificar igualmente
> con el grep que no queden residuos.

## Paso 6.2 — Reglas de migración para pantallas

Aplicar exactamente las mismas reglas que en Fases 1-3:

1. **Diccionario de Traducción** (Doc 1, Sección B) como referencia principal
2. **Cada clase Tailwind hardcodeada** → reemplazar con su token semántico
3. **Cada `style={{}}` con rgba/hex** → reemplazar con CSS variable
4. **Cada glow** → eliminar
5. **NO cambiar lógica** de hooks, handlers, estado
6. **NO cambiar estructura JSX** (no agregar/quitar elementos)
7. **NO agregar/quitar comentarios**

### Patrones frecuentes en pantallas:

**Headers/Titles:** 
- `text-white text-2xl font-bold` → `text-text-primary text-2xl font-bold`
- `text-zinc-400 text-sm` → `text-text-secondary text-sm`

**Contenedores:**
- `bg-zinc-900 rounded-xl border border-zinc-800` → `bg-surface-bg rounded-xl border border-surface-border`
- `bg-zinc-950` → `bg-bg-base`

**Botones inline (no componente):**
- `bg-emerald-400 text-zinc-950` → `bg-brand-accent text-brand-accent-foreground`
- `hover:bg-emerald-500` → `hover:bg-brand-accent/90`

**Dividers:**
- `border-zinc-800` o `divide-zinc-800` → `border-surface-border` / `divide-surface-border`
- `bg-zinc-800 h-px` → `bg-surface-border h-px`

**Status indicators:**
- `text-emerald-400` (éxito) → `text-brand-accent` o `text-success`
- `text-rose-400` (error) → `text-danger`
- `text-amber-400` (warning) → `text-warning`

**Gradientes inline en style:**
- `background: linear-gradient(...rgba(52,211,153,...)...)` → usar `rgba(var(--color-brand-accent-rgb), 0.X)`
- `background: radial-gradient(...rgba(110,231,183,...)...)` → usar `rgba(var(--color-brand-accent-rgb), 0.X)`

## Paso 6.3 — Migrar cada pantalla

### 6.3.1 — Pantalla de Nutrición

**Ruta probable:** `screens/nutricion/NutricionScreen.tsx` o similar

Esta pantalla es la más compleja por los colores macro. Buscar específicamente:

| Patrón | → Token | Contexto |
|---|---|---|
| `text-violet-*` / `bg-violet-*` | `text-brand-protein` / `bg-brand-protein/*` | Proteína |
| `text-cyan-*` / `bg-cyan-*` | `text-brand-carbs` / `bg-brand-carbs/*` | Carbohidratos |
| `text-orange-*` / `bg-orange-*` | `text-brand-fat` / `bg-brand-fat/*` | Grasas |
| `text-emerald-*` (kcal/totals) | `text-brand-accent` | Calorías totales |
| Anillos SVG con hex macro | CSS vars (ver Fase 3 > SmartFlexibleMacros) | Gauges |
| `bg-zinc-*` | Token superficie correspondiente | Fondos |
| `text-white` | `text-text-primary` | Títulos |

### 6.3.2 — Pantalla de Biblioteca

**Ruta probable:** `screens/biblioteca/BibliotecaScreen.tsx`

Pantalla con tarjetas de rutinas y recetas. Buscar:

| Patrón | → Token |
|---|---|
| Filtros con `bg-emerald-400` (activo) | `bg-brand-accent` + `text-brand-accent-foreground` |
| Filtros con `bg-zinc-800` (inactivo) | `bg-surface-raised` + `text-text-secondary` |
| Grid de tarjetas con fondos `zinc-*` | Tokens superficie |
| Badges con colores hardcodeados | Tokens semánticos |
| Search bar styling (si inline, no componente) | Diccionario B |

### 6.3.3 — Pantalla de Progreso

**Ruta probable:** `screens/progreso/ProgresoScreen.tsx`

Pantalla con gráficos de tendencia y thumbnails de fotos. Buscar:

| Patrón | → Token | Contexto |
|---|---|---|
| Trend chart SVG colors | CSS vars (ver Fase 2 > TrendChartCard) | Gráfico |
| Photo grid borders | `border-surface-border` | Thumbnails |
| Selected photo ring `border-emerald-400` | `border-brand-accent` | Selección |
| Metric cards con `bg-zinc-800` | `bg-surface-raised` | KPIs |
| Textos de delta positivo `text-emerald-400` | `text-brand-accent` | +2.5kg |
| Textos de delta negativo `text-rose-400` | `text-danger` | -1.2% |

### 6.3.4 — Pantalla de Entrenamiento Activo

**Ruta probable:** `screens/entrenamiento/` o `screens/workout/`

| Patrón | → Token |
|---|---|
| Timer ring SVG | CSS vars (ver Fase 2 > SmartRestTimer) |
| Set indicators `bg-emerald-400` (completado) | `bg-brand-accent` |
| Set indicators `bg-zinc-700` (pendiente) | `bg-surface-hover` |
| Botón "Siguiente Serie" `bg-emerald-400` | `bg-brand-accent` + `text-brand-accent-foreground` |
| RPE/effort colors | Tokens según contexto |

### 6.3.5 — Pantallas menores (Config, Perfil, Auth)

Estas suelen tener menos colores custom. Aplicar el Diccionario de Traducción genérico.
Buscar especialmente:
- Inputs con focus ring emerald → `focus:ring-brand-accent`
- Botones primarios → `bg-brand-accent` + `text-brand-accent-foreground`
- Links → `text-brand-accent`
- Alerts/toasts → tokens semánticos

## Paso 6.4 — Migrar `components/layout/`

Los archivos de layout fueron revisados anteriormente y la mayoría ya usan tokens.
Ejecutar verificación:

```bash
grep -rn "emerald\|zinc-[0-9]\|text-white\|shadow-glow" components/layout/ --include="*.tsx"
```

Si hay resultados, migrar con el Diccionario. Archivos a verificar:
- `AppShell.tsx` — gradient puede tener rgba hardcodeado
- `BottomNav.tsx` — estados activo/inactivo
- `GlobalOverlays.tsx` — toasts, sync indicator
- `PageHeader.tsx` — títulos y subtítulos
- `AppLoadingScreen.tsx` — spinner, texto carga

## Paso 6.5 — Migrar hooks con colores

Algunos hooks devuelven clases de color o mapeos de estilo. Buscar:

```bash
grep -rn "emerald\|zinc-[0-9]\|violet-[0-9]\|cyan-[0-9]\|orange-[0-9]\|rose-[0-9]" hooks/ --include="*.ts" --include="*.tsx"
```

Para cada resultado:
- Si el hook devuelve una clase Tailwind → cambiar al token semántico
- Si el hook devuelve un hex/rgb → cambiar a la variable CSS
- **Caso especial:** `useHabitTrackerController.ts` ya fue migrado (icons monocromo)

## Paso 6.6 — Búsqueda global de residuos

Ejecutar estas búsquedas desde la raíz del proyecto. **Cada una debe devolver 0 resultados**
(excluyendo `node_modules/`, `dist/`, `.git/`, y los propios archivos `docs/REDESIGN_*.md`):

```bash
# 1. Emerald (el más crítico — era el color antiguo)
grep -rn "emerald" --include="*.tsx" --include="*.ts" --include="*.css" --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=.git --exclude-dir=docs .

# 2. Zinc numérico en componentes (NO en tailwind.css ni tailwind.config.cjs)
grep -rn "zinc-[0-9]" --include="*.tsx" --include="*.ts" --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=.git --exclude-dir=docs .

# 3. text-white en componentes
grep -rn "text-white" --include="*.tsx" --include="*.ts" --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=.git --exclude-dir=docs .

# 4. Shadow glow
grep -rn "shadow-glow\|glow-pulse\|drop-shadow-\[" --include="*.tsx" --include="*.ts" --include="*.css" --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=.git --exclude-dir=docs .

# 5. Hex hardcodeados de colores antiguos
grep -rn "#34d399\|#6ee7b7\|#10b981\|#8b5cf6\|#22d3ee\|#f87171" --include="*.tsx" --include="*.ts" --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=.git --exclude-dir=docs .

# 6. RGBA hardcodeados
grep -rn "rgba(52,211\|rgba(110,231\|rgba(16,185\|rgba(139,92\|rgba(34,211" --include="*.tsx" --include="*.ts" --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=.git --exclude-dir=docs .
```

**Si alguna búsqueda devuelve resultados:** Migrar ese archivo con el Diccionario antes de continuar.

## Paso 6.7 — Test visual completo

Navegar por CADA pantalla de la app y verificar visualmente:

### Dashboard (Hoy)
- [ ] Header muestra saludo con tipografía Satoshi
- [ ] Tarjetas de entrenamiento con fondo `surface-raised`
- [ ] Barra de macros con colores correctos (violet/sky/orange)
- [ ] Streak tracker con dots teal
- [ ] Non-negotiables con iconos monocromo
- [ ] Sin glow en ningún elemento

### Nutrición
- [ ] Gauges/anillos muestran violet-400 / sky-400 / orange-400
- [ ] Calorías totales en teal (brand-accent)
- [ ] Alertas de exceso en rose-400 (danger)
- [ ] Tarjetas de recetas con macros en colores correctos
- [ ] Fondos de tarjetas son surface tokens (no zinc directo)

### Biblioteca
- [ ] Filtros activos en teal con texto negro
- [ ] Filtros inactivos en surface-raised con texto secundario
- [ ] Tarjetas de rutinas con colores correctos
- [ ] Search bar con focus ring teal

### Progreso
- [ ] Gráficos de tendencia con línea teal
- [ ] Thumbnails con borde teal al seleccionar
- [ ] Deltas positivos en teal, negativos en rose
- [ ] Sin glow en anillos ni gráficos

### Entrenamiento activo
- [ ] Timer ring con colores de fase correctos (amber/sky/teal)
- [ ] Sets completados con dot teal
- [ ] Botón "Siguiente" en teal con texto negro

### Configuración / Perfil
- [ ] Inputs con focus ring teal
- [ ] Botones primarios en teal con texto negro
- [ ] Links en teal

### Cross-cutting
- [ ] Bottom nav: ícono activo en teal, inactivo en muted
- [ ] Toasts y overlays usan tokens correctos
- [ ] Loading screen usa spinner con borde teal
- [ ] Ninguna pantalla tiene glow visible
- [ ] Tipografía Satoshi visible en headings (verificar en DevTools que font-family = "Satoshi Variable")

---

## ✅ CHECKLIST FINAL — FASE 6

### Búsquedas globales (todas deben dar 0 resultados)
- [ ] `grep "emerald"` en `*.tsx *.ts *.css` → 0 (excluyendo node_modules, dist, docs)
- [ ] `grep "zinc-[0-9]"` en `*.tsx *.ts` → 0 (excluyendo node_modules, dist, docs)
- [ ] `grep "text-white"` en `*.tsx *.ts` → 0 (excluyendo node_modules, dist, docs)
- [ ] `grep "shadow-glow\|glow-pulse"` en todo → 0
- [ ] `grep "#34d399\|#6ee7b7\|#10b981\|#8b5cf6\|#22d3ee"` en `*.tsx *.ts` → 0
- [ ] `grep "rgba(52,211\|rgba(110,231\|rgba(16,185"` en `*.tsx *.ts` → 0

### Compilación y runtime
- [ ] `npm run dev` sin errores
- [ ] `npm run build` sin errores (build de producción)
- [ ] Consola del navegador sin warnings de CSS/Tailwind
- [ ] No hay clases "desconocidas" que rendericen sin estilo

### Verificación visual por pantalla
- [ ] Dashboard — tokens correctos, sin glow
- [ ] Nutrición — macros correctos, gauges SVG correctos
- [ ] Biblioteca — filtros y tarjetas correctos
- [ ] Progreso — charts y thumbnails correctos
- [ ] Entrenamiento — timer y sets correctos
- [ ] Config/Perfil — inputs y botones correctos
- [ ] UIKit (DesignSystemDevScreen) — swatches, tipografía, componentes correctos

### Tipografía
- [ ] DevTools > Computed > font-family muestra "Satoshi Variable" en headings
- [ ] DevTools > Computed > font-family muestra "Satoshi Variable" en body text
- [ ] DevTools > Computed > font-family muestra "JetBrains Mono" en valores numéricos
- [ ] GiantValue escala fluidamente al redimensionar ventana
- [ ] MediumValue escala fluidamente
- [ ] StatValue escala fluidamente

### Paleta
- [ ] Acento es teal `#5EEAD4` (no emerald `#6EE7B7`)
- [ ] Proteína es violet-400 `#A78BFA` (no violet-500 `#8B5CF6`)
- [ ] Carbos es sky-400 `#38BDF8` (no cyan-400 `#22D3EE`)
- [ ] Danger es rose-400 `#FB7185` (no red-400 `#F87171`)
- [ ] Foreground sobre acento es negro `#09090B`

---

# RESUMEN FINAL DE LA SERIE

| Doc | Fases | Contenido principal |
|---|---|---|
| `REDESIGN_FASE_0_1.md` | 0 + 1 | Paleta definitiva, diccionario, fix tokens, migrar 10 primitivos |
| `REDESIGN_FASE_2_3.md` | 2 + 3 | Migrar 10 compuestos + 6 componentes nutrición |
| `REDESIGN_FASE_4_5.md` | 4 + 5 | Tipografía fluida, SVG responsivos, UIKit, manifiestos, legacy |
| `REDESIGN_FASE_6.md` | 6 | Migrar pantallas, búsqueda global de residuos, verificación final |

**Orden de ejecución obligatorio:** 0 → 1 → 2 → 3 → 4 → 5 → 6

**Resultado esperado al completar las 6 fases:**
- Zero hardcodes de color en toda la codebase
- Paleta Mentil (Teal-300) coherente en toda la app
- Tipografía Satoshi Variable con escalado fluido
- Cero glow — estética Apple clean
- Colores macro armonizados en tier -400
- Design system completamente documentado y actualizado
