-- VERIFICACIÓN COMPLETA DE user_addresses
-- Para diagnosticar problemas con el guardado

-- =====================================================
-- 1. ESTRUCTURA DE LA TABLA
-- =====================================================

SELECT
    'ESTRUCTURA DE user_addresses:' as info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'user_addresses'
ORDER BY ordinal_position;

-- =====================================================
-- 2. POLÍTICAS ACTIVAS
-- =====================================================

SELECT
    'POLÍTICAS ACTIVAS:' as info,
    policyname,
    cmd,
    qual
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'user_addresses';

-- =====================================================
-- 3. DIRECCIONES EXISTENTES
-- =====================================================

SELECT
    'DIRECCIONES EXISTENTES:' as info,
    COUNT(*) as total_addresses
FROM public.user_addresses;

-- =====================================================
-- 4. PRUEBA DE INSERCIÓN MANUAL
-- =====================================================

-- Insertar dirección de prueba
INSERT INTO public.user_addresses (
    user_id,
    street,
    city,
    state,
    postal_code,
    country,
    is_default
) VALUES (
    '7972685f-06ac-4ffb-8442-c8bed2aa76f8',
    'Calle de Prueba 123',
    'Ciudad de Prueba',
    'Estado de Prueba',
    '12345',
    'México',
    false
) ON CONFLICT DO NOTHING;

-- Verificar inserción
SELECT
    'DIRECCIÓN INSERTADA:' as info,
    id,
    user_id,
    street,
    city
FROM public.user_addresses
WHERE street = 'Calle de Prueba 123'
ORDER BY created_at DESC
LIMIT 1;

-- =====================================================
-- 5. LIMPIEZA DE PRUEBA
-- =====================================================

DELETE FROM public.user_addresses
WHERE street = 'Calle de Prueba 123';

SELECT
    'LIMPIEZA COMPLETADA:' as info,
    COUNT(*) as addresses_after_cleanup
FROM public.user_addresses;
