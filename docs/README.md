# Documentacion del Proyecto

## Fuente vigente
- `README.md`: onboarding rapido, setup y scripts.
- `UI_MANIFEST.md`: SSOT visual y reglas de implementacion HUD 2026.
- `LOGIC_MANIFEST.md`: SSOT logico de hooks, controladores y contrato headless.
- `docs/active/PROJECT_OVERVIEW.md`: panorama actual de arquitectura, modulos y reglas practicas del repo.

## Archivo historico
- `docs/archive/APP_ARCHITECTURE.md`: arquitectura anterior archivada. No usar como referencia viva.
- `docs/archive/FRONTEND_REDESIGN_MASTER_PLAN.md`: plan anterior archivado. Su contrato definitivo vive ahora en `LOGIC_MANIFEST.md`.
- `docs/archive/APP_TOPOLOGY_2026-03-23.md`: snapshot de topologia y flujos generado en marzo de 2026. Sirve como contexto historico, no como fuente de verdad.

## Tooling
- `.windsurf/rules/frontend-anti-patterns.md`: reglas operativas para trabajo asistido por agentes.
- `.windsurf/skills/premium-squishy-ui/SKILL.md`: skill de tooling, no documentacion funcional del producto.

## Regla de uso
- Si una decision afecta el estado actual del repo, usa primero `README.md`, `UI_MANIFEST.md`, `LOGIC_MANIFEST.md` y luego `docs/active/`.
- Si necesitas contexto de auditorias pasadas, consulta `docs/archive/` sabiendo que puede estar desactualizado.
- No agregues nuevos Markdown en la raiz salvo que sean indispensables para el repositorio completo.
