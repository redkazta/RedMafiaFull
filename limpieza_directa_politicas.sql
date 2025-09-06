-- LIMPIEZA DIRECTA DE POLÍTICAS RLS
-- Versión simple y directa sin funciones complejas

-- =====================================================
-- ELIMINAR POLÍTICAS CON NOMBRES CONOCIDOS
-- =====================================================

-- Políticas con nombres largos (de scripts anteriores)
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON public.user_profiles;

DROP POLICY IF EXISTS "Users can view their own tokens" ON public.user_tokens;
DROP POLICY IF EXISTS "Users can update their own tokens" ON public.user_tokens;

DROP POLICY IF EXISTS "Users can view their own cart" ON public.shopping_cart;
DROP POLICY IF EXISTS "Users can insert their own cart" ON public.shopping_cart;
DROP POLICY IF EXISTS "Users can update their own cart" ON public.shopping_cart;
DROP POLICY IF EXISTS "Users can delete their own cart" ON public.shopping_cart;

DROP POLICY IF EXISTS "Users can delete their own addresses" ON public.user_addresses;
DROP POLICY IF EXISTS "Users can insert their own addresses" ON public.user_addresses;
DROP POLICY IF EXISTS "Users can update their own addresses" ON public.user_addresses;
DROP POLICY IF EXISTS "Users can view their own addresses" ON public.user_addresses;

-- Políticas con nombres "_access" (duplicadas)
DROP POLICY IF EXISTS "user_profiles_access" ON public.user_profiles;
DROP POLICY IF EXISTS "user_tokens_access" ON public.user_tokens;
DROP POLICY IF EXISTS "user_addresses_access" ON public.user_addresses;

-- =====================================================
-- VERIFICAR ESTADO ACTUAL
-- =====================================================

SELECT
    'POLÍTICAS RESTANTES:' as info,
    tablename,
    policyname
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- =====================================================
-- CREAR POLÍTICAS CORRECTAS (SOLO SI NO EXISTEN)
-- =====================================================

-- Crear política de user_profiles si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = 'user_profiles'
        AND policyname = 'user_profiles_policy'
    ) THEN
        CREATE POLICY "user_profiles_policy" ON public.user_profiles
        FOR ALL TO authenticated
        USING (auth.uid() = id)
        WITH CHECK (auth.uid() = id);
        RAISE NOTICE 'Política user_profiles_policy creada';
    ELSE
        RAISE NOTICE 'Política user_profiles_policy ya existe';
    END IF;
END $$;

-- Crear política de user_tokens si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = 'user_tokens'
        AND policyname = 'user_tokens_policy'
    ) THEN
        CREATE POLICY "user_tokens_policy" ON public.user_tokens
        FOR ALL TO authenticated
        USING (auth.uid() = user_id)
        WITH CHECK (auth.uid() = user_id);
        RAISE NOTICE 'Política user_tokens_policy creada';
    ELSE
        RAISE NOTICE 'Política user_tokens_policy ya existe';
    END IF;
END $$;

-- Crear política de shopping_cart si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = 'shopping_cart'
        AND policyname = 'shopping_cart_policy'
    ) THEN
        CREATE POLICY "shopping_cart_policy" ON public.shopping_cart
        FOR ALL TO authenticated
        USING (auth.uid() = user_id)
        WITH CHECK (auth.uid() = user_id);
        RAISE NOTICE 'Política shopping_cart_policy creada';
    ELSE
        RAISE NOTICE 'Política shopping_cart_policy ya existe';
    END IF;
END $$;

-- Crear política de user_addresses si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = 'user_addresses'
        AND policyname = 'user_addresses_policy'
    ) THEN
        CREATE POLICY "user_addresses_policy" ON public.user_addresses
        FOR ALL TO authenticated
        USING (auth.uid() = user_id)
        WITH CHECK (auth.uid() = user_id);
        RAISE NOTICE 'Política user_addresses_policy creada';
    ELSE
        RAISE NOTICE 'Política user_addresses_policy ya existe';
    END IF;
END $$;

-- Crear política de user_settings si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = 'user_settings'
        AND policyname = 'user_settings_policy'
    ) THEN
        CREATE POLICY "user_settings_policy" ON public.user_settings
        FOR ALL TO authenticated
        USING (auth.uid() = user_id)
        WITH CHECK (auth.uid() = user_id);
        RAISE NOTICE 'Política user_settings_policy creada';
    ELSE
        RAISE NOTICE 'Política user_settings_policy ya existe';
    END IF;
END $$;

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
ORDER BY tablename, policyname;
