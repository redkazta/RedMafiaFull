-- VERIFICAR Y CORREGIR ESTRUCTURA DE user_addresses
-- Ejecutar esto para solucionar el problema de la columna is_active

-- =====================================================
-- PASO 1: VER ESTRUCTURA ACTUAL DE user_addresses
-- =====================================================

SELECT
    'ESTRUCTURA ACTUAL:' as info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'user_addresses'
ORDER BY ordinal_position;

-- =====================================================
-- PASO 2: AGREGAR COLUMNAS FALTANTES (si no existen)
-- =====================================================

-- Agregar is_active si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'user_addresses'
        AND column_name = 'is_active'
    ) THEN
        ALTER TABLE public.user_addresses ADD COLUMN is_active BOOLEAN DEFAULT true;
        RAISE NOTICE 'Columna is_active agregada';
    ELSE
        RAISE NOTICE 'Columna is_active ya existe';
    END IF;
END $$;

-- Agregar address_line_1 si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'user_addresses'
        AND column_name = 'address_line_1'
    ) THEN
        ALTER TABLE public.user_addresses ADD COLUMN address_line_1 TEXT;
        RAISE NOTICE 'Columna address_line_1 agregada';
    ELSE
        RAISE NOTICE 'Columna address_line_1 ya existe';
    END IF;
END $$;

-- Agregar address_line_2 si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'user_addresses'
        AND column_name = 'address_line_2'
    ) THEN
        ALTER TABLE public.user_addresses ADD COLUMN address_line_2 TEXT;
        RAISE NOTICE 'Columna address_line_2 agregada';
    ELSE
        RAISE NOTICE 'Columna address_line_2 ya existe';
    END IF;
END $$;

-- Agregar recipient_name si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'user_addresses'
        AND column_name = 'recipient_name'
    ) THEN
        ALTER TABLE public.user_addresses ADD COLUMN recipient_name TEXT;
        RAISE NOTICE 'Columna recipient_name agregada';
    ELSE
        RAISE NOTICE 'Columna recipient_name ya existe';
    END IF;
END $$;

-- =====================================================
-- PASO 3: VERIFICAR POLÍTICAS RLS ACTUALES
-- =====================================================

SELECT
    'POLÍTICAS RLS:' as info,
    policyname,
    cmd,
    qual
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'user_addresses'
ORDER BY policyname;

-- =====================================================
-- PASO 4: PROBAR INSERCIÓN CON LA ESTRUCTURA CORRECTA
-- =====================================================

-- Verificar estructura después de agregar columnas
SELECT
    'ESTRUCTURA DESPUÉS:' as info,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'user_addresses'
ORDER BY ordinal_position;

-- Intentar insertar una dirección de prueba
INSERT INTO public.user_addresses (
    user_id,
    street,
    city,
    state,
    postal_code,
    country,
    is_active,
    address_line_1,
    recipient_name
) VALUES (
    '7972685f-06ac-4ffb-8442-c8bed2aa76f8',
    'Avenida Reforma 123',
    'Ciudad de México',
    'CDMX',
    '06500',
    'México',
    true,
    'Avenida Reforma 123',
    'Juan Pérez'
) ON CONFLICT DO NOTHING;

-- Verificar que se insertó
SELECT
    'DIRECCIÓN INSERTADA:' as info,
    id,
    street,
    city,
    recipient_name
FROM public.user_addresses
WHERE user_id = '7972685f-06ac-4ffb-8442-c8bed2aa76f8'
ORDER BY created_at DESC
LIMIT 1;

-- =====================================================
-- PASO 5: LIMPIEZA (eliminar dirección de prueba)
-- =====================================================

-- Eliminar la dirección de prueba
DELETE FROM public.user_addresses
WHERE street = 'Avenida Reforma 123'
AND user_id = '7972685f-06ac-4ffb-8442-c8bed2aa76f8';

-- Verificar que se eliminó
SELECT
    'TOTAL DIRECCIONES DESPUÉS:' as info,
    COUNT(*) as count
FROM public.user_addresses
WHERE user_id = '7972685f-06ac-4ffb-8442-c8bed2aa76f8';
