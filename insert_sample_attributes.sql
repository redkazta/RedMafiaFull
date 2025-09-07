-- Insertar atributos de ejemplo para productos existentes

-- Atributos para Hoodie "Underground Experimental" (asumiendo ID 1)
INSERT INTO product_attribute_values (product_id, attribute_id, value) VALUES
(1, 1, 'L'), -- Talla
(1, 2, 'Negro'), -- Color
(1, 3, 'Algodón'); -- Material

-- Atributos para Camiseta "HARDGUT" (asumiendo ID 2)
INSERT INTO product_attribute_values (product_id, attribute_id, value) VALUES
(2, 1, 'M'), -- Talla
(2, 2, 'Blanco'), -- Color
(2, 3, 'Algodón 100%'); -- Material

-- Atributos para Gorra "x trap" (asumiendo ID 3)
INSERT INTO product_attribute_values (product_id, attribute_id, value) VALUES
(3, 1, 'L/XL'), -- Talla
(3, 2, 'Negro'), -- Color
(3, 4, 'Snapback'); -- Estilo

-- Atributos para Cadena "Underground" (asumiendo ID 4)
INSERT INTO product_attribute_values (product_id, attribute_id, value) VALUES
(4, 1, 'N/A'), -- Talla
(4, 2, 'Plata'), -- Color
(4, 3, 'Plata'), -- Material
(4, 5, '60cm'), -- Longitud
(4, 6, '3mm'), -- Grosor
(4, 7, 'Brillante'); -- Acabado

-- Atributos para Anillo "Experimental" (asumiendo ID 5)
INSERT INTO product_attribute_values (product_id, attribute_id, value) VALUES
(5, 1, '8'), -- Talla
(5, 2, 'Plata'), -- Color
(5, 3, 'Acero inoxidable'), -- Material
(5, 5, 'N/A'), -- Longitud
(5, 6, '2mm'), -- Grosor
(5, 7, 'Mate'); -- Acabado

-- Atributos para Collar "Red House" (asumiendo ID 6)
INSERT INTO product_attribute_values (product_id, attribute_id, value) VALUES
(6, 1, 'N/A'), -- Talla
(6, 2, 'Negro'), -- Color
(6, 3, 'Cuero'), -- Material
(6, 5, '50cm'), -- Longitud
(6, 6, 'N/A'), -- Grosor
(6, 7, 'N/A'); -- Acabado

-- Atributos para HARDGUT - Maqueta Original (asumiendo ID 7)
INSERT INTO product_attribute_values (product_id, attribute_id, value) VALUES
(7, 8, '3:45'), -- Duración
(7, 9, 'WAV'), -- Formato
(7, 10, 'Lossless'), -- Calidad
(7, 11, 'Elpa Drino 333'); -- Artista

-- Atributos para No arte, dinero - Remix Exclusivo (asumiendo ID 8)
INSERT INTO product_attribute_values (product_id, attribute_id, value) VALUES
(8, 8, '2:30'), -- Duración
(8, 9, 'MP3'), -- Formato
(8, 10, '320kbps'), -- Calidad
(8, 11, 'Elpa Drino 333'); -- Artista

-- Atributos para x trap - Maqueta Original (asumiendo ID 9)
INSERT INTO product_attribute_values (product_id, attribute_id, value) VALUES
(9, 8, '2:45'), -- Duración
(9, 9, 'WAV'), -- Formato
(9, 10, 'Lossless'), -- Calidad
(9, 11, 'Red Lean'); -- Artista

-- Atributos para Sticker Pack "Artistas Experimentales" (asumiendo ID 10)
INSERT INTO product_attribute_values (product_id, attribute_id, value) VALUES
(10, 14, '5cm'), -- Tamaño
(10, 15, '10'); -- Cantidad

-- Atributos para Poster "Crew Underground" (asumiendo ID 11)
INSERT INTO product_attribute_values (product_id, attribute_id, value) VALUES
(11, 14, 'A3'), -- Tamaño
(11, 15, '1'); -- Cantidad

-- Atributos para Freestyle Exclusivo (asumiendo ID 12)
INSERT INTO product_attribute_values (product_id, attribute_id, value) VALUES
(12, 8, '2:15'), -- Duración
(12, 9, 'MP3'), -- Formato
(12, 10, '320kbps'), -- Calidad
(12, 11, 'Elpa Drino 333'); -- Artista

-- Atributos para Edición Limitada RDM (asumiendo ID 13)
INSERT INTO product_attribute_values (product_id, attribute_id, value) VALUES
(13, 16, '001'), -- Número de edición
(13, 17, '50'), -- Cantidad limitada
(13, 18, 'Hoodie'), -- Tipo de producto
(13, 19, 'Firmado por todos los artistas'); -- Características especiales

-- Verificar que se insertaron correctamente
SELECT 
    p.name as producto,
    pa.name as atributo,
    pav.value as valor
FROM products p
JOIN product_attribute_values pav ON p.id = pav.product_id
JOIN product_attributes pa ON pav.attribute_id = pa.id
ORDER BY p.id, pa.name;

-- Mensaje de confirmación
SELECT 'Atributos de ejemplo insertados correctamente.' AS status;
