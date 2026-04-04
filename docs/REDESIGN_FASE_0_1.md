# FIT ARCHITECT — REDISEÑO FASE 0 + FASE 1

> **Versión:** 1.0 · Abril 2026
> **Identidad visual:** Zinc Noir · Mentil · Apple Clean
> **Este documento:** Especificación definitiva + Diccionario de traducción + Fase 0 (tokens) + Fase 1 (primitivos UI)
> **Serie:** Doc 1 de 4 → (0-1) · (2-3) · (4-5) · (6)

---

# A. ESPECIFICACIÓN DE DISEÑO DEFINITIVA

## A.1 Paleta de Colores — Dark Mode (PRIMARIO)

> **REGLA CRÍTICA:** Todos los valores RGB usan formato **espacio-separado** (sin comas).
> Obligatorio para la sintaxis Tailwind v3+ `rgb(var(...) / <alpha-value>)`.

| Rol | Variable CSS | RGB (espacios) | Hex | Ref. Tailwind |
|---|---|---|---|---|
| Fondo OLED | `--color-bg-base` | — | `#09090b` | zinc-950 |
| Superficie base | `--color-surface-bg-rgb` | `14 14 16` | `#0E0E10` | custom |
| Superficie elevada | `--color-surface-raised-rgb` | `21 21 24` | `#151518` | custom |
| Superficie hover | `--color-surface-hover-rgb` | `30 30 33` | `#1E1E21` | custom |
| Borde superficie | `--color-surface-border-rgb` | `45 45 49` | `#2D2D31` | custom |
| Texto primario | `--color-text-primary-rgb` | `250 250 250` | `#FAFAFA` | zinc-50 |
| Texto secundario | `--color-text-secondary-rgb` | `161 161 170` | `#A1A1AA` | zinc-400 |
| Texto muted | `--color-text-muted-rgb` | `113 113 122` | `#71717A` | zinc-500 |
| **Acento Mentil** | `--color-brand-accent-rgb` | **`94 234 212`** | **`#5EEAD4`** | **teal-300** |
| Acento foreground | `--color-brand-accent-foreground-rgb` | `9 9 11` | `#09090B` | zinc-950 (negro) |
| Proteína | `--color-brand-protein-rgb` | `167 139 250` | `#A78BFA` | violet-400 |
| Carbohidratos | `--color-brand-carbs-rgb` | `56 189 248` | `#38BDF8` | sky-400 |
| Grasas | `--color-brand-fat-rgb` | `251 146 60` | `#FB923C` | orange-400 |
| Éxito | `--color-success-rgb` | `94 234 212` | `#5EEAD4` | = acento |
| Advertencia | `--color-warning-rgb` | `251 191 36` | `#FBBF24` | amber-400 |
| **Peligro** | `--color-danger-rgb` | **`251 113 133`** | **`#FB7185`** | **rose-400** |

## A.2 Paleta de Colores — Light Mode (SECUNDARIO)

| Rol | Variable CSS | RGB (espacios) | Hex |
|---|---|---|---|
| Fondo base | `--color-bg-base` | — | `#f4f4f5` |
| Superficie base | `--color-surface-bg-rgb` | `255 255 255` | `#FFFFFF` |
| Superficie elevada | `--color-surface-raised-rgb` | `250 250 250` | `#FAFAFA` |
| Superficie hover | `--color-surface-hover-rgb` | `244 244 245` | `#F4F4F5` |
| Borde superficie | `--color-surface-border-rgb` | `212 212 216` | `#D4D4D8` |
| Texto primario | `--color-text-primary-rgb` | `9 9 11` | `#09090B` |
| Texto secundario | `--color-text-secondary-rgb` | `63 63 70` | `#3F3F46` |
| Texto muted | `--color-text-muted-rgb` | `113 113 122` | `#71717A` |
| Acento (Teal) | `--color-brand-accent-rgb` | `13 148 136` | `#0D9488` |
| Acento foreground | `--color-brand-accent-foreground-rgb` | `255 255 255` | `#FFFFFF` |
| Proteína | `--color-brand-protein-rgb` | `124 58 237` | `#7C3AED` |
| Carbohidratos | `--color-brand-carbs-rgb` | `2 132 199` | `#0284C7` |
| Grasas | `--color-brand-fat-rgb` | `234 88 12` | `#EA580C` |
| Éxito | `--color-success-rgb` | `13 148 136` | `#0D9488` |
| Advertencia | `--color-warning-rgb` | `217 119 6` | `#D97706` |
| Peligro | `--color-danger-rgb` | `225 29 72` | `#E11D48` |

## A.3 Tipografía

### Fuente principal: **Satoshi Variable**
- **Instalación:** `npm install @fontsource-variable/satoshi`
- **Pesos:** 400 (Regular), 500 (Medium), 700 (Bold), 900 (Black)
- **Heading:** Satoshi Black (900) via `font-heading`
- **Body:** Satoshi Regular/Medium (400-500) via `font-sans`
- **Licencia:** SIL Open Font License

### Fuente monospace: **JetBrains Mono** (sin cambio)
- Ya cargada desde Google Fonts. Pesos 400-700.
- Uso: números, stats, timers, tabular-nums.

### Alternativa si Satoshi falla:
- **Plus Jakarta Sans** via Google Fonts: `Plus+Jakarta+Sans:wght@400;500;600;700;800`
- Mismo esquema de pesos. Reemplazar `"Satoshi Variable"` por `"Plus Jakarta Sans"` en toda la config.

## A.4 Principios Visuales Inquebrantables

1. **CERO glow.** Ningún `box-shadow` con color de marca. Ningún `drop-shadow` con acento. Solo sombras neutras negras.
2. **Tokens semánticos siempre.** NUNCA `zinc-800`, `emerald-400`, `text-white`, `violet-500` directos. Siempre tokens (`bg-surface-raised`, `text-brand-accent`, `text-text-primary`).
3. **Tier -400 uniforme.** Macro colores y semánticos en tier -400 de Tailwind para armonía de luminosidad.
4. **Foreground negro.** Texto sobre `bg-brand-accent` usa `text-brand-accent-foreground` (`#09090b`).
5. **Sin rgba() hardcodeado.** Para opacidad en `style={{}}`, usar `rgba(var(--color-*-rgb), 0.X)`.
6. **Una familia tipográfica.** Satoshi para heading + body. Diferenciación solo por peso.

---

# B. DICCIONARIO DE TRADUCCIÓN

> **Cómo usar:** Para migrar un archivo, buscar TODAS las instancias de la columna izquierda
> y reemplazar con la columna derecha. El `/*` indica opacidad opcional (ej: `/50`). Mantenerla.

## B.1 Fondos (`bg-*`)

| Hardcodeado | → Token |
|---|---|
| `bg-zinc-950` | `bg-bg-base` |
| `bg-zinc-900` / `bg-zinc-900/*` | `bg-surface-bg` / `bg-surface-bg/*` |
| `bg-zinc-800` / `bg-zinc-800/*` | `bg-surface-raised` / `bg-surface-raised/*` |
| `bg-zinc-700` / `bg-zinc-700/*` | `bg-surface-hover` / `bg-surface-hover/*` |
| `bg-emerald-400/*` `bg-emerald-300/*` `bg-emerald-500/*` | `bg-brand-accent/*` |
| `bg-violet-500/*` `bg-violet-400/*` | `bg-brand-protein/*` |
| `bg-cyan-400/*` `bg-cyan-500/*` | `bg-brand-carbs/*` |
| `bg-orange-400/*` `bg-orange-500/*` | `bg-brand-fat/*` |
| `bg-rose-500/*` `bg-rose-400/*` `bg-red-500/*` | `bg-danger/*` |
| `bg-amber-400/*` `bg-amber-500/*` | `bg-warning/*` |

## B.2 Texto (`text-*`)

| Hardcodeado | → Token |
|---|---|
| `text-white` `text-zinc-50` `text-zinc-100` | `text-text-primary` |
| `text-zinc-200` `text-zinc-300` `text-zinc-400` | `text-text-secondary` |
| `text-zinc-500` `text-zinc-600` | `text-text-muted` |
| `text-zinc-950` | `text-bg-base` |
| `text-emerald-400` `text-emerald-300` `text-emerald-500` | `text-brand-accent` |
| `text-violet-400` `text-violet-500` | `text-brand-protein` |
| `text-cyan-400` | `text-brand-carbs` |
| `text-orange-400` `text-orange-500` | `text-brand-fat` |
| `text-rose-400` `text-rose-500` | `text-danger` |
| `text-amber-400` | `text-warning` |

## B.3 Bordes (`border-*`)

| Hardcodeado | → Token |
|---|---|
| `border-zinc-800/*` `border-zinc-700/*` `border-zinc-600/*` | `border-surface-border/*` |
| `border-emerald-400/*` `border-emerald-500/*` | `border-brand-accent/*` |
| `border-rose-500/*` | `border-danger/*` |
| `border-amber-400/*` | `border-warning/*` |

## B.4 Anillos (`ring-*`, `focus:*`)

| Hardcodeado | → Token |
|---|---|
| `ring-emerald-400/*` `ring-emerald-500/*` | `ring-brand-accent/*` |
| `focus:ring-emerald-*` | `focus:ring-brand-accent/*` |
| `focus:border-emerald-*` | `focus:border-brand-accent/*` |
| `focus-within:border-emerald-*` | `focus-within:border-brand-accent/*` |

## B.5 Stroke SVG

| Hardcodeado | → Token |
|---|---|
| `stroke-emerald-400` | `stroke-brand-accent` |
| `stroke-zinc-800` `stroke-zinc-900` | `stroke-surface-raised` / `stroke-surface-bg` |
| `stroke-rose-500` | `stroke-danger` |

## B.6 Inline styles (`style={{...}}`)

| Buscar | → Reemplazar |
|---|---|
| `rgba(52,211,153,` | `rgba(var(--color-brand-accent-rgb),` |
| `rgba(110,231,183,` | `rgba(var(--color-brand-accent-rgb),` |
| `rgb(16,185,129)` | `rgb(var(--color-brand-accent-rgb))` |
| Cualquier hex emerald en `style` | Usar `var(--color-brand-accent-rgb)` |

## B.7 Glow — ELIMINAR

| Buscar | Acción |
|---|---|
| clase `shadow-glow` | Borrar la clase |
| clase `shadow-glow-lg` | Borrar la clase |
| clase `shadow-[0_0_*]` (arbitrary shadow) | Borrar la clase completa |
| clase `drop-shadow-[*]` | Borrar la clase completa |
| `style={{ filter: 'drop-shadow(...)' }}` | Borrar la propiedad o el style |
| clase `animate-glow-pulse` | Borrar la clase |

---

# FASE 0 — FIX SISTEMA DE TOKENS

> **Objetivo:** Reparar RGB formato, activar nueva paleta, eliminar glow, instalar tipografía.
> **Archivos:** `styles/tailwind.css`, `tailwind.config.cjs`, `index.html`, `index.tsx`
> **Tiempo estimado:** 30-45 min

## Paso 0.1 — Instalar tipografía

```bash
npm install @fontsource-variable/satoshi
```
Si falla → usar Plus Jakarta Sans via Google Fonts (ver Paso 0.4b).

## Paso 0.2 — Actualizar `styles/tailwind.css`

### 0.2.1 — Cabecera

Buscar:
```css
   Paleta: Slate/Zinc · Acento: Verde Eléctrico · Mode: Dark-first
```
Reemplazar con:
```css
   Paleta: Zinc Noir · Acento: Mentil (Teal-300) · Mode: Dark-first
```

### 0.2.2 — `:root` variables de color (Light Mode)

Reemplazar **todo el bloque de variables de color** dentro de `:root` (líneas 11-37 aprox.) con:

```css
  /* ─── Fondos y Superficies · Zinc Light ─── */
  --color-bg-base: #f4f4f5;
  --color-surface-bg-rgb: 255 255 255;
  --color-surface-raised-rgb: 250 250 250;
  --color-surface-hover-rgb: 244 244 245;
  --color-surface-border-rgb: 212 212 216;

  /* ─── Texto · Zinc ─── */
  --color-text-primary-rgb: 9 9 11;
  --color-text-secondary-rgb: 63 63 70;
  --color-text-muted-rgb: 113 113 122;

  /* ─── Acento · Teal (Light) ─── */
  --color-brand-accent-rgb: 13 148 136;
  --color-brand-accent-foreground-rgb: 255 255 255;

  /* ─── Macronutrientes ─── */
  --color-brand-protein-rgb: 124 58 237;
  --color-brand-carbs-rgb: 2 132 199;
  --color-brand-fat-rgb: 234 88 12;

  /* ─── Semánticos ─── */
  --color-success-rgb: 13 148 136;
  --color-warning-rgb: 217 119 6;
  --color-danger-rgb: 225 29 72;
```

**Variables que DESAPARECEN** (eliminar si existen):
- `--color-surface-border-opacity` → ya no se usa
- `--color-brand-accent-glow` → glow eliminado

### 0.2.3 — Sombras en `:root` (eliminar glow)

Buscar:
```css
  --shadow-glow: 0 0 28px var(--color-brand-accent-glow);
  --shadow-glow-lg: 0 4px 30px rgba(16, 185, 129, 0.05);
```
Eliminar ambas líneas completamente (o reemplazar con un comentario vacío).

### 0.2.4 — Gradiente en `:root`

Buscar `rgba(16, 185, 129, 0.05)` dentro de `--bg-gradient` en `:root`.
Reemplazar con `rgba(13, 148, 136, 0.04)`.

### 0.2.5 — Bloque `.dark` completo

Reemplazar TODO el contenido dentro de `.dark { ... }` (líneas 137-192) con:

```css
  /* ─── Fondos y Superficies · Zinc Noir (sin tinte azul) ─── */
  --color-bg-base: #09090b;
  --color-surface-bg-rgb: 14 14 16;
  --color-surface-raised-rgb: 21 21 24;
  --color-surface-hover-rgb: 30 30 33;
  --color-surface-border-rgb: 45 45 49;

  /* ─── Texto · Zinc Suave ─── */
  --color-text-primary-rgb: 250 250 250;
  --color-text-secondary-rgb: 161 161 170;
  --color-text-muted-rgb: 113 113 122;

  /* ─── Acento · Mentil (Teal-300) ─── */
  --color-brand-accent-rgb: 94 234 212;
  --color-brand-accent-foreground-rgb: 9 9 11;

  /* ─── Macronutrientes · Paleta -400 armonizada ─── */
  --color-brand-protein-rgb: 167 139 250;
  --color-brand-carbs-rgb: 56 189 248;
  --color-brand-fat-rgb: 251 146 60;

  /* ─── Semánticos ─── */
  --color-success-rgb: 94 234 212;
  --color-warning-rgb: 251 191 36;
  --color-danger-rgb: 251 113 133;

  /* ─── Inputs ─── */
  --color-input-bg: rgba(14, 14, 16, 0.95);
  --color-input-border: rgba(45, 45, 49, 0.9);

  /* ─── Glassmorphism ─── */
  --glass-bg: rgba(14, 14, 16, 0.78);
  --glass-border: rgba(255, 255, 255, 0.06);
  --glass-blur: 24px;
  --glass-saturate: 1.4;

  /* ─── Sombras (sin glow — Apple clean) ─── */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.50), 0 1px 1px -1px rgba(0, 0, 0, 0.40);
  --shadow-md: 0 10px 28px -10px rgba(0, 0, 0, 0.75), 0 4px 14px -8px rgba(0, 0, 0, 0.55);
  --shadow-lg: 0 24px 52px -20px rgba(0, 0, 0, 0.85), 0 10px 28px -12px rgba(0, 0, 0, 0.65);

  /* ─── Gradientes (ambient sutil) ─── */
  --bg-gradient:
    radial-gradient(ellipse 60% 32% at 50% -2%, rgba(94, 234, 212, 0.03) 0%, transparent 55%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.008) 0%, rgba(255, 255, 255, 0) 20%);
  --bg-pattern:
    linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);

  color-scheme: dark;
```

### 0.2.6 — body font-family

Buscar:
```css
  font-family: "Inter", system-ui, sans-serif;
```
Reemplazar con:
```css
  font-family: "Satoshi Variable", "Satoshi", system-ui, sans-serif;
```
*(Si se usa Plus Jakarta Sans: `"Plus Jakarta Sans", system-ui, sans-serif`)*

## Paso 0.3 — Actualizar `tailwind.config.cjs`

### 0.3.1 — fontFamily

Buscar:
```javascript
fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'],
  heading: ['"Space Grotesk"', 'Inter', 'sans-serif'],
  mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
},
```
Reemplazar con:
```javascript
fontFamily: {
  sans: ['"Satoshi Variable"', '"Satoshi"', 'system-ui', 'sans-serif'],
  heading: ['"Satoshi Variable"', '"Satoshi"', 'system-ui', 'sans-serif'],
  mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
},
```

### 0.3.2 — surface-border formato

Buscar:
```javascript
'surface-border': 'rgba(var(--color-surface-border-rgb), var(--color-surface-border-opacity))',
```
Reemplazar con:
```javascript
'surface-border': 'rgb(var(--color-surface-border-rgb) / <alpha-value>)',
```

### 0.3.3 — Eliminar glow del boxShadow

Buscar:
```javascript
boxShadow: {
  sm: 'var(--shadow-sm)',
  md: 'var(--shadow-md)',
  lg: 'var(--shadow-lg)',
  glow: 'var(--shadow-glow)',
  'glow-lg': 'var(--shadow-glow-lg)',
},
```
Reemplazar con:
```javascript
boxShadow: {
  sm: 'var(--shadow-sm)',
  md: 'var(--shadow-md)',
  lg: 'var(--shadow-lg)',
},
```

### 0.3.4 — Eliminar glowPulse

En `keyframes`, buscar y eliminar:
```javascript
glowPulse: {
  '0%, 100%': { boxShadow: '0 0 0px transparent' },
  '50%': { boxShadow: 'var(--shadow-glow)' },
},
```

En `animation`, buscar y eliminar:
```javascript
'glow-pulse': 'glowPulse 2.5s ease-in-out infinite',
```

## Paso 0.4a — Actualizar `index.html` (ruta Satoshi npm)

### Fix clase `<html>` hardcodeada

Buscar:
```html
<html lang="es" class="dark bg-zinc-950 text-zinc-50">
```
Reemplazar con:
```html
<html lang="es" class="dark">
```

### Actualizar fonts link

Buscar el bloque `<link>` de Google Fonts (carga Inter + JetBrains Mono + Space Grotesk).
Reemplazar con solo JetBrains Mono:
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

## Paso 0.4b — Alternativa `index.html` (Plus Jakarta Sans Google Fonts)

Solo si Satoshi npm falló. Reemplazar el `<link>` de fuentes con:
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

## Paso 0.5 — Importar Satoshi en entry point

En `index.tsx`, agregar al inicio (ANTES de otros CSS imports):
```typescript
import '@fontsource-variable/satoshi';
```
*(No necesario si se usa Plus Jakarta Sans via Google Fonts.)*

---

## ✅ CHECKLIST FASE 0

- [ ] `npm install @fontsource-variable/satoshi` exitoso (o alternativa activada)
- [ ] **tailwind.css `:root`:** Todas las `*-rgb` usan espacios (cero comas)
- [ ] **tailwind.css `:root`:** `--color-brand-accent-glow` NO existe
- [ ] **tailwind.css `:root`:** `--color-surface-border-opacity` NO existe
- [ ] **tailwind.css `:root`:** `--shadow-glow` y `--shadow-glow-lg` NO existen
- [ ] **tailwind.css `.dark`:** `--color-brand-accent-rgb` es `94 234 212`
- [ ] **tailwind.css `.dark`:** `--color-brand-protein-rgb` es `167 139 250`
- [ ] **tailwind.css `.dark`:** `--color-brand-carbs-rgb` es `56 189 248`
- [ ] **tailwind.css `.dark`:** `--color-danger-rgb` es `251 113 133`
- [ ] **tailwind.css `.dark`:** No hay ninguna variable `*-glow*`
- [ ] **tailwind.css `.dark`:** Gradiente usa `rgba(94, 234, 212, 0.03)`
- [ ] **tailwind.css body:** font-family apunta a Satoshi (o Plus Jakarta Sans)
- [ ] **tailwind.config.cjs:** fontFamily.sans y .heading apuntan a Satoshi
- [ ] **tailwind.config.cjs:** `surface-border` usa formato `rgb(var(...) / <alpha-value>)`
- [ ] **tailwind.config.cjs:** boxShadow NO tiene `glow` ni `glow-lg`
- [ ] **tailwind.config.cjs:** keyframes NO tiene `glowPulse`
- [ ] **tailwind.config.cjs:** animation NO tiene `glow-pulse`
- [ ] **index.html:** `<html>` NO tiene `bg-zinc-950` ni `text-zinc-50`
- [ ] **index.html:** Google Fonts solo carga JetBrains Mono (o +Plus Jakarta Sans)
- [ ] **index.tsx:** Import de `@fontsource-variable/satoshi` presente (si aplica)
- [ ] **Compilación:** `npm run dev` sin errores
- [ ] **Visual:** Acento teal visible (no verde esmeralda)
- [ ] **Visual:** Color swatches en UIKit no aparecen negros

---

# FASE 1 — MIGRAR PRIMITIVOS UI KIT

> **Objetivo:** Migrar los 10 componentes primitivos de `components/ui-premium/` que forman
> la base del design system. Estos son usados por todos los demás componentes.
> **Método:** Usar el Diccionario de Traducción (Sección B) como referencia.
> **Archivos:** 10 componentes listados abajo
> **Tiempo estimado:** 2-3 horas

## Reglas de migración

1. Abrir cada archivo listado
2. Buscar TODA clase que coincida con el lado izquierdo del Diccionario (Sección B)
3. Reemplazar con el lado derecho
4. Buscar `shadow-glow`, `shadow-[0_0_`, `drop-shadow-[`, `animate-glow-pulse` → eliminar
5. Buscar `style={{` con rgba/hex hardcodeados → reemplazar con CSS vars (Sección B.6)
6. NO cambiar lógica, props, estructura JSX, ni nombres de componentes
7. NO agregar ni quitar comentarios

## Archivo 1: `PremiumBadge.tsx`

**Ruta:** `components/ui-premium/PremiumBadge.tsx`

Buscar y reemplazar (cada instancia):
| Buscar | Reemplazar |
|---|---|
| `bg-emerald-400/10` | `bg-brand-accent/10` |
| `bg-emerald-400/20` | `bg-brand-accent/20` |
| `text-emerald-400` | `text-brand-accent` |
| `border-emerald-400/20` | `border-brand-accent/20` |
| `border-emerald-400/30` | `border-brand-accent/30` |

> **Nota:** Si hay variantes con `bg-emerald-300` o `bg-emerald-500`, usar el mismo token `bg-brand-accent`.

## Archivo 2: `PremiumChip.tsx`

**Ruta:** `components/ui-premium/PremiumChip.tsx`

| Buscar | Reemplazar |
|---|---|
| `bg-zinc-800` | `bg-surface-raised` |
| `bg-zinc-800/80` | `bg-surface-raised/80` |
| `border-zinc-700` | `border-surface-border` |
| `text-zinc-300` | `text-text-secondary` |
| `text-zinc-400` | `text-text-secondary` |
| `bg-emerald-400/10` | `bg-brand-accent/10` |
| `text-emerald-400` | `text-brand-accent` |
| `border-emerald-400/20` | `border-brand-accent/20` |

## Archivo 3: `PremiumInput.tsx`

**Ruta:** `components/ui-premium/PremiumInput.tsx`

| Buscar | Reemplazar |
|---|---|
| `bg-zinc-900` | `bg-surface-bg` |
| `bg-zinc-900/80` | `bg-surface-bg/80` |
| `border-zinc-700` | `border-surface-border` |
| `border-zinc-700/50` | `border-surface-border/50` |
| `text-white` | `text-text-primary` |
| `text-zinc-400` | `text-text-secondary` |
| `text-zinc-500` | `text-text-muted` |
| `placeholder:text-zinc-500` | `placeholder:text-text-muted` |
| `focus:border-emerald-400` | `focus:border-brand-accent` |
| `focus:ring-emerald-400` | `focus:ring-brand-accent` |
| `focus-within:border-emerald-400` | `focus-within:border-brand-accent` |
| Cualquier `shadow-glow` | Eliminar la clase |

## Archivo 4: `PremiumModal.tsx`

**Ruta:** `components/ui-premium/PremiumModal.tsx`

| Buscar | Reemplazar |
|---|---|
| `bg-zinc-900` | `bg-surface-bg` |
| `bg-zinc-900/95` | `bg-surface-bg/95` |
| `border-zinc-800` | `border-surface-border` |
| `border-zinc-700` | `border-surface-border` |
| `text-white` | `text-text-primary` |
| `text-zinc-400` | `text-text-secondary` |
| `text-zinc-500` | `text-text-muted` |
| `bg-emerald-400` (botones) | `bg-brand-accent` |
| `text-zinc-950` (foreground botón) | `text-brand-accent-foreground` |
| `hover:bg-emerald-500` | `hover:bg-brand-accent/90` |
| `focus:ring-emerald-400` | `focus:ring-brand-accent` |
| `bg-zinc-800` (botón secundario) | `bg-surface-raised` |
| `hover:bg-zinc-700` | `hover:bg-surface-hover` |
| Cualquier `shadow-glow` | Eliminar la clase |

## Archivo 5: `PremiumStepper.tsx`

**Ruta:** `components/ui-premium/PremiumStepper.tsx`

| Buscar | Reemplazar |
|---|---|
| `bg-zinc-800` | `bg-surface-raised` |
| `bg-zinc-900` | `bg-surface-bg` |
| `border-zinc-700` | `border-surface-border` |
| `text-white` | `text-text-primary` |
| `text-zinc-400` | `text-text-secondary` |
| `text-zinc-500` | `text-text-muted` |
| `hover:bg-zinc-700` | `hover:bg-surface-hover` |
| `active:bg-zinc-600` | `active:bg-surface-hover/80` |

## Archivo 6: `PremiumFilterTab.tsx`

**Ruta:** `components/ui-premium/PremiumFilterTab.tsx`

| Buscar | Reemplazar |
|---|---|
| `bg-zinc-800` o `bg-zinc-800/80` | `bg-surface-raised` o `bg-surface-raised/80` |
| `border-zinc-700` | `border-surface-border` |
| `text-zinc-400` | `text-text-secondary` |
| `text-zinc-500` | `text-text-muted` |
| `bg-emerald-400` (estado activo) | `bg-brand-accent` |
| `text-zinc-950` (foreground activo) | `text-brand-accent-foreground` |
| `border-emerald-400` | `border-brand-accent` |
| `hover:bg-zinc-700` | `hover:bg-surface-hover` |
| `hover:text-white` | `hover:text-text-primary` |

## Archivo 7: `SegmentedTabs.tsx`

**Ruta:** `components/ui-premium/SegmentedTabs.tsx`

| Buscar | Reemplazar |
|---|---|
| `bg-zinc-900` (contenedor) | `bg-surface-bg` |
| `bg-zinc-800` | `bg-surface-raised` |
| `text-zinc-400` | `text-text-secondary` |
| `text-zinc-500` | `text-text-muted` |
| `bg-emerald-400` (tab activa) | `bg-brand-accent` |
| `text-zinc-950` (texto tab activa) | `text-brand-accent-foreground` |
| `text-white` (texto tab activa alt) | `text-text-primary` |
| `hover:text-white` | `hover:text-text-primary` |

## Archivo 8: `SearchBar.tsx`

**Ruta:** `components/ui-premium/SearchBar.tsx`

| Buscar | Reemplazar |
|---|---|
| `bg-zinc-900` | `bg-surface-bg` |
| `bg-zinc-800` | `bg-surface-raised` |
| `border-zinc-700` | `border-surface-border` |
| `text-white` | `text-text-primary` |
| `text-zinc-400` | `text-text-secondary` |
| `text-zinc-500` | `text-text-muted` |
| `placeholder:text-zinc-500` | `placeholder:text-text-muted` |
| `focus:border-emerald-400` | `focus:border-brand-accent` |
| `focus-within:border-emerald-400` | `focus-within:border-brand-accent` |

## Archivo 9: `IconButton.tsx`

**Ruta:** `components/ui-premium/IconButton.tsx`

| Buscar | Reemplazar |
|---|---|
| `text-zinc-400` | `text-text-secondary` |
| `text-zinc-500` | `text-text-muted` |
| `hover:text-white` | `hover:text-text-primary` |
| `hover:bg-zinc-800` | `hover:bg-surface-raised` |
| `bg-zinc-800` | `bg-surface-raised` |
| `text-emerald-400` (variante accent) | `text-brand-accent` |
| `hover:bg-emerald-400/10` | `hover:bg-brand-accent/10` |
| `text-rose-400` o `text-rose-500` (variante danger) | `text-danger` |
| `hover:bg-rose-400/10` o `hover:bg-rose-500/10` | `hover:bg-danger/10` |

## Archivo 10: `ImageUploadArea.tsx`

**Ruta:** `components/ui-premium/ImageUploadArea.tsx`

| Buscar | Reemplazar |
|---|---|
| `border-zinc-700` | `border-surface-border` |
| `border-zinc-600` | `border-surface-border` |
| `bg-zinc-800` o `bg-zinc-900` | `bg-surface-raised` o `bg-surface-bg` |
| `text-zinc-400` | `text-text-secondary` |
| `text-zinc-500` | `text-text-muted` |
| `hover:border-emerald-400` | `hover:border-brand-accent` |
| `hover:text-emerald-400` | `hover:text-brand-accent` |
| `hover:bg-zinc-800/50` | `hover:bg-surface-raised/50` |

---

## ✅ CHECKLIST FASE 1

### Verificación por archivo
- [ ] `PremiumBadge.tsx` — cero instancias de `emerald-*`, `zinc-*`, `text-white`
- [ ] `PremiumChip.tsx` — cero instancias de `emerald-*`, `zinc-*`, `text-white`
- [ ] `PremiumInput.tsx` — cero instancias de `emerald-*`, `zinc-*`, `text-white`
- [ ] `PremiumModal.tsx` — cero instancias de `emerald-*`, `zinc-*`, `text-white`
- [ ] `PremiumStepper.tsx` — cero instancias de `emerald-*`, `zinc-*`, `text-white`
- [ ] `PremiumFilterTab.tsx` — cero instancias de `emerald-*`, `zinc-*`, `text-white`
- [ ] `SegmentedTabs.tsx` — cero instancias de `emerald-*`, `zinc-*`, `text-white`
- [ ] `SearchBar.tsx` — cero instancias de `emerald-*`, `zinc-*`, `text-white`
- [ ] `IconButton.tsx` — cero instancias de `emerald-*`, `zinc-*`, `text-white`, `rose-*`
- [ ] `ImageUploadArea.tsx` — cero instancias de `emerald-*`, `zinc-*`, `text-white`

### Verificación global
- [ ] `grep -r "emerald" components/ui-premium/Premium*.tsx` devuelve 0 resultados
- [ ] `grep -r "emerald" components/ui-premium/SegmentedTabs.tsx` devuelve 0 resultados
- [ ] `grep -r "emerald" components/ui-premium/SearchBar.tsx` devuelve 0 resultados
- [ ] `grep -r "emerald" components/ui-premium/IconButton.tsx` devuelve 0 resultados
- [ ] `grep -r "emerald" components/ui-premium/ImageUploadArea.tsx` devuelve 0 resultados
- [ ] `grep -r "shadow-glow" components/ui-premium/` devuelve 0 resultados
- [ ] `grep -r "text-white" components/ui-premium/Premium*.tsx` devuelve 0 resultados
- [ ] Compilación sin errores: `npm run dev`
- [ ] **Visual:** Todos los primitivos renderizan con teal (no emerald)
- [ ] **Visual:** Badges, chips, inputs, modals, tabs muestran tokens correctos
- [ ] **Visual:** Ningún componente tiene glow o brillo de color

---

> **Siguiente documento:** `REDESIGN_FASE_2_3.md` — Migración de compuestos UI y nutrición
