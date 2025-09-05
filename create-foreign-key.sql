-- SCRIPT PARA CREAR LA FOREIGN KEY ENTRE products Y product_categories
-- Ejecuta esto en el SQL Editor de Supabase si no existe la relación

-- Verificar si ya existe la foreign key
SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_name = 'products'
AND ccu.table_name = 'product_categories';

-- Si no existe, crear la foreign key
-- ALTER TABLE products
-- ADD CONSTRAINT fk_products_category_id
-- FOREIGN KEY (category_id)
-- REFERENCES product_categories(id)
-- ON DELETE SET NULL;

-- Verificar la estructura de product_categories para asegurarme de que tiene la columna 'id'
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'product_categories'
AND table_schema = 'public'
ORDER BY ordinal_position;
