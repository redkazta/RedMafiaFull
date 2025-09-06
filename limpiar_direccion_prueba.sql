-- LIMPIAR DIRECCIÓN DE PRUEBA
-- Eliminar la dirección que se creó sin user_id

DELETE FROM public.user_addresses
WHERE street = 'Calle de Prueba 456'
AND user_id IS NULL;

-- Verificar que se eliminó
SELECT
    'LIMPIEZA COMPLETADA:' as info,
    COUNT(*) as direcciones_restantes
FROM public.user_addresses
WHERE user_id IS NULL;
