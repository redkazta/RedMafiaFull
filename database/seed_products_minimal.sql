-- =====================================================
-- LA RED MAFIA - SEED PRODUCTS MINIMAL
-- =====================================================
-- Solo las columnas básicas que sabemos que existen
-- =====================================================

-- PASO 1: Verificar estructura (ejecuta esto primero)
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'product_categories';
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'products';

-- PASO 2: Insertar categorías básicas
INSERT INTO product_categories (name, description) VALUES
('Ropa', 'Ropa y accesorios cyberpunk'),
('Música', 'Álbumes, beats y música digital');

-- PASO 3: Insertar productos básicos (solo columnas obligatorias)
INSERT INTO products (name, description, price_tokens, main_image_url) VALUES
(
  'Red Mafia Hoodie Cyberpunk',
  'Hoodie exclusivo con diseño cyberpunk de la Red Mafia',
  1200,
  'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=500&fit=crop&crop=center'
),
(
  'Álbum Digital Underground Kings',
  'Álbum completo en formato digital con tracks exclusivos',
  300,
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=500&fit=crop&crop=center'
),
(
  'Gorra Neon Dreams',
  'Gorra con bordado LED que brilla en la oscuridad',
  800,
  'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&h=500&fit=crop&crop=center'
),
(
  'Beat Pack Street Sounds',
  'Pack de 20 beats exclusivos para creaciones musicales',
  500,
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=500&fit=crop&crop=center'
),
(
  'Camiseta Digital Rebellion',
  'Camiseta con diseño holográfico que cambia con la luz',
  600,
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop&crop=center'
),
(
  'Vinilo Edición Especial',
  'Vinilo de colección con artwork exclusivo y tracks bonus',
  2000,
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=500&fit=crop&crop=center'
);

-- VERIFICAR RESULTADOS
SELECT 'Productos creados:' as info, COUNT(*) as total FROM products;
SELECT 'Categorías creadas:' as info, COUNT(*) as total FROM product_categories;

-- MOSTRAR PRODUCTOS
SELECT id, name, price_tokens, main_image_url FROM products ORDER BY name;
