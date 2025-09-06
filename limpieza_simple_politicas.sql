-- LIMPIEZA SIMPLE Y DIRECTA DE POLÍTICAS RLS
-- Método directo para eliminar todas las políticas

-- =====================================================
-- MÉTODO DIRECTO: DESACTIVAR Y REACTIVAR RLS
-- =====================================================

-- Desactivar RLS temporalmente en todas las tablas
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_tokens DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_cart DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_addresses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings DISABLE ROW LEVEL SECURITY;

-- Reactivar RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- VERIFICAR QUE NO HAY POLÍTICAS
-- =====================================================

SELECT
    'POLÍTICAS ANTES DE CREAR:' as info,
    COUNT(*) as total_policies
FROM pg_policies
WHERE schemaname = 'public';

-- =====================================================
-- CREAR POLÍTICAS LIMPIAS
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

-- =====================================================
-- VERIFICACIÓN FINAL
-- =====================================================

SELECT
    'POLÍTICAS FINALES:' as info,
    tablename,
    policyname,
    cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename;
