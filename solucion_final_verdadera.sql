-- SOLUCIÓN FINAL VERDADERA - Verifica y crea políticas correctamente

-- =====================================================
-- VERIFICACIÓN Y CREACIÓN INTELIGENTE
-- =====================================================

-- Verificar estado actual
SELECT 'ESTADO ACTUAL:' as info, COUNT(*) as politicas_existentes FROM pg_policies WHERE schemaname = 'public';

-- Función para verificar y crear política
CREATE OR REPLACE FUNCTION smart_create_policy(
    policy_name TEXT,
    table_name TEXT,
    policy_definition TEXT
) RETURNS TEXT AS $$
DECLARE
    policy_exists BOOLEAN;
BEGIN
    -- Verificar si existe
    SELECT EXISTS(
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = table_name
        AND policyname = policy_name
    ) INTO policy_exists;

    IF policy_exists THEN
        RETURN 'YA EXISTE: ' || policy_name;
    ELSE
        -- Crear la política
        EXECUTE policy_definition;
        RETURN 'CREADA: ' || policy_name;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- CREAR POLÍTICAS CON VERIFICACIÓN
-- =====================================================

SELECT smart_create_policy(
    'user_profiles_policy',
    'user_profiles',
    'CREATE POLICY "user_profiles_policy" ON public.user_profiles FOR ALL TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id)'
);

SELECT smart_create_policy(
    'user_tokens_policy',
    'user_tokens',
    'CREATE POLICY "user_tokens_policy" ON public.user_tokens FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id)'
);

SELECT smart_create_policy(
    'shopping_cart_policy',
    'shopping_cart',
    'CREATE POLICY "shopping_cart_policy" ON public.shopping_cart FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id)'
);

SELECT smart_create_policy(
    'user_addresses_policy',
    'user_addresses',
    'CREATE POLICY "user_addresses_policy" ON public.user_addresses FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id)'
);

SELECT smart_create_policy(
    'user_settings_policy',
    'user_settings',
    'CREATE POLICY "user_settings_policy" ON public.user_settings FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id)'
);

-- =====================================================
-- RESULTADO FINAL
-- =====================================================

SELECT
    'POLÍTICAS FINALES:' as info,
    tablename,
    policyname,
    cmd
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('user_profiles', 'user_tokens', 'shopping_cart', 'user_addresses', 'user_settings')
ORDER BY tablename;
