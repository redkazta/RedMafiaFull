-- =====================================================
-- ACTUALIZACIÓN PARA AGREGAR PRECIOS USD A PRODUCTOS
-- =====================================================

-- Agregar columna price_usd si no existe
ALTER TABLE products ADD COLUMN IF NOT EXISTS price_usd DECIMAL(10,2);

-- Actualizar productos existentes con precios USD (conversión aproximada: 1 token = $0.05 USD)
UPDATE products 
SET price_usd = ROUND((price_tokens * 0.05)::numeric, 2)
WHERE price_usd IS NULL;

-- Insertar algunos productos de ejemplo si no existen
INSERT INTO products (
  name, 
  slug, 
  description, 
  category_id, 
  price_tokens, 
  price_usd,
  main_image_url,
  stock_quantity,
  is_featured
) 
SELECT 
  'Camiseta Red Mafia Classic',
  'camiseta-red-mafia-classic',
  'Camiseta oficial de Red Mafia con diseño clásico. 100% algodón.',
  (SELECT id FROM product_categories WHERE slug = 'ropa' LIMIT 1),
  400,
  19.99,
  '/images/products/camiseta-classic.jpg',
  50,
  true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'camiseta-red-mafia-classic')

UNION ALL

SELECT 
  'Hoodie Red Mafia Premium',
  'hoodie-red-mafia-premium',
  'Hoodie premium con capucha y logo bordado. Perfecto para el invierno.',
  (SELECT id FROM product_categories WHERE slug = 'ropa' LIMIT 1),
  800,
  39.99,
  '/images/products/hoodie-premium.jpg',
  30,
  true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'hoodie-red-mafia-premium')

UNION ALL

SELECT 
  'Gorra Red Mafia Snapback',
  'gorra-red-mafia-snapback',
  'Gorra snapback ajustable con logo bordado en 3D.',
  (SELECT id FROM product_categories WHERE slug = 'accesorios' LIMIT 1),
  300,
  14.99,
  '/images/products/gorra-snapback.jpg',
  75,
  false
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'gorra-red-mafia-snapback')

UNION ALL

SELECT 
  'Beat Pack Vol. 1',
  'beat-pack-vol-1',
  'Colección de 10 beats exclusivos producidos por artistas de Red Mafia.',
  (SELECT id FROM product_categories WHERE slug = 'musica' LIMIT 1),
  600,
  29.99,
  '/images/products/beat-pack-1.jpg',
  999,
  true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'beat-pack-vol-1')

UNION ALL

SELECT 
  'Pulsera Red Mafia Limited',
  'pulsera-red-mafia-limited',
  'Pulsera de edición limitada con cadena de acero inoxidable.',
  (SELECT id FROM product_categories WHERE slug = 'accesorios' LIMIT 1),
  200,
  9.99,
  '/images/products/pulsera-limited.jpg',
  25,
  false
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'pulsera-red-mafia-limited');

-- Verificar que los productos se insertaron correctamente
SELECT 
  name,
  price_tokens,
  price_usd,
  (SELECT name FROM product_categories WHERE id = category_id) as category
FROM products 
ORDER BY created_at DESC 
LIMIT 10;