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
-- CREAR POLÍTICAS LIMPIAS (CON VERIFICACIÓN)
-- =====================================================

-- Función para crear política si no existe
CREATE OR REPLACE FUNCTION create_policy_if_not_exists(
    policy_name TEXT,
    table_name TEXT,
    policy_sql TEXT
) RETURNS VOID AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = table_name
        AND policyname = policy_name
    ) THEN
        EXECUTE policy_sql;
        RAISE NOTICE 'Política creada: %', policy_name;
    ELSE
        RAISE NOTICE 'Política ya existe: %', policy_name;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Crear políticas usando la función
SELECT create_policy_if_not_exists(
    'user_profiles_policy',
    'user_profiles',
    'CREATE POLICY "user_profiles_policy" ON public.user_profiles FOR ALL TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id)'
);

SELECT create_policy_if_not_exists(
    'user_tokens_policy',
    'user_tokens',
    'CREATE POLICY "user_tokens_policy" ON public.user_tokens FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id)'
);

SELECT create_policy_if_not_exists(
    'shopping_cart_policy',
    'shopping_cart',
    'CREATE POLICY "shopping_cart_policy" ON public.shopping_cart FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id)'
);

SELECT create_policy_if_not_exists(
    'user_addresses_policy',
    'user_addresses',
    'CREATE POLICY "user_addresses_policy" ON public.user_addresses FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id)'
);

SELECT create_policy_if_not_exists(
    'user_settings_policy',
    'user_settings',
    'CREATE POLICY "user_settings_policy" ON public.user_settings FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id)'
);

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
