-- Script para actualizar el esquema de user_addresses para México
-- Elimina el campo 'country' y ajusta la estructura para direcciones mexicanas

-- Paso 1: Eliminar el campo 'country' si existe
ALTER TABLE public.user_addresses DROP COLUMN IF EXISTS country;

-- Paso 2: Agregar campos específicos para direcciones mexicanas
ALTER TABLE public.user_addresses 
ADD COLUMN IF NOT EXISTS codigo_postal VARCHAR(5),
ADD COLUMN IF NOT EXISTS numero_exterior VARCHAR(20),
ADD COLUMN IF NOT EXISTS numero_interior VARCHAR(20),
ADD COLUMN IF NOT EXISTS referencias TEXT;

-- Paso 3: Hacer obligatorios los campos esenciales
ALTER TABLE public.user_addresses 
ALTER COLUMN codigo_postal SET NOT NULL,
ALTER COLUMN numero_exterior SET NOT NULL;

-- Paso 4: Agregar índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_user_addresses_cp ON public.user_addresses(codigo_postal);
CREATE INDEX IF NOT EXISTS idx_user_addresses_estado ON public.user_addresses(state);
CREATE INDEX IF NOT EXISTS idx_user_addresses_ciudad ON public.user_addresses(city);

-- Paso 5: Actualizar la política RLS para incluir los nuevos campos
DROP POLICY IF EXISTS "Users can view own addresses" ON public.user_addresses;
DROP POLICY IF EXISTS "Users can insert own addresses" ON public.user_addresses;
DROP POLICY IF EXISTS "Users can update own addresses" ON public.user_addresses;
DROP POLICY IF EXISTS "Users can delete own addresses" ON public.user_addresses;

-- Recrear políticas RLS
CREATE POLICY "Users can view own addresses" ON public.user_addresses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own addresses" ON public.user_addresses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own addresses" ON public.user_addresses
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own addresses" ON public.user_addresses
    FOR DELETE USING (auth.uid() = user_id);

-- Paso 6: Crear función para validar código postal mexicano
CREATE OR REPLACE FUNCTION public.validate_mexican_zipcode(zipcode TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    -- Validar que sea exactamente 5 dígitos
    RETURN zipcode ~ '^[0-9]{5}$';
END;
$$ LANGUAGE plpgsql;

-- Paso 7: Agregar constraint para validar código postal
ALTER TABLE public.user_addresses 
ADD CONSTRAINT check_mexican_zipcode 
CHECK (public.validate_mexican_zipcode(codigo_postal));

-- Paso 8: Actualizar datos existentes (si los hay) con valores por defecto
UPDATE public.user_addresses 
SET 
    codigo_postal = COALESCE(codigo_postal, '00000'),
    numero_exterior = COALESCE(numero_exterior, 'S/N'),
    state = COALESCE(state, 'México'),
    country = 'México'
WHERE codigo_postal IS NULL OR numero_exterior IS NULL;

-- Mensaje de confirmación
SELECT 'Esquema de direcciones actualizado para México correctamente.' AS status;
