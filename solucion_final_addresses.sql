-- SOLUCIÓN FINAL PARA user_addresses
-- Versión simplificada y probada

-- =====================================================
-- PASO 1: VERIFICAR POLÍTICAS ACTUALES
-- =====================================================

SELECT
    'POLÍTICAS ANTES:' as info,
    policyname,
    cmd
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'user_addresses'
ORDER BY policyname;

-- =====================================================
-- PASO 2: LIMPIAR POLÍTICAS CONFLICTIVAS
-- =====================================================

DROP POLICY IF EXISTS "user_addresses_access" ON public.user_addresses;
DROP POLICY IF EXISTS "user_addresses_policy" ON public.user_addresses;

-- =====================================================
-- PASO 3: CREAR POLÍTICA CORRECTA
-- =====================================================

CREATE POLICY "user_addresses_policy" ON public.user_addresses
FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- PASO 4: VERIFICAR ESTRUCTURA
-- =====================================================

SELECT
    'COLUMNAS DISPONIBLES:' as info,
    column_name
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'user_addresses'
ORDER BY ordinal_position;

-- =====================================================
-- PASO 5: PRUEBA SIMPLE (SIN INSERTAR)
-- =====================================================

-- Solo verificar que podemos consultar
SELECT
    'TEST CONSULTA:' as info,
    COUNT(*) as total_addresses
FROM public.user_addresses
WHERE user_id = auth.uid();

-- =====================================================
-- PASO 6: VERIFICACIÓN FINAL
-- =====================================================

SELECT
    'POLÍTICAS FINALES:' as info,
    policyname,
    cmd,
    qual
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'user_addresses'
ORDER BY policyname;

-- =====================================================
-- INSTRUCCIONES PARA EL USUARIO
-- =====================================================

/*
INSTRUCCIONES:

1. Ejecuta este script en Supabase SQL Editor
2. Ve a tu aplicación y prueba crear una nueva dirección
3. Si funciona, ¡problema resuelto!

El código de tu aplicación ya está usando user.id correctamente.
El problema estaba en los scripts de SQL que usaban UUIDs fijos.
*/
