-- ELIMINAR POLÍTICAS DUPLICADAS QUE QUEDAN

-- =====================================================
-- ELIMINAR POLÍTICA DUPLICADA DE user_settings
-- =====================================================

DROP POLICY IF EXISTS "user_settings_access" ON public.user_settings;

-- =====================================================
-- VERIFICAR QUE SE ELIMINÓ
-- =====================================================

SELECT
    'POLÍTICAS user_settings DESPUÉS:' as info,
    policyname,
    cmd
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'user_settings';

-- =====================================================
-- VERIFICACIÓN COMPLETA FINAL
-- =====================================================

SELECT
    'POLÍTICAS FINALES (DEBEN SER SOLO 1 POR TABLA):' as info,
    tablename,
    policyname,
    cmd
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('user_profiles', 'user_tokens', 'shopping_cart', 'user_addresses', 'user_settings')
ORDER BY tablename, policyname;
