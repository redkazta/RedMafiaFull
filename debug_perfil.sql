-- DEBUG: Verificar estado del perfil del usuario

-- Ver si el perfil existe
SELECT
    id,
    email,
    first_name,
    last_name,
    display_name,
    created_at,
    updated_at
FROM public.user_profiles
WHERE id = '4bdd6662-11ff-4346-9110-a6567826d840';

-- Ver si hay múltiples perfiles (esto causaría conflicto)
SELECT
    COUNT(*) as total_profiles,
    COUNT(DISTINCT id) as unique_ids
FROM public.user_profiles
WHERE id = '4bdd6662-11ff-4346-9110-a6567826d840';

-- Ver todas las políticas RLS activas
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'user_profiles'
ORDER BY policyname;

-- Ver si el usuario existe en auth.users
SELECT
    id,
    email,
    created_at,
    last_sign_in_at
FROM auth.users
WHERE id = '4bdd6662-11ff-4346-9110-a6567826d840';

-- Ver triggers activos
SELECT
    event_object_table,
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers
WHERE event_object_table = 'user_profiles'
OR event_object_table = 'auth.users';
