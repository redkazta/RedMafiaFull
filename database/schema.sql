-- =====================================================
-- LA RED MAFIA - SUPABASE SCHEMA COMPLETO
-- Versión optimizada por Kiro AI
-- =====================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- 1. ROLES DEL SISTEMA
-- =====================================================
CREATE TABLE IF NOT EXISTS roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  permissions JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. PERFILES DE USUARIO
-- =====================================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  phone TEXT,
  date_of_birth DATE,
  location TEXT,
  website TEXT,
  social_links JSONB DEFAULT '{}'::jsonb,
  preferences JSONB DEFAULT '{}'::jsonb,
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. ROLES DE USUARIO (Junction Table)
-- =====================================================
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES user_profiles(id),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  UNIQUE(user_id, role_id)
);

-- =====================================================
-- 4. SISTEMA DE TOKENS
-- =====================================================
CREATE TABLE IF NOT EXISTS user_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE UNIQUE,
  current_balance INTEGER DEFAULT 100,
  total_earned INTEGER DEFAULT 0,
  total_spent INTEGER DEFAULT 0,
  last_transaction_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. HISTORIAL DE TRANSACCIONES DE TOKENS
-- =====================================================
CREATE TABLE IF NOT EXISTS token_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('earn', 'spend', 'refund', 'bonus', 'penalty')),
  amount INTEGER NOT NULL,
  balance_before INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  description TEXT,
  reference_type TEXT, -- 'purchase', 'event', 'bonus', etc.
  reference_id UUID,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. CATEGORÍAS DE PRODUCTOS
-- =====================================================
CREATE TABLE IF NOT EXISTS product_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES product_categories(id),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 7. PRODUCTOS/MERCHANDISE
-- =====================================================
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  category_id UUID REFERENCES product_categories(id),
  artist_id UUID REFERENCES user_profiles(id),
  
  -- Precios (tokens = MXN * 200)
  price_tokens INTEGER NOT NULL,
  original_price_mxn DECIMAL(10,2),
  compare_at_price_tokens INTEGER,
  
  -- Inventario
  stock_quantity INTEGER DEFAULT 0,
  track_inventory BOOLEAN DEFAULT true,
  allow_backorder BOOLEAN DEFAULT false,
  
  -- Media
  main_image_url TEXT NOT NULL,
  image_urls TEXT[] DEFAULT '{}',
  video_url TEXT,
  
  -- SEO y metadata
  meta_title TEXT,
  meta_description TEXT,
  tags TEXT[] DEFAULT '{}',
  
  -- Estado
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'inactive', 'archived')),
  is_featured BOOLEAN DEFAULT false,
  is_digital BOOLEAN DEFAULT false,
  
  -- Fechas
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 8. VARIANTES DE PRODUCTOS (tallas, colores, etc.)
-- =====================================================
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- "Talla M", "Color Rojo", etc.
  sku TEXT UNIQUE,
  price_tokens INTEGER,
  stock_quantity INTEGER DEFAULT 0,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 9. CARRITO DE COMPRAS
-- =====================================================
CREATE TABLE IF NOT EXISTS shopping_carts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cart_id UUID REFERENCES shopping_carts(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  price_tokens INTEGER NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(cart_id, product_id, variant_id)
);

-- =====================================================
-- 10. ÓRDENES DE COMPRA
-- =====================================================
CREATE TABLE IF NOT EXISTS purchase_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES user_profiles(id) NOT NULL,
  
  -- Totales
  subtotal_tokens INTEGER NOT NULL,
  tax_tokens INTEGER DEFAULT 0,
  shipping_tokens INTEGER DEFAULT 0,
  discount_tokens INTEGER DEFAULT 0,
  total_tokens INTEGER NOT NULL,
  total_items INTEGER NOT NULL,
  
  -- Información de envío
  shipping_address JSONB,
  billing_address JSONB,
  shipping_method TEXT,
  
  -- Estado y tracking
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  fulfillment_status TEXT DEFAULT 'unfulfilled' CHECK (fulfillment_status IN ('unfulfilled', 'partial', 'fulfilled')),
  
  -- Notas y metadata
  notes TEXT,
  admin_notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps importantes
  confirmed_at TIMESTAMP WITH TIME ZONE,
  shipped_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 11. ITEMS DE ÓRDENES
-- =====================================================
CREATE TABLE IF NOT EXISTS purchase_order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES purchase_orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  variant_id UUID REFERENCES product_variants(id),
  
  -- Información del producto al momento de la compra
  product_name TEXT NOT NULL,
  variant_name TEXT,
  sku TEXT,
  unit_price_tokens INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  total_price_tokens INTEGER NOT NULL,
  
  -- Metadata
  product_metadata JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 12. HISTORIAL DE ESTADOS DE ÓRDENES
-- =====================================================
CREATE TABLE IF NOT EXISTS order_status_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES purchase_orders(id) ON DELETE CASCADE,
  from_status TEXT,
  to_status TEXT NOT NULL,
  changed_by UUID REFERENCES user_profiles(id),
  reason TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 13. DIRECCIONES DE USUARIO
-- =====================================================
CREATE TABLE IF NOT EXISTS user_addresses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  address_type TEXT NOT NULL CHECK (address_type IN ('billing', 'shipping', 'both')),
  is_default BOOLEAN DEFAULT false,
  
  -- Información de la dirección
  recipient_name TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  address_line_1 TEXT NOT NULL,
  address_line_2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'México',
  
  -- Metadata
  instructions TEXT,
  
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 14. PERFILES DE ARTISTA
-- =====================================================
CREATE TABLE IF NOT EXISTS artist_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE UNIQUE,
  
  -- Información artística
  stage_name TEXT NOT NULL,
  bio TEXT,
  genres TEXT[] DEFAULT '{}',
  hometown TEXT,
  formed_year INTEGER,
  
  -- Media
  banner_image_url TEXT,
  gallery_images TEXT[] DEFAULT '{}',
  
  -- Métricas
  followers_count INTEGER DEFAULT 0,
  monthly_listeners INTEGER DEFAULT 0,
  total_plays INTEGER DEFAULT 0,
  
  -- Estado
  is_verified BOOLEAN DEFAULT false,
  verification_level TEXT DEFAULT 'none' CHECK (verification_level IN ('none', 'pending', 'basic', 'premium')),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 15. MÚSICA/TRACKS
-- =====================================================
CREATE TABLE IF NOT EXISTS music_tracks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  artist_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  
  -- Información básica
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  
  -- Información musical
  duration_seconds INTEGER,
  genre TEXT,
  mood TEXT,
  bpm INTEGER,
  key_signature TEXT,
  
  -- Media
  audio_url TEXT,
  cover_art_url TEXT,
  waveform_data JSONB,
  
  -- Metadata
  lyrics TEXT,
  credits JSONB DEFAULT '{}'::jsonb,
  tags TEXT[] DEFAULT '{}',
  
  -- Configuración
  is_explicit BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  allow_download BOOLEAN DEFAULT false,
  price_tokens INTEGER, -- Si es de pago
  
  -- Métricas
  play_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  download_count INTEGER DEFAULT 0,
  
  -- Estado
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'private', 'archived')),
  
  -- Fechas
  release_date DATE,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 16. ÁLBUMES/PLAYLISTS
-- =====================================================
CREATE TABLE IF NOT EXISTS music_albums (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  artist_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  
  -- Información básica
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  album_type TEXT DEFAULT 'album' CHECK (album_type IN ('album', 'ep', 'single', 'compilation', 'playlist')),
  
  -- Media
  cover_art_url TEXT,
  
  -- Metadata
  genre TEXT,
  tags TEXT[] DEFAULT '{}',
  
  -- Estado
  is_featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'private', 'archived')),
  
  -- Fechas
  release_date DATE,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 17. TRACKS EN ÁLBUMES
-- =====================================================
CREATE TABLE IF NOT EXISTS album_tracks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  album_id UUID REFERENCES music_albums(id) ON DELETE CASCADE,
  track_id UUID REFERENCES music_tracks(id) ON DELETE CASCADE,
  track_number INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(album_id, track_id),
  UNIQUE(album_id, track_number)
);

-- =====================================================
-- 18. EVENTOS
-- =====================================================
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organizer_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  
  -- Información básica
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  
  -- Tipo y categoría
  event_type TEXT NOT NULL CHECK (event_type IN ('concert', 'festival', 'meet_greet', 'workshop', 'listening_party', 'virtual')),
  genre TEXT,
  
  -- Fechas y horarios
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  timezone TEXT DEFAULT 'America/Mexico_City',
  
  -- Ubicación
  is_virtual BOOLEAN DEFAULT false,
  venue_name TEXT,
  venue_address TEXT,
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'México',
  coordinates POINT,
  
  -- Tickets y capacidad
  ticket_price_tokens INTEGER,
  max_capacity INTEGER,
  available_tickets INTEGER,
  min_age INTEGER,
  
  -- Media
  banner_image_url TEXT,
  gallery_images TEXT[] DEFAULT '{}',
  
  -- Configuración
  is_featured BOOLEAN DEFAULT false,
  requires_approval BOOLEAN DEFAULT false,
  
  -- Estado
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'cancelled', 'completed', 'postponed')),
  
  -- Metadata
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Fechas
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 19. ARTISTAS EN EVENTOS
-- =====================================================
CREATE TABLE IF NOT EXISTS event_artists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  artist_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'performer' CHECK (role IN ('headliner', 'performer', 'opener', 'guest', 'host')),
  performance_order INTEGER,
  set_duration_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, artist_id)
);

-- =====================================================
-- 20. RESERVAS/TICKETS DE EVENTOS
-- =====================================================
CREATE TABLE IF NOT EXISTS event_bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  
  -- Información del ticket
  ticket_number TEXT UNIQUE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price_tokens INTEGER NOT NULL,
  total_price_tokens INTEGER NOT NULL,
  
  -- Estado
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'refunded', 'used')),
  
  -- Metadata
  attendee_info JSONB DEFAULT '{}'::jsonb,
  special_requests TEXT,
  
  -- Fechas importantes
  booked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  cancelled_at TIMESTAMP WITH TIME ZONE,
  used_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INSERTAR DATOS INICIALES
-- =====================================================

-- Roles básicos
INSERT INTO roles (name, display_name, description, permissions) VALUES
('user', 'Usuario', 'Usuario básico de la plataforma', '["read_products", "make_purchases", "view_own_profile", "book_events"]'::jsonb),
('artist', 'Artista', 'Artista verificado', '["read_products", "make_purchases", "view_own_profile", "book_events", "create_events", "upload_music", "manage_merch", "view_analytics"]'::jsonb),
('admin', 'Administrador', 'Administrador del sistema', '["*"]'::jsonb),
('moderator', 'Moderador', 'Moderador de contenido', '["read_products", "make_purchases", "view_own_profile", "moderate_content", "manage_orders", "manage_events"]'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- Categorías de productos básicas
INSERT INTO product_categories (name, slug, description) VALUES
('Ropa', 'ropa', 'Camisetas, hoodies y más merchandise'),
('Accesorios', 'accesorios', 'Gorras, pulseras y accesorios'),
('Música', 'musica', 'Álbumes físicos y digitales'),
('Tickets', 'tickets', 'Entradas para eventos')
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices básicos
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_artist ON products(artist_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_user ON purchase_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_status ON purchase_orders(status);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_events_organizer ON events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_music_tracks_artist ON music_tracks(artist_id);
CREATE INDEX IF NOT EXISTS idx_music_tracks_status ON music_tracks(status);
CREATE INDEX IF NOT EXISTS idx_token_transactions_user ON token_transactions(user_id);

-- Índices compuestos
CREATE INDEX IF NOT EXISTS idx_products_status_featured ON products(status, is_featured);
CREATE INDEX IF NOT EXISTS idx_events_status_date ON events(status, start_date);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_active ON user_roles(user_id, is_active);

-- =====================================================
-- FUNCIONES Y TRIGGERS
-- =====================================================

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función para generar número de orden
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number := 'RM-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(EXTRACT(DOY FROM NOW())::text, 3, '0') || '-' || LPAD((EXTRACT(EPOCH FROM NOW()) % 86400)::integer::text, 5, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función para generar ticket number
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.ticket_number := 'TKT-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(NEW.id::text, 8, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_tokens_updated_at BEFORE UPDATE ON user_tokens FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_purchase_orders_updated_at BEFORE UPDATE ON purchase_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shopping_carts_updated_at BEFORE UPDATE ON shopping_carts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_addresses_updated_at BEFORE UPDATE ON user_addresses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_artist_profiles_updated_at BEFORE UPDATE ON artist_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_music_tracks_updated_at BEFORE UPDATE ON music_tracks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_music_albums_updated_at BEFORE UPDATE ON music_albums FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_event_bookings_updated_at BEFORE UPDATE ON event_bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Triggers para generar números
CREATE TRIGGER trigger_generate_order_number BEFORE INSERT ON purchase_orders FOR EACH ROW EXECUTE FUNCTION generate_order_number();
CREATE TRIGGER trigger_generate_ticket_number BEFORE INSERT ON event_bookings FOR EACH ROW EXECUTE FUNCTION generate_ticket_number();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE token_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE artist_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE music_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE music_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_bookings ENABLE ROW LEVEL SECURITY;

-- Políticas básicas para user_profiles
CREATE POLICY "Users can view their own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Public profiles are viewable by everyone" ON user_profiles FOR SELECT USING (is_active = true);

-- Políticas para productos
CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (status = 'active');
CREATE POLICY "Artists can manage their own products" ON products FOR ALL USING (artist_id = auth.uid());

-- Políticas para órdenes
CREATE POLICY "Users can view their own orders" ON purchase_orders FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create their own orders" ON purchase_orders FOR INSERT WITH CHECK (user_id = auth.uid());

-- Políticas para carrito
CREATE POLICY "Users can manage their own cart" ON shopping_carts FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users can manage their own cart items" ON cart_items FOR ALL USING (
  EXISTS (SELECT 1 FROM shopping_carts WHERE id = cart_id AND user_id = auth.uid())
);

-- Políticas para eventos
CREATE POLICY "Events are viewable by everyone" ON events FOR SELECT USING (status = 'published');
CREATE POLICY "Organizers can manage their own events" ON events FOR ALL USING (organizer_id = auth.uid());

-- Políticas para bookings
CREATE POLICY "Users can view their own bookings" ON event_bookings FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create their own bookings" ON event_bookings FOR INSERT WITH CHECK (user_id = auth.uid());

-- =====================================================
-- FUNCIONES AUXILIARES
-- =====================================================

-- Función para obtener el balance de tokens de un usuario
CREATE OR REPLACE FUNCTION get_user_token_balance(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  balance INTEGER;
BEGIN
  SELECT current_balance INTO balance FROM user_tokens WHERE user_id = user_uuid;
  RETURN COALESCE(balance, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para verificar si un usuario tiene un rol específico
CREATE OR REPLACE FUNCTION user_has_role(user_uuid UUID, role_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM user_roles ur 
    JOIN roles r ON ur.role_id = r.id 
    WHERE ur.user_id = user_uuid 
    AND r.name = role_name 
    AND ur.is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- SCHEMA COMPLETO - LISTO PARA USAR
-- =====================================================