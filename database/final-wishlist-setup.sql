-- =====================================================
-- LA RED MAFIA - SETUP FINAL ECOMMERCE_WISHLISTS
-- Ejecuta ESTO en Supabase SQL Editor
-- =====================================================

-- 1. VERIFICAR SI LA TABLA EXISTE
SELECT
  schemaname,
  tablename,
  tableowner
FROM pg_tables
WHERE tablename = 'ecommerce_wishlists'
AND schemaname = 'public';

-- 2. SI NO EXISTE, CREARLA
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables
    WHERE tablename = 'ecommerce_wishlists'
    AND schemaname = 'public'
  ) THEN

    -- Crear tabla
    CREATE TABLE ecommerce_wishlists (
      id SERIAL PRIMARY KEY,
      user_id UUID NOT NULL,
      product_id INTEGER NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(user_id, product_id),
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    -- Crear índices
    CREATE INDEX idx_ecommerce_wishlists_user_id ON ecommerce_wishlists(user_id);
    CREATE INDEX idx_ecommerce_wishlists_product_id ON ecommerce_wishlists(product_id);

    -- Habilitar RLS
    ALTER TABLE ecommerce_wishlists ENABLE ROW LEVEL SECURITY;

    -- Políticas de seguridad
    CREATE POLICY "Users can view their own wishlist" ON ecommerce_wishlists
      FOR SELECT USING (user_id = auth.uid());

    CREATE POLICY "Users can insert into their own wishlist" ON ecommerce_wishlists
      FOR INSERT WITH CHECK (user_id = auth.uid());

    CREATE POLICY "Users can delete from their own wishlist" ON ecommerce_wishlists
      FOR DELETE USING (user_id = auth.uid());

    RAISE NOTICE 'Tabla ecommerce_wishlists creada exitosamente';

  ELSE
    RAISE NOTICE 'Tabla ecommerce_wishlists ya existe';
  END IF;
END $$;

-- 3. VERIFICAR QUE SE CREÓ CORRECTAMENTE
SELECT
  schemaname,
  tablename,
  tableowner
FROM pg_tables
WHERE tablename = 'ecommerce_wishlists'
AND schemaname = 'public';

-- 4. VERIFICAR POLÍTICAS RLS
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles
FROM pg_policies
WHERE tablename = 'ecommerce_wishlists';

-- 5. VERIFICAR ESTRUCTURA
SELECT
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'ecommerce_wishlists'
AND table_schema = 'public'
ORDER BY ordinal_position;
