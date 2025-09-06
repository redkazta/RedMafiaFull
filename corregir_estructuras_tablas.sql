-- CORREGIR ESTRUCTURAS DE TABLAS PARA QUE COINCIDAN CON EL CÓDIGO

-- =====================================================
-- 1. Corregir user_activity_log
-- =====================================================

-- Agregar columnas faltantes a user_activity_log
ALTER TABLE public.user_activity_log
ADD COLUMN IF NOT EXISTS activity_type TEXT,
ADD COLUMN IF NOT EXISTS description TEXT;

-- Verificar que se agregaron las columnas
SELECT column_name FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'user_activity_log'
ORDER BY ordinal_position;

-- =====================================================
-- 2. Corregir user_addresses
-- =====================================================

-- Agregar columnas faltantes a user_addresses
ALTER TABLE public.user_addresses
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS address_line_1 TEXT,
ADD COLUMN IF NOT EXISTS address_line_2 TEXT,
ADD COLUMN IF NOT EXISTS recipient_name TEXT;

-- Verificar que se agregaron las columnas
SELECT column_name FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'user_addresses'
ORDER BY ordinal_position;

-- =====================================================
-- 3. Corregir user_settings
-- =====================================================

-- Ver estructura actual de user_settings
SELECT column_name FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'user_settings'
ORDER BY ordinal_position;

-- Si la estructura es diferente, recrear la tabla
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

-- =====================================================
-- 4. Corregir user_tokens
-- =====================================================

-- Ver estructura actual de user_tokens
SELECT column_name FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'user_tokens'
ORDER BY ordinal_position;

-- Asegurar que tenga las columnas correctas
ALTER TABLE public.user_tokens
ADD COLUMN IF NOT EXISTS current_balance INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_earned INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_spent INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_transaction_at TIMESTAMP WITH TIME ZONE;

-- =====================================================
-- 5. Reactivar RLS y crear políticas
-- =====================================================

-- Activar RLS en todas las tablas
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_tokens ENABLE ROW LEVEL SECURITY;

-- Crear políticas simples
CREATE POLICY "user_profiles_policy" ON public.user_profiles
FOR ALL TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "user_settings_policy" ON public.user_settings
FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_activity_log_policy" ON public.user_activity_log
FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_addresses_policy" ON public.user_addresses
FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_tokens_policy" ON public.user_tokens
FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- 6. Verificación final
-- =====================================================

-- Verificar todas las estructuras
SELECT
    t.table_name,
    c.column_name,
    c.data_type,
    c.is_nullable
FROM information_schema.tables t
LEFT JOIN information_schema.columns c ON t.table_name = c.table_name AND t.table_schema = c.table_schema
WHERE t.table_schema = 'public'
AND t.table_name IN ('user_profiles', 'user_settings', 'user_activity_log', 'user_addresses', 'user_tokens')
ORDER BY t.table_name, c.ordinal_position;

-- Verificar políticas RLS
SELECT
    schemaname,
    tablename,
    policyname,
    cmd
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('user_profiles', 'user_settings', 'user_activity_log', 'user_addresses', 'user_tokens')
ORDER BY tablename;
