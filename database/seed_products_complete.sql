-- =====================================================
-- LA RED MAFIA - SEED PRODUCTS COMPLETO
-- =====================================================
-- IMPORTANTE: Usar TODAS las columnas requeridas según el schema
-- =====================================================

-- PRIMERO: Insertar categorías (solo columnas que existen)
INSERT INTO product_categories (name, description) VALUES
('Ropa', 'Ropa y accesorios cyberpunk'),
('Música', 'Álbumes, beats y música digital');

-- SEGUNDO: Insertar productos con TODAS las columnas requeridas
-- Nota: Usamos NULL para artist_id y category_id por ahora
INSERT INTO products (
  name, 
  slug, 
  description, 
  category_id, 
  artist_id, 
  price_tokens, 
  price_usd, 
  original_price_mxn, 
  stock_quantity, 
  main_image_url, 
  image_urls, 
  status, 
  is_featured
) VALUES
(
  'Red Mafia Hoodie Cyberpunk',
  'red-mafia-hoodie-cyberpunk',
  'Hoodie exclusivo con diseño cyberpunk de la Red Mafia. Edición limitada con bordados LED y materiales premium.',
  (SELECT id FROM product_categories WHERE name = 'Ropa' LIMIT 1),
  NULL, -- Sin artista por ahora
  1200,
  59.99,
  1500.00,
  25,
  'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=500&fit=crop&crop=center',
  ARRAY[
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=800&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=600&fit=crop&crop=center'
  ],
  'active',
  true
),
(
  'Álbum Digital Underground Kings',
  'album-digital-underground-kings',
  'Álbum completo en formato digital con tracks exclusivos de la Red Mafia. Incluye bonus tracks y artwork digital.',
  (SELECT id FROM product_categories WHERE name = 'Música' LIMIT 1),
  NULL,
  300,
  14.99,
  NULL,
  999,
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=500&fit=crop&crop=center',
  ARRAY[
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=800&fit=crop&crop=center'
  ],
  'active',
  false
),
(
  'Gorra Neon Dreams',
  'gorra-neon-dreams',
  'Gorra con bordado LED que brilla en la oscuridad. Diseño cyberpunk único con batería recargable.',
  (SELECT id FROM product_categories WHERE name = 'Ropa' LIMIT 1),
  NULL,
  800,
  39.99,
  1000.00,
  45,
  'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&h=500&fit=crop&crop=center',
  ARRAY[
    'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&h=800&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&h=600&fit=crop&crop=center'
  ],
  'active',
  false
),
(
  'Beat Pack Street Sounds',
  'beat-pack-street-sounds',
  'Pack de 20 beats exclusivos para tus propias creaciones musicales. Incluye stems separados y MIDI files.',
  (SELECT id FROM product_categories WHERE name = 'Música' LIMIT 1),
  NULL,
  500,
  24.99,
  NULL,
  999,
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=500&fit=crop&crop=center',
  ARRAY[
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=800&fit=crop&crop=center'
  ],
  'active',
  true
),
(
  'Camiseta Digital Rebellion',
  'camiseta-digital-rebellion',
  'Camiseta con diseño holográfico que cambia con la luz. Tecnología termocrómica avanzada.',
  (SELECT id FROM product_categories WHERE name = 'Ropa' LIMIT 1),
  NULL,
  600,
  29.99,
  NULL,
  67,
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop&crop=center',
  ARRAY[
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop&crop=center'
  ],
  'active',
  false
),
(
  'Vinilo Edición Especial',
  'vinilo-edicion-especial',
  'Vinilo de colección con artwork exclusivo y tracks bonus. Edición numerada limitada.',
  (SELECT id FROM product_categories WHERE name = 'Música' LIMIT 1),
  NULL,
  2000,
  99.99,
  2500.00,
  12,
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=500&fit=crop&crop=center',
  ARRAY[
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=800&fit=crop&crop=center'
  ],
  'active',
  true
)
ON CONFLICT (slug) DO NOTHING;

-- VERIFICAR QUE TODO SE INSERTÓ CORRECTAMENTE
SELECT 
  'Productos insertados:' as info,
  COUNT(*) as total
FROM products;

SELECT 
  'Categorías insertadas:' as info,
  COUNT(*) as total  
FROM product_categories;

-- MOSTRAR PRODUCTOS CON CATEGORÍAS
SELECT 
  p.name as producto,
  pc.name as categoria,
  p.price_tokens as tokens,
  p.main_image_url as imagen
FROM products p
LEFT JOIN product_categories pc ON p.category_id = pc.id
ORDER BY p.name;
