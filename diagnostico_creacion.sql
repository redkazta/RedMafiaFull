-- DIAGNÓSTICO DETALLADO DE CREACIÓN DE DIRECCIONES

-- =====================================================
-- 1. VERIFICAR USUARIO ACTUAL
-- =====================================================

SELECT
    'USUARIO ACTUAL:' as info,
    id as user_id,
    email
FROM auth.users
WHERE id = auth.uid();

-- =====================================================
-- 2. VERIFICAR POLÍTICAS RLS
-- =====================================================

SELECT
    'POLÍTICAS ACTIVAS:' as info,
    policyname,
    cmd,
    qual
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'user_addresses';

-- =====================================================
-- 3. CONTAR DIRECCIONES ANTES
-- =====================================================

SELECT
    'ANTES DE INSERTAR:' as info,
    COUNT(*) as total_direcciones
FROM public.user_addresses;

-- =====================================================
-- 4. INTENTAR INSERTAR CON ERROR HANDLING
-- =====================================================

DO $$
DECLARE
    user_uuid UUID;
    insert_result TEXT;
BEGIN
    -- Obtener el ID del usuario actual
    SELECT id INTO user_uuid FROM auth.users WHERE id = auth.uid();

    RAISE NOTICE 'Usuario ID: %', user_uuid;

    -- Intentar insertar
    BEGIN
        INSERT INTO public.user_addresses (
            user_id,
            street,
            city,
            state,
            postal_code,
            country,
            is_default
        ) VALUES (
            user_uuid,
            'Calle de Prueba 456',
            'Ciudad de Prueba',
            'Estado de Prueba',
            '12345',
            'México',
            false
        );

        insert_result := 'INSERT EXITOSO';
        RAISE NOTICE 'Insert exitoso para usuario: %', user_uuid;

    EXCEPTION
        WHEN OTHERS THEN
            insert_result := 'ERROR EN INSERT: ' || SQLERRM;
            RAISE NOTICE 'Error en insert: %', SQLERRM;
    END;

    -- Mostrar resultado
    RAISE NOTICE 'Resultado: %', insert_result;
END $$;

-- =====================================================
-- 5. CONTAR DIRECCIONES DESPUÉS
-- =====================================================

SELECT
    'DESPUÉS DE INSERTAR:' as info,
    COUNT(*) as total_direcciones
FROM public.user_addresses;

-- =====================================================
-- 6. MOSTRAR DIRECCIÓN CREADA (SI EXISTE)
-- =====================================================

SELECT
    'DIRECCIÓN CREADA:' as info,
    id,
    user_id,
    street,
    city,
    state
FROM public.user_addresses
WHERE street = 'Calle de Prueba 456'
ORDER BY created_at DESC
LIMIT 1;
