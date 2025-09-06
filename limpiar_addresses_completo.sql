-- LIMPIEZA COMPLETA DE user_addresses
-- Elimina TODAS las políticas y crea una sola limpia

-- =====================================================
-- PASO 1: VER POLÍTICAS ANTES DE LIMPIAR
-- =====================================================

SELECT
    'POLÍTICAS ANTES:' as info,
    policyname,
    cmd,
    qual
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'user_addresses'
ORDER BY policyname;

-- =====================================================
-- PASO 2: ELIMINAR TODAS LAS POLÍTICAS EXISTENTES
-- =====================================================

-- Intentar eliminar cada política individualmente
DROP POLICY IF EXISTS "Users can view their own addresses" ON public.user_addresses;
DROP POLICY IF EXISTS "Users can insert their own addresses" ON public.user_addresses;
DROP POLICY IF EXISTS "Users can update their own addresses" ON public.user_addresses;
DROP POLICY IF EXISTS "Users can delete their own addresses" ON public.user_addresses;
DROP POLICY IF EXISTS "user_addresses_access" ON public.user_addresses;
DROP POLICY IF EXISTS "user_addresses_policy" ON public.user_addresses;

-- =====================================================
-- PASO 3: VERIFICAR QUE SE ELIMINARON
-- =====================================================

SELECT
    'POLÍTICAS DESPUÉS DE DROP:' as info,
    COUNT(*) as remaining_policies
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'user_addresses';

-- =====================================================
-- PASO 4: CREAR POLÍTICA ÚNICA Y LIMPIA
-- =====================================================

CREATE POLICY "user_addresses_policy" ON public.user_addresses
FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- PASO 5: VERIFICACIÓN FINAL
-- =====================================================

SELECT
    'POLÍTICA FINAL:' as info,
    policyname,
    cmd,
    qual
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'user_addresses'
ORDER BY policyname;

-- =====================================================
-- PASO 6: PRUEBA DE FUNCIONAMIENTO
-- =====================================================

SELECT
    'TEST DE CONSULTA:' as info,
    COUNT(*) as total_addresses
FROM public.user_addresses
WHERE user_id = auth.uid();
