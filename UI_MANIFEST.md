# UI_MANIFEST.md
> Auto-generated inventory of the Premium HUD UI Kit.
> Audience: LLMs assembling screens. Do NOT invent ad-hoc classes. Use ONLY components and tokens documented here.
> Last updated: 2026-04-02
> Design system: Dark Crystal 2026 · Token base: Tailwind zinc/emerald/violet/rose/amber

---

## DESIGN SYSTEM RULES (READ FIRST)

- **SSOT font:** `font-heading` (display) and `font-mono` (tabular data).
- **Primary accent:** `emerald-400` — hero metrics, CTAs, active states.
- **Secondary accents:** `violet-400` (protein/AI), `rose-400` (fat/danger), `amber-400` (PRs/warnings), `cyan-400` (cardio/recovery).
- **Surface base:** `bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/50` — always use `SquishyCard` for containers, never raw divs.
- **Typography:** NEVER invent text classes. Import from `Typography.tsx`. Override only with `!` prefix when absolutely needed.
- **Tolerated arbitrary values:** `max-w-[Npx]` for card max-width constraints, `w-[Npx]/h-[Npx]` for SVG geometry, `style={{ width: `${pct}%` }}` for data-driven widths, `style={{ top/left: calc(...) }}` for runtime-positioned labels. All others are violations.

---

## CATEGORY 1: HOOKS / LOGIC

### `useFlexibleMacros(target, consumed)`
**File:** `components/ui-premium/useFlexibleMacros.ts`  
**Purpose:** Stateless memoized calculator for the "Flexible Macros" (Shared Bag C+G) nutrition model. Computes progress, alerts, and dynamic macro maximums.

**Inputs:**
```ts
interface FlexibleMacroTarget {
  kcal: number;
  protein: number;
  carbMin: number;
  carbIdeal: number;
  carbMax: number;
  fatMin: number;
  fatIdeal: number;
  fatMax: number;
}

interface FlexibleMacroConsumed {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}
```

**Returns:** `UseFlexibleMacrosReturn`
```ts
{
  kcalRemaining: number;       // max(0, target.kcal - consumed.kcal)
  kcalProgress: number;        // 0..1
  isKcalOver: boolean;

  proteinProgress: number;     // 0..1

  dynamicCarbMax: number;      // carb ceiling after fat is consumed
  dynamicFatMax: number;       // fat ceiling after carbs are consumed

  carbProgress: number;        // 0..1 vs carbMax
  fatProgress: number;         // 0..1 vs fatMax

  isFatMinimumAtRisk: boolean; // true if remaining kcal can't cover fat minimum
  isCarbOverMax: boolean;
  isFatOverMax: boolean;
  isCarbMinMet: boolean;
  isFatMinMet: boolean;
}
```

---

### `useRestTimer(targetTime, minimumTime)`
**File:** `components/ui-premium/useRestTimer.ts`  
**Purpose:** 100% headless countdown timer for rest intervals between workout sets. Uses `Date.now()`-anchored intervals (250ms tick) for drift-free precision. No UI, no phase labels — purely numeric ratios consumed by `SmartRestTimer`.

**Inputs:**
```ts
targetTime: number;   // seconds (normalized to integer ≥ 0)
minimumTime: number;  // seconds — threshold for hasReachedMinimum
```

**Returns:** `UseRestTimerReturn`
```ts
{
  targetTime: number;         // normalized input
  minimumTime: number;        // normalized input
  currentTime: number;        // seconds remaining (integer)
  elapsedTime: number;        // seconds elapsed = targetTime - currentTime
  remainingRatio: number;     // 0..1 — currentTime / targetTime (use for ring/arc animations)
  completionRatio: number;    // 0..1 — 1 - remainingRatio (use for fill animations)
  hasReachedMinimum: boolean; // true when currentTime <= minimumTime
  addTime: (seconds: number) => void;
  skipRest: () => void;       // sets currentTime to 0
  reset: (nextTarget?: number) => void;
  isFinished: boolean;        // currentTime <= 0
}
```

> **Note:** `phase`, `formattedTime`, and `progress` do NOT exist on this hook. Format time in the consumer (e.g. `SmartRestTimer`) using `Math.floor(currentTime / 60)` and `currentTime % 60`.

---

## CATEGORY 2: UI COMPONENTS

### `SquishyCard` ⭐ (Base Primitive)
**File:** `components/ui-premium/SquishyCard.tsx`  
**Purpose:** Universal dark-crystal surface container. ALL card-like UI must wrap inside this. Provides glassmorphism background, border, hover brightness, and active scale press.

```ts
interface SquishyCardProps {
  children: React.ReactNode;
  className?: string;
  radius?: 'xl' | '2xl' | '3xl' | 'squishy'; // default: 'squishy' = rounded-[2rem]
  padding?: 'none' | 'sm' | 'md' | 'lg';      // default: 'md' = p-6
  interactive?: boolean;   // adds cursor-pointer, hover brightness, active scale
  active?: boolean;        // adds emerald ring (for selected states)
  onClick?: () => void;
}
```

---

### `Typography` ⭐ (Token System)
**File:** `components/ui-premium/Typography.tsx`  
**Purpose:** Canonical typographic tokens. Import and use these instead of raw Tailwind text classes.

| Token | Element | Visual Role | Key classes |
|---|---|---|---|
| `EyebrowText` | `<span>` | Category label above headings | `text-emerald-400 font-black uppercase tracking-widest text-[10px]` |
| `ModalTitle` | `<h2>` | Modal/sheet main heading | `font-heading text-3xl font-black text-white` |
| `SectionTitle` | `<h3>` | In-screen section heading | `font-heading text-xl font-black text-white` |
| `CardTitle` | `<h4>` | Bento/compact card heading | `font-heading text-base font-bold text-white` |
| `BodyText` | `<p>` | Standard body paragraph | `text-sm text-zinc-400 leading-relaxed` |
| `MutedText` | `<span>` | Hints, metadata, timestamps | `text-xs text-zinc-500 leading-relaxed` |
| `StatLabel` | `<span>` | Metric label (micro-caps) | `text-[9px] font-black uppercase tracking-[0.18em] text-zinc-500` |
| `StatValue` | `<span>` | Large KPI numeric value | `font-heading text-4xl font-black text-white tabular-nums` |
| `MonoValue` | `<span>` | Tabular numeric data | `font-mono text-sm font-semibold text-zinc-300 tabular-nums` |
| `GiantValue` | `<span>` | Hero display number (text-7xl) | `font-mono text-7xl font-black tracking-tighter text-white tabular-nums` |
| `TabLabel` | `<span>` | Button/tab tap target text | `text-base font-black tracking-wide` |

All accept `className?: string` for overrides (use `!` prefix to force override).

---

### `PremiumButton`
**File:** `components/ui-premium/PremiumButton.tsx`  
**Purpose:** Primary CTA button with three visual variants. Full-width, rounded-full, uppercase. Vibrates on tap.

```ts
interface PremiumButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  onClick?: () => void;
  variant?: 'primary' | 'ghost' | 'danger';  // default: 'primary'
  size?: 'sm' | 'md' | 'lg';                  // default: 'lg'
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  vibrateMs?: number;  // default: 10
}
```

**Variant tokens:**
- `primary`: `bg-emerald-400 text-zinc-950` with glow shadow
- `ghost`: `bg-zinc-800/60 border border-zinc-700/50 text-zinc-300`
- `danger`: `bg-rose-500 text-zinc-950` with glow shadow

---

### `PremiumInput`
**File:** `components/ui-premium/PremiumInput.tsx`  
**Purpose:** Dark glassmorphism text input with optional label, hint, left icon, right element, and multiline (textarea) mode. Focus paints an emerald ring.

```ts
interface PremiumInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  className?: string;
  inputClassName?: string;
  rightElement?: React.ReactNode;
  leftIcon?: React.ReactNode;
  multiline?: boolean;  // renders <textarea> if true
  rows?: number;        // default: 3
}
```

---

### `PremiumModal`
**File:** `components/ui-premium/PremiumModal.tsx`  
**Purpose:** Full-screen darkened overlay modal with scrollable content area, optional header media slot (16:9), eyebrow + title, and sticky footer CTA. Closes on backdrop tap.

```ts
interface PremiumModalProps {
  onClose: () => void;
  children: React.ReactNode;
  headerMedia?: React.ReactNode;  // rendered in 16:9 container at top
  eyebrow?: string;
  title?: string;
  primaryLabel?: string;  // if provided, renders sticky footer CTA button
  onPrimary?: () => void;
  maxWidth?: string;       // default: 'max-w-2xl'
}
```

---

### `PremiumFilterTab`
**File:** `components/ui-premium/PremiumFilterTab.tsx`  
**Purpose:** Pill-shaped glassmorphism filter chip. Active state shows `text-emerald-400`, animated bottom underline glow, and optional count badge.

```ts
interface PremiumFilterTabProps {
  id: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
  isActive: boolean;
  onClick: (id: string) => void;
}
```

---

### `PremiumBadge`
**File:** `components/ui-premium/PremiumBadge.tsx`  
**Purpose:** Tiny inline status badge pill. Used for type labels (e.g., "FUERZA", "PR").

```ts
// No formal interface — accepts children + className
// Usage: <PremiumBadge className="bg-emerald-400/10 text-emerald-400">PR</PremiumBadge>
```

---

### `PremiumChip`
**File:** `components/ui-premium/PremiumChip.tsx`  
**Purpose:** Selectable filter chip for tag-style filtering. Toggle active state.

```ts
// Accepts: label, isActive, onClick — minimal stateless chip
```

---

### `PremiumStepper`
**File:** `components/ui-premium/PremiumStepper.tsx`  
**Purpose:** Numeric +/- stepper control for quantity inputs. Supports min/max bounds and step increments.

```ts
// Props: value, onChange, min?, max?, step?
```

---

### `SegmentedTabs`
**File:** `components/ui-premium/SegmentedTabs.tsx`  
**Purpose:** Horizontal button group for selecting between 2–4 mutually exclusive options. Active state fills with `bg-emerald-400 text-zinc-950`.

```ts
interface SegmentOption {
  label: string;
  value: string | number;
}

interface SegmentedTabsProps {
  label?: string;            // optional EyebrowText above the tabs
  options: SegmentOption[];
  selectedValue: string | number;
  onChange: (value: string | number) => void;
}
```

---

### `SearchBar`
**File:** `components/ui-premium/SearchBar.tsx`  
**Purpose:** Full-width dark search input with magnifier icon and optional clear button.

```ts
// Wraps PremiumInput with search semantics. Accepts: value, onChange, placeholder, onClear
```

---

### `IconButton`
**File:** `components/ui-premium/IconButton.tsx`  
**Purpose:** Small circular icon button. Two variants: `solid` (emerald filled) and `ghost` (dark border).

```ts
// Props: icon, variant, size, onClick, aria-label
```

---

### `ImageUploadArea`
**File:** `components/ui-premium/ImageUploadArea.tsx`  
**Purpose:** Dotted-border drag-and-drop zone for image selection. Shows preview after selection.

```ts
// Props: onImageSelected (file => void), previewUrl?, label?
```

---

### `SquishyCard` + `BentoQuadrant`
**File:** `components/ui-premium/BentoQuadrant.tsx`  
**Purpose:** Pre-composed 2×2 bento layout wrapper that arranges 4 SquishyCards in a responsive grid. Accepts `children` (exactly 4 nodes).

---

### `IngredientListItem`
**File:** `components/ui-premium/IngredientListItem.tsx`  
**Purpose:** HUD-style ingredient row for food search/selection. Left image, center identity+macros, right kcal + add/stepper control. Supports decimal quantity multiplier with raw/cooked weight equivalents.

```ts
interface IngredientMacros {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface IngredientEditableData {
  name: string;
  brand?: string;
  standardPortion: string;  // e.g. "100g", "1 taza"
  rawWeightG?: number;
  cookedWeightG?: number;
  macros: IngredientMacros;
}

interface IngredientItemProps extends IngredientEditableData {
  imageUrl?: string;
  isAddedToPlate: boolean;
  quantityMultiplier: number;   // decimal, e.g. 1.5 = 1.5 portions
  onAdd: () => void;
  onUpdateQuantity: (delta: number) => void;  // deltas are 0.25 steps
  onEdit: (data: IngredientEditableData) => void;
}
```

---

### `IngredientEditModal`
**File:** `components/ui-premium/IngredientEditModal.tsx`  
**Purpose:** Modal sheet for editing all writable fields of an ingredient (name, brand, portion, weights, macros).

```ts
interface IngredientEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: IngredientEditableData;
  onSave: (data: IngredientEditableData) => void;
}
```

---

### `RecipeCard`
**File:** `components/ui-premium/RecipeCard.tsx`  
**Purpose:** Vertical card for recipe display. Hero image (h-44) with gradient overlay. Shows kcal as emerald StatLabel, title, description, and macro pills (P/C/G). Optional quick-add FAB.

```ts
interface RecipeMacros {
  protein: number;
  carbs: number;
  fat: number;
}

interface Recipe {
  title: string;
  description: string;
  imageUrl?: string;
  category?: string;
  isFavorite?: boolean;
  portions: number;
  prepTimeMin: number;
  totals: {
    kcal: number;
    macros: RecipeMacros;
  };
}

interface RecipeCardProps {
  recipe: Recipe;
  onQuickAdd?: () => void;
  onClick?: () => void;
  className?: string;
}
```

---

### `RecipeCardPremium`
**File:** `components/ui-premium/RecipeCardPremium.tsx`  
**Purpose:** Expanded premium variant of RecipeCard. Larger hero, richer metadata layout for featured/hero placements.

```ts
// Same Recipe interface as RecipeCard + additional layout emphasis
```

---

### `RoutineCard`
**File:** `components/ui-premium/RoutineCard.tsx`  
**Purpose:** Vertical card for workout routine. Hero image (h-56), overlaid focus/time metadata in emerald, title, description, and primary CTA button.

```ts
interface WorkoutRoutine {
  title: string;
  description: string;
  imageUrl?: string;
  focus: string;           // e.g. "FUERZA", "CARDIO"
  estimatedTimeMin: number;
  exerciseCount: number;
}

interface RoutineCardProps {
  routine: WorkoutRoutine;
  onView?: () => void;
  className?: string;
}
```

---

### `RoutineCardPremium`
**File:** `components/ui-premium/RoutineCardPremium.tsx`  
**Purpose:** Wider premium variant of RoutineCard for featured placement. Full-bleed image with stronger gradient.

```ts
// Same WorkoutRoutine interface
```

---

### `NonNegotiableCard`
**File:** `components/ui-premium/NonNegotiableCard.tsx`  
**Purpose:** Compact metric card with inline tap-to-edit support. Shows a GiantValue number, `MutedText` unit, progress bar flush to bottom edge. Validates and commits on blur/Enter.

```ts
interface DailyMetric {
  id: string;
  label: string;
  icon?: React.ReactNode;
  currentValue: number;
  targetValue: number;
  unit: string;
  isAutomated: boolean;       // if true, card is read-only (no tap-to-edit)
  toleranceThreshold: number; // 0..1, progress >= this → isMet (turns emerald)
}

interface NonNegotiableCardProps {
  metric: DailyMetric;
  onValueChange?: (id: string, newValue: number) => void;
  className?: string;
}
```

---

### `WeeklyStreakTracker`
**File:** `components/ui-premium/WeeklyStreakTracker.tsx`  
**Purpose:** Horizontal 7-day streak visualization. Each day is a circle with status: completed (emerald fill + checkmark), failed (zinc dot), pending (ghost border). Today gets an emerald ring.

```ts
interface DailyStreak {
  date: string;
  dayInitial: string;     // e.g. "L", "M", "X"
  dayNumber?: number;
  isToday: boolean;
  status: 'completed' | 'failed' | 'pending';
}

interface WeeklyStreakTrackerProps {
  days: DailyStreak[];
  className?: string;
}
```

---

### `StreakCalendar`
**File:** `components/ui-premium/StreakCalendar.tsx`  
**Purpose:** Monthly calendar heatmap showing workout frequency. Active days glow emerald.

```ts
// Props: month (Date), activeDays (string[] of ISO date strings), className?
```

---

### `MasterNutritionDashboard`
**File:** `components/ui-premium/MasterNutritionDashboard.tsx`  
**Purpose:** Full nutrition day view. SVG calorie ring (adaptive color: emerald/amber/rose), protein/carbs/fat progress bars with MIN+IDEAL dual markers, day navigator, and Shared Bag (C+G) MacroLimitCards. Internally calls `useFlexibleMacros`.

```ts
interface MasterNutritionDashboardProps {
  target: FlexibleMacroTarget;    // from useFlexibleMacros
  consumed: FlexibleMacroConsumed; // from useFlexibleMacros
  date?: Date;                    // defaults to today
  onPrevDay?: () => void;
  onNextDay?: () => void;
  className?: string;
}
```

---

### `NutritionSummaryMini`
**File:** `components/ui-premium/NutritionSummaryMini.tsx`  
**Purpose:** Compact nutrition widget for use inside cards or dashboards. Shows a small calorie ring and macro bars in a horizontal layout.

```ts
// Props: target (FlexibleMacroTarget), consumed (FlexibleMacroConsumed), className?
```

---

### `SmartFlexibleMacros`
**File:** `components/ui-premium/SmartFlexibleMacros.tsx`  
**Purpose:** Detailed macro breakdown widget showing the Shared Bag model with dynamic sliders and status pills. Used as a deep-dive companion to MasterNutritionDashboard.

```ts
// Props: target (FlexibleMacroTarget), consumed (FlexibleMacroConsumed)
```

---

### `TrendChartCard`
**File:** `components/ui-premium/TrendChartCard.tsx`  
**Purpose:** HUD-style SVG line chart with two modes: `single-line` (solid emerald polyline + gradient fill) and `dual-axis` (line + secondary zinc bar chart). Y-axis labels are HTML-positioned outside the SVG. Last-point dot has an emerald glow.

```ts
interface TrendChartCardProps {
  title: string;
  primaryMetric: {
    label: string;
    currentValue: string;    // formatted string, e.g. "75.2 kg"
    trend: 'up' | 'down' | 'neutral';
  };
  chartData: {
    dateLabel: string;       // e.g. "01 Mar"
    primaryValue: number;
    secondaryValue?: number; // only for dual-axis mode
  }[];
  chartType: 'single-line' | 'dual-axis';
}
```

---

### `InteractiveProgressWidget`
**File:** `components/ui-premium/InteractiveProgressWidget.tsx`  
**Purpose:** Self-contained tabbed progress dashboard. Three main tabs (CORPORAL, FUERZA, CARDIO) with sub-navigation and time range filters (1M/3M/6M/MAX). Internally manages state, loads mock data, and renders `TrendChartCard`. Full-width layout with glassmorphism header.

```ts
// No external props — fully self-contained with internal mock data.
// State: activeTab ('corporal'|'fuerza'|'cardio'), activeSubTab (string), timeRange ('1M'|'3M'|'6M'|'MAX')
// Designed to be replaced with real data via props in production.
```

---

### `SmartRestTimer`
**File:** `components/ui-premium/SmartRestTimer.tsx`  
**Purpose:** Animated circular countdown timer for between-set rest. Ring color changes by phase (cyan=recovery, emerald=ready, amber=urgency). Buttons: +15s and "INICIAR SERIE". Internally uses `useRestTimer`.

```ts
interface SmartRestTimerProps {
  targetTime: number;    // seconds
  minimumTime: number;   // phase boundary between 'recovery' and 'ready'
  onSkip?: () => void;  // called when user taps INICIAR SERIE
  className?: string;
}
```

---

### `LogEntryCard`
**File:** `components/ui-premium/LogEntryCard.tsx`  
**Purpose:** Polymorphic history log card. Adapts icon and left edge color based on `type`. Shows hero metric (emerald), flags (PR crown=amber, AI=violet, Notes=zinc), and optional accordion detail list. Date dividers are implemented at the list-container level (not inside the card).

```ts
interface LogEntryCardProps {
  id: string;
  date: string;               // display string, e.g. "10:30 AM"
  type: 'strength' | 'cardio' | 'anthropometry';
  title: string;
  heroValue: string;          // e.g. "12,450" or "05′15″"
  heroUnit: string;           // e.g. "kg" or "/km"
  metadata: {
    label: string;            // e.g. "Volumen"
    subValue: string;         // e.g. "6 ejercicios"
  };
  hasAISummary?: boolean;
  hasNotes?: boolean;
  isPR?: boolean;
  details?: string[];         // if provided, card becomes expandable (accordion)
}
```

**Type → visual mapping:**
| type | border-left | icon | icon bg |
|---|---|---|---|
| `strength` | `zinc-500/40` | Dumbbell | `zinc-800/50` |
| `cardio` | `emerald-400/40` | Zap | `emerald-500/10` |
| `anthropometry` | `violet-400/40` | Ruler | `violet-500/10` |

---

### `ProgressThumbnail`
**File:** `components/ui-premium/ProgressThumbnail.tsx`  
**Purpose:** Portrait photo card (`aspect-[4/5]`) for body progress gallery. Full-bleed image with aggressive bottom gradient (h-2/3), date pill (crystal glass), weight hero metric (emerald), body fat %. Optional selection circle (ghost → filled emerald with checkmark). Inner boundary ring (`ring-white/10`) prevents image from blending into background.

```ts
interface ProgressThumbnailProps {
  id: string;
  imageUrl: string;
  date: string;                     // formatted display string, e.g. "12 Feb 2026"
  weight: number;
  weightUnit: 'kg' | 'lbs';
  bodyFatPercentage?: number;
  isSelectable?: boolean;           // shows selection circle
  isSelected?: boolean;             // fills circle with emerald + checkmark
  onSelect?: (id: string) => void;  // called when isSelectable=true and tapped
  onClick?: (id: string) => void;   // called when isSelectable=false
}
```

---

## DATE DIVIDERS (Pattern, not a component)

To group `LogEntryCard` or other list items by date, use this pattern directly in the container:

```tsx
<div className="flex items-center gap-3 mb-2 mt-4">
  <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">Hoy</span>
  <div className="flex-1 h-px bg-zinc-800/40" />
</div>
```

No component — inline pattern. Do NOT use heavy `bg-zinc-950` sticky strips.

---

---

### `ActivityBentoMenu`
**File:** `components/ui-premium/ActivityBentoMenu.tsx`  
**Purpose:** Full-width (Span 12) Bento row with 3 square activity tiles: Carrera, Senderismo, Rucking. Each tile is a Framer Motion button with `whileTap={{ scale: 0.98 }}` squishy feedback. Uses `SquishyCard` as container. Zero business logic — purely presentational.

```ts
export type ActivityType = 'run' | 'hike' | 'rucking';

export interface ActivityBentoMenuProps {
  onOpen: (type: ActivityType) => void;
  className?: string;
}
```

**Usage:**
```tsx
<ActivityBentoMenu onOpen={(type) => activity.openActivityLog(type)} />
```

---

### `NutritionMacroBar`
**File:** `components/ui-premium/NutritionMacroBar.tsx`  
**Purpose:** Renders 3 labeled horizontal progress bars using the **canonical macro color dialect**. Receives raw progress values from `useFlexibleMacros`. No internal calculations.

**Canonical dialect (SSOT — do NOT deviate):**

| Macro | Label | Bar color |
|---|---|---|
| Proteína | `PROTEÍNA` | `bg-violet-500` |
| Carbohidratos | `CARBOS` | `bg-cyan-400` (overMax → `bg-rose-400`) |
| Grasas | `GRASAS` | `bg-orange-400` (overMax → `bg-rose-400`) |

> ❌ Prohibited abbreviations: `PRO`, `CH`, `GRA`  
> ❌ Prohibited macro colors: `emerald`, `amber`, `rose` (except overMax state)

```ts
export interface NutritionMacroBarProps {
  proteinProgress: number;  // 0..1 from useFlexibleMacros
  carbProgress:    number;  // 0..1 from useFlexibleMacros
  fatProgress:     number;  // 0..1 from useFlexibleMacros
  isCarbOverMax:   boolean; // from useFlexibleMacros
  isFatOverMax:    boolean; // from useFlexibleMacros
  className?:      string;
}
```

**Usage:**
```tsx
const macros = useFlexibleMacros(target, consumed);
<NutritionMacroBar
  proteinProgress={macros.proteinProgress}
  carbProgress={macros.carbProgress}
  fatProgress={macros.fatProgress}
  isCarbOverMax={macros.isCarbOverMax}
  isFatOverMax={macros.isFatOverMax}
/>
// or spread shorthand:
<NutritionMacroBar {...macros} />
```

---

## EXPORT INDEX

All components available via: `import { ComponentName } from '@/components/ui-premium';`

```
BentoQuadrant, ImageUploadArea, MasterNutritionDashboard, NutritionSummaryMini,
SmartFlexibleMacros, useFlexibleMacros, SmartRestTimer, useRestTimer,
NonNegotiableCard, StreakCalendar, PremiumBadge, PremiumFilterTab,
IngredientListItem, IngredientEditModal, IconButton, PremiumButton,
PremiumChip, PremiumInput, PremiumModal, PremiumStepper, RecipeCard,
RecipeCardPremium, RoutineCard, RoutineCardPremium, SearchBar,
WeeklyStreakTracker, SegmentedTabs, SquishyCard,
EyebrowText, ModalTitle, SectionTitle, CardTitle, BodyText, MutedText,
StatLabel, StatValue, MonoValue, GiantValue, TabLabel
```

**NOT yet in index.ts (add manually if needed):**
- `TrendChartCard` (export exists in file, missing from index)
- `InteractiveProgressWidget` (standalone, no index export)
- `LogEntryCard` (standalone, no index export)
- `ProgressThumbnail` (standalone, no index export)
