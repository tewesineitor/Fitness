---
name: premium-squishy-ui
description: Se activa EXCLUSIVAMENTE cuando el usuario solicita "aplicar diseño premium", "estandarizar UI", "aplicar squishy UI", "usar el UI kit" o "refactorizar diseño de pantalla". Fuerza la inyección de la estética "Late-Stage UX" y "Maximalismo Táctil" en la capa de presentación, erradicando el uso de Tailwind genérico o plantillas planas en favor del ADN visual "Squishy UI" con cristal oscuro, bordes masivos, alto contraste y acentos vibrantes.
---

# Premium Squishy UI

## Propósito

Obligar al motor de inferencia a construir interfaces utilizando el ADN visual "Squishy UI" (cristal oscuro, bordes masivos, alto contraste y acentos vibrantes), erradicando el uso de Tailwind genérico o plantillas aburridas. Toda superficie generada debe exudar una estética "Late-Stage UX" y "Maximalismo Táctil" que se sienta premium, orgánica y contemporánea.

## Restricciones Absolutas

- **Prohibido el diseño plano:** Tienes estrictamente prohibido usar fondos oscuros sólidos (ej. `bg-zinc-900`) sin textura para las tarjetas. Toda tarjeta o contenedor premium DEBE usar Glassmorphism oscuro: `bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50`.

- **Prohibidas las esquinas afiladas:** Nunca uses radios menores a `xl` para contenedores. Es obligatorio aplicar el Maximalismo Táctil usando radios masivos como `rounded-[2rem]` o `rounded-[1.5rem]` para tarjetas, y `rounded-full` para botones.

- **Prohibido el texto ilegible:** Nunca uses `text-zinc-500` o `text-zinc-600` para textos secundarios. El contraste mínimo exigido es `text-zinc-400`. El texto primario debe ser `text-zinc-100` o `text-white`.

- **Estricto control de acento:** El color de acento principal es el verde eléctrico/esmeralda. Los botones de acción primaria o FABs deben usar obligatoriamente `bg-emerald-400 text-zinc-950 font-bold` con un halo luminoso `shadow-[0_0_30px_rgba(52,211,153,0.2)]`.

## Protocolo de Ejecución

1. **Verificación de Glassmorphism:** Antes de renderizar HTML/JSX, verifica si estás aplicando las clases de Glassmorphism (`bg-zinc-900/50 backdrop-blur-xl`) y los bordes masivos (`rounded-[2rem]`). Si detectas un contenedor sin estas propiedades, corrígelo antes de continuar.

2. **Arquitectura Espacial Generosa:** Asegura que la arquitectura espacial sea generosa. Usa Flexbox o CSS Grid (`gap-4` o superior) para separar los elementos; nunca los amontones. El espacio negativo es un elemento de diseño, no un desperdicio.

3. **Estado Táctil Responsivo:** A los elementos interactivos clickeables (como cabeceras de acordeón o tarjetas), aplícales un estado táctil responsivo como `active:bg-zinc-800/40 cursor-pointer select-none`. Todo elemento que invita al toque debe responder visualmente al toque.

4. **SVGs y Degradados Premium:** Si debes renderizar SVGs dinámicos (como anillos de progreso), utiliza degradados premium (ej. `from-emerald-400 to-cyan-400`) en lugar de colores sólidos. Los gradientes aportan profundidad y vida a la interfaz.
