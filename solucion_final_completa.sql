-- SOLUCIÓN FINAL COMPLETA PARA TODOS LOS PROBLEMAS
-- Ejecutar esto en Supabase SQL Editor

-- =====================================================
-- PASO 1: ELIMINAR TODAS LAS POLÍTICAS EXISTENTES
-- =====================================================

-- Políticas de user_profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_policy" ON public.user_profiles;

-- Políticas de user_settings
DROP POLICY IF EXISTS "Users can view own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can insert own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can update own settings" ON public.user_settings;
DROP POLICY IF EXISTS "user_settings_policy" ON public.user_settings;

-- Políticas de user_activity_log
DROP POLICY IF EXISTS "Users can view own activity" ON public.user_activity_log;
DROP POLICY IF EXISTS "Users can insert own activity" ON public.user_activity_log;
DROP POLICY IF EXISTS "user_activity_log_policy" ON public.user_activity_log;

-- Políticas de user_addresses
DROP POLICY IF EXISTS "Users can view own addresses" ON public.user_addresses;
DROP POLICY IF EXISTS "Users can insert own addresses" ON public.user_addresses;
DROP POLICY IF EXISTS "Users can update own addresses" ON public.user_addresses;
DROP POLICY IF EXISTS "Users can delete own addresses" ON public.user_addresses;
DROP POLICY IF EXISTS "user_addresses_policy" ON public.user_addresses;

-- Políticas de user_tokens
DROP POLICY IF EXISTS "Users can view own tokens" ON public.user_tokens;
DROP POLICY IF EXISTS "Users can update own tokens" ON public.user_tokens;
DROP POLICY IF EXISTS "user_tokens_policy" ON public.user_tokens;

-- =====================================================
-- PASO 2: DESACTIVAR RLS TEMPORALMENTE
-- =====================================================

ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_log DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_addresses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_tokens DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- PASO 3: CORREGIR ESTRUCTURAS DE TABLAS
-- =====================================================

-- Agregar columnas faltantes a user_activity_log
ALTER TABLE public.user_activity_log
ADD COLUMN IF NOT EXISTS activity_type TEXT DEFAULT 'activity',
ADD COLUMN IF NOT EXISTS description TEXT;

-- Agregar columnas faltantes a user_addresses
ALTER TABLE public.user_addresses
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS address_line_1 TEXT,
ADD COLUMN IF NOT EXISTS address_line_2 TEXT,
ADD COLUMN IF NOT EXISTS recipient_name TEXT;

-- Recrear user_settings con estructura correcta
DROP TABLE IF EXISTS public.user_settings CASCADE;
CREATE TABLE public.user_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    setting_key TEXT NOT NULL,
    setting_value TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON public.user_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_settings_key ON public.user_settings(setting_key);

-- Agregar columnas faltantes a user_tokens
ALTER TABLE public.user_tokens
ADD COLUMN IF NOT EXISTS current_balance INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_earned INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_spent INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_transaction_at TIMESTAMP WITH TIME ZONE;

-- =====================================================
-- PASO 4: REACTIVAR RLS Y CREAR POLÍTICAS NUEVAS
-- =====================================================

-- Activar RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_tokens ENABLE ROW LEVEL SECURITY;

-- Crear políticas simples pero efectivas
CREATE POLICY "user_profiles_access" ON public.user_profiles
FOR ALL TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "user_settings_access" ON public.user_settings
FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_activity_log_access" ON public.user_activity_log
FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_addresses_access" ON public.user_addresses
FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_tokens_access" ON public.user_tokens
FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- PASO 5: LIMPIAR DATOS PROBLEMÁTICOS
-- =====================================================

-- Eliminar perfiles duplicados
DELETE FROM public.user_profiles a USING (
  SELECT MIN(ctid) as ctid, id
  FROM public.user_profiles
  GROUP BY id HAVING COUNT(*) > 1
) b
WHERE a.id = b.id
AND a.ctid <> b.ctid;

-- Asegurar que los usuarios tengan perfiles
INSERT INTO public.user_profiles (id, email, first_name, last_name, display_name)
SELECT
    u.id,
    u.email,
    COALESCE(u.raw_user_meta_data->>'first_name', ''),
    COALESCE(u.raw_user_meta_data->>'last_name', ''),
    COALESCE(u.raw_user_meta_data->>'display_name', u.email)
FROM auth.users u
LEFT JOIN public.user_profiles p ON u.id = p.id
WHERE p.id IS NULL;

-- Limpiar dirección de prueba del diagnóstico
DELETE FROM public.user_addresses
WHERE street = 'Calle de Prueba 123' AND user_id = '7972685f-06ac-4ffb-8442-c8bed2aa76f8';

-- =====================================================
-- PASO 6: VERIFICACIÓN FINAL
-- =====================================================

-- Verificar estructuras de tablas
SELECT
    'TABLA: ' || table_name as info,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name IN ('user_profiles', 'user_settings', 'user_activity_log', 'user_addresses', 'user_tokens')
ORDER BY table_name, ordinal_position;

-- Verificar políticas RLS
SELECT
    'POLÍTICA: ' || tablename as info,
    policyname,
    cmd
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('user_profiles', 'user_settings', 'user_activity_log', 'user_addresses', 'user_tokens')
ORDER BY tablename;

-- Verificar datos de ejemplo
SELECT 'PERFIL DEL USUARIO:' as info, id, email, first_name FROM public.user_profiles WHERE id = '7972685f-06ac-4ffb-8442-c8bed2aa76f8';
SELECT 'TOTAL DIRECCIONES:' as info, COUNT(*) as count FROM public.user_addresses WHERE user_id = '7972685f-06ac-4ffb-8442-c8bed2aa76f8';
