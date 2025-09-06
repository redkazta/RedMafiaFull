-- CONSULTA COMPLETA PARA OBTENER TODA LA INFORMACIÓN DE LA BASE DE DATOS
-- Ejecutar COMPLETA en Supabase SQL Editor

-- 1. INFORMACIÓN BÁSICA
SELECT 'INFORMACION_BASICA' as tipo, current_database() as valor1, current_user as valor2, version() as valor3;

-- 2. TODAS LAS TABLAS
SELECT 'TABLAS' as tipo, table_name as valor1, table_type as valor2, '' as valor3
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- 3. TODAS LAS COLUMNAS
SELECT 'COLUMNAS' as tipo, table_name as valor1, column_name as valor2, data_type as valor3
FROM information_schema.columns 
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;

-- 4. CONSTRAINTS
SELECT 'CONSTRAINTS' as tipo, tc.table_name as valor1, tc.constraint_type as valor2, kcu.column_name as valor3
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_schema = 'public'
ORDER BY tc.table_name;

-- 5. POLÍTICAS RLS
SELECT 'POLITICAS' as tipo, tablename as valor1, policyname as valor2, cmd as valor3
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename;

-- 6. FUNCIONES
SELECT 'FUNCIONES' as tipo, routine_name as valor1, routine_type as valor2, data_type as valor3
FROM information_schema.routines 
WHERE routine_schema = 'public'
ORDER BY routine_name;

-- 7. TRIGGERS
SELECT 'TRIGGERS' as tipo, event_object_table as valor1, trigger_name as valor2, event_manipulation as valor3
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
ORDER BY event_object_table;

-- 8. ÍNDICES
SELECT 'INDICES' as tipo, tablename as valor1, indexname as valor2, '' as valor3
FROM pg_indexes 
WHERE schemaname = 'public'
ORDER BY tablename;

-- 9. ESTADO RLS
SELECT 'ESTADO_RLS' as tipo, tablename as valor1, 
CASE WHEN rowsecurity THEN 'HABILITADO' ELSE 'DESHABILITADO' END as valor2, '' as valor3
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;
