> [!WARNING]
> ARCHIVADO. NO USAR COMO REFERENCIA. VER UI_MANIFEST.md y LOGIC_MANIFEST.md.

# APP_ARCHITECTURE.md

## 1. FilosofÃ­a de DiseÃ±o (Tendencias 2026)

Este repositorio adopta una direcciÃ³n visual premium, expresiva y deliberadamente no genÃ©rica. Todo agente de IA que produzca UI en esta app debe tratar estas reglas como contrato arquitectÃ³nico, no como sugerencias.

### 1.1 Liquid Glass
- El efecto `Liquid Glass` existe para crear profundidad en overlays y capas elevadas.
- Se permite Ãºnicamente en:
  - modales
  - sheets
  - tarjetas superpuestas
  - superficies premium de auditorÃ­a o focus mode
- El patrÃ³n base permitido es:
  - `bg-zinc-900/80`
  - `backdrop-blur-xl`
  - `border-zinc-800/50`
- Regla crÃ­tica:
  - el texto importante nunca debe depender de un fondo translÃºcido complejo para mantener legibilidad
  - tÃ­tulos, mÃ©tricas clave y CTAs deben descansar visualmente sobre contraste fuerte y estable

### 1.2 Maximalismo TÃ¡ctil y Color DopamÃ­nico
- Se rechaza explÃ­citamente el diseÃ±o plano, tÃ­mido o intercambiable.
- La interfaz debe sentirse fÃ­sica, tÃ¡ctil y con intenciÃ³n editorial.
- Se prioriza:
  - controles grandes y fÃ¡ciles de tocar
  - jerarquÃ­as visuales dramÃ¡ticas
  - tipografÃ­a masiva como elemento grÃ¡fico, no solo funcional
  - CTAs claros y energÃ©ticos
- Componentes como steppers, gauges, badges y botones principales deben tener presencia visual evidente.
- Los nÃºmeros, porcentajes y estados de progreso deben sentirse protagonistas.

### 1.3 Human Scribble / Anti-Grid
- La UI no debe caer en una cuadrÃ­cula perfecta y rÃ­gida en todas las superficies.
- Se permiten composiciones orgÃ¡nicas, asimetrÃ­as controladas y bloques con personalidad.
- Esto aplica especialmente a:
  - mÃ©tricas
  - progreso
  - dashboards
  - tarjetas hero
  - resÃºmenes de actividad
- La intenciÃ³n es evitar layouts que parezcan plantillas genÃ©ricas de dashboard.
- La irregularidad debe ser intencional, nunca caÃ³tica.

### 1.4 Arquitectura Data-Driven
- Los componentes deben responder al contenido y al volumen de datos antes que a una grilla fija.
- Se prefieren anchos intrÃ­nsecos y lÃ­mites naturales de lectura.
- Ejemplos vÃ¡lidos:
  - `max-w-[380px]` para tarjetas de contenido denso
  - bloques que crecen por contenido
  - filas horizontales que se adaptan al dato dominante
- Se evita forzar todo en:
  - grids uniformes
  - cards idÃ©nticas
  - columnas artificiales sin relaciÃ³n con el contenido
- Regla:
  - el dato manda la forma
  - la composiciÃ³n sigue a la informaciÃ³n

---

## 2. Tokens de Color SemÃ¡ntico (Modo Oscuro Profundo)

El sistema vive sobre un modo oscuro profundo y cinematogrÃ¡fico. No se deben introducir paletas aleatorias ni variantes ad hoc fuera de estos tokens semÃ¡nticos.

### 2.1 Superficies
- Fondo global:
  - `bg-zinc-950`
- Cristales / overlays premium:
  - `bg-zinc-900/80`
  - `backdrop-blur-xl`
- Bordes de elevaciÃ³n:
  - `border-zinc-800/50`

### 2.2 Acentos DopamÃ­nicos
- `emerald-400`
  - Ã©xito
  - CTA principal
  - rango ideal
  - confirmaciÃ³n positiva
- `orange-500`
  - fuerza
  - grasas
  - esfuerzo fÃ­sico
  - intensidad muscular
- `cyan-400`
  - cardio
  - pasos
  - agua
  - movimiento y fluidez
- `violet-500`
  - proteÃ­na
  - construcciÃ³n
  - desarrollo
  - recuperaciÃ³n estructural
- `amber-400`
  - advertencia
  - atenciÃ³n
  - estado intermedio
- `rose-500`
  - lÃ­mite superado
  - exceso
  - error crÃ­tico
  - sobreconsumo o sobrecarga

### 2.3 Reglas de Uso
- No usar colores por gusto personal o moda momentÃ¡nea.
- Todo color debe comunicar estado, tipo de dato o intenciÃ³n.
- Los colores de acento deben destacar informaciÃ³n relevante, no decorar sin propÃ³sito.
- El fondo oscuro es la base por defecto de la app.
- El texto crÃ­tico debe conservar legibilidad alta sobre las superficies definidas.

---

## 3. Tokens TipogrÃ¡ficos Oficiales (Importados de Typography.tsx)

La tipografÃ­a oficial del producto vive en `components/ui-premium/Typography.tsx`.  
Estos componentes son obligatorios para construir jerarquÃ­a visual consistente.

### 3.1 Uso estricto por componente
- `<EyebrowText>`
  - para etiquetas superiores
  - metadata breve
  - categorÃ­as
  - labels de contexto encima de tÃ­tulos
- `<ModalTitle>`
  - para tÃ­tulos principales de modales, sheets y tarjetas hero premium
- `<SectionTitle>`
  - para encabezados de secciones dentro de pantallas
- `<CardTitle>`
  - para tÃ­tulos de tarjetas, mÃ³dulos compactos y bloques bento
- `<BodyText>`
  - para descripciÃ³n principal, pÃ¡rrafos explicativos y contenido base
- `<MutedText>`
  - para hints, apoyo contextual, metadata secundaria y texto de baja prioridad
- `<StatLabel>`
  - para etiquetas de KPIs y mÃ©tricas
- `<StatValue>`
  - para nÃºmeros grandes, mÃ©tricas hero, porcentajes y valores protagonistas
- `<MonoValue>`
  - para tiempos, cifras tÃ©cnicas, datos tabulados y valores de precisiÃ³n
- `<GiantValue>`
  - para nÃºmeros masivos en centros de steppers y KPIs de primer nivel
  - `text-7xl font-black tracking-tighter` â€” mÃ¡xima presencia visual tÃ¡ctil
- `<TabLabel>`
  - para texto central de botones tÃ¡ctiles, pestaÃ±as y segmented controls
  - `text-base font-black tracking-wide` â€” alta legibilidad sin color propio (hereda del contexto)

### 3.2 Regla de prohibiciÃ³n
- Queda prohibido inventar etiquetas manuales con clases sueltas como:
  - `text-xs text-gray-500`
  - `text-sm text-zinc-400`
  - `font-bold uppercase tracking-wide`
- Si el patrÃ³n es tipogrÃ¡fico, debe salir de `Typography.tsx`.
- Si falta un token, se debe proponer una ampliaciÃ³n del sistema tipogrÃ¡fico, no improvisar clases locales.

### 3.3 Regla operativa para agentes
- Nunca crear jerarquÃ­as de texto ad hoc en pantallas nuevas.
- Toda pantalla o componente premium debe importar primero los tokens oficiales antes de escribir cualquier texto UI.
- La consistencia tipogrÃ¡fica es parte del contrato arquitectÃ³nico.

---

## 4. TopologÃ­a de Pantallas (El Contrato de Datos)

La topologÃ­a define quÃ© mÃ³dulos debe soportar la app y quÃ© bloques de informaciÃ³n son estructuralmente obligatorios. No es una maqueta cerrada, pero sÃ­ un contrato de producto.

### 4.1 Hoy
Pantalla diaria orientada a acciÃ³n inmediata y lectura rÃ¡pida.

Bloques esperados:
- Header dinÃ¡mico
- Calendario de rachas
- Lanzador de rutinas
- Dashboard Bento Box con innegociables:
  - proteÃ­na
  - calorÃ­as
  - sueÃ±o
  - pasos
- Resumen nutricional mini
- Modales de actividad libre

Principios:
- Debe sentirse viva, editorial y priorizada.
- La misiÃ³n del dÃ­a y los innegociables deben tener mÃ¡xima claridad.
- No convertir `Hoy` en una tabla aburrida de widgets idÃ©nticos.

### 4.2 NutriciÃ³n
Pantalla orientada a feedback continuo e impacto inmediato de decisiones alimentarias.

Bloques esperados:
- Dashboard de macros flexibles con `Arc Gauge`
- BitÃ¡cora del dÃ­a colapsable
- Navegador de fechas
- Creador de plato con:
  - buscador
  - escÃ¡ner IA
  - entrada manual
  - live feedback de impacto

Principios:
- Debe responder al dato y al contexto diario.
- La visualizaciÃ³n de macros no debe limitarse a barras genÃ©ricas.
- El creador de plato debe sentirse asistido, rÃ¡pido y tÃ¡ctil.

### 4.3 Biblioteca
Pantalla de exploraciÃ³n, construcciÃ³n y reutilizaciÃ³n de conocimiento fitness.

Bloques esperados:
- Recetas con `RecipeCardPremium`
- Base de datos de ejercicios
- Constructor de rutinas
- Planificador semanal con:
  - maÃ±ana
  - tarde
  - noche

Principios:
- Biblioteca no es un listado plano.
- Debe permitir descubrir, editar, guardar y recombinar contenido.
- Las tarjetas y flows deben priorizar claridad editorial y utilidad prÃ¡ctica.

### 4.4 Progreso
Pantalla enfocada en evoluciÃ³n visible, tendencia y narrativa de cambio.

Bloques esperados:
- Meta de peso
- GrÃ¡ficas:
  - fuerza
  - medidas
  - cardio
- Historial de sesiones
- GalerÃ­a de comparaciÃ³n visual

Principios:
- El progreso debe sentirse acumulativo y significativo.
- Las visualizaciones deben comunicar direcciÃ³n, no solo almacenar datos.
- La comparaciÃ³n visual debe tener un rol fuerte y emocional.

### 4.5 Rutina Activa (Focus Mode)
Modo inmersivo de ejecuciÃ³n con reducciÃ³n extrema de distracciÃ³n.

Fases esperadas:
- Pre-start
- Calentamiento con checklists
- Fuerza con:
  - steppers
  - tabs RIR
- Descanso con `CircularTimer`
- Resumen final

Principios:
- Toda la experiencia debe sentirse enfocada, tÃ¡ctil y decisiva.
- Los controles deben ser grandes, obvios y resistentes a error.
- Focus Mode debe tener coherencia visual total entre inicio, ejecuciÃ³n, descanso y cierre.

---

## Regla Final del Repositorio

Todo agente que produzca UI o arquitectura visual en este proyecto debe asumir lo siguiente:
- `APP_ARCHITECTURE.md` es la SSOT visual y estructural.
- `components/ui-premium/` es la base prioritaria para UI nueva.
- No se permite cÃ³digo genÃ©rico, estÃ©ticas por defecto ni decisiones visuales Â“de plantillaÂ”.
- Si una decisiÃ³n contradice este documento, debe considerarse incorrecta hasta que se actualice formalmente esta arquitectura.

