-- TEST FINAL: Crear una dirección de prueba
-- Para verificar que todo funciona correctamente

SELECT
    'ANTES DE CREAR:' as info,
    COUNT(*) as direcciones_existentes
FROM public.user_addresses
WHERE user_id = auth.uid();

-- Crear dirección de prueba
INSERT INTO public.user_addresses (
    user_id,
    street,
    city,
    state,
    postal_code,
    country,
    is_default
) VALUES (
    auth.uid(),
    'Avenida Principal 123',
    'Ciudad de México',
    'CDMX',
    '06500',
    'México',
    true
);

-- Verificar que se creó
SELECT
    'DESPUÉS DE CREAR:' as info,
    COUNT(*) as direcciones_totales
FROM public.user_addresses
WHERE user_id = auth.uid();

-- Mostrar la dirección creada
SELECT
    'DIRECCIÓN CREADA:' as info,
    street,
    city,
    state,
    postal_code,
    is_default
FROM public.user_addresses
WHERE user_id = auth.uid()
ORDER BY created_at DESC
LIMIT 1;
