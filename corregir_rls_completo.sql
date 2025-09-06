-- CORRECCIÓN COMPLETA DE POLÍTICAS RLS
-- Ejecutar esto en Supabase SQL Editor

-- =====================================================
-- PASO 1: ELIMINAR TODAS LAS POLÍTICAS EXISTENTES
-- =====================================================

-- Eliminar todas las políticas existentes para las tablas problemáticas
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can insert own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can update own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can view own activity" ON public.user_activity_log;
DROP POLICY IF EXISTS "Users can insert own activity" ON public.user_activity_log;
DROP POLICY IF EXISTS "Users can view own addresses" ON public.user_addresses;
DROP POLICY IF EXISTS "Users can insert own addresses" ON public.user_addresses;
DROP POLICY IF EXISTS "Users can update own addresses" ON public.user_addresses;
DROP POLICY IF EXISTS "Users can delete own addresses" ON public.user_addresses;
DROP POLICY IF EXISTS "Users can view own tokens" ON public.user_tokens;
DROP POLICY IF EXISTS "Users can update own tokens" ON public.user_tokens;

-- =====================================================
-- PASO 2: ASEGURAR QUE RLS ESTÉ ACTIVADO
-- =====================================================

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_tokens ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PASO 3: CREAR POLÍTICAS CORRECTAS PARA USUARIOS AUTENTICADOS
-- =====================================================

-- Políticas para user_profiles
CREATE POLICY "Enable all operations for authenticated users on their own profile"
ON public.user_profiles
FOR ALL
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Políticas para user_settings
CREATE POLICY "Enable all operations for authenticated users on their own settings"
ON public.user_settings
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Políticas para user_activity_log
CREATE POLICY "Enable all operations for authenticated users on their own activity"
ON public.user_activity_log
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Políticas para user_addresses
CREATE POLICY "Enable all operations for authenticated users on their own addresses"
ON public.user_addresses
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Políticas para user_tokens
CREATE POLICY "Enable all operations for authenticated users on their own tokens"
ON public.user_tokens
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- PASO 4: VERIFICACIÓN
-- =====================================================

-- Verificar que las políticas se crearon correctamente
SELECT
    schemaname,
    tablename,
    policyname,
    cmd,
    qual
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('user_profiles', 'user_settings', 'user_activity_log', 'user_addresses', 'user_tokens')
ORDER BY tablename, policyname;

-- Verificar estado RLS
SELECT
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('user_profiles', 'user_settings', 'user_activity_log', 'user_addresses', 'user_tokens')
ORDER BY tablename;
