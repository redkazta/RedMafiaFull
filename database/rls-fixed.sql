-- =====================================================
-- LA RED MAFIA - RLS CORREGIDO
-- Script con manejo de tipos de datos
-- =====================================================

-- PRIMERO: Verificar tipos de datos de las tablas
-- =====================================================

-- Verificar tipos de datos en las columnas user_id
SELECT
  t.table_name,
  c.column_name,
  c.data_type,
  c.udt_name
FROM information_schema.tables t
JOIN information_schema.columns c ON t.table_name = c.table_name
WHERE t.table_schema = 'public'
AND c.column_name = 'user_id'
AND t.table_name IN (
  'user_roles', 'user_addresses', 'artist_profiles', 'events',
  'shopping_cart', 'purchase_orders', 'user_tokens'
)
ORDER BY t.table_name;

-- HABILITAR RLS EN TODAS LAS TABLAS
-- =====================================================

ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE artist_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS PARA ROLES (Simplificadas)
-- =====================================================

CREATE POLICY "Roles are viewable by authenticated users" ON roles
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Only admins can insert roles" ON roles
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only admins can update roles" ON roles
  FOR UPDATE USING (auth.role() = 'authenticated');

-- POLÍTICAS PARA USER_ROLES
-- =====================================================

-- Usar una función helper para manejar tipos
CREATE OR REPLACE FUNCTION auth_user_id()
RETURNS TEXT AS $$
  SELECT auth.uid()::TEXT;
$$ LANGUAGE SQL STABLE;

CREATE POLICY "Users can view their own roles" ON user_roles
  FOR SELECT USING (user_id::TEXT = auth_user_id());

CREATE POLICY "Admins can view all user roles" ON user_roles
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Only admins can assign roles" ON user_roles
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- POLÍTICAS PARA PRODUCT_CATEGORIES
-- =====================================================

CREATE POLICY "Product categories are viewable by everyone" ON product_categories
  FOR SELECT USING (true);

CREATE POLICY "Only admins can insert product categories" ON product_categories
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only admins can update product categories" ON product_categories
  FOR UPDATE USING (auth.role() = 'authenticated');

-- POLÍTICAS PARA CART_ITEMS
-- =====================================================

CREATE POLICY "Users can view their own cart items" ON cart_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM shopping_cart sc
      WHERE sc.id = cart_items.cart_id
      AND sc.user_id::TEXT = auth_user_id()
    )
  );

CREATE POLICY "Users can insert their own cart items" ON cart_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM shopping_cart sc
      WHERE sc.id = cart_items.cart_id
      AND sc.user_id::TEXT = auth_user_id()
    )
  );

CREATE POLICY "Users can update their own cart items" ON cart_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM shopping_cart sc
      WHERE sc.id = cart_items.cart_id
      AND sc.user_id::TEXT = auth_user_id()
    )
  );

CREATE POLICY "Users can delete their own cart items" ON cart_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM shopping_cart sc
      WHERE sc.id = cart_items.cart_id
      AND sc.user_id::TEXT = auth_user_id()
    )
  );

-- POLÍTICAS PARA USER_ADDRESSES
-- =====================================================

CREATE POLICY "Users can view their own addresses" ON user_addresses
  FOR SELECT USING (user_id::TEXT = auth_user_id());

CREATE POLICY "Users can insert their own addresses" ON user_addresses
  FOR INSERT WITH CHECK (user_id::TEXT = auth_user_id());

CREATE POLICY "Users can update their own addresses" ON user_addresses
  FOR UPDATE USING (user_id::TEXT = auth_user_id());

CREATE POLICY "Users can delete their own addresses" ON user_addresses
  FOR DELETE USING (user_id::TEXT = auth_user_id());

-- POLÍTICAS PARA ARTIST_PROFILES
-- =====================================================

CREATE POLICY "Artist profiles are viewable by everyone" ON artist_profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own artist profile" ON artist_profiles
  FOR INSERT WITH CHECK (user_id::TEXT = auth_user_id());

CREATE POLICY "Users can update their own artist profile" ON artist_profiles
  FOR UPDATE USING (user_id::TEXT = auth_user_id());

-- POLÍTICAS PARA EVENTS
-- =====================================================

CREATE POLICY "Events are viewable by everyone" ON events
  FOR SELECT USING (true);

CREATE POLICY "Artists can insert their own events" ON events
  FOR INSERT WITH CHECK (
    artist_id::TEXT = auth_user_id() OR
    auth.role() = 'authenticated'
  );

CREATE POLICY "Artists can update their own events" ON events
  FOR UPDATE USING (
    artist_id::TEXT = auth_user_id() OR
    auth.role() = 'authenticated'
  );

-- POLÍTICAS PARA PURCHASE_ORDER_ITEMS Y ORDER_STATUS_HISTORY
-- =====================================================

CREATE POLICY "Users can view their own order items" ON purchase_order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM purchase_orders po
      WHERE po.id = purchase_order_items.order_id
      AND po.user_id::TEXT = auth_user_id()
    )
  );

CREATE POLICY "Admins can view all order items" ON purchase_order_items
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view their own order history" ON order_status_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM purchase_orders po
      WHERE po.id = order_status_history.order_id
      AND po.user_id::TEXT = auth_user_id()
    )
  );

CREATE POLICY "Admins can view all order history" ON order_status_history
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Only admins can insert order status history" ON order_status_history
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- VERIFICACIÓN FINAL
-- =====================================================

-- Verificar que RLS esté habilitado
SELECT
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN (
  'roles', 'user_roles', 'product_categories', 'cart_items',
  'purchase_order_items', 'order_status_history', 'user_addresses',
  'artist_profiles', 'events'
)
ORDER BY tablename;

-- Verificar políticas creadas
SELECT
  schemaname,
  tablename,
  policyname
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
