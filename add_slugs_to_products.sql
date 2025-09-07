-- Script para agregar slugs a productos existentes

-- Función para generar slug
CREATE OR REPLACE FUNCTION generate_slug(input_text TEXT) 
RETURNS TEXT AS $$
BEGIN
    RETURN LOWER(
        REGEXP_REPLACE(
            REGEXP_REPLACE(
                REGEXP_REPLACE(input_text, '[^a-zA-Z0-9\s]', '', 'g'),
                '\s+', '-', 'g'
            ),
            '^-+|-+$', '', 'g'
        )
    );
END;
$$ LANGUAGE plpgsql;

-- Agregar columna slug si no existe
ALTER TABLE products ADD COLUMN IF NOT EXISTS slug VARCHAR(255);

-- Generar slugs para productos existentes
UPDATE products 
SET slug = generate_slug(name) || '-' || id
WHERE slug IS NULL;

-- Crear índice único para slug
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_slug ON products(slug);

-- Verificar que todos los productos tengan slug
SELECT id, name, slug FROM products ORDER BY id;
