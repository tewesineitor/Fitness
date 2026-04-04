# FIT ARCHITECT — REDISEÑO FASE 4 + FASE 5

> **Serie:** Doc 3 de 4 → (0-1) · (2-3) · **(4-5)** · (6)
> **Prerrequisito:** Haber completado `REDESIGN_FASE_0_1.md` y `REDESIGN_FASE_2_3.md` (checklists aprobados)
> **Referencia:** Diccionario de Traducción y Paleta en `REDESIGN_FASE_0_1.md`

---

# FASE 4 — RESPONSIVIDAD + TIPOGRAFÍA FLUIDA

> **Objetivo:** Implementar `clamp()` para que los textos grandes escalen fluidamente entre
> móvil (375px), desktop 1080p (1920px) y 2K (2560px). Ajustar contenedores y SVGs
> para que sean responsivos sin saltos bruscos entre breakpoints.
> **Archivos principales:** `components/ui-premium/Typography.tsx`, `styles/tailwind.css`, SVGs grandes
> **Tiempo estimado:** 2-3 horas

---

## Paso 4.1 — Agregar variables de tipografía fluida en `styles/tailwind.css`

En la sección `/* ─── Escala Tipográfica ─── */` dentro de `:root` (aprox. líneas 86-96),
**agregar** las siguientes variables DESPUÉS de las existentes (no reemplazar las fijas):

```css
  /* ─── Tipografía Fluida (clamp) ─── */
  --font-size-giant: clamp(2.5rem, 2vw + 2rem, 4.5rem);
  --font-size-medium-value: clamp(1.875rem, 1.5vw + 1.5rem, 3rem);
  --font-size-stat-value: clamp(1.5rem, 1vw + 1.25rem, 2.25rem);
  --font-size-modal-title: clamp(1.5rem, 0.5vw + 1.25rem, 1.875rem);
```

**Comportamiento esperado de cada variable:**

| Variable | A 375px (móvil) | A 1080px | A 1920px (FHD) | A 2560px (2K) |
|---|---|---|---|---|
| `--font-size-giant` | 2.5rem (40px) | 3.16rem (50px) | 3.7rem (59px) | cap 4.5rem (72px) |
| `--font-size-medium-value` | 1.875rem (30px) | 2.31rem (37px) | 2.79rem (45px) | cap 3rem (48px) |
| `--font-size-stat-value` | 1.5rem (24px) | 1.93rem (31px) | 2.45rem (39px) | cap 2.25rem (36px) |
| `--font-size-modal-title` | 1.5rem (24px) | 1.79rem (29px) | 2.21rem (35px) | cap 1.875rem (30px) |

> Los tamaños fijos existentes (`--font-size-xs`, `--font-size-sm`, `--font-size-base`, etc.)
> NO se modifican. Solo los textos grandes necesitan escalado fluido.

## Paso 4.2 — Actualizar `Typography.tsx`

**Ruta:** `components/ui-premium/Typography.tsx`

Este archivo define los componentes tipográficos canónicos. Cada componente renderiza un
elemento con clases de Tailwind. Los que tienen tamaños grandes necesitan usar las nuevas
variables `clamp()`.

### Componentes a actualizar:

**`GiantValue`** — Hero numbers, KPI grandes, timers centrales.
- Buscar la clase de tamaño actual (probablemente `text-5xl md:text-6xl lg:text-7xl` o similar)
- Reemplazar con: `text-[length:var(--font-size-giant)]`
- Mantener `font-heading font-black` y `tracking-tight` existentes
- Mantener `text-text-primary` (ya migrado)

**`MediumValue`** — Valores secundarios, widgets.
- Buscar la clase de tamaño actual (probablemente `text-4xl md:text-5xl` o similar)
- Reemplazar con: `text-[length:var(--font-size-medium-value)]`
- Mantener `font-heading font-bold` existentes

**`StatValue`** — Métricas en tarjetas.
- Buscar la clase de tamaño actual (probablemente `text-3xl md:text-4xl` o similar)
- Reemplazar con: `text-[length:var(--font-size-stat-value)]`
- Mantener `font-mono font-bold tracking-tight` existentes

**`ModalTitle`** — Cabeceras de modals y sheets.
- Buscar la clase de tamaño actual (probablemente `text-3xl` o `text-2xl`)
- Reemplazar con: `text-[length:var(--font-size-modal-title)]`
- Mantener `font-heading font-semibold` existentes

### Componentes que NO cambian (tamaño fijo):
- `SectionTitle` — mantener `text-xl` (1.25rem fijo)
- `CardTitle` — mantener `text-base` (1rem fijo)
- `BodyText` — mantener `text-sm` (0.875rem fijo)
- `MutedText` — mantener `text-xs` (0.75rem fijo)
- `EyebrowText` — mantener `text-[10px]` fijo
- `StatLabel` — mantener `text-[9px]` fijo
- `TabLabel` — mantener `text-base` fijo
- `MonoValue` — mantener `text-sm` fijo

### Formato de la clase Tailwind para clamp:

La sintaxis para usar una variable CSS como font-size en Tailwind es:
```
text-[length:var(--font-size-giant)]
```
El prefijo `length:` es necesario para que Tailwind lo interprete como font-size y no como color.

## Paso 4.3 — SVGs responsivos grandes

Los componentes con SVGs grandes (anillos, gráficos) actualmente usan constantes fijas
en píxeles. Para hacer estos responsivos:

### SmartRestTimer.tsx — Anillo del timer

El componente probablemente tiene una constante como `SVG_SIZE = 320` o `RING_SIZE = 300`.

**Estrategia:** En vez de cambiar la constante JS, envolver el SVG en un contenedor responsive:

```tsx
{/* Contenedor responsive para el SVG del timer */}
<div className="w-full max-w-[320px] aspect-square mx-auto">
  <svg viewBox="0 0 320 320" className="w-full h-full">
    {/* ... contenido SVG sin cambios ... */}
  </svg>
</div>
```

**Reglas:**
1. El SVG mantiene su `viewBox` original (ej: `0 0 320 320`)
2. El contenedor limita el tamaño máximo con `max-w-[320px]`
3. `aspect-square` mantiene la proporción
4. `w-full` permite que se reduzca en pantallas pequeñas
5. El SVG usa `className="w-full h-full"` para llenar el contenedor

### SmartFlexibleMacros.tsx / MasterNutritionDashboard — Gauges

Aplicar la misma técnica:
```tsx
<div className="w-full max-w-[240px] aspect-square mx-auto">
  <svg viewBox="0 0 240 240" className="w-full h-full">
    {/* ... */}
  </svg>
</div>
```

### TrendChartCard.tsx — Gráfico de línea

Los gráficos de línea típicamente ya son responsivos si usan `viewBox` + `preserveAspectRatio`.
Verificar que:
1. El `<svg>` tiene `viewBox` definido
2. El `<svg>` tiene `className="w-full"` y NO tiene `width`/`height` fijos como atributos
3. Si tiene `width={400} height={200}`, cambiar a `viewBox="0 0 400 200" className="w-full h-auto"`

## Paso 4.4 — Padding responsivo en SquishyCard

**Ruta:** `components/ui-premium/SquishyCard.tsx`

El componente tiene variantes de padding (sm, md, lg). Verificar que la variante `lg`
tenga padding escalable:

**Buscar** el mapeo de padding `lg` (probablemente `p-5` o `p-6`).
**Reemplazar con:** `p-5 md:p-6 xl:p-8`

Esto permite:
- Móvil: padding 20px (`p-5`)
- Tablet/desktop: padding 24px (`md:p-6`)
- Pantalla grande: padding 32px (`xl:p-8`)

Las variantes `sm` y `md` del padding no necesitan cambios.

## Paso 4.5 — Breakpoint para 2K (opcional pero recomendado)

**Ruta:** `tailwind.config.cjs`

Agregar un breakpoint `2xl` personalizado si no existe (Tailwind ya lo incluye por defecto a 1536px):

Verificar que `screens` no está sobreescrito. Si lo está, asegurar que incluye:
```javascript
screens: {
  // ... breakpoints existentes
  '2xl': '1536px',
}
```

Si `screens` no está en el config, no hace falta agregarlo (Tailwind lo incluye por defecto).

---

## ✅ CHECKLIST FASE 4

- [ ] **tailwind.css:** Variables `--font-size-giant`, `--font-size-medium-value`, `--font-size-stat-value`, `--font-size-modal-title` definidas con `clamp()`
- [ ] **Typography.tsx > GiantValue:** Usa `text-[length:var(--font-size-giant)]`
- [ ] **Typography.tsx > MediumValue:** Usa `text-[length:var(--font-size-medium-value)]`
- [ ] **Typography.tsx > StatValue:** Usa `text-[length:var(--font-size-stat-value)]`
- [ ] **Typography.tsx > ModalTitle:** Usa `text-[length:var(--font-size-modal-title)]`
- [ ] **Typography.tsx:** Los componentes fijos (SectionTitle, CardTitle, BodyText, etc.) NO fueron modificados
- [ ] **SmartRestTimer.tsx:** SVG anillo en contenedor responsivo con `max-w-[320px] aspect-square`
- [ ] **SmartFlexibleMacros.tsx:** SVG gauges en contenedor responsivo
- [ ] **TrendChartCard.tsx:** SVG usa `viewBox` + `w-full h-auto` (sin width/height fijos)
- [ ] **SquishyCard.tsx:** Padding `lg` es `p-5 md:p-6 xl:p-8`
- [ ] Compilación sin errores: `npm run dev`
- [ ] **Visual (375px):** Textos grandes legibles, no cortados, no overflow
- [ ] **Visual (1920px):** Textos grandes se ven prominentes pero no excesivos
- [ ] **Visual (2560px):** Textos grandes llegan al máximo del clamp, proporción armónica
- [ ] **Visual:** Anillos SVG se reducen en móvil sin distorsión
- [ ] **Visual:** Gráficos de línea ocupan el ancho disponible sin overflow

---

# FASE 5 — ACTUALIZAR UIKit + MANIFIESTOS

> **Objetivo:** Actualizar la pantalla de Design System (UIKit) para que refleje la nueva paleta,
> tipografía y tokens. Actualizar los documentos SSOT (UI_MANIFEST.md) para que sean coherentes
> con los cambios realizados en Fases 0-4.
> **Archivos:** `screens/DesignSystemDevScreen.tsx`, `UI_MANIFEST.md`
> **Tiempo estimado:** 2-3 horas

---

## Paso 5.1 — Actualizar `DesignSystemDevScreen.tsx`

**Ruta:** `screens/DesignSystemDevScreen.tsx`

Este archivo es la pantalla de referencia visual (UIKit) donde se muestran todos los
componentes, colores y tokens del design system. Debe reflejar la nueva realidad.

### 5.1.1 — Actualizar sección de color swatches

Buscar la sección que muestra swatches de colores (probablemente un array/objeto con nombres
y clases de color). Actualizar para que muestre:

**Colores de marca:**
| Label en pantalla | Clase bg | Clase text | Hex de referencia |
|---|---|---|---|
| "Acento Mentil" | `bg-brand-accent` | `text-brand-accent` | `#5EEAD4` |
| "Acento Foreground" | `bg-brand-accent-foreground` | — | `#09090B` |
| "Proteína" | `bg-brand-protein` | `text-brand-protein` | `#A78BFA` |
| "Carbohidratos" | `bg-brand-carbs` | `text-brand-carbs` | `#38BDF8` |
| "Grasas" | `bg-brand-fat` | `text-brand-fat` | `#FB923C` |

**Colores semánticos:**
| Label | Clase bg | Hex |
|---|---|---|
| "Éxito" | `bg-success` | `#5EEAD4` |
| "Advertencia" | `bg-warning` | `#FBBF24` |
| "Peligro" | `bg-danger` | `#FB7185` |

**Superficies:**
| Label | Clase bg | Hex dark |
|---|---|---|
| "Base" | `bg-bg-base` | `#09090B` |
| "Surface BG" | `bg-surface-bg` | `#0E0E10` |
| "Surface Raised" | `bg-surface-raised` | `#151518` |
| "Surface Hover" | `bg-surface-hover` | `#1E1E21` |
| "Surface Border" | `bg-surface-border` | `#2D2D31` |

**Textos:**
| Label | Clase text |
|---|---|
| "Text Primary" | `text-text-primary` |
| "Text Secondary" | `text-text-secondary` |
| "Text Muted" | `text-text-muted` |

### 5.1.2 — Actualizar descripciones textuales

Buscar cualquier referencia a:
- "Verde Eléctrico" o "Verde Esmeralda" → Reemplazar con **"Mentil (Teal-300)"**
- "emerald-400" o "emerald-300" → Reemplazar con **"teal-300 (`#5EEAD4`)"**
- "Dark Crystal" → Reemplazar con **"Zinc Noir"**
- "Inter" (como font principal) → Reemplazar con **"Satoshi"** (o "Plus Jakarta Sans")
- "Space Grotesk" → Reemplazar con **"Satoshi Black"**
- Cualquier mención a "glow" como feature → Reemplazar con **"Apple clean — sin glow"**

### 5.1.3 — Actualizar showcase de tipografía

La sección de tipografía debe mostrar:

| Componente | Font | Weight | Tamaño | Ejemplo |
|---|---|---|---|---|
| `GiantValue` | Satoshi | Black (900) | `clamp(2.5rem..4.5rem)` | "2,450" |
| `MediumValue` | Satoshi | Bold (700) | `clamp(1.875rem..3rem)` | "1,200" |
| `StatValue` | JetBrains Mono | Bold (700) | `clamp(1.5rem..2.25rem)` | "78.5" |
| `ModalTitle` | Satoshi | Semibold (600) | `clamp(1.5rem..1.875rem)` | "Nuevo Registro" |
| `SectionTitle` | Satoshi | Semibold (600) | `1.25rem` fijo | "Entrenamiento" |
| `CardTitle` | Satoshi | Medium (500) | `1rem` fijo | "Press de Banca" |
| `BodyText` | Satoshi | Regular (400) | `0.875rem` fijo | "Descripción del ejercicio" |
| `MutedText` | Satoshi | Regular (400) | `0.75rem` fijo | "Hace 2 horas" |
| `EyebrowText` | Satoshi | Black (900) | `10px` fijo | "HOY" |
| `StatLabel` | Satoshi | Bold (700) | `9px` fijo | "REPS" |
| `TabLabel` | Satoshi | Semibold (600) | `1rem` fijo | "Dashboard" |
| `MonoValue` | JetBrains Mono | Medium (500) | `0.875rem` fijo | "12:30" |

### 5.1.4 — Migrar hardcodes restantes en el propio archivo

Aplicar el Diccionario de Traducción (Doc 1, Sección B) a `DesignSystemDevScreen.tsx`.
Eliminar cualquier `zinc-*`, `emerald-*`, `text-white` que quede.

**Nota:** Este archivo fue parcialmente migrado en sesiones anteriores. Verificar cuidadosamente
que no queden residuos. Especial atención a:
- Dividers y separadores (suelen tener `border-zinc-800`)
- Botones de ejemplo en secciones de interacción
- Modal IA de rucking (si tiene botón con color hardcodeado)

## Paso 5.2 — Actualizar `UI_MANIFEST.md`

**Ruta:** `UI_MANIFEST.md` (raíz del proyecto)

Este es el documento SSOT para diseño visual. Debe reflejar:

### 5.2.1 — Actualizar cabecera/identidad

Cambiar cualquier referencia a:
- "Dark Crystal 2026" → **"Zinc Noir 2026"**
- "Verde Eléctrico" → **"Mentil (Teal-300)"**
- Acento hex → **`#5EEAD4`**
- Font stack → **"Satoshi Variable + JetBrains Mono"**

### 5.2.2 — Actualizar tabla de tokens

Si el manifest tiene una tabla de tokens/colores, actualizarla para que coincida
exactamente con la Sección A.1 y A.2 de `REDESIGN_FASE_0_1.md`.

### 5.2.3 — Actualizar reglas de UI

Asegurar que las reglas incluyan:
1. **NUNCA** usar `emerald-*`, `zinc-*`, `text-white` directamente
2. **NUNCA** usar `rgba(52,211,153,...)` — usar `rgba(var(--color-brand-accent-rgb), opacity)`
3. **NUNCA** usar `shadow-glow` o cualquier sombra con color de marca
4. NonNegotiable icons = monocromo `text-text-muted`; acento solo en barra de progreso cuando `isMet`
5. Foreground sobre acento = negro (`text-brand-accent-foreground`)
6. Tipografía fluida solo para GiantValue, MediumValue, StatValue, ModalTitle
7. Una sola familia tipográfica (Satoshi) para heading + body

### 5.2.4 — Agregar sección de paleta macro

Si no existe, agregar una sección que documente:
- Proteína: violet-400 → `bg-brand-protein` / `text-brand-protein`
- Carbohidratos: sky-400 → `bg-brand-carbs` / `text-brand-carbs`
- Grasas: orange-400 → `bg-brand-fat` / `text-brand-fat`
- **Lógica de armonía:** Todos en tier -400 para luminosidad uniforme

### 5.2.5 — Eliminar legacy components del manifest

Si el manifest documenta componentes legacy (`Button.tsx`, `Card.tsx`, `Modal.tsx`, `Input.tsx`):
- Marcarlos como **DEPRECADOS — ELIMINAR** o eliminar sus entradas del manifest
- Los reemplazos son: `PremiumButton`, `SquishyCard`, `PremiumModal`, `PremiumInput`

## Paso 5.3 — Eliminar componentes legacy (si aplica)

**Solo ejecutar si TODOS los consumidores han sido migrados.**

### 5.3.1 — Buscar usos residuales

Ejecutar:
```bash
grep -rn "from.*['\"].*components/ui/Button" --include="*.tsx" --include="*.ts" .
grep -rn "from.*['\"].*components/ui/Card" --include="*.tsx" --include="*.ts" .
grep -rn "from.*['\"].*components/ui/Modal" --include="*.tsx" --include="*.ts" .
grep -rn "from.*['\"].*components/ui/Input" --include="*.tsx" --include="*.ts" .
```

### 5.3.2 — Migrar usos encontrados

Para cada archivo que importe un componente legacy:
- Cambiar el import a la versión premium: `PremiumButton`, `SquishyCard`, `PremiumModal`, `PremiumInput`
- Ajustar props si difieren entre legacy y premium

### 5.3.3 — Eliminar archivos legacy

Solo cuando `grep` devuelva 0 resultados para todos:
- Eliminar `components/ui/Button.tsx`
- Eliminar `components/ui/Card.tsx`
- Eliminar `components/ui/Modal.tsx`
- Eliminar `components/ui/Input.tsx`
- Actualizar `components/ui/index.ts` (si existe) para remover los exports

---

## ✅ CHECKLIST FASE 5

### DesignSystemDevScreen
- [ ] Swatches muestran colores correctos (teal, no emerald)
- [ ] Descripciones dicen "Mentil", "Zinc Noir", "Satoshi" (no "Verde Eléctrico", "Dark Crystal", "Inter")
- [ ] Showcase de tipografía muestra todos los componentes con nombre, peso y tamaño
- [ ] Cero `emerald-*`, `zinc-*`, `text-white` en el archivo
- [ ] Cero `shadow-glow` en el archivo
- [ ] Compilación sin errores

### UI_MANIFEST.md
- [ ] Identidad actualizada a "Zinc Noir 2026" + "Mentil (Teal-300)"
- [ ] Tabla de tokens coincide con Sección A.1 de Doc 1
- [ ] Reglas de UI incluyen las 7 reglas listadas
- [ ] Sección de paleta macro documentada
- [ ] Legacy components marcados como eliminados/deprecados

### Legacy components
- [ ] `grep` de imports legacy devuelve 0 resultados
- [ ] Archivos legacy eliminados (o marcados para eliminación)
- [ ] `npm run dev` sin errores tras eliminación

### Verificación visual completa
- [ ] **UIKit screen:** Todos los swatches muestran el color real (no negros)
- [ ] **UIKit screen:** Tipografía muestra Satoshi (no Inter/Space Grotesk)
- [ ] **UIKit screen:** Todos los componentes de ejemplo usan tokens semánticos
- [ ] **Toda la app:** Navegar por cada pantalla y verificar coherencia visual
- [ ] **Toda la app:** Ningún componente tiene glow o brillo coloreado

---

> **Siguiente documento:** `REDESIGN_FASE_6.md` — Construcción y verificación de pantallas
