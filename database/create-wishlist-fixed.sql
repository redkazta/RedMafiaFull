-- =====================================================
-- LA RED MAFIA - CREAR TABLA ECOMMERCE_WISHLISTS
-- Versión corregida con tipos de datos correctos
-- =====================================================

-- PRIMERO: Verificar tipos de datos en products
SELECT
  column_name,
  data_type,
  udt_name
FROM information_schema.columns
WHERE table_name = 'products'
AND table_schema = 'public'
AND column_name = 'id';

-- SEGUNDO: Verificar tipos de datos en users
SELECT
  column_name,
  data_type,
  udt_name
FROM information_schema.columns
WHERE table_name = 'users'
AND table_schema = 'public'
AND column_name = 'id';

-- CREAR TABLA CON TIPOS CORRECTOS
-- Usar INTEGER para product_id si products.id es INTEGER
-- Usar INTEGER para user_id si users.id es INTEGER

CREATE TABLE ecommerce_wishlists (
  id SERIAL PRIMARY KEY,  -- Usar SERIAL para consistencia
  user_id INTEGER NOT NULL,  -- Cambiar a INTEGER si users.id es INTEGER
  product_id INTEGER NOT NULL,  -- Cambiar a INTEGER si products.id es INTEGER
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Evitar duplicados
  UNIQUE(user_id, product_id),

  -- Foreign keys con tipos correctos
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
  -- Nota: No agregamos FK para user_id ya que puede ser auth.users
);

-- Crear índices
CREATE INDEX idx_ecommerce_wishlists_user_id ON ecommerce_wishlists(user_id);
CREATE INDEX idx_ecommerce_wishlists_product_id ON ecommerce_wishlists(product_id);
CREATE INDEX idx_ecommerce_wishlists_created_at ON ecommerce_wishlists(created_at);

-- Trigger para updated_at
CREATE TRIGGER update_ecommerce_wishlists_updated_at
  BEFORE UPDATE ON ecommerce_wishlists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS
ALTER TABLE ecommerce_wishlists ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad (ajustadas para INTEGER)
CREATE POLICY "Users can view their own wishlist" ON ecommerce_wishlists
  FOR SELECT USING (user_id::TEXT = auth.uid()::TEXT);

CREATE POLICY "Users can insert into their own wishlist" ON ecommerce_wishlists
  FOR INSERT WITH CHECK (user_id::TEXT = auth.uid()::TEXT);

CREATE POLICY "Users can delete from their own wishlist" ON ecommerce_wishlists
  FOR DELETE USING (user_id::TEXT = auth.uid()::TEXT);

-- Verificar creación
SELECT
  schemaname,
  tablename,
  tableowner
FROM pg_tables
WHERE tablename = 'ecommerce_wishlists';
