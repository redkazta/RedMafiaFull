-- =====================================================
-- LA RED MAFIA - SUPABASE SCHEMA ESENCIAL
-- =====================================================
-- Solo las tablas que realmente necesitas para que funcione
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
  address_type TEXT NOT NULL CHECK (address_type IN ('billing', 'shipping', 'both')),
  is_default BOOLEAN DEFAULT false,
  recipient_name TEXT NOT NULL,
  phone TEXT,
  street_address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'México',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. PERFILES DE ARTISTA
CREATE TABLE IF NOT EXISTS artist_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE UNIQUE,
  stage_name TEXT NOT NULL,
  bio TEXT,
  genres TEXT[],
  hometown TEXT,
  -- Métricas básicas
  followers_count INTEGER DEFAULT 0,
  monthly_listeners INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. EVENTOS
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  organizer_id UUID REFERENCES user_profiles(id),
  event_type TEXT NOT NULL CHECK (event_type IN ('concert', 'festival', 'meet_greet', 'workshop')),
  is_virtual BOOLEAN DEFAULT false,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  venue_name TEXT,
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'México',
  -- Solo tokens para tickets
  ticket_price_tokens INTEGER,
  max_capacity INTEGER,
  available_tickets INTEGER,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'cancelled', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INSERTAR ROLES BÁSICOS
-- =====================================================
INSERT INTO roles (name, display_name, permissions) VALUES
('user', 'Usuario', '["read_products", "make_purchases", "view_own_profile"]'::jsonb),
('artist', 'Artista', '["read_products", "make_purchases", "view_own_profile", "create_events", "upload_music", "manage_merch"]'::jsonb),
('admin', 'Administrador', '["*"]'::jsonb),
('moderator', 'Moderador', '["read_products", "make_purchases", "view_own_profile", "moderate_content", "manage_orders"]'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- Categorías básicas
INSERT INTO product_categories (name, slug, description) VALUES
('Ropa', 'ropa', 'Camisetas, hoodies y más merchandise'),
('Accesorios', 'accesorios', 'Gorras, pulseras y accesorios'),
('Música', 'musica', 'Álbumes físicos y digitales'),
('Tickets', 'tickets', 'Entradas para eventos')
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- ROW LEVEL SECURITY (RLS) - POLÍTICAS BÁSICAS
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE artist_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Políticas básicas
CREATE POLICY "Users can view their own data" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own data" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (status = 'active');
CREATE POLICY "Users can view their own orders" ON purchase_orders FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create their own orders" ON purchase_orders FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can manage their own cart" ON shopping_carts FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Events are viewable by everyone" ON events FOR SELECT USING (status = 'published');

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_user ON purchase_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_status ON purchase_orders(status);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_events_organizer ON events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(start_date);

-- =====================================================
-- FUNCIONES ÚTILES
-- =====================================================

-- Función para generar número de orden automático
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number := 'RM-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(EXTRACT(DOY FROM NOW())::text, 3, '0') || '-' || LPAD((EXTRACT(EPOCH FROM NOW()) % 86400)::integer::text, 5, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para generar número de orden
CREATE TRIGGER trigger_generate_order_number
  BEFORE INSERT ON purchase_orders
  FOR EACH ROW
  EXECUTE FUNCTION generate_order_number();

-- Función para actualizar timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_tokens_updated_at BEFORE UPDATE ON user_tokens FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_purchase_orders_updated_at BEFORE UPDATE ON purchase_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_addresses_updated_at BEFORE UPDATE ON user_addresses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_artist_profiles_updated_at BEFORE UPDATE ON artist_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FUNCIÓN PARA CREAR PERFIL AUTOMÁTICAMENTE
-- =====================================================

-- Función para crear perfil de usuario automáticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Crear perfil de usuario
  INSERT INTO public.user_profiles (
    id,
    email,
    username,
    first_name,
    last_name,
    display_name,
    bio,
    avatar_url,
    is_verified,
    is_active
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'first_name' || ' ' || NEW.raw_user_meta_data->>'last_name'),
    NULL,
    NULL,
    CASE WHEN NEW.email_confirmed_at IS NOT NULL THEN true ELSE false END,
    true
  );

  -- Crear tokens iniciales (1000 tokens de bienvenida)
  INSERT INTO public.user_tokens (
    user_id,
    current_balance,
    total_earned,
    total_spent
  )
  VALUES (
    NEW.id,
    1000,
    1000,
    0
  );

  -- Asignar rol de usuario por defecto
  INSERT INTO public.user_roles (user_id, role_id)
  SELECT NEW.id, id FROM public.roles WHERE name = 'user';

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para ejecutar la función cuando se crea un usuario
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- POLÍTICAS ADICIONALES PARA TOKENS Y ROLES
-- =====================================================

-- Políticas para user_tokens
CREATE POLICY "Users can view their own tokens" ON user_tokens FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update their own tokens" ON user_tokens FOR UPDATE USING (user_id = auth.uid());

-- Políticas para user_roles
CREATE POLICY "Users can view their own roles" ON user_roles FOR SELECT USING (user_id = auth.uid());

-- Políticas para roles (solo lectura para todos)
CREATE POLICY "Roles are viewable by everyone" ON roles FOR SELECT USING (true);

-- =====================================================
-- TABLAS ADICIONALES PARA ECOMMERCE
-- =====================================================

-- Tabla para wishlist de usuarios (base de datos)
CREATE TABLE IF NOT EXISTS ecommerce_wishlists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Tabla para reviews de productos
CREATE TABLE IF NOT EXISTS ecommerce_product_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  is_verified_purchase BOOLEAN DEFAULT false,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, user_id)
);

-- Tabla para cupones y descuentos
CREATE TABLE IF NOT EXISTS ecommerce_coupons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed_tokens')),
  discount_value INTEGER NOT NULL,
  min_purchase_tokens INTEGER DEFAULT 0,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  valid_until TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para uso de cupones
CREATE TABLE IF NOT EXISTS ecommerce_coupon_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  coupon_id UUID REFERENCES ecommerce_coupons(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  order_id UUID REFERENCES purchase_orders(id) ON DELETE CASCADE,
  discount_applied INTEGER NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para historial de navegación/productos vistos
CREATE TABLE IF NOT EXISTS ecommerce_product_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_id TEXT
);

-- Habilitar RLS en nuevas tablas
ALTER TABLE ecommerce_wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecommerce_product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecommerce_coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecommerce_coupon_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecommerce_product_views ENABLE ROW LEVEL SECURITY;

-- Políticas para wishlist
CREATE POLICY "Users can manage their own wishlist" ON ecommerce_wishlists FOR ALL USING (user_id = auth.uid());

-- Políticas para reviews
CREATE POLICY "Users can view all reviews" ON ecommerce_product_reviews FOR SELECT USING (true);
CREATE POLICY "Users can manage their own reviews" ON ecommerce_product_reviews FOR ALL USING (user_id = auth.uid());

-- Políticas para cupones (solo lectura para usuarios)
CREATE POLICY "Users can view active coupons" ON ecommerce_coupons FOR SELECT USING (is_active = true AND valid_until > NOW());

-- Políticas para uso de cupones
CREATE POLICY "Users can view their own coupon usage" ON ecommerce_coupon_usage FOR SELECT USING (user_id = auth.uid());

-- Políticas para vistas de productos
CREATE POLICY "Users can manage their own product views" ON ecommerce_product_views FOR ALL USING (user_id = auth.uid());

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_ecommerce_wishlists_user ON ecommerce_wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_ecommerce_wishlists_product ON ecommerce_wishlists(product_id);
CREATE INDEX IF NOT EXISTS idx_ecommerce_reviews_product ON ecommerce_product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_ecommerce_reviews_user ON ecommerce_product_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_ecommerce_coupons_code ON ecommerce_coupons(code);
CREATE INDEX IF NOT EXISTS idx_ecommerce_product_views_user ON ecommerce_product_views(user_id);

-- Triggers para updated_at
CREATE TRIGGER update_ecommerce_product_reviews_updated_at BEFORE UPDATE ON ecommerce_product_reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABLAS ADICIONALES PARA CARRITO Y ÓRDENES
-- =====================================================

-- Tabla para carrito de usuarios (base de datos)
CREATE TABLE IF NOT EXISTS ecommerce_carts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Tabla para órdenes de ecommerce (separada de purchase_orders para mayor flexibilidad)
CREATE TABLE IF NOT EXISTS ecommerce_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  order_number TEXT UNIQUE,
  total_tokens INTEGER NOT NULL DEFAULT 0,
  total_usd DECIMAL(10,2), -- Para pagos con tarjeta
  payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('tokens', 'card')),
  payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  stripe_payment_intent_id VARCHAR(255), -- Para integración con Stripe
  status VARCHAR(50) DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'cancelled', 'refunded')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para items de órdenes de ecommerce
CREATE TABLE IF NOT EXISTS ecommerce_order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES ecommerce_orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price_tokens INTEGER NOT NULL,
  price_usd DECIMAL(10,2), -- Precio USD equivalente
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS para nuevas tablas
ALTER TABLE ecommerce_carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecommerce_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecommerce_order_items ENABLE ROW LEVEL SECURITY;

-- Políticas para carrito
CREATE POLICY "Users can view their own cart" ON ecommerce_carts FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can manage their own cart" ON ecommerce_carts FOR ALL USING (user_id = auth.uid());

-- Políticas para órdenes
CREATE POLICY "Users can view their own orders" ON ecommerce_orders FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create their own orders" ON ecommerce_orders FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own orders" ON ecommerce_orders FOR UPDATE USING (user_id = auth.uid());

-- Políticas para items de órdenes (a través de la orden)
CREATE POLICY "Users can view their own order items" ON ecommerce_order_items FOR SELECT 
  USING (EXISTS (SELECT 1 FROM ecommerce_orders WHERE id = order_id AND user_id = auth.uid()));
CREATE POLICY "Users can create their own order items" ON ecommerce_order_items FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM ecommerce_orders WHERE id = order_id AND user_id = auth.uid()));

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_ecommerce_carts_user ON ecommerce_carts(user_id);
CREATE INDEX IF NOT EXISTS idx_ecommerce_carts_product ON ecommerce_carts(product_id);
CREATE INDEX IF NOT EXISTS idx_ecommerce_carts_updated ON ecommerce_carts(updated_at);

CREATE INDEX IF NOT EXISTS idx_ecommerce_orders_user ON ecommerce_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_ecommerce_orders_status ON ecommerce_orders(status);
CREATE INDEX IF NOT EXISTS idx_ecommerce_orders_payment_status ON ecommerce_orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_ecommerce_orders_created ON ecommerce_orders(created_at);
CREATE INDEX IF NOT EXISTS idx_ecommerce_orders_number ON ecommerce_orders(order_number);

CREATE INDEX IF NOT EXISTS idx_ecommerce_order_items_order ON ecommerce_order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_ecommerce_order_items_product ON ecommerce_order_items(product_id);

-- Triggers para updated_at
CREATE TRIGGER update_ecommerce_carts_updated_at BEFORE UPDATE ON ecommerce_carts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ecommerce_orders_updated_at BEFORE UPDATE ON ecommerce_orders 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para generar número de orden de ecommerce
CREATE OR REPLACE FUNCTION generate_ecommerce_order_number()
RETURNS TRIGGER AS $
BEGIN
  NEW.order_number := 'EC-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(EXTRACT(DOY FROM NOW())::text, 3, '0') || '-' || LPAD((EXTRACT(EPOCH FROM NOW()) % 86400)::integer::text, 5, '0');
  RETURN NEW;
END;
$ LANGUAGE plpgsql;

-- Trigger para generar número de orden de ecommerce
CREATE TRIGGER trigger_generate_ecommerce_order_number
  BEFORE INSERT ON ecommerce_orders
  FOR EACH ROW
  EXECUTE FUNCTION generate_ecommerce_order_number();

-- =====================================================
-- ACTUALIZAR POLÍTICAS PARA CART_ITEMS
-- =====================================================

-- Políticas para cart_items (a través del carrito)
CREATE POLICY "Users can view their own cart items" ON cart_items FOR SELECT
  USING (EXISTS (SELECT 1 FROM shopping_carts WHERE id = cart_id AND user_id = auth.uid()));

CREATE POLICY "Users can manage their own cart items" ON cart_items FOR ALL
  USING (EXISTS (SELECT 1 FROM shopping_carts WHERE id = cart_id AND user_id = auth.uid()));

-- =====================================================
-- 14. CONFIGURACIONES DE USUARIO
-- =====================================================
CREATE TABLE user_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE UNIQUE,

  -- Configuraciones generales
  theme TEXT DEFAULT 'dark' CHECK (theme IN ('light', 'dark', 'auto')),
  language TEXT DEFAULT 'es',
  timezone TEXT DEFAULT 'America/Mexico_City',

  -- Notificaciones
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  order_notifications BOOLEAN DEFAULT true,
  marketing_emails BOOLEAN DEFAULT false,

  -- Privacidad
  profile_visibility TEXT DEFAULT 'public' CHECK (profile_visibility IN ('public', 'friends', 'private')),
  show_online_status BOOLEAN DEFAULT true,
  allow_messages BOOLEAN DEFAULT true,

  -- Preferencias de contenido
  content_filter TEXT DEFAULT 'moderate' CHECK (content_filter IN ('none', 'moderate', 'strict')),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 15. AVATARES Y FOTOS DE USUARIO
-- =====================================================
CREATE TABLE user_avatars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,

  -- Información del archivo
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type TEXT NOT NULL,
  storage_path TEXT NOT NULL, -- Path en Supabase Storage
  public_url TEXT NOT NULL,

  -- Metadatos
  width INTEGER,
  height INTEGER,
  is_primary BOOLEAN DEFAULT false,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 16. ACTIVIDAD RECIENTE
-- =====================================================
CREATE TABLE user_activity_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,

  action_type TEXT NOT NULL, -- 'login', 'logout', 'profile_update', 'order_placed', etc.
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,

  ip_address INET,
  user_agent TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- POLÍTICAS PARA NUEVAS TABLAS
-- =====================================================

-- Políticas para user_settings
CREATE POLICY "Users can manage their own settings" ON user_settings FOR ALL USING (user_id = auth.uid());

-- Políticas para user_avatars
CREATE POLICY "Users can manage their own avatars" ON user_avatars FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Public avatars are viewable by everyone" ON user_avatars FOR SELECT USING (true);

-- Políticas para user_activity_log
CREATE POLICY "Users can view their own activity" ON user_activity_log FOR SELECT USING (user_id = auth.uid());

-- =====================================================
-- FUNCIONES ÚTILES PARA AVATARES
-- =====================================================

-- Función para establecer avatar primario
CREATE OR REPLACE FUNCTION set_primary_avatar(user_uuid UUID, avatar_uuid UUID)
RETURNS VOID AS $$
BEGIN
  -- Quitar primary de todos los avatares del usuario
  UPDATE user_avatars
  SET is_primary = false
  WHERE user_id = user_uuid;

  -- Establecer el nuevo avatar como primario
  UPDATE user_avatars
  SET is_primary = true
  WHERE id = avatar_uuid AND user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener avatar primario de un usuario
CREATE OR REPLACE FUNCTION get_primary_avatar(user_uuid UUID)
RETURNS TEXT AS $$
DECLARE
  avatar_url TEXT;
BEGIN
  SELECT public_url INTO avatar_url
  FROM user_avatars
  WHERE user_id = user_uuid AND is_primary = true
  ORDER BY created_at DESC
  LIMIT 1;

  RETURN avatar_url;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_user_settings_user ON user_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_avatars_user ON user_avatars(user_id);
CREATE INDEX IF NOT EXISTS idx_user_avatars_primary ON user_avatars(user_id, is_primary);
CREATE INDEX IF NOT EXISTS idx_user_activity_user ON user_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_created ON user_activity_log(created_at);

-- =====================================================
-- TRIGGERS PARA UPDATED_AT
-- =====================================================
CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 17. UBICACIONES DE USUARIO
-- =====================================================
CREATE TABLE user_locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,

  -- Información de ubicación
  name TEXT NOT NULL, -- Nombre personalizado (ej: "Casa", "Trabajo", "Casa de mis papás")
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT,
  country TEXT DEFAULT 'México',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),

  -- Metadatos
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- POLÍTICAS PARA UBICACIONES
-- =====================================================

-- Políticas para user_locations
CREATE POLICY "Users can manage their own locations" ON user_locations FOR ALL USING (user_id = auth.uid());

-- =====================================================
-- ÍNDICES PARA UBICACIONES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_user_locations_user ON user_locations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_locations_default ON user_locations(user_id, is_default);
CREATE INDEX IF NOT EXISTS idx_user_locations_active ON user_locations(is_active);

-- =====================================================
-- TRIGGERS PARA UBICACIONES
-- =====================================================
CREATE TRIGGER update_user_locations_updated_at BEFORE UPDATE ON user_locations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ¡LISTO! Tablas esenciales + ecommerce + usuario + ubicaciones completo
-- =====================================================