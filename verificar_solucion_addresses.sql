-- VERIFICACIÓN FINAL DE user_addresses
-- Ejecutar después de limpiar_addresses_completo.sql

-- =====================================================
-- ESTADO ACTUAL DE POLÍTICAS
-- =====================================================

SELECT
    'POLÍTICAS ACTUALES:' as info,
    policyname,
    cmd,
    qual
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'user_addresses'
ORDER BY policyname;

-- =====================================================
-- ESTRUCTURA DE LA TABLA
-- =====================================================

SELECT
    'COLUMNAS DISPONIBLES:' as info,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'user_addresses'
ORDER BY ordinal_position;

-- =====================================================
-- CONTAR DIRECCIONES EXISTENTES
-- =====================================================

SELECT
    'TOTAL DIRECCIONES:' as info,
    COUNT(*) as count
FROM public.user_addresses;

-- =====================================================
-- PRUEBA DE CONSULTA CON AUTENTICACIÓN
-- =====================================================

SELECT
    'TEST DE AUTENTICACIÓN:' as info,
    COUNT(*) as user_addresses
FROM public.user_addresses
WHERE user_id = auth.uid();

-- =====================================================
-- RESULTADO ESPERADO DESPUÉS DE LIMPIEZA:
-- =====================================================
/*
Deberías ver:

1. Solo UNA política: "user_addresses_policy" con cmd = "ALL"
2. Columnas: id, user_id, street, city, state, postal_code, country, is_default, is_active, address_line_1, address_line_2, recipient_name, created_at, updated_at
3. Conteo de direcciones existente
4. Test de consulta sin errores

Si ves múltiples políticas o errores, vuelve a ejecutar limpiar_addresses_completo.sql
*/
