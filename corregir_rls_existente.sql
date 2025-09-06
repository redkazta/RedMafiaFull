-- CORREGIR POLÍTICAS RLS EXISTENTES
-- Para las políticas que ya existen pero pueden estar mal configuradas

-- =====================================================
-- ELIMINAR POLÍTICAS CON NOMBRES DIFERENTES
-- =====================================================

-- Políticas de user_addresses (con nombres diferentes)
DROP POLICY IF EXISTS "Users can view their own addresses" ON public.user_addresses;
DROP POLICY IF EXISTS "Users can insert their own addresses" ON public.user_addresses;
DROP POLICY IF EXISTS "Users can update their own addresses" ON public.user_addresses;
DROP POLICY IF EXISTS "Users can delete their own addresses" ON public.user_addresses;

-- Políticas de user_tokens (con nombres diferentes)
DROP POLICY IF EXISTS "Users can view their own tokens" ON public.user_tokens;
DROP POLICY IF EXISTS "Users can update their own tokens" ON public.user_tokens;

-- =====================================================
-- CREAR POLÍTICAS CON NOMBRES CORRECTOS
-- =====================================================

-- Políticas para user_addresses
CREATE POLICY "user_addresses_access" ON public.user_addresses
FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Políticas para user_tokens
CREATE POLICY "user_tokens_access" ON public.user_tokens
FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- VERIFICACIÓN
-- =====================================================

SELECT
    'POLÍTICAS FINALES:' as info,
    tablename,
    policyname,
    cmd
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('user_addresses', 'user_tokens')
ORDER BY tablename, policyname;
