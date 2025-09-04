-- =====================================================
-- VERIFICAR COLUMNAS ESPECÍFICAS DE LAS TABLAS
-- =====================================================

-- Ver columnas de product_categories
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'product_categories'
ORDER BY ordinal_position;

-- Ver columnas de products  
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'products'
ORDER BY ordinal_position;
