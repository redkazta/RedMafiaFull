-- SOLO ARREGLAR POLÍTICAS DUPLICADAS
-- Si solo quieres arreglar el error de políticas duplicadas

-- =====================================================
-- ELIMINAR POLÍTICAS DUPLICADAS
-- =====================================================

-- Políticas duplicadas de user_profiles
DROP POLICY IF EXISTS "user_profiles_policy" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;

-- Políticas duplicadas de user_settings
DROP POLICY IF EXISTS "user_settings_policy" ON public.user_settings;

-- Políticas duplicadas de user_activity_log
DROP POLICY IF EXISTS "user_activity_log_policy" ON public.user_activity_log;

-- Políticas duplicadas de user_addresses
DROP POLICY IF EXISTS "user_addresses_policy" ON public.user_addresses;

-- Políticas duplicadas de user_tokens
DROP POLICY IF EXISTS "user_tokens_policy" ON public.user_tokens;

-- =====================================================
-- VERIFICACIÓN
-- =====================================================

SELECT 'Políticas restantes:' as status;
SELECT
    schemaname,
    tablename,
    policyname,
    cmd
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('user_profiles', 'user_settings', 'user_activity_log', 'user_addresses', 'user_tokens')
ORDER BY tablename;
