-- =====================================================
-- LA RED MAFIA - RLS STEP BY STEP (CORREGIDO)
-- Script simplificado para ejecutar paso a paso
-- Versión corregida para manejar tipos de datos
-- =====================================================

-- PASO 1: HABILITAR RLS EN TODAS LAS TABLAS
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

-- PASO 2: POLÍTICAS PARA ROLES
-- =====================================================

-- Solo administradores pueden gestionar roles
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

-- PASO 3: POLÍTICAS PARA USER_ROLES
-- =====================================================

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

-- PASO 4: POLÍTICAS PARA PRODUCT_CATEGORIES
-- =====================================================

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

-- PASO 5: POLÍTICAS PARA CART_ITEMS
-- =====================================================

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

-- PASO 6: POLÍTICAS PARA USER_ADDRESSES
-- =====================================================

CREATE POLICY "Users can view their own addresses" ON user_addresses
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own addresses" ON user_addresses
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own addresses" ON user_addresses
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own addresses" ON user_addresses
  FOR DELETE USING (user_id = auth.uid());

-- PASO 7: POLÍTICAS PARA ARTIST_PROFILES
-- =====================================================

CREATE POLICY "Artist profiles are viewable by everyone" ON artist_profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own artist profile" ON artist_profiles
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own artist profile" ON artist_profiles
  FOR UPDATE USING (user_id = auth.uid());

-- PASO 8: POLÍTICAS PARA EVENTS
-- =====================================================

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

-- PASO 9: VERIFICACIÓN
-- =====================================================

-- Verificar que RLS esté habilitado
SELECT
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN (
  'roles', 'user_roles', 'product_categories', 'cart_items',
  'user_addresses', 'artist_profiles', 'events'
)
ORDER BY tablename;
