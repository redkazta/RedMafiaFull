-- LIMPIEZA DE CONFLICTOS PARA USUARIO ESPECÍFICO
-- Soluciona errores 406, 409 y foreign key

-- =====================================================
-- LIMPIEZA DE DATOS CONFLICTIVOS
-- =====================================================

-- 1. Limpiar perfil conflictivo
DELETE FROM public.user_profiles
WHERE id = '7972685f-06ac-4ffb-8442-c8bed2aa76f8';

-- 2. Limpiar tokens conflictivos
DELETE FROM public.user_tokens
WHERE user_id = '7972685f-06ac-4ffb-8442-c8bed2aa76f8';

-- 3. Limpiar carrito conflictivo
DELETE FROM public.shopping_cart
WHERE user_id = '7972685f-06ac-4ffb-8442-c8bed2aa76f8';

-- 4. Limpiar direcciones conflictivas
DELETE FROM public.user_addresses
WHERE user_id = '7972685f-06ac-4ffb-8442-c8bed2aa76f8';

-- =====================================================
-- LIMPIEZA DE POLÍTICAS CONFLICTIVAS
-- =====================================================

-- Eliminar todas las políticas existentes
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_policy" ON public.user_profiles;

DROP POLICY IF EXISTS "Users can view their own tokens" ON public.user_tokens;
DROP POLICY IF EXISTS "Users can update their own tokens" ON public.user_tokens;
DROP POLICY IF EXISTS "user_tokens_policy" ON public.user_tokens;

DROP POLICY IF EXISTS "Users can view their own cart" ON public.shopping_cart;
DROP POLICY IF EXISTS "Users can insert their own cart" ON public.shopping_cart;
DROP POLICY IF EXISTS "Users can update their own cart" ON public.shopping_cart;
DROP POLICY IF EXISTS "Users can delete their own cart" ON public.shopping_cart;
DROP POLICY IF EXISTS "shopping_cart_policy" ON public.shopping_cart;

DROP POLICY IF EXISTS "Users can delete their own addresses" ON public.user_addresses;
DROP POLICY IF EXISTS "Users can insert their own addresses" ON public.user_addresses;
DROP POLICY IF EXISTS "Users can update their own addresses" ON public.user_addresses;
DROP POLICY IF EXISTS "Users can view their own addresses" ON public.user_addresses;
DROP POLICY IF EXISTS "user_addresses_policy" ON public.user_addresses;

-- =====================================================
-- RECREAR POLÍTICAS CORRECTAS
-- =====================================================

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
-- VERIFICACIÓN
-- =====================================================

SELECT
    'DATOS ELIMINADOS:' as info,
    'Usuario: 7972685f-06ac-4ffb-8442-c8bed2aa76f8' as detalle;

SELECT
    'POLÍTICAS RECREADAS:' as info,
    COUNT(*) as total_policies
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('user_profiles', 'user_tokens', 'shopping_cart', 'user_addresses');
