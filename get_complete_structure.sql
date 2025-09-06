-- =====================================================
-- CONSULTA COMPLETA PARA OBTENER TODA LA ESTRUCTURA DE SUPABASE
-- Ejecutar en Supabase SQL Editor
-- =====================================================

-- 1. INFORMACIÓN BÁSICA DE LA BASE DE DATOS
SELECT '=== INFORMACIÓN BÁSICA ===' as seccion;
SELECT 
    current_database() as database_name,
    current_user as current_user,
    version() as postgresql_version;

-- 2. TODAS LAS TABLAS EXISTENTES
SELECT '=== TABLAS EXISTENTES ===' as seccion;
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- 3. TODAS LAS COLUMNAS CON SUS TIPOS
SELECT '=== ESTRUCTURA DE COLUMNAS ===' as seccion;
SELECT 
    table_name,
    column_name,
    ordinal_position,
    column_default,
    is_nullable,
    data_type,
    character_maximum_length,
    numeric_precision,
    numeric_scale,
    udt_name
FROM information_schema.columns 
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;

-- 4. CLAVES PRIMARIAS Y FORÁNEAS
SELECT '=== CONSTRAINTS ===' as seccion;
SELECT 
    tc.table_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
LEFT JOIN information_schema.constraint_column_usage ccu 
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_schema = 'public'
    AND tc.constraint_type IN ('PRIMARY KEY', 'FOREIGN KEY')
ORDER BY tc.table_name, tc.constraint_type;

-- 5. POLÍTICAS RLS
SELECT '=== POLÍTICAS RLS ===' as seccion;
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 6. FUNCIONES Y PROCEDIMIENTOS
SELECT '=== FUNCIONES ===' as seccion;
SELECT 
    routine_name,
    routine_type,
    data_type
FROM information_schema.routines 
WHERE routine_schema = 'public'
ORDER BY routine_name;

-- 7. TRIGGERS
SELECT '=== TRIGGERS ===' as seccion;
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_timing
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- 8. ÍNDICES
SELECT '=== ÍNDICES ===' as seccion;
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- 9. SECUENCIAS
SELECT '=== SECUENCIAS ===' as seccion;
SELECT 
    sequence_name,
    data_type,
    start_value,
    minimum_value,
    maximum_value,
    increment,
    cycle_option
FROM information_schema.sequences 
WHERE sequence_schema = 'public'
ORDER BY sequence_name;

-- 10. ESTADO DE RLS POR TABLA
SELECT '=== ESTADO RLS ===' as seccion;
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled,
    CASE 
        WHEN rowsecurity THEN 'RLS habilitado'
        ELSE 'RLS deshabilitado'
    END as rls_status
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- 11. CONTEO DE REGISTROS
SELECT '=== CONTEO DE REGISTROS ===' as seccion;
SELECT 
    schemaname,
    tablename,
    n_live_tup as registros_activos,
    n_dead_tup as registros_eliminados
FROM pg_stat_user_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- 12. VERIFICAR TABLAS ESPECÍFICAS QUE PODRÍAN EXISTIR
SELECT '=== TABLAS ESPECÍFICAS ===' as seccion;
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public'
    AND table_name IN (
        'user_profiles', 
        'user_tokens', 
        'roles', 
        'user_roles',
        'user_settings',
        'products',
        'events',
        'music_tracks',
        'purchase_orders',
        'token_transactions',
        'user_addresses',
        'artist_profiles',
        'addresses',
        'wishlist',
        'wishlist_items'
    )
ORDER BY table_name;

-- 13. TIPOS DE DATOS DISPONIBLES
SELECT '=== TIPOS DE DATOS ===' as seccion;
SELECT 
    typname as type_name,
    typtype as type_category
FROM pg_type 
WHERE typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
    AND typtype IN ('b', 'c', 'd', 'e', 'r')
ORDER BY typname;
