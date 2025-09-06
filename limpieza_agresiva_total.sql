-- LIMPIEZA AGRESIVA TOTAL DE TODAS LAS POLÍTICAS RLS
-- Método nuclear: eliminar TODO y recrear solo lo necesario

-- =====================================================
-- PASO 1: DESACTIVAR RLS EN TODAS LAS TABLAS
-- =====================================================

ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_tokens DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_cart DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_addresses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_log DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- PASO 2: REACTIVAR RLS LIMPIO
-- =====================================================

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_log ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PASO 3: VERIFICAR QUE NO HAY POLÍTICAS
-- =====================================================

SELECT
    'POLÍTICAS ELIMINADAS:' as info,
    COUNT(*) as total_eliminadas
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('user_profiles', 'user_tokens', 'shopping_cart', 'user_addresses', 'user_settings', 'user_activity_log');

-- =====================================================
-- PASO 4: CREAR SOLO LAS POLÍTICAS ESENCIALES
-- =====================================================

CREATE POLICY "user_profiles_policy" ON public.user_profiles
FOR ALL TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "user_tokens_policy" ON public.user_tokens
FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "shopping_cart_policy" ON public.shopping_cart
FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_addresses_policy" ON public.user_addresses
FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_settings_policy" ON public.user_settings
FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_activity_log_policy" ON public.user_activity_log
FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- PASO 5: VERIFICACIÓN FINAL
-- =====================================================

SELECT
    'POLÍTICAS FINALES (SOLO LAS ESENCIALES):' as info,
    tablename,
    policyname,
    cmd
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('user_profiles', 'user_tokens', 'shopping_cart', 'user_addresses', 'user_settings', 'user_activity_log')
ORDER BY tablename;
