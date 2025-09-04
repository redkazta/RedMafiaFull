-- =====================================================
-- LA RED MAFIA - SETUP COMPLETO DE BASE DE DATOS
-- =====================================================
-- Ejecutar este archivo completo en Supabase SQL Editor
-- =====================================================

-- 1. PRIMERO: Ejecutar el schema completo
-- =====================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. ROLES (separado de usuarios como pediste)
CREATE TABLE IF NOT EXISTS roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  permissions JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. USUARIOS (simplificado)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. ROLES DE USUARIO (junction table)
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role_id)
);

-- 4. TOKENS (solo tokens, no divisas mixtas)
CREATE TABLE IF NOT EXISTS user_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE UNIQUE,
  current_balance INTEGER DEFAULT 100,
  total_earned INTEGER DEFAULT 0,
  total_spent INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. CATEGORÍAS DE PRODUCTOS
CREATE TABLE IF NOT EXISTS product_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. PRODUCTOS (precios en tokens - 200x MXN)
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category_id UUID REFERENCES product_categories(id),
  artist_id UUID REFERENCES user_profiles(id),
  -- Precios en tokens y USD
  price_tokens INTEGER NOT NULL,
  price_usd DECIMAL(10,2), -- Para pagos con tarjeta
  original_price_mxn DECIMAL(10,2),
  stock_quantity INTEGER DEFAULT 0,
  -- Media
  main_image_url TEXT NOT NULL,
  image_urls TEXT[],
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'inactive')),
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. CARRITO DE COMPRAS
CREATE TABLE IF NOT EXISTS shopping_carts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cart_id UUID REFERENCES shopping_carts(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  price_tokens INTEGER NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. ÓRDENES DE COMPRA (con historial)
CREATE TABLE IF NOT EXISTS purchase_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES user_profiles(id) NOT NULL,
  -- Solo tokens
  total_tokens INTEGER NOT NULL,
  total_items INTEGER NOT NULL,
  -- Status tracking
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  -- Timestamps de estado
  confirmed_at TIMESTAMP WITH TIME ZONE,
  shipped_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS purchase_order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES purchase_orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name TEXT NOT NULL,
  unit_price_tokens INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  total_price_tokens INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. HISTORIAL DE ESTADOS DE ÓRDENES
CREATE TABLE IF NOT EXISTS order_status_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES purchase_orders(id) ON DELETE CASCADE,
  from_status TEXT,
  to_status TEXT NOT NULL,
  changed_by UUID REFERENCES user_profiles(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. DIRECCIONES DE USUARIO
CREATE TABLE IF NOT EXISTS user_addresses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  type TEXT DEFAULT 'shipping' CHECK (type IN ('billing', 'shipping')),
  -- Datos de dirección
  street_address TEXT NOT NULL,
  apartment TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT DEFAULT 'Mexico',
  -- Contacto
  recipient_name TEXT NOT NULL,
  phone TEXT,
  -- Metadata
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. PERFILES DE ARTISTA
CREATE TABLE IF NOT EXISTS artist_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) UNIQUE,
  stage_name TEXT,
  bio TEXT,
  genres TEXT[],
  social_links JSONB DEFAULT '{}',
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. EVENTOS
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  venue TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  -- Precios
  price_tokens INTEGER,
  price_mxn DECIMAL(10,2),
  -- Media
  poster_url TEXT,
  gallery_urls TEXT[],
  -- Status
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('draft', 'upcoming', 'live', 'completed', 'cancelled')),
  max_capacity INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- FUNCIONES Y TRIGGERS
-- =====================================================

-- Función para generar número de orden único
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'RM-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('order_seq')::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Secuencia para números de orden
CREATE SEQUENCE IF NOT EXISTS order_seq START 1;

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar triggers
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_tokens_updated_at BEFORE UPDATE ON user_tokens
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shopping_carts_updated_at BEFORE UPDATE ON shopping_carts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_purchase_orders_updated_at BEFORE UPDATE ON purchase_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_addresses_updated_at BEFORE UPDATE ON user_addresses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_artist_profiles_updated_at BEFORE UPDATE ON artist_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE artist_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Políticas básicas de RLS
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view their own tokens" ON user_tokens
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own tokens" ON user_tokens
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view active products" ON products
  FOR SELECT USING (status = 'active');

CREATE POLICY "Users can view their own cart" ON shopping_carts
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their cart items" ON cart_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM shopping_carts
      WHERE id = cart_items.cart_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their own orders" ON purchase_orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their addresses" ON user_addresses
  FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- 2. SEGUNDO: Insertar datos iniciales
-- =====================================================

-- Insertar roles básicos
INSERT INTO roles (name, display_name, permissions) VALUES
('admin', 'Administrador', '["all"]'),
('artist', 'Artista', '["create_products", "manage_events"]'),
('user', 'Usuario', '["basic"]')
ON CONFLICT (name) DO NOTHING;

-- Insertar categorías de productos
INSERT INTO product_categories (name, slug, description, image_url, is_active) VALUES
('Ropa', 'ropa', 'Ropa y accesorios cyberpunk', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=500&fit=crop&crop=center', true),
('Música', 'musica', 'Álbumes, beats y música digital', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=500&fit=crop&crop=center', true)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- 3. TERCERO: Insertar productos de ejemplo
-- =====================================================

-- Insertar productos de ejemplo
-- Nota: Solo funciona si ya existen categorías y usuarios
INSERT INTO products (name, slug, description, category_id, artist_id, price_tokens, original_price_mxn, stock_quantity, main_image_url, image_urls, status, is_featured) VALUES
(
  'Red Mafia Hoodie Cyberpunk',
  'red-mafia-hoodie-cyberpunk',
  'Hoodie exclusivo con diseño cyberpunk de la Red Mafia. Edición limitada con bordados LED y materiales premium.',
  (SELECT id FROM product_categories WHERE slug = 'ropa' LIMIT 1),
  (SELECT id FROM user_profiles LIMIT 1), -- Usar un usuario existente en lugar de auth.uid()
  1200,
  1500,
  25,
  'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=500&fit=crop&crop=center',
  ARRAY[
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=800&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=800&fit=crop&crop=center'
  ],
  'active',
  true
),
(
  'Álbum Digital Underground Kings',
  'album-digital-underground-kings',
  'Álbum completo en formato digital con tracks exclusivos de la Red Mafia. Incluye bonus tracks y artwork digital.',
  (SELECT id FROM product_categories WHERE slug = 'musica' LIMIT 1),
  (SELECT id FROM user_profiles LIMIT 1), -- Usar un usuario existente en lugar de auth.uid()
  300,
  null,
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
  (SELECT id FROM product_categories WHERE slug = 'ropa' LIMIT 1),
  (SELECT id FROM user_profiles LIMIT 1), -- Usar un usuario existente en lugar de auth.uid()
  800,
  1000,
  45,
  'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&h=500&fit=crop&crop=center',
  ARRAY[
    'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&h=800&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&h=800&fit=crop&crop=center'
  ],
  'active',
  false
),
(
  'Beat Pack Street Sounds',
  'beat-pack-street-sounds',
  'Pack de 20 beats exclusivos para tus propias creaciones musicales. Incluye stems separados y MIDI files.',
  (SELECT id FROM product_categories WHERE slug = 'musica' LIMIT 1),
  (SELECT id FROM user_profiles LIMIT 1), -- Usar un usuario existente en lugar de auth.uid()
  500,
  null,
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
  (SELECT id FROM product_categories WHERE slug = 'ropa' LIMIT 1),
  (SELECT id FROM user_profiles LIMIT 1), -- Usar un usuario existente en lugar de auth.uid()
  600,
  null,
  67,
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop&crop=center',
  ARRAY[
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop&crop=center'
  ],
  'active',
  false
),
(
  'Vinilo Edición Especial',
  'vinilo-edicion-especial',
  'Vinilo de colección con artwork exclusivo y tracks bonus. Edición numerada limitada.',
  (SELECT id FROM product_categories WHERE slug = 'musica' LIMIT 1),
  (SELECT id FROM user_profiles LIMIT 1), -- Usar un usuario existente en lugar de auth.uid()
  2000,
  2500,
  12,
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=500&fit=crop&crop=center',
  ARRAY[
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=800&fit=crop&crop=center'
  ],
  'active',
  true
)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- SETUP COMPLETADO!
-- =====================================================

-- Verificar que todo se creó correctamente
SELECT '✅ Setup completado exitosamente!' as status;
SELECT COUNT(*) as total_products FROM products;
SELECT COUNT(*) as total_categories FROM product_categories;
SELECT COUNT(*) as total_roles FROM roles;
