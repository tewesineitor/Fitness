# Frontend Anti-Patterns & Gotchas

Esta regla es de lectura obligatoria antes de generar o modificar componentes UI de React y Tailwind.

## 1. Trampa de Tailwind Purge (Clases Dinámicas)
**Problema:** Tailwind CSS no detecta clases construidas dinámicamente mediante concatenación de strings (ej. `` `stroke-${colorVariable}` ``). Esto causa que los estilos se eliminen (purge) en producción o no se rendericen.
**Solución Obligatoria:** JAMÁS construyas clases de Tailwind dinámicamente. Usa diccionarios estáticos o, para colores dinámicos en SVGs, inyecta el valor HEX real directamente en el atributo de React (ej. `stroke="#4ade80"`).

## 2. SVGs Degenerados (Arcos Invisibles)
**Problema:** Funciones de dibujo de SVG (como `describeArc` para anillos de progreso) colapsan y se vuelven invisibles si el porcentaje (`pct` o `fraction`) es exactamente `0`.
**Solución Obligatoria:** Siempre aplica un límite inferior matemático cuando renderices fracciones en SVGs. Usa `Math.max(fraction, 0.001)` para garantizar que el `path` nunca sea un punto muerto.

## 3. Layouts Inconsistentes (Conflictos de max-width)
**Problema:** Usar `max-w-2xl` o anchos arbitrarios en pantallas principales rompe la consistencia del dashboard y causa colisiones con componentes fijos como el `BottomNav`.
**Solución Obligatoria:** Todas las vistas principales DEBEN seguir la estructura de doble wrapper establecida:
```tsx
<div className="relative w-full min-h-screen">
  <div className="max-w-4xl mx-auto w-full flex flex-col gap-6 px-4 pb-40">
    {/* contenido */}
  </div>
</div>
```
Nunca uses `max-w-2xl` ni `max-w-3xl` en el wrapper raíz de una pantalla principal.

## 4. Variables CSS Indefinidas en Tokens de Tailwind
**Problema:** Declarar un token en `tailwind.config.cjs` (ej. `brand-carbs`, `brand-fat`) sin definir la variable CSS correspondiente (`--color-brand-carbs-rgb`) en `tailwind.css` produce clases que compilan pero renderizan como `transparent` en runtime.
**Solución Obligatoria:** Antes de usar un token de color en un componente, verifica que su variable CSS esté definida en ambos temas (`:root` y `.dark`) de `tailwind.css`. Si la variable no existe, usa un HEX literal o añade la variable antes de usar el token.

## 5. Lógica Booleana con Fallback Incorrecto (Tracker de Hábitos)
**Problema:** Una cadena ternaria `A ? 'danger' : B ? 'warning' : 'success'` clasifica el estado vacío/cero como `'success'` porque el fallback final se ejecuta cuando no hay datos reales.
**Solución Obligatoria:** Siempre trata el estado "sin datos" (`=== 0` o `=== null`) de forma explícita y primaria antes del resto de condiciones. El estado `'success'` solo debe alcanzarse con datos reales que superen un umbral mínimo (ej. `>= goal * 0.9`).

## 6. Toggles Binarios para Métricas Continuas (UX)
**Problema:** Implementar un toggle on/off (`0 → 8`) para capturar métricas continuas como horas de sueño elimina la granularidad y produce datos de salud falsos.
**Solución Obligatoria:** Las métricas continuas (horas de sueño, pasos, peso) SIEMPRE deben capturarse mediante un input numérico, un `prompt` temporal o un modal dedicado. Un booleano solo es válido para estados verdaderamente binarios (ej. `stepsGoalMet`).

## 7. Nomenclatura Semántica en Labels de Sección
**Problema:** Reutilizar labels genéricos (ej. "Explorar") para secciones de acción específica (ej. registrar actividad) crea confusión de UX y rompe la arquitectura de información.
**Solución Obligatoria:** El label de una sección debe describir la acción primaria que el usuario ejecuta en ella, no el contenido que "explora". Usa verbos o sustantivos de acción: "Registrar", "Actividad Libre", "Añadir", etc.
