-- ============================================================================
-- RLS SECURITY LOCKDOWN — Fitness App
-- ============================================================================
-- Autor:   Cascade (generado para auditoría humana)
-- Fecha:   2026-04-01
-- Estado:  PENDIENTE DE APROBACIÓN — NO EJECUTAR SIN REVISIÓN
-- ============================================================================
--
-- CONTEXTO:
--   Las tablas routines, recipes, user_state, foods, exercises tienen RLS
--   desactivado y son de acceso público. Este script:
--     1. Habilita RLS en las 5 tablas.
--     2. Aplica políticas estrictas basadas en auth.uid().
--     3. Separa tablas privadas (user_state, routines) de catálogos globales
--        (exercises, foods, recipes).
--
-- SUPUESTOS:
--   - Todas las tablas privadas tienen columna `user_id` de tipo UUID
--     vinculada a auth.users(id).
--   - Las tablas de catálogo global (exercises, foods, recipes) son de
--     lectura pública para usuarios autenticados.
--   - No existe un rol de administrador formal todavía; las escrituras
--     en catálogos globales se bloquean hasta que se implemente.
--
-- ============================================================================


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║  PASO 1: HABILITAR ROW LEVEL SECURITY EN TODAS LAS TABLAS             ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

-- Activa RLS. Tras esto, NINGUNA fila es accesible sin una política explícita.
-- Esto es un "deny-all" por defecto: si no hay policy, no hay acceso.

ALTER TABLE public.user_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routines  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foods     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes   ENABLE ROW LEVEL SECURITY;


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║  PASO 2: POLÍTICAS PARA TABLAS PRIVADAS (user_state, routines)         ║
-- ║  Regla: Un usuario SOLO accede a SUS PROPIAS filas.                    ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

-- ── user_state ──────────────────────────────────────────────────────────────

-- SELECT: El usuario solo puede leer su propio estado.
CREATE POLICY "user_state: select own rows"
  ON public.user_state
  FOR SELECT
  TO authenticated                              -- Solo usuarios logueados
  USING (user_id = auth.uid());                 -- Filtro: tu fila o nada

-- INSERT: El usuario solo puede insertar filas con su propio user_id.
CREATE POLICY "user_state: insert own rows"
  ON public.user_state
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());            -- Previene inyectar user_id ajeno

-- UPDATE: El usuario solo puede modificar sus propias filas.
CREATE POLICY "user_state: update own rows"
  ON public.user_state
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())                  -- Solo puede apuntar a sus filas
  WITH CHECK (user_id = auth.uid());            -- No puede cambiar user_id a otro

-- DELETE: El usuario solo puede eliminar sus propias filas.
CREATE POLICY "user_state: delete own rows"
  ON public.user_state
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());                 -- Solo sus filas son eliminables


-- ── routines ────────────────────────────────────────────────────────────────

-- SELECT: El usuario solo puede leer sus propias rutinas.
CREATE POLICY "routines: select own rows"
  ON public.routines
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- INSERT: El usuario solo puede crear rutinas bajo su propio user_id.
CREATE POLICY "routines: insert own rows"
  ON public.routines
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- UPDATE: El usuario solo puede modificar sus propias rutinas.
CREATE POLICY "routines: update own rows"
  ON public.routines
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- DELETE: El usuario solo puede eliminar sus propias rutinas.
CREATE POLICY "routines: delete own rows"
  ON public.routines
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║  PASO 3: POLÍTICAS PARA CATÁLOGOS GLOBALES (exercises, foods, recipes) ║
-- ║  Regla: Lectura pública para autenticados. Escritura BLOQUEADA.        ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

-- ── exercises ───────────────────────────────────────────────────────────────

-- SELECT: Cualquier usuario autenticado puede leer el catálogo de ejercicios.
CREATE POLICY "exercises: public read for authenticated"
  ON public.exercises
  FOR SELECT
  TO authenticated                              -- Anónimos NO pueden leer
  USING (true);                                 -- Todas las filas visibles

-- INSERT/UPDATE/DELETE: BLOQUEADO.
-- No se crean políticas de escritura. Con RLS habilitado y sin policy de
-- INSERT/UPDATE/DELETE, cualquier intento de escritura será denegado.
--
-- FUTURO: Cuando implementes un rol admin, añade:
--   CREATE POLICY "exercises: admin write"
--     ON public.exercises
--     FOR ALL
--     TO authenticated
--     USING (auth.jwt() ->> 'role' = 'admin')
--     WITH CHECK (auth.jwt() ->> 'role' = 'admin');


-- ── foods ───────────────────────────────────────────────────────────────────

-- SELECT: Cualquier usuario autenticado puede leer el catálogo de alimentos.
CREATE POLICY "foods: public read for authenticated"
  ON public.foods
  FOR SELECT
  TO authenticated
  USING (true);

-- INSERT/UPDATE/DELETE: BLOQUEADO (mismo principio que exercises).
-- Sin policy = sin acceso de escritura.
--
-- FUTURO: Política de admin análoga a exercises.


-- ── recipes ─────────────────────────────────────────────────────────────────

-- SELECT: Cualquier usuario autenticado puede leer el catálogo de recetas.
CREATE POLICY "recipes: public read for authenticated"
  ON public.recipes
  FOR SELECT
  TO authenticated
  USING (true);

-- INSERT/UPDATE/DELETE: BLOQUEADO (mismo principio que exercises).
-- Sin policy = sin acceso de escritura.
--
-- FUTURO: Política de admin análoga a exercises.


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║  PASO 4: VERIFICACIÓN POST-APLICACIÓN                                 ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

-- Ejecuta esta query DESPUÉS de aplicar las migraciones para confirmar
-- que RLS está habilitado en todas las tablas críticas:
--
--   SELECT
--     schemaname,
--     tablename,
--     rowsecurity
--   FROM pg_tables
--   WHERE schemaname = 'public'
--     AND tablename IN ('user_state', 'routines', 'exercises', 'foods', 'recipes')
--   ORDER BY tablename;
--
-- Resultado esperado: rowsecurity = true para las 5 tablas.
--
-- Para listar las políticas activas:
--
--   SELECT
--     schemaname,
--     tablename,
--     policyname,
--     permissive,
--     roles,
--     cmd,
--     qual,
--     with_check
--   FROM pg_policies
--   WHERE schemaname = 'public'
--     AND tablename IN ('user_state', 'routines', 'exercises', 'foods', 'recipes')
--   ORDER BY tablename, policyname;


-- ============================================================================
-- FIN DEL SCRIPT — PENDIENTE DE APROBACIÓN HUMANA
-- ============================================================================
