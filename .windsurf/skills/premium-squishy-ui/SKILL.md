---
name: premium-squishy-ui
description: Se activa EXCLUSIVAMENTE cuando el usuario solicita "aplicar diseno premium", "estandarizar UI", "aplicar squishy UI", "usar el UI kit" o "refactorizar diseno de pantalla". Interpreta esas solicitudes a traves del SSOT visual vigente y evita inventar reglas locales que contradigan UI_MANIFEST.md.
---

# Premium Squishy UI

## Proposito

Interpretar las solicitudes de UI premium usando exclusivamente el sistema vigente del proyecto, sin inventar recetas locales de Tailwind ni reintroducir primitives legacy.

## Reglas Estrictas

- **For UI implementation, ONLY consume components listed in UI_MANIFEST.md.**
- Si este skill y `UI_MANIFEST.md` entran en conflicto, `UI_MANIFEST.md` gana siempre.
- No prescribas clases raw para contenedores, tipografia, botones, tabs o modales cuando ya exista un componente oficial documentado.
- Usa unicamente los tokens, primitives y excepciones de valores arbitrarios toleradas por `UI_MANIFEST.md`.
- No revivas variantes legacy ni componentes fuera del inventario oficial para nuevas implementaciones de UI.

## Protocolo de Ejecucion

1. Lee `UI_MANIFEST.md` antes de proponer o implementar UI.
2. Ensambla la interfaz solo con componentes y tokens documentados.
3. Si falta un patron, propon actualizar `UI_MANIFEST.md` en lugar de inventar clases locales.
