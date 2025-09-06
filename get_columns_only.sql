-- CONSULTA PARA OBTENER SOLO LAS COLUMNAS (LO MÁS IMPORTANTE)
-- Ejecutar en Supabase SQL Editor

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
