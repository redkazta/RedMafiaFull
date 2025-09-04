-- =====================================================
-- LA RED MAFIA - SEED PRODUCTS SIMPLE
-- =====================================================

-- Insertar productos básicos (solo columnas que existen)
INSERT INTO products (name, description) VALUES
('Red Mafia Hoodie Cyberpunk', 'Hoodie exclusivo con diseño cyberpunk'),
('Álbum Digital Underground Kings', 'Álbum completo en formato digital'),
('Gorra Neon Dreams', 'Gorra con bordado LED que brilla en la oscuridad'),
('Beat Pack Street Sounds', 'Pack de 20 beats exclusivos'),
('Camiseta Digital Rebellion', 'Camiseta con diseño holográfico'),
('Vinilo Edición Especial', 'Vinilo de colección con artwork exclusivo');

-- Insertar categorías básicas (solo columnas que existen)
INSERT INTO product_categories (name, description) VALUES
('Ropa', 'Ropa y accesorios cyberpunk'),
('Música', 'Álbumes, beats y música digital');
