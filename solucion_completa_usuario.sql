-- SOLUCIÓN COMPLETA PARA USUARIO EXISTENTE
-- Resuelve todos los errores: 406, 409, foreign key, y conflictos de datos

-- =====================================================
-- PASO 1: DIAGNÓSTICO INICIAL
-- =====================================================

SELECT
    'USUARIO A REPARAR:' as info,
    '7972685f-06ac-4ffb-8442-c8bed2aa76f8' as user_id;

-- =====================================================
-- PASO 2: LIMPIEZA COMPLETA DE DATOS CONFLICTIVOS
-- =====================================================

-- Limpiar perfil conflictivo
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

-- =====================================================
-- PASO 3: LIMPIEZA DE TODAS LAS POLÍTICAS RLS
-- =====================================================

-- Políticas de user_profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_policy" ON public.user_profiles;

-- Políticas de user_tokens
DROP POLICY IF EXISTS "Users can view their own tokens" ON public.user_tokens;
DROP POLICY IF EXISTS "Users can update their own tokens" ON public.user_tokens;
DROP POLICY IF EXISTS "user_tokens_policy" ON public.user_tokens;

-- Políticas de shopping_cart
DROP POLICY IF EXISTS "Users can view their own cart" ON public.shopping_cart;
DROP POLICY IF EXISTS "Users can insert their own cart" ON public.shopping_cart;
DROP POLICY IF EXISTS "Users can update their own cart" ON public.shopping_cart;
DROP POLICY IF EXISTS "Users can delete their own cart" ON public.shopping_cart;
DROP POLICY IF EXISTS "shopping_cart_policy" ON public.shopping_cart;

-- Políticas de user_addresses
DROP POLICY IF EXISTS "Users can delete their own addresses" ON public.user_addresses;
DROP POLICY IF EXISTS "Users can insert their own addresses" ON public.user_addresses;
DROP POLICY IF EXISTS "Users can update their own addresses" ON public.user_addresses;
DROP POLICY IF EXISTS "Users can view their own addresses" ON public.user_addresses;
DROP POLICY IF EXISTS "user_addresses_policy" ON public.user_addresses;

-- Políticas de user_settings (por si acaso)
DROP POLICY IF EXISTS "Users can view their own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can update their own settings" ON public.user_settings;
DROP POLICY IF EXISTS "user_settings_policy" ON public.user_settings;

-- =====================================================
-- PASO 4: RECREAR POLÍTICAS RLS CORRECTAS
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

CREATE POLICY "user_settings_policy" ON public.user_settings
FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- PASO 5: VERIFICACIÓN FINAL
-- =====================================================

SELECT
    'DATOS ELIMINADOS:' as info,
    'Perfil, tokens, carrito y direcciones del usuario' as detalle;

SELECT
    'POLÍTICAS RECREADAS:' as info,
    COUNT(*) as total_policies
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('user_profiles', 'user_tokens', 'shopping_cart', 'user_addresses', 'user_settings');

-- =====================================================
-- INSTRUCCIONES PARA EL USUARIO
-- =====================================================

/*
INSTRUCCIONES:

1. Ejecuta este script COMPLETO en Supabase SQL Editor
2. Reinicia tu aplicación (cierra y vuelve a abrir)
3. Ve a la página principal - deberían desaparecer los errores 406 y 409
4. El React Error #418 ya fue corregido en el código

RESULTADO ESPERADO:
✅ Sin errores 406 (Not Acceptable)
✅ Sin errores 409 (Conflict)
✅ Sin errores de foreign key
✅ Sin React Error #418
✅ Autenticación funcionando correctamente
*/
