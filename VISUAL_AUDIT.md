# Visual Audit

## Objetivo
Definir un estandar visual premium y consistente para la app, tomando como referencia la guia de tendencias de diseno compartida y el estado actual del repositorio.

## Direccion Buscada
- La app debe sentirse precisa, estable y tactil.
- La jerarquia visual debe ser inequívoca: una accion principal por pantalla, acciones secundarias claras y utilitarios discretos.
- Los componentes equivalentes deben verse y comportarse igual en toda la app.
- El contraste debe ser confiable en light y dark mode, sin depender de hardcodes `white`/`black`.

## Hallazgos Principales
- Habia demasiados botones hechos a mano fuera de [Button.tsx](/D:/07.%20Apps/Fitness/components/Button.tsx).
- Filtros, chips y tags usaban estilos distintos entre si, aunque cumplian funciones parecidas.
- Varias cards mezclaban radios y tratamientos de superficie distintos sin una razon semantica.
- Habia hover states con poca consistencia visual y algunos contrastes fragiles.

## Estandar Adoptado

### Botones
- `primary`: CTA principal, alto contraste y peso visual dominante.
- `secondary`: accion clara sobre superficie.
- `ghost`: accion utilitaria o de bajo peso.
- `outline`: accion secundaria con enfasis moderado.
- `destructive`: accion irreversible.
- `icon-only`: icon button del sistema, no estilos locales improvisados.

### Chips
- `ChipButton` es la base para filtros, tabs y selecciones contextuales.
- Altura, padding, tracking y radio estables.
- Estado activo consistente y semantico.

### Tags
- `Tag` es la base para estados, categorias y overlays.
- No deben parecer CTA si no son interactivos.
- La variante `overlay` se reserva para badges sobre imagen o media.

### Superficies
- Cards y widgets deben tender a `rounded-2xl`.
- `rounded-3xl` queda reservado solo para casos excepcionales.
- La diferencia entre superficies debe venir de borde, sombra y contexto, no de mezclar tratamientos aleatorios.

## Cambios Aplicados En Esta Ronda
- Se reforzo el primitive de botones en [Button.tsx](/D:/07.%20Apps/Fitness/components/Button.tsx) y se alineo el foreground del color de marca desde [tailwind.config.cjs](/D:/07.%20Apps/Fitness/tailwind.config.cjs).
- Se adoptaron [ChipButton.tsx](/D:/07.%20Apps/Fitness/components/ChipButton.tsx), [Tag.tsx](/D:/07.%20Apps/Fitness/components/Tag.tsx) e [IconButton.tsx](/D:/07.%20Apps/Fitness/components/IconButton.tsx) como primitives compartidos.
- Se normalizaron selectores y estados en:
  - [ProgressChart.tsx](/D:/07.%20Apps/Fitness/components/charts/ProgressChart.tsx)
  - [CarreraChart.tsx](/D:/07.%20Apps/Fitness/components/charts/CarreraChart.tsx)
  - [StrengthChart.tsx](/D:/07.%20Apps/Fitness/components/charts/StrengthChart.tsx)
  - [ProgressGallery.tsx](/D:/07.%20Apps/Fitness/screens/progreso/ProgressGallery.tsx)
  - [ExerciseViews.tsx](/D:/07.%20Apps/Fitness/screens/biblioteca/ExerciseViews.tsx)
  - [RecipeViews.tsx](/D:/07.%20Apps/Fitness/screens/biblioteca/RecipeViews.tsx)
  - [RecipePreviewCard.tsx](/D:/07.%20Apps/Fitness/components/cards/RecipePreviewCard.tsx)
  - [RoutineCard.tsx](/D:/07.%20Apps/Fitness/components/cards/RoutineCard.tsx)
  - [ProgressWidgetsGrid.tsx](/D:/07.%20Apps/Fitness/components/ProgressWidgetsGrid.tsx)
  - [Hoy.tsx](/D:/07.%20Apps/Fitness/screens/Hoy.tsx)

## Pendientes
- Modal dialogs todavia tienen estilos locales y contraste inconsistente en varios flujos.
- Algunas pantallas de rutina activa y nutricion siguen usando botones y tags ad hoc.
- Conviene migrar mas acciones de cabecera y toolbars a `IconButton`.
- Hace falta una segunda pasada para homogenizar formularios e inputs mas alla de los casos ya tocados.

## Checklist De Revision
- Dos acciones equivalentes deben compartir variante, altura y radio.
- Ningun hover debe perder legibilidad.
- Ninguna pantalla debe tener mas de un CTA dominante.
- Chips, tags y botones deben distinguirse por funcion, no solo por color.
- Cards del mismo nivel deben compartir padding, radio y borde.
