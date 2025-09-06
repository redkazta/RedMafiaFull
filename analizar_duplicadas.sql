-- ANALIZAR POLÍTICAS DUPLICADAS DE user_settings

-- =====================================================
-- VER DETALLES DE LAS POLÍTICAS DUPLICADAS
-- =====================================================

SELECT
    'DETALLE POLÍTICAS user_settings:' as info,
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'user_settings'
ORDER BY policyname;

-- =====================================================
-- VER QUÉ POLÍTICAS TIENE CADA TABLA
-- =====================================================

SELECT
    'POLÍTICAS POR TABLA:' as info,
    tablename,
    COUNT(*) as num_politicas,
    STRING_AGG(policyname, ', ') as nombres_politicas
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('user_profiles', 'user_tokens', 'shopping_cart', 'user_addresses', 'user_settings')
GROUP BY tablename
ORDER BY tablename;

-- =====================================================
-- RECOMENDACIÓN: ELIMINAR DUPLICADA
-- =====================================================

-- Si ambas políticas hacen lo mismo, elimina una
-- DROP POLICY IF EXISTS "user_settings_access" ON public.user_settings;

-- Verificar que solo queda una
-- SELECT 'POLÍTICA FINAL:' as info, policyname FROM pg_policies
-- WHERE schemaname = 'public' AND tablename = 'user_settings';
