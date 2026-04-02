-- ============================================================================
-- MIGRACIÓN MAESTRA — Arquitectura Híbrida + RLS
-- ============================================================================
-- Archivo:  002_hybrid_architecture_rls_master.sql
-- Autor:    Cascade (generado para auditoría humana)
-- Fecha:    2026-04-01
-- Estado:   PENDIENTE DE APROBACIÓN — NO EJECUTAR SIN REVISIÓN
-- ============================================================================
--
-- RESUMEN DE CAMBIOS:
--
--   SECCIÓN 1 — Catálogos híbridos (foods, exercises, recipes)
--               Añade user_id + is_global para permitir ítems globales y
--               creaciones privadas del usuario en la misma tabla.
--
--   SECCIÓN 2 — Tablas transaccionales (5 nuevas)
--               meal_logs, workout_logs, body_metrics, progress_gallery,
--               user_goals. Todas con id UUID, user_id y created_at.
--
--   SECCIÓN 3 — ENABLE ROW LEVEL SECURITY (10 tablas en total)
--
--   SECCIÓN 4 — Políticas RLS
--               • Catálogos híbridos: lectura de globales + propios;
--                 escritura únicamente sobre ítems propios no-globales.
--               • Tablas privadas: acceso 100% restringido a auth.uid().
--
-- SUPUESTOS:
--   - Las tablas foods, exercises, recipes, user_state y routines ya existen.
--   - Todas las tablas nuevas son creadas con IF NOT EXISTS (seguro de re-run).
--   - Los ALTER TABLE usan ADD COLUMN IF NOT EXISTS (idempotente).
--   - Las políticas usan DROP POLICY IF EXISTS antes de CREATE POLICY
--     para garantizar idempotencia sin dejar duplicados.
--   - No se usa DROP TABLE en ningún momento.
--
-- ============================================================================


-- ============================================================================
-- SECCIÓN 1: EVOLUCIÓN DE CATÁLOGOS HÍBRIDOS
-- ============================================================================
--
-- Modelo híbrido:
--   is_global = true   → Ítem del catálogo global (gestionado por el equipo).
--                         user_id puede ser NULL en este caso.
--   is_global = false  → Ítem creado por el usuario. user_id DEBE estar
--                         presente y apuntar al usuario creador.
--
-- Regla de negocio: Los ítems globales son inmutables para los usuarios.
--                   Cada usuario puede crear sus propios ítems personalizados.
-- ============================================================================

-- ── foods ────────────────────────────────────────────────────────────────────

-- Columna para identificar al usuario creador (NULL si es ítem global).
ALTER TABLE public.foods
  ADD COLUMN IF NOT EXISTS user_id UUID
    REFERENCES auth.users(id) ON DELETE CASCADE;

-- Columna que distingue ítems del catálogo global de creaciones privadas.
ALTER TABLE public.foods
  ADD COLUMN IF NOT EXISTS is_global BOOLEAN NOT NULL DEFAULT false;

-- ── exercises ────────────────────────────────────────────────────────────────

ALTER TABLE public.exercises
  ADD COLUMN IF NOT EXISTS user_id UUID
    REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.exercises
  ADD COLUMN IF NOT EXISTS is_global BOOLEAN NOT NULL DEFAULT false;

-- ── recipes ──────────────────────────────────────────────────────────────────

ALTER TABLE public.recipes
  ADD COLUMN IF NOT EXISTS user_id UUID
    REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.recipes
  ADD COLUMN IF NOT EXISTS is_global BOOLEAN NOT NULL DEFAULT false;

-- ── routines ─────────────────────────────────────────────────────────────────
-- CORRECCIÓN: routines.id es TEXT y la tabla no tiene columna user_id.
-- Se añade user_id UUID para vincular cada rutina a su propietario.
-- No se añade is_global porque routines ya tiene isUserCreated (boolean).

ALTER TABLE public.routines
  ADD COLUMN IF NOT EXISTS user_id UUID
    REFERENCES auth.users(id) ON DELETE CASCADE;


-- ============================================================================
-- SECCIÓN 2: CREACIÓN DE TABLAS TRANSACCIONALES PRIVADAS
-- ============================================================================
--
-- Patrón común a todas las tablas:
--   id         → UUID PRIMARY KEY autogenerado.
--   user_id    → FK NOT NULL a auth.users(id). El propietario del registro.
--   created_at → Timestamp automático de creación (UTC).
-- ============================================================================

-- ── meal_logs ─────────────────────────────────────────────────────────────────
-- Registra cada ingesta: a qué hora, qué comida o receta y en qué cantidad.
-- food_id y recipe_id son mutuamente excluyentes (uno de los dos es NULL).
CREATE TABLE IF NOT EXISTS public.meal_logs (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

  date        DATE        NOT NULL,                   -- Día del registro
  meal_type   TEXT        NOT NULL,                   -- 'desayuno' | 'almuerzo' | 'cena' | 'snack'
  -- CORRECCIÓN 42804: foods.id y recipes.id son TEXT, no UUID.
  food_id     TEXT        REFERENCES public.foods(id) ON DELETE SET NULL,
  recipe_id   TEXT        REFERENCES public.recipes(id) ON DELETE SET NULL,
  amount      NUMERIC     NOT NULL                    -- Gramos o unidades según el ítem
);

-- ── workout_logs ──────────────────────────────────────────────────────────────
-- Bitácora de sesiones de entrenamiento completadas o en progreso.
CREATE TABLE IF NOT EXISTS public.workout_logs (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),

  date         DATE        NOT NULL,                  -- Día del entrenamiento
  -- CORRECCIÓN 42804: routines.id es TEXT, no UUID.
  routine_id   TEXT        REFERENCES public.routines(id) ON DELETE SET NULL,
  duration_min INT,                                   -- Duración real en minutos (puede ser NULL si no finalizó)
  notes        TEXT                                   -- Observaciones libres del usuario
);

-- ── body_metrics ──────────────────────────────────────────────────────────────
-- Medidas corporales periódicas para seguimiento de composición corporal.
CREATE TABLE IF NOT EXISTS public.body_metrics (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),

  date          DATE        NOT NULL,                 -- Día de la medición
  weight_kg     NUMERIC,                              -- Peso en kg (puede omitirse)
  body_fat_pct  NUMERIC                               -- % grasa corporal (puede omitirse)
);

-- ── progress_gallery ──────────────────────────────────────────────────────────
-- Galería fotográfica de progreso personal.
CREATE TABLE IF NOT EXISTS public.progress_gallery (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

  date        DATE        NOT NULL,                   -- Fecha asociada a la foto
  image_url   TEXT        NOT NULL                    -- URL del objeto en Supabase Storage
);

-- ── user_goals ────────────────────────────────────────────────────────────────
-- Metas nutricionales y corporales activas del usuario.
-- Se puede registrar un historial de metas a lo largo del tiempo.
CREATE TABLE IF NOT EXISTS public.user_goals (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),

  target_calories   INT,                              -- Objetivo calórico diario (kcal)
  target_protein    INT,                              -- Objetivo proteína diaria (g)
  target_carbs      INT,                              -- Objetivo carbohidratos diarios (g)
  target_fat        INT,                              -- Objetivo grasas diarias (g)
  target_weight_kg  NUMERIC                           -- Peso objetivo (kg)
);


-- ============================================================================
-- SECCIÓN 3: HABILITAR ROW LEVEL SECURITY (10 TABLAS)
-- ============================================================================
--
-- Con RLS habilitado, el comportamiento es "deny-all" por defecto.
-- NINGUNA fila es accesible hasta que una política explícita lo permita.
-- ============================================================================

-- Catálogos híbridos
ALTER TABLE public.foods             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes           ENABLE ROW LEVEL SECURITY;

-- Tablas privadas preexistentes
ALTER TABLE public.user_state        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routines          ENABLE ROW LEVEL SECURITY;

-- Tablas transaccionales nuevas
ALTER TABLE public.meal_logs         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_logs      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.body_metrics      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_gallery  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_goals        ENABLE ROW LEVEL SECURITY;


-- ============================================================================
-- SECCIÓN 4: POLÍTICAS RLS
-- ============================================================================


-- ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──
-- 4A. CATÁLOGOS HÍBRIDOS (foods, exercises, recipes)
--
--     Reglas de acceso:
--       SELECT  → Puede leer si el ítem es global (is_global = true)
--                 O si el usuario es el creador (user_id = auth.uid()).
--       INSERT  → Solo sobre ítems propios (user_id = auth.uid()
--                 Y is_global debe ser false — nadie crea globales).
--       UPDATE  → Solo sobre ítems propios no-globales.
--       DELETE  → Solo sobre ítems propios no-globales.
-- ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──

-- ── foods ────────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "foods: select global or own"    ON public.foods;
DROP POLICY IF EXISTS "foods: insert own non-global"   ON public.foods;
DROP POLICY IF EXISTS "foods: update own non-global"   ON public.foods;
DROP POLICY IF EXISTS "foods: delete own non-global"   ON public.foods;

-- Lectura: ítem del catálogo global O creado por el usuario autenticado.
CREATE POLICY "foods: select global or own"
  ON public.foods
  FOR SELECT
  TO authenticated
  USING (
    is_global = true                 -- Catálogo global visible para todos
    OR user_id = auth.uid()          -- Ítems propios del usuario
  );

-- Inserción: el usuario puede añadir sus propios alimentos,
--            pero NO puede crear ítems marcados como globales.
CREATE POLICY "foods: insert own non-global"
  ON public.foods
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid()             -- Debe ser el propietario
    AND is_global = false            -- No puede autoproclamar un ítem como global
  );

-- Actualización: solo sobre sus propios ítems y no sobre los globales.
CREATE POLICY "foods: update own non-global"
  ON public.foods
  FOR UPDATE
  TO authenticated
  USING (
    user_id = auth.uid()             -- Apunta solo a sus propias filas
    AND is_global = false            -- No puede tocar ítems globales
  )
  WITH CHECK (
    user_id = auth.uid()             -- No puede cambiar el propietario
    AND is_global = false            -- No puede promover a global
  );

-- Eliminación: solo sus propios ítems no-globales.
CREATE POLICY "foods: delete own non-global"
  ON public.foods
  FOR DELETE
  TO authenticated
  USING (
    user_id = auth.uid()
    AND is_global = false
  );


-- ── exercises ────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "exercises: select global or own"   ON public.exercises;
DROP POLICY IF EXISTS "exercises: insert own non-global"  ON public.exercises;
DROP POLICY IF EXISTS "exercises: update own non-global"  ON public.exercises;
DROP POLICY IF EXISTS "exercises: delete own non-global"  ON public.exercises;

CREATE POLICY "exercises: select global or own"
  ON public.exercises
  FOR SELECT
  TO authenticated
  USING (is_global = true OR user_id = auth.uid());

CREATE POLICY "exercises: insert own non-global"
  ON public.exercises
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid() AND is_global = false);

CREATE POLICY "exercises: update own non-global"
  ON public.exercises
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() AND is_global = false)
  WITH CHECK (user_id = auth.uid() AND is_global = false);

CREATE POLICY "exercises: delete own non-global"
  ON public.exercises
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid() AND is_global = false);


-- ── recipes ──────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "recipes: select global or own"   ON public.recipes;
DROP POLICY IF EXISTS "recipes: insert own non-global"  ON public.recipes;
DROP POLICY IF EXISTS "recipes: update own non-global"  ON public.recipes;
DROP POLICY IF EXISTS "recipes: delete own non-global"  ON public.recipes;

CREATE POLICY "recipes: select global or own"
  ON public.recipes
  FOR SELECT
  TO authenticated
  USING (is_global = true OR user_id = auth.uid());

CREATE POLICY "recipes: insert own non-global"
  ON public.recipes
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid() AND is_global = false);

CREATE POLICY "recipes: update own non-global"
  ON public.recipes
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() AND is_global = false)
  WITH CHECK (user_id = auth.uid() AND is_global = false);

CREATE POLICY "recipes: delete own non-global"
  ON public.recipes
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid() AND is_global = false);


-- ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──
-- 4B. TABLAS PRIVADAS (user_state, routines, meal_logs, workout_logs,
--                      body_metrics, progress_gallery, user_goals)
--
--     Regla única: user_id = auth.uid() en TODAS las operaciones.
--     Nadie puede ver, modificar ni eliminar datos ajenos.
-- ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──

-- ── user_state ───────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "user_state: select own"  ON public.user_state;
DROP POLICY IF EXISTS "user_state: insert own"  ON public.user_state;
DROP POLICY IF EXISTS "user_state: update own"  ON public.user_state;
DROP POLICY IF EXISTS "user_state: delete own"  ON public.user_state;

-- CORRECCIÓN: user_state.user_id es tipo TEXT (no UUID).
-- auth.uid() devuelve UUID. Se requiere cast explícito ::text para evitar
-- error de tipo en la comparación. PostgreSQL no castea UUID→TEXT implícitamente en RLS.
CREATE POLICY "user_state: select own"
  ON public.user_state FOR SELECT TO authenticated
  USING (user_id = auth.uid()::text);

CREATE POLICY "user_state: insert own"
  ON public.user_state FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "user_state: update own"
  ON public.user_state FOR UPDATE TO authenticated
  USING (user_id = auth.uid()::text) WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "user_state: delete own"
  ON public.user_state FOR DELETE TO authenticated
  USING (user_id = auth.uid()::text);


-- ── routines ─────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "routines: select own"  ON public.routines;
DROP POLICY IF EXISTS "routines: insert own"  ON public.routines;
DROP POLICY IF EXISTS "routines: update own"  ON public.routines;
DROP POLICY IF EXISTS "routines: delete own"  ON public.routines;

CREATE POLICY "routines: select own"
  ON public.routines FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "routines: insert own"
  ON public.routines FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "routines: update own"
  ON public.routines FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "routines: delete own"
  ON public.routines FOR DELETE TO authenticated
  USING (user_id = auth.uid());


-- ── meal_logs ────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "meal_logs: select own"  ON public.meal_logs;
DROP POLICY IF EXISTS "meal_logs: insert own"  ON public.meal_logs;
DROP POLICY IF EXISTS "meal_logs: update own"  ON public.meal_logs;
DROP POLICY IF EXISTS "meal_logs: delete own"  ON public.meal_logs;

CREATE POLICY "meal_logs: select own"
  ON public.meal_logs FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "meal_logs: insert own"
  ON public.meal_logs FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "meal_logs: update own"
  ON public.meal_logs FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "meal_logs: delete own"
  ON public.meal_logs FOR DELETE TO authenticated
  USING (user_id = auth.uid());


-- ── workout_logs ─────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "workout_logs: select own"  ON public.workout_logs;
DROP POLICY IF EXISTS "workout_logs: insert own"  ON public.workout_logs;
DROP POLICY IF EXISTS "workout_logs: update own"  ON public.workout_logs;
DROP POLICY IF EXISTS "workout_logs: delete own"  ON public.workout_logs;

CREATE POLICY "workout_logs: select own"
  ON public.workout_logs FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "workout_logs: insert own"
  ON public.workout_logs FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "workout_logs: update own"
  ON public.workout_logs FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "workout_logs: delete own"
  ON public.workout_logs FOR DELETE TO authenticated
  USING (user_id = auth.uid());


-- ── body_metrics ─────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "body_metrics: select own"  ON public.body_metrics;
DROP POLICY IF EXISTS "body_metrics: insert own"  ON public.body_metrics;
DROP POLICY IF EXISTS "body_metrics: update own"  ON public.body_metrics;
DROP POLICY IF EXISTS "body_metrics: delete own"  ON public.body_metrics;

CREATE POLICY "body_metrics: select own"
  ON public.body_metrics FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "body_metrics: insert own"
  ON public.body_metrics FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "body_metrics: update own"
  ON public.body_metrics FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "body_metrics: delete own"
  ON public.body_metrics FOR DELETE TO authenticated
  USING (user_id = auth.uid());


-- ── progress_gallery ─────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "progress_gallery: select own"  ON public.progress_gallery;
DROP POLICY IF EXISTS "progress_gallery: insert own"  ON public.progress_gallery;
DROP POLICY IF EXISTS "progress_gallery: update own"  ON public.progress_gallery;
DROP POLICY IF EXISTS "progress_gallery: delete own"  ON public.progress_gallery;

CREATE POLICY "progress_gallery: select own"
  ON public.progress_gallery FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "progress_gallery: insert own"
  ON public.progress_gallery FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "progress_gallery: update own"
  ON public.progress_gallery FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "progress_gallery: delete own"
  ON public.progress_gallery FOR DELETE TO authenticated
  USING (user_id = auth.uid());


-- ── user_goals ───────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "user_goals: select own"  ON public.user_goals;
DROP POLICY IF EXISTS "user_goals: insert own"  ON public.user_goals;
DROP POLICY IF EXISTS "user_goals: update own"  ON public.user_goals;
DROP POLICY IF EXISTS "user_goals: delete own"  ON public.user_goals;

CREATE POLICY "user_goals: select own"
  ON public.user_goals FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "user_goals: insert own"
  ON public.user_goals FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "user_goals: update own"
  ON public.user_goals FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "user_goals: delete own"
  ON public.user_goals FOR DELETE TO authenticated
  USING (user_id = auth.uid());


-- ============================================================================
-- SECCIÓN 5: QUERIES DE VERIFICACIÓN (ejecutar DESPUÉS de aplicar)
-- ============================================================================

-- 1. Confirmar que RLS está activo en las 10 tablas:
--
--   SELECT tablename, rowsecurity
--   FROM pg_tables
--   WHERE schemaname = 'public'
--     AND tablename IN (
--       'foods', 'exercises', 'recipes',
--       'user_state', 'routines',
--       'meal_logs', 'workout_logs', 'body_metrics',
--       'progress_gallery', 'user_goals'
--     )
--   ORDER BY tablename;
--
-- Resultado esperado: rowsecurity = true en las 10 filas.


-- 2. Listar todas las políticas activas:
--
--   SELECT tablename, policyname, cmd, qual, with_check
--   FROM pg_policies
--   WHERE schemaname = 'public'
--     AND tablename IN (
--       'foods', 'exercises', 'recipes',
--       'user_state', 'routines',
--       'meal_logs', 'workout_logs', 'body_metrics',
--       'progress_gallery', 'user_goals'
--     )
--   ORDER BY tablename, cmd, policyname;
--
-- Resultado esperado:
--   • 4 políticas por tabla híbrida (foods, exercises, recipes)  → 12 total
--   • 4 políticas por tabla privada (7 tablas)                   → 28 total
--   • TOTAL: 40 políticas activas


-- 3. Verificar columnas añadidas a los catálogos híbridos:
--
--   SELECT table_name, column_name, data_type, is_nullable, column_default
--   FROM information_schema.columns
--   WHERE table_schema = 'public'
--     AND table_name IN ('foods', 'exercises', 'recipes')
--     AND column_name IN ('user_id', 'is_global')
--   ORDER BY table_name, column_name;
--
-- Resultado esperado: 6 filas (2 columnas × 3 tablas).


-- ============================================================================
-- FIN DE MIGRACIÓN — PENDIENTE DE APROBACIÓN HUMANA
-- ============================================================================
