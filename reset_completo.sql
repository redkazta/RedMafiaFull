-- RESET COMPLETO DE POLÍTICAS RLS
-- Ejecutar esto para solucionar todos los problemas de una vez

-- =====================================================
-- PASO 1: ELIMINAR TODAS LAS POLÍTICAS EXISTENTES
-- =====================================================

DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable all operations for authenticated users on their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Allow all for authenticated users" ON public.user_profiles;

DROP POLICY IF EXISTS "Users can view own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can insert own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can update own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Enable all operations for authenticated users on their own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Allow all for authenticated users" ON public.user_settings;

DROP POLICY IF EXISTS "Users can view own activity" ON public.user_activity_log;
DROP POLICY IF EXISTS "Users can insert own activity" ON public.user_activity_log;
DROP POLICY IF EXISTS "Enable all operations for authenticated users on their own activity" ON public.user_activity_log;
DROP POLICY IF EXISTS "Allow all for authenticated users" ON public.user_activity_log;

DROP POLICY IF EXISTS "Users can view own addresses" ON public.user_addresses;
DROP POLICY IF EXISTS "Users can insert own addresses" ON public.user_addresses;
DROP POLICY IF EXISTS "Users can update own addresses" ON public.user_addresses;
DROP POLICY IF EXISTS "Users can delete own addresses" ON public.user_addresses;
DROP POLICY IF EXISTS "Enable all operations for authenticated users on their own addresses" ON public.user_addresses;
DROP POLICY IF EXISTS "Allow all for authenticated users" ON public.user_addresses;

DROP POLICY IF EXISTS "Users can view own tokens" ON public.user_tokens;
DROP POLICY IF EXISTS "Users can update own tokens" ON public.user_tokens;
DROP POLICY IF EXISTS "Enable all operations for authenticated users on their own tokens" ON public.user_tokens;
DROP POLICY IF EXISTS "Allow all for authenticated users" ON public.user_tokens;

-- =====================================================
-- PASO 2: DESACTIVAR Y REACTIVAR RLS
-- =====================================================

ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_log DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_addresses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_tokens DISABLE ROW LEVEL SECURITY;

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_tokens ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PASO 3: CREAR POLÍTICAS SIMPLES QUE FUNCIONEN
-- =====================================================

-- Para usuarios autenticados - permitir todo en sus propios datos
CREATE POLICY "user_profiles_policy" ON public.user_profiles
FOR ALL TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "user_settings_policy" ON public.user_settings
FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_activity_log_policy" ON public.user_activity_log
FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_addresses_policy" ON public.user_addresses
FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_tokens_policy" ON public.user_tokens
FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- PASO 4: LIMPIAR DATOS PROBLEMÁTICOS (opcional)
-- =====================================================

-- Eliminar perfiles huérfanos (sin usuario correspondiente)
DELETE FROM public.user_profiles
WHERE id NOT IN (
    SELECT id FROM auth.users
);

-- Asegurar que el usuario tenga exactamente un perfil
DELETE FROM public.user_profiles
WHERE id = '4bdd6662-11ff-4346-9110-a6567826d840'
AND id IN (
    SELECT id
    FROM public.user_profiles
    WHERE id = '4bdd6662-11ff-4346-9110-a6567826d840'
    ORDER BY updated_at DESC
    OFFSET 1
);

-- =====================================================
-- PASO 5: VERIFICACIÓN
-- =====================================================

SELECT 'Políticas RLS creadas:' as status;
SELECT
    schemaname,
    tablename,
    policyname
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('user_profiles', 'user_settings', 'user_activity_log', 'user_addresses', 'user_tokens')
ORDER BY tablename;

SELECT 'Estado RLS:' as status;
SELECT
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('user_profiles', 'user_settings', 'user_activity_log', 'user_addresses', 'user_tokens')
ORDER BY tablename;

SELECT 'Perfil del usuario:' as status;
SELECT
    id,
    email,
    first_name,
    last_name
FROM public.user_profiles
WHERE id = '4bdd6662-11ff-4346-9110-a6567826d840';
