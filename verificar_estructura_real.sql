-- VERIFICAR ESTRUCTURA REAL DE LAS TABLAS EN SUPABASE

-- =====================================================
-- 1. Ver todas las tablas disponibles
-- =====================================================
SELECT
    schemaname,
    tablename,
    tableowner
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- =====================================================
-- 2. Ver estructura completa de cada tabla
-- =====================================================

-- user_profiles
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'user_profiles'
ORDER BY ordinal_position;

-- user_settings
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'user_settings'
ORDER BY ordinal_position;

-- user_activity_log
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'user_activity_log'
ORDER BY ordinal_position;

-- user_addresses
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'user_addresses'
ORDER BY ordinal_position;

-- user_tokens
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'user_tokens'
ORDER BY ordinal_position;

-- =====================================================
-- 3. Ver datos de ejemplo de cada tabla
-- =====================================================

-- Ver si hay datos en user_profiles
SELECT COUNT(*) as total_profiles FROM public.user_profiles;

-- Ver si hay datos en user_addresses
SELECT COUNT(*) as total_addresses FROM public.user_addresses;

-- Ver si hay datos en user_tokens
SELECT COUNT(*) as total_tokens FROM public.user_tokens;

-- Ver si hay datos en user_settings
SELECT COUNT(*) as total_settings FROM public.user_settings;

-- Ver si hay datos en user_activity_log
SELECT COUNT(*) as total_activities FROM public.user_activity_log;

-- =====================================================
-- 4. Ver políticas RLS actuales
-- =====================================================
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
