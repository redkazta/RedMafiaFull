-- CORRECCIÓN FINAL PARA user_addresses
-- Soluciona los errores de foreign key y políticas existentes

-- =====================================================
-- PASO 1: OBTENER UN USER_ID REAL
-- =====================================================

SELECT
    'USER_ID REAL:' as info,
    id as user_id,
    email
FROM auth.users
ORDER BY created_at DESC
LIMIT 1;

-- =====================================================
-- PASO 2: VERIFICAR POLÍTICAS EXISTENTES
-- =====================================================

SELECT
    'POLÍTICAS ACTUALES:' as info,
    policyname,
    cmd
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'user_addresses'
ORDER BY policyname;

-- =====================================================
-- PASO 3: CORREGIR POLÍTICAS (SOLO SI ES NECESARIO)
-- =====================================================

-- Eliminar política específica si existe
DROP POLICY IF EXISTS "user_addresses_access" ON public.user_addresses;

-- Crear política única que cubra todos los casos
CREATE POLICY "user_addresses_policy" ON public.user_addresses
FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- PASO 4: VERIFICAR ESTRUCTURA FINAL
-- =====================================================

SELECT
    'ESTRUCTURA FINAL:' as info,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'user_addresses'
ORDER BY ordinal_position;

-- =====================================================
-- PASO 5: PRUEBA DE INSERCIÓN CON USER_ID REAL
-- =====================================================

-- Obtener el primer user_id real
DO $$
DECLARE
    real_user_id UUID;
BEGIN
    SELECT id INTO real_user_id
    FROM auth.users
    ORDER BY created_at DESC
    LIMIT 1;

    -- Insertar dirección de prueba
    INSERT INTO public.user_addresses (
        user_id,
        street,
        city,
        state,
        postal_code,
        country,
        is_active,
        address_line_1,
        recipient_name,
        is_default
    ) VALUES (
        real_user_id,
        'Calle de Prueba 123',
        'Ciudad de México',
        'CDMX',
        '06500',
        'México',
        true,
        'Calle de Prueba 123',
        'Usuario de Prueba',
        false
    ) ON CONFLICT DO NOTHING;

    RAISE NOTICE 'Dirección de prueba insertada para user_id: %', real_user_id;
END $$;

-- =====================================================
-- PASO 6: VERIFICAR INSERCIÓN
-- =====================================================

SELECT
    'DIRECCIÓN INSERTADA:' as info,
    COUNT(*) as total_addresses
FROM public.user_addresses;

-- Mostrar la dirección insertada
SELECT
    'DETALLE DIRECCIÓN:' as info,
    ua.street,
    ua.city,
    ua.recipient_name,
    au.email as user_email
FROM public.user_addresses ua
JOIN auth.users au ON ua.user_id = au.id
ORDER BY ua.created_at DESC
LIMIT 1;

-- =====================================================
-- PASO 7: LIMPIEZA (opcional - descomenta si quieres)
-- =====================================================

-- DESCOMENTA ESTAS LÍNEAS SI QUIERES LIMPIAR LA DIRECCIÓN DE PRUEBA:
/*
DELETE FROM public.user_addresses
WHERE street = 'Calle de Prueba 123';

SELECT 'LIMPIEZA COMPLETADA:' as info, COUNT(*) as remaining_addresses
FROM public.user_addresses;
*/

-- =====================================================
-- PASO 8: VERIFICACIÓN FINAL DE POLÍTICAS
-- =====================================================

SELECT
    'POLÍTICAS FINALES:' as info,
    policyname,
    cmd,
    qual
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'user_addresses'
ORDER BY policyname;
