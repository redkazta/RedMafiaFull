-- CONSULTA PARA VERIFICAR RELACIONES ENTRE TABLAS
-- Ejecuta esto para ver si existe la FK entre products y product_categories

-- 1. VER FOREIGN KEYS entre products y product_categories
SELECT
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    rc.update_rule,
    rc.delete_rule
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
JOIN information_schema.referential_constraints AS rc
  ON tc.constraint_name = rc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_schema = 'public'
AND ((tc.table_name = 'products' AND ccu.table_name = 'product_categories')
     OR (tc.table_name = 'product_categories' AND ccu.table_name = 'products'))
ORDER BY tc.table_name;

-- 2. VER ESTRUCTURA DE product_categories
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'product_categories'
ORDER BY ordinal_position;

-- 3. VER ESTRUCTURA DE products (solo campos relacionados con categorías)
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'products'
AND column_name LIKE '%category%'
ORDER BY ordinal_position;

-- 4. VER SI HAY DATOS EN product_categories
SELECT COUNT(*) as total_categories FROM product_categories;

-- 5. VER ALGUNOS EJEMPLOS DE DATOS
SELECT id, name FROM product_categories LIMIT 5;
