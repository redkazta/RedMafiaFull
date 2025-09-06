-- TEST SENCILLO DE auth.uid()
-- Para verificar si el problema es con la autenticación

-- Verificar si hay usuario autenticado
SELECT
    'USUARIO AUTENTICADO:' as info,
    CASE
        WHEN auth.uid() IS NOT NULL THEN 'SÍ - ' || auth.uid()::text
        ELSE 'NO - auth.uid() es NULL'
    END as auth_status;

-- Verificar usuarios en la tabla auth.users
SELECT
    'USUARIOS EN SISTEMA:' as info,
    COUNT(*) as total_users,
    array_agg(email) as emails
FROM auth.users;

-- Intentar una consulta simple con auth.uid()
SELECT
    'TEST CONSULTA CON auth.uid():' as info,
    COUNT(*) as direcciones_usuario
FROM public.user_addresses
WHERE user_id = auth.uid();

-- Mostrar el auth.uid() actual
SELECT
    'AUTH.UID ACTUAL:' as info,
    auth.uid() as current_user_id;
