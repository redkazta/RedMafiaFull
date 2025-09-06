-- DIAGNÓSTICO COMPLETO DE LOS PROBLEMAS
-- Ejecutar esto para ver exactamente qué está mal

-- =====================================================
-- 1. VER TODAS LAS POLÍTICAS ACTUALES
-- =====================================================

SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- =====================================================
-- 2. VER ESTRUCTURA DE user_addresses
-- =====================================================

SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'user_addresses'
ORDER BY ordinal_position;

-- =====================================================
-- 3. VER ESTADO RLS DE TODAS LAS TABLAS
-- =====================================================

SELECT
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('user_profiles', 'user_settings', 'user_activity_log', 'user_addresses', 'user_tokens')
ORDER BY tablename;

-- =====================================================
-- 4. PROBAR UNA INSERCIÓN MANUAL (después de desactivar RLS temporalmente)
-- =====================================================

-- Desactivar RLS temporalmente para diagnóstico
ALTER TABLE public.user_addresses DISABLE ROW LEVEL SECURITY;

-- Intentar insertar una dirección de prueba
INSERT INTO public.user_addresses (
    user_id,
    street,
    city,
    state,
    postal_code,
    country,
    is_active,
    address_line_1
) VALUES (
    '7972685f-06ac-4ffb-8442-c8bed2aa76f8',
    'Calle de Prueba 123',
    'Ciudad de Prueba',
    'Estado de Prueba',
    '12345',
    'México',
    true,
    'Calle de Prueba 123'
);

-- Ver si se insertó
SELECT * FROM public.user_addresses WHERE user_id = '7972685f-06ac-4ffb-8442-c8bed2aa76f8';

-- Reactivar RLS
ALTER TABLE public.user_addresses ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 5. VER USUARIO ACTUAL EN AUTH
-- =====================================================

SELECT
    id,
    email,
    created_at
FROM auth.users
WHERE id = '7972685f-06ac-4ffb-8442-c8bed2aa76f8';

-- =====================================================
-- 6. VER PERFIL DEL USUARIO
-- =====================================================

SELECT
    id,
    email,
    first_name,
    last_name
FROM public.user_profiles
WHERE id = '7972685f-06ac-4ffb-8442-c8bed2aa76f8';
