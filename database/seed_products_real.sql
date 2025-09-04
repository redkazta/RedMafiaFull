-- =====================================================
-- LA RED MAFIA - SEED PRODUCTS REAL STRUCTURE
-- =====================================================
-- Basado en la estructura REAL de Supabase
-- =====================================================

-- PASO 1: Insertar categorías (necesitamos ver qué columnas tiene product_categories)
-- Por ahora insertamos básico
INSERT INTO product_categories (name, description) VALUES
('Ropa', 'Ropa y accesorios cyberpunk'),
('Música', 'Álbumes, beats y música digital');

-- PASO 2: Insertar productos usando la estructura REAL
-- Columnas obligatorias: name (NOT NULL), price (NOT NULL), price_tokens (NOT NULL)
INSERT INTO products (
  name, 
  description, 
  price, 
  price_tokens, 
  category_id, 
  image_url, 
  stock_quantity, 
  is_active
) VALUES
(
  'Red Mafia Hoodie Cyberpunk',
  'Hoodie exclusivo con diseño cyberpunk de la Red Mafia. Edición limitada con bordados LED y materiales premium.',
  59.99,
  1200,
  (SELECT id FROM product_categories WHERE name = 'Ropa' LIMIT 1),
  'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=500&fit=crop&crop=center',
  25,
  true
),
(
  'Álbum Digital Underground Kings',
  'Álbum completo en formato digital con tracks exclusivos de la Red Mafia. Incluye bonus tracks y artwork digital.',
  14.99,
  300,
  (SELECT id FROM product_categories WHERE name = 'Música' LIMIT 1),
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=500&fit=crop&crop=center',
  999,
  true
),
(
  'Gorra Neon Dreams',
  'Gorra con bordado LED que brilla en la oscuridad. Diseño cyberpunk único con batería recargable.',
  39.99,
  800,
  (SELECT id FROM product_categories WHERE name = 'Ropa' LIMIT 1),
  'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&h=500&fit=crop&crop=center',
  45,
  true
),
(
  'Beat Pack Street Sounds',
  'Pack de 20 beats exclusivos para tus propias creaciones musicales. Incluye stems separados y MIDI files.',
  24.99,
  500,
  (SELECT id FROM product_categories WHERE name = 'Música' LIMIT 1),
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=500&fit=crop&crop=center',
  999,
  true
),
(
  'Camiseta Digital Rebellion',
  'Camiseta con diseño holográfico que cambia con la luz. Tecnología termocrómica avanzada.',
  29.99,
  600,
  (SELECT id FROM product_categories WHERE name = 'Ropa' LIMIT 1),
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop&crop=center',
  67,
  true
),
(
  'Vinilo Edición Especial',
  'Vinilo de colección con artwork exclusivo y tracks bonus. Edición numerada limitada.',
  99.99,
  2000,
  (SELECT id FROM product_categories WHERE name = 'Música' LIMIT 1),
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=500&fit=crop&crop=center',
  12,
  true
);

-- VERIFICAR RESULTADOS
SELECT 'Productos creados:' as info, COUNT(*) as total FROM products;
SELECT 'Categorías creadas:' as info, COUNT(*) as total FROM product_categories;

-- MOSTRAR PRODUCTOS CON CATEGORÍAS
SELECT 
  p.id,
  p.name as producto,
  pc.name as categoria,
  p.price as precio_usd,
  p.price_tokens as tokens,
  p.stock_quantity as stock,
  p.image_url
FROM products p
LEFT JOIN product_categories pc ON p.category_id = pc.id
ORDER BY p.name;
