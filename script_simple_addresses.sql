-- SCRIPT SIMPLE PARA user_addresses
-- Solución directa sin complicaciones

-- =====================================================
-- VERIFICAR POLÍTICAS EXISTENTES
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
-- ELIMINAR POLÍTICA CONFLICTIVA
-- =====================================================

DROP POLICY IF EXISTS "user_addresses_access" ON public.user_addresses;

-- =====================================================
-- CREAR POLÍTICA CORRECTA
-- =====================================================

CREATE POLICY "user_addresses_policy" ON public.user_addresses
FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- VERIFICAR POLÍTICAS DESPUÉS
-- =====================================================

SELECT
    'POLÍTICAS DESPUÉS:' as info,
    policyname,
    cmd
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'user_addresses'
ORDER BY policyname;

-- =====================================================
-- VERIFICAR ESTRUCTURA
-- =====================================================

SELECT
    'COLUMNAS DISPONIBLES:' as info,
    column_name
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'user_addresses'
ORDER BY ordinal_position;

-- =====================================================
-- CONTAR DIRECCIONES ACTUALES
-- =====================================================

SELECT
    'TOTAL DIRECCIONES ANTES:' as info,
    COUNT(*) as count
FROM public.user_addresses;
