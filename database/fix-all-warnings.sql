-- =====================================================
-- LA RED MAFIA - CORREGIR TODOS LOS WARNINGS E INFO
-- Script completo para arreglar linter de Supabase
-- =====================================================

-- =====================================================
-- 1. CORREGIR FUNCIONES CON SEARCH_PATH MUTABLE
-- =====================================================

-- Eliminar y recrear función update_updated_at_column con search_path fijo
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = public;

-- Eliminar y recrear función generate_order_number con search_path fijo
DROP FUNCTION IF EXISTS public.generate_order_number() CASCADE;
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT AS $$
DECLARE
    order_num TEXT;
BEGIN
    -- Generar número único con timestamp
    order_num := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD-HH24MI') || '-' ||
                 LPAD(CAST((RANDOM() * 999)::INT AS TEXT), 3, '0');
    RETURN order_num;
END;
$$ LANGUAGE plpgsql
SET search_path = public;

-- =====================================================
-- 2. CREAR POLÍTICAS RLS PARA TABLAS FALTANTES
-- =====================================================

-- PRODUCTS - Productos visibles para todos, solo admins pueden modificar
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (true);

CREATE POLICY "Only admins can insert products" ON products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only admins can update products" ON products
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Only admins can delete products" ON products
  FOR DELETE USING (auth.role() = 'authenticated');

-- SHOPPING_CART - Solo el propietario puede acceder
CREATE POLICY "Users can view their own cart" ON shopping_cart
  FOR SELECT USING (user_id::TEXT = auth.uid()::TEXT);

CREATE POLICY "Users can insert their own cart" ON shopping_cart
  FOR INSERT WITH CHECK (user_id::TEXT = auth.uid()::TEXT);

CREATE POLICY "Users can update their own cart" ON shopping_cart
  FOR UPDATE USING (user_id::TEXT = auth.uid()::TEXT);

CREATE POLICY "Users can delete their own cart" ON shopping_cart
  FOR DELETE USING (user_id::TEXT = auth.uid()::TEXT);

-- PURCHASE_ORDERS - Solo el propietario puede acceder
CREATE POLICY "Users can view their own orders" ON purchase_orders
  FOR SELECT USING (user_id::TEXT = auth.uid()::TEXT);

CREATE POLICY "Users can insert their own orders" ON purchase_orders
  FOR INSERT WITH CHECK (user_id::TEXT = auth.uid()::TEXT);

CREATE POLICY "Admins can view all orders" ON purchase_orders
  FOR SELECT USING (auth.role() = 'authenticated');

-- USER_TOKENS - Solo el propietario puede acceder
CREATE POLICY "Users can view their own tokens" ON user_tokens
  FOR SELECT USING (user_id::TEXT = auth.uid()::TEXT);

CREATE POLICY "Users can update their own tokens" ON user_tokens
  FOR UPDATE USING (user_id::TEXT = auth.uid()::TEXT);

CREATE POLICY "Admins can view all tokens" ON user_tokens
  FOR SELECT USING (auth.role() = 'authenticated');

-- USERS - Políticas para la tabla users
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (auth.role() = 'authenticated');

-- =====================================================
-- 3. VERIFICACIÓN FINAL
-- =====================================================

-- Verificar que todas las tablas tienen RLS con políticas
SELECT
  t.table_name,
  t.table_schema,
  CASE WHEN t.row_security THEN 'RLS Enabled' ELSE 'RLS Disabled' END as rls_status,
  COUNT(p.policyname) as policy_count
FROM information_schema.tables t
LEFT JOIN pg_policies p ON t.table_name = p.tablename AND t.table_schema = p.schemaname
WHERE t.table_schema = 'public'
AND t.table_type = 'BASE TABLE'
AND t.table_name NOT LIKE 'pg_%'
AND t.table_name NOT LIKE 'sql_%'
GROUP BY t.table_name, t.table_schema, t.row_security
ORDER BY t.table_name;

-- Verificar funciones con search_path corregido
SELECT
  proname as function_name,
  pg_get_function_identity_arguments(oid) as arguments,
  obj_description(oid, 'pg_proc') as description
FROM pg_proc
WHERE proname IN ('update_updated_at_column', 'generate_order_number')
AND pg_function_is_visible(oid);

-- Mostrar todas las políticas RLS creadas
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
