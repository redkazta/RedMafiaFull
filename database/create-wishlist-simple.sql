-- CREAR TABLA ECOMMERCE_WISHLISTS (Versión Simple)
-- Ejecutar esto en Supabase SQL Editor

CREATE TABLE ecommerce_wishlists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Habilitar RLS
ALTER TABLE ecommerce_wishlists ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
CREATE POLICY "Users can view their own wishlist" ON ecommerce_wishlists
  FOR SELECT USING (user_id::TEXT = auth.uid()::TEXT);

CREATE POLICY "Users can insert into their own wishlist" ON ecommerce_wishlists
  FOR INSERT WITH CHECK (user_id::TEXT = auth.uid()::TEXT);

CREATE POLICY "Users can delete from their own wishlist" ON ecommerce_wishlists
  FOR DELETE USING (user_id::TEXT = auth.uid()::TEXT);
