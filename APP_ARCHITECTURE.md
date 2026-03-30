# APP_ARCHITECTURE.md

## 1. Filosofía de Diseño (Tendencias 2026)

Este repositorio adopta una dirección visual premium, expresiva y deliberadamente no genérica. Todo agente de IA que produzca UI en esta app debe tratar estas reglas como contrato arquitectónico, no como sugerencias.

### 1.1 Liquid Glass
- El efecto `Liquid Glass` existe para crear profundidad en overlays y capas elevadas.
- Se permite únicamente en:
  - modales
  - sheets
  - tarjetas superpuestas
  - superficies premium de auditoría o focus mode
- El patrón base permitido es:
  - `bg-zinc-900/80`
  - `backdrop-blur-xl`
  - `border-zinc-800/50`
- Regla crítica:
  - el texto importante nunca debe depender de un fondo translúcido complejo para mantener legibilidad
  - títulos, métricas clave y CTAs deben descansar visualmente sobre contraste fuerte y estable

### 1.2 Maximalismo Táctil y Color Dopamínico
- Se rechaza explícitamente el diseño plano, tímido o intercambiable.
- La interfaz debe sentirse física, táctil y con intención editorial.
- Se prioriza:
  - controles grandes y fáciles de tocar
  - jerarquías visuales dramáticas
  - tipografía masiva como elemento gráfico, no solo funcional
  - CTAs claros y energéticos
- Componentes como steppers, gauges, badges y botones principales deben tener presencia visual evidente.
- Los números, porcentajes y estados de progreso deben sentirse protagonistas.

### 1.3 Human Scribble / Anti-Grid
- La UI no debe caer en una cuadrícula perfecta y rígida en todas las superficies.
- Se permiten composiciones orgánicas, asimetrías controladas y bloques con personalidad.
- Esto aplica especialmente a:
  - métricas
  - progreso
  - dashboards
  - tarjetas hero
  - resúmenes de actividad
- La intención es evitar layouts que parezcan plantillas genéricas de dashboard.
- La irregularidad debe ser intencional, nunca caótica.

### 1.4 Arquitectura Data-Driven
- Los componentes deben responder al contenido y al volumen de datos antes que a una grilla fija.
- Se prefieren anchos intrínsecos y límites naturales de lectura.
- Ejemplos válidos:
  - `max-w-[380px]` para tarjetas de contenido denso
  - bloques que crecen por contenido
  - filas horizontales que se adaptan al dato dominante
- Se evita forzar todo en:
  - grids uniformes
  - cards idénticas
  - columnas artificiales sin relación con el contenido
- Regla:
  - el dato manda la forma
  - la composición sigue a la información

---

## 2. Tokens de Color Semántico (Modo Oscuro Profundo)

El sistema vive sobre un modo oscuro profundo y cinematográfico. No se deben introducir paletas aleatorias ni variantes ad hoc fuera de estos tokens semánticos.

### 2.1 Superficies
- Fondo global:
  - `bg-zinc-950`
- Cristales / overlays premium:
  - `bg-zinc-900/80`
  - `backdrop-blur-xl`
- Bordes de elevación:
  - `border-zinc-800/50`

### 2.2 Acentos Dopamínicos
- `emerald-400`
  - éxito
  - CTA principal
  - rango ideal
  - confirmación positiva
- `orange-500`
  - fuerza
  - grasas
  - esfuerzo físico
  - intensidad muscular
- `cyan-400`
  - cardio
  - pasos
  - agua
  - movimiento y fluidez
- `violet-500`
  - proteína
  - construcción
  - desarrollo
  - recuperación estructural
- `amber-400`
  - advertencia
  - atención
  - estado intermedio
- `rose-500`
  - límite superado
  - exceso
  - error crítico
  - sobreconsumo o sobrecarga

### 2.3 Reglas de Uso
- No usar colores por gusto personal o moda momentánea.
- Todo color debe comunicar estado, tipo de dato o intención.
- Los colores de acento deben destacar información relevante, no decorar sin propósito.
- El fondo oscuro es la base por defecto de la app.
- El texto crítico debe conservar legibilidad alta sobre las superficies definidas.

---

## 3. Tokens Tipográficos Oficiales (Importados de Typography.tsx)

La tipografía oficial del producto vive en `components/ui-premium/Typography.tsx`.  
Estos componentes son obligatorios para construir jerarquía visual consistente.

### 3.1 Uso estricto por componente
- `<EyebrowText>`
  - para etiquetas superiores
  - metadata breve
  - categorías
  - labels de contexto encima de títulos
- `<ModalTitle>`
  - para títulos principales de modales, sheets y tarjetas hero premium
- `<SectionTitle>`
  - para encabezados de secciones dentro de pantallas
- `<CardTitle>`
  - para títulos de tarjetas, módulos compactos y bloques bento
- `<BodyText>`
  - para descripción principal, párrafos explicativos y contenido base
- `<MutedText>`
  - para hints, apoyo contextual, metadata secundaria y texto de baja prioridad
- `<StatLabel>`
  - para etiquetas de KPIs y métricas
- `<StatValue>`
  - para números grandes, métricas hero, porcentajes y valores protagonistas
- `<MonoValue>`
  - para tiempos, cifras técnicas, datos tabulados y valores de precisión
- `<GiantValue>`
  - para números masivos en centros de steppers y KPIs de primer nivel
  - `text-7xl font-black tracking-tighter` — máxima presencia visual táctil
- `<TabLabel>`
  - para texto central de botones táctiles, pestañas y segmented controls
  - `text-base font-black tracking-wide` — alta legibilidad sin color propio (hereda del contexto)

### 3.2 Regla de prohibición
- Queda prohibido inventar etiquetas manuales con clases sueltas como:
  - `text-xs text-gray-500`
  - `text-sm text-zinc-400`
  - `font-bold uppercase tracking-wide`
- Si el patrón es tipográfico, debe salir de `Typography.tsx`.
- Si falta un token, se debe proponer una ampliación del sistema tipográfico, no improvisar clases locales.

### 3.3 Regla operativa para agentes
- Nunca crear jerarquías de texto ad hoc en pantallas nuevas.
- Toda pantalla o componente premium debe importar primero los tokens oficiales antes de escribir cualquier texto UI.
- La consistencia tipográfica es parte del contrato arquitectónico.

---

## 4. Topología de Pantallas (El Contrato de Datos)

La topología define qué módulos debe soportar la app y qué bloques de información son estructuralmente obligatorios. No es una maqueta cerrada, pero sí un contrato de producto.

### 4.1 Hoy
Pantalla diaria orientada a acción inmediata y lectura rápida.

Bloques esperados:
- Header dinámico
- Calendario de rachas
- Lanzador de rutinas
- Dashboard Bento Box con innegociables:
  - proteína
  - calorías
  - sueño
  - pasos
- Resumen nutricional mini
- Modales de actividad libre

Principios:
- Debe sentirse viva, editorial y priorizada.
- La misión del día y los innegociables deben tener máxima claridad.
- No convertir `Hoy` en una tabla aburrida de widgets idénticos.

### 4.2 Nutrición
Pantalla orientada a feedback continuo e impacto inmediato de decisiones alimentarias.

Bloques esperados:
- Dashboard de macros flexibles con `Arc Gauge`
- Bitácora del día colapsable
- Navegador de fechas
- Creador de plato con:
  - buscador
  - escáner IA
  - entrada manual
  - live feedback de impacto

Principios:
- Debe responder al dato y al contexto diario.
- La visualización de macros no debe limitarse a barras genéricas.
- El creador de plato debe sentirse asistido, rápido y táctil.

### 4.3 Biblioteca
Pantalla de exploración, construcción y reutilización de conocimiento fitness.

Bloques esperados:
- Recetas con `RecipeCardPremium`
- Base de datos de ejercicios
- Constructor de rutinas
- Planificador semanal con:
  - mañana
  - tarde
  - noche

Principios:
- Biblioteca no es un listado plano.
- Debe permitir descubrir, editar, guardar y recombinar contenido.
- Las tarjetas y flows deben priorizar claridad editorial y utilidad práctica.

### 4.4 Progreso
Pantalla enfocada en evolución visible, tendencia y narrativa de cambio.

Bloques esperados:
- Meta de peso
- Gráficas:
  - fuerza
  - medidas
  - cardio
- Historial de sesiones
- Galería de comparación visual

Principios:
- El progreso debe sentirse acumulativo y significativo.
- Las visualizaciones deben comunicar dirección, no solo almacenar datos.
- La comparación visual debe tener un rol fuerte y emocional.

### 4.5 Rutina Activa (Focus Mode)
Modo inmersivo de ejecución con reducción extrema de distracción.

Fases esperadas:
- Pre-start
- Calentamiento con checklists
- Fuerza con:
  - steppers
  - tabs RIR
- Descanso con `CircularTimer`
- Resumen final

Principios:
- Toda la experiencia debe sentirse enfocada, táctil y decisiva.
- Los controles deben ser grandes, obvios y resistentes a error.
- Focus Mode debe tener coherencia visual total entre inicio, ejecución, descanso y cierre.

---

## Regla Final del Repositorio

Todo agente que produzca UI o arquitectura visual en este proyecto debe asumir lo siguiente:
- `APP_ARCHITECTURE.md` es la SSOT visual y estructural.
- `components/ui-premium/` es la base prioritaria para UI nueva.
- No se permite código genérico, estéticas por defecto ni decisiones visuales de plantilla.
- Si una decisión contradice este documento, debe considerarse incorrecta hasta que se actualice formalmente esta arquitectura.
