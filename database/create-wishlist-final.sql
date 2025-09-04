-- =====================================================
-- LA RED MAFIA - CREAR TABLA ECOMMERCE_WISHLISTS
-- Versión FINAL corregida para tipos mixtos
-- products.id = INTEGER, users.id = UUID
-- =====================================================

-- CREAR TABLA CON TIPOS CORRECTOS
CREATE TABLE ecommerce_wishlists (
  id SERIAL PRIMARY KEY,  -- Usar SERIAL para consistencia
  user_id UUID NOT NULL,  -- UUID porque users.id es UUID
  product_id INTEGER NOT NULL,  -- INTEGER porque products.id es INTEGER
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Evitar duplicados
  UNIQUE(user_id, product_id),

  -- Foreign key solo para products (INTEGER)
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Crear índices
CREATE INDEX idx_ecommerce_wishlists_user_id ON ecommerce_wishlists(user_id);
CREATE INDEX idx_ecommerce_wishlists_product_id ON ecommerce_wishlists(product_id);
CREATE INDEX idx_ecommerce_wishlists_created_at ON ecommerce_wishlists(created_at);

-- Trigger para updated_at (si existe la función)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
    EXECUTE 'CREATE TRIGGER update_ecommerce_wishlists_updated_at
      BEFORE UPDATE ON ecommerce_wishlists
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()';
  END IF;
END $$;

-- Habilitar RLS
ALTER TABLE ecommerce_wishlists ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
CREATE POLICY "Users can view their own wishlist" ON ecommerce_wishlists
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert into their own wishlist" ON ecommerce_wishlists
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete from their own wishlist" ON ecommerce_wishlists
  FOR DELETE USING (user_id = auth.uid());

-- Verificar creación
SELECT
  schemaname,
  tablename,
  tableowner
FROM pg_tables
WHERE tablename = 'ecommerce_wishlists';

-- Verificar estructura
SELECT
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'ecommerce_wishlists'
AND table_schema = 'public'
ORDER BY ordinal_position;
