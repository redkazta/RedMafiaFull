-- =====================================================
-- LA RED MAFIA - HABILITAR RLS Y POLÍTICAS DE SEGURIDAD
-- Script para corregir errores del linter de Supabase
-- =====================================================

-- Habilitar RLS en todas las tablas que lo necesitan
-- =====================================================

-- 1. ROLES - Solo administradores pueden acceder
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

-- Políticas para roles
CREATE POLICY "Roles are viewable by authenticated users" ON roles
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Only admins can insert roles" ON roles
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Only admins can update roles" ON roles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name IN ('admin', 'super_admin')
    )
  );

-- 2. USER_ROLES - Solo administradores y el propio usuario pueden acceder
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Políticas para user_roles
CREATE POLICY "Users can view their own roles" ON user_roles
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all user roles" ON user_roles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Only admins can assign roles" ON user_roles
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Only admins can update roles" ON user_roles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name IN ('admin', 'super_admin')
    )
  );

-- 3. PRODUCT_CATEGORIES - Públicas para lectura, solo admins para escritura
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;

-- Políticas para product_categories
CREATE POLICY "Product categories are viewable by everyone" ON product_categories
  FOR SELECT USING (true);

CREATE POLICY "Only admins can insert product categories" ON product_categories
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Only admins can update product categories" ON product_categories
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name IN ('admin', 'super_admin')
    )
  );

-- 4. CART_ITEMS - Solo el propietario del carrito puede acceder
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Políticas para cart_items
CREATE POLICY "Users can view their own cart items" ON cart_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM shopping_cart sc
      WHERE sc.id = cart_items.cart_id
      AND sc.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own cart items" ON cart_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM shopping_cart sc
      WHERE sc.id = cart_items.cart_id
      AND sc.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own cart items" ON cart_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM shopping_cart sc
      WHERE sc.id = cart_items.cart_id
      AND sc.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own cart items" ON cart_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM shopping_cart sc
      WHERE sc.id = cart_items.cart_id
      AND sc.user_id = auth.uid()
    )
  );

-- 5. PURCHASE_ORDER_ITEMS - Solo el propietario de la orden puede acceder
ALTER TABLE purchase_order_items ENABLE ROW LEVEL SECURITY;

-- Políticas para purchase_order_items
CREATE POLICY "Users can view their own order items" ON purchase_order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM purchase_orders po
      WHERE po.id = purchase_order_items.order_id
      AND po.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all order items" ON purchase_order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name IN ('admin', 'super_admin')
    )
  );

-- 6. ORDER_STATUS_HISTORY - Solo propietarios y admins pueden acceder
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;

-- Políticas para order_status_history
CREATE POLICY "Users can view their own order history" ON order_status_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM purchase_orders po
      WHERE po.id = order_status_history.order_id
      AND po.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all order history" ON order_status_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Only admins can insert order status history" ON order_status_history
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name IN ('admin', 'super_admin')
    )
  );

-- 7. USER_ADDRESSES - Solo el propietario puede acceder
ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;

-- Políticas para user_addresses
CREATE POLICY "Users can view their own addresses" ON user_addresses
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own addresses" ON user_addresses
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own addresses" ON user_addresses
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own addresses" ON user_addresses
  FOR DELETE USING (user_id = auth.uid());

-- 8. ARTIST_PROFILES - Públicas para lectura, solo propietario para escritura
ALTER TABLE artist_profiles ENABLE ROW LEVEL SECURITY;

-- Políticas para artist_profiles
CREATE POLICY "Artist profiles are viewable by everyone" ON artist_profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own artist profile" ON artist_profiles
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own artist profile" ON artist_profiles
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Only admins can delete artist profiles" ON artist_profiles
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name IN ('admin', 'super_admin')
    )
  );

-- 9. EVENTS - Públicas para lectura, solo propietario/artista para escritura
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Políticas para events
CREATE POLICY "Events are viewable by everyone" ON events
  FOR SELECT USING (true);

CREATE POLICY "Artists can insert their own events" ON events
  FOR INSERT WITH CHECK (
    artist_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Artists can update their own events" ON events
  FOR UPDATE USING (
    artist_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Only admins can delete events" ON events
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name IN ('admin', 'super_admin')
    )
  );

-- =====================================================
-- POLÍTICAS PARA TABLAS QUE YA TIENEN RLS HABILITADO
-- =====================================================

-- Verificar y actualizar políticas para tablas que ya deberían tener RLS
-- (users, user_profiles, user_tokens, products, shopping_cart, purchase_orders, token_transactions, music_tracks)

-- Asegurarse de que estas tablas tengan RLS habilitado
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE token_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE music_tracks ENABLE ROW LEVEL SECURITY;

-- Políticas para users (si no existen)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users can view their own profile') THEN
    CREATE POLICY "Users can view their own profile" ON users
      FOR SELECT USING (id = auth.uid());

    CREATE POLICY "Users can update their own profile" ON users
      FOR UPDATE USING (id = auth.uid());
  END IF;
END $$;

-- Políticas para user_profiles (si no existen)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_profiles' AND policyname = 'User profiles are viewable by everyone') THEN
    CREATE POLICY "User profiles are viewable by everyone" ON user_profiles
      FOR SELECT USING (true);

    CREATE POLICY "Users can update their own profile" ON user_profiles
      FOR UPDATE USING (id = auth.uid());
  END IF;
END $$;

-- Políticas para user_tokens (si no existen)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_tokens' AND policyname = 'Users can view their own tokens') THEN
    CREATE POLICY "Users can view their own tokens" ON user_tokens
      FOR SELECT USING (user_id = auth.uid());

    CREATE POLICY "Users can update their own tokens" ON user_tokens
      FOR UPDATE USING (user_id = auth.uid());
  END IF;
END $$;

-- Políticas para products (si no existen)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Products are viewable by everyone') THEN
    CREATE POLICY "Products are viewable by everyone" ON products
      FOR SELECT USING (true);

    CREATE POLICY "Only admins can insert products" ON products
      FOR INSERT WITH CHECK (
        EXISTS (
          SELECT 1 FROM user_roles ur
          JOIN roles r ON ur.role_id = r.id
          WHERE ur.user_id = auth.uid()
          AND r.name IN ('admin', 'super_admin')
        )
      );
  END IF;
END $$;

-- Políticas para shopping_cart (si no existen)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'shopping_cart' AND policyname = 'Users can view their own cart') THEN
    CREATE POLICY "Users can view their own cart" ON shopping_cart
      FOR SELECT USING (user_id = auth.uid());

    CREATE POLICY "Users can insert their own cart" ON shopping_cart
      FOR INSERT WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

-- Políticas para purchase_orders (si no existen)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'purchase_orders' AND policyname = 'Users can view their own orders') THEN
    CREATE POLICY "Users can view their own orders" ON purchase_orders
      FOR SELECT USING (user_id = auth.uid());

    CREATE POLICY "Users can insert their own orders" ON purchase_orders
      FOR INSERT WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

-- Políticas para token_transactions (si no existen)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'token_transactions' AND policyname = 'Users can view their own transactions') THEN
    CREATE POLICY "Users can view their own transactions" ON token_transactions
      FOR SELECT USING (user_id = auth.uid());

    CREATE POLICY "Admins can view all transactions" ON token_transactions
      FOR SELECT USING (
        EXISTS (
          SELECT 1 FROM user_roles ur
          JOIN roles r ON ur.role_id = r.id
          WHERE ur.user_id = auth.uid()
          AND r.name IN ('admin', 'super_admin')
        )
      );
  END IF;
END $$;

-- Políticas para music_tracks (si no existen)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'music_tracks' AND policyname = 'Music tracks are viewable by everyone') THEN
    CREATE POLICY "Music tracks are viewable by everyone" ON music_tracks
      FOR SELECT USING (true);

    CREATE POLICY "Only admins can insert music tracks" ON music_tracks
      FOR INSERT WITH CHECK (
        EXISTS (
          SELECT 1 FROM user_roles ur
          JOIN roles r ON ur.role_id = r.id
          WHERE ur.user_id = auth.uid()
          AND r.name IN ('admin', 'super_admin')
        )
      );
  END IF;
END $$;

-- =====================================================
-- VERIFICACIÓN FINAL
-- =====================================================

-- Mostrar todas las tablas con RLS habilitado
SELECT
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN (
  'roles', 'user_roles', 'product_categories', 'cart_items',
  'purchase_order_items', 'order_status_history', 'user_addresses',
  'artist_profiles', 'events', 'users', 'user_profiles', 'user_tokens',
  'products', 'shopping_cart', 'purchase_orders', 'token_transactions',
  'music_tracks'
)
ORDER BY tablename;

-- Mostrar todas las políticas RLS creadas
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
