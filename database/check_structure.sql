-- =====================================================
-- VERIFICAR ESTRUCTURA DE TABLAS EN SUPABASE
-- =====================================================

-- Ver columnas de product_categories
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'product_categories'
ORDER BY ordinal_position;

-- Ver columnas de products  
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'products'
ORDER BY ordinal_position;

-- Ver todas las tablas que existen
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
