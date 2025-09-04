-- =====================================================
-- LA RED MAFIA - CREAR TABLA ECOMMERCE_WISHLISTS
-- Tabla para wishlist persistente con tipos correctos
-- =====================================================

-- Crear tabla ecommerce_wishlists con tipos de datos correctos
CREATE TABLE IF NOT EXISTS ecommerce_wishlists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL, -- Referencia a auth.users(id) que es UUID
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Evitar duplicados: un usuario no puede tener el mismo producto 2 veces en wishlist
  UNIQUE(user_id, product_id)
);

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_ecommerce_wishlists_user_id ON ecommerce_wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_ecommerce_wishlists_product_id ON ecommerce_wishlists(product_id);
CREATE INDEX IF NOT EXISTS idx_ecommerce_wishlists_created_at ON ecommerce_wishlists(created_at);

-- Trigger para actualizar updated_at automáticamente
CREATE TRIGGER update_ecommerce_wishlists_updated_at
  BEFORE UPDATE ON ecommerce_wishlists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security
ALTER TABLE ecommerce_wishlists ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad RLS
CREATE POLICY "Users can view their own wishlist" ON ecommerce_wishlists
  FOR SELECT USING (user_id::TEXT = auth.uid()::TEXT);

CREATE POLICY "Users can insert into their own wishlist" ON ecommerce_wishlists
  FOR INSERT WITH CHECK (user_id::TEXT = auth.uid()::TEXT);

CREATE POLICY "Users can delete from their own wishlist" ON ecommerce_wishlists
  FOR DELETE USING (user_id::TEXT = auth.uid()::TEXT);

CREATE POLICY "Admins can view all wishlists" ON ecommerce_wishlists
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id::TEXT = auth.uid()::TEXT
      AND r.name IN ('admin', 'super_admin')
    )
  );

-- Verificar que la tabla se creó correctamente
SELECT
  schemaname,
  tablename,
  tableowner
FROM pg_tables
WHERE tablename = 'ecommerce_wishlists'
AND schemaname = 'public';

-- Verificar las políticas RLS
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'ecommerce_wishlists'
ORDER BY policyname;
