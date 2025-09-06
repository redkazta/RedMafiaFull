-- DIAGNÓSTICO COMPLETO DEL USUARIO ACTUAL
-- Para resolver los errores 406, 409 y foreign key

-- =====================================================
-- 1. VERIFICAR USUARIO EN auth.users
-- =====================================================

SELECT
    'USUARIO EN AUTH:' as info,
    id as user_id,
    email,
    created_at,
    last_sign_in_at
FROM auth.users
WHERE id = '7972685f-06ac-4ffb-8442-c8bed2aa76f8';

-- =====================================================
-- 2. VERIFICAR DATOS EXISTENTES DEL USUARIO
-- =====================================================

-- Perfil existente
SELECT
    'PERFIL EXISTENTE:' as info,
    id,
    email,
    first_name,
    last_name,
    created_at
FROM public.user_profiles
WHERE id = '7972685f-06ac-4ffb-8442-c8bed2aa76f8';

-- Tokens existentes
SELECT
    'TOKENS EXISTENTES:' as info,
    id,
    user_id,
    current_balance,
    created_at
FROM public.user_tokens
WHERE user_id = '7972685f-06ac-4ffb-8442-c8bed2aa76f8';

-- Carrito existente
SELECT
    'CARRITO EXISTENTE:' as info,
    id,
    user_id,
    created_at
FROM public.shopping_cart
WHERE user_id = '7972685f-06ac-4ffb-8442-c8bed2aa76f8';

-- =====================================================
-- 3. VERIFICAR POLÍTICAS RLS ACTUALES
-- =====================================================

SELECT
    'POLÍTICAS RLS:' as info,
    schemaname,
    tablename,
    policyname,
    cmd,
    qual
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('user_profiles', 'user_tokens', 'shopping_cart', 'user_addresses')
ORDER BY tablename, policyname;

-- =====================================================
-- 4. LIMPIEZA DE DATOS CONFLICTIVOS (OPCIONAL)
-- =====================================================

-- DESCOMENTA ESTAS LÍNEAS SI QUIERES LIMPIAR LOS DATOS CONFLICTIVOS:
/*
-- Limpiar perfil duplicado/conflictivo
DELETE FROM public.user_profiles
WHERE id = '7972685f-06ac-4ffb-8442-c8bed2aa76f8';

-- Limpiar tokens conflictivos
DELETE FROM public.user_tokens
WHERE user_id = '7972685f-06ac-4ffb-8442-c8bed2aa76f8';

-- Limpiar carrito conflictivo
DELETE FROM public.shopping_cart
WHERE user_id = '7972685f-06ac-4ffb-8442-c8bed2aa76f8';

-- Limpiar direcciones conflictivas
DELETE FROM public.user_addresses
WHERE user_id = '7972685f-06ac-4ffb-8442-c8bed2aa76f8';
*/

-- =====================================================
-- 5. RECREAR POLÍTICAS RLS CORRECTAS
-- =====================================================

-- Limpiar políticas existentes
DROP POLICY IF EXISTS "user_profiles_policy" ON public.user_profiles;
DROP POLICY IF EXISTS "user_tokens_policy" ON public.user_tokens;
DROP POLICY IF EXISTS "shopping_cart_policy" ON public.shopping_cart;
DROP POLICY IF EXISTS "user_addresses_policy" ON public.user_addresses;

-- Recrear políticas correctas
CREATE POLICY "user_profiles_policy" ON public.user_profiles
FOR ALL TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "user_tokens_policy" ON public.user_tokens
FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "shopping_cart_policy" ON public.shopping_cart
FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_addresses_policy" ON public.user_addresses
FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- 6. VERIFICACIÓN FINAL
-- =====================================================

SELECT
    'POLÍTICAS FINALES:' as info,
    tablename,
    policyname,
    cmd
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('user_profiles', 'user_tokens', 'shopping_cart', 'user_addresses')
ORDER BY tablename;
