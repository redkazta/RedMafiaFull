-- LIMPIEZA TOTAL DE TODAS LAS POLÍTICAS RLS
-- Elimina absolutamente todas las políticas existentes

-- =====================================================
-- ELIMINAR TODAS LAS POLÍTICAS EXISTENTES (AGRESIVO)
-- =====================================================

-- Función para eliminar todas las políticas de una tabla
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    -- Eliminar políticas de user_profiles
    FOR policy_record IN
        SELECT policyname FROM pg_policies
        WHERE schemaname = 'public' AND tablename = 'user_profiles'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON public.user_profiles';
        RAISE NOTICE 'Dropped policy: % on user_profiles', policy_record.policyname;
    END LOOP;

    -- Eliminar políticas de user_tokens
    FOR policy_record IN
        SELECT policyname FROM pg_policies
        WHERE schemaname = 'public' AND tablename = 'user_tokens'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON public.user_tokens';
        RAISE NOTICE 'Dropped policy: % on user_tokens', policy_record.policyname;
    END LOOP;

    -- Eliminar políticas de shopping_cart
    FOR policy_record IN
        SELECT policyname FROM pg_policies
        WHERE schemaname = 'public' AND tablename = 'shopping_cart'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON public.shopping_cart';
        RAISE NOTICE 'Dropped policy: % on shopping_cart', policy_record.policyname;
    END LOOP;

    -- Eliminar políticas de user_addresses
    FOR policy_record IN
        SELECT policyname FROM pg_policies
        WHERE schemaname = 'public' AND tablename = 'user_addresses'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON public.user_addresses';
        RAISE NOTICE 'Dropped policy: % on user_addresses', policy_record.policyname;
    END LOOP;

    -- Eliminar políticas de user_settings
    FOR policy_record IN
        SELECT policyname FROM pg_policies
        WHERE schemaname = 'public' AND tablename = 'user_settings'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON public.user_settings';
        RAISE NOTICE 'Dropped policy: % on user_settings', policy_record.policyname;
    END LOOP;

END $$;

-- =====================================================
-- VERIFICAR QUE SE ELIMINARON TODAS
-- =====================================================

SELECT
    'POLÍTICAS RESTANTES:' as info,
    tablename,
    COUNT(*) as policies_count
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;

-- =====================================================
-- RECREAR POLÍTICAS LIMPIAS Y CORRECTAS
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
    cmd,
    qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
